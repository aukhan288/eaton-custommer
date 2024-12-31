import {SET_SIGNUP_INFO, VERIFY_OTP, LOGIN, LOGOUT, UPDATE_PROFILE} from '../actions/type'
const initialState = {
    name: '',
    mobile: '',
    password: '',
    token:'',
    ref_code:'', //referral code
    isLoggedIn:false,
  };

  const AuthReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_SIGNUP_INFO :{
            return {
              ...state,
              name : action.name,
              mobile : action.mobile,
              password : action.password,
              token:'',
              ref_code: action.ref_code,
              isLoggedIn:false,
            }
        }
        case VERIFY_OTP :{
          return {
            ...state,
            name : action.name,
            mobile : action.mobile,
            password : action.password,
            token: action.token,
            ref_code: action.ref_code,
            isLoggedIn: true
          }
      }

      case LOGIN :{
        return {
          ...state,
          name : action.name,
          mobile : action.mobile,
          password : action.password,
          token: action.token,
          ref_code: '',
          isLoggedIn: true
        }
    }

    case UPDATE_PROFILE :{
      return{
        ...state,
        name : action.name,
        mobile : action.mobile,
        password : '',
        token: action.token,
        ref_code: '',
        isLoggedIn: true
      }
    }

    case LOGOUT:{
      return {
        ...state,
        name : '',
        mobile : '',
        password : '',
        token: '',
        ref_code:'',
        isLoggedIn: false
      }
    }

        default:
            return state;
    }
  }

  export default AuthReducer;