import {StyleSheet} from 'react-native';
import {BaseColor, useTheme} from '../../config/theme';

const Styles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BaseColor.primary,
    },
    areaContainer: {
      flex: 1,
      paddingVertical: 30,
      paddingHorizontal: 15,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: theme.theme.background,
    },
    headerText: {
      color: 'red',
      fontFamily: 'PoppinsMedium',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      paddingHorizontal: 15,
      width: '100%',
    },
    button: {
      backgroundColor: BaseColor.secondary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontFamily: 'PoppinsMedium',
      fontSize: 16,
    },
    languageButton: {
      flexDirection: 'row',
      padding: 10,
      borderWidth: 2,
      borderRadius: 5,
      minWidth: '47%',
      maxWidth: '47%',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 5,
    },
    languageButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageButtonImage: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    languageButtonText: {
      color: theme.theme.title,
    },
    languageButtonCheck: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'gray',
      backgroundColor: BaseColor.primary,
    },
    phoneNumber: {
      color: BaseColor.primary,
    },
    textInputHeading: {
      color: BaseColor.label,
      fontFamily: 'PoppinsRegular',
      fontSize: 12,
    },
    textInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: BaseColor.primary,
    },
    textInputImage: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    termConditionText: {
      color: BaseColor.label,
      marginTop: 10,
      fontFamily: 'PoppinsRegular',
      fontSize: 12,
    },
    termConditionLink: {
      color: BaseColor.primary,
      fontFamily: 'PoppinsMedium',
    },
    createAccountConatiner: {
      flexDirection: 'row',
      color: 'black',
      fontFamily: 'PoppinsRegular',
      justifyContent: 'center',
      marginBottom: 15,
      fontSize: 12,
    },
    createAccountLink: {
      color: BaseColor.primary,
      textDecorationLine: 'underline',
    },
    otpTextInput: {
      color: 'black',
      borderBottomWidth: 2,
      fontSize: 22,
      borderColor: BaseColor.primary,
      textAlign: 'center',
      width: '15%',
      height: 60,
    },
    headingText: {
      color: theme.theme.title,
      fontFamily: 'PoppinsMedium',
    },
    notMemberText: {
      color: theme.theme.placeholder,
    },
  });
};

export default Styles;
