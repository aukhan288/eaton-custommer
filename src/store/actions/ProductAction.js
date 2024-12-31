import {FETCH_PRODUCTS} from '../actions/type';

export const fetchProducts = resData => {
  return async dispatch => {
    dispatch({
      type: FETCH_PRODUCTS,
      products: resData,
    });
  };
};
