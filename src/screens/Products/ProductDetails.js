import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Pressable,
  TextInput,
} from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';
import * as cartAction from '../../store/actions/CartAction';

import { API_BASE_URL, BASE_URL } from '../../constants/Url';

import NetworkError from '../Common/NetworkError';
import Swiper from 'react-native-swiper';
import { BaseColor, useTheme } from '../../config/theme';
import Styles from './styles';
import Loading from '../Common/Loading';
import { useTranslation } from 'react-i18next';

const ProductDetails = ({ route, navigation }) => {
  const styles = Styles();
  const theme = useTheme();
  const { t } = useTranslation()

  const isVisible = useIsFocused();
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  const dispatch = useDispatch();
  const {
    product_id,
    product_name,
    product_img,
    discount,
    // pgms_pprice,
    popular,
  } = route.params;

  const [pgms, setPgms] = useState(null);
  // const [pgms, setPgms] = useState(pgms_pprice[0].product_type);
  const [activeTab, setActiveTab] = useState('product');
  const [pprice, setPprice] = useState(null);
  // const [pprice, setPprice] = useState(pgms_pprice[0].product_price);
  const [productTypePriceId, setProductTypePriceId] = useState(null);
  // const [productTypePriceId, setProductTypePriceId] = useState(
  //   pgms_pprice[0].product_type_price_id,
  // );

  const [productDetail, setProductDetail] = useState({});
  const [cartProduct, setCartProduct] = useState({});
  const [productCount, setProductCount] = useState(1);
  const [productVariation, setProductVariation] = useState([]);
  const [productFlavours, setProductFlavours] = useState([{ id: 1, name: 'Bison burgers' }, { id: 2, name: 'Mushroom burgers' }, { id: 3, name: 'Mushroom burgers' }]);
  const [selectedProductFlavours, setSelectedProductFlavours] = useState({ id: 2, name: 'Mushroom burgers' });
  const [productRowMaterial, setProductRowMaterial] = useState([{ id: 1, name: 'minced beef', price: 100 }, { id: 2, name: 'egg', price: 20 }, { id: 3, name: 'Onions', price: 10 }, { id: 4, name: 'breadcrumbs', price: 30 }]);
  const [selectedProductRowMaterial, setSelectedProductRowMaterial] = useState([{ id: 1, name: 'minced beef', price: 100 }, { id: 2, name: 'egg', price: 20 }]);
  const [productSizes, setProductSizes] = useState([{ id: 1, name: 'Large', price: 350 }, { id: 2, name: 'Extra Large', price: 550 }]);
  const [selectedProductSize, setSelectedProductSize] = useState({ id: 2, name: 'Extra Large', price: 550 });
  const [bannerImage, setBannerImage] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [product_description, setProductDescription] = useState('');
  const [brand_name, setBrandName] = useState('');
  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  var cartReadyItems = [];

  cartReadyItems.push(cartProduct);
  // cartReadyItems.push(productCount, productCount);
  // cartReadyItems.push(
  //   productDetail?.product_name,
  //   productDetail?.product_img,
  //   productDetail?.discount,
  //   productDetail?.popular,
  //   productDetail?.price,
  //   productDetail?.productCount,
  // );
  // cartReadyItems.push(
  //   product_name,
  //   product_img,
  //   discount,
  //   popular,
  //   productTypePriceId,
  //   productCount,
  // );
  const toggleSelection = (rm) => {
    const isSelected = selectedProductRowMaterial.some(item => item.id === rm.id); // Check if item is selected

    if (isSelected) {
      // If the item is selected, remove it from the selected list
      setSelectedProductRowMaterial(prev => prev.filter(item => item.id !== rm.id));
    } else {
      // If the item is not selected, add it to the selected list
      setSelectedProductRowMaterial(prev => [...prev, rm]);
    }
  };
  const apiCall = () => {
    console.log('iiiiiiiiiiii', product_id);

    setLoading(true);
    var authAPIURL = API_BASE_URL + `prductDetails/${product_id}`;
    console.log('=======================', API_BASE_URL);

    // var authAPIURL = API_BASE_URL + 'fetchPrductDetails.php';
    console.log(JSON.stringify({
      mobile: auth_mobile,
      token: token,
      product_id: product_id,
    }));

    var header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    fetch(authAPIURL, {
      method: 'GET', // Specify the HTTP method (GET by default)
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // This is just an example; add your own headers
        'Access-Control-Allow-Origin': '*'
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log('>>>>>>>>>>>>>>>>>>', response);

        setLoading(false);
        let banners = [
          response?.data?.img_1 ? response?.data?.img_1 : response?.data?.main_img,
          response?.data?.img_2 ? response?.data?.img_2 : response?.data?.main_img,
          response?.data?.img_3 ? response?.data?.img_3 : response?.data?.main_img
        ]
        setBannerImage(banners);
        setProductDetail(response?.data)
        let cartProduct=response?.data
        setCartProduct(cartProduct)
        console.log('rrrrrrrrrrrr', response?.data);
        return
        setProductVariation(response.pgms_pprice);

        setBannerImage(response.banner_img);

        setCategory(response.category);
        // setSubCategory(response.subcategory);

        setProductDescription(response.product_description);
        setBrandName(response.brand_name);

        setLoading(false);
      })
      .catch(error => {
        console.log('===========', error);
      });
  };

  const reloadPage = () => {
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        apiCall();
      } else {
        setLoading(false);
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  useEffect(() => {
    setLoading(false);
    const unsubscribe =
      NetInfo.addEventListener(internetState => {
        if (internetState.isConnected === true) {
          apiCall();
        } else {
          setLoading(false);
          setIsInternetConnected(true);
          ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
        }
      });
    unsubscribe();
  }, [route?.params?.product_name]);

  useEffect(() => {
    setTimeout(() => {
      setProductCount(1);
    });
  }, [isVisible]);

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.theme.darkBackground, flex: 1 }}>
      <ScrollView>
        <Swiper style={styles.swiperContainer} activeDotColor={BaseColor.primary} dotColor={BaseColor.black} loop autoplay>
          {bannerImage?.map((item, index) => (
            <Image
              key={index}
              source={{ uri: BASE_URL + item }}
              // source={{uri: item[`banner_img_${index + 1}`]}}
              style={{ width: '100%', height: 250 }}
            />
          ))}
        </Swiper>
        {productDetail?.discount > 0 ? (
          <Text style={styles.discountBadge}>{productDetail?.discount}{t('discount_percentage')}</Text>
        ) : null}

        <Card style={styles.cardContent}>
          <View style={{
            margin: 10,
            padding: 10,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowColor: '#000',         // Color of the shadow
            shadowOffset: { width: 0, height: 6 },  // Offset of the shadow
            shadowOpacity: 0.7,          // Opacity of the shadow
            shadowRadius: 10,
          }}>
            <View>
              <Text style={styles.productTitle}>{productDetail?.product_name}</Text>
              {/* <Text style={styles.productInfo}>
              {category} <Icon name="caret-forward" /> {subcategory}
            </Text> */}
            </View>
            <Text style={styles.productDesc}>{productDetail?.description}</Text>
            <View style={styles.productPriceContainer}>


              {productDetail?.discount > 0 ? (
                <Text style={styles.sellingPriceText}>
                  {/* {t('selling_price')} :{' '} */}
                  <MaterialCommunityIcons
                    name="currency-gbp"
                    style={styles.currencyIcon}
                  />
                  <Text style={{ color: BaseColor.primary }}>{((productDetail?.price * (100 - productDetail?.discount)) / 100)}</Text>
                </Text>
              ) : null}
              <Text style={styles.productPriceText}>
                {/* {t('product_price')} :{' '} */}
                {productDetail?.discount > 0 ? (
                  <>
                    <MaterialCommunityIcons
                      name="currency-gbp"
                      style={styles.currencyIcon}
                    />
                    <Text style={styles.discountedPriceText}>{productDetail?.price}</Text>
                  </>
                ) : (
                  <Text style={styles.productPriceText}>
                    <MaterialCommunityIcons
                      name="currency-gbp"
                      style={styles.currencyIcon}
                    />
                    {productDetail?.price}
                  </Text>
                )}
              </Text>
              {/* <Text style={styles.taxText}>({t('inclusive_all_tax')})</Text> */}
            </View>

          </View>
          <Card.Content>
            <View style={{ flexDirection: 'row' }}>
              <Pressable
                onPress={() => setActiveTab('product')}
                style={[styles.productInnerListBtn, { backgroundColor: activeTab == 'product' ? BaseColor.primary : BaseColor.gray }]}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Product</Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('sides')}
                style={[styles.productInnerListBtn, { backgroundColor: activeTab == 'sides' ? BaseColor.primary : BaseColor.gray, marginLeft: 10 }]}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Sides</Text>
              </Pressable>
            </View>
            {activeTab == 'product' ?
              (
                <>
                  <View style={styles.productInfoContainer}>
                    <View style={{ flexDirection: 'column' }}>
                      {productDetail?.flavours?.length > 0 && (
                        <Text style={{ marginTop: 10, fontWeight: '700', fontSize: 20 }}>Flavours:</Text>
                      ) }
                      
                      <View style={{ flexDirection: 'row' }}>
                        {productDetail?.flavours?.length > 0 && productDetail?.flavours?.map((flavour, index) => {
                          return (
                            <Pressable
                              onPress={() => setSelectedProductFlavours(flavour)}
                              style={{ marginRight: 10 }}>
                              <Text style={{ fontWeight: (selectedProductFlavours.id == flavour?.id) ? '700' : '400', color: (selectedProductFlavours.id == flavour?.id) ? BaseColor.primary : BaseColor.gray }}>{flavour?.title}</Text>
                            </Pressable>
                          )
                        })}
                      </View>
                      {productDetail?.sizes?.length > 0 && (
                        <Text style={{ marginTop: 10, fontWeight: '700', fontSize: 20 }}>Size</Text>
                      )}
                      <View style={{ flexDirection: 'column', paddingTop: 10 }}>
                        {productDetail?.sizes?.length > 0 && productDetail?.sizes?.map((size, index) => {
                          console.log('sssssssssss',productDetail);
                          
                          return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Pressable
                                onPress={() => setSelectedProductSize(size)}
                                style={{ marginRight: 10, flexDirection: 'row', marginBottom: 10 }}>
                                <View style={{ borderWidth: 3, borderColor: (selectedProductSize.id == size?.id) ? BaseColor.primary : BaseColor.gray, borderRadius: 100, padding: 3, marginRight: 5 }}>
                                  <View style={{ padding: 5, borderRadius: 100, backgroundColor: (selectedProductSize.id == size?.id) ? BaseColor.primary : BaseColor.gray }}></View>
                                </View>
                                <Text style={{ fontWeight: (selectedProductSize.id == size?.id) ? '700' : '400', color: (selectedProductSize.id == size?.id) ? BaseColor.primary : BaseColor.gray, textTransform: 'capitalize' }}>{size?.title}</Text>
                              </Pressable>
                              <Text style={{ color: BaseColor.primary, fontWeight: '700' }}><MaterialCommunityIcons
                                name="currency-gbp"
                                size={15}
                              />{size?.price}</Text>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopColor: theme.theme.title, borderBottomColor: theme.theme.title, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 5 }}>
                    <Text style={{ fontSize: 20, color: theme.theme.title }}>Have it your way!</Text>
                    <Text style={{ fontSize: 20, color: theme.theme.title }}>Optional</Text>
                  </View>
                  {productDetail?.ingredients?.map((rm) => {
                    // Check if the current item is selected
                    const isSelected = selectedProductRowMaterial.some(item => item.id === rm.id);

                    return (
                      <View
                        key={rm.id}
                        style={{
                          padding: 20,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          backgroundColor: theme.theme.background,
                          // borderColor: isSelected ? BaseColor.primary : '#e2e2e2',
                          // borderWidth:1,
                          borderRadius: 5,
                          marginTop: 10
                        }}
                      >
                        <Pressable
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                          onPress={() => toggleSelection(rm)} // Call toggleSelection to update state
                        >
                          <MaterialCommunityIcons
                            name={"checkbox-marked"}
                            color={isSelected ? BaseColor.primary : '#0003'}
                            size={25}
                          />
                          <Text style={{ textTransform: 'capitalize', marginLeft: 5 }}>{rm?.name}</Text>
                        </Pressable>

                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ color: BaseColor.primary, fontWeight: '700' }}>
                            <MaterialCommunityIcons name="currency-gbp" size={15} />
                            {rm?.price}
                          </Text>
                          <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                            <Pressable style={{}}>
                              <Text style={{ height: 25, backgroundColor: BaseColor.primary, width: 30, textAlign: 'center', textAlignVertical: 'center' }}>
                                <MaterialCommunityIcons
                                  color={'#FFF'}
                                  name="minus"
                                  size={15}
                                />
                              </Text>
                            </Pressable>
                            <Text style={[{ marginHorizontal: 10 }, styles.quantityText]}>
                              {`${productCount}`}
                            </Text>
                            <Pressable style={{}}>
                              <Text style={{ height: 25, backgroundColor: BaseColor.primary, width: 30, textAlign: 'center', textAlignVertical: 'center' }}>
                                <MaterialCommunityIcons
                                  color={'#FFF'}
                                  name="plus"
                                  size={15}
                                />
                              </Text>
                            </Pressable>
                          </View>
                        </View>

                      </View>


                    );

                  })}
                  <View style={{ marginVertical: 10, }}>
                    <Text style={{ color: theme.theme.title, fontWeight: '700' }}>Kitchen Instructions (Optional)</Text>
                    <TextInput
                      style={{ borderWidth: 2, borderColor: '#0005', marginTop: 10, textAlignVertical: 'top', padding: 5, borderRadius: 3 }}
                      numberOfLines={3}
                      placeholder='sss'
                    />
                  </View>
                </>
              )
              :
              <View>
                {productDetail?.sides?.map((rm) => {
                  // Check if the current item is selected
                  const isSelected = selectedProductRowMaterial.some(item => item.id === rm.id);
                  return (
                    <View
                      key={rm.id}
                      style={{
                        padding: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: theme.theme.background,
                        // borderColor: isSelected ? BaseColor.primary : '#e2e2e2',
                        // borderWidth:1,
                        borderRadius: 5,
                        marginTop: 10
                      }}
                    >
                      <Pressable
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => toggleSelection(rm)} // Call toggleSelection to update state
                      >
                        <MaterialCommunityIcons
                          name={"checkbox-marked"}
                          color={isSelected ? BaseColor.primary : '#0003'}
                          size={25}
                        />
                        <Text style={{ textTransform: 'capitalize', marginLeft: 5 }}>{rm?.name}</Text>
                      </Pressable>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: BaseColor.primary, fontWeight: '700' }}>
                          <MaterialCommunityIcons name="currency-gbp" size={15} />
                          {rm?.price}
                        </Text>
                        <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                          <Pressable style={{}}>
                            <Text style={{ height: 25, backgroundColor: BaseColor.primary, width: 30, textAlign: 'center', textAlignVertical: 'center' }}>
                              <MaterialCommunityIcons
                                color={'#FFF'}
                                name="minus"
                                size={15}
                              />
                            </Text>
                          </Pressable>
                          <Text style={[{ marginHorizontal: 10 }, styles.quantityText]}>
                            {`${productCount}`}
                          </Text>
                          <Pressable style={{}}>
                            <Text style={{ height: 25, backgroundColor: BaseColor.primary, width: 30, textAlign: 'center', textAlignVertical: 'center' }}>
                              <MaterialCommunityIcons
                                color={'#FFF'}
                                name="plus"
                                size={15}
                              />
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            }


            <View style={styles.quantityContainer}>
              <View style={styles.quantityTextContainer}>
                <Pressable style={{}}
                     onPress={()=>{setProductCount(prevCount => prevCount > 1 ? prevCount - 1 : prevCount)}}
                >
                  <Text style={{ borderWidth: 1, borderRadius: 100, height: 30, width: 30, textAlign: 'center', textAlignVertical: 'center' }}>
                    <MaterialCommunityIcons
                      name="minus"
                      size={15}
                    />
                  </Text>
                </Pressable>
                <Text style={[{ marginHorizontal: 10 }, styles.quantityText]}>
                  {`${productCount}`}
                </Text>
                <Pressable style={{}}
                 onPress={()=>{setProductCount(productCount+1)}}
                >
                  <Text style={{ borderWidth: 1, borderColor: '#0005', backgroundColor: '#e2e2e2', borderRadius: 100, height: 30, width: 30, textAlign: 'center', textAlignVertical: 'center' }}>
                    <MaterialCommunityIcons
                      name="plus"
                      size={15}
                    />
                  </Text>
                </Pressable>
              </View>
              {productCount ? (
                <Button
                  mode="contained"
                  style={styles.addButton}
                  theme={{ colors: { primary: BaseColor.primary } }}
                  uppercase={false}
                  onPress={() => {
                    dispatch(cartAction.addToCart({cartProduct:cartProduct, productCount:productCount}));
                    setProductCount(productCount);
                    ToastAndroid.show('Item added', ToastAndroid.SHORT);
                  }}>
                  Add to Cart (<MaterialCommunityIcons
                    name="currency-gbp"
                    size={15}
                  />{cartProduct?.price*productCount} )
                </Button>
              ) : null}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;
