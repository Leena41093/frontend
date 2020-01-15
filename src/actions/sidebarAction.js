import axios from 'axios';
import {BASE_URL} from '../components/common/config';
export const GET_BRANCHES = 'GET_BRANCHES';
let token = `JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJiaHVzaGFuM0BnbWFpbC5jb20iLCJleHAiOjQ1Njg4MDQ1NDYsImVtYWlsIjoiYmh1c2hhbjNAZ21haWwuY29tIn0.5nD6ysJLChbte4EM1OL0rwU9hM3ZZtT2KtUcAa23KXQ`
export function getBranches(data) {
    
    const API_CONFIG = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+token,
      }
    };
    let URL = `${BASE_URL}institude/${data.instituteId}/branches`;
    return dispatch => {
      return axios.get(URL, API_CONFIG)
        .then(function (response) {
          
          dispatch({
            type: GET_BRANCHES,
            payload: response.data.response
          })
        })
        .catch(function (error) {
          
        });
    }
  }