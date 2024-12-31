import {StyleSheet} from 'react-native';
import {BaseColor, useTheme} from '../../config/theme';

const Styles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BaseColor.backgroundColor,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: theme.theme.background,
    },
    title: {
      color: theme.theme.title,
    },
    description: {
      color: theme.theme.text,
    },
    walletItemContainer: {
      marginTop: 30,
      marginHorizontal: 15,
    },
    walletLabel: {
      color: BaseColor.label,
      fontFamily: 'JostRegular',
      fontSize: 12,
    },
    walletInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: BaseColor.primary,
    },
    walletInput: {
      width: '100%',
      color: theme.theme.title,
    },
    payNowButton: {
      marginTop: 30,
      marginHorizontal: 15,
    },

    tableTital:{
        fontFamily: 'JostMedium',
        color: theme.theme.title,
        fontSize: 14,
      },
      tableCell:{
        fontFamily: 'JostRegular',
        color: theme.theme.title,
        fontSize: 12,
      }
  });
};

export default Styles;
