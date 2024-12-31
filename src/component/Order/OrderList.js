import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Card, List, Button, Chip, Subheading} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BaseColor, useTheme} from '../../config/theme';
import * as orderAction from '../../store/actions/OrderAction';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const OrderList = props => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {t} = useTranslation()
  const navigation = useNavigation();
  return (
    <Card
      style={[
        cardStyles.cardContainer,
        {
          borderColor: theme.theme.textLight,
          backgroundColor: theme.theme.background,
        },
      ]}>
      <TouchableOpacity
        onPress={() => {
          dispatch(orderAction.setOrderId(props.order_id));
          navigation.navigate('TrackOrder');
        }}>
        <List.Item
          style={{padding: 0}}
          title={`Order Id : ${props.order_id} `}
          allowFontScaling={false}
          titleStyle={cardStyles.title}
          description={() => (
            <Text
              allowFontScaling={false}
              style={[cardStyles.description, {color: theme.theme.title}]}>
              <MaterialCommunityIcons
                name="currency-gbp"
                style={{fontSize: 14}}
              />
              {props.totalPaidAmt}
            </Text>
          )}
          right={() => (
            <>
              <View style={{flexDirection: 'column', marginRight: 10}}>
                <View style={{alignSelf: 'flex-end', marginBottom: 5}}>
                  <Text
                    style={[
                      cardStyles.description,
                      {color: theme.theme.title},
                    ]}>
                    {props.orderDate}
                  </Text>
                </View>
                <Chip
                  theme={{colors: {primary: BaseColor.primary}}}
                  style={cardStyles.statusChip}>
                  {props.status == 1
                    ? t('order_status_pending')
                    : props.status == 2
                    ? t('order_status_processing')
                    : props.status == 3
                    ? t('order_status_completed')
                    : props.status == 4
                    ? t('order_status_cancelled')
                    : null}
                </Chip>
              </View>
            </>
          )}
        />
      </TouchableOpacity>
    </Card>
  );
};

export default OrderList;

const cardStyles = StyleSheet.create({
  cardContainer: {
    marginVertical: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 0,
  },
  title: {
    color: BaseColor.primary,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: 'JostMedium',
  },
  description: {
    fontFamily: 'JostRegular',
  },
  statusChip: {
    alignSelf: 'flex-end',
  },
});
