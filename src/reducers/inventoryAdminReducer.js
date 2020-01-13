import {
   GETEMPDETAIL,
    GET_ADMINDASHBOARDDETAILS,
    GET_PROJECTEMPLOYEEDATA,
    ADD_PROJECTDETAILS,
    GET_ALLEMPLOYEES,
    CREATEEMPLOYEEDETAIL,
    GETACCESSORIES,
    GETPROJECTES,
    GET_COMPLAINTS,
  } from "../actions/inventoryAdminAction";
  
  const initialState = {
    adminDashboardDetail:null,
    companyId:1,
    adminbranchId:1,  
    employeeDetail:null  ,
    projectEmployeeDetail:null,
    addprojectdata:null,
    getAllEmployees:null,
  createEmp: null,
  accessories: null,
  projectes: null,
  complaintsList: null,
  };
  
  export default function inventoryAdmin(state = initialState, action) {
    switch (action.type) {
      
      case GETEMPDETAIL: {
        return {
          ...state,
          employeeDetail: action.payload
        };
      }
      case GET_ADMINDASHBOARDDETAILS:{
        return{
          ...state,
          adminDashboardDetail: action.payload
        }
      }

    case CREATEEMPLOYEEDETAIL: {
      return {
        ...state,
        createEmp: action.payload

      };
    }
    case GETACCESSORIES: {
      return {
        ...state,
        accessories: action.payload
      }
    }
    case GETPROJECTES: {
      return {
        ...state,
        projectes: action.payload
      }
    }
      case GET_ALLEMPLOYEES:{
        return{
          ...state,
          getAllEmployees:action.payload
        }
      }

    case ADD_PROJECTDETAILS: {
      return {
        ...state,
        addprojectdata: action.payload
      }    
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
   
    default:
      return state;
  }
}
