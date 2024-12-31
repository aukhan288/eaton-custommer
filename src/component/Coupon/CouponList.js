import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import {
  Card,
  List,
  Paragraph,
  Title,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import * as couponAction from '../../store/actions/CouponAction';
import {useTheme, BaseColor} from '../../config/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const CouponList = props => {
  const theme = useTheme();
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const appliedCoupon = useSelector(state => state.CouponReducer.appliedCoupon);
  const totalAmount = useSelector(state => state.CartReducer.totalAmount);

  const renderCouponStatusIcon = coupon => {
    const isCouponApplied = appliedCoupon.some(
      item => item.coupon_id === coupon.coupon_id,
    );
    if (isCouponApplied) {
      return (
        <Ionicons
          name="checkmark-circle-sharp"
          size={16}
          color={BaseColor.primary}
        />
      );
    }
    return null;
  };

  const handleCouponPress = coupon => {
    const minAmount = parseInt(coupon.min_amt);
    if (minAmount <= parseInt(totalAmount)) {
      dispatch(couponAction.removeApplyCoupon(coupon));
      props.goBack();
    } else {
      ToastAndroid.show(
        `${t('add')} ${minAmount - parseInt(totalAmount)} ${t('coupon_info')}`,
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <Card
      key={props.coupon_id}
      style={[
        styles.cardContainer,
        {borderColor: theme.theme.textLight},
        props.validity === 'Valid'
          ? {backgroundColor: theme.theme.input}
          : {backgroundColor: theme.theme.background},
      ]}>
      <TouchableOpacity
        onPress={() =>
          props.validity === 'Valid'
            ? handleCouponPress(props)
            : ToastAndroid.show('Coupon Expired', ToastAndroid.SHORT)
        }>
        <List.Item
          key={props.coupon_id}
          style={{padding: 0}}
          title={props.coupon_code}
          descriptionNumberOfLines={2}
          titleStyle={styles.title}
          titleNumberOfLines={1}
          description={() => (
            <View style={{flex: 4, flexDirection: 'row'}}>
              <Title style={styles.title}>
                {props.coupon_title} {renderCouponStatusIcon(props)}
              </Title>
            </View>
          )}
          left={() => (
            <Image
              source={{
                uri: props.coupon_img,
              }}
              style={styles.img}
            />
          )}
        />
      </TouchableOpacity>
      {props.coupon_desc && (
        <Paragraph
          style={[styles.description, {color: theme.theme.title}]}
          numberOfLines={2}>
          {props.coupon_desc}
        </Paragraph>
      )}
      <Paragraph
        style={[styles.date, {color: theme.theme.textLight}]}>
        ${t('coupon_valid_till')} {props.coupon_date}
      </Paragraph>
    </Card>
  );
};

export default CouponList;
const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 0,
    marginVertical: 4,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 14,
    color: BaseColor.primary,
    fontFamily: 'JostRegular',
  },
  description: {
    textAlign: 'justify',
    fontSize: 12,
    marginHorizontal: 5,
    fontFamily: 'JostRegular',
  },
  date: {
    paddingHorizontal: 5,
    fontFamily: 'JostRegular',
  },
  img:{
    width: 60,
    height: 60,
    resizeMode: 'contain',
  }
});
