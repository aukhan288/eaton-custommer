import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {Card, List, Paragraph, Subheading, Button} from 'react-native-paper';
import {BaseColor, useTheme} from '../../config/theme';

const NotificationList = props => {
  const theme = useTheme();

  return (
    <Card style={[cardStyles.cardContainer,{borderBottomColor: theme.theme.textLight, backgroundColor: theme.theme.background}]}>
      <List.Item
        style={{padding: 0}}
        title={props.title}
        titleStyle={[cardStyles.title,{color: theme.theme.title}]}
        titleNumberOfLines={2}
        description={() => (
          <View style={{marginVertical: 5}}>
            {props.img == null ? null : (
              <Image source={{uri: props.img}} style={cardStyles.image} />
            )}
            <Paragraph allowFontScaling={false} style={[cardStyles.message, {color: theme.theme.text}]}>
              {props.message}
            </Paragraph>
            <Paragraph allowFontScaling={false} style={[cardStyles.date, {color: theme.theme.textLight,}]}>
              {props.date}
            </Paragraph>
          </View>
        )}
        descriptionNumberOfLines={7}
      />
    </Card>
  );
};

export default NotificationList;

const cardStyles = StyleSheet.create({
  cardContainer: {
    borderBottomWidth: 1,
    marginVertical: 10,
    borderRadius: 0,
    
  },
  title: {
    fontFamily: 'JostMedium',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  message: {
    textAlign: 'justify',
    fontFamily: 'JostRegular',
    
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'JostRegular',
    
  },
});
