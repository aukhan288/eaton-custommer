import {FETCH_PRODUCTS} from '../actions/type';
const initialState = {
  availableProducts: [],
};

export default (state = initialState, action) => {
  switch(action.type){
    case FETCH_PRODUCTS:
      return{
        ...state,
        availableProducts:[...state.availableProducts, action.products],
      }

      default:
        return state;
  }
};