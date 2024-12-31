import {SET_MIN_ORDER_AMT} from '../actions/type';

const initialState = {
  minOrderAmt: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {
      case SET_MIN_ORDER_AMT:
        return {
          ...state,
          minOrderAmt: action.minAmt,
        };
  
      default:
        return state;
    }
  };
  