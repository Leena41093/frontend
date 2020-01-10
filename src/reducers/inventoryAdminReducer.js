import {
  GETEMPDETAIL,
  GET_ADMINDASHBOARDDETAILS,
  CREATEEMPLOYEEDETAIL,
  GETACCESSORIES,
  GETPROJECTES
} from "../actions/inventoryAdminAction";

const initialState = {
  adminDashboardDetail: null,
  employeeDetail: null,
  createEmp:null,
  accessories:null,
  projectes:null
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
      }
    }

    case CREATEEMPLOYEEDETAIL: {
      return {
        ...state,
        createEmp: action.payload
      }
    }
    case GETACCESSORIES :{
      return {
        ...state,
        accessories:action.payload
      }
    }
    case GETPROJECTES :{
      return {
        ...state,
        projectes:action.payload
      }
    }
    default:
      return state;
  }
}
