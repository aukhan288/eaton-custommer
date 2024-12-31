import React, {useState, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {Button} from 'react-native-paper';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {useTheme, BaseColor} from '../../config/theme';
import Loading from '../Common/Loading';
import NotFound from '../Common/NotFound';
import {HorizontalProduct, VerticalProduct} from '../../component';

const PopularProductList = ({navigation}) => {
  const theme = useTheme();

  const [isEndProductList, setIsEndProductList] = useState(false);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL =
        API_BASE_URL + `favouriteProductList.php?currentPage=${currentPage}`;
      fetch(fetchProductAPIURL, {
        method: 'POST',
      })
        .then(response => response.json())
        .then(response => {
          console.log('HorizontalProduct123', response);

          if (response.length > 0) {
            setProducts([...products, ...response]);
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchProductApi();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [currentPage]);

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        fetchProductApi();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (products.length == 0) {
    return <NotFound text="No Product Found" />;
  }

  return (
    <SafeAreaView
      style={{backgroundColor: theme.theme.darkBackground, flex: 1}}>
      <VerticalProduct
        product={products}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoadingMoreItem={isLoadingMoreItem}
        marginBottom={0}
      />
    </SafeAreaView>
  );
};

export default PopularProductList;
