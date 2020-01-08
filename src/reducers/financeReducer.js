import {
  GET_FINANCECLASSDATA,
  CREATEFINANCECLASSTEMPLATE,
  GET_FINANCEINSTITUTEDETAIL,
  ADD_FINANCEINSTITUTEDETAIL,
  GET_INSTITUTEBANKDETAIL,
  ADD_INSTITUTEBANKDETAIL,
  ADD_INSTITUTEINCOME,
  ADD_INSTITUTEEXPENCE,
  UPLOAD_INVOICERECEIPTPRINT,
  GET_INCOMEEXPENSEDETAILS,
  GET_FINANCETEMPLATEDATA,
} from "../actions/financeAction";

const initialState = {
  classesData: "",
  createFinanceClassTemplateData: "",
  financeInstituteDetail: null,
  createFinanceInstDetail: null,
  getBankDetailOfInstitute: null,
  createInstituteBankDetail: null,
  instituteIncome: null,
  invoiceReceiptPrint: null,
  incomeExpenseDetailsData: null,
  instituteExpence: null,
  financeTemplateData: null,
};

export default function finance(state = initialState, action) {
  switch (action.type) {
    case GET_FINANCEINSTITUTEDETAIL: {
      return {
        ...state,
        financeInstituteDetail: action.payload
      };
    }
    case GET_FINANCECLASSDATA: {
      return {
        ...state,
        classesData: action.payload
      };
    }
    case CREATEFINANCECLASSTEMPLATE: {
      return {
        ...state,
        createFinanceClassTemplateData: action.payload
      };
    }

    case ADD_FINANCEINSTITUTEDETAIL:
      return {
        ...state,
        createFinanceInstDetail: action.payload
      };
    case GET_INSTITUTEBANKDETAIL:
      return {
        ...state,
        getBankDetailOfInstitute: action.payload
      };
    case ADD_INSTITUTEBANKDETAIL:
      return {
        ...state,
        createInstituteBankDetail: action.payload
      };
    case GET_INCOMEEXPENSEDETAILS:
      return {
        ...state,
        incomeExpenseDetailsData: action.payload
      };
    case ADD_INSTITUTEINCOME:
      return {
        ...state,
        instituteIncome: action.payload
      };
    case ADD_INSTITUTEEXPENCE:
      return {
        ...state,
        instituteExpence: action.payload
      };
    case UPLOAD_INVOICERECEIPTPRINT:
      return {
        ...state,
        invoiceReceiptPrint: action.payload
      };

    case GET_FINANCETEMPLATEDATA:
      return {
        ...state,
        financeTemplateData: action.payload
      };
    default:
      return state;
  }
}
