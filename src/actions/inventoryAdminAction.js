import axios from "axios";
import {
  BASE_URL
} from "../components/common/config";

export const GET_ADMINDASHBOARDDETAILS = "GET_ADMINDASHBOARDDETAILS";
export const GETEMPDETAIL = "GETEMPDETAIL";
export const GET_COMPLAINTS = "GET_COMPLAINTS";
export const GET_PROJECTEMPLOYEEDATA = "GET_PROJECTEMPLOYEEDATA"
export const CREATEEMPLOYEEDETAIL = 'CREATEEMPLOYEEDETAIL';
export const GETACCESSORIES = 'GETACCESSORIES';
export const GETPROJECTES = 'GETPROJECTES';
export const ADD_PROJECTDETAILS = "ADD_PROJECTDETAILS";
export const ASSIGN_PROJECT_ACCESSORIES = 'ASSIGN_PROJECT_ACCESSORIES';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const DELETE_ACCESSORIES = 'DELETE_ACCESSORIES';
export const DELETE_EMP = 'DELETE_EMP';
export const GET_FINANCELIST = "GET_FINANCELIST";
export const GET_ALLEMPLOYEES = "GET_ALLEMPLOYEES";
export const PROJECT_EMPLOYEE_DETAILS = "PROJECT_EMPLOYEE_DETAILS"
export const ADD_ACCESSORIE = 'ADD_ACCESSORIE';
export const ADD_INCOME = "ADD_INCOME";
export const ADD_EXPENCE = "ADD_EXPENCE";
export const DELETECOMPLETEPROJECT = "DELETECOMPLETEPROJECT"
export const ADDEMPLOYEETOPROJECT = "ADDEMPLOYEETOPROJECT"
export const DELETEEMPLOYEEFROMPROJECT = "DELETEEMPLOYEEFROMPROJECT"
export const DELETEINCOME = "DELETEINCOME"
export const DELETEEXPENSE = "DELETEEXPENSE"
export const DELETE_ACCESSORY = 'DELETE_ACCESSORY'
export const UPDATE_COMPLAINT = "UPDATE_COMPLAINT"
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
    .then(function (response) {
      return response;
    })
    .catch(function (error) {});
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
      .then(function (response) {
        dispatch({
          type: GETEMPDETAIL,
          payload: response
        });
      })
      .catch(function (error) {});
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
      .then(function (response) {
        dispatch({
          type: GET_ADMINDASHBOARDDETAILS,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function createEmployeeDetail(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/create_user_employee/`;

  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: CREATEEMPLOYEEDETAIL,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}
export function getInventoryComplaints(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/complaintsListDetails/`;
  let payload = data.payload;

  return axios
    .post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {});
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
    .then(function (response) {
      return response;
    })
    .catch(function (error) {});
}

export function getAccessories(data) {
  let URL = `http://35.154.43.111:9000/company/1/branch/1/accessories`;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + branch.token,
    }
  };
  return dispatch => {
    return axios
      .get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GETACCESSORIES,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function getProjectes(data) {
  let URL = `http://35.154.43.111:9000/company/1/branch/1/get_project_details/`;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + branch.token,
    }
  };
  return dispatch => {
    return axios
      .get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GETPROJECTES,
          payload: response
        });
      })
      .catch(function (error) {});
  };
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
      .then(function (response) {
        dispatch({
          type: GET_PROJECTEMPLOYEEDATA,
          payload: response
        });
      })
      .catch(function (error) {});
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
      .then(function (response) {
        dispatch({
          type: ADD_PROJECTDETAILS,
          payload: response
        });
      })
      .catch(function (error) {});
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

  return axios
    .post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {});
}

export function getAllEmployee(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${
    data.branch_id
  }/get_employee_details/  `;
  return dispatch => {
    return axios
      .get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_ALLEMPLOYEES,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function addIncome(data) {
  console.log("data", data);
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${
    data.branch_id
  }/income_details`;
  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_INCOME,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function addExpences(data) {
  console.log("data", data);
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${
    data.branch_id
  }/expenses`;
  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_EXPENCE,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}


export function assignProjectAndAccessories(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/projectAccessoryAdd/ `;
  let payload = data.payload
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ASSIGN_PROJECT_ACCESSORIES,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteProjectfromEmp(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/deleteProjectEmp/ `;
  let payload = data.payload
  return dispatch => {
    return axios
      .put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_PROJECT,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteAccessoriesfromEmp(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/deleteAccssoryEmp/`;
  let payload = data.payload
  return dispatch => {
    return axios
      .put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_ACCESSORIES,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteEmployee(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/delete_employee/`;
  let payload = data.payload
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_EMP,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function projectEmployeeDetails(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/projectEmpDetails/`;
  let payload = data.payload
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: PROJECT_EMPLOYEE_DETAILS,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteProject(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/delete_project/`;
  let payload = data.payload
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETECOMPLETEPROJECT,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function addEmployeeProject(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/projectEmployeeAdd/ `;
  let payload = data.payload
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADDEMPLOYEETOPROJECT,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function getAccessoriesList(data) {

  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/accessoryList/`;

  let payload = data.payload;
  return axios
    .post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {});
}

export function addAccessories(data) {

  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': 'JWT ' + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/accessories`;

  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_ACCESSORIE,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteProjectEmployee(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/deleteProjectEmp/`;
  let payload = data.payload
  return dispatch => {
    return axios
      .put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETEEMPLOYEEFROMPROJECT,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteIncome(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/income_details/${data.income_id}`;
  return dispatch => {
    return axios
      .delete(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETEINCOME,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteExpense(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };

  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/expense/${data.expense_id}`;
  return dispatch => {
    return axios
      .delete(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETEEXPENSE,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function deleteAccessory(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/deleteaccessory/${data.accessory_id}/`;

  return dispatch => {
    return axios
      .delete(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_ACCESSORY,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}

export function updateComplaints(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      // Authorization: "JWT " + data.token
    }
  };
  let URL = `http://35.154.43.111:9000/company/${data.company_id}/branch/${data.branch_id}/complaint/${data.complaint_id}`;
let payload = data.paylaod;
  return dispatch => {
    return axios
      .put(URL,payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: UPDATE_COMPLAINT,
          payload: response
        });
      })
      .catch(function (error) {});
  };
}