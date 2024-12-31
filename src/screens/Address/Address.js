import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';

import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import {useTranslation} from 'react-i18next';
import {AddressList} from '../../component';
import NotFound from '../Common/NotFound';
import Loading from '../Common/Loading';

const Address = ({navigation, route}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const isVisible = useIsFocused();
  const [addressList, setAddressList] = useState([]);
  const [isAddressAvailable, setIsAddressAvailable] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'addressList.php';
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
        if (response.addresslist.length > 0) {
          setIsAddressAvailable(true);
          setAddressList(response.addresslist);
        } else {
          setAddressMsg(response.msg);
          setIsAddressAvailable(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.log('error Address', error);
      });
  };

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    setIsAddressAvailable(false);
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

  useEffect(() => {
    apiCall();
  }, [isVisible]);

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

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  const addressItem = ({item}) => (
    <AddressList
      address_id={item.id}
      houseNo={item.home_number}
      area={item.area}
      landMark={item.landmark}
      addressType={item.addressType}
      status={item.status}
      addressName={item.address_name}
      deliveryCharge={item.deliveryCharge}
      areaStatus={item.area_status}
    />
  );

  return (
    <SafeAreaView
      style={{backgroundColor: theme.theme.darkBackground, flex: 1}}>
      {addressList.length == 0 && <NotFound text={addressMsg} />}
      <FlatList
        data={addressList}
        renderItem={addressItem}
        key={item => item.id}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{marginTop: 5}}
      />

      <FAB
        style={styles.fab}
        color="white"
        label={t('add_address')}
        uppercase={false}
        theme={{colors: {primary: BaseColor.primary}}}
        icon="map-marker-radius"
        onPress={() => navigation.navigate('AddAddress')}
      />
    </SafeAreaView>
  );
};

export default Address;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: BaseColor.primary,
  },
});
