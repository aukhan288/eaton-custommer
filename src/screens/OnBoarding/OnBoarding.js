import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {useDispatch} from 'react-redux';
import * as onBoardingAction from '../../store/actions/OnBoardingAction';
import {BaseColor} from '../../config/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OnBoarding = ({navigation}) => {
  const dispatch = useDispatch();
  const onboardingRef = useRef(null);
  // we shold remove latter
  dispatch(onBoardingAction.disabledOnBoarding());
  const Done = () => (
    <TouchableOpacity
      onPress={handleDone}
      style={styles.buttonComponentContainer}>
      <Text style={styles.buttonComponentText}>Start Shopping</Text>
      <Ionicons name="chevron-forward-circle" size={32} />
    </TouchableOpacity>
  );

  const Skip = () => (
    <TouchableOpacity
      onPress={handleSkip}
      style={styles.buttonComponentContainer}>
      <Ionicons name="arrow-redo" size={20} />
      <Text style={styles.buttonComponentText}>Skip</Text>
    </TouchableOpacity>
  );

  const Next = () => (
    <TouchableOpacity
      onPress={() => onboardingRef.current.goNext()}
      style={styles.buttonComponentContainer}>
      <Text style={styles.buttonComponentText}>Next</Text>
      <Ionicons name="play-skip-forward" size={20} />
    </TouchableOpacity>
  );

  const handleSkip = () => {
    dispatch(onBoardingAction.disabledOnBoarding());
    navigation.navigate('BottomTabScreen');
  };

  const handleDone = () => {
    dispatch(onBoardingAction.disabledOnBoarding());
    navigation.navigate('BottomTabScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        ref={onboardingRef}
        DotComponent={() => null}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
        DoneButtonComponent={Done}
        bottomBarColor={BaseColor.backgroundColor}
        onSkip={handleSkip}
        onDone={handleDone}
        pages={[
          {
            backgroundColor: BaseColor.backgroundColor,
            image: (
              <Image
                source={require('../../assets/image/add_to_cart.png')}
                style={styles.image}
              />
            ),
            title: 'Select Grocery Item',
            subtitle: 'Select your Grocery product that you want to\nbuy easily',
          },
          {
            backgroundColor: BaseColor.backgroundColor,
            image: (
              <Image
                source={require('../../assets/image/order_pay.png')}
                style={styles.image}
              />
            ),
            title: 'Easy and Safe Payment',
            subtitle: 'Pay for the product you buy safely\nand easily',
          },
          {
            backgroundColor: BaseColor.backgroundColor,
            image: (
              <Image
                source={require('../../assets/image/delivery.png')}
                style={styles.image}
              />
            ),
            title: 'Delivery to door step',
            subtitle:
            'Your product is delivered to your home\nsafely and securely',
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColor.backgroundColor,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 400,
  },
  title: {
    fontFamily: 'JostMedium',
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'JostRegular',
  },
  buttonComponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonComponentText: {
    fontFamily: 'JostRegular',
    fontSize: 16,
    marginHorizontal: 5,
  },
});
