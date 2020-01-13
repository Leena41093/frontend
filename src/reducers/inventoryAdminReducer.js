import {
  GETEMPDETAIL,
  GET_ADMINDASHBOARDDETAILS,
  GET_COMPLAINTS,
  GET_PROJECTEMPLOYEEDATA,
  ADD_PROJECTDETAILS,
  GET_FINANCELIST
} from "../actions/inventoryAdminAction";

const initialState = {
  adminDashboardDetail: null,
  companyId: 1,
  adminbranchId: 1,
  employeeDetail: null,
  complaintsList: null,
  projectEmployeeDetail: null,
  addprojectdata: null,
  financeList: null
};

export default function inventoryAdmin(state = initialState, action) {
  switch (action.type) {
    case GETEMPDETAIL: {
      return {
        ...state,
        employeeDetail: action.payload
      };
    }
    case GET_ADMINDASHBOARDDETAILS: {
      return {
        ...state,
        adminDashboardDetail: action.payload
      };
    }
    case GET_COMPLAINTS: {
      return {
        ...state,
        complaintsList: action.payload
      };
    }
    case GET_PROJECTEMPLOYEEDATA: {
      return {
        ...state,
        projectEmployeeDetail: action.payload
      };
    }
    case ADD_PROJECTDETAILS: {
      return {
        ...state,
        addprojectdata: action.payload
      };
    }
    case GET_FINANCELIST: {
      return {
        ...state,
        financeList: action.payload
      };
    }
    default:
      return state;
  }
}
