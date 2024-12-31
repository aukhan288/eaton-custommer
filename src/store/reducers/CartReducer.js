import {
  ADD_TO_CART,
  REMOVE_TO_CART,
  EMPTY_CART,
  DELETE_ITEM,
} from '../actions/type';
import CartModel from '../../models/cartModel';
const initialState = {
  cartProducts: []
};

const CartReducer = (state = initialState, action) => {
  console.log('zzzzzzzzzzz',action.payload);
  
  switch (action.type) {
    case ADD_TO_CART:

      return {
        ...state,
        cartProducts: {
          ...state.cartProducts,
        }
      };

    case REMOVE_TO_CART:
      const productTypePriceId1 = action.payload[4];

      let myArr1 = productTypePriceId1.split('_');
      const product_id1 = parseInt(myArr1[0]);
      const pgms1 = myArr1[1];
      const pprice1 = parseInt(myArr1[2]);

      const selectedCartItem = state.cartProducts[productTypePriceId1];

      if (selectedCartItem != undefined) {
        const currentQty = selectedCartItem.quantity;
        let updatedCartItems;
        if (currentQty > 1) {
          // need to reduce it, not erase it
          const updatedCartItem = new CartModel(
            selectedCartItem.quantity - 1,
            selectedCartItem.productPrice,
            selectedCartItem.productVariation,
            selectedCartItem.sum - pprice1,
            selectedCartItem.product_name,
            selectedCartItem.product_img,
            selectedCartItem.discount,
            selectedCartItem.popular,
            selectedCartItem.productTypePriceId,
          );
          updatedCartItems = {
            ...state.cartProducts,
            [productTypePriceId1]: updatedCartItem,
          };
        } else {
          updatedCartItems = {...state.cartProducts};
          delete updatedCartItems[productTypePriceId1];
        }
        return {
          ...state,
          cartProducts: updatedCartItems,
          totalAmount: state.totalAmount - pprice1,
        };
      } else {
        return {...state};
      }

    case EMPTY_CART:
      return {
        cartProducts: {},
        totalAmount: 0,
      };

    case DELETE_ITEM:
      const productTypePriceId2 = action.payload;

      const selectedCartItem2 = state.cartProducts[productTypePriceId2];
      const currentQty2 = selectedCartItem2.quantity;
      const productPrice2 = selectedCartItem2.productPrice;
      const discount2 = selectedCartItem2.discount;
      let updatedCartItems2;
      updatedCartItems2 = {...state.cartProducts};
      delete updatedCartItems2[productTypePriceId2];
      return {
        ...state,
        cartProducts: updatedCartItems2,
        totalAmount:
          state.totalAmount -
          productPrice2 * currentQty2 * ((100 - discount2) / 100),
      };

    default:
      return state;
  }
};

export default CartReducer;
