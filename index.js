/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/index';
import {name as appName} from './app.json';
import {initI18n} from './i18nSetup';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

initI18n();

PushNotification.createChannel(
  {
    channelId: 'grocerycustomerapp', // (required)
    channelName: 'grocerycustomerapp', // (required)
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
