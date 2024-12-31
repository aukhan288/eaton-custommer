import { API_BASE_URL } from '../../constants/Url';

import {
  SET_SIGNUP_INFO,
  VERIFY_OTP,
  LOGIN,
  LOGOUT,
  UPDATE_PROFILE,
  SET_FEVORITE_ITEM,
  
} from '../actions/type';


export const signup = (name, mobile, password, ref_code, plate_form) => {
  return async dispatch => {
    // API_BASE_URL+'signup_otp.php',
    const response = await fetch(
      API_BASE_URL+'signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          plate_form: plate_form,
          password: password,
          ref_code : ref_code   
        }),
      },
    );

    
    const resData = await response.json();
    // const resData =JSON.stringify(response);

    console.log('###############' ,resData);
    

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    dispatch({
      type: SET_SIGNUP_INFO,
      name: name,
      mobile: mobile,
      password: password,
      plate_form:plate_form,
      ref_code: ref_code
    });
  };
};

export const updateProfileData = (name, mobile, password, email) => {

  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'updateProfileData.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          password: password,
          email: email,
        }),
      },
    );

    const resData = await response.json();

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    // console.log(resData);
    dispatch({
      type: UPDATE_PROFILE,
      name: name,
      mobile: mobile,
      password: '',
      token: resData.token,
    });
  };
};

export const verifyotp = (name, mobile, password, otp, plate_form, fcmToken, ref_code) => {
  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'verify_signup_otp',
      // API_BASE_URL+'verify_signup_otp.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          password: password,
          otp: otp,
          plate_form:plate_form,
          fcmToken: fcmToken,
          ref_code: ref_code
        }),
      },
    );
    const resData = await response.json();
    console.log('**************',resData);

    if(resData.success == false){
      console.log('eeeeeeeeeeee', resData);
      
      throw new Error(resData.message);
    }

    // console.log(resData);

    dispatch({
      type: VERIFY_OTP,
      name: name,
      mobile: mobile,
      password: password,
      token: resData.token,
      ref_code: ref_code
    });
    dispatch({
      type: SET_FEVORITE_ITEM,
      products:resData?.favourite
    })
  };
};
export const login = (mobile, password, fcmToken) => {
  return async dispatch => {
    try {
      const response = await fetch(API_BASE_URL + 'login', {
      // const response = await fetch(API_BASE_URL + 'login.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          password: password,
          fcmToken: fcmToken
        }),
      });
      
      // const resData = await response.json(); // Parse as JSON
      const resText = await response.text(); // Get raw response text
      const resData = JSON.parse(resText);
      console.log('kkkkkkkkkkkkkkk',JSON.stringify(resData));
      
      
      // Check if the response is not okay (status 200-299)
      if (!response.ok) {
        // Handle error responses
        throw new Error(resData.msg || 'Something went wrong');
      }

      // Dispatch the login action with user data
      dispatch({
        type: LOGIN,
        name:resData?.data?.user?.name,
        mobile: resData?.data?.user?.mobile,
        token: resData?.data?.user?.token,
      });
      dispatch({
        type: SET_FEVORITE_ITEM,
        items:resData?.data?.favourite,
      });


    } catch (error) {
      console.error('Login error:', error);
      throw error; // Rethrow the error to be handled later if necessary
    }
  };
};
// export const login = (mobile, password, fcmToken) => {

  
//   return async dispatch => {
//     const response = await fetch(
//       API_BASE_URL+'login.php',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name:'Asad',
//           mobile: mobile,
//           password: password,
//           fcmToken: fcmToken
//         }),
//       },
//     );
//     console.log('ffffffffffff',response);
//     const resData = await response.text();
    
    
//     if(resData.status == 401){
//       throw new Error(resData.msg);
//     }

//     dispatch({
//       type: LOGIN,
//       name: resData.user.name,
//       mobile: resData.user.mobile,
//       password: resData.user.password,
//       token: resData.token,
//     });

//   };
// };

export const logout = () => {
  return {type: LOGOUT};
};

export const changePassword = (mobile, password, fcmToken) => {
  return async dispatch => {
    const response = await fetch(
      API_BASE_URL+'changePassword.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          password: password,
          fcmToken: fcmToken
        }),
      },
    );

    const resData = await response.json();

    if(resData.status == 401){
      throw new Error(resData.msg);
    }

    // console.log(resData.user.mobile);

    dispatch({
      type: LOGIN,
      name: resData.user.name,
      mobile: resData.user.mobile,
      password: resData.user.password,
      token: resData.token,
    });

  };
};