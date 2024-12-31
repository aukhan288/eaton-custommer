import React from 'react';
import {StyleSheet, View, Image, FlatList, Dimensions} from 'react-native';
import {Subheading} from 'react-native-paper';
import CartList from './CartList';
import {useTranslation} from 'react-i18next';
import NotFound from '../../screens/Common/NotFound';

const VerticalCart = ({cartProductsJson}) => {
  console.log('*********ddddddddd',cartProductsJson);
  
  const {t} = useTranslation();
  const renderItem = ({item}) => (
    <CartList
      item={item}
      // product_type_price_id={item.id}
      // productPrice={item.price}
      // productVariation={item[1].productVariation}
      // productQuantity={item[1].quantity}
      // product_name={item.product_name}
      // product_img={item.main_img}
      // discount={item.discount}
      // popular={item[1].popular}
    />
  );
  return (
    <FlatList
      data={cartProductsJson}
      renderItem={renderItem}
      keyExtractor={item => item.id}
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
