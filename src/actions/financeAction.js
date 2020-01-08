import axios from "axios";
import { BASE_URL } from "../components/common/config";
export const GET_FINANCECLASSDATA = "GET_FINANCECLASSDATA";
export const CREATEFINANCECLASSTEMPLATE = "CREATEFINANCECLASSTEMPLATE";
export const GET_FINANCEINSTITUTEDETAIL = "GET_FINANCEINSTITUTEDETAIL";
export const ADD_FINANCEINSTITUTEDETAIL = "ADD_FINANCEINSTITUTEDETAIL";
export const GET_INSTITUTEBANKDETAIL = "GET_INSTITUTEBANKDETAIL";
export const ADD_INSTITUTEBANKDETAIL = "ADD_INSTITUTEBANKDETAIL";
export const GET_INCOMEEXPENSEDETAILS = "GET_INCOMEEXPENSEDETAILS";
export const ADD_INSTITUTEINCOME = "ADD_INSTITUTEINCOME";
export const ADD_INSTITUTEEXPENCE = "ADD_INSTITUTEEXPENCE";
export const UPLOAD_INVOICERECEIPTPRINT = "UPLOAD_INVOICERECEIPTPRINT";
export const GET_FINANCETEMPLATEDATA = "GET_FINANCETEMPLATEDATA";
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
          type: GET_FINANCECLASSDATA,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function createFinanceClassTemplate(data) {
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${
    data.branch_id
  }/createFinanceClassTemplate/`;
  let payload = data.payload;

  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: CREATEFINANCECLASSTEMPLATE,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getFinanceInstituteDetails(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/instituteFinanceDetail/`;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };
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

export function createFinanceInstituteDetails(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/instituteFinanceDetail/ `;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: ADD_FINANCEINSTITUTEDETAIL,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getInstituteBankDetails(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/instituteBankDetail/`;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };
  return dispatch => {
    return axios
      .get(URL, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: GET_INSTITUTEBANKDETAIL,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function createInstituteBankDetails(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/instituteBankDetail/ `;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: ADD_INSTITUTEBANKDETAIL,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getIncomeExpenseDetails(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/instituteIncomeExpenseCalcution/ `;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };
  return dispatch => {
    return axios
      .get(URL, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: GET_INCOMEEXPENSEDETAILS,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function createInstituteIncome(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/instituteIncome/`;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: ADD_INSTITUTEINCOME,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function createInstituteExpence(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/instituteExpense/ `;

  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: ADD_INSTITUTEEXPENCE,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getFinanceTemplateData(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/financeClassTemplate`;

  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };
  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: GET_FINANCETEMPLATEDATA,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function uploadInvoicePrint(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${
    data.branch_id
  }/uploadInvoiceReceiptPrint/`;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let payload = data.payload;
  return dispatch => {
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) {
        dispatch({
          type: UPLOAD_INVOICERECEIPTPRINT,
          payload: response
        });
      })
      .catch(function(error) {});
  };
}

export function getIncomeExpenceList(data) {
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/instituteIncomeExpenseList/`;
  const API_CONFIG = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + data.token
    }
  };

  let payload = data.payload;
    return axios
      .post(URL, payload, API_CONFIG)
      .then(function(response) { 
          return response;
      })
      .catch(function(error) {});
}
