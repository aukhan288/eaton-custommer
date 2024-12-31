import {ADD_TO_CART, REMOVE_TO_CART, EMPTY_CART, DELETE_ITEM} from '../actions/type'

export const addToCart = (cartReadyItems) => dispatch => {  
  return dispatch({ type: ADD_TO_CART, payload: cartReadyItems }); 
};

export const removeToCart = (cartReadyItems) => dispatch => {
  return dispatch({ type: REMOVE_TO_CART, payload: cartReadyItems });
}; 

export const emptyCart = () => dispatch => {
  return dispatch({ type: EMPTY_CART, payload: '' });
}; 

export const deleteItem = (productTypePriceId) => dispatch => {
  return dispatch({ type: DELETE_ITEM, payload: productTypePriceId });
}; 