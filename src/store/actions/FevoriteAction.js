import {ADD_TO_FEVORITE, REMOVE_FROM_FEVORITE} from '../actions/type'

export const addToFevorite = (fevoriteItem) => dispatch => {  
  return dispatch({ type: ADD_TO_FEVORITE, payload: fevoriteItem }); 
};

export const removeFromFevorite = (fevoriteItem) => dispatch => {
  return dispatch({ type: REMOVE_FROM_FEVORITE, payload: fevoriteItem });
}; 
export const setFevorite = (fevoriteItems) => dispatch => {
  return dispatch({ type: SET_FEVORITE_ITEM, payload: fevoriteItems });
}; 
