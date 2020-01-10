import {
   GETEMPDETAIL
    
  } from "../actions/inventoryAdminAction";
  
  const initialState = {
   
    companyId:1,
    adminbranchId:1,  
    employeeDetail:null  
  };
  
  export default function inventoryAdmin(state = initialState, action) {
    switch (action.type) {
      
      case GETEMPDETAIL: {
        return {
          ...state,
          employeeDetail: action.payload
        };
      }
      default:
        return state;
    }
  }
  