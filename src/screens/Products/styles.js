import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor, useTheme} from '../../config/theme';

export default Styles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.theme.darkBackground,
      },
      swiperContainer: {
        height: 270,
        paddingVertical: 10,
      },
      discountBadge: {
        backgroundColor: BaseColor.secondary,
        color: BaseColor.black,
        width: 65,
        borderRadius: 50,
        paddingLeft: 8,
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 999,
        fontFamily: 'JostRegular',
      },
      cardContent: {
        borderRadius: 0,
        backgroundColor: '#FFF',
      },
      productTitle: {
        fontFamily: 'JostMedium',
        color: theme.theme.title,
        fontSize: 18,
      },
      productInfo: {
        fontFamily: 'JostRegular',
        color: theme.theme.textLight,
      },
      productPrice: {
        marginTop: 15,
        fontFamily: 'JostRegular',
        color: theme.theme.title,
      },
      
      productDesc: {
        marginTop: 15,
        fontFamily: 'JostRegular',
        color: theme.theme.title,
      },
      
      unitsTitle: {
        marginVertical: 10,
        fontFamily: 'JostRegular',
        color: theme.theme.title,
        fontSize: 16,
      },
      chip: {
        marginRight: 10,
      },
      descriptionTitle: {
        marginVertical: 10,
        fontFamily: 'JostRegular',
        color: theme.theme.title,
        fontSize: 16,
      },
      descriptionText: {
        textAlign: 'justify',
        fontSize: 14,
        fontFamily: 'JostRegular',
        color: theme.theme.title,
      },


      productInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        borderColor: theme.theme.textLight,
        paddingBottom: 15,
      },
      productPriceContainer: {
        flex: 1,
        flexDirection:'row',
        alignItems:'center'
      },
      productPriceText: {
        marginTop: 15,
        fontFamily: 'JostRegular',
        color: theme.theme.title,
      },
      discountedPriceText: {
        textDecorationLine: 'line-through',
      },
      productInnerListBtn: {
        borderRadius:25,
        width:80,
        paddingVertical:5,
        justifyContent:'center',
        alignItems:'center'
      },
      currencyIcon: {
        fontSize: 14,
      },
      sellingPriceText: {
        marginTop: 15,
        lineHeight: 15,
        fontFamily: 'JostRegular',
        color: BaseColor.primary,
      },
      taxText: {
        marginBottom: 10,
        fontFamily: 'JostRegular',
        color: theme.theme.textLight,
      },
      quantityContainer: {
        flexDirection: 'row',
        flex:1,
        justifyContent:'space-between',
        alignItems:'center'
      },
      quantityTextContainer: {
        paddingBottom: 15,
        paddingLeft: 5,
        flexDirection:'row',
        alignItems:'center',
        marginTop:10
      },
      quantityText: {
        fontFamily: 'JostRegular',
        color: theme.theme.title,
      },
      addButton: {
        marginLeft: 5,
        borderRadius:5
      },
      cartIcon: {
        color: 'white',
        marginHorizontal: 10,
      },

      unitsContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        borderColor: theme.theme.textLight,
        borderBottomWidth: 1,
        paddingBottom: 15,
      },

      searchbar: {
        backgroundColor: theme.theme.background,
        borderRadius: 0,
        fontFamily:'JostRegular'
      },
      emptyView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').width + 100,
      },
      emptyImage: {
        width: 100,
        height: 100,
      },
      emptyMessage: {
        textAlign: 'center',
        marginHorizontal: 60,
        color: theme.theme.text,
        fontFamily:'JostRegular'
      },
      notFoundView: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        bottom: 70,
        width: '100%',
      },
      notFoundMessage: {
        textAlign: 'center',
        marginHorizontal: 60,
        color: theme.theme.textLight,
        fontFamily:'JostRegular'
      },
      sendEnquiryButton: {
        backgroundColor: BaseColor.primary,
      },
  });
};
