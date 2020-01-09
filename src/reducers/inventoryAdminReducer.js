import {
    GET_FINANCEINSTITUTEDETAIL,
    GET_ADMINDASHBOARDDETAILS
    
  } from "../actions/inventoryAdminAction";
  
  const initialState = {
    financeInstituteDetail: null,
    adminDashboardDetail:null
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
          adminDashboardDetail: action.payload
        }
      }
      default:
        return state;
    }
  }
  