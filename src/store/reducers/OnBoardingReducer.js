import {DISABLED_ONBOARDING} from '../actions/type';

const initialState = {
    disabledOnBoarding : 0,
  };

  export default (state = initialState, action) => {
    switch(action.type){
      case DISABLED_ONBOARDING:
        state.disabledOnBoarding = 0;
        return{
          ...state,
          disabledOnBoarding: 1,
        }
  
        default:
          return state;
    }
  };