import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  BackHandler,
  ToastAndroid,
  Alert,
} from 'react-native';
import {Button, FAB} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
// import {Picker} from '@react-native-community/picker';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';

import * as cartAction from '../../store/actions/CartAction';
import * as OrderSettingAction from '../../store/actions/OrderSettingAction';
import {API_BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import {VerticalCart} from '../../component';
import Loading from '../Common/Loading';
import { useTranslation } from 'react-i18next';

const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  const cartProducts = useSelector(state => state.CartReducer.cartProducts);
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);
  const theme = useTheme();
  const {t} = useTranslation()
console.log('qqqqqqq',useSelector(state => state.CartReducer));

  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );

  const minOrderAmt = useSelector(
    state => state.OrderSettingReducer.minOrderAmt,
  );
  const isVisible = useIsFocused();

  const [statePlaceOrderBtn, setStatePlaceOrderBtn] = useState(false);
  const [minOrderMsg, setMinOrderMsg] = useState('');

  const [cartProductsJson, setCartProductsJson] = useState([]);
  const [itemCount, setItemCount] = useState(cartProductsJson.length);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  var result = [];
  var totalDiscounPrice = 0;

  function handleBackButtonClick() {
    setCartProductsJson([]);
    setItemCount();
    navigation.goBack();
    return true;
  }

  const cartProductAPI = () => {
    setLoading(true);
    // var authAPIURL = API_BASE_URL + 'cartProducts.php';
    var authAPIURL = API_BASE_URL + 'cartProducts';
    console.log(authAPIURL);
    
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        products: [49],
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('RRRRRRRRRRRR', response);
        
        console.log('111111111',result);
        // result=[...result, response?.data]
        response?.data?.map(item=>{
          result?.push(item)
        })
        console.log('222222222',result);
        
        // for (var i = 0; i < response?.data?.length; ++i) {
        //   // if (response[i].status == true) {
        //     // result.push([
        //     //   response?.data[i],
        //     //   // response?.data[i].price,
        //     //   // cartProducts[response?.data[i].price],
        //     // ]);
        //   // } else {
        //   //   dispatch(cartAction.deleteItem(response[i].productTypePriceId));
        //   //   ToastAndroid.show('Some Item may be removed', ToastAndroid.LONG);
        //   // }
        // }
        setLoading(false);
      })
      .catch(error => {
        console.log('========',error);
      });
  };

  // for (var i in cartProducts) {
  //   totalDiscounPrice =
  //     totalDiscounPrice +
  //     Math.ceil(
  //       (parseInt(cartProducts[i].quantity) *
  //         parseInt(cartProducts[i].productPrice) *
  //         (100 - parseInt(cartProducts[i].discount))) /
  //         100,
  //     );
  // }

  const apiCall = () => {
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
        var min_order_amt = parseInt(response.data[0].minimum_order_value);
        dispatch(OrderSettingAction.setMinOrderAmt(min_order_amt));
        setMinOrderMsg('Minimum Order Amount ' + min_order_amt);
        if (parseInt(totalAmount) >= min_order_amt) {
          setStatePlaceOrderBtn(false);
        } else {
          setStatePlaceOrderBtn(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsInternetConnected(false);
    setStatePlaceOrderBtn(true);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        setLoading(true);
        result = [];
        cartProductAPI();
        setCartProductsJson(cartProducts);
        // setCartProductsJson(result);
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, [isVisible]);

  useEffect(() => {
    setItemCount(cartProductsJson.length);
  }, [result]);

  useEffect(() => {
    setTimeout(() => {
      apiCall();
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, [isVisible]);

  const reloadPage = () => {
    setLoading(true);
    setStatePlaceOrderBtn(false);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        cartProductAPI();
        setItemCount();
        setCartProductsJson([]);
        console.log('kkkkkkkkkk',result)
        
        setCartProductsJson(result);
        
        setItemCount(result?.length);

        BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );

        apiCall();
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

  return (
    <SafeAreaView
      style={{backgroundColor: theme.theme.darkBackground, flex: 1}}>
      <VerticalCart cartProductsJson={cartProducts} />

      <FAB
        color="white"
        style={styles.fab}
        icon="trash-can-outline"
        onPress={() => {
          Alert.alert('Clear Cart', 'Do you really want to clear cart?', [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                dispatch(cartAction.emptyCart()),
                  (result = []),
                  setCartProductsJson([]),
                  setItemCount(0),
                  ToastAndroid.show(
                    'Cart has been cleared',
                    ToastAndroid.SHORT,
                  );
              },
            },
          ]);
        }}
      />

      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
              <Icon style={styles.icon} name="cart-outline" size={15} />
              <Text style={styles.itemText}>{itemCount} {t('item')}</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.totalAmountText}>
                <MaterialCommunityIcons
                  name="currency-gbp"
                  style={styles.currencyIcon}
                />
                {totalDiscounPrice}
              </Text>
              {totalAmount > totalDiscounPrice && (
                <Text style={styles.originalAmountText}>
                  <MaterialCommunityIcons
                    name="currency-gbp"
                    style={styles.currencyIcon}
                  />
                  {totalAmount}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="text"
              theme={{colors: {primary: theme.theme.primary}}}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              onPress={() => {
                isLoggedIn
                  ? totalAmount >= minOrderAmt
                    ? navigation.navigate('PlaceOrderStepOne')
                    : ToastAndroid.show(minOrderMsg, ToastAndroid.SHORT)
                  : navigation.navigate('Login');
              }}
              uppercase={false}>
              {t('looks_good_keep_going')}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 20,
    left: 0,
    bottom: 40,
    backgroundColor: BaseColor.primary,
  },
  container: {
    flexDirection: 'column',
    height: 50,
    paddingHorizontal: 15,
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: BaseColor.primary,
  },
  contentContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
  },
  icon: {
    color: 'white',
    marginRight: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'JostRegular',
  },
  amountContainer: {
    flex: 1,
    flexDirection: 'column',
    borderStartWidth: 1,
    borderStartColor: 'white',
    paddingLeft: 5,
  },
  totalAmountText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'JostMedium',
  },
  originalAmountText: {
    color: 'white',
    fontSize: 11,
    textDecorationLine: 'line-through',
    fontFamily: 'JostRegular',
  },
  currencyIcon: {
    fontSize: 12,
  },
  buttonContainer: {
    flex: 1,
    marginVertical: 6,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  buttonLabel: {
    fontSize: 12,
    color: BaseColor.primary,
    fontFamily: 'JostMedium',
  },
});
