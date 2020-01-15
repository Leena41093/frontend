import axios from 'axios';
import {BASE_URL3 } from '../components/common/config';
import {BASE_URL2} from '../components/common/config';
// let BASE_URL = 'http://35.154.43.111:8000/'
// let BASE_URL2 = 'http://35.154.43.111:7000/'
const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxOCwidXNlcm5hbWUiOiJhc2hpc2hAZ21haWwuY29tIiwiZXhwIjoxNTM0MTg0NzEyLCJlbWFpbCI6ImFzaGlzaEBnbWFpbC5jb20ifQ.T1rHA5bldLBdvBwGfClIY3RhYiR2TnDPmVc79QSWo90'
  }
};
export const LOGIN_STUDENT = 'LOGIN_STUDENT';
export const LOGOUT = 'LOGOUT';
export const STORE_STUDENTTOKEN = 'STORE_STUDENTTOKEN';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const VERIFY_PASSWORDOTP = 'VERIFY_PASSWORDOTP';
export const UPDATE_FORGOTPASSWORD = 'UPDATE_FORGOTPASSWORD';
export const AUTH_CHECK = 'AUTH_CHECK';
export const CHANGE_PASSWORDFORGOTPAGE = 'CHANGE_PASSWORDFORGOTPAGE';
export const LOGIN_USER = 'LOGIN_USER';

export function loginStudent(data) {
  
  
  let URL = `${BASE_URL3}login/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload)
      .then(function (response) {
        
        dispatch({
          type: LOGIN_STUDENT,
          payload: response,
          usertype:response.data.user_type,
          token:response.data.token,
        })
      })
      .catch(function (error) {
        
      });
  }
}

export function checkAuth(data) {
  
  
  let URL = `${BASE_URL3}institude/authCheck/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload)
      .then(function (response) {
        
        dispatch({
          type: AUTH_CHECK,
          payload: response,
          usertype:response.data.response.user_type,
          token:response.data.response.token,
        })
      })
      .catch(function (error) {
       
      });
  }
}

export function logout(data) {
  
  return dispatch => {
    
        dispatch({
          type: LOGOUT,
          payload: '',
          usertype:'',
          token:'',
        })
      
  }
}


export function storeStudentToken(data) {
  
  let URL = `${BASE_URL2}auth-token/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
       
        dispatch({
          type: STORE_STUDENTTOKEN,
          payload: response
        })
      })
      .catch(function (error) {
       
      });
  }
}

export function forgotPassword(data) {
  
  let URL = `${BASE_URL3}master/forgotPassword/otp/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload)
      .then(function (response) {
       
        dispatch({
          type: FORGOT_PASSWORD,
          payload: response
        })
      })
      .catch(function (error) {
        
      });
  }
}

export function verifyPassword(data) {
  
  let URL = `${BASE_URL3}master/verifyPassword/otp/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload)
      .then(function (response) {
        
        dispatch({
          type: VERIFY_PASSWORDOTP,
          payload: response
        })
      })
      .catch(function (error) {
       
      });
  }
}

export function updateForgotPassword(data) {
  
  let URL = `${BASE_URL3}master/user/${data.user_id}/forgotPassword/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL,payload,{
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(function (response) {
       
        dispatch({
          type: UPDATE_FORGOTPASSWORD,
          payload: response
        })
      })
      .catch(function (error) {
        
      });
  }
}

export function changePasswordForgotPage(data) {
  
  let URL = `${BASE_URL3}institude/changePassword/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL,payload,{
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(function (response) {
       
        dispatch({
          type: CHANGE_PASSWORDFORGOTPAGE,
          payload: response
        })
      })
      .catch(function (error) {
        
      });
  }
}

export function loginUser(data) {
    
  let URL = `http://35.154.43.111:9000/login/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload,{
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(function (response) {
        
        dispatch({
          type: LOGIN_USER,
          payload: response.data.response,
          usertype:response.data.response.user_type,
          token:response.data.response.token,
          company_id:response.data.response.company_id,
          branch_id:response.data.response.branch_id
        })
      })
      .catch(function (error) {
        
      });
  }
}