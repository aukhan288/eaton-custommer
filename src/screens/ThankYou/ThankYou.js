import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  BackHandler,
  Modal,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../../constants/Url';
import {BaseColor, useTheme} from '../../config/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

const ThankYou = ({navigation, route}) => {
  const isVisible = useIsFocused();
  const theme = useTheme();
  const {t} = useTranslation();
  const {orderID} = route.params.params;

  const [feedback, setFeedback] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);

  const auth_mobile = useSelector(state => state.AuthReducer.mobile);
  const token = useSelector(state => state.AuthReducer.token);

  function handleBackButtonClick() {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
      params: {product_id: null},
    });
    return true;
  }

  useEffect(() => {
    setTimeout(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, [isVisible]);

  const sendFeedback = () => {
    NetInfo.addEventListener(internetState => {
      if (internetState.isConnected === true) {
        var authAPIURL = API_BASE_URL + 'addFeedback.php';
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
            feedback: feedback,
            feedbackRating: feedbackRating,
            orderID: orderID,
          }),
        })
          .then(response => response.json())
          .then(response => {
            ToastAndroid.show(response.msg, ToastAndroid.SHORT);
            setVisible(false);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        ToastAndroid.show('Internet Connection Failed', ToastAndroid.SHORT);
      }
    });
  };

  const [visible, setVisible] = useState(true);

  const onClose = () => {
    setVisible(false);
  };

  const handleStarPress = starNumber => {
    setFeedbackRating(starNumber);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.star}>
          <MaterialCommunityIcons
            name={feedbackRating >= i ? 'star' : 'star-outline'}
            size={32}
            color={feedbackRating >= i ? BaseColor.secondary : BaseColor.label}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor:theme.theme.background}]}>
      <ScrollView>
        <View style={{marginHorizontal: 15}}>
          <Image
            source={require('../../assets/image/thank_you.png')}
            style={styles.img}
          />

          <Text
            allowFontScaling={true}
            style={[styles.title, {color: theme.theme.title}]}>
            {t('congratulations')}
          </Text>
          <Text
            allowFontScaling={true}
            style={[styles.msg, {color: theme.theme.text}]}>
            {t('thank_you_for_your_order')}
          </Text>
          <Button
            mode="outlined"
            style={{marginTop: 45, borderColor: BaseColor.primary}}
            theme={{colors: {primary: BaseColor.primary}}}
            onPress={() => navigation.navigate('Order')}>
            {t('track_your_order')}
          </Button>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.theme.background},
            ]}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={{fontFamily: 'JostRegular', color: theme.theme.title}}>
              {t('your_rating_is')} {feedbackRating}.0
            </Text>
            <Pressable 
            onPress={()=>setVisible(false)}
            >
            <MaterialCommunityIcons name='close-circle' size={30} color={BaseColor.primary} />
            </Pressable>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              {renderStars()}
            </View>

            <View style={styles.firstInputTextContainer}>
              <Text style={styles.textInputHeading}>
                {t('write_order_feedback')}
              </Text>

              <View style={styles.textInputContainer}>
                <TextInput
                  style={[styles.textInput, {color: theme.theme.title}]}
                  value={feedback}
                  onChangeText={feedback => setFeedback(feedback)}
                  placeholder={t('write_order_feedback')}
                />
              </View>
            </View>

            <Button
              mode="contained"
              style={{marginTop: 30}}
              theme={{colors: {primary: BaseColor.primary}}}
              labelStyle={styles.functionalLabelBtn}
              onPress={() => {
                sendFeedback();
              }}>
              {t('send_feedback')}
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ThankYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    height: 230,
    width: '80%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
  },
  title: {
    textAlign: 'center',

    fontFamily: 'JostMedium',
    fontSize: 16,
    marginBottom: 10,
  },
  msg: {
    textAlign: 'center',

    fontFamily: 'JostRegular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  firstInputTextContainer: {marginTop: 30},
  textInputHeading: {
    color: BaseColor.label,
    fontFamily: 'JostRegular',
    fontSize: 12,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: BaseColor.primary,
  },
  logoIcon: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: BaseColor.backgroundColor,
  },
  textInput: {width: '100%'},
  functionalLabelBtn: {
    color: BaseColor.backgroundColor,
    fontFamily: 'JostMedium',
  },
});
