import {
    GET_FINANCEINSTITUTEDETAIL,
    GET_ADMINDASHBOARDDETAILS
    
  } from "../actions/inventoryAdminAction";
  
  const initialState = {
    financeInstituteDetail: null,
    adminDashboardDetail:null,
    companyId:1,
    adminbranchId:1,    
  };
  
  export default function inventoryAdmin(state = initialState, action) {
    switch (action.type) {
      case GET_FINANCEINSTITUTEDETAIL: {
        return {
          ...state,
          financeInstituteDetail: action.payload
        };
      }
      case GET_ADMINDASHBOARDDETAILS:{
        return{
          ...state,
          adminDashboardDetail: action.payload
        }
      }
      default:
        return state;
    }
  }
  