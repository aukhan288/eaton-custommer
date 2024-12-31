import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import {Card, Subheading, Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import {OrderItemList, SubHeader} from '../../component';
import Loading from '../Common/Loading';
import {useTranslation} from 'react-i18next';

const labels = ['Pending', 'Ready to Ship', 'Delivered'];

const TrackOrder = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation()
  var today = new Date();

  const isVisible = useIsFocused();

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const orderDetailsId = useSelector(
    state => state.OrderReducer.orderDetailsId,
  );

  const [orderItem, setOrderItem] = useState([]);

  const [date, setDate] = useState();
  const [qty, setQty] = useState();
  const [mode, setMode] = useState();
  const [status, setStatus] = useState();
  const [deliveryCharge, setDeliveryCharge] = useState();
  const [tax, setTax] = useState();
  const [total, setTotal] = useState();
  const [address, setAddress] = useState();
  const [coupon, setCoupon] = useState();
  const [totalDiscountAmt, setTotalDiscountAmt] = useState();

  const [usedWalletAmount, setUsedWalletAmount] = useState(0);

  const [serviceTaxAmt, setServiceTaxAmt] = useState();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [timeslot, setTimeslot] = useState('');
  const [cancelOrderMsg, setCancelOrderMsg] = useState();

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isOrderCancelled, setIsOrderCancelled] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [transactionId, setTransactionId] = useState('');

  const [deliveryBoyName, setDeliveryBoyName] = useState();
  const [deliveryBoyImg, setDeliveryBoyImg] = useState();
  const [deliveryBoyMobile, setDeliveryBoyMobile] = useState(0);

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'trackOrder.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        orderId: orderDetailsId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setOrderItem(response.orderItem);
        setDate(response.orderDate);
        setQty(response.quantity);
        setMode(response.paymentMethod);
        setTransactionId(response.transactionId);
        setStatus(parseInt(response.status));
        setDeliveryCharge(response.deliveryCharge);
        setTax(response.tax);
        setTotal(response.total);
        setAddress(response.address);
        setCoupon(response.couponAmt);
        setTotalDiscountAmt(response.totalDiscountAmt);
        setServiceTaxAmt(response.serviceTaxAmt);
        setDeliveryDate(response.deliveryDate);
        setTimeslot(response.timeslot);
        setCancelOrderMsg(response.cancelOrderMsg);

        setDeliveryBoyName(response.delivery_boy_name);
        setDeliveryBoyImg(response.delivery_boy_img);
        setDeliveryBoyMobile(response.delivery_boy_mobile);

        setUsedWalletAmount(response.usedWalletAmount);

        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    setIsOrderCancelled(false);
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
  }, [orderDetailsId, isOrderCancelled, isVisible]);

  const cancelOrder = () => {
    var authAPIURL = API_BASE_URL + 'cancelOrder.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        orderId: orderDetailsId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        ToastAndroid.show(response.msg, ToastAndroid.LONG);
        if (response.result == 'true') {
          setIsOrderCancelled(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    setIsOrderCancelled(false);
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
    setIsOrderCancelled(false);
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

  const renderItem = ({item}) => (
    <OrderItemList
      productImg={item.productImg}
      productName={item.productName}
      productPrice={item.productPrice}
      discount={item.discount}
      quantity={item.quantity}
      productVariation={item.productVariation}
    />
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.theme.darkBackground}}>
      <FlatList
        data={orderItem}
        renderItem={renderItem}
        keyExtractor={item => item.productId}
        key={item => item.productId}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <SubHeader title="Order Details" />
            <Card
              elevation={0}
              style={[
                styles.cardContainer,
                {backgroundColor: theme.theme.background},
              ]}>
              <Card.Content>
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.orderId,
                      {
                        color: theme.theme.title,
                      },
                    ]}
                    allowFontScaling={false}>
                    {t('order_id')}:{' '}
                    <Text
                      style={[
                        styles.orderId,
                        {
                          color: theme.theme.text,
                        },
                      ]}>
                      {orderDetailsId}
                    </Text>
                  </Text>
                  {status <= 2 ? (
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          'Cancel Order',
                          'Really want to cancel order',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => {},
                              style: 'cancel',
                            },
                            {text: 'OK', onPress: () => cancelOrder()},
                          ],
                        )
                      }>
                      <Text
                        style={[
                          styles.cancelOrderText,
                          {color: BaseColor.primary},
                        ]}
                        allowFontScaling={false}>
                        {t('cancel_order')}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('date')}
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('status')}
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('mode')}
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('txn_id')}
                    </Text>
                  </View>

                  <View style={{flex: 1}}>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      : {date}
                    </Text>
                    <Text
                      style={[
                        styles.valueText,
                        {color: theme.theme.text, color: BaseColor.primary},
                      ]}
                      allowFontScaling={false}>
                      : {status == 1 ? 'Pending' : null}
                      {status == 2 ? 'Processing' : null}
                      {status == 3 ? 'Completed' : null}
                      {status == 4 ? 'Cancelled' : null}
                    </Text>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      : {mode}
                    </Text>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      : {transactionId}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* when delivery boy assigned */}
            {status < 3 && deliveryBoyMobile > 0 ? (
              <>
                <SubHeader title="Delivery Driver Details" />
                <Card
                  elevation={0}
                  style={[
                    styles.cardContainer,
                    {backgroundColor: theme.theme.background},
                  ]}>
                  <Card.Content>
                    <View style={styles.avatarContainer}>
                      {console.log(deliveryBoyImg)}
                      
                     {deliveryBoyImg=='https://ea8on-admin.assignmentmentor.co.uk/'?
                        <Avatar.Image
                        size={64}
                        source={require('../../assets/image/user.png')}
                         theme={{colors: {primary: BaseColor.backgroundColor}}}
                         />
                     :
                     <Avatar.Image
                     size={64}
                     source={{
                       uri: deliveryBoyImg,
                      }}
                      theme={{colors: {primary: BaseColor.backgroundColor}}}
                      />
                    } 
                      <View style={styles.avatar}>
                        <Text
                          style={[styles.nameText, {color: theme.theme.text}]}>
                          {deliveryBoyName}
                        </Text>
                        <Text
                          style={[styles.mobileText, {color: theme.theme.text}]}
                          onPress={() => {
                            Linking.openURL(`tel:+92${deliveryBoyMobile}`);
                          }}>
                          {deliveryBoyMobile}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </>
            ) : null}

            <SubHeader title="Order Summery" />
            <Card
              elevation={0}
              style={{
                borderRadius: 0,
                backgroundColor: theme.theme.background,
                marginBottom: 15,
              }}>
              <Card.Content>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('subtotal')}
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('delivery')}
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('service_tax')}{' '}
                      <Text style={{fontSize: 12}}>{`(${tax}%)`}</Text>
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('coupon')}
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('wallet_amt')}
                    </Text>
                    <Text
                      style={[styles.labelText, {color: theme.theme.text}]}
                      allowFontScaling={false}>
                      {t('total')}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      :{' '}
                      <MaterialCommunityIcons
                        name="currency-gbp"
                        style={{fontSize: 14}}
                      />
                      {totalDiscountAmt}
                    </Text>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      :{' '}
                      <MaterialCommunityIcons
                        name="currency-gbp"
                        style={{fontSize: 14}}
                      />
                      {deliveryCharge > 0 ? deliveryCharge : 0}
                    </Text>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      :{' '}
                      <MaterialCommunityIcons
                        name="currency-gbp"
                        style={{fontSize: 14}}
                      />
                      {serviceTaxAmt}
                    </Text>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      :{' '}
                      <MaterialCommunityIcons
                        name="currency-gbp"
                        style={{fontSize: 14}}
                      />
                      {coupon > 0 ? coupon : 0}
                    </Text>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      :{' '}
                      <MaterialCommunityIcons
                        name="currency-gbp"
                        style={{fontSize: 14}}
                      />
                      {usedWalletAmount}
                    </Text>
                    <Text
                      style={[styles.valueText, {color: theme.theme.title}]}
                      allowFontScaling={false}>
                      :{' '}
                      <MaterialCommunityIcons
                        name="currency-gbp"
                        style={{fontSize: 14}}
                      />
                      {total}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    marginVertical: 15,
                    fontFamily: 'JostRegular',
                    color: theme.theme.text,
                    marginBottom: 3,
                  }}
                  allowFontScaling={false}>
                  {t('address')}:{' '}
                  <Text
                    style={{
                      fontFamily: 'JostMedium',
                      color: theme.theme.text,
                    }}>
                    {address}
                  </Text>
                </Text>
                {status == 3 || status == 4 ? null : (
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontFamily: 'JostRegular',
                        color: theme.theme.text,
                        marginBottom: 3,
                      }}
                      allowFontScaling={false}>
                      {t('delivery_date')}:{' '}
                      <Text
                        style={{
                          fontFamily: 'JostMedium',
                          color: theme.theme.text,
                        }}>
                        {deliveryDate}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'JostRegular',
                        color: theme.theme.text,
                        marginBottom: 3,
                      }}
                      allowFontScaling={false}>
                      {t('expected_time')}:{' '}
                      <Text
                        style={{
                          fontFamily: 'JostMedium',
                          color: theme.theme.text,
                        }}>
                        {timeslot}
                      </Text>
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>

            {cancelOrderMsg == 1 ? (
              <Subheading
              style={{margin: 15, fontSize: 14, marginBottom:20}}
              allowFontScaling={false}>
              {t('note')}:{' '}
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'JostMedium',
                  color: theme.theme.text,
                }}>
                {t(
                  'order_cancelled_successfully_if_you_already_paid_payment_will_be_refunded_in_5_7_working_days_ignore_if_already_refund',
                )}
              </Text>
            </Subheading>
            ) : null}

            <SubHeader title="Order Item List" />
          </>
        }
        // ListFooterComponent={
        //   status < 4 ? (
        //     <View
        //       style={{
        //         flexDirection: 'row',
        //         paddingTop: 15,
        //         marginLeft: 15,
        //       }}>
        //       <View style={{marginRight: 15}}>
        //         {status == 1 ? (
        //           <>
        //             <MaterialCommunityIcons
        //               name="check-circle"
        //               size={24}
        //               style={{marginTop: 15}}
        //               color={BaseColor.primary}
        //             />
        //             <View
        //               style={[
        //                 {
        //                   borderLeftWidth: 2,
        //                   alignSelf: 'center',
        //                   paddingVertical: 25,
        //                 },
        //                 {borderLeftColor: BaseColor.primary},
        //               ]}
        //             />
        //           </>
        //         ) : (
        //           <>
        //             <MaterialCommunityIcons
        //               name="checkbox-blank-circle-outline"
        //               size={24}
        //               color={BaseColor.label}
        //             />
        //             <View
        //               style={[
        //                 {
        //                   borderLeftWidth: 2,
        //                   alignSelf: 'center',
        //                   paddingVertical: 25,
        //                 },
        //                 {borderLeftColor: BaseColor.label},
        //               ]}
        //             />
        //           </>
        //         )}

        //         {status == 2 ? (
        //           <>
        //             <MaterialCommunityIcons
        //               name="check-circle"
        //               size={24}
        //               style={{marginTop: 15}}
        //               color={BaseColor.primary}
        //             />
        //             <View
        //               style={[
        //                 {
        //                   borderLeftWidth: 2,
        //                   alignSelf: 'center',
        //                   paddingVertical: 25,
        //                 },
        //                 {borderLeftColor: BaseColor.primary},
        //               ]}
        //             />
        //           </>
        //         ) : (
        //           <>
        //             <MaterialCommunityIcons
        //               name="checkbox-blank-circle-outline"
        //               size={24}
        //               color={BaseColor.label}
        //             />
        //             <View
        //               style={[
        //                 {
        //                   borderLeftWidth: 2,
        //                   alignSelf: 'center',
        //                   paddingVertical: 25,
        //                 },
        //                 {borderLeftColor: BaseColor.label},
        //               ]}
        //             />
        //           </>
        //         )}

        //         {status == 3 ? (
        //           <>
        //             <MaterialCommunityIcons
        //               name="check-circle"
        //               size={24}
        //               style={{marginTop: 15}}
        //               color={BaseColor.primary}
        //             />
        //           </>
        //         ) : (
        //           <>
        //             <MaterialCommunityIcons
        //               name="checkbox-blank-circle-outline"
        //               size={24}
        //               color={BaseColor.label}
        //             />
        //           </>
        //         )}
        //       </View>
        //       <View>
        //         {status == 1 ? (
        //           <View
        //             style={[
        //               {
        //                 padding: 10,
        //                 marginBottom: 40,
        //                 borderRadius: 5,
        //               },
        //               {
        //                 backgroundColor: BaseColor.primary,
        //               },
        //             ]}>
        //             <Text
        //               style={{
        //                 fontFamily: 'PoppinsMedium',
        //                 color: BaseColor.backgroundColor,
        //               }}>
        //               Pending{'  '}
        //             </Text>
        //           </View>
        //         ) : (
        //           <View
        //             style={[
        //               {
        //                 padding: 10,
        //                 marginBottom: 40,
        //                 borderRadius: 5,
        //               },
        //               {backgroundColor: BaseColor.primaryLight},
        //             ]}>
        //             <Text
        //               style={{
        //                 fontFamily: 'PoppinsMedium',
        //                 color: BaseColor.backgroundColor,
        //               }}>
        //               Pending{'  '}
        //             </Text>
        //           </View>
        //         )}

        //         {status == 2 ? (
        //           <View
        //             style={[
        //               {
        //                 padding: 10,
        //                 marginBottom: 40,
        //                 borderRadius: 5,
        //               },
        //               {
        //                 backgroundColor: BaseColor.primary,
        //               },
        //             ]}>
        //             <View
        //               style={[
        //                 {
        //                   padding: 10,
        //                   marginBottom: 40,
        //                   borderRadius: 5,
        //                 },
        //                 {
        //                   backgroundColor: BaseColor.primary,
        //                 },
        //               ]}>
        //               <Text
        //                 style={{
        //                   fontFamily: 'PoppinsMedium',
        //                   color: BaseColor.backgroundColor,
        //                 }}>
        //                 Processing{'  '}
        //               </Text>
        //             </View>
        //           </View>
        //         ) : (
        //           <View
        //             style={[
        //               {
        //                 padding: 10,
        //                 marginBottom: 40,
        //                 borderRadius: 5,
        //               },
        //               {backgroundColor: BaseColor.primaryLight},
        //             ]}>
        //             <Text
        //               style={{
        //                 fontFamily: 'PoppinsMedium',
        //                 color: BaseColor.dark,
        //               }}>
        //               Processing{'  '}
        //             </Text>
        //           </View>
        //         )}

        //         {status == 3 ? (
        //           <View
        //             style={[
        //               {
        //                 padding: 10,
        //                 marginBottom: 40,
        //                 borderRadius: 5,
        //               },
        //               {
        //                 backgroundColor: BaseColor.primary,
        //               },
        //             ]}>
        //             <View
        //               style={[
        //                 {
        //                   padding: 10,
        //                   marginBottom: 40,
        //                   borderRadius: 5,
        //                 },
        //                 {
        //                   backgroundColor: BaseColor.primary,
        //                 },
        //               ]}>
        //               <Text
        //                 style={{
        //                   fontFamily: 'PoppinsMedium',
        //                   color: BaseColor.backgroundColor,
        //                 }}>
        //                 Completed{'  '}
        //               </Text>
        //             </View>
        //           </View>
        //         ) : (
        //           <View
        //             style={[
        //               {
        //                 padding: 10,
        //                 marginBottom: 15,
        //                 borderRadius: 5,
        //               },
        //               {backgroundColor: BaseColor.primaryLight},
        //             ]}>
        //             <Text
        //               style={{
        //                 fontFamily: 'PoppinsMedium',
        //                 color: BaseColor.black,
        //               }}>
        //               Completed{'  '}
        //             </Text>
        //           </View>
        //         )}
        //       </View>
        //     </View>
        //   ) : null
        // }
      />
    </SafeAreaView>
  );
};

export default TrackOrder;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 0,
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    fontFamily: 'JostRegular',
    marginBottom: 3,
  },
  valueText: {
    fontFamily: 'JostMedium',
    marginBottom: 3,
  },
  cancelOrderText: {
    color: 'BaseColor.primary',
    marginBottom: 3,
  },

  avatarContainer: {
    flexDirection: 'row',
  },
  avatar: {
    alignSelf: 'center',
    marginLeft: 10,
  },
  nameText: {
    fontFamily: 'JostMedium',
  },
  mobileText: {
    fontFamily: 'JostMedium',
    lineHeight: 25,
  },

  orderId: {
    marginBottom: 15,
    fontSize: 14,
    fontFamily: 'JostMedium',
  },
});
