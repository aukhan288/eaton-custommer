import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ToastAndroid,
  FlatList,
  Dimensions,
  Pressable
} from 'react-native';
import {Card, Button, Subheading} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';


import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';

import * as DeliveryDateTimeAction from '../../store/actions/DeliveryDateTimeAction';
import {API_BASE_URL} from '../../constants/Url';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BaseColor, useTheme} from '../../config/theme';
import {PaymentList, SubHeader} from '../../component';
import Loading from '../Common/Loading';
import {useTranslation} from 'react-i18next';
import { CardField, StripeProvider } from '@stripe/stripe-react-native';
const PlaceOrderStepOne = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation()
  const [paymentList, setPaymentList] = useState([]);

  const [timeslot, setTimeslot] = React.useState(null);
  const [deliveryDate, setDeliveryDate] = React.useState(null);
  const [timeslotList, setTimeslotList] = useState([]);
  const [deliveryDateList, setDeliveryDateList] = useState([]);

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const [defaultAddress, setDefaultAddress] = useState(false);
  const [addressTitle, setAddressTitle] = useState('');
  const [addressDescription, setAddressDescription] = useState('');
  const [areaStatus, setAreaStatus] = useState(0);

  const [isPaymentMethodeSelect, setIsPaymentMethodeSelect] = useState(false);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publishableKey, setPublishableKey] = useState('');

  var dateTimeArray = [];

  const dispatch = useDispatch();

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'paymentList.php';
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
        setPaymentList(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiDefaultAddressCall = () => {
    var apiDefaultAddressURL = API_BASE_URL + 'fetchDefaultAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(apiDefaultAddressURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.address.length == 1) {
          if (response.address[0].area_status == 1) {
            setDefaultAddress(true);
          }

          setAddressTitle(
            response.address[0].addressType + ' - ' + response.address[0].area,
          );

          setAddressDescription(
            response.address[0].address_name +
              ', ' +
              response.address[0].home_number +
              ', ' +
              response.address[0].landmark,
          );

          setAreaStatus(response.address[0].area_status);
        } else {
          setDefaultAddress(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiTimeslotCall = () => {
    setTimeslotList([]);
    var authAPIURL = API_BASE_URL + 'fetchTimeslot.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        deliveryDate: deliveryDate,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.result == 'true') {
          setTimeslotList(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiDeliveryDateCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchDeliveryDates.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.result == 'true') {
          setDeliveryDateList(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const setDeliveryDateFetchTimeslot = useCallback(ddate => {
    dispatch(DeliveryDateTimeAction.setDeliveryDate(ddate)), setTimeslot(null);
  });

  useEffect(() => {
    if (deliveryDate != null) {
      apiTimeslotCall();
    }
  }, [deliveryDate]);
  // const fetchPublishableKey = async () => {
  //   const key = await fetchKey(); // fetch key from your server here
  //   setPublishableKey(key);
  // };

  // useEffect(() => {
  //   fetchPublishableKey();
  // }, []);
  const setDeliveryDateAndTimeslot = useCallback(timeslot => {
    setTimeslot(timeslot), dateTimeArray.push(deliveryDate, timeslot);
    dispatch(DeliveryDateTimeAction.setDeliveryDateTime(dateTimeArray));
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        apiDefaultAddressCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [paymentList, addressTitle]);

  useEffect(() => {
    apiDeliveryDateCall();
  }, []);

  const reloadPage = () => {
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
        apiDefaultAddressCall();
        apiDeliveryDateCall();
      } else {
        setIsInternetConnected(true);
        setLoading(false);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });

    unsubscribe();
  };

  const paymentItem = ({item}) => (
    <PaymentList
      id={item.id}
      img={item.img}
      title={item.title}
      description={item.description}
      status={item.status}
      api_key={item.api_key}
      setIsPaymentMethodeSelect={() => setIsPaymentMethodeSelect(true)}
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
      <>
        <FlatList
          data={paymentList}
          renderItem={paymentItem}
          key={item => item.id}
          keyExtractor={item => item.id}
          style={{marginBottom: 50}}
          ListHeaderComponent={
            <>
              {/* <SubHeader title={t('delivery_date_timeslot')} /> */}
              {/* <FlatList
                data={deliveryDateList}
                numColumns={3}
                showsHorizontalScrollIndicator={false}
                style={styles.flatList}
                renderItem={({item}) => (
                  <Card
                    onPress={() => {
                      setDeliveryDate(item.deliveryDate);
                      setTimeslot(null);
                      setDeliveryDateFetchTimeslot(item.deliveryDate);
                    }}
                    style={[
                      styles.card,
                      {
                        backgroundColor: theme.theme.background,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.text,
                        {
                          color:
                            item.deliveryDate == deliveryDate
                              ? theme.theme.title
                              : theme.theme.text,

                          fontFamily:
                            item.deliveryDate == deliveryDate
                              ? 'JostMedium'
                              : 'JostRegular',
                        },
                      ]}>
                      {item.deliveryDate}
                    </Text>
                  </Card>
                )}
              /> */}

              {/* <SubHeader title={t('time_slot')} /> */}

              {/* <FlatList
                data={timeslotList}
                showsVerticalScrollIndicator={false}
                // numColumns={2}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.flatList}
                renderItem={({item}) => (
                  <Card
                    onPress={() => {
                      setTimeslot(item.mintime + ' - ' + item.maxtime);
                      setDeliveryDateAndTimeslot(
                        `${item.mintime} - ${item.maxtime}`,
                      );
                    }}
                    style={[
                      styles.timeCard,
                      {
                        backgroundColor: theme.theme.background,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.text,
                        {
                          color:
                            item.mintime + ' - ' + item.maxtime == timeslot
                              ? theme.theme.title
                              : theme.theme.text,

                          fontFamily:
                            item.mintime + ' - ' + item.maxtime == timeslot
                              ? 'JostMedium'
                              : 'JostRegular',
                        },
                      ]}>
                      {`${item.mintime} - ${item.maxtime}`}
                    </Text>
                  </Card>
                )}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                  <Card
                    style={[
                      styles.emptyTimeContainer,
                      {
                        backgroundColor: theme.theme.background,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.emptyTimeText,
                        {
                          color: theme.theme.title,
                        },
                      ]}>
                      {t('select_date_and_get_time_slot')}
                    </Text>
                  </Card>
                }
              /> */}

              <SubHeader title={t('delivery_address')} />

              <View style={styles.areaContainer}>
                {areaStatus ? (
                  <Card
                    style={[
                      styles.areaCard,
                      {backgroundColor: theme.theme.background},
                    ]}>
                    <Card.Content style={styles.areaCardContent}>
                      <View style={styles.areaAddressContainer}>
                        <Subheading style={[styles.areaSubheading, {color:theme.theme.title}]}>
                          <Ionicons name="location" size={18} /> {addressTitle}
                        </Subheading>
                        <Text
                          style={[
                            styles.areaText,
                            {color: theme.theme.textLight},
                          ]}
                          numberOfLines={1}>
                          {addressDescription}
                        </Text>
                      </View>
                      <Ionicons
                        name="arrow-forward-circle"
                        style={[styles.icon, {color: BaseColor.danger}]}
                        size={24}
                        onPress={() => navigation.navigate('Address')}
                      />
                    </Card.Content>
                  </Card>
                ) : (
                  <Card
                    style={[
                      styles.areaCard,
                      {backgroundColor: theme.theme.background},
                    ]}>
                    <Card.Content style={styles.areaCardContent}>
                      <View style={styles.areaAddressContainer}>
                        <Subheading style={styles.areaSubheading}>
                          <Ionicons name="location" size={18} />{' '}
                          {t('no_address_available')}
                        </Subheading>
                        <Text
                          style={[
                            styles.areaText,
                            {color: theme.theme.textLight},
                          ]}
                          numberOfLines={1}>
                          {t('add_address')}
                        </Text>
                      </View>
                      <Ionicons
                        name="arrow-forward-circle"
                        style={[styles.icon, {color: BaseColor.dangerLight}]}
                        size={24}
                        onPress={() => navigation.navigate('Address')}
                      />
                    </Card.Content>
                    
                  </Card>
                )}
              </View>

              <SubHeader title={t('payment_method')} />
              
            </>
          }
        />
     
        <View style={styles.btnConatiner}>
          <Button
            allowFontScaling={false}
            mode="text"
            theme={{colors: {primary: BaseColor.primary}}}
            style={styles.btnStyle}
            onPress={() => {
               defaultAddress
                    ? isPaymentMethodeSelect
                      ? navigation.navigate('PlaceOrder')
                      : ToastAndroid.show(
                          'Choose Payment Method',
                          ToastAndroid.SHORT,
                        )
                    : ToastAndroid.show(
                        'Choose Deliverable Address',
                        ToastAndroid.SHORT,
                      )
            }}
            uppercase={false}>
            {t('place_order')}
          </Button>
        </View>
      </>
    
    </SafeAreaView>
  );
};

export default PlaceOrderStepOne;

const styles = StyleSheet.create({
  flatList: {
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 10,
  },
  card: {
    width: '31%',
    marginRight: 10,
    padding: 8,
    borderColor: BaseColor.success,
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    fontFamily: 'JostRegular',
    fontSize: 12,
  },
  timeCard: {
    marginRight: 10,
    padding: 8,
    borderColor: BaseColor.success,
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 10,
  },

  emptyTimeContainer: {
    width: Dimensions.get('screen').width - 30,
    marginRight: 10,
    padding: 8,
    borderColor: BaseColor.success,
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 10,
  },
  emptyTimeText: {fontFamily: 'JostRegular'},

  areaContainer: {
    borderColor: BaseColor.danger,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 15,
    marginTop: 10,
  },
  areaCard: {
    borderRadius: 5,
  },
  areaCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaAddressContainer: {
    flexDirection: 'column',
  },
  areaSubheading: {
    fontFamily: 'JostRegular',
  },
  areaText: {
    fontFamily: "JostMedium",
  },
  areaIcon: {
    // Additional styles for icon if needed
  },

  btnConatiner: {
    flexDirection: 'column',
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: BaseColor.primary,
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
  },
  btnStyle: {
    backgroundColor: 'white',
    alignSelf: 'center',
    marginVertical: 6,
  },
});
