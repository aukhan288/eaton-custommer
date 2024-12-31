import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL, BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import {NotificationList} from '../../component';
import Loading from '../Common/Loading';
import NotFound from '../Common/NotFound';

const Notification = ({navigation}) => {
  const theme = useTheme();

  const isVisible = useIsFocused();
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [notificationList, setNotificationList] = useState([]);
  const [notificationMsg, setNotificationMsg] = useState('');

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const apiCall = () => {
    // var authAPIURL = API_BASE_URL + 'fetchNotificationList.php';
    var authAPIURL = API_BASE_URL + 'notifications';
    var header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    fetch(authAPIURL, {
      method: 'GET',
      headers: header,
      // body: JSON.stringify({
      //   mobile: auth_mobile,
      //   token: token,
      // }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('nnnnnnnnn',response);
        
        if (response?.notifications?.length > 0) {
          setNotificationList(response.notifications);
        } else {
          setNotificationMsg(response.msg);
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const reloadPage = () => {
    setLoading(true);
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

  useEffect(() => {
    setLoading(true);
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

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  const renderItem = ({item}) => (
    <NotificationList
      title={item.title}
      message={item.msg}
      date={item.date}
      img={BASE_URL+item.img}
    />
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.theme.darkBackground}}>
      {notificationList == 0 && <NotFound text={notificationMsg} />}
      <FlatList
        data={notificationList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({});
