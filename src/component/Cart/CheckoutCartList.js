import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Card, Caption, List} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BaseColor, useTheme} from '../../config/theme';
import { useTranslation } from 'react-i18next';

const CheckoutCartList = props => {
  const theme = useTheme();
const {t} = useTranslation();
  return (
    <Card
      style={[
        cardStyles.cardContainer,
        {backgroundColor: theme.theme.background},
      ]}>
      <List.Item
        key={props.product_type_price_id}
        keyExtractor={props.product_type_price_id}
        style={{padding: 0}}
        title={props.product_name}
        titleStyle={[
          cardStyles.titleText,
          {
            color: theme.theme.title,
          },
        ]}
        titleNumberOfLines={1}
        descriptionNumberOfLines={2}
        description={() => (
          <View style={{marginVertical: 8}}>
            <Text
              style={[
                cardStyles.descriptionText,
                {
                  color: theme.theme.textLight,
                },
              ]}
              allowFontScaling={false}>
              <MaterialCommunityIcons
                name="currency-gbp"
                style={{fontSize: 13}}
              />
              {props.productPrice} * {props.productQuantity} {t('item')} (
              {props.productVariation})
            </Text>
          </View>
        )}
        left={() => (
          <>
            <Image source={{uri: props.product_img}} style={cardStyles.img} />
          </>
        )}
        right={() => (
          <View style={cardStyles.rightContainer}>
            <Text
              style={[cardStyles.productPriceText, {color: theme.theme.text}]}
              allowFontScaling={false}>
              <MaterialCommunityIcons
                name="currency-gbp"
                style={{fontSize: 16}}
              />
              {Math.ceil(
                (props.productPrice *
                  props.productQuantity *
                  (100 - props.discount)) /
                  100,
              )}
            </Text>
          </View>
        )}
      />
    </Card>
  );
};

export default CheckoutCartList;

const cardStyles = StyleSheet.create({
  cardContainer: {
    borderRadius: 5,
    marginHorizontal: 2,
  },
  titleText: {fontSize: 14, fontFamily: 'JostRegular'},
  descriptionText: {
    fontSize: 12,
    textAlign: 'justify',
    fontFamily: 'JostRegular',
  },
  productPriceText: {
    fontFamily: 'JostRegular',
  },
  rightContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 10,
  },
  img: {width: 70, height: 70},
});
