import {
  ADD_TO_CART,
  REMOVE_TO_CART,
  EMPTY_CART,
  DELETE_ITEM,
} from '../actions/type';
import CartModel from '../../models/cartModel';
const initialState = {
  cartProducts: {},
  totalAmount: 0,
};

const CartReducer = (state = initialState, action) => {
  console.log('zzzzzzzzzzz',action.payload);
  
  switch (action.type) {
    case ADD_TO_CART:
      const productTypePriceId = action.payload[4];
      const product_name = action.payload[0];
      const product_img = action.payload[1];
      const discount = action.payload[2];
      const popular = action.payload[3];

      if (action.payload[5] != undefined) {
        var productCount = action.payload[5];
      } else {
        var productCount = 1;
      }

      let myArr = productTypePriceId?.split('_');
      const product_id = parseInt(myArr[0]);
      const pgms = myArr[1];
      const pprice = parseInt(myArr[2]);
      let updatedOrNewCartItem;

      if (state.cartProducts[productTypePriceId]) {
        // already have the item in the cart
        updatedOrNewCartItem = new CartModel(
          state.cartProducts[productTypePriceId].quantity + productCount,
          pprice,
          pgms,
          state.cartProducts[productTypePriceId].sum + pprice * productCount,
          product_name,
          product_img,
          discount,
          popular,
          productTypePriceId,
        );
      } else {
        updatedOrNewCartItem = new CartModel(
          productCount,
          pprice,
          pgms,
          pprice * productCount,
          product_name,
          product_img,
          discount,
          popular,
          productTypePriceId,
        );
      }
      // console.log('updatedOrNewCartItem :- ',updatedOrNewCartItem);
      return {
        ...state,
        cartProducts: {
          ...state.cartProducts,
          [productTypePriceId]: updatedOrNewCartItem,
        },
        totalAmount: state.totalAmount + pprice * productCount,
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
