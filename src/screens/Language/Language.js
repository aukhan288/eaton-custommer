import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import Styles from './styles';
import {BaseColor, useTheme} from '../../config/theme';
import languageList from './languageList';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';
import * as applicationActions from '../../store/actions/ApplicationAction';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Language = ({navigation}) => {
  const theme = useTheme();
  const styles = Styles();

  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {language} = useSelector(state => state.ApplicationReducer);

  const handleSelectLanguage = language => {
    dispatch(applicationActions.onChangeLanguage(language));
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{backgroundColor: theme.theme.darkBackground, flex: 1}}>
      <FlatList
        data={languageList}
        style={{padding: 15}}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.languageButton,
              {
                borderColor:
                  language === item.shortcut
                    ? BaseColor.primary
                    : BaseColor.primaryLight,
              },
            ]}
            onPress={() => {
              i18n.changeLanguage(item.shortcut),
                handleSelectLanguage(item.shortcut);
            }}>
            <View style={styles.languageButtonContent}>
              <Image source={item.logo} style={styles.languageButtonImage} />
              <Text style={styles.languageButtonText}>{item.language}</Text>
            </View>
            {language === item.shortcut && (
              <View style={styles.languageButtonCheck}>
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color={BaseColor.white}
                />
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default Language;
