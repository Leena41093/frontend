import axios from 'axios';
import {BASE_URL} from '../components/common/config';
export const GET_STUDENTDRIVECLASS = "GET_STUDENTDRIVECLASS";
export const GET_STUDENTDRIVESUBJECT = 'GET_STUDENTDRIVESUBJECT';
export const GET_STUDENTDRIVEFOLDER = 'GET_STUDENTDRIVEFOLDER';
export const GET_STUDENTDRIVEFILE = 'GET_STUDENTDRIVEFILE';
export const RENAME_DRIVEFILENAME = 'RENAME_DRIVEFILENAME';
export const DELETE_DRIVEFILE = 'DELETE_DRIVEFILE';
let token = `JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJiaHVzaGFuM0BnbWFpbC5jb20iLCJleHAiOjQ1Njg4MDQ1NDYsImVtYWlsIjoiYmh1c2hhbjNAZ21haWwuY29tIn0.5nD6ysJLChbte4EM1OL0rwU9hM3ZZtT2KtUcAa23KXQ`
export function getStudentDriveClassList(data) {
    
    const API_CONFIG = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+ token,
        }
      };
   
    let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/driveclasses/`;
    return dispatch => {
      return axios.get(URL, API_CONFIG)
        .then(function (response) {
          
          dispatch({
            type: GET_STUDENTDRIVECLASS,
            payload: response
          })
        })
        .catch(function (error) {
          
        });
    }
  }

  export function getStudentDriveSubjectList(data) {
    
    const API_CONFIG = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+ token,
        }
      };
      let payload =data.payload;
    
    let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/driveSubjects/`;
    return dispatch => {
      return axios.post(URL,payload, API_CONFIG)
        .then(function (response) {
          
          dispatch({
            type: GET_STUDENTDRIVESUBJECT,
            payload: response
          })
        })
        .catch(function (error) {
          
        });
    }
  }

  export function getStudentDriveFolderList(data) {
    
    const API_CONFIG = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+ token,
        }
      };
      let payload =data.payload;
     
    let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/driveFolder/`;
    return dispatch => {
      return axios.post(URL,payload, API_CONFIG)
        .then(function (response) {
          
          dispatch({
            type: GET_STUDENTDRIVEFOLDER,
            payload: response
          })
        })
        .catch(function (error) {
          
        });
    }
  }

  export function getStudentDriveFileList(data) {
   
    const API_CONFIG = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+ token,
        }
      };
      let payload =data.payload;
    
    let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/driveFiles/`;
    return dispatch => {
      return axios.post(URL,payload, API_CONFIG)
        .then(function (response) {
          
          dispatch({
            type: GET_STUDENTDRIVEFILE,
            payload: response
          })
        })
        .catch(function (error) {
          
        });
    }
  }

  export function renameStudentDriveFileName(data) {
    
    const API_CONFIG = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT '+ token,
        }
      };
      let payload = data.payload;
    // http://127.0.0.1:7000/institude/2/branch/2/student/renameFile/ 
    let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/renameFile/`;
    return dispatch => {
      return axios.post(URL,payload, API_CONFIG)
        .then(function (response) {
         
          dispatch({
            type: RENAME_DRIVEFILENAME,
            payload: response
          })
        })
        .catch(function (error) {
          
        });
    }
  }

  export function deleteStudentDriveFile(data) {
    const API_CONFIG = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT '+ token,
      }
    };
    
    let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/deleteFile/`;
   
    let payload = data.payload;
    
    return dispatch =>{
    return axios.put(URL, payload, API_CONFIG)
        .then(function (response) {
          
          dispatch({
            type: DELETE_DRIVEFILE,
            payload: response
          })
        })
        .catch(function (error) {
          
        });
      }
  }
