import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Card, List} from 'react-native-paper';
import {BaseColor, useTheme} from '../../config/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const OrderItemList = ({
  productImg,
  productName,
  productPrice,
  discount,
  quantity,
  productVariation,
}) => {
  const {t} = useTranslation()
  const theme = useTheme();

  return (
    <Card elevation={0} style={[styles.card, { borderColor: theme.theme.textLight, backgroundColor: theme.theme.background }]}>
    <List.Item
      style={styles.listItem}
      title={productName}
      titleStyle={[styles.title, {color:theme.theme.title}]}
      titleNumberOfLines={1}
      descriptionNumberOfLines={2}
      description={() => (
        <>
          <Text style={[styles.description, {color:theme.theme.title}]}>{productVariation}</Text>
          <View style={[styles.quantityPriceContainer]}>
            <Text style={[styles.quantity, {color:theme.theme.text}]}>{`${t('quantity')}: ${quantity}`}</Text>
            <Text style={[styles.price, {color:theme.theme.title}]}>
              <MaterialCommunityIcons name="currency-gbp" style={styles.currencyIcon} />
              {productPrice}
            </Text>
          </View>
        </>
      )}
      left={() => (
        <Image source={{ uri: productImg }} style={styles.image} />
      )}
    />
  </Card>
  );
};

export default OrderItemList;

const styles = StyleSheet.create({
    card: {
      borderBottomWidth: 1,
      borderRadius: 0,
    },
    listItem: {
      padding: 0,
    },
    title: {
      fontFamily: 'JostMedium',
    },
    description: {
      fontFamily: 'JostRegular',
    },
    quantityPriceContainer: {
      flexDirection: 'row',
    },
    quantity: {
      flex: 1,
      fontFamily: 'JostRegular',
    },
    price: {
      flex: 1,
      alignSelf: 'flex-end',
      alignContent: 'flex-end',
      fontFamily: 'JostRegular',
    },
    currencyIcon: {
      fontSize: 16,
    },
    image: {
      width: 70,
      height: 70,
    },
  });
