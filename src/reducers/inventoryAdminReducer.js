import {
   GETEMPDETAIL,
    GET_ADMINDASHBOARDDETAILS,
    GET_COMPLAINTS
    
  } from "../actions/inventoryAdminAction";
  
  const initialState = {
    adminDashboardDetail:null,
    companyId:1,
    adminbranchId:1,  
    employeeDetail:null  ,
    complaintsList:null,
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
      case GET_COMPLAINTS:
        {
          return{
            ...state,
            complaintsList:action.payload
          }
        }
      default:
        return state;
    }
  }
  