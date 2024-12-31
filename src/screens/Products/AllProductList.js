import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import {MatrixProduct} from '../../component';
import Loading from '../Common/Loading';
import NotFound from '../Common/NotFound';

const AllProductList = ({navigation}) => {
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
        API_BASE_URL + `productList.php?currentPage=${currentPage}`;
      fetch(fetchProductAPIURL, {
        method: 'POST',
      })
        .then(response => response.json())
        .then(response => {
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
        {console.log('*******',products)}
      <MatrixProduct
        product={products}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        isLoadingMoreItem={isLoadingMoreItem}
      />
    </SafeAreaView>
  );
};

export default AllProductList;
