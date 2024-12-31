import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {Avatar, Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authActions from '../../store/actions/AuthAction';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';

import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangePassword = ({navigation}) => {
  const styles = Styles();
  const theme = useTheme();
  const {t} = useTranslation();

  const dispatch = useDispatch();

  const [mobile, setMobile] = useState();
  const [password, setPassword] = useState('');
  const [passwordError, setpasswordError] = useState();
  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);

  const [hidePass, setHidePass] = useState(true);
  const [fcmToken, setFcmToken] = useState(null);

  React.useEffect(() => {
    setTimeout(async () => {
      firebase.messaging().subscribeToTopic('rishabh');
      getToken = await firebase.messaging().getToken();
      setFcmToken(getToken);
    });
  }, []);

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

  const changePassword = async () => {
    setLoginLoader(true);
    if (isValidPasswordPattern == true) {
      try {
        await dispatch(authActions.changePassword(mobile, password, fcmToken));
        navigation.navigate('Home');
      } catch (err) {
        // console.log();
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
          <Avatar.Image
            size={120}
            source={require('../../assets/image/reset_password.png')}
            style={styles.logoIcon}
          />
          <Text style={styles.mainHeding}>{t('change_password')}</Text>
          <Text style={styles.subHeading}>
            {t('hello_welcome_back_to_our_account')}
          </Text>

          <View style={styles.firstInputTextContainer}>
            <Text style={styles.textInputHeading}>{t('Enter Password')}</Text>

            <View style={styles.textInputContainer}>
              <MaterialCommunityIcons
                name="lock"
                size={20}
                style={styles.icon}
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
            onPress={() => {
              changePassword();
            }}
            loading={loginLoader}
            labelStyle={styles.functionalLabelBtn}>
            {t('change_password')}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
