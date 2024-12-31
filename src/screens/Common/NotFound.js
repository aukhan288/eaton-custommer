import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Subheading, Button} from 'react-native-paper';
import {BaseColor, useTheme} from '../../config/theme';

const NotFound = ({text}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: theme.theme.darkBackground,
      }}>
      <Image
        source={require('../../assets/image/no_product.png')}
        style={{width: 150, height: 150}}
      />
      <Subheading
        style={{
          textAlign: 'center',
          marginHorizontal: 60,
          color: theme.theme.textLight,
        }}>
        {text}
      </Subheading>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({});
