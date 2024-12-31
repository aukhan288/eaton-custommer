import {SET_DELIVERY_DATE, SET_DELIVERY_DATE_TIME} from '../actions/type';

const initialState = {
  deliveryDate: null,
  deliveryTime: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DELIVERY_DATE:
      return {
        ...state,
        deliveryDate: action.deliveryDate,
        deliveryTime: null,
      };

    case SET_DELIVERY_DATE_TIME:
      return {
        ...state,
        deliveryDate: action.payload[0],
        deliveryTime: action.payload[1],
      };

    default:
      return state;
  }
};
