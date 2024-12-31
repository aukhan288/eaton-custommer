import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BaseColor, useTheme } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const Header = ({ title, navigateTo }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation()
  const handleNavigate = () => {
    if (navigateTo) {
      navigation.navigate(navigateTo);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.theme.background }]}>
      <Text style={[styles.title, { color: theme.theme.title }]}>{title}</Text>
      {navigateTo && (
        <TouchableOpacity onPress={handleNavigate}>
          <Text style={[styles.viewAll, { color: theme.theme.textLight }]}>
            {t('view_all')} <Ionicons name="arrow-forward-circle" color={theme.theme.textLight} size={12} />
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: BaseColor.primaryLight,
    borderTopColor: BaseColor.primaryLight,
  },
  title: {
    fontFamily: 'JostMedium',
    marginBottom: 3,
    fontSize: 18,
  },
  viewAll: {
    fontFamily: 'JostRegular',
    marginBottom: 3,
    fontSize: 12,
  },
});
