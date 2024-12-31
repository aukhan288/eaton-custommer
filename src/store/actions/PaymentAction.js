import {SET_PAYMENT_METHODE} from '../actions/type'

export const setPaymentMethode = (id, title, img, api_key, description) => dispatch => {
    return dispatch({ type: SET_PAYMENT_METHODE, id: id, title:title, img:img, api_key:api_key, description:description });
  };