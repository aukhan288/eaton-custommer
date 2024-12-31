import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Card, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import * as cartAction from '../../../store/actions/CartAction';
import * as couponAction from '../../../store/actions/CouponAction';
import {BaseColor, useTheme} from '../../../config/theme';
import { useTranslation } from 'react-i18next';

const ProductList = props => {
  const theme = useTheme();
  const {t} = useTranslation()

  const dispatch = useDispatch();

  const [quntityBtn, setQuntityBtn] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [pgms, setPgms] = useState(props.pgms_pprice[0].product_type);
  const [pprice, setPprice] = useState(props.pgms_pprice[0].product_price);
  const [productTypePriceId, setProductTypePriceId] = useState(
    props.pgms_pprice[0].product_type_price_id,
  );

  const addToCart = useCallback(() => {
    const cartReadyItems = [
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
    ];
    dispatch(cartAction.addToCart(cartReadyItems));
    setProductCount(parseInt(productCount) + 1);
  }, [productCount, dispatch]);

  const removeToCart = useCallback(() => {
    const cartReadyItems = [
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
    ];
    dispatch(cartAction.removeToCart(cartReadyItems));
    dispatch(couponAction.emptyCoupon());
    setProductCount(parseInt(productCount) - 1);
  }, [productCount, dispatch]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {props.discount > 0 && (
          <Text style={styles.discountText}>{props.discount}{t('discount_percentage')}</Text>
        )}
        {props.popular == 1 && (
          <Text style={styles.popularText}>
            <MaterialCommunityIcons
              name="heart"
              color={BaseColor.danger}
              size={18}
            />
          </Text>
        )}
        <TouchableOpacity onPress={() => props.gotoProductDetails()}>
          <Image style={styles.img} source={{uri: props.product_img}} />
        </TouchableOpacity>
        <Card.Content style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {props.product_name.length < 28
              ? props.product_name
              : props.product_name.substring(0, 25) + '...'}
          </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText} numberOfLines={1}>
              {pgms.length < 8 ? pgms : pgms.substring(0, 8)}
            </Text>
            <Text style={styles.infoText} numberOfLines={1}>
              <MaterialCommunityIcons
                name="currency-gbp"
                style={styles.currencyIcon}
              />
              {pprice}
            </Text>
          </View>
        </Card.Content>
        {quntityBtn ? (
          <View style={styles.quantityContainer}>
            <Button
              theme={{
                colors: {
                  primary: BaseColor.primary,
                },
              }}
              onPress={() => {
                removeToCart();
              }}
              compact="true"
              mode="contained"
              style={styles.removeButton}
              disabled={productCount > 0 ? false : true}>
              <Ionicons style={styles.quantityIcon} name="remove" size={16} />
            </Button>
            <View style={styles.quantityTextContainer} allowFontScaling={false}>
              <Text
                style={[
                  styles.quantityText,
                  {
                    color: theme.theme.title,
                  },
                ]}>
                {parseInt(productCount)}
              </Text>
            </View>
            <Button
              theme={{
                colors: {
                  primary: BaseColor.primary,
                },
              }}
              compact="true"
              mode="contained"
              onPress={() => {
                addToCart();
              }}
              style={styles.addButton1}>
              <Ionicons style={styles.quantityIcon} name="add" size={16} />
            </Button>
          </View>
        ) : (
          <View style={styles.addButtonContainer}>
            <Button
              compact
              mode="contained"
              onPress={() => {
                addToCart();
                setQuntityBtn(true);
              }}
              theme={{
                colors: {
                  primary: BaseColor.primary,
                },
              }}
              style={styles.addButton}
              labelStyle={styles.addButtonLabel}>
              {t('add')}{' '}
              <Ionicons
                name="cart-outline"
                style={styles.addButtonIcon}
                size={12}
              />
            </Button>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 10,
    width: Dimensions.get('window').width / 3.3,
  },
  card: {
    borderRadius: 5,
    borderWidth: 1,
  },
  discountText: {
    backgroundColor: BaseColor.success,
    color: BaseColor.white,
    width: 65,
    borderRadius: 50,
    paddingLeft: 8,
    position: 'absolute',
    top: 3,
    left: 5,
    zIndex: 999,
    fontSize: 12,
    fontFamily: 'JostRegular',
  },
  popularText: {
    color: BaseColor.primary,
    paddingLeft: 8,
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 999,
  },
  img: {
    height: 120,
    margin: 0,
    padding: 0,
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    marginHorizontal: 2,
    textAlign: 'center',
    height: 35,
    textAlignVertical: 'center',
    lineHeight: 16,
    fontFamily: 'JostRegular',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    alignSelf: 'center',
    fontFamily: 'JostRegular',
  },
  currencyIcon: {
    fontSize: 12,
  },
  quantityContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeButton: {
    width: 35,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  addButtonContainer: {
    width: '100%',
  },
  addButton: {
    width: '100%',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  addButtonLabel: {
    color: BaseColor.backgroundColor,
    fontFamily: 'JostMedium',
  },
  addButtonIcon: {
    color: BaseColor.backgroundColor,
  },
  quantityTextContainer: {
    alignSelf: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontFamily: 'JostMedium',
  },
  quantityIcon: {
    color: BaseColor.backgroundColor,
  },
  addButton1:{width: 35,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,}
});

export default ProductList;
