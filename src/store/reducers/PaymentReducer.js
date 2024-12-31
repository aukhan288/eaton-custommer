import {SET_PAYMENT_METHODE} from '../actions/type'

const initialState = {
    paymentMethodeId : null,
    paymentMethodeTitle : '',
    paymentMethodeImg : '',
    api_key : null,
    description: '',
  };
  
  export default (state = initialState, action) => {
    switch(action.type){
      case SET_PAYMENT_METHODE:
        state.paymentMethodeId = null;
        state.paymentMethodeTitle = '';
        state.paymentMethodeImg = '';
        state.api_key = null;
        state.description= '';
        return{
          ...state,
          paymentMethodeId: action.id,
          paymentMethodeTitle: action.title,
          paymentMethodeImg: action.img,
          api_key: action.api_key,
          description: action.description
        }
  
        default:
          return state;
    }
  };