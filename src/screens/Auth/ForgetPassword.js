import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {Avatar, Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../constants/Url';

import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import {useTranslation} from 'react-i18next';

const ForgetPassword = ({navigation}) => {
  const styles = Styles();
  const theme = useTheme();
  const {t} = useTranslation();

  const dispatch = useDispatch();

  const [loginLoader, setLoginLoader] = useState(false);
  const [mobile, setMobile] = useState();
  const [mobileError, setmobileError] = useState();
  const [isValidMobilePattern, setIsValidMobilePattern] = useState(false);

  const onChangeMobile = mobile => {
    mobile = mobile.replace(
      /[`~a-zA-Z !@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    if (mobile.length < 10) {
      setMobile(mobile);
      setmobileError('Enter 10 Digit Mobile Number');
      setIsValidMobilePattern(false);
    }
    if (mobile.length == 10) {
      setMobile(mobile);
      setmobileError('');
      setIsValidMobilePattern(true);
    }
  };

  const checkValidMobileNoSendForgetPasswordOTP = () => {
    setLoginLoader(true);
    if (isValidMobilePattern == true) {
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

          if (response.result == 'true') {
            const saveData = async () => {
              await AsyncStorage.setItem('forgetPasswordMobile', mobile);
            };
            saveData();
            navigation.navigate('ForgetPasswordOtp');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      ToastAndroid.show('Invalid Mobile no.', ToastAndroid.SHORT);
    }
    setLoginLoader(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          {/* <Avatar.Image
            size={120}
            source={require('../../assets/image/forget_password.png')}
            style={styles.logoIcon}
          /> */}
          <Text style={styles.mainHeding}>{t('forget_password')}</Text>
          <Text style={styles.subHeading}>
            {t('did_you_forget_your_password')}
          </Text>

          <View style={styles.firstInputTextContainer}>
            <Text style={styles.textInputHeading}>
              {t('enter_register_mobile_number')}
            </Text>

            <View style={styles.textInputContainer}>
              <Image
                source={require('../../assets/image/pak.png')}
                style={styles.textInputImage}
              />
              <Text style={styles.phoneCode}>{t('+92')}</Text>
              <TextInput
                style={styles.textInput}
                value={mobile}
                onChangeText={user_mobile => onChangeMobile(user_mobile)}
                keyboardType="numeric"
              />
            </View>
            {mobileError ? (
              <Text style={styles.termConditionText}>{mobileError}</Text>
            ) : null}
          </View>

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: BaseColor.primary}}}
            loading={loginLoader}
            labelStyle={styles.functionalLabelBtn}
            onPress={() => {
              checkValidMobileNoSendForgetPasswordOTP();
            }}>
            {t('get_otp')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({});
