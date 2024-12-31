import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../screens/Home/Home';
import AllProductList from '../screens/Products/AllProductList';
import Menu from '../screens/Menu/Menu';
import Order from '../screens/Order/Order';
import Offer from '../screens/Products/Offer';
import Notification from '../screens/Notification/Notification';
import {useSelector, useDispatch} from 'react-redux';
import {API_BASE_URL} from '../constants/Url';
import {BaseColor} from '../config/theme';
import Styles from './styles';
import { useTranslation } from 'react-i18next';

const BottomTabScreen = () => {
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const {t} = useTranslation()
  const styles = Styles();

  const [unReadNotificationCount, setUnReadNotificationCount] = useState(0);

  const apiCall = () => {
    
    
    var authAPIURL = API_BASE_URL + 'fetchCountUnReadNotification.php';
    var header = {
      'Content-Type': 'application/json',
    };
    
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(response => {
        setUnReadNotificationCount(response.unreadnotification);
      })
      .catch(error => {
        console.log('unreadnotification >>>>>>>>>>>>>>>>>', error);
      });
  };

  useEffect(() => {
    // apiCall();
  }, [auth_mobile]);

  const Tab = createBottomTabNavigator();

  const TabArr = [
    {
      route: 'Home',
      label: t('home'),
      activeIcon: 'home',
      inActiveIcon: 'home-outline',
      component: Home,
    },
    {
      route: 'Offer',
      label: t('Menu'),
      activeIcon: 'ticket',
      inActiveIcon: 'ticket-outline',
      component: Offer,
    },
    {
      route: 'Order',
      label: t('order'),
      activeIcon: 'bag',
      inActiveIcon: 'bag-outline',
      component: Order,
    },
    {
      route: 'Notification',
      label: t('notification'),
      activeIcon: 'notifications',
      inActiveIcon: 'notifications-outline',
      component: Notification,
    },
    {
      route: 'Menu',
      label: t('menu'),
      activeIcon: 'menu',
      inActiveIcon: 'menu-outline',
      component: Menu,
    },
  ];

  const TabButton = props => {
    const {item, onPress, accessibilityState} = props;
    const focused = accessibilityState.selected;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={styles.tabButton}>
        <View
          style={focused ? styles.iconContainerFocused : styles.iconContainer}>
          <Icon
            size={25}
            name={focused ? item.activeIcon : item.inActiveIcon}
            color={focused ? '#FFFFFF' : '#000'}
            // color={focused ? BaseColor.backgroundColor : BaseColor.gray}
          />
        </View>
        {focused && <Text style={styles.label}>{item.label}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}>
      {TabArr.map((item, index) =>
        (item.route === 'Order' && token) ||
        (item.route === 'Notification' && token) ? (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{ 
              tabBarShowLabel: false,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        ) : item.route === 'Home' ||
          item.route === 'Offer' ||
          item.route === 'Menu' ? (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        ) : null,
      )}
    </Tab.Navigator>
  );
};

export default BottomTabScreen;
