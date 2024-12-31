import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BaseColor, useTheme} from '../../config/theme';
import { BASE_URL } from '../../constants/Url';
const {height, width}=Dimensions.get('screen')
const Category = ({category}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigateToSubCategory(item)}>
      <View style={styles.itemContainer}>
        <Image source={{uri: BASE_URL+item.category_img}} style={styles.image} />
        
        <Text  style={[styles.categoryName, {color: theme.theme.textLight}]}>
          {item.category_name}
          {/* {item.category_name < 13 ? item.category_name : item.category_name.substring(0, 10) + '...'} */}
        </Text>
        {console.log('nnnnnnnnnnnn',item)
        }
      </View>
    </TouchableOpacity>
  );

  const navigateToSubCategory = item => {
    navigation.navigate('SubCategory', {
      screen: 'SubCategory',
      category_id: item.id,
      category_name: item.category_name,
      category_img: item.category_img,
    });
  };

  return (
    <FlatList
      data={category}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      keyExtractor={(item, index) => index.toString()}
      style={{backgroundColor:'#FFF', marginBottom: 10}}
    />
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
  itemContainer: {
    paddingHorizontal: 12,
    marginHorizontal:5,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding:5,
    // iOS shadow properties
    shadowColor: '#000',         // Shadow color (black in this case)
    shadowOffset: { width: 0, height: 1 },  // Shadow position (slightly below the card)
    shadowOpacity: 0.05,          // Shadow transparency (0 is fully transparent, 1 is fully opaque)
    // shadowRadius: 10,            // Shadow blur radius
    borderRadius:8,
    overflow:'hidden',
    // Android shadow properties
    elevation: 3,                // Elevation is used for Android to add shadow
  }
  ,
  image: {
    width: width*0.16,
    height: width*0.16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: BaseColor.primaryLight,
  },
  categoryName: {
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'JostRegular',
  },
});
