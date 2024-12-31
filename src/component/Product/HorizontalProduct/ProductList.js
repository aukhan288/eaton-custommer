import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator
} from 'react-native';
import {Card, Button} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BaseColor, useTheme} from '../../../config/theme';
import {useSelector, useDispatch} from 'react-redux';
import * as cartAction from '../../../store/actions/CartAction';
import * as couponAction from '../../../store/actions/CouponAction';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { API_BASE_URL } from '../../../constants/Url';
import * as fevoriteAction from '../../../store/actions/FevoriteAction'; 
const {height, width}=Dimensions.get('screen')
const ProductList = props => {
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  console.log(auth_mobile);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const navigation = useNavigation();
  const cartProducts = useSelector((state) => state.CartReducer.cartProducts);
  const fevoriteProducts = useSelector((state) => state.FevoriteReducer.fevoriteProducts);
  const theme = useTheme();
  const {t} = useTranslation()
  const [pgms, setPgms] = useState(props.pgms_pprice[0].product_type);
  const [pprice, setPprice] = useState(props.pgms_pprice[0].product_price);

  const [quntityBtn, setQuntityBtn] = useState(false);
  const [productTypePriceId, setProductTypePriceId] = useState(
    props.pgms_pprice[0].product_type_price_id,
  );
  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );

  const [productCount, setProductCount] = useState(0);
  const dispatch = useDispatch();

  var cartReadyItems = [];
  const favoriteProduct = (productId) => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }

    // Set the loading state for this specific product
    setFavoriteLoading((prev) => ({ ...prev, [productId]: true }));

    var authAPIURL = API_BASE_URL + 'addToFavorite.php';
    
    var header = {
      'Content-Type': 'application/json',
    };

    fetch(authAPIURL, {
      method: 'POST',
      headers: header,
      body: JSON.stringify({
        mobile: auth_mobile,
        token: token,
        productId: productId
      }),
    })
    .then(response => response.json())
    .then(response => {
      if (response?.action === 'added') {
        addToFavorite(productId);
      } else if (response?.action === 'removed') {
        removeFromFevorite(productId);
      }
      // Set the loading state back to false after the request is complete
      setFavoriteLoading((prev) => ({ ...prev, [productId]: false }));
    })
    .catch(error => {
      console.log(error);
      // Set the loading state back to false in case of error
      setFavoriteLoading((prev) => ({ ...prev, [productId]: false }));
    });
  };
  const addToFavorite = useCallback((productId) => {
    dispatch(fevoriteAction.addToFevorite(productId));
  }, [dispatch]);

  const removeFromFevorite = useCallback((productId) => { 
    dispatch(fevoriteAction.removeFromFevorite(productId));
  }, [dispatch]);
  const addToCart = useCallback(() => {
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
    );
    dispatch(cartAction.addToCart(cartReadyItems));
    setProductCount(parseInt(productCount) + 1);
  }, [productCount, dispatch]);

  const removeToCart = useCallback(() => {
    cartReadyItems.push(
      props.product_name,
      props.product_img,
      props.discount,
      props.popular,
      productTypePriceId,
    );
    dispatch(cartAction.removeToCart(cartReadyItems));
    dispatch(couponAction.emptyCoupon());
    setProductCount(parseInt(productCount) - 1);
  }, [productCount, dispatch]);

  return (
    <View key={productTypePriceId} style={styles.container}>
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.theme.background,
            borderColor: theme.theme.textLight,
          },
        ]}>
        {props.discount > 0 ? (
          <Text
            allowFontScaling={false}
            style={[
              styles.discountText,
              {
                color: theme.theme.text,
              },
            ]}>
            {props.discount}{t('discount_percentage')}
          </Text>
        ) : null}

        {props.popular == 1 ? (
          <Text style={styles.popularText}>
            <MaterialCommunityIcons
              name="heart"
              color={BaseColor.danger}
              size={18}
            />
          </Text>
        ) : null}

        <TouchableOpacity onPress={() => props.gotoProductDetails()}>
          <Image style={styles.img} source={{uri: props.product_img}} />
        </TouchableOpacity>
        <Card.Content style={{paddingHorizontal: 0}}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            style={[
              styles.title,
              {
                color: theme.theme.title,
              },
            ]}>
            {props.product_name.length < 28
              ? props.product_name
              : props.product_name.substring(0, 25) + '...'}
          </Text>
          <Pressable 
            onPress={() => favoriteProduct(props?.product_id)}
            style={styles.favoriteButton}
            disabled={favoriteLoading[props.product_id]} // Disable button only for the current product being processed
          >
            {favoriteLoading[props.product_id] ? (
              <ActivityIndicator size={24} color={BaseColor.primary} />
            ) : (
              fevoriteProducts?.includes(props?.product_id) ?
                <Icon name="heart" size={25} style={styles.favoriteIcon} /> :
                <Icon name="heart-outline" size={25} style={styles.favoriteIcon} />
            )}
          </Pressable>
          </View>
        
          
          {props.product_name.length < 18 ? (
            <View style={{marginBottom: 20}}></View>
          ) : null}
          <View style={styles.infoContainer}>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              adjustsFontSizeToFit
              style={[
                styles.infoText,
                {
                  color: theme.theme.title,
                },
              ]}>
              {pgms.length < 8 ? pgms : pgms.substring(0, 8)}
            </Text>

            <Text
              numberOfLines={1}
              allowFontScaling={false}
              adjustsFontSizeToFit
              style={[
                styles.infoText,
                {
                  color: theme.theme.title,
                },
              ]}>
              <MaterialCommunityIcons
                name="currency-gbp"
                style={{fontSize: 12}}
              />
              {pprice}
            </Text>
          </View>
       
        </Card.Content>
        {cartProducts[productTypePriceId]?.quantity>0 ? 
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
              disabled={cartProducts[productTypePriceId]?.quantity > 0 ? false : true}>
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
                {cartProducts[productTypePriceId]?.quantity}
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
              style={styles.addButton}>
              <Ionicons style={styles.quantityIcon} name="add" size={16} />
            </Button>
          </View>
         : 
          <View style={styles.addButtonContainer}>
            <Button
              theme={{
                colors: {
                  primary: '#e69c00',
                  // primary: BaseColor.primary,
                },
              }}
              allowFontScaling={false}
              compact="true"
              mode="contained"
              onPress={() => {
                addToCart();
                setQuntityBtn(true);
              }}
              style={styles.addButton1}
              uppercase={false}
              labelStyle={styles.addButtonLabel}>
              {t('add')}{' '}
              <Ionicons
                style={styles.addButtonIcon}
                name="cart-outline"
                size={12}
              />
            </Button>
          </View>
        }
      </Card>
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginVertical: 10,
    width:width*0.46, 
    height:width*0.7, 
  },

  card: {borderRadius: 8, borderWidth: 1, overflow:'hidden'},

  discountText: {
    backgroundColor: BaseColor.success,
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

  img: {height: width*0.46, height: width*0.33, margin: 0, padding: 0},
  title: {
    marginTop: 5,
    paddingHorizontal: 10,
    fontWeight:'700',
    fontFamily: 'JostRegular',
    // textAlign: 'center',
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  infoText: {
    fontFamily: 'JostRegular',
    fontSize: 13,
    alignSelf: 'center',
  },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeButton: {
    width: 50,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  quantityIcon: {
    color: BaseColor.backgroundColor,
  },
  quantityTextContainer: {
    alignSelf: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontFamily: 'JostMedium',
  },

  addButton: {
    width: 50,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },

  addButtonContainer: {
    width: '100%',
  },
  addButton1: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  addButtonLabel: {
    color: BaseColor.backgroundColor,
    fontFamily: 'JostMedium',
  },
  addButtonIcon: {
    color: BaseColor.backgroundColor,
  },
  favoriteIcon: {
    color: 'red',
  },
});
