import React, {useState, useCallback, useEffect} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';
import * as cartAction from '../../store/actions/CartAction';
import * as couponAction from '../../store/actions/CouponAction';
import {BaseColor, useTheme} from '../../config/theme';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../../constants/Url';

const CartList = props => {
  console.log('zzzzzz',props);
  
  const {t} = useTranslation()
  const theme = useTheme();
  const productTypePriceId = props.product_type_price_id;
  const dispatch = useDispatch();
  const [productCount, setProductCount] = useState(props.productQuantity);

  var cartReadyItems = [];
  cartReadyItems.push(
    props.item,
  );
  // cartReadyItems.push(
  //   props.product_name,
  //   props.product_img,
  //   props.discount,
  //   props.popular,
  //   productTypePriceId,
  // );

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
          <View style={styles.imageContainer}>
            {props.item.discount > 0 ? (
              <Text allowFontScaling={false} style={styles.discount}>
                {props.item.discount} {t('discount_percentage')}
              </Text>
            ) : null}

            {props.popular == 1 ? (
              <Text style={styles.popular}>
                <MaterialCommunityIcons name="heart" />
              </Text>
            ) : null}
            <TouchableOpacity>
              <Image
                source={{
                  uri: BASE_URL+props.item.main_img,
                }}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.theme.title,
                },
              ]}
              allowFontScaling={false}>
              {props?.item?.product_name?.length < 28
                ? props?.item?.product_name
                : props?.item?.product_name?.substring(0, 25) + '...'}
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
                        (props?.item?.price * (100 - props?.item?.discount)) / 100,
                      )
                    : props?.item?.price}
                </Text>

                {props?.item?.discount > 0 ? (
                  <Text style={styles.saveText} allowFontScaling={false}>
                    {'   '}{t('save')}
                    <MaterialCommunityIcons
                      name="currency-gbp"
                      style={{fontSize: 11}}
                    />
                    {props?.item?.price -
                      Math.ceil(
                        (props?.item?.price * (100 - props?.item?.discount)) / 100,
                      )}
                  </Text>
                ) : null}
              </Text>
              {props?.item?.discount > 0 ? (
                <Caption
                  allowFontScaling={false}
                  style={[styles.price, {color: theme.theme.text}]}>
                  {t('mrp')} :
                  <MaterialCommunityIcons
                    name="currency-gbp"
                    style={{fontSize: 12}}
                  />
                  <Text>{props?.item?.price}</Text>
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
                  {props.productVariation}
                </Text>
              </View>
              <View style={styles.quantityContainer}>
                <View style={styles.innerQuantityContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      
                      dispatch(cartAction.removeToCart(cartReadyItems));
                      dispatch(couponAction.emptyCoupon());
                      setProductCount(productCount - 1);
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
                      {parseInt(props?.item?.quantity)}
                      {console.log('ppppppppppp',props)
                      
                      }
                      {/* {parseInt(productCount)} */}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(cartAction.addToCart(cartReadyItems));
                      setProductCount(productCount + 1);
                    }}
                    style={styles.add}>
                    <Ionicons style={styles.icon} name="add" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default CartList;
const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 5,
  },

  cardContainer: {
    height: Dimensions.get('window').height / 5.2,
    borderRadius: 0,
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 100,
  },
  discount: {
    backgroundColor: 'green',
    color: 'white',
    width: 65,
    borderRadius: 50,
    paddingLeft: 8,
    position: 'absolute',
    top: 3,
    left: 5,
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
