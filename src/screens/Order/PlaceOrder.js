import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {List, Card, Button, Subheading} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import * as couponAction from '../../store/actions/CouponAction';
import * as cartAction from '../../store/actions/CartAction';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';

import RazorpayCheckout from 'react-native-razorpay';
import {API_BASE_URL, BASE_URL} from '../../constants/Url';

import {BaseColor, useTheme} from '../../config/theme';
import {CheckoutCartList, SubHeader} from '../../component';
import Loading from '../Common/Loading';
import { useTranslation } from 'react-i18next';

const PlaceOrder = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation()

  const cartProducts = useSelector(state => state.CartReducer.cartProducts);
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);
  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );
  const deliveryDate = useSelector(
    state => state.DeliveryDateTimeReducer.deliveryDate,
  );
  const timeslot = useSelector(
    state => state.DeliveryDateTimeReducer.deliveryTime,
  );
  const appliedCoupon = useSelector(state => state.CouponReducer.appliedCoupon);
  const {
    paymentMethodeId,
    paymentMethodeTitle,
    paymentMethodeImg,
    api_key,
    description,
  } = useSelector(state => state.PaymentReducer);

  const [cartProductsJson, setCartProductsJson] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [addressId, setAddressId] = useState('');
  const [serviceTax, setServiceTax] = useState(0);
  const [placeOrderBtn, setplaceOrderBtn] = useState(true);
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState();
  const [logo, setLogo] = useState();
  const [currency, setCurrency] = useState();

  const [walletAmount, setWalletAmount] = useState(0);
  const [balanceWalletAmount, setBalanceWalletAmount] = useState(0);
  const [isWalletAmountApplied, setIsWalletAmountApplied] = useState(false);
  const [applayWalletIcon, setApplayWalletIcon] = useState('minus-circle');

  const [actualPaymentAmount, setActualPaymentAmount] = useState();

  const dispatch = useDispatch();

  const isVisible = useIsFocused();
  var result = [];
  var totalDiscountPrice = 0;
  for (var i in cartProducts) {
    totalDiscountPrice =
      totalDiscountPrice +
      Math.ceil(
        (parseInt(cartProducts[i].quantity) *
          parseInt(cartProducts[i].productPrice) *
          (100 - parseInt(cartProducts[i].discount))) /
          100,
      );
    result.push([i, cartProducts[i]]);
  }

  function handleBackButtonClick() {
    setCartProductsJson([]);
    navigation.goBack();
    return true;
  }

  const apiDefaultAddressCall = () => {
    var apiDefaultAddressURL = API_BASE_URL + 'fetchDefaultAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(apiDefaultAddressURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.result == 'true') {
          setDeliveryCharge(parseInt(response.address[0].deliveryCharge));
          setAddressId(response.address[0].id);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const apiSettingCall = () => {
    var authAPIURL = API_BASE_URL + 'setting.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        setServiceTax(parseInt(response.data[0].tax));
        setTitle(response.data[0].title);
        setLogo(response.data[0].app_logo);
        setCurrency(response.data[0].currency);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchWalletAmountByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: mobile,
    };

    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        setWalletAmount(response.walletamount);
        setBalanceWalletAmount(response.walletamount);
      });
  };

  const applyWalletAmount = () => {
    // console.log(isWalletAmountApplied)
    if (isWalletAmountApplied) {
      setActualPaymentAmount(
        appliedCoupon.length
          ? appliedCoupon.map(item => {
              return (
                totalDiscountPrice +
                deliveryCharge +
                Math.round((totalDiscountPrice * serviceTax) / 100) -
                parseInt(item.coupon_value)
              );
            })
          : totalDiscountPrice +
              deliveryCharge +
              Math.round((totalDiscountPrice * serviceTax) / 100) -
              0,
      );
      setBalanceWalletAmount(walletAmount);
      setApplayWalletIcon('minus-circle');
      setIsWalletAmountApplied(false);
    } else {
      if (
        walletAmount >=
        totalDiscountPrice +
          deliveryCharge +
          Math.round((totalDiscountPrice * serviceTax) / 100) -
          0
      ) {
        setBalanceWalletAmount(
          walletAmount -
            (totalDiscountPrice +
              deliveryCharge +
              Math.round((totalDiscountPrice * serviceTax) / 100) -
              0),
        );
        setActualPaymentAmount(0);
      } else {
        setBalanceWalletAmount(0);

        setActualPaymentAmount(
          appliedCoupon.length
            ? appliedCoupon.map(item => {
                return (
                  totalDiscountPrice +
                  deliveryCharge +
                  Math.round((totalDiscountPrice * serviceTax) / 100) -
                  parseInt(item.coupon_value) -
                  walletAmount
                );
              })
            : totalDiscountPrice +
                deliveryCharge +
                Math.round((totalDiscountPrice * serviceTax) / 100) -
                0 -
                walletAmount,
        );
      }
      setApplayWalletIcon('check-circle');
      setIsWalletAmountApplied(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        setCartProductsJson([]);
        setCartProductsJson(result);
        fetchWalletAmountAPI();
        apiDefaultAddressCall();
        apiSettingCall();
        setplaceOrderBtn(false);
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
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
        setCartProductsJson([]);
        setCartProductsJson(result);
        apiDefaultAddressCall();
        apiSettingCall();
        setplaceOrderBtn(false); // enable btn
        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  useEffect(() => {
    setActualPaymentAmount(
      totalDiscountPrice +
        deliveryCharge +
        Math.round((totalDiscountPrice * serviceTax) / 100) -
        0,
    );
  }, [totalDiscountPrice, deliveryCharge, serviceTax]);

  useEffect(() => {
    // console.log('isWalletAmountApplied ', isWalletAmountApplied);
    if (isWalletAmountApplied) {
      if (
        walletAmount >=
        totalDiscountPrice +
          deliveryCharge +
          Math.round((totalDiscountPrice * serviceTax) / 100) -
          0
      ) {
        setBalanceWalletAmount(
          walletAmount -
            (totalDiscountPrice +
              deliveryCharge +
              Math.round((totalDiscountPrice * serviceTax) / 100) -
              0),
        );
        setActualPaymentAmount(0);
      } else {
        setBalanceWalletAmount(0);

        setActualPaymentAmount(
          appliedCoupon.length
            ? appliedCoupon.map(item => {
                return (
                  totalDiscountPrice +
                  deliveryCharge +
                  Math.round((totalDiscountPrice * serviceTax) / 100) -
                  parseInt(item.coupon_value) -
                  walletAmount
                );
              })
            : totalDiscountPrice +
                deliveryCharge +
                Math.round((totalDiscountPrice * serviceTax) / 100) -
                0 -
                walletAmount,
        );
      }
      setApplayWalletIcon('check-circle');
      setIsWalletAmountApplied(false);
    } else {
      setActualPaymentAmount(
        appliedCoupon.length
          ? appliedCoupon.map(item => {
              return (
                totalDiscountPrice +
                deliveryCharge +
                Math.round((totalDiscountPrice * serviceTax) / 100) -
                parseInt(item.coupon_value)
              );
            })
          : totalDiscountPrice +
              deliveryCharge +
              Math.round((totalDiscountPrice * serviceTax) / 100) -
              0,
      );
    }
  }, [appliedCoupon]);

  const placeOrder = () => {
    // console.log(' balanceWalletAmount ', balanceWalletAmount)
    // console.log('walletAmount ', walletAmount)
    const unsubscribe = NetInfo.addEventListener(internetState => {
      setplaceOrderBtn(true);
      if (internetState.isConnected === true) {
        var serviceTaxAmt = Math.round((totalDiscountPrice * serviceTax) / 100);

        var authAPIURL = API_BASE_URL + 'placeOrder.php';
        var header = {
          'Content-Type': 'application/json',
        };

        if (
          isWalletAmountApplied &&
          actualPaymentAmount == 0 &&
          balanceWalletAmount > 0
        ) {
          // for COD
          fetch(authAPIURL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
              mobile: mobile,
              token: token,
              serviceTax: serviceTax,
              addressId: addressId,
              paymentMethodeId: 1,
              appliedCoupon: appliedCoupon,
              cartProductsJson: cartProductsJson,
              totalAmount: totalAmount,
              deliveryCharge: deliveryCharge,
              serviceTaxAmt: serviceTaxAmt,
              deliveryDate: deliveryDate,
              timeslot: timeslot,
              transactionId: null,

              walletAmount: walletAmount,
              balanceWalletAmount: balanceWalletAmount,
              isWalletAmountApplied: isWalletAmountApplied,
            }),
          })
            .then(response => response.json())
            .then(response => {
              ToastAndroid.show(response.msg + ' 🙏', ToastAndroid.SHORT);
              if (response.result == 'true') {
                dispatch(cartAction.emptyCart());
                dispatch(couponAction.emptyCoupon());
                navigation.navigate('ThankYou', {
                  screen: 'ThankYou',
                  params: {orderId: response.orderId},
                });
              }
              setplaceOrderBtn(false);
            })
            .catch(error => {
              setplaceOrderBtn(false);
              console.log(error);
            });
        } else {
          if (api_key != null) {
            var options = {
              description: title,
              image: BASE_URL + logo,
              currency: currency,
              key: api_key,
              amount: actualPaymentAmount * 100,
              name: name,
              prefill: {
                contact: mobile,
                name: name,
              },
              theme: {color: BaseColor.primary},
            };
            // RazorpayCheckout.open(options)
            //   .then(data => {
            //     fetch(authAPIURL, {
            //       method: 'POST',
            //       headers: header,
            //       body: JSON.stringify({
            //         mobile: mobile,
            //         token: token,
            //         serviceTax: serviceTax,
            //         addressId: addressId,
            //         paymentMethodeId: paymentMethodeId,
            //         appliedCoupon: appliedCoupon,
            //         cartProductsJson: cartProductsJson,
            //         totalAmount: totalAmount,
            //         deliveryCharge: deliveryCharge,
            //         serviceTaxAmt: serviceTaxAmt,
            //         deliveryDate: deliveryDate,
            //         timeslot: timeslot,
            //         transactionId: data.razorpay_payment_id,

            //         walletAmount: walletAmount,
            //         balanceWalletAmount: balanceWalletAmount,
            //         isWalletAmountApplied: isWalletAmountApplied,
            //       }),
            //     })
            //       .then(response => response.json())
            //       .then(response => {
            //         ToastAndroid.show(response.msg, ToastAndroid.SHORT);
            //         if (response.result == 'true') {
            //           dispatch(cartAction.emptyCart());
            //           dispatch(couponAction.emptyCoupon());
            //           navigation.navigate('ThankYou', {
            //             screen: 'ThankYou',
            //             params: {orderId: response.orderId},
            //           });
            //         }
            //         setplaceOrderBtn(false);
            //       })
            //       .catch(error => {
            //         console.log(error);
            //       });
            //   })
            //   .catch(err => {
            //     // handle failure
            //     setplaceOrderBtn(false);
            //     ToastAndroid.show(err.error.description, ToastAndroid.LONG);
            //   });
            fetch(authAPIURL, {
              method: 'POST',
              headers: header,
              body: JSON.stringify({
                mobile: mobile,
                token: token,
                serviceTax: serviceTax,
                addressId: addressId,
                paymentMethodeId: 1,
                appliedCoupon: appliedCoupon,
                cartProductsJson: cartProductsJson,
                totalAmount: totalAmount,
                deliveryCharge: deliveryCharge,
                serviceTaxAmt: serviceTaxAmt,
                deliveryDate: deliveryDate,
                timeslot: timeslot,
                transactionId: null,
  
                walletAmount: walletAmount,
                balanceWalletAmount: balanceWalletAmount,
                isWalletAmountApplied: isWalletAmountApplied,
              }),
            })
              .then(response => response.json())
              .then(response => {
                ToastAndroid.show(response.msg + ' 🙏', ToastAndroid.SHORT);
                if (response.result == 'true') {
                  dispatch(cartAction.emptyCart());
                  dispatch(couponAction.emptyCoupon());
                  navigation.navigate('ThankYou', {
                    screen: 'ThankYou',
                    params: {orderId: response.orderId},
                  });
                }
                setplaceOrderBtn(false);
              })
              .catch(error => {
                setplaceOrderBtn(false);
                console.log(error);
              });
          } else {
            // for COD
            fetch(authAPIURL, {
              method: 'POST',
              headers: header,
              body: JSON.stringify({
                mobile: mobile,
                token: token,
                serviceTax: serviceTax,
                addressId: addressId,
                paymentMethodeId: paymentMethodeId,
                appliedCoupon: appliedCoupon,
                cartProductsJson: cartProductsJson,
                totalAmount: totalAmount,
                deliveryCharge: deliveryCharge,
                serviceTaxAmt: serviceTaxAmt,
                deliveryDate: deliveryDate,
                timeslot: timeslot,
                transactionId: null,

                walletAmount: walletAmount,
                balanceWalletAmount: balanceWalletAmount,
                isWalletAmountApplied: isWalletAmountApplied,
              }),
            })
              .then(response => response.json())
              .then(response => {
                ToastAndroid.show(response.msg + ' 🙏', ToastAndroid.SHORT);
                if (response.result == 'true') {
                  dispatch(cartAction.emptyCart());
                  dispatch(couponAction.emptyCoupon());
                  navigation.navigate('ThankYou', {
                    screen: 'ThankYou',
                    params: {orderId: response.orderId},
                  });
                }
                setplaceOrderBtn(false);
              })
              .catch(error => {
                setplaceOrderBtn(false);
                console.log(error);
              });
          }
        }
      } else {
        setplaceOrderBtn(false);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  const renderItem = ({item}) => (
    <CheckoutCartList
      product_type_price_id={item[0]}
      productPrice={item[1].productPrice}
      productVariation={item[1].productVariation}
      productQuantity={item[1].quantity}
      product_name={item[1].product_name}
      brand_name={item[1].brand_name}
      product_img={item[1].product_img}
      discount={item[1].discount}
      popular={item[1].popular}
      category={item[1].category}
      subcategory={item[1].subcategory}
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
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          data={cartProductsJson}
          renderItem={renderItem}
          keyExtractor={item => item[0]}
          key={item => item[0]}
          style={{marginBottom: 45}}
          ListHeaderComponent={
            <>
              <View style={styles.container}>
                <SubHeader title={t('billing_summary')} />
                <Card
                  elevation={0}
                  style={[
                    styles.card,
                    {backgroundColor: theme.theme.background},
                  ]}>
                  <Card.Content style={styles.cardContent}>
                    <View style={{flex: 1}}>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        {t('subtotal')}:
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        {t('delivery')}:
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        {t('service_tax')}: ({serviceTax} %)
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        {t('discount')}:
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        {t('total')}:
                      </Subheading>
                    </View>
                    <View style={styles.billingRightContainer}>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        <MaterialCommunityIcons
                          name="currency-inr"
                          style={styles.icon}
                        />
                        {totalDiscountPrice}
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        <MaterialCommunityIcons
                          name="currency-inr"
                          style={styles.icon}
                        />
                        {deliveryCharge}
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        <MaterialCommunityIcons
                          name="currency-inr"
                          style={styles.icon}
                        />
                        {Math.round((totalDiscountPrice * serviceTax) / 100)}
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        -{' '}
                        <MaterialCommunityIcons
                          name="currency-inr"
                          style={styles.icon}
                        />
                        {appliedCoupon.length
                          ? appliedCoupon.map(item => item.coupon_value)
                          : 0}
                      </Subheading>
                      <Subheading
                        style={[styles.subheading, {color: theme.theme.title}]}
                        allowFontScaling={false}>
                        <MaterialCommunityIcons
                          name="currency-inr"
                          style={[styles.icon]}
                        />
                        {actualPaymentAmount}
                      </Subheading>
                    </View>
                  </Card.Content>
                </Card>
              </View>

              <View
                style={[
                  styles.couponContainer,
                  {backgroundColor: theme.theme.background},
                ]}>
                <Text style={[styles.couponTitle, {color: theme.theme.title}]}>
                  {t('apply_coupon')}
                </Text>
                <TouchableOpacity
                  style={styles.couponRightContainer}
                  onPress={() => {
                    navigation.navigate('Coupons');
                  }}>
                  <Text style={styles.clickableText} allowFontScaling={false}>
                  {t('click_here')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.container}>
                {appliedCoupon.map(item => {
                  if (item.coupon_id) {
                    return (
                      <Card
                        elevation={0}
                        style={styles.appliedCouponCard}
                        key={item.coupon_id}>
                        <Card.Content style={styles.appliedCouponContent}>
                          <Text style={{color: BaseColor.success, flex: 7}}>
                            <Text style={{fontWeight: 'bold'}}>
                              {item.coupon_code} {t('applied')}
                            </Text>
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(
                                couponAction.removeCoupon(item.coupon_id),
                              );
                            }}
                            style={{flex: 0.5, alignItems: 'flex-end'}}>
                            <MaterialCommunityIcons
                              name="minus-circle"
                              style={{fontSize: 16, color: BaseColor.primary}}
                            />
                          </TouchableOpacity>
                        </Card.Content>
                      </Card>
                    );
                  }
                })}
              </View>

              <View style={styles.container}>
                <SubHeader
                  title={`${t('wallet_balance_amount')} : ${balanceWalletAmount})`}
                />
              </View>

              <View style={styles.container}>
                <Card
                  elevation={0}
                  style={[
                    styles.card,
                    {backgroundColor: theme.theme.background},
                  ]}>
                  <Card.Content style={styles.cardContent}>
                    <Text style={styles.walletText}>
                      <MaterialCommunityIcons
                        name="currency-inr"
                        style={styles.icon}
                      />{' '}
                      {walletAmount}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        walletAmount == 0
                          ? ToastAndroid.show(
                              'Not Valid Wallet Amount',
                              ToastAndroid.SHORT,
                            )
                          : applyWalletAmount();
                      }}
                      style={{flex: 0.5, alignItems: 'flex-end'}}>
                      <MaterialCommunityIcons
                        name={applayWalletIcon}
                        style={{fontSize: 16, color: BaseColor.primary}}
                      />
                    </TouchableOpacity>
                  </Card.Content>
                </Card>
              </View>

              <View style={styles.container}>
                <SubHeader title={t('payment_method')} />
                <Card elevation={0} style={[styles.card, {paddingLeft: 10}]}>
                  <List.Item
                    key={paymentMethodeId}
                    keyExtractor={paymentMethodeId}
                    title={paymentMethodeTitle}
                    titleNumberOfLines={1}
                    description={description}
                    descriptionNumberOfLines={2}
                    allowFontScaling={false}
                    descriptionStyle={{
                      fontSize: 12,
                      textAlign: 'justify',
                      color: theme.theme.textLight,
                      fontFamily: 'JostRegular',
                    }}
                    titleStyle={{
                      fontSize: 14,
                      color: theme.theme.title,
                      fontFamily: 'JostRegular',
                    }}
                    left={() => (
                      <Image
                        source={{
                          uri: paymentMethodeImg,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                  />
                </Card>
              </View>

              <View style={styles.container}>
                <SubHeader title={t('items_in_cart')} />
              </View>
            </>
          }
        />
        <View style={styles.btnConatiner}>
          <Button
            allowFontScaling={false}
            mode="text"
            theme={{colors: {primary: BaseColor.primary}}}
            style={styles.btn}
            disabled={placeOrderBtn}
            onPress={() => {
              isLoggedIn ? placeOrder() : navigation.navigate('Login');
            }}
            uppercase={false}>
            {t('place_order')}{'  '}
            <MaterialCommunityIcons name="currency-inr" size={16} />
            {actualPaymentAmount}
          </Button>
        </View>
      </>
    </SafeAreaView>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  container: {},
  subheading: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'JostMedium',
  },
  card: {
    marginBottom: 15,
    borderRadius: 0,
    elevation: 0,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  subheadingWithIcon: {
    marginTop: 10,
    fontSize: 12,
    // color: theme.theme.title,
    fontFamily: 'JostMedium',
  },
  icon: {
    fontSize: 16,
  },
  clickableText: {
    color: BaseColor.primary,
  },
  appliedCouponCard: {
    // backgroundColor: theme.theme.background,
  },
  appliedCouponContent: {
    flex: 7.5,
    flexDirection: 'row',
  },
  couponContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: BaseColor.primaryLight,
    borderTopColor: BaseColor.primaryLight,
    marginBottom: 10,
  },
  couponTitle: {fontFamily: 'JostMedium', marginBottom: 3, fontSize: 16},
  couponRightContainer: {flex: 1, alignItems: 'flex-end'},
  billingRightContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  walletText: {fontWeight: 'bold', color: 'green', flex: 7},

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
  btn: {
    backgroundColor: 'white',
    alignSelf: 'center',
    marginVertical: 6,
  },
});
