import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  Dimensions
} from 'react-native';
import {Avatar, Title, Button} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import * as authActions from '../../store/actions/AuthAction';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import Styles from './styles';
import {BaseColor} from '../../config/theme';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {hieght, width}=Dimensions.get('screen')
const Login = ({navigation}) => {
  const styles = Styles();
  const {t} = useTranslation();

  const dispatch = useDispatch();

  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState('');

  const [mobileError, setmobileError] = useState();
  const [passwordError, setpasswordError] = useState();

  const [isValidMobilePattern, setIsValidMobilePattern] = useState(false);
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(false);

  const [loginLoader, setLoginLoader] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  const [fcmToken, setFcmToken] = useState(null);

  React.useEffect(() => {
    setTimeout(async () => {
      firebase.messaging().subscribeToTopic('rishabh');
      getToken = await firebase.messaging().getToken();
      console.log('*******',getToken);
      
      setFcmToken(getToken);
    });
  }, []);

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
  const onChangePassword = password => {
    if (password.length < 6) {
      setPassword(password);
      setpasswordError('Enter more than 6 Character');
      setIsValidPasswordPattern(false);
    }
    if (password.length >= 6) {
      setpasswordError('');
      setPassword(password);
      setIsValidPasswordPattern(true);
    }
  };

  const login = async () => {
    setLoginLoader(true);
    if (isValidMobilePattern == true && isValidPasswordPattern == true) {
      try {
        await dispatch(authActions.login(mobile, password, fcmToken));
        navigation.navigate('BottomTabScreen', {
          screen: 'Home',  // The specific screen inside BottomTabScreen you want to navigate to
        });
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Invalid Mobile no. or Password', ToastAndroid.SHORT);
    }
    setLoginLoader(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Image
            source={require('../../assets/image/logo.png')}
            style={[{width:width*0.5, height:width*0.3,alignSelf:'center'}]}
          />
          <Text style={styles.mainHeding}>{t('user_sign-in')}</Text>
          {/* <Text style={styles.subHeading}>
            {t('hello_welcome_back_to_our_account')}
          </Text> */}

          <View style={styles.firstInputTextContainer}>
            <Text style={styles.textInputHeading}>
              {t('enter_mobile_number')}
            </Text>

            <View style={styles.textInputContainer}>
              <Image
                source={require('../../assets/image/pak.png')}
                style={styles.textInputImage}
              />
              <Text style={styles.phoneCode}>{t('+92')}</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={mobile}
                onChangeText={user_mobile => onChangeMobile(user_mobile)}
              />
            </View>
            {mobileError ? (
              <Text style={styles.termConditionText}>{mobileError}</Text>
            ) : null}
          </View>

          <View style={styles.nextInputTextContainer}>
            <Text style={styles.textInputHeading}>{t('enter_password')}</Text>

            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="lock"
                size={20}
                style={styles.icon}
                onPress={() => setHidePass(!hidePass)}
              />

              <TextInput
                style={styles.textInputWithRightIcon}
                secureTextEntry={hidePass ? true : false}
                onChangeText={user_password => onChangePassword(user_password)}
                value={password}
              />

              <MaterialCommunityIcons
                name="eye-off"
                size={20}
                style={styles.icon}
                onPress={() => setHidePass(!hidePass)}
              />
            </View>
            {passwordError ? (
              <Text style={styles.termConditionText}>{passwordError}</Text>
            ) : null}
          </View>

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: BaseColor.primary}}}
            loading={loginLoader}
            labelStyle={styles.functionalLabelBtn}
            onPress={() => {
              login();
            }}>
            {t('login')}
          </Button>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.notRegister}>
              {t('not_register_yet?')}{' '}
              <Text style={{color: BaseColor.primary}}>
                {t('create_an_account')}
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgetPassword')}
            style={{marginTop: 10}}>
            <Text
              style={{
                color: BaseColor.primary,
                textAlign: 'center',
                fontFamily: 'JostRegular',
              }}>
              {t('forget_password')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
