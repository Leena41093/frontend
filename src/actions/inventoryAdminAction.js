import axios from "axios";
import { BASE_URL } from "../components/common/config";
export const GET_FINANCEINSTITUTEDETAIL = "GET_FINANCEINSTITUTEDETAIL";
export const GET_ADMINDASHBOARDDETAILS = "GET_ADMINDASHBOARDDETAILS";

export function getFinanceClassData(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${
    data.branch_id
  }/instituteClassesList/`;

  return dispatch => {
    return axios
      .get(URL, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: GET_FINANCEINSTITUTEDETAIL,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getEmployeeList(data) {
    console.log("da",data)
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

  export function getAdminDashboardData(data) {
    const API_CONFIG = {
      headers: {
        "Content-Type": "application/json",
       // Authorization: "JWT " + data.token
      }
    };
  
    let URL = `http://35.154.43.111:9000/company/${data.companyId}/branch/${data.branch_id}/dashboadDetails/ `;
  
    return dispatch => {
      return axios
        .get(URL, API_CONFIG)
        .then(function(response) {
          dispatch({
            type: GET_ADMINDASHBOARDDETAILS,
            payload: response
          });
        })
        .catch(function(error) {});
    };
  }
  