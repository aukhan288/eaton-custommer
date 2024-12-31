import {StyleSheet} from 'react-native';
import {BaseColor, useTheme} from '../../config/theme';

const Styles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.theme.background,
    },
    textInputHeading: {
      color: BaseColor.label,
      fontFamily: 'JostRegular',
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
      fontFamily: 'JostRegular',
      fontSize: 12,
    },

    contentContainer: {marginHorizontal: 15},
    logoIcon: {alignSelf: 'center', marginTop: 20, backgroundColor:BaseColor.backgroundColor},
    mainHeding: {
      alignSelf: 'center',
      marginTop: 15,
      fontSize: 20,
      color: BaseColor.primary,
      fontFamily: 'JostMedium',
    },
    subHeading: {
      alignSelf: 'center',
      color: theme.theme.text,
      fontFamily: 'JostMedium',
    },
    phoneCode: {
      marginRight: 10,
      fontFamily: 'JostRegular', 
      color: theme.theme.text,
    },
    textInput: {width: '100%', color: theme.theme.title},
    textInputWithRightIcon: {width: '85%', color: theme.theme.title},
    icon:{color: theme.theme.textLight},
    firstInputTextContainer:{marginTop: 30},
    nextInputTextContainer:{marginTop: 20},

    functionalLabelBtn:{
      color: BaseColor.backgroundColor,
      fontFamily: 'JostMedium',
    },

    footerContainer:{marginHorizontal: 15, alignSelf: 'center', marginTop: 50},
    notRegister:{fontFamily: 'JostRegular', color:theme.theme.text},

    otpTimeCounter:{color: BaseColor.success, fontFamily:'JostRegular'}
  });
};

export default Styles;
