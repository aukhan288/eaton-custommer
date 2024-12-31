import {SET_MIN_ORDER_AMT} from '../actions/type';

export const setMinOrderAmt = (minAmt) => dispatch => {
  return dispatch({type: SET_MIN_ORDER_AMT, minAmt: minAmt});
};
