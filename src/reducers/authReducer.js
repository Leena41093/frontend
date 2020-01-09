import {
    LOGIN_STUDENT, STORE_STUDENTTOKEN, LOGOUT,FORGOT_PASSWORD,VERIFY_PASSWORDOTP,CHANGE_PASSWORDFORGOTPAGE,AUTH_CHECK,UPDATE_FORGOTPASSWORD
} from '../actions/authAction';

const initialState = {
    login: null,
    storeToken: null,
    userType: null,
    token: null,
    isProfessorAdmin: null,
    userName: null,
    passwordForgot:null,
    passwordVerify:null,
    forgotPasswordUpdate:null,
    authCheck:null,
    changePassword:null,    
}


export default function auth(state = initialState, action) {
    

    switch (action.type) {
        case LOGIN_STUDENT:
            
            return {
                ...state,
                login: action.payload,
                userType: action.usertype,
                token: action.token,
                userName: action.payload.data.username,

            }
        case LOGOUT:
            return {
                ...initialState
            }
            
        case STORE_STUDENTTOKEN:
            return {
                ...state,
                storeToken: action.payload,
                isProfessorAdmin: action.payload.data.response.isProfessorAdmin,
            }
        case AUTH_CHECK:
        
        return{
            ...state,
            authCheck:action.payload,
            token:action.token,
            userType:action.usertype,
            userName:action.payload.data.response.user_name
        }
        case FORGOT_PASSWORD:
            return{
                ...state,
                passwordForgot:action.payload
            }
        case VERIFY_PASSWORDOTP:
        return{
            ...state,
            passwordVerify:action.payload
        }
        case UPDATE_FORGOTPASSWORD:
        return{
            ...state,
            forgotPasswordUpdate:action.payload
        }
        case CHANGE_PASSWORDFORGOTPAGE:
        return{
            ...state,
            changePassword:action.payload
        }
        default:
            return state
    }
}