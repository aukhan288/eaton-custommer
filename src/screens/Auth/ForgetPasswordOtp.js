import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {
  Avatar,
  Button,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../constants/Url';

import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const ForgetPasswordOtp = ({navigation}) => {
  const styles = Styles();
  const theme = useTheme();
  const {t} = useTranslation();

  const [mobile, setMobile] = useState();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState();
  const [isValidOtpPattern, setIsValidOtpPattern] = useState(false);

  const [counter, setCounter] = React.useState(59);
  const [resendOTPBtn, setResendOTPBtn] = useState(true);

  const [otpLoader, setOtpLoader] = useState(false);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('forgetPasswordMobile');
      if (value !== null) {
        setMobile(value);
      }
    } catch (error) {}
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  const validateOtp = entered_otp => {
    entered_otp = entered_otp.replace(
      /[`~a-zA-Z !@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );

    if (entered_otp.length < 6) {
      setOtp(entered_otp);
      setOtpError('Enter 6 Digit');
      setIsValidOtpPattern(false);
    }
    if (entered_otp.length == 6) {
      setOtpError('');
      setOtp(entered_otp);
      setIsValidOtpPattern(true);
    }
  };

  const resendOTP = () => {
    setCounter(59);

    var authAPIURL =
      API_BASE_URL + 'checkValidMobileNoSendForgetPasswordOTP.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: mobile,
      }),
    })
      .then(response => response.json())
      .then(response => {
        ToastAndroid.show(response.msg, ToastAndroid.SHORT);
      })
      .catch(error => {
        console.log(error);
      });

    setResendOTPBtn(true);
  };

  React.useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setResendOTPBtn(false);
    }
  }, [counter]);

  const verifyOtp = async () => {
    setOtpLoader(true);
    if (isValidOtpPattern == true) {
      var authAPIURL = API_BASE_URL + 'verifyForgetPasswordOTP.php';
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(authAPIURL, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          mobile: mobile,
          otp: otp,
        }),
      })
        .then(response => response.json())
        .then(response => {
          ToastAndroid.show(response.msg, ToastAndroid.SHORT);
          if (response.result == 'true') {
            navigation.navigate('ChangePassword');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      ToastAndroid.show('Enter 6 Digit OTP', ToastAndroid.SHORT);
    }
    setOtpLoader(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Avatar.Image
            size={120}
            source={require('../../assets/image/forget_password.png')}
            style={styles.logoIcon}
          />
          <Text style={styles.mainHeding}>{t('otp_verification')}</Text>
          <Text style={styles.subHeading}>
            {t('otp_is_sent_to_register_mobile_number')}
          </Text>
          <Text style={styles.phoneCode}>
            {t('+92')} {mobile}
          </Text>

          <View style={{marginTop: 30}}>
            <Text style={styles.textInputHeading}>
              {t('enter_6_digit_otp')}
            </Text>

            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="lock"
                size={20}
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={otp}
                placeholder={t('enter_6_digit_otp')}
                onChangeText={entered_otp => validateOtp(entered_otp)}
              />
            </View>
            {otpError ? (
              <Text style={styles.termConditionText}>{otpError}</Text>
            ) : null}
          </View>

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: BaseColor.primary}}}
            onPress={() => {
              verifyOtp();
            }}
            loading={otpLoader}
            labelStyle={styles.functionalLabelBtn}>
            {t('verify_otp')}
          </Button>

          <View style={styles.footerContainer}>
            <Text style={{textAlign: 'center', fontFamily: 'JostRegular'}}>
              {t('resend_otp_in')}{' '}
              <Text style={styles.otpTimeCounter}>{counter}</Text> {t('sec')}
            </Text>
            <Button
              mode="text"
              disabled={resendOTPBtn}
              theme={{colors: {primary: BaseColor.primary}}}
              uppercase={false}
              style={{marginHorizontal: 100}}
              labelStyle={styles.functionalLabelBtn}
              onPress={() => resendOTP()}>
              {t('resend_otp')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgetPasswordOtp;

const styles = StyleSheet.create({});
