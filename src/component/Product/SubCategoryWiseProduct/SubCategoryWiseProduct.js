import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import React from 'react';
import ProductList from './ProductList';
import { useNavigation } from '@react-navigation/native';
import NotFound from '../../../screens/Common/NotFound';

const SubCategoryWiseProduct = ({product}) => {
  const navigation = useNavigation()


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
    <View>
      <View style={{ width: width }}>
        <FlatList
          data={category}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          renderItem={({ item }) => <CatItem item={item} />}
          keyExtractor={item => item.category_id.toString()}
        />
      </View>
      <FlatList
        data={product}
        keyExtractor={(item, index) => String(index)}
        renderItem={ProductItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NotFound text="Product not Found!" />}
      />
    </View>

  );
};

export default SubCategoryWiseProduct;

const styles = StyleSheet.create({});
