



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
  });
};

export default Styles;