import React, { useState, useEffect } from 'react';
import { SafeAreaView, ToastAndroid, StyleSheet, ScrollView, Pressable, Text, View, Image, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo'; // Ensure this is correctly installed
import { API_BASE_URL, BASE_URL } from '../../constants/Url';
import { BaseColor, useTheme } from '../../config/theme';
import Loading from '../Common/Loading'; // Make sure this is correctly imported
import NetworkError from '../Common/NetworkError'; // Ensure path is correct
import GridProduct from '../../component/Product/GridProduct/GridProduct'; // Ensure this is correctly imported
import {
  Category,
} from '../../component';
const {height, width}=Dimensions.get('screen');
const SubCategory = ({ route, navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isEndProductList, setIsEndProductList] = useState(false);
  const [subCategory, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategories] = useState(0);
  // Set dynamic header title based on category_name
  useEffect(() => {
    if (route.params && route.params.category_name) {
      navigation.setOptions({ title: route.params.category_name });
    }
  }, [route.params.category_name, navigation]);
  useEffect(() => {
    setProducts([]);  // Clear products array when category changes
    setCurrentPage(1);  // Reset page to 1
    setIsEndProductList(false);  // Reset "end of list" flag
    fetchDealOfTheDayProductAPI();
  }, [activeCategory]);
  const fetchDealOfTheDayProductAPI = () => {
    
    if (isLoadingMoreItem || isEndProductList) return; // Prevent unnecessary fetches

    setLoadingMoreItem(true);  // Indicate loading is in progress
    const fetchProductAPIURL = API_BASE_URL + `fetchProductsByCategory.php?category=${activeCategory}&currentPage=${currentPage}`;
    console.log('Fetching URL:', fetchProductAPIURL);

    fetch(fetchProductAPIURL, { method: 'POST' })
      .then(response => response.json())
      .then(response => {
        if (response.length === 0) {
          setIsEndProductList(true); // Mark end of list if no products are returned
        }
        let data = response.filter(item => {
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

  const fetchProductsByCategory = () => {
    if (isLoadingMoreItem || isEndOfList) return;

    setLoadingMoreItem(true);

    const fetchProductAPIURL = `${API_BASE_URL}productsByCategory/${route.params.category_id}/${selectedSubCategory}`;
    console.log('ccccccccccc',fetchProductAPIURL);
    
    // const fetchProductAPIURL = `${API_BASE_URL}fetchProductsByCategory.php?category=${route.params.category_id}&currentPage=${currentPage}`;
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
        console.log('ppppppppp',response?.data);
        
        // if (response.length === 0) {
        //   setIsEndOfList(true);
        // }

        setProducts(prevProducts => [...prevProducts, ...response?.data]);
        setLoadingMoreItem(false);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoadingMoreItem(false);
        setLoading(false);
      });
  };
  const fetchSubCategory = () => {
    if (isLoadingMoreItem || isEndOfList) return;

    setLoadingMoreItem(true);
console.log('mmmmmmmmmm',route.params)

    // const fetchProductAPIURL = `${API_BASE_URL}fetchProductsByCategory.php?category=${route.params.category_id}&currentPage=${currentPage}`;
    const fetchProductAPIURL = `${API_BASE_URL}sub-Category/${route?.params?.category_id}`
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
        setSubCategories(response?.data)
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoadingMoreItem(false);
        setLoading(false);
      });
  };

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    NetInfo.addEventListener(internetState => {
      if (internetState.isConnected) {
        fetchProductsByCategory();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected) {
        fetchSubCategory();
        fetchProductsByCategory();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
      }
    });
    unsubscribe();
  }, [route.params.category_id]);

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.theme.darkBackground }]}>
      <View style={{flexDirection: 'row', maxHeight:80, width:width,flex:1, marginBottom:20}}>
     {
  subCategory?.length > 0 && (
    <ScrollView horizontal>
      {subCategory.map((item) => {
        return (
          <Pressable 
            key={item?.id} 
            style={{
              marginLeft: 10, 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center'
            }}
          >
            <Image
              style={{ height: 50, width: 50, borderRadius: 100 }}
              source={{ uri: BASE_URL + item?.img }}
            />
            <Text>{item?.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  )
}
  </View>

      <GridProduct
        product={products}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoadingMoreItem={isLoadingMoreItem}
        loadMore={() => {
          if (!isEndOfList) {
            setCurrentPage(prevPage => prevPage + 1);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default SubCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
