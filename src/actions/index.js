import axios from 'axios';
import {
  BASE_URL
} from '../components/common/config';
import {
  BASE_URL3
} from '../components/common/config';
import {
  BASE_URL2
} from '../components/common/config';

export const GET_CLASSES = 'GET_CLASSES';
export const ADD_CLASS = 'ADD_CLASS';
export const UPDATE_CLASSLIST = 'UPDATE_CLASSLIST';
export const UPDATE_CLASS = 'UPDATE_CLASS';
export const GET_SUBJECTS = 'GET_SUBJECTS';
export const ADD_SUBJECT = 'ADD_SUBJECT';
export const UPDATE_SUBJECTLIST = 'UPDATE_SUBJECTLIST';
export const UPDATE_SUBJECT = 'UPDATE_SUBJECT';
export const GET_BATCHES = 'GET_BATCHES';
export const ADD_BATCHES = 'ADD_BATCHES';
export const UPDATE_BATCH = 'UPDATE_BATCH';
export const UPDATE_BATCHLIST = ' UPDATE_BATCHLIST';
export const DELETE_CLASS = 'DELETE_CLASS';
export const DELETE_SUBJECT = 'DELETE_SUBJECT';
export const DELETE_BATCH = 'DELETE_BATCH';
export const GET_BATCHDETAIL = 'GET_BATCHDETAIL';
export const GET_SEARCHSTUDENTDETAIL = 'GET_SEARCHSTUDENTDETAIL';
export const UPDATE_BATCHDETAIL = 'UPDATE_BATCHDETAIL';
export const ADD_STUDENTBATCHES = 'ADD_STUDENTBATCHES';
export const UPDATE_STUDENTDETAIL = 'UPDATE_STUDENTDETAIL'
export const GET_STUDENTDETAIL = 'GET_STUDENTDETAIL';
export const GET_PROFESSORSDETAIL = 'GET_PROFESSORSDETAIL';
export const GET_SEARCHPROFESSDETAIL = 'GET_SEARCHPROFESSDETAIL';
export const GET_PROFESSORSDETAILS = 'GET_PROFESSORSDETAILS';
// export const UPDATE_PROFESSOR_DETAILS = 'UPDATE_PROFESSOR_DETAILS';
export const DELETE_STUDENTBATCH = 'DELETE_STUDENTBATCH';
export const UPDATE_PROFESSOR_DETAILS = 'UPDATE_PROFESSOR_DETAILS'
export const UPDATE_PROFESSORDETAIL = 'UPDATE_PROFESSORDETAIL'
export const ADD_PROFESSORBATCHES = 'ADD_PROFESSORBATCHES'
export const DELETE_PROFESSOR_BATCH = 'DELETE_PROFESSOR_BATCH'
export const DELETE_ENQUIRY = 'DELETE_ENQUIRY';
export const ADD_ENQUIRY = 'ADD_ENQUIRY';
export const UPDATE_ENQUIRYSTATUS = 'UPDATE_ENQUIRYSTATUS';
export const UPDATE_ENQUIRY = 'UPDATE_ENQUIRY';
export const ADD_PROFESSOR = 'ADD_PROFESSOR'
export const ADD_STUDENT = 'ADD_STUDENT';
export const ADD_STUDENTCOPY = 'ADD_STUDENTCOPY';
export const GET_CLASSESONYEAR = 'GET_CLASSESONYEAR';
export const UPLOAD_CSVFILE = 'UPLOAD_CSVFILE';
export const ALL_STUDENTLIST = 'ALL_STUDENTLIST';
export const ALL_PROFESSORLIST = 'ALL_PROFESSORLIST';
export const UPDATE_USERROLE = 'UPDATE_USERROLE';
export const GET_INSTITUDES = 'GET_INSTITUDES';
export const ADD_FINANCE = 'ADD_FINANCE';
export const GET_FINANCELIST = 'GET_FINANCELIST';
export const UPDATE_FINANCE = 'UPDATE_FINANCE';
export const GET_FINANCEEDITDATA = 'GET_FINANCEEDITDATA';
export const DELETE_FINANCE = 'DELETE_FINANCE';
export const ADD_STUDENTPAYMENTSCHEDULE = 'ADD_STUDENTPAYMENTSCHEDULE';
export const ADD_STUDENTPAYMENTDETAIL = 'ADD_STUDENTPAYMENTDETAIL';
export const UPDATE_STUDENTPAYMENTDETAIL = 'UPDATE_STUDENTPAYMENTDETAIL';
export const ADD_STUDENTPAYMENT = 'ADD_STUDENTPAYMENT';
export const ADD_STUDENTPAYMENTLIST = 'ADD_STUDENTPAYMENTLIST';
export const DELETE_STUDENTPAYMENTDETAIL = 'DELETE_STUDENTPAYMENTDETAIL';
export const GET_YEARFORSTUDENTCOPY = 'GET_YEARFORSTUDENTCOPY';
export const ADD_STUDENTPROFESSOREGISTRATION = 'ADD_STUDENTPROFESSOREGISTRATION';
export const GET_ADMINPROFILE = 'GET_ADMINPROFILE';
export const UPDATE_ADMINPROFILE = 'UPDATE_ADMINPROFILE';
export const INVITATION_SEND = 'INVITATION_SEND';
export const PASSWORD_CHECK = 'PASSWORD_CHECK';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const DELETE_STUDENTPROFESSOR = 'DELETE_STUDENTPROFESSOR';
export const AUTO_ASSIGNHWQUIZNOTES = 'AUTO_ASSIGNHWQUIZNOTES';
export const GET_RESTOREID = 'GET_RESTOREID';
export const STORE_RESTOREID = 'STORE_RESTOREID';
export const GET_REPORTDATA = 'GET_REPORTDATA';
export const GETPROFILEPIC = 'GETPROFILEPIC';
export const CHECKPROFILESELECTEDORNOT = 'CHECKPROFILESELECTEDORNOT';
export const PROFILEPICUPLOAD = 'PROFILEPICUPLOAD';
export const GETSUBJECTBATCHLIST = 'GETSUBJECTBATCHLIST';
export const BATCHAUTOCREATION = 'BATCHAUTOCREATION';
export const GETSTUDENTSTATUS = 'GETSTUDENTSTATUS';
export const SAVEASSISTANTPROFESSOR = "SAVEASSISTANTPROFESSOR";
export const GETATEENDANCEDETAILS = 'GETATEENDANCEDETAILS';
export const GETATEENDANCELISTMODEL = 'GETATEENDANCELISTMODEL';
export const MARK_ATTENDANCE = 'MARK_ATTENDANCE';
export const GET_PROFATTENDANCEBATCHESDATA = 'GET_PROFATTENDANCEBATCHESDATA';
export const GET_PROFATTENDANCEBATCHES = 'GET_PROFATTENDANCEBATCHES';
export const GET_ATTENDANCELISTONDATE = 'GET_ATTENDANCELISTONDATE';
export const UPDATE_ATTENDANCELIST = 'UPDATE_ATTENDANCELIST';
export const GETSTUDENTATTENDANCEREPORT = 'GETSTUDENTATTENDANCEREPORT'
export const DOWNLOADSTUDENTATTENDANCEREPORT = 'DOWNLOADSTUDENTATTENDANCEREPORT';
export const SEARCHTATTENDANCESTUDENT = 'SEARCHTATTENDANCESTUDENT';
export const GETATTENDANCEDASHBOARDSTUDENTLIST = 'GETATTENDANCEDASHBOARDSTUDENTLIST';
export const GET_ADMINATTENDANCEBATCHES = 'GET_ADMINATTENDANCEBATCHES';
export const GET_ADMINATTENDANCEPROFESSORLIST = 'GET_ADMINATTENDANCEPROFESSORLIST';
export const GET_ADMINATTENDANCEGRAPHDATA = 'GET_ADMINATTENDANCEGRAPHDATA';
export const ISPROFESSORADMIN = "ISPROFESSORADMIN";
export const GET_STUDENTDETAILS = "GET_STUDENTDETAILS";
export const GET_STUDENTBATCHWISEATTENDANCEREPORT = "GET_STUDENTBATCHWISEATTENDANCEREPORT"
export const GET_PROFESSOREMAILCHECK = "GET_PROFESSOREMAILCHECK";
export const GET_STUDENTEMAILCHECK = "GET_STUDENTEMAILCHECK";
export const CLASSMANAGERFLOW = 'CLASSMANAGERFLOW'
let token = `JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJiaHVzaGFuM0BnbWFpbC5jb20iLCJleHAiOjQ1Njg4MDQ1NDYsImVtYWlsIjoiYmh1c2hhbjNAZ21haWwuY29tIn0.5nD6ysJLChbte4EM1OL0rwU9hM3ZZtT2KtUcAa23KXQ`
export function getClasses(branch) {

  let URL = `${BASE_URL}institude/${branch.institude_id}/branch/${branch.branch_id}/classes`;
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' +token,
    }
  };
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_CLASSES,
          payload: response.data.response,
          branchId: branch.branch_id,
          institudeId: branch.institude_id
        })
      })
      .catch(function (error) {

      });
  }
}

export function addClass(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/class/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_CLASS,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}


export function updateClassList(classList) {
  return dispatch => {
    dispatch({
      type: UPDATE_CLASSLIST,
      payload: classList,
    })
  }
}

export function updateClass(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/class/${data.payload.class_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_CLASS,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteClass(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.payload.branch_id}/class/${data.payload.class_id}/`;

  return dispatch => {
    return axios.delete(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_CLASS,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteSubject(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/class/${data.class_id}/subject/${data.payload.subject_id}/`;
  //let payload = data.payload
  return dispatch => {
    return axios.delete(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_SUBJECT,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteBatch(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/batch/${data.batch_id}/batchDelete/`;

  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_BATCH,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getSubjects(cls) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${cls.institude_id}/branch/${cls.branch_id}/class/${cls.class_id}/subjects`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_SUBJECTS,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function addSubject(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/1/class/1/batch/subjects/
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/class/${data.class_id}/subject/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_SUBJECT,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateSubject(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/class/${data.class_id}/subject/${data.subject_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: UPDATE_SUBJECT,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateSubjectList(subjectList) {
  return dispatch => {
    dispatch({
      type: UPDATE_SUBJECTLIST,
      payload: subjectList
    })
  }
}

export function getBatches(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/subject/${data.subject_id}/batchDetail/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_BATCHES,
          payload: response.data.response
        })

      })
      .catch(function (error) {

      });
  }
}

export function addBatches(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://35.154.43.111:7000/institude/2/branch/2/class/6/batch/subjects/
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/class/${data.class_id}/batch/subjects/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_BATCHES,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateBatch(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/batch/${data.payload.batch_id}/subjects/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_BATCH,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getBatchDetail(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/class/${data.class_id}/batch/${data.batch_id}/subject/${data.subject_id}/batchDetails/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_BATCHDETAIL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateBatchDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/class/1/batchIdDetails/1/
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/class/${data.class_id}/batchIdDetails/${data.batch_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: UPDATE_BATCHDETAIL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function saveAssistantProfessor(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/assistantProfessor/`;
  let payload = data.assistantPayload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SAVEASSISTANTPROFESSOR,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateBatchList(batchList) {
  return dispatch => {
    dispatch({
      type: UPDATE_BATCHLIST,
      payload: batchList,
    })
  }
}


export function getStudentList(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };
  let URL = `${BASE_URL}institude/${data.instituteId}/branch/${data.branchId}/studentPagination/`;
  let payload = data.payload

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {

    });
}

export function serachStudentsDetails(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/studentSearchList/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_SEARCHSTUDENTDETAIL,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentDetail(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/${data.student_id}/studentDetail/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_STUDENTDETAIL,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/${data.professor_id}/professorDetail/`;
  // let payload=data.payload;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_PROFESSORSDETAILS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorsList(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.instituteId}/branch/${data.branchId}/professorPagination/`;
  let payload = data.payload

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {

    });
}

export function searchProfessorsDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorSearchList/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_SEARCHPROFESSDETAIL,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function addStudentBatches(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/students/${data.student_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_STUDENTBATCHES,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function addProfessorBatches(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professors/${data.professor_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_PROFESSORBATCHES,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateStudentDetails(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/${data.student_id}/studentDetail/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_STUDENTDETAIL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function UpdateProfessorDetails(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  // let URL=`${BASE_URL}institude/2/branch/2/professorId/4/professorDetail/`;
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/${data.professor_id}/professorDetail/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_SEARCHPROFESSDETAIL,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function AddProfessor(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professor/`
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_PROFESSOR,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function AddStudent(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/addStudent/`

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_STUDENT,
          payload: response
        })
        // return response
      })
      .catch(function (error) {

        return error
      });
  }
}

export function deleteStudentBatch(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/students/${data.student_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_STUDENTBATCH,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateProfessorDetails(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/${data.professor_id}/professorDetail/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_PROFESSORDETAIL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteProfessorBatch(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // DELETE_PROFESSOR_BATCH
  let payload = {
    "batch_id": data.batch_id,
  }
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professors/${data.professor_id}/`;
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_PROFESSOR_BATCH,
          payload: response.data
        })
      })
      .catch(function (error) {

      });

  }
}

export function getEnquiryList(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  // ${BASE_URL}institude/${this.props.instituteId}/branch/${this.props.branchId}/enquirySort/
  let URL = `${BASE_URL}institude/${data.instituteId}/branch/${data.branchId}/enquirySort/`;
  let payload = data.payload

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {

    });
}

export function addEnquiry(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/addEnquiry/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_ENQUIRY,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteEnquiry(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/enquiry/${data.enquiry_id}/`;
  //let payload = data.payload
  return dispatch => {
    return axios.delete(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_ENQUIRY,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateEnquiryStatus(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/enquiryId/${data.enquiry_id}/status/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_ENQUIRYSTATUS,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateEnquiry(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/enquiry/${data.enquiry_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_ENQUIRY,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function addStudentCopy(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/classId/${data.class_id}/subjectId/${data.subject_id}/batchId/${data.batch_id}/studentCopy/`;
  let payload = {};
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_STUDENTCOPY,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getClassesOnSelectedYear(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/selectedYear/${data.selectedYear}/classList/`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_CLASSESONYEAR,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getYearListForStudentCopy(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/yearList/  `;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_YEARFORSTUDENTCOPY,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function uploadCsvFile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/csvUpload/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPLOAD_CSVFILE,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getAllStudent(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://35.154.43.111:7000/institude/2/branch/2/studentsList/ === GET
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/studentsList/`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ALL_STUDENTLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getAllProfessor(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://35.154.43.111:7000/institude/2/branch/2/studentsList/ === GET
  // http://35.154.43.111:7000/institude/2/branch/2/professorList/ === GET
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorList/`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ALL_PROFESSORLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateUserRole(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  // http://127.0.0.1:7000/institudes/2/branch/2/adminAccessDetails/ 
  let URL = `${BASE_URL}institudes/${data.institude_id}/branch/${data.branch_id}/adminAccessDetails/`;
  let payload = data.payload;
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: UPDATE_USERROLE,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getInstitudes(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/getInstitude/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_INSTITUDES,
          payload: response.data,

        })
      })
      .catch(function (error) {

      });
  }
}

export function addFinance(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/createFinanceTemplate/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_FINANCE,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getFinancelist(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/listFinanceTemplate/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_FINANCELIST,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getEditFinanceData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/financeTemplate/${data.finance_template_id}/ `;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_FINANCEEDITDATA,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateFinance(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/financeTemplate/${data.finance_template_id}/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_FINANCE,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteFinance(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/financeTemplate/${data.finance_template_id}/ `;
  return dispatch => {
    return axios.delete(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: DELETE_FINANCE,
          payload: response.data
        })
      })
      .catch(function (error) {

      });

  }
}

export function createStudentPaymentSchedule(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/createStudentPaymentSchedule/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_STUDENTPAYMENTSCHEDULE,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function createStudentPaymentDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/studentPaymentScheduleDetail/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_STUDENTPAYMENTDETAIL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateStudentPaymentDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/studentPaymentScheduleDetail/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_STUDENTPAYMENTDETAIL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteStudentPaymentDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let payload = {
    student_finance_schedule_id: data.student_finance_schedule_id,
  }
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/studentPaymentScheduleDelete/`;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_STUDENTPAYMENTDETAIL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function createStudentPayment(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/addPayment/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_STUDENTPAYMENT,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function createStudentPaymentList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/studentPaymentList/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: ADD_STUDENTPAYMENTLIST,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function FinanceListPagination(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };


  let URL = `${BASE_URL}institude/${data.instituteId}/branch/${data.branchId}/studentFinance/`;
  let payload = data.payload

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {

    });
}


export function addStudentProfessorRegistration(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/addstudentProfessor/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_STUDENTPROFESSOREGISTRATION,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getAdminProfileData(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/adminDetail/ `;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_ADMINPROFILE,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateAdminProfileData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/adminDetail/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_ADMINPROFILE,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function invitationSend(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/sendInvitation/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: INVITATION_SEND,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function checkingPassword(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL2}institude/user/checkingPassword/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PASSWORD_CHECK,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function updatePassword(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL3}master/user/${data.user_id}/changePassword `;

  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_PASSWORD,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteStudentProfessor(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/deleteStudentProfessor/  `;

  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_STUDENTPROFESSOR,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function autoAssignHomeworkQuizNotes(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/autoAssign/`;

  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: AUTO_ASSIGNHWQUIZNOTES,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getReportData(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/report/ `;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_REPORTDATA,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getRestoreId(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/freshChat/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_RESTOREID,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function storeRestoreId(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/freshChat/ `;

  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: STORE_RESTOREID,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfilePic(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/profileDownload/ `;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GETPROFILEPIC,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}

export function checkProfileSelectedOrNot(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/profileComplete/`;
  var payload = {}

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CHECKPROFILESELECTEDORNOT,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function profilePicUpload(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/profileUpload/`;
  var payload = data.payload

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFILEPICUPLOAD,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getSubjectBatchList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/batchSubjectList/`;
  var payload = data.payload

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GETSUBJECTBATCHLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function batchAutoCreation(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/batchAutoCreation/ `;
  var payload = data.payload

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: BATCHAUTOCREATION,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getStudentStatus(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/studentStatus/ `;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GETSTUDENTSTATUS,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}


export function getAdminAttendanceDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/attendanceAdminDashboard/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GETATEENDANCEDETAILS,
          payload: response.data
        })
      }).catch(function (error) {

      });
  }
}

export function getAttendanceListModel(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/attendanceMark/ `;
  var payload = data.payload

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GETATEENDANCELISTMODEL,
          payload: response.data
        })
      })
      .catch(function (error) {

      });
  }
}
export function getIsProfessorAdmin(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/getRole/ `;
  var payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ISPROFESSORADMIN,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function submitAttendance(data) {


  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/attendanceMark/   `;
  var payload = data.payload

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: MARK_ATTENDANCE,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getProfessorAttendanceBatchesData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };


  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorAttendanceDetails/`;

  var payload = data.payload

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFATTENDANCEBATCHESDATA,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getProfessorAttendanceBatches(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorAttendanceDetails/`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFATTENDANCEBATCHES,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getAttendanceListOnDate(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorAttendanceDetails/`;
  var payload = data.payload

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_ATTENDANCELISTONDATE,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function updateAttendanceList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/updateStudentAttendance/`;
  var payload = data.payload

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_ATTENDANCELIST,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getAttendanceStudentReport(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/attendanceStudentReport/`;
  var payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GETSTUDENTATTENDANCEREPORT,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function searchForAttendanceStudent(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentBatchSearch/`;
  var payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SEARCHTATTENDANCESTUDENT,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}



export function downloadStudentReport(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/attendanceStudentReport/`;
  var payload = data.payload

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOADSTUDENTATTENDANCEREPORT,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getAttendanceAdminDashboardStudentList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/attendanceAdminDashboardStudentList/ `;
  var payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GETATTENDANCEDASHBOARDSTUDENTLIST,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getAdminAttendanceBatches(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/attendanceAdminDashboardBatchList/`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_ADMINATTENDANCEBATCHES,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getAdminAttendanceProfessorList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/attendanceAdminDashboardProfessorList/ `;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_ADMINATTENDANCEPROFESSORLIST,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getAdminAttendanceGraphdata(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/adminAttendanceDashboardInstituteAnalytics/`;
  var payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_ADMINATTENDANCEGRAPHDATA,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getStudentDetails(branch) {

  let URL = `${BASE_URL}institude/${branch.institude_id}/branch/${branch.branch_id}/studentDetails/ `;
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token,
    }
  };
  let payload = branch.payload;
  return dispatch => {
    return axios.post(URL,payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: GET_STUDENTDETAILS,
          payload: response,
        })
      })
      .catch(function (error) {

      });
  }
}



export function getEmailOfFacultyDirectory(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorEmailCheck/ `;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSOREMAILCHECK,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getStudentBatchWiseAttendanceReport(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/studentBatchWiseAttendanceReport/ `;
  var payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTBATCHWISEATTENDANCEREPORT,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getEmailOfStudentDirectory(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/studentEmailCheck/ `;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTEMAILCHECK,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}

export function getClassManagerFlow(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/classManagerFlow/`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CLASSMANAGERFLOW,
          payload: response
        })
      })
      .catch(function (error) { });
  }
}