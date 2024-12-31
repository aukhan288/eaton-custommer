import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, Image, ToastAndroid, FlatList, TouchableHighlight} from 'react-native';
import {Subheading, Button, Searchbar} from 'react-native-paper';

import {useSelector, useDispatch} from 'react-redux';

import NetworkError from '../Common/NetworkError';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL, BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import {VerticalProduct} from '../../component';
import Styles from './styles';
import Loading from '../Common/Loading';
import { useTranslation } from 'react-i18next';

const ProductSearch = ({navigation}) => {
  const {t} = useTranslation()
  const style = Styles();
  const theme = useTheme();
  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);
  const isLoggedIn = useSelector(state => state.AuthReducer.isLoggedIn);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [productList, setProductList] = useState([]);

  const [isProductAvailable, setIsProductAvailable] = useState(false);
  const [productMsg, setProductMsg] = useState('Search Product appere here');

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [togglePreviewScreen, setTogglePreviewScreen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);

  const apiCall = () => {
    if (searchKeyword != undefined && searchKeyword.length > 2) {
      // var authAPIURL = API_BASE_URL + 'searchProduct.php';
      var authAPIURL = API_BASE_URL + 'searchProduct';
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(authAPIURL, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          searchKeyword: searchKeyword,
        }),
      })
        .then(response => response.json())
        .then(response => {
          console.log('rrrrrrrrrrrrrrrrrrrr',response?.data);
          if (response.data.length > 0) {
            setProductList(response?.data);
            setIsProductAvailable(true);
          } else {
            setProductMsg(response.msg);
            setIsProductAvailable(false);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setIsProductAvailable(false);
      setProductList([]);
    }
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
  }, [searchKeyword]);

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  const sendEnquiry = () => {
    if (searchKeyword != '') {
      var authAPIURL = API_BASE_URL + 'productEnquiry.php';
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(authAPIURL, {
        method: 'POST',
        headers: header,
        body: JSON.stringify({
          mobile: auth_mobile,
          token: token,
          searchKeyword: searchKeyword,
        }),
      })
        .then(response => response.json())
        .then(response => {
          setSearchKeyword('');
          ToastAndroid.show(response.msg, ToastAndroid.LONG);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      ToastAndroid.show('Enter proper Product name', ToastAndroid.LONG);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <Searchbar
        allowFontScaling={false}
        placeholder="Search Product here..."
        theme={{colors: {primary: BaseColor.primary}}}
        onChangeText={text => setSearchKeyword(text)}
        value={searchKeyword}
        onTouchStart={() => {
          setTogglePreviewScreen(false);
        }}
        placeholderTextColor={theme.theme.text}
        style={style.searchbar}
      />

      <View>
        {isProductAvailable ? (
          <FlatList
          ItemSeparatorComponent={
            Platform.OS !== 'android' &&
            (({highlighted}) => (
              <View
                style={[style.separator, highlighted && {marginLeft: 0}]}
              />
            ))
          }
          data={productList}
          renderItem={({item, index, separators}) => (
            <TouchableHighlight
              key={item.key}
              onPress={() =>   navigation.navigate('ProductDetails', {
                screen: 'ProductDetails',
                product_id: item.product_id,
                product_name: item.product_name,
                product_img: item.product_img,
                discount: item.discount,
                pgms_pprice: item.pgms_pprice,
                popular: item.popular,
              })}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{backgroundColor: 'white', flexDirection:'row', alignItems:'center'}}>
                <Image style={{height:40, width:40, marginHorizontal:10}} source={{uri: BASE_URL+item?.main_img}} />
                <Text>{item?.product_name}</Text>
                {item?.discount > 0 ? (
          <Text style={{
            backgroundColor: BaseColor.primary,
            color: BaseColor.primaryLight,
            width: 65,
            borderRadius: 50,
            paddingLeft: 8,
            position: 'absolute',
            top: 15,
            right: 15,
            zIndex: 999,
            fontFamily: 'JostRegular',
          }}>{item?.discount}{t('discount_percentage')}</Text>
        ) : null}
              </View>
            </TouchableHighlight>
          )}
        />
        ) : togglePreviewScreen ? (
          <View style={style.emptyView}>
            <Image
              source={require('../../assets/image/product_search.png')}
              style={style.emptyImage}
            />
            <Subheading allowFontScaling={false} style={style.emptyMessage}>
              {productMsg}
            </Subheading>
          </View>
        ) : null}
      </View>
      {isProductAvailable ? null : (
        <View style={style.notFoundView}>
          <Subheading allowFontScaling={false} style={style.notFoundMessage}>
            {`Can't find `}
            <Text style={{color: BaseColor.primary}}>{searchKeyword}</Text>
          </Subheading>
          <Button
            allowFontScaling={false}
            mode="text"
            theme={{colors: {primary: BaseColor.primary}}}
            style={style.sendEnquiryButton}
            labelStyle={{color: BaseColor.backgroundColor}}
            onPress={() => {
              isLoggedIn
                ? sendEnquiry()
                : ToastAndroid.show(
                    'Please Login to send Enquiry',
                    ToastAndroid.SHORT,
                  );
            }}
            uppercase={false}>
            Send Enquiry
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductSearch;
