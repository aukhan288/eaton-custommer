import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  Linking,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import {Button, Snackbar} from 'react-native-paper';
import { GridProduct } from '../../component';
import NetInfo from '@react-native-community/netinfo';
import NetworkError from '../Common/NetworkError';
import VersionCheck from 'react-native-version-check';
import {API_BASE_URL, BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme, Light} from '../../config/theme';
import Swiper from 'react-native-swiper';
import NotFound from '../Common/NotFound';
import {useSelector, useDispatch} from 'react-redux';
import {
  MainSwipper,
  SubSwipper,
  Category,
  Header,
  HorizontalProduct,
} from '../../component';
import Loading from '../Common/Loading';
import {useTranslation} from 'react-i18next';
const bannerImage = [
  { banner_img_1: 'https://ea8on.assignmentmentor.co.uk/public/images/slide-1.jpeg' },
  { banner_img_2: 'https://ea8on.assignmentmentor.co.uk/public/images/slide-1.jpeg' },
  { banner_img_3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7fw1qfN8-nIlDlE3UxXIA3X3TDBKDoSfNmg&s' },
  // Add more objects as needed
];
const {height, width}=Dimensions.get('screen')
const Home = ({navigation}) => {
  const {name, mobile, isLoggedIn, token} = useSelector(
    state => state.AuthReducer,
  );
  const theme = useTheme();
  const {t} = useTranslation();
  const [isLoadingMoreItem, setLoadingMoreItem] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [dealOfTheDayProducts, setDealOfTheDayProducts] = useState([]);
  const [homeSectionProducts, setHomeSectionProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [headerBanner, setHeaderBanner] = useState([]);
  const [dealofthedayBanner, setDealofthedayBanner] = useState([]);
  const [homeSectionBanner, setHomeSectionBanner] = useState([]);
  const [footerSectionBanner, setFooterSectionBanner] = useState([]);

  const [isEndProductList, setIsEndProductList] = useState(false);

  const [isInternetConnected, setIsInternetConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [visibleUpdateSnackbar, setVisibleUpdateSnackbar] = useState(false);
  const onDismissSnackBar = () => setVisibleUpdateSnackbar(false);

  // const apiUpdateVersionCall = () => {
  //   var authAPIURL = API_BASE_URL + 'fetchUpdateVersion.php';
  //   var header = {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   };
  //   fetch(authAPIURL, {
  //     headers: header,
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       const currentBuildNumber = VersionCheck.getCurrentBuildNumber();
  //       // if (response[0].new_version_code > currentBuildNumber) {
  //       //   if (response[0].is_force_update == 1) {
  //       //     Alert.alert(
  //       //       'Good News!',
  //       //       'Update Available\nThis is Mandatory update',
  //       //       [
  //       //         {
  //       //           text: 'OK',
  //       //           onPress: () => {
  //       //             Linking.openURL('market://details?id=com.groceryapp');
  //       //             RNExitApp.exitApp();
  //       //           },
  //       //         },
  //       //         {
  //       //           text: 'Exit App!',
  //       //           onPress: () => RNExitApp.exitApp(),
  //       //         },
  //       //       ],
  //       //     );
  //       //   } else {
  //       //     setVisibleUpdateSnackbar(true);
  //       //   }
  //       // }
  //     })
  //     .catch(error => {
  //       // console.log(error);
  //     });
  // };

  const fetchHomeSectionProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL = API_BASE_URL + `fetchHomeSectionProductList.php`;
      var header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetch(fetchProductAPIURL, {
        method: 'POST',
        headers: header,
      })
        .then(response => response.json())
        .then(response => {

          
          setHomeSectionProducts(response?.home_section);
          setLoadingMoreItem(false);
        });
    } else {
    }
  };

  const fetchFavouriteProductApi = () => {
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      var fetchProductAPIURL = `${API_BASE_URL}favouriteProductList.php?currentPage=${currentPage}`;
      fetch(fetchProductAPIURL, {
        method: 'POST',
      })
        .then(response => response.json())
        .then(response => {
          if (response.length > 0) {
            setProducts([...products, ...response]);
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
        });
    } else {
    }
  };

  const fetchDealOfTheDayProductApi = () => {
    console.log('bbbbbbbbb');
    
    if (!isEndProductList) {
      setLoadingMoreItem(true);
      // var fetchProductAPIURL = `${API_BASE_URL}fetchDealOfTheDayProductList.php?currentPage=${currentPage}`;
      var fetchProductAPIURL = `${API_BASE_URL}dealOfTheDayProductList`;
      console.log('==========',fetchProductAPIURL)
      fetch(fetchProductAPIURL,{
        method: 'GET', // Specify the HTTP method (GET by default)
        headers: {
          'Content-Type': 'application/json', // This is just an example; add your own headers
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(response => response.json())
        .then(response => {
          console.log('hhhhhhhhhh',response);
          
          if (response?.data?.length > 0) {
            setDealOfTheDayProducts([...dealOfTheDayProducts, ...response?.data]);
          } else {
            setIsEndProductList(true);
          }
          setLoadingMoreItem(false);
        }).catch(e=>{
          console.log('rrrrr',e);
          
        });
    } else {
    }
  };

  const fetchHeaderBanner = () => {
    // var fetchProductAPIURL = 'http://ea8on.test:8080/api/services/v1/customer/banners';//API_BASE_URL + `headerBanner.php`;
    var fetchProductAPIURL = API_BASE_URL +`banners`;
    
    fetch(fetchProductAPIURL,{
      method: 'GET', // Specify the HTTP method (GET by default)
      headers: {
        'Content-Type': 'application/json', // This is just an example; add your own headers
        'Access-Control-Allow-Origin': '*'

      }
    })
      .then(response => response.json())
      .then(response => {

        setHeaderBanner(response?.data);
        setLoading(false);
      }).catch(e=>{
        console.log(e);
        
      });
  };

  const fetchDealOfTheDayBanner = () => {
    var fetchProductAPIURL = API_BASE_URL + `dealOfTheDayBanner.php`;
    fetch(fetchProductAPIURL)
      .then(response => response.json())
      .then(response => {
   
        setDealofthedayBanner(response);
      });
  };

  const fetchHomeBanner = () => {
    
    var fetchProductAPIURL = API_BASE_URL + `banners`;

    
    fetch(fetchProductAPIURL,{
      method: 'GET', // Specify the HTTP method (GET by default)
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // This is just an example; add your own headers
        'Access-Control-Allow-Origin': '*'

      }
    })
      .then(response => response.json())
      .then(response => {
        console.log('111111',response);
        
        setLoading(false)

        let data=[];
        response.data?.map(item=>{
          data.push({img:item?.img})
        })

        setHeaderBanner(response?.data);
        // setHomeSectionBanner(response?.data);
      }).catch(e=>{
        console.log('eeeeeee',e);
      });;
  };

  const fetchFooterBanner = () => {
    var fetchProductAPIURL = API_BASE_URL + `footerBanner.php`;
    fetch(fetchProductAPIURL)
      .then(response => response.json())
      .then(response => {

        setFooterSectionBanner(response);
      });
  };

  const fetchCategory = () => {
    
    var fetchProductAPIURL = API_BASE_URL + `categories`;
   
    fetch(fetchProductAPIURL,{
      method: 'GET', // Specify the HTTP method (GET by default)
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // This is just an example; add your own headers
        'Access-Control-Allow-Origin': '*'

      }
    })
      .then(response => response.json())
      .then(response => {
        setCategory(response?.data);
      });
  };

  useEffect(() => {
    // apiUpdateVersionCall();
    setProducts([])
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        // fetchHeaderBanner();
        // fetchDealOfTheDayBanner();
        // fetchFavouriteProductApi();
        fetchHomeBanner();
        fetchCategory();
        fetchDealOfTheDayProductApi();
        // fetchHomeSectionProductApi();
        // fetchFooterBanner();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  }, []);

  const reloadPage = () => {
    setLoading(true);
    setIsInternetConnected(false);
    const unsubscribe = NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        // fetchHeaderBanner();
        // fetchDealOfTheDayBanner();
        // fetchFavouriteProductApi();
        fetchHomeBanner();
        fetchCategory();
        fetchDealOfTheDayProductApi();
        // fetchHomeSectionProductApi();
        // fetchFooterBanner();
      } else {
        setIsInternetConnected(true);
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
    unsubscribe();
  };

  if (isInternetConnected) {
    return <NetworkError reloadPage={reloadPage} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={{ 
        // backgroundColor: BaseColor.primaryLight,
        flex: 1,
        height:height,
        backgroundColor:'#FFF'
        // marginBottom: 50,
      }}>
        <ScrollView height={height}>
        <View style={{minHeight:height}}>
        
        <View style={styles.swiperContainerView}>
        <Text style={{paddingHorizontal:20, marginVertical:5, fontWeight:'600', fontSize:20, color:'#000'
}}>Welcome {name?name:'Guest User'}!</Text>


           <Swiper activeDotColor={BaseColor.primary} dotColor={BaseColor.black} style={{overflow:'hidden', borderRadius:15}} loop autoplay>
          {headerBanner?.map((item, index) =>  ( 
            <Image
              key={index}
              source={{uri: BASE_URL+item?.img}}
              style={{ height: 200,  }}
            />
          ))}
        </Swiper>
           </View>
          
     <View style={{}}>
  
     <FlatList
        renderItem={item => <></>}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* <MainSwipper banner={headerBanner} /> */}
           
            <Category category={category} />
            <View style={{backgroundColor:'#FFF', borderTopRightRadius:25, overflow:'hidden'}}>
            {/* <SubSwipper banner={dealofthedayBanner} /> */}

            {dealOfTheDayProducts.length != 0 && (
              <Header title={t('Promotional Products')} navigateTo="Offer" />
            )}
             {/* <HorizontalProduct product={dealOfTheDayProducts} /> */}
             <View style={{ marginTop: 20 }} />
      {dealOfTheDayProducts?.length > 0 ? 
        <GridProduct
          product={dealOfTheDayProducts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoadingMoreItem={isLoadingMoreItem}
        />
       : 
        <NotFound text="No Product Found" />
      }
            {products?.length != 0 && (
              <Header
                title={t('popular_products')}
                navigateTo="PopularProductList"
              />
            )}
          

            {/* <SubSwipper banner={homeSectionBanner} /> */}
            <FlatList
              data={homeSectionProducts}
              style={{
                backgroundColor: theme.theme.background,
              }}
              keyExtractor={item => item.sessionID + new Date('1970')}
              renderItem={({item}) => (
                <>
                  <Header title={item?.title} navigateTo="" />
                  <HorizontalProduct product={item.product} />
                </>
              )}
            />

            <SubSwipper banner={footerSectionBanner} />

            {/* <View style={{backgroundColor: theme.theme.background}}>
              <Image
                source={require('../../assets/image/thinking.png')}
                style={styles.footerConatinerImg}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AllProductsList');
                }}>
                <Text
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  style={[styles.msg, {color: theme.theme.textLight}]}>
                  {t('no_results_message')}
                </Text>

                <Text allowFontScaling={false} style={styles.explorebtn}>
                  {t('explore_products')}
                </Text>
              </TouchableOpacity>
            </View> */}
            </View>
           
          </>
        }
      />
     </View>
        </View>



      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
const styles = StyleSheet.create({
  footerConatinerImg: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    // marginVertical: 5,
  },

  msg: {
    textAlign: 'center',
    fontFamily: 'JostRegular',
    marginBottom: 15,
  },

  explorebtn: {
    color: BaseColor.danger,
    textAlign: 'center',
    borderColor: BaseColor.dangerLight,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 100,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5, // For Android shadow effect
    shadowColor: '#000', // For iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    margin: 10,
    width: '94%',
  },
  cardImage: {
    width: '100%',
    // height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
  },
  swiperContainerView: {
    height: 250,
    paddingBottom: 10,
    position:'relative',
    backgroundColor:'#FFF'
  },
  swiperContainer: {
    position:'absolute',
    top:40,
    marginHorizontal:20,
    borderRadius:15,
    overflow:'hidden',
    marginBottom:50
  },
});
