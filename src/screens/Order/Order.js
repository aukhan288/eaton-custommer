import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import {OrderList} from '../../component';
import Loading from '../Common/Loading';
import NotFound from '../Common/NotFound';

const Order = ({navigation}) => {
  const theme = useTheme();

  const isVisible = useIsFocused();
  const dispatch = useDispatch();

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [orderList, setOrderList] = useState([]);
  const [isOrderListAvailable, setIsOrderListAvailable] = useState(false);
  const [orderMsg, setOrderMsg] = useState('');

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'orderList.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.orderlist.length > 0) {
          setOrderList(response.orderlist);
          setIsOrderListAvailable(true);
        } else {
          setOrderMsg(response.msg);
          setIsOrderListAvailable(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [isVisible]);

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(false);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        ToastAndroid.show('Data Refreshed', ToastAndroid.SHORT);
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const renderItem = ({item}) => (
    <OrderList
      order_id={item.order_id}
      totalPaidAmt={item.totalPaidAmt}
      orderDate={item.orderDate}
      status={item.status}
    />
  );

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.theme.darkBackground}}>
      {orderList.length == 0 && <NotFound text={orderMsg} />}
      <FlatList
        data={orderList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
        keyExtractor={item => item.id}
        key={item => item.id}
      />
    </SafeAreaView>
  );
};

export default Order;
