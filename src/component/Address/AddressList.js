import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import {List, Card} from 'react-native-paper';
import {BaseColor, useTheme} from '../../config/theme';

import {useSelector} from 'react-redux';
import {API_BASE_URL} from '../../constants/Url';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const AddressList = props => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation()
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const deleteAddressPrompt = addressId => {
    Alert.alert('Do you want to delete?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => deleteAddress(addressId),
      },
    ]);
  };

  const setDefaultAddressPrompt = addressId => {
    Alert.alert('Set Default Address?', 'Set this address as default', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => setDefaultAddress(addressId),
      },
    ]);
  };

  const setDefaultAddress = addressId => {
    var authAPIURL = API_BASE_URL + 'setDefaultAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        addressId: addressId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        // apiCall();
        ToastAndroid.show(response.msg, ToastAndroid.SHORT);
        navigation.goBack();
        console.log('setDefaultAddress');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteAddress = addressId => {
    var authAPIURL = API_BASE_URL + 'deleteAddress.php';
    var header = {
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        addressId: addressId,
      }),
    })
      .then(response => response.json())
      .then(response => {
        // apiCall();
        ToastAndroid.show(response.msg, ToastAndroid.SHORT);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Card
      style={[styles.cardContainer, {backgroundColor: theme.theme.background}]}>
      <TouchableOpacity
        onPress={() =>
          props.status == 1 ? null : setDefaultAddressPrompt(props.address_id)
        }
        onLongPress={() =>
          props.status == 1
            ? ToastAndroid.show('This is default address', ToastAndroid.SHORT)
            : deleteAddressPrompt(props.address_id)
        }>
        <List.Item
          title={props.addressType + ' - ' + props.area}
          allowFontScaling={false}
          description={
            <>
              <Text
                style={[
                  styles.listItemText,
                  {
                    color: theme.theme.textLight,
                  },
                ]}
                allowFontScaling={false}>
                {`${props.addressName}, ${props.houseNo}, ${props.landMark}`}
              </Text>
              {props.areaStatus == 0 ? (
                <Text style={styles.listItemDescriptionDanger}>
                  {'\n'}{t('not_deliverable_address')}
                </Text>
              ) : null}
            </>
          }
          left={() => <List.Icon icon="map-marker" color={BaseColor.primary} />}
          right={() =>
            props.status == 1 ? (
              <List.Icon icon="check-decagram" color={BaseColor.success} />
            ) : (
              <List.Icon icon="menu-right-outline" color={BaseColor.danger} />
            )
          }
          style={[
            styles.listItemContainer,
            {borderColor: theme.theme.textLight},
          ]}
          titleStyle={[styles.listItemTitle, {color: theme.theme.title}]}
          descriptionStyle={[
            styles.listItemDescription,
            {color: theme.theme.title},
          ]}
          descriptionNumberOfLines={5}
          titleNumberOfLines={1}
        />
      </TouchableOpacity>
    </Card>
  );
};

export default AddressList;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 0,
    marginBottom: 5,
  },
  listItemContainer: {
    borderWidth: 1,
    borderRadius: 0,
    paddingLeft: 15,
  },
  listItemTitle: {
    fontSize: 14,
    fontFamily: 'JostRegular',
  },
  listItemDescription: {
    fontSize: 12,
    fontFamily: 'JostRegular',
  },
  listItemDescriptionDanger: {
    fontSize: 11,
    fontWeight: '100',
    color: BaseColor.danger,
    marginTop: 5,
    fontFamily: 'JostRegular',
  },
  listItemText: {
    fontFamily: 'JostRegular',
  },
});
