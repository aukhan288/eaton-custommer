import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  TextInput,
  Platform
} from 'react-native';
import {
  Avatar,
  Button,
} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import * as authActions from '../../store/actions/AuthAction';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';

import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COUNTRY_CODE } from '../../constants/Url';

const Otp = ({navigation}) => {
  const styles = Styles();
  const theme = useTheme();
  const {t} = useTranslation();

  const name = useSelector(state => state.AuthReducer.name);
  const mobile = useSelector(state => state.AuthReducer.mobile);
  const password = useSelector(state => state.AuthReducer.password);
  const ref_code = useSelector(state => state.AuthReducer.ref_code);

  const [otpLoader, setOtpLoader] = useState(false);

  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState();
  const [isValidOtpPattern, setIsValidOtpPattern] = useState(false);

  const [counter, setCounter] = React.useState(59);
  const [resendOTPBtn, setResendOTPBtn] = useState(true);

  const [fcmToken, setFcmToken] = useState(null);

  React.useEffect(() => {
    setTimeout(async () => {
      firebase.messaging().subscribeToTopic('grocery');
      getToken = await firebase.messaging().getToken();
      setFcmToken(getToken);
    });
  }, []);

  const resendOTP = () => {
    const plate_form = Platform?.OS;
    setCounter(59);
    dispatch(authActions.signup(name, mobile, password, ref_code, plate_form, fcmToken, otp));
    setResendOTPBtn(true);
  };

  React.useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setResendOTPBtn(false);
    }
  }, [counter]);

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

  const verifyOtp = async () => {
    const plate_form = Platform?.OS;
    setOtpLoader(true);
    if (isValidOtpPattern == true) {
      try {
        // console.log('verifyotp');
        await dispatch(
          authActions.verifyotp(
            name,
            mobile,
            password,
            otp,
            plate_form,
            fcmToken,
            ref_code,
          ),
        );
        navigation.navigate('BottomTabScreen', {
          screen: 'Home',  // The specific screen inside BottomTabScreen you want to navigate to
        });
      } catch (err) {
        console.log('ttttttttt',err);
        
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Enter 6 Digit', ToastAndroid.SHORT);
    }
    setOtpLoader(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          {/* <Avatar.Image
            size={120}
            source={require('../../assets/image/otp_verify.png')}
            style={styles.logoIcon}
          /> */}
          <Text style={styles.mainHeding}>{t('otp_verification')}</Text>
          <Text style={styles.subHeading}>
            {t('otp_is_sent_to_register_mobile_number')}
          </Text>
          <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.phoneCode}>
            {t(COUNTRY_CODE)} {mobile}
          </Text>
          </View>

          <View style={styles.firstInputTextContainer}>
            <Text style={styles.textInputHeading}>
              {t('enter_6_digit_otp')}
            </Text>

            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="lock"
                size={20}
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
              labelStyle={{
                fontFamily: 'JostRegular',
              }}
              onPress={() => resendOTP()}>
              {t('resend_otp')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({});
