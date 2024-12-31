import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import React from 'react';
import ProductList from './ProductList';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BaseColor } from '../../../config/theme';

const VerticalProduct = ({product, currentPage, setCurrentPage, isLoadingMoreItem, marginBottom}) => {
  
  const navigation = useNavigation()
  const {t} = useTranslation()

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const renderLoader = () => {
    return isLoadingMoreItem ? (
      <View style={{marginVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="large" color={BaseColor.primary} />
        <Text style={{fontSize: 12}}>{t('loading_kirana')}</Text>
      </View>
    ) : null;
  };

  const ProductItem = ({item}) => (
    <ProductList
      product_id={item.product_id}
      product_name={item.product_name}
      product_img={item.product_img}
      discount={item.discount}
      pgms_pprice={item.pgms_pprice}
      popular={item.popular}
      gotoProductDetails={() => {
        navigation.navigate('ProductDetails', {
          screen: 'ProductDetails',  
          product_id: item.product_id,
          product_name: item.product_name,
          product_img: item.product_img,
          discount: item.discount,
          pgms_pprice: item.pgms_pprice,
          popular: item.popular,
        });
      }}
    />
  );

  return (
    <FlatList
      data={product}
      keyExtractor={(item, index) => String(index)}
      renderItem={ProductItem}
      style={{marginBottom: marginBottom}}
      ListFooterComponent={renderLoader}
      onEndReached={loadMoreItem}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default VerticalProduct;

const styles = StyleSheet.create({});
