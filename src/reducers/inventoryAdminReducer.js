import {
  GETEMPDETAIL,
  GET_ADMINDASHBOARDDETAILS,
  GET_COMPLAINTS,
  GET_PROJECTEMPLOYEEDATA,
  ADD_PROJECTDETAILS,
  GET_FINANCELIST,
  GET_ALLEMPLOYEES,
  CREATEEMPLOYEEDETAIL,
  GETACCESSORIES,
  GETPROJECTES,
  ASSIGN_PROJECT_ACCESSORIES,
  DELETE_PROJECT,
  DELETE_ACCESSORIES,
  DELETE_EMP,
  ADD_ACCESSORIE
} from "../actions/inventoryAdminAction";

const initialState = {
  adminDashboardDetail: null,
  companyId: 1,
  adminbranchId: 1,
  employeeDetail: null,
  complaintsList: null,
  projectEmployeeDetail: null,
  addprojectdata: null,
  assignProjectAccessories:null,
  deleteProject:null,
  deleteAccessories:null,
  deleteEmp:null,
  financeList: null,
  getAllEmployees: null,
  createEmp: null,
  accessories: null,
  projectes: null,
  complaintsList: null,
  addAccessorie:null,
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
      };
    }
    case GETPROJECTES: {
      return {
        ...state,
        projectes: action.payload
      };
    }
    case GET_ALLEMPLOYEES: {
      return {
        ...state,
        getAllEmployees: action.payload
      };
    }

    case ADD_PROJECTDETAILS: {
      return {
        ...state,
        addprojectdata: action.payload
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
    case ASSIGN_PROJECT_ACCESSORIES:{
      return {
        ...state,
        assignProjectAccessories: action.payload
      };
    }
    case DELETE_PROJECT:{
      return {
        ...state,
        deleteProject: action.payload
      };
    }
    case DELETE_ACCESSORIES:{
      return {
        ...state,
        deleteAccessories: action.payload
      };
    }
    case DELETE_EMP :{
      return {
        ...state,
        deleteEmp: action.payload
      };
    }

    case GET_FINANCELIST: {
      return {
        ...state,
        financeList: action.payload
      };
    }

    case ADD_ACCESSORIE:{
      return {
        ...state,
        addAccessorie: action.payload
      };
    }

    default:
      return state;
  }
}
