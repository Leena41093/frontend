import axios from 'axios';
import { BASE_URL } from '../components/common/config';
export const GET_PROFESSORDRIVECLASS = 'GET_PROFESSORDRIVECLASS';
export const GET_PROFESSORDRIVESUBJECT = 'GET_PROFESSORDRIVESUBJECT';
export const GET_PROFESSORDRIVEFOLDER = 'GET_PROFESSORDRIVEFOLDER';
export const GET_PROFESSORDRIVEFILES = 'GET_PROFESSORDRIVEFILES';
export const RENAME_PROFESSORDRIVEFILES = 'RENAME_PROFESSORDRIVEFILES';
export const DELETE_PROFESSORFILE = 'DELETE_PROFESSORFILE';
export const PROFESSOR_FOLDERQUIZLIST = 'PROFESSOR_FOLDERQUIZLIST';
export const PROFESSOR_DRIVENEWFOLDER = 'PROFESSOR_DRIVENEWFOLDER';
export const GET_PROFESSORDRIVEFILESOFFOLDERS = 'GET_PROFESSORDRIVEFILESOFFOLDERS';
export const CREATE_PROFESSORDRIVENEWFOLDER = 'CREATE_PROFESSORDRIVENEWFOLDER';
export const CREATE_PERSONALDRIVEFILE = 'CREATE_PERSONALDRIVEFILE';
export const GET_PROFESSORDRIVEFOLDERANDFILES = 'GET_PROFESSORDRIVEFOLDERANDFILES';
export const DOWNLOAD_PERSONALDRIVEFILE = 'DOWNLOAD_PERSONALDRIVEFILE';
let token = `JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJiaHVzaGFuM0BnbWFpbC5jb20iLCJleHAiOjQ1Njg4MDQ1NDYsImVtYWlsIjoiYmh1c2hhbjNAZ21haWwuY29tIn0.5nD6ysJLChbte4EM1OL0rwU9hM3ZZtT2KtUcAa23KXQ`
export const QUIZLISTFORDRIVE = 'QUIZLISTFORDRIVE'
export function getProfessorDriveClassList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/classes/`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORDRIVECLASS,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getProfessorDriveSubjectList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/subject/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORDRIVESUBJECT,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getProfessorDriveSubjectFolderList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/professorDrive/subejctFolder/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/subejctFolder/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORDRIVEFOLDER,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorFolderFileList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/professorDrive/files/
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/files/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORDRIVEFILES,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function renameProfessorFileName(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/renameFile/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: RENAME_PROFESSORDRIVEFILES,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteProfessorDriveFile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/deleteFile/`;

  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_PROFESSORFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getFolderQuizList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/quizList/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFESSOR_FOLDERQUIZLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function createDriveFolder(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/myDriveFolder/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CREATE_PROFESSORDRIVENEWFOLDER,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getFilesOfDriveFolder(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/myDriveFolder/ `;

  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORDRIVEFILESOFFOLDERS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function addPersonalDriveFiles(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/personalFileUpload/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CREATE_PERSONALDRIVEFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getDriveFolderAndFiles(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/personalFiles/  `;



  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORDRIVEFOLDERANDFILES,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function downloadPersonalDriveFiles(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/personalFiles/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOAD_PERSONALDRIVEFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function quizListDrive(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/quizList/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: QUIZLISTFORDRIVE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}



