import axios from "axios";
import { BASE_URL } from "../components/common/config";

export const GET_ADMINDASHBOARDDETAILS = "GET_ADMINDASHBOARDDETAILS";
export const GETEMPDETAIL = 'GETEMPDETAIL';
export const CREATEEMPLOYEEDETAIL = 'CREATEEMPLOYEEDETAIL';
export const GETACCESSORIES = 'GETACCESSORIES';
export const GETPROJECTES = 'GETPROJECTES';
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
      .then(function (response) {
        dispatch({
          type: GET_ADMINDASHBOARDDETAILS,
          payload: response
        });
      })
      .catch(function (error) { });
  };
}


export function createEmployeeDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'JWT ' + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/create_user_employee/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: CREATEEMPLOYEEDETAIL,
          payload: response
        });
      })
      .catch(function (error) {

      });
  }
}

export function getAccessories(data) {

  let URL = `http://35.154.43.111:9000/company/1/branch/1/accessories`;
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'JWT ' + branch.token,
    }
  };
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GETACCESSORIES,
          payload: response,
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProjectes(data) {

  let URL = `http://35.154.43.111:9000/company/1/branch/1/get_project_details/`;
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'JWT ' + branch.token,
    }
  };
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GETPROJECTES,
          payload: response,
        })
      })
      .catch(function (error) {

      });
  }
}