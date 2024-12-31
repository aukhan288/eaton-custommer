import React, {useEffect, useState} from 'react';
import {
  StyleSheet
} from 'react-native';
import {useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BaseColor, useTheme} from '../config/theme';

import {useNavigation} from '@react-navigation/native';

import Stripe from '../screens/Welcome/Stripe';
import {useTranslation} from 'react-i18next';
import { StripeProvider } from '@stripe/stripe-react-native';


const PaymentStack = ({}) => {
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


 <StripeProvider
      publishableKey={'pk_test_51QG3LkFdLRsHMkAfR6q4YuxDM2Fn3uFK9wRJKoGbCTaoxwoXisGJAKXvVdDscwzmWY3kTNiDYwT6MHcSUhAksA5600FeHN17HG'}
    //   merchantIdentifier="merchant.identifier" // required for Apple Pay
    //   urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >

    
      <AppStack.Screen
        name="Stripe"
        component={Stripe}
        options={{headerShown:false}}
      />
      </StripeProvider>
  );
};

export default PaymentStack;

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
