import {SET_DELIVERY_DATE, SET_DELIVERY_DATE_TIME} from '../actions/type';

export const setDeliveryDate = (deliveryDate) => dispatch =>{
    return dispatch({ type: SET_DELIVERY_DATE, payload: deliveryDate }); 
}

export const setDeliveryDateTime = (dateTimeArray) => dispatch =>{
    return dispatch({ type: SET_DELIVERY_DATE_TIME, payload: dateTimeArray }); 
}