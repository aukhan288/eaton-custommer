import {SET_ORDER_ID} from '../actions/type';

export const setOrderId = id => dispatch => {
  return dispatch({type: SET_ORDER_ID, id: id});
};
