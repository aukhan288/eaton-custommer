import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  Alert
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as cartAction from '../../../store/actions/CartAction';
import * as fevoriteAction from '../../../store/actions/FevoriteAction';
import { BaseColor, useTheme } from '../../../config/theme';
import { API_BASE_URL, BASE_URL } from '../../../constants/Url';
import { ADD_TO_FEVORITE } from '../../../store/actions/type';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height, width } = Dimensions.get('screen');

const GridProduct = ({ product, currentPage, setCurrentPage, isLoadingMoreItem }) => {
  const { name, mobile, isLoggedIn, token } = useSelector(state => state.AuthReducer);
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // State to track loading for individual products
  const [favoriteLoading, setFavoriteLoading] = useState({});

  const cartProducts = useSelector((state) => state.CartReducer.cartProducts);
  const fevoriteProducts = useSelector((state) => state.FevoriteReducer.favoriteProducts);

  const loadMoreItem = () => {
    if (!isLoadingMoreItem) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getProductQuantity = (productTypePriceId) => {
    return cartProducts[productTypePriceId]?.quantity || 0;
  };

  const addToCart = useCallback((item) => {
    const cartItem = [
      item?.product_name,
      item?.product_img,
      item?.discount,
      item?.popular,
      item?.pgms_pprice[0]?.product_type_price_id,
    ]; 
    dispatch(cartAction.addToCart(cartItem));
  }, [dispatch]);

  const removeToCart = useCallback((item) => {
    const cartItem = [
      item.product_name,
      item.product_img,
      item.discount,
      item.popular,
      item?.price,//pgms_pprice[0]?.product_type_price_id,
    ]; 
    dispatch(cartAction.removeToCart(cartItem));
  }, [dispatch]);

  const addToFavorite = useCallback((productId) => {
    dispatch(fevoriteAction.addToFevorite(productId));
  }, [dispatch]);

  const removeFromFavorite = useCallback((productId) => { 
    dispatch(fevoriteAction.removeFromFevorite(productId));
  }, [dispatch]);

  const favoriteProduct = (productId) => {
    if (!isLoggedIn) {
      Alert.alert(
        'Important!', // Title
        'Please login to access this feature.', // Message
        [
          {
            text: 'OK', // OK button to navigate to Login screen
            onPress: () => navigation.navigate('Login'),
          },
          {
            text: 'Cancel', // Cancel button, which does nothing or closes the alert
            onPress: () => console.log('Cancel pressed'),
            style: 'cancel', // This styles the button as a cancel button (typically gray)
          },
        ],
        { cancelable: false } // Ensures the alert can't be dismissed by tapping outside
      );
      return;
    }
    
  
    // Set the loading state for this specific product
    setFavoriteLoading((prev) => ({ ...prev, [productId]: true }));
  
    // const authAPIURL = API_BASE_URL + 'addToFavorite.php';
    const authAPIURL = API_BASE_URL + 'addToFavorite/'+productId;
    console.log('********uuuuuuuuuu',token);
    
  
    const header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    // Make the POST request to add the product to favorites
    fetch(authAPIURL, {
      method: 'GET',
      headers: header,
      // body: JSON.stringify({
      //   mobile: auth_mobile,
      //   token: token,
      //   productId: productId,
      // }),
    })
      .then((response) => response.json())
      .then((response) => {
        // Handle the response based on action
        console.log('pppppppppppp',response);
        
        if (response?.action === 'added') {
          addToFavorite(productId);
        } else if (response?.action === 'removed') {
          removeFromFavorite(productId);
        }
  
        // Set the loading state back to false after the request is complete
        setFavoriteLoading((prev) => ({ ...prev, [productId]: false }));
      })
      .catch((error) => {
        console.error('~~~~~~~~~~~~~~Error adding product to favorites:', error);
        // Set the loading state back to false in case of an error
        setFavoriteLoading((prev) => ({ ...prev, [productId]: false }));
      });
  };
  

  const renderLoader = () => {
    return isLoadingMoreItem ? (
      <View style={{ alignItems: 'center' }}>
        <ActivityIndicator size="large" color={BaseColor.primary} />
        <Text style={{ fontSize: 12 }}>{t('loading_kirana')}</Text>
      </View>
    ) : null;
  };

  const ProductItem = ({ item }) => {
    console.log('iiiiiiiiiii',item);

    const productTypePriceId = item?.price;//item?.pgms_pprice[0]?.product_type_price_id;
    const quantity = getProductQuantity(productTypePriceId);

    return (
      <View style={[styles.productContainer]}>
        <View style={styles.productImageContainer}>
          <Pressable
            onPress={() => {
              navigation.navigate('ProductDetails', {
                screen: 'ProductDetails',
                product_id: item?.id,
                product_name: item.product_name,
                product_description: item.product_description,
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
          >
            <Image source={{ uri: BASE_URL+item?.main_img }} style={styles.productImage} />
          </Pressable>
        </View>
        <View style={styles.productNameContainer}>
          <Text style={styles.productName}>{item?.product_name}</Text>
          <Pressable 
            onPress={() => favoriteProduct(item?.id)}
            style={styles.favoriteButton}
            disabled={favoriteLoading[item?.product_id]} // Disable button only for the current product being processed
          >
            {favoriteLoading[item.id] ? (
              <ActivityIndicator size={24} color={BaseColor.primary} />
            ) : (
              fevoriteProducts?.includes(parseInt(item?.id)) ?
                <Icon name="heart" size={25} style={styles.favoriteIcon} /> :
                <Icon name="heart-outline" size={25} style={styles.favoriteIcon} />
            )}
          </Pressable>
        </View>
        <View style={styles.priceContainer}>

          <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text>Price: </Text>   
          <MaterialCommunityIcons name="currency-gbp" style={styles.currencyIcon} /> 
          <Text>{item?.price || 'N/A'}</Text>
          </View>
          {
  item?.description?.length > 50
    ? <Text>{item.description.substring(0, 50) + '...'}</Text>
    : <Text>{item.description}</Text>
} 

          
        </View>

        {/* {cartProducts[productTypePriceId]?.quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <Button
              theme={{ colors: { primary: BaseColor.primary } }}
              onPress={() => removeToCart(item)}
              compact
              mode="contained"
              style={styles.removeButton}
              disabled={quantity === 0}
            >
              <Icon style={styles.quantityIcon} name="remove" size={16} />
            </Button>
            <View style={styles.quantityTextContainer}>
              <Text style={[styles.quantityText, { color: theme.theme.title }]}>{quantity}</Text>
            </View>
            <Button
              theme={{ colors: { primary: BaseColor.primary } }}
              compact
              mode="contained"
              onPress={() => addToCart(item)}
              style={styles.addButton}
            >
              <Icon style={styles.quantityIcon} name="add" size={16} />
            </Button>
          </View>
        ) : (
          <View style={styles.addButtonContainer}>
            <Button
              theme={{ colors: { primary: '#e69c00' } }}
              compact
              mode="contained"
              onPress={() => addToCart(item)}
              style={styles.addButton1}
              uppercase={false}
              labelStyle={styles.addButtonLabel}
            >
              {t('add')}
              <Icon style={styles.addButtonIcon} name="cart-outline" size={12} />
            </Button>
          </View>
        )} */}
      </View>
    );
  };

  return (
    <FlatList
      data={product}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item }) => <ProductItem item={item} />}
      numColumns={2}
      onEndReached={loadMoreItem}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderLoader}
    />
  );
};

const styles = StyleSheet.create({
  productContainer: {
    width: width * 0.46,
    height: width * 0.65,
    marginBottom: 20,
    backgroundColor: 'white',
    position: 'relative',
    marginHorizontal: width * 0.018,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    elevation: 1.5,
  },
  productImageContainer: {
    height: 140,
    justifyContent: 'center',
    backgroundColor: '#e2e2e2',
  },
  productImage: {
    height: 150,
    width: '100%',
  },
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  productName: {
    fontSize: width * 0.05,
    fontWeight: '700',
    flex: 1,
  },
  favoriteButton: {
    flex: 0.2,
    padding: 5,
  },
  favoriteIcon: {
    color: 'red',
  },
  priceContainer: {
    paddingHorizontal: 5,
  },
  quantityContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
  },
  removeButton: {
    width: 35,
    borderRadius: 8,
    flex: 0.5,
  },
  addButton: {
    width: 35,
    borderRadius: 8,
    flex: 0.5,
  },
  quantityTextContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flex: 0.5,
  },
  quantityText: {
    fontSize: 12,
    fontFamily: 'JostMedium',
  },
  addButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  addButton1: {
    borderRadius: 8,
  },
  addButtonLabel: {
    color: BaseColor.backgroundColor,
    fontFamily: 'JostMedium',
  },
  addButtonIcon: {
    color: BaseColor.backgroundColor,
  },
});

export default GridProduct;
