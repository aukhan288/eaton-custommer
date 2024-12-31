import React from 'react';
import {StyleSheet, View, Image, FlatList, Dimensions} from 'react-native';
import {Subheading} from 'react-native-paper';
import CartList from './CartList';
import {useTranslation} from 'react-i18next';
import NotFound from '../../screens/Common/NotFound';

const VerticalCart = ({cartProductsJson}) => {
  console.log('ddddddddd',cartProductsJson);
  
  const {t} = useTranslation();
  const renderItem = ({item}) => (
    <CartList
      product_type_price_id={item[0]}
      productPrice={item[1].productPrice}
      productVariation={item[1].productVariation}
      productQuantity={item[1].quantity}
      product_name={item[1].product_name}
      product_img={item[1].main_img}
      discount={item[1].discount}
      popular={item[1].popular}
    />
  );
  return (
    <FlatList
      data={cartProductsJson}
      renderItem={renderItem}
      keyExtractor={item => item[0]}
      showsVerticalScrollIndicator={false}
      style={{marginBottom: 50}}
      ListEmptyComponent={
        <View
          style={{
            height: Dimensions.get('window').width,
          }}>
          <NotFound text={t('no_items_in_cart')} />
        </View>
      }
    />
  );
};

export default VerticalCart;

const styles = StyleSheet.create({});
