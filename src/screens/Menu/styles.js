import {StyleSheet, Dimensions} from 'react-native';
import { BaseColor, useTheme } from '../../config/theme';

export default Styles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.theme.background,
      padding: 15,
      marginBottom: 15,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    profileImage: {
      borderRadius: 50,
      width: 50,
      height: 50,
    },
    profileText: {
      flexDirection: 'column',
      
    },
    profileName: {
      fontFamily: 'PoppinsMedium',
      fontSize: 16,
      marginLeft: 10,
      color:theme.theme.title
    },
    profileUpdate: {
      marginLeft: 10,
      fontSize: 10,
      fontFamily: 'PoppinsRegular',
      color:theme.theme.text
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
    },
    button: {
      padding: 15,
      borderWidth: 1,
      borderColor: BaseColor.primaryLight,
      width: '45%',
    },
    buttonText: {
      textAlign: 'center',
      fontFamily: 'PoppinsMedium',
      color:theme.theme.title
    },

    menuContainer: {
      backgroundColor: theme.theme.background,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      padding: 5,
      alignItems: 'center',
    },
    icon: {
      marginRight: 10,
      padding: 5,
    },
    text: {
      fontFamily: 'PoppinsRegular',
      color: theme.theme.title,
    },
    arrowIcon: {},

    toggleButton: {
      width: 70,
      height: 30,
      borderRadius: 20,
      borderColor: BaseColor.primaryLight,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: BaseColor.primaryLight,
    },
    sunnyIcon: {
      color: BaseColor.dark,
    },
    sunnyIconDark: {
      color: BaseColor.backgroundColor,
      backgroundColor: BaseColor.primary,
      borderRadius: 50,
      padding: 1,
    },
    moonIcon: {
      color: BaseColor.dark,
    },
    moonIconDark: {
      color: BaseColor.backgroundColor,
      backgroundColor: BaseColor.primary,
      borderRadius: 50,
      padding: 1,
    },

    cardConatiner:{marginVertical: 5, backgroundColor:theme.theme.background}
  });
};
