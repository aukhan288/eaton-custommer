import React, {useEffect, useState, useMemo} from 'react';
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
import {API_BASE_URL} from '../../constants/Url';
import {useTheme, BaseColor} from '../../config/theme';
import { GridProduct } from '../../component';
import Loading from '../Common/Loading';
import NotFound from '../Common/NotFound';
import {
  MainSwipper,
  SubSwipper,
  Category,
  Header,
  HorizontalProduct,
} from '../../component';

const {hieght, width }=Dimensions.get('screen');
const Offer = ({navigation}) => {
  const theme = useTheme();
  const [isEndProductList, setIsEndProductList] = useState(false);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [category, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);

  const fetchDealOfTheDayProductAPI = () => {
    console.log('iiiiiiiiiiii',activeCategory);
    
    // if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL =
        API_BASE_URL + `fetchProductsByCategory.php?category=${activeCategory}&currentPage=${currentPage}`;
        console.log('ggggggggg',fetchProductAPIURL);
        
      fetch(fetchProductAPIURL, {
        method: 'POST',
      })
        .then(response => response.json())
        .then(response => {
          setProducts([...products, ...response]);
          if (response.length > 0) {
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
          setLoading(false);
        });
    // } else {
    // }
  };
  const fetchCategory = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchCategoryList.php`;
    fetch(fetchProductAPIURL, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(response => {
        let cat={category_id:0,category_img:'https://ea8on-admin.assignmentmentor.co.uk/uploads/category/thump_1731317365.webp',category_name:'All'}
        console.log('======>>>>>>>>>>',response);
        cat=[cat,...response]
        setCategory(cat);
      });
  };
  useEffect(() => {
    fetchDealOfTheDayProductAPI()
    setProducts([])
  },[activeCategory])
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      fetchCategory();
      if (internetState.isConnected === true) {
        fetchDealOfTheDayProductAPI();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [currentPage]);

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const renderLoader = () => {
    return isLoadingMoreItem ? (
      <View style={{marginVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="large" color={BaseColor.primary} />
        <Text style={{fontSize: 12}}>Loading Kirana</Text>
      </View>
    ) : null;
  };
  const CatItem = ({item}) => (
    
    <Pressable
    onPress={()=>{setActiveCategory(item?.category_id)}} 
    style={{marginHorizontal:10, paddingBottom:10, borderBottomWidth:activeCategory==item?.category_id?4:0, borderBottomColor:'red', alignItems:'center'}}>
       <Image source={{uri:item?.category_img}} style={{height:50, width:50}} />
      <Text style={styles.title}>{item?.category_name}</Text>
    </Pressable>
  );
  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchDealOfTheDayProductAPI();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };


  if (isInternetConnected) {
    return (
      <NetworkError reloadPage={reloadPage} />
    );
  }

  if(loading){
    return <Loading/>
  }

  if(products.length==0){
    return <NotFound text="No Product Found" />
  }

  return (
    <SafeAreaView
      style={{backgroundColor: theme.theme.darkBackground, flex: 1, width:width,paddingBottom:40}}>
      <FlatList
        data={category}
        horizontal={true}
        renderItem={({item}) => <CatItem item={item} />}
        keyExtractor={item => item.id}
      />
      <View style={{marginTop:20}}></View>
      <GridProduct product={products} currentPage={currentPage} setCurrentPage={setCurrentPage} isLoadingMoreItem={isLoadingMoreItem} />
      {/* <View style={{marginVertical:70}}></View> */}
    </SafeAreaView>
  );
};

export default Offer;

const styles = StyleSheet.create({});
