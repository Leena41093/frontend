import axios from "axios";
import { BASE_URL } from "../components/common/config";
export const GET_ADMINDASHBOARDDETAILS = "GET_ADMINDASHBOARDDETAILS";

export const GETEMPDETAIL = "GETEMPDETAIL";
export const GET_COMPLAINTS = "GET_COMPLAINTS";
export const GET_PROJECTEMPLOYEEDATA = "GET_PROJECTEMPLOYEEDATA";
export const GET_FINANCELIST = "GET_FINANCELIST";

export const ADD_PROJECTDETAILS = "ADD_PROJECTDETAILS";

export function getEmployeeList(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.companyId}/branch/${
    data.branch_id
  }/employeeList/`;
  let payload = data.payload;

  return axios
    .post(URL, payload, API_CONFIG)
    .then(function(response) {
      return response;
    })
    .catch(function(error) {});
}

export function getEmployeeDetail(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${
    data.branch_id
  }/employeeProjectAccessoryDetails/`;
  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: GETEMPDETAIL,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getAdminDashboardData(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.companyId}/branch/${
    data.branch_id
  }/dashboadDetails/ `;

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

export function getInventoryComplaints(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.companyId}/branch/${
    data.branch_id
  }/complaintsList/ `;
  let payload = data.payload;

  return axios
    .post(URL, payload, API_CONFIG)
    .then(function(response) {
      return response;
    })
    .catch(function(error) {});
}
export function getProjectList(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.companyId}/branch/${
    data.branch_id
  }/projectList/ `;
  let payload = data.payload;

  return axios
    .post(URL, payload, API_CONFIG)
    .then(function(response) {
      return response;
    })
    .catch(function(error) {});
}

export function getProjectEmployeeData(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${
    data.branch_id
  }/projectEmpDetails/  `;
  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: GET_PROJECTEMPLOYEEDATA,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function addProjectData(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${
    data.branch_id
  }/add_project_details/  `;
  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: ADD_PROJECTDETAILS,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getFinanceList(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${
    data.branch_id
  }/income-expense-pagination`;
  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: GET_FINANCELIST,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}
