import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, TextInput, ToastAndroid} from 'react-native';
import {List, Avatar, IconButton, Button} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import {API_BASE_URL, BASE_URL} from '../../constants/Url';
import {useIsFocused} from '@react-navigation/native';
import {BaseColor, useTheme} from '../../config/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from './styles';
import Loading from '../Common/Loading';
import { useTranslation } from 'react-i18next';

const Wallet = ({navigation}) => {
  const styles = Styles();
  const isVisible = useIsFocused();
  const theme = useTheme();
  const {t} = useTranslation()
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const name = useSelector(state => state.AuthReducer.name);

  const [amount, setAmount] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [paymentAPIKey, setPaymentAPIKey] = useState(null);
  const [isAPIKeyAvailable, setIsAPIKeyAvailable] = useState(false);
  const [title, setTitle] = useState();
  const [logo, setLogo] = useState();
  const [currency, setCurrency] = useState();

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const onChangeAmount = amount => {
    amount = amount.replace(
      /[`~a-zA-Z !@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    setAmount(amount);
  };

  const fetchWalletAmountAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchWalletAmountByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    var authData = {
      mobile: auth_mobile,
    };

    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(authData),
    })
      .then(response => response.json())
      .then(response => {
        setWalletAmount(response.walletamount);
      });
  };

  const fetchPaymentAPIKeyAPI = () => {
    var fetchProductAPIURL = API_BASE_URL + `fetchPaymentAPIKeyByMobileNo.php`;
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(fetchProductAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if (response.result == 'true') {
          setPaymentAPIKey(response.api_key);
          setIsAPIKeyAvailable(true);
        } else {
          setIsAPIKeyAvailable(false);
        }
      });
  };

  const apiSettingCall = () => {
    var authAPIURL = API_BASE_URL + 'setting.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        setTitle(response.data[0].title);
        setLogo(response.data[0].app_logo);
        setCurrency(response.data[0].currency);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const payNow = () => {
    if (isAPIKeyAvailable) {
      var authAPIURL = API_BASE_URL + 'addWalletAmount.php';
      var header = {
        'Content-Type': 'application/json',
      };

      var options = {
        description: title,
        image: BASE_URL + logo,
        currency: currency,
        key: paymentAPIKey,
        amount: amount * 100,
        name: name,
        prefill: {
          contact: auth_mobile,
          name: name,
        },
        theme: {color: BaseColor.primary},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          fetch(authAPIURL, {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
              mobile: auth_mobile,
              amount: amount,
            }),
          })
            .then(response => response.json())
            .then(response => {
              ToastAndroid.show(response.msg, ToastAndroid.SHORT);
              fetchWalletAmountAPI();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(err => {
          ToastAndroid.show(err.error.description, ToastAndroid.LONG);
        });
    } else {
      ToastAndroid.show('Unable to make Payment', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        setLoading(false)
        apiSettingCall();
        fetchWalletAmountAPI();
        fetchPaymentAPIKeyAPI();
      } else {
        setIsInternetConnected(true)
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    return unsubscribe;
  }, [isVisible]);

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <List.Item
          title={walletAmount}
          titleStyle={styles.title}
          descriptionStyle={styles.description}
          description="Current Wallet Amount"
          left={props => (
            <Avatar.Icon
              {...props}
              icon="wallet"
              color={BaseColor.backgroundColor}
              theme={{ colors: { primary: BaseColor.primary } }}
            />
          )}
          right={props => (
            <IconButton
              {...props}
              icon="dots-vertical"
              onPress={() => {
                navigation.navigate('WalletHistory');
              }}
              color={theme.theme.text}
            />
          )}
        />

        <View style={styles.walletItemContainer}>
          <Text style={styles.walletLabel}>
            {t('add_wallet_funds')}
          </Text>

          <View style={styles.walletInputContainer}>
            <MaterialCommunityIcons
              name="wallet"
              size={20}
              color={theme.theme.title}
            />
            <TextInput
              style={styles.walletInput}
              keyboardType="numeric"
              value={amount.toString()}
              onChangeText={amount => onChangeAmount(amount)}
            />
          </View>
        </View>

        <Button
          mode="contained"
          style={styles.payNowButton}
          theme={{ colors: { primary: BaseColor.primary } }}
          labelStyle={{ color: 'white' }}
          onPress={() => {
            payNow();
          }}>
          {t('pay_now')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Wallet;
