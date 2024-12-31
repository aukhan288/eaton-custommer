import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ProductList from './ProductList';
import { useTranslation } from 'react-i18next';
import { BaseColor } from '../../../config/theme';
import {useNavigation} from '@react-navigation/native';

const MatrixProduct = ({
  product,
  setCurrentPage,
  currentPage,
  isLoadingMoreItem,
}) => {
  const {t} = useTranslation()
  const navigation = useNavigation();
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

  return (
    <FlatList
      data={product}
      renderItem={ProductItem}
      keyExtractor={item => item.product_id}
      numColumns={3}
      ListFooterComponent={renderLoader}
      onEndReached={loadMoreItem}
      onEndReachedThreshold={2}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MatrixProduct;

const styles = StyleSheet.create({});
