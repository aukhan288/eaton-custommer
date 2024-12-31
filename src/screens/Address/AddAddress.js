import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';

import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddAddress = ({navigation}) => {
  const styles = Styles();
  const theme = useTheme();
  const {t} = useTranslation();

  const auth_name = useSelector(state => state.AuthReducer.name);
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const [area, setArea] = useState([]); //set fetch from api

  const [name, setName] = useState(auth_name);
  const [addressType, setAddressType] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [landMark, setLandMark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const [nameError, setErrorName] = useState();
  const [addressTypeError, setAddressTypeError] = useState('');
  const [houseNoError, setHouseNoError] = useState('');
  const [landMarkError, setLandMarkError] = useState('');

  const [isValidNamePattern, setIsValidNamePattern] = useState(true);
  const [isValidAddressTypePattern, setIsValidAddressTypePattern] =
    useState(false);
  const [isValidHouseNoPattern, setIsValidHouseNoPattern] = useState(false);
  const [isValidLandMarkPattern, setIsValidLandMarkPattern] = useState(false);

  const onChangeName = name => {
    name = name.replace(/[`~0-9!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    if (name.length < 6) {
      setName(name);
      setErrorName('Enter more than 6 Character');
      setIsValidNamePattern(false);
    }
    if (name.length >= 6) {
      setName(name);
      setErrorName('');
      setIsValidNamePattern(true);
    }
  };

  const onChangeAddressType = addressType => {
    if (addressType.length >= 1) {
      setAddressType(addressType);
      setAddressTypeError('');
      setIsValidAddressTypePattern(true);
    }
    if (addressType.length < 1) {
      setAddressType(addressType);
      setAddressTypeError('Required');
      setIsValidAddressTypePattern(false);
    }
  };

  const onChangeHouseNo = houseNo => {
    if (houseNo.length >= 1) {
      setHouseNo(houseNo);
      setHouseNoError('');
      setIsValidHouseNoPattern(true);
    }
    if (houseNo.length < 1) {
      setHouseNo(houseNo);
      setHouseNoError('Required');
      setIsValidHouseNoPattern(false);
    }
  };

  const onChangeLandMark = landMark => {
    // setLandMark(landMark)
    if (landMark.length >= 1) {
      setLandMark(landMark);
      setLandMarkError('');
      setIsValidLandMarkPattern(true);
    }
    if (landMark.length < 1) {
      setLandMark(landMark);
      setLandMarkError('Required');
      setIsValidLandMarkPattern(false);
    }
  };

  const onChangeCity = city => {
    setCity(city);
  };

  const onChangePincode = pincode => {
    pincode = pincode.replace(
      /[` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      '',
    );
    setPincode(pincode);
  };

  const apiCall = () => {
    var authAPIURL = API_BASE_URL + 'fetchAddressArea.php';
    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
    })
      .then(response => response.json())
      .then(response => {
        if (response.area.length) {
          setArea(response.area);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, []);

  const addAddressApi = () => {
    var authAPIURL = API_BASE_URL + 'addAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        name: name,
        addressType: addressType,
        houseNo: houseNo,
        selectedArea: selectedArea,
        landMark: landMark,
        auth_mobile: auth_mobile,
        token: token,
        city: city,
        pincode: pincode,
      }),
    })
      .then(response => response.json())
      .then(response => {
        ToastAndroid.show(response.msg, ToastAndroid.SHORT);
        setAddressType('');
        setHouseNo('');
        setLandMark('');
        setAddressTypeError('');
        setHouseNoError('');
        setLandMarkError('');
        setCity('');
        setPincode('');
        setIsValidAddressTypePattern(false);
        setIsValidHouseNoPattern(false);
        setIsValidLandMarkPattern(false);
        navigation.navigate('Address');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const addAddress = () => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        if (
          isValidNamePattern == true &&
          isValidAddressTypePattern == true &&
          isValidHouseNoPattern == true &&
          isValidLandMarkPattern == true
        ) {
          if (selectedArea != null) {
            addAddressApi();
          } else {
            ToastAndroid.show('Select Area', ToastAndroid.SHORT);
          }
        } else {
          ToastAndroid.show('All Fields are required', ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
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
              onChangeText={user_name => onChangeName(user_name)}
            />
          </View>
          {nameError ? (
            <Text style={styles.termConditionText}>{nameError}</Text>
          ) : null}
        </View>

        <View style={styles.nextInputTextContainer}>
          <Text style={styles.textInputHeading}>
            {t('enter_address_type_eg_home1')}
          </Text>
          <View style={styles.textInputContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="home-account"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              value={addressType}
              onChangeText={addressType => onChangeAddressType(addressType)}
            />
          </View>
          {addressTypeError ? (
            <Text style={styles.termConditionText}>{addressTypeError}</Text>
          ) : null}
        </View>

        <View style={styles.nextInputTextContainer}>
          <Text style={styles.textInputHeading}>{t('enter_house_number')}</Text>
          <View style={styles.textInputContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="home-floor-1"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              value={houseNo}
              onChangeText={houseNo => onChangeHouseNo(houseNo)}
            />
          </View>
          {houseNoError ? (
            <Text style={styles.termConditionText}>{houseNoError}</Text>
          ) : null}
        </View>

        <View style={styles.nextInputTextContainer}>
          <Text style={styles.textInputHeading}>{t('enter_land_mark')}</Text>
          <View style={styles.textInputContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="home-assistant"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              value={landMark}
              onChangeText={landMark => onChangeLandMark(landMark)}
            />
          </View>
          {landMarkError ? (
            <Text style={styles.termConditionText}>{landMarkError}</Text>
          ) : null}
        </View>

        <View style={styles.nextInputTextContainer}>
          <Text style={styles.textInputHeading}>{t('enter_city')}</Text>
          <View style={styles.textInputContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="home-group"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              value={city}
              onChangeText={city => onChangeCity(city)}
            />
          </View>
          {landMarkError ? (
            <Text style={styles.termConditionText}>{landMarkError}</Text>
          ) : null}
        </View>

        <View style={styles.nextInputTextContainer}>
          <Text style={styles.textInputHeading}>{t('enter_pincode')}</Text>
          <View style={styles.textInputContainer}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="home-group"
              size={20}
            />
            <TextInput
              style={styles.textInput}
              value={pincode}
              onChangeText={pincode => onChangePincode(pincode)}
              keyboardType="numeric"
            />
          </View>
          {landMarkError ? (
            <Text style={styles.termConditionText}>{landMarkError}</Text>
          ) : null}
        </View>

        <Picker
          allowFontScaling={false}
          selectedValue={selectedArea}
          style={styles.pickerStyle}
          mode="dialog"
          onValueChange={(itemValue, itemIndex) => {
            setSelectedArea(itemValue);
          }}>
          <Picker.Item label={t('select_area')} value="null" key="null_key" />
          {area.map((data, index) => {
            return (
              <Picker.Item label={data.name} value={data.name} key={data.id} />
            );
          })}
        </Picker>

        <Button
          mode="contained"
          onPress={() => addAddress()}
          style={{marginVertical: 20, borderColor: BaseColor.primary}}
          labelStyle={styles.functionalLabelBtn}
          theme={{colors: {primary: BaseColor.primary}}}>
          {t('save_address')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddress;

const styles = StyleSheet.create({});
