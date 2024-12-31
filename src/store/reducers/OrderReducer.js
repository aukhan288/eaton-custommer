import {SET_ORDER_ID} from '../actions/type';

const initialState = {
  orderDetailsId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER_ID:
      state.orderDetailsId = null;
      return {
        ...state,
        orderDetailsId: action.id,
      };

    default:
      return state;
  }
};
