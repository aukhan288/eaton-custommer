import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductList from './ProductList';
import { BaseColor, useTheme } from '../../../config/theme';

const HorizontalProduct = ({ product }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const renderProductItem = ({ item }) => (
    <ProductList
      {...item}
      gotoProductDetails={() => {
        navigation.navigate('ProductDetails', {
          screen: 'ProductDetails',
          product_id: item.product_id,
          product_name: item.product_name,
          brand_name: item.brand_name,
          product_img: item.product_img,
          discount: item.discount,
          pgms_pprice: item.pgms_pprice,
          product_description: item.product_description,
          popular: item.popular,
          stock: item.stock,
          category: item.category,
          subcategory: item.subcategory,
          banner_img: item.banner_img,
        });
      }}
    />
  );

  return (
    <FlatList
      data={product}
      renderItem={renderProductItem}
      keyExtractor={item => item.product_id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ backgroundColor: theme.theme.background }]}
    />
  );
};

export default HorizontalProduct;

