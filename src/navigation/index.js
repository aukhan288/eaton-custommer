import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useTheme, BaseColor} from '../config/theme';
import RootStack from './RootStack';
import {useColorScheme, StatusBar} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as applicationActions from '../store/actions/ApplicationAction';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {check, PERMISSIONS, RESULTS, requestNotifications, checkNotifications, openSettings} from 'react-native-permissions';

const Navigator = () => {
  const {theme} = useSelector(state => state.ApplicationReducer);
  const myTheme = useTheme();

  useEffect(() => {
    checkNotifications().then(({status, settings}) => {
      console.log('check', status);
      if (status != 'granted') {
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {
          console.log('request', status);
          // openSettings().catch(() => console.warn('cannot open settings'));
        });
      }
    });

    checkPermission();
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);

  const checkPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  };

  useEffect(() => {
    StatusBar.setBarStyle(
      theme === 'light' ? 'dark-content' : 'light-content',
      true,
    );
    StatusBar.setBackgroundColor(myTheme.theme.background);
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};
export default Navigator;
