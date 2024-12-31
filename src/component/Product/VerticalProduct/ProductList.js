import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Card, Caption} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import * as cartAction from '../../../store/actions/CartAction';
import * as couponAction from '../../../store/actions/CouponAction';
import {useTheme, BaseColor} from '../../../config/theme';
import { useTranslation } from 'react-i18next';

const ProductList = props => {
  console.log('pppppp',props);
  
  const theme = useTheme();
  const {t} = useTranslation()

  const [productCount, setProductCount] = useState(0);
  const [quntityBtn, setQuntityBtn] = useState(false);
  const dispatch = useDispatch();
  let cartReadyItems = [];

  useEffect(() => {
    setProductCount(0);
    setQuntityBtn(false);
  }, [props]);

  return (
    <View style={styles.mainContainer}>
      <Card
        style={[
          styles.cardContainer,
          {
            backgroundColor: theme.theme.background,
          },
        ]}>
        <View style={styles.rowContainer}>
       

          <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            {props.discount > 0 ? (
              <Text allowFontScaling={false} style={styles.discount}>
                {props.discount}{t('discount_percentage')}
              </Text>
            ) : null}

            {props.popular == 1 ? (
              <Text style={styles.popular}>
                <MaterialCommunityIcons name="heart" />
              </Text>
            ) : null}
            <TouchableOpacity onPress={() => props.gotoProductDetails()}>
              <Image
                source={{
                  uri: props.product_img,
                }}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
            <Text
              style={[
                styles.title,
                {
                  color: theme.theme.title,
                },
              ]}
              allowFontScaling={false}>
              {props.product_name.length < 28
                ? props.product_name
                : props.product_name.substring(0, 25) + '...'}
            </Text>

            <View style={styles.priceContainer}>
              <Text
                style={[styles.price, {color: theme.theme.text}]}
                allowFontScaling={false}>
                <MaterialCommunityIcons
                  name="currency-gbp"
                  style={{fontSize: 14}}
                  allowFontScaling={false}
                />
                <Text allowFontScaling={false}>
                  {props.discount > 0
                    ? Math.ceil(
                        (props.pgms_pprice[0].product_price *
                          (100 - props.discount)) /
                          100,
                      )
                    : props.pgms_pprice[0].product_price}
                </Text>

                {props.discount > 0 ? (
                  <Text style={styles.saveText} allowFontScaling={false}>
                    {'   '}{t('save')}
                    <MaterialCommunityIcons
                      name="currency-gbp"
                      style={{fontSize: 11}}
                    />
                    {props.pgms_pprice[0].product_price -
                      Math.ceil(
                        (props.pgms_pprice[0].product_price *
                          (100 - props.discount)) /
                          100,
                      )}
                  </Text>
                ) : null}
              </Text>
              {props.discount > 0 ? (
                <Caption
                  allowFontScaling={false}
                  style={[styles.price, {color: theme.theme.text}]}>
                  {t('mrp')} :
                  <MaterialCommunityIcons
                    name="currency-gbp"
                    style={{fontSize: 12}}
                  />
                  <Text>{props.pgms_pprice[0].product_price}</Text>
                </Caption>
              ) : null}
            </View>

            <View style={styles.rowContainer}>
              <View
                style={[
                  styles.typeButton,
                  {borderColor: theme.theme.textLight},
                ]}>
                <Text
                  numberOfLines={1}
                  allowFontScaling={false}
                  style={[styles.productType, {color: theme.theme.text}]}>
                  {props.pgms_pprice[0].product_type}
                </Text>
              </View>
              {/* <View style={styles.quantityContainer}>
                <View style={styles.innerQuantityContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      cartReadyItems.push(
                        props.product_name,
                        props.product_img,
                        props.discount,
                        props.popular,
                        props.pgms_pprice[0].product_type_price_id,
                      );
                      dispatch(cartAction.removeToCart(cartReadyItems));
                      dispatch(couponAction.emptyCoupon());
                      setProductCount(parseInt(productCount) - 1);
                    }}
                    style={styles.remove}
                    disabled={productCount > 0 ? false : true}>
                    <Ionicons
                      style={{color: BaseColor.backgroundColor}}
                      name="remove"
                      size={16}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      alignSelf: 'center',
                    }}
                    allowFontScaling={false}>
                    <Text style={[styles.qtyText, {color: theme.theme.title}]}>
                      {parseInt(productCount)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      cartReadyItems.push(
                        props.product_name,
                        props.product_img,
                        props.discount,
                        props.popular,
                        props.pgms_pprice[0].product_type_price_id,
                      );
                      dispatch(cartAction.addToCart(cartReadyItems));
                      setProductCount(parseInt(productCount) + 1);
                    }}
                    style={styles.add}>
                    <Ionicons style={styles.icon} name="add" size={16} />
                  </TouchableOpacity>
                </View>
              </View> */}
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 5,
  },

  cardContainer: {
    height: Dimensions.get('window').height / 5.2,
    borderRadius: 0,
    padding: 10,
    // width: Dimensions.get('window').width / 2,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
    
  },
  imageContainer: {
    // width: 100,
  },
  discount: {
    backgroundColor: 'green',
    color: 'white',
    width: 65,
    borderRadius: 50,
    paddingLeft: 8,
    position: 'absolute',
    top: 3,
    left: -5,
    zIndex: 999,
    fontSize: 12,
  },
  popular: {
    color: BaseColor.primary,
    paddingLeft: 8,
    position: 'absolute',
    top: 3,
    right: 5,
    zIndex: 999,
  },
  image: {
    height: 120,
    borderRadius: 10,
  },
  contentContainer: {
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  title: {fontFamily: 'JostMedium', fontSize: 16},
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {fontFamily: 'JostRegular'},
  saveText: {
    fontSize: 11,
    color: BaseColor.primary,
    fontFamily: 'JostRegular',
  },
  typeButton: {
    borderRadius: 5,
    borderWidth: 1,
    width: 60,
    marginRight: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  productType: {
    fontSize: 12,

    fontFamily: 'JostRegular',
  },
  quantityContainer: {width: 110},
  innerQuantityContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  remove: {
    width: 35,
    borderRadius: 5,
    borderBottomLeftRadius: 10,
    backgroundColor: BaseColor.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 12,
    fontFamily: 'JostMedium',
  },

  add: {
    width: 35,
    borderRadius: 5,
    borderBottomRightRadius: 10,
    backgroundColor: BaseColor.primary,
    justifyContent: 'center', //Centered vertically
    alignItems: 'center',
  },
  icon: {color: BaseColor.backgroundColor},
});
