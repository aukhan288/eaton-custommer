import {
  CHANGE_THEME, CHANGE_LANGUAGE
} from '../actions/type';

const initialState = {
  theme: 'light',
  language: 'en',
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case CHANGE_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    default:
      return state;
  }
};
