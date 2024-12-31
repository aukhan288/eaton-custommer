import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import {API_BASE_URL} from '../../../constants/Url';
import {useNavigation} from '@react-navigation/native';

const SubSwipper = ({banner}) => {
  const navigation = useNavigation();

  const handleBannerPress = item => {
    fetch(API_BASE_URL + 'fetchCategoryByBannerImgName.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        img_name: item.image.split('/banner/')[1],
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.id != null) {
          navigation.navigate('SubCategory', {
            screen: 'SubCategory',
            category_id: response.id,
            category_name: response.category_name,
            category_img: response.category_img,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    banner !== null && (
      <Swiper style={styles.swiper} loop autoplay>
        {banner !== null &&
          banner.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              onPress={() => handleBannerPress(item)}>
              <Image source={{uri: item.image}} style={styles.image} />
            </TouchableOpacity>
          ))}
      </Swiper>
    )
  );
};

export default SubSwipper;

const styles = StyleSheet.create({
  swiper: {
    height: 100,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 100,
  },
});
