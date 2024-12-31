import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import {Avatar,  Button} from 'react-native-paper';
import * as authActions from '../../store/actions/AuthAction';
import {useSelector, useDispatch} from 'react-redux';
import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Signup = ({navigation}) => {
  const styles = Styles();
  const theme = useTheme();
  const {t} = useTranslation();

  const dispatch = useDispatch();

  const [name, setName] = useState();
  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState('');
  const [ref_code, setref_code] = useState(null);

  const [nameError, setErrorName] = useState();
  const [mobileError, setmobileError] = useState();
  const [passwordError, setpasswordError] = useState();
  const [ref_codeError, setref_codeError] = useState();

  const [isValidNamePattern, setIsValidNamePattern] = useState(false);
  const [isValidMobilePattern, setIsValidMobilePattern] = useState(false);
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(false);
  const [isValidref_codePattern, setIsValidref_codePattern] = useState(false);

  const [hidePass, setHidePass] = useState(true);

  const [signupLoader, setSignupLoader] = useState(false);

  const onChangeUsername = user_name => {
    user_name = user_name.replace(
      /[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    if (user_name.length < 6) {
      setName(user_name);
      setErrorName('Enter more than 6 Character');
      setIsValidNamePattern(false);
    }
    if (user_name.length >= 6) {
      setName(user_name);
      setErrorName('');
      setIsValidNamePattern(true);
    }
  };
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
  const onChangeref_code = ref_code => {
    if (ref_code.length < 6) {
      setref_code(ref_code);
      setref_codeError('Enter more than 6 Character');
      setIsValidref_codePattern(false);
    }
    if (ref_code.length >= 6) {
      setref_codeError('');
      setref_code(ref_code);
      setIsValidref_codePattern(true);
    }
  };

  const signUp = async () => {
    setSignupLoader(true);

    if (
      isValidNamePattern == true &&
      isValidMobilePattern == true &&
      isValidPasswordPattern == true
    ) {
      try {
        await dispatch(authActions.signup(name, mobile, password, ref_code, Platform.OS));
        navigation.navigate('Otp');
      } catch (err) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(
        'Invalid Name, Mobile no. or Password',
        ToastAndroid.SHORT,
      );
    }

    setSignupLoader(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          {/* <Avatar.Image
            size={120}
            source={require('../../assets/image/signup.png')}
            style={styles.logoIcon}
          /> */}
          <Text style={styles.mainHeding}>{t('create_an_account')}</Text>
          {/* <Text style={styles.subHeading}>{t('create_new_account_to_order_us')}</Text> */}

          <View style={styles.firstInputTextContainer}>
            <Text style={styles.textInputHeading}>{t('enter_your_name')}</Text>

            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="account"
                size={20}
              />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={user_name => onChangeUsername(user_name)}
              />
            </View>
            {nameError ? (
              <Text style={styles.termConditionText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.nextInputTextContainer}>
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
                style={styles.icon}
                name="lock"
                size={20}
              />
              <TextInput
                style={styles.textInputWithRightIcon}
                secureTextEntry={hidePass ? true : false}
                onChangeText={user_password => onChangePassword(user_password)}
                value={password}
              />

              <MaterialCommunityIcons
                style={styles.icon}
                name="eye-off"
                size={20}
                onPress={() => setHidePass(!hidePass)}
              />
            </View>
            {passwordError ? (
              <Text style={styles.termConditionText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.nextInputTextContainer}>
            <Text style={styles.textInputHeading}>
              {t('enter_referral_code_optional')}
            </Text>

            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                style={styles.icon}
                name="tag-heart"
                size={20}
              />
              <TextInput
                style={styles.textInput}
                value={ref_code}
                onChangeText={ref_code => onChangeref_code(ref_code)}
              />
            </View>
            {ref_codeError ? (
              <Text style={styles.termConditionText}>{ref_codeError}</Text>
            ) : null}
          </View>

          <Button
            mode="contained"
            style={{marginTop: 30}}
            theme={{colors: {primary: BaseColor.primary}}}
            onPress={() => {
              signUp();
            }}
            loading={signupLoader}
            labelStyle={styles.functionalLabelBtn}>
            {t('sign_up')}
          </Button>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.notRegister}>
            {t('if_you_have_account')}{' '}
              <Text style={{color: BaseColor.primary}}>{t('login_here')}</Text>{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({});
