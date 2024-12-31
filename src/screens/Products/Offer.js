import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
  FlatList,
  Image,
  Pressable
} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import NetworkError from '../Common/NetworkError';
import { API_BASE_URL } from '../../constants/Url';
import { useTheme, BaseColor } from '../../config/theme';
import { GridProduct } from '../../component';
import Loading from '../Common/Loading';
import NotFound from '../Common/NotFound';
import {useIsFocused} from '@react-navigation/native';

const { height, width } = Dimensions.get('screen');

const Offer = ({ navigation }) => {
  const theme = useTheme();
  const isVisible = useIsFocused();
  const [isEndProductList, setIsEndProductList] = useState(false);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [category, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  
  // Fetch Deal of the Day Products by category
  const fetchDealOfTheDayProductAPI = () => {
    console.log('gggggggggggggg')
    
    // if (isLoadingMoreItem || isEndProductList) return; // Prevent unnecessary fetches

    // setLoadingMoreItem(true);  // Indicate loading is in progress
    // const fetchProductAPIURL = API_BASE_URL + `fetchProductsByCategory.php?category=${activeCategory}&currentPage=${currentPage}`;
    const fetchProductAPIURL = API_BASE_URL + `products`;
    console.log('Fetching URL:', fetchProductAPIURL);

    fetch(fetchProductAPIURL,{
      method: 'GET', // Specify the HTTP method (GET by default)
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // This is just an example; add your own headers
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log('ppppppppppp', response);
        
        if (response?.data?.length === 0) {
          setIsEndProductList(true); // Mark end of list if no products are returned
        }
        let data = response?.data?.filter(item => {
          return !products.some(p => p?.product_id === item?.product_id);
        });
        

        setProducts(prevProducts => [...prevProducts, ...data]);  // Append new products
        setLoadingMoreItem(false);  // Reset loading state
        setLoading(false);  // If initial load
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoadingMoreItem(false);
        setLoading(false);
      });
  };

  // Fetch categories
  const fetchCategory = () => {
    const fetchCategoryAPIURL = API_BASE_URL + `fetchCategoryList.php`;
    fetch(fetchCategoryAPIURL, { method: 'POST' })
      .then(response => response.json())
      .then(response => {
        // Prepend the "All" category to the categories list
        const defaultCategory = {
          category_id: 0,
          category_img: null,
          category_name: 'All'
        };
        setCategory([defaultCategory, ...response]);  // Set categories
      });
  };

  useEffect(() => {
    
    // fetchCategory();

    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected) {
        fetchDealOfTheDayProductAPI();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [currentPage]); // Refetch when page changes

  // Reset products when active category changes
  useEffect(() => {
    setProducts([]);  // Clear products array when category changes
    setCurrentPage(1);  // Reset page to 1
    setIsEndProductList(false);  // Reset "end of list" flag
    fetchDealOfTheDayProductAPI();
  }, [isVisible]); // Trigger when activeCategory changes activeCategory

  // Load more items when reaching the end of the list
  const loadMoreItem = () => {
    if (!isEndProductList && !isLoadingMoreItem) {
      setCurrentPage(prevPage => prevPage + 1);  // Increment page number
    }
  };

  const CatItem = ({ item }) => (
    <Pressable
      onPress={() => setActiveCategory(item?.category_id)}
      style={{
        marginHorizontal: 10,
        // paddingBottom: 10,
        borderBottomWidth: activeCategory === item?.category_id ? 4 : 0,
        borderBottomColor: 'red',
        alignItems: 'center'
      }}
    >
      {item?.category_name=='All'?
      <Image source={require('../../assets/image/all.png')} style={{ height: 50, width: 50, borderRadius: 100 }} />
      :<Image source={{ uri:  item?.category_img }} style={{ height: 50, width: 50, borderRadius: 100 }} />
      }
      <Text style={styles.title}>{item?.category_name}</Text>
    </Pressable>
  );

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);

    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected) {
        fetchDealOfTheDayProductAPI();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  };

  const renderLoader = () => {
    return isLoadingMoreItem ? 
      <View style={{ marginVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={BaseColor.primary} />
        <Text style={{ fontSize: 12 }}>Loading more products...</Text>
      </View>
     : null;
  };

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  // Display when no products found
  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.theme.darkBackground, flexDirection: 'column',  flex:1,  }}>
      <View style={{ width: width }}>
        <FlatList
          data={category}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          renderItem={({ item }) => <CatItem item={item} />}
          keyExtractor={item => item.category_id.toString()}
        />
      </View>

      <View style={{ marginTop: 20 }} />
      {products?.length > 0 ? 
        <GridProduct
          product={products}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoadingMoreItem={isLoadingMoreItem}
          loadMore={loadMoreItem}  // Trigger load more
        />
       : 
        <NotFound text="No Product Found" />
      }

      {/* {renderLoader()}  */}
      <View style={{marginBottom:50}}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Offer;
