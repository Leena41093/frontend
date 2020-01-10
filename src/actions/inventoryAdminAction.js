import axios from "axios";
import { BASE_URL } from "../components/common/config";

export const GETEMPDETAIL = 'GETEMPDETAIL';

export function getEmployeeList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'JWT ' + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.companyId}/branch/${data.branch_id}/employeeList/`;
  let payload = data.payload

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {

    });
}

export function getEmployeeDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'JWT ' + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/employeeProjectAccessoryDetails/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GETEMPDETAIL,
          payload: response
        });
      })
      .catch(function (error) {

      });
  }
}
