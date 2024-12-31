import {StyleSheet} from 'react-native';
import {BaseColor, useTheme} from '../config/theme';

const Styles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    tabBar: {
        height: 50,
        position: 'absolute',
        borderRadius: 6,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
        backgroundColor: theme.theme.darkBackground,
        elevation:5
      },
      tabButton: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor:BaseColor.secondary
      },
      iconContainer: {
      },
      iconContainerFocused: {
        backgroundColor: BaseColor.primary,
        borderRadius: 50,
        padding: 12,
        position: 'absolute',
        color:'#e69c00',
        top: -16,
      },
      label: {
        fontFamily: 'PoppinsRegular',
        fontSize: 12,
        marginTop: 30,
        color:theme.theme.title
      },
  });
};

export default Styles;
