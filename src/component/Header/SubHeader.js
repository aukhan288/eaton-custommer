import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BaseColor, useTheme } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SubHeader = ({ title, navigateTo }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.theme.background }]}>
      <Text style={[styles.title, { color: theme.theme.title }]}>{title}</Text>
    </View>
  );
};

export default SubHeader;

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
    fontSize: 16,
  },
});
