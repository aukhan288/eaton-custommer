import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  Linking,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import * as authActions from '../../store/actions/AuthAction';
import {useSelector, useDispatch} from 'react-redux';
import Share from 'react-native-share';
import {API_BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import Styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as applicationActions from '../../store/actions/ApplicationAction';
import {useTranslation} from 'react-i18next';
import {Header} from '../../component';

const Menu = ({navigation}) => {
  const {t} = useTranslation();

  const theme = useTheme();
  const styles = Styles();
  const {name, mobile, isLoggedIn} = useSelector(state => state.AuthReducer);
  const [profileImg, updateProfileImg] = useState(null);
  const [refCode, setRefCode] = useState();

  const dispatch = useDispatch();
  const defaultTheme = useSelector(state => state.ApplicationReducer.theme);

  const handleToggle = () => {
    defaultTheme === 'dark'
      ? dispatch(applicationActions.onChangeTheme('light'))
      : dispatch(applicationActions.onChangeTheme('dark'));
  };

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchProfilePic.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: mobile,
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        updateProfileImg(response.data.profilePicturePath);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchRefCodeByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: mobile,
    };

    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        setRefCode(response.ref_code);
      });
  };

  useEffect(() => {
    apiCall();
    fetchWalletAmountAPI();
  }, [mobile]);

  const shareApp = async () => {
    try {
      const ShareResponse = await Share.open({
        title: 'Grocery App',
        url: '',
        message: isLoggedIn
          ? 'Download now: https://play.google.com/store/apps/details?id=com.groceryapp \nUse My referral code: ' +
            refCode
          : 'Download now: https://play.google.com/store/apps/details?id=com.groceryapp',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const rateApp = () => {
    Linking.openURL('market://details?id=com.groceryapp');
  };

  return (
    <SafeAreaView
      style={{backgroundColor: theme.theme.darkBackground, flex: 1}}>
      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>
                isLoggedIn
                  ? navigation.navigate('Profile')
                  : navigation.navigate('Login')
              }>
              <Image source={{uri: profileImg}} style={styles.profileImage} />
            </TouchableOpacity>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>
                {t('hi')} {isLoggedIn ? name : 'User'}
              </Text>
              <Text style={styles.profileUpdate}>
                {isLoggedIn ? `${t('+92')} ${mobile}` : t('waiting_for_login')}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleToggle}>
            <View style={styles.toggleButton}>
              <MaterialCommunityIcons
                name="white-balance-sunny"
                size={24}
                style={
                  defaultTheme === 'dark'
                    ? styles.sunnyIconDark
                    : styles.sunnyIcon
                }
              />
              <MaterialCommunityIcons
                name="moon-waning-crescent"
                size={24}
                style={
                  defaultTheme === 'light'
                    ? styles.moonIconDark
                    : styles.moonIcon
                }
              />
            </View>
          </TouchableOpacity>
        </View>
        {isLoggedIn ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Order')}
              style={styles.button}>
              <Text style={styles.buttonText}>{t('your_order')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Address')}
              style={styles.button}>
              <Text style={styles.buttonText}>{t('address')}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Language')}
            style={styles.button}>
            <Text style={styles.buttonText}>{t('language')}</Text>
          </TouchableOpacity>
          {isLoggedIn ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Wallet')}
              style={styles.button}>
              <Text style={styles.buttonText}>{t('wallet')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.button}>
              <Text style={styles.buttonText}>{t('login')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <Header title={t('menu')} />

            <TouchableOpacity
              onPress={() => navigation.navigate('ContactUs')}
              style={styles.menuContainer}>
              <View style={styles.content}>
                <MaterialCommunityIcons
                  name="phone"
                  size={24}
                  color={BaseColor.primary}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('contact_us')}</Text>
              </View>
              <MaterialCommunityIcons
                name="menu-right"
                size={24}
                color={theme.theme.text}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('About')}
              style={styles.menuContainer}>
              <View style={styles.content}>
                <MaterialCommunityIcons
                  name="alpha-b-box"
                  size={24}
                  color={BaseColor.primary}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('about_us')}</Text>
              </View>
              <MaterialCommunityIcons
                name="menu-right"
                size={24}
                color={theme.theme.text}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('PrivacyPolicy')}
              style={styles.menuContainer}>
              <View style={styles.content}>
                <MaterialCommunityIcons
                  name="clipboard-flow"
                  size={24}
                  color={BaseColor.primary}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('privacy_policy')}</Text>
              </View>
              <MaterialCommunityIcons
                name="menu-right"
                size={24}
                color={theme.theme.text}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('TermsCondition')}
              style={styles.menuContainer}>
              <View style={styles.content}>
                <MaterialCommunityIcons
                  name="alpha-t-box"
                  size={24}
                  color={BaseColor.primary}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('terms_and_condition')}</Text>
              </View>
              <MaterialCommunityIcons
                name="menu-right"
                size={24}
                color={theme.theme.text}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('RefundPolicy')}
              style={styles.menuContainer}>
              <View style={styles.content}>
                <MaterialCommunityIcons
                  name="cash-refund"
                  size={24}
                  color={BaseColor.primary}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('refund_policy')}</Text>
              </View>
              <MaterialCommunityIcons
                name="menu-right"
                size={24}
                color={theme.theme.text}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareApp()}
              style={styles.menuContainer}>
              <View style={styles.content}>
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color={BaseColor.primary}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('share_app')}</Text>
              </View>
              <MaterialCommunityIcons
                name="menu-right"
                size={24}
                color={theme.theme.text}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => rateApp()}
              style={styles.menuContainer}>
              <View style={styles.content}>
                <MaterialCommunityIcons
                  name="heart"
                  size={24}
                  color={BaseColor.primary}
                  style={styles.icon}
                />
                <Text style={styles.text}>{t('rate_app')}</Text>
              </View>
              <MaterialCommunityIcons
                name="menu-right"
                size={24}
                color={theme.theme.text}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            {isLoggedIn ? (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Logout', 'Really want to logout?', [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {text: 'OK', onPress: () => dispatch(authActions.logout())},
                  ])
                }
                style={styles.menuContainer}>
                <View style={styles.content}>
                  <MaterialCommunityIcons
                    name="logout"
                    size={24}
                    color={BaseColor.primary}
                    style={styles.icon}
                  />
                  <Text style={styles.text}>{t('logout')}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.menuContainer}>
                <View style={styles.content}>
                  <MaterialCommunityIcons
                    name="location-enter"
                    size={24}
                    color={BaseColor.primary}
                    style={styles.icon}
                  />
                  <Text style={styles.text}>{t('login')}</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Menu;
