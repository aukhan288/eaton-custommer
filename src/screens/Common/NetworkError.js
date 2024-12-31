import React from 'react';
import {View, Image} from 'react-native';
import {Subheading, Button} from 'react-native-paper';
import {BaseColor, useTheme} from '../../config/theme';
import { useTranslation } from 'react-i18next';

const NetworkError = ({reloadPage}) => {
  const theme = useTheme();
  const {t} = useTranslation()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.theme.darkBackground,
      }}>
      <Image
        source={require('../../assets/image/no_internet.png')}
        style={{width: 150, height: 150}}
      />
      <Subheading
        style={{
          textAlign: 'center',
          marginHorizontal: 60,
          color: theme.theme.textLight,
          fontFamily: 'JostMedium',
        }}>
        {t('no_internet_connection')}
      </Subheading>
      <Button
        mode="text"
        theme={{colors: {primary: BaseColor.primary}}}
        uppercase={false}
        onPress={() => reloadPage()}>
        {t('reload')}
      </Button>
    </View>
  );
};

export default NetworkError;
