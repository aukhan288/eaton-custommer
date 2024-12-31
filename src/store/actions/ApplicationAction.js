import {
  CHANGE_THEME, CHANGE_LANGUAGE
} from '../actions/type';

const changeTheme = theme => {
  return {
    type: CHANGE_THEME,
    theme,
  };
};

const changeLanguge = language => {
  return {
    type: CHANGE_LANGUAGE,
    language,
  };
};

export const onChangeTheme = theme => dispatch => {
  dispatch(changeTheme(theme));
};

export const onChangeLanguage = language => dispatch => {
  dispatch(changeLanguge(language));
};
