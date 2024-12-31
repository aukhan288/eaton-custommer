import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BaseColor, useTheme} from '../config/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {API_BASE_URL} from '../constants/Url';
import {useNavigation} from '@react-navigation/native';

import Onboarding from '../screens/OnBoarding/OnBoarding';
import BottomTabScreen from './BottomTabScreen';

import AddAddress from '../screens/Address/AddAddress';
import Address from '../screens/Address/Address';
// import EditAddress from '../screens/Address/EditAddress';

import Cart from '../screens/Cart/Cart';

import ContactUs from '../screens/About/ContactUs';
import About from '../screens/About/About';
import RefundPolicy from '../screens/About/RefundPolicy';
import TermsCondition from '../screens/About/TermsCondition';
import PrivacyPolicy from '../screens/About/PrivacyPolicy';

import Coupons from '../screens/Coupons/Coupons';

import PlaceOrder from '../screens/Order/PlaceOrder';
import PlaceOrderStepOne from '../screens/Order/PlaceOrderStepOne';
import PopularProductList from '../screens/Products/PopularProductList';
import ProductDetails from '../screens/Products/ProductDetails';
import ProductSearch from '../screens/Products/ProductSearch';
import Profile from '../screens/Profile/Profile';
import SubCategory from '../screens/Products/SubCategory';
import ThankYou from '../screens/ThankYou/ThankYou';
import TrackOrder from '../screens/Order/TrackOrder';
import Wallet from '../screens/Wallet/Wallet';
import WalletHistory from '../screens/Wallet/WalletHistory';
import AllProductsList from '../screens/Products/AllProductList';
import Welcome from '../screens/Welcome/Welcome';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import PaymentStack from '../navigation/PaymentStack';
import Stripe from '../screens/Welcome/Stripe';

import Login from '../screens/Auth/Login';
import Otp from '../screens/Auth/Otp';
import ChangePassword from '../screens/Auth/ChangePassword';
import Signup from '../screens/Auth/Signup';
import Language from '../screens/Language/Language';
import {useTranslation} from 'react-i18next';
import ForgetPasswordOtp from '../screens/Auth/ForgetPasswordOtp';


const RootStack = ({}) => {
  const {theme} = useSelector(state => state.ApplicationReducer);
  const {t} = useTranslation();
  const myTheme = useTheme();
  const AppStack = createNativeStackNavigator();
  const navigation = useNavigation();
  const disabledOnBoarding = useSelector(
    state => state.OnBoardingReducer.disabledOnBoarding,
  );
  const cartProducts = useSelector(state => state.CartReducer.cartProducts);

  var result = [];
  for (var i in cartProducts) {
    result.push([i, cartProducts[i]]);
  }

  return (
    <AppStack.Navigator>
      {!disabledOnBoarding ? (
        <AppStack.Screen
          name="OnBoarding"
          component={Onboarding}
          options={{headerShown: false}}
        />
      ) : null}

      <AppStack.Screen
        name="Welcome"
        component={Welcome}
        options={{headerShown:false}}
      />
      <AppStack.Screen
        name="PaymentStack"
        component={Stripe}
        options={{headerShown:false}}
      />

      <AppStack.Screen
        name="BottomTabScreen"
        component={BottomTabScreen}
        options={{
          title: '',
          headerStyle: {backgroundColor: myTheme.theme.background},
          headerLeft: () => (
            <Image
              source={
                theme === 'light'
                  ? require('../assets/image/header-light.png')
                  : require('../assets/image/header-dark.png')
              }
              // source={{uri: headerLogo}}
              style={{
                width: Dimensions.get('window').width*0.215,
                height: Dimensions.get('window').width*0.1,
              }}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProductSearch')}>
                <Ionicons name="search" color={'#BF0000'} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{marginLeft: 10}}
                onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="cart" color={'#BF0000'} size={24} />
                <Text style={styles.cartItemCount}>{result.length}</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="ProductSearch"
        allowFontScaling={false}
        component={ProductSearch}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('search_product'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{marginLeft: 10}}
              onPress={() => navigation.navigate('Cart')}>
              <Ionicons name="cart" color={BaseColor.primary} size={24} />
              <Text style={styles.cartItemCount}>{result.length}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <AppStack.Screen
        name="Cart"
        component={Cart}
        allowFontScaling={false}
        adjustsFontSizeToFit
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('cart'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <AppStack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />

      <AppStack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{headerShown: false}}
      />

<AppStack.Screen
        name="ForgetPasswordOtp"
        component={ForgetPasswordOtp}
        options={{headerShown: false}}
      />

      <AppStack.Screen
        name="Otp"
        component={Otp}
        options={{headerShown: false}}
      />

      <AppStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{headerShown: false}}
      />

      <AppStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('contact_us'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('privacy_policy'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="About"
        component={About}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('about_us'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="TermsCondition"
        component={TermsCondition}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('terms_and_condition'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="RefundPolicy"
        component={RefundPolicy}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('refund_policy'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="PlaceOrderStepOne"
        component={PlaceOrderStepOne}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('place_order'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="PlaceOrder"
        component={PlaceOrder}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('place_order'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Address"
        component={Address}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('my_address_list'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('add_address'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Coupons"
        component={Coupons}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('apply_coupons'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="ThankYou"
        component={ThankYou}
        allowFontScaling={false}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('thank_you'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="TrackOrder"
        component={TrackOrder}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('track_order'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="SubCategory"
        component={SubCategory}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('sub_category'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProductSearch')}>
                <Ionicons name="search" color={BaseColor.primary} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{marginLeft: 10}}
                onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="cart" color={BaseColor.primary} size={24} />
                <Text style={styles.cartItemCount}>{result.length}</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="ProductDetails"
        component={ProductDetails}
        allowFontScaling={false}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('product_details'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProductSearch')}>
                <Ionicons name="search" color={myTheme.theme.title} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{marginLeft: 10}}
                onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="cart" color={myTheme.theme.title} size={24} />
                <Text style={styles.cartItemCount}>{result.length}</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="AllProductsList"
        component={AllProductsList}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('all_products_list'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProductSearch')}>
                <Ionicons name="search" color={myTheme.theme.title} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{marginLeft: 10}}
                onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="cart" color={myTheme.theme.title} size={24} />
                <Text style={styles.cartItemCount}>{result.length}</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="PopularProductList"
        component={PopularProductList}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('popular_products'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProductSearch')}>
                <Ionicons name="search" color={myTheme.theme.title} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{marginLeft: 10}}
                onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="cart" color={myTheme.theme.title} size={24} />
                <Text style={styles.cartItemCount}>{result.length}</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <AppStack.Screen
        name="Wallet"
        component={Wallet}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('wallet'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="WalletHistory"
        component={WalletHistory}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('wallet_history'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('profile'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />

      <AppStack.Screen
        name="Language"
        component={Language}
        options={{
          headerTintColor: BaseColor.primary,
          headerStyle: {backgroundColor: myTheme.theme.background},
          title: t('language'),
          headerTitleAlign: 'center',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Ionicons
              allowFontScaling={false}
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={24}
            />
          ),
        }}
      />
    </AppStack.Navigator>
  );
};

export default RootStack;

const styles = StyleSheet.create({
  headerTitle: {fontSize: 18, fontFamily: 'JostMedium'},
  leftIcon: {color: BaseColor.primary, marginLeft: 10},
  cartItemCount: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 11,
    color: BaseColor.black,
    backgroundColor: BaseColor.secondary,
    borderRadius: 50,
    width: 20,
    height: 20,
    textAlign: 'center',
    paddingTop: 2,
  },
});
