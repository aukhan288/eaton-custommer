import {DISABLED_ONBOARDING} from '../actions/type';

export const disabledOnBoarding = () => dispatch => {
    return dispatch({ type: DISABLED_ONBOARDING, payload: '' });
  }; 