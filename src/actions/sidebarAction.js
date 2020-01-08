import axios from 'axios';
import {BASE_URL} from '../components/common/config';
export const GET_BRANCHES = 'GET_BRANCHES';

export function getBranches(data) {
    
    const API_CONFIG = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+data.token,
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