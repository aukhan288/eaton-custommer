import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {BaseColor, useTheme} from '../../config/theme';

const Loading = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.theme.background,
      }}>
      <ActivityIndicator size="large" color={BaseColor.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
