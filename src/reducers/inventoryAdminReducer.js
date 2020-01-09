import {
    GET_FINANCEINSTITUTEDETAIL,
    
  } from "../actions/inventoryAdminAction";
  
  const initialState = {
    financeInstituteDetail: null,
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
      default:
        return state;
    }
  }
  