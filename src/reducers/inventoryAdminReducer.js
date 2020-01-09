import {
    GET_FINANCEINSTITUTEDETAIL,
    
  } from "../actions/inventoryAdminAction";
  
  const initialState = {
    financeInstituteDetail: null,
    
  };
  
  export default function finance(state = initialState, action) {
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
  