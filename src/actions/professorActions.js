import axios from 'axios';
import { BASE_URL } from '../components/common/config';
export const ADD_HOMEWORK = 'ADD_HOMEWORK';
export const GET_HOMEWORKLIST = 'GET_HOMEWORKLIST';
export const GET_HOMEWORKDETAILS = 'GET_HOMEWORKDETAILS';
export const GET_CLASSESSUBJECTSBATCHES = 'GET_CLASSESSUBJECTSBATCHES';
export const GET_PROFESSORDASHBOARD = 'GET_PROFESSORDASHBOARD';
export const GET_PROFESSORBATCHDASHBOARD = 'GET_PROFESSORBATCHDASHBOARD';
export const CREATE_NOTICE = 'CREATE_NOTICE';
export const GET_DASHBOARDSTUDENTLIST = 'GET_DASHBOARDSTUDENTLIST';
export const SHOW_ALLNOTICE = 'SHOW_ALLNOTICE';
export const PROFESSOR_TIMETABLEINFO = 'PROFESSOR_TIMETABLEINFO';
export const GET_FOLDERLIST = 'GET_FOLDERLIST';
export const HOMEWORK_FILEUPLOAD = 'HOMEWORK_FILEUPLOAD';
export const CREATE_FOLDERNAME = 'CREATE_FOLDERNAME';
export const DOWNLOAD_FILE = 'DOWNLOAD_FILE';
export const CHANGE_HOMEWORKSTATUS = 'CHANGE_HOMEWORKSTATUS';
export const GET_STUDENTCHECKING = 'GET_STUDENTCHECKING';
export const HOMEWORKSUBMISSION_FINISH = 'HOMEWORKSUBMISSION_FINISH';
export const UPDATE_HOMEWORKCHECKINGSTATUS = 'UPDATE_HOMEWORKCHECKINGSTATUS';
export const ASSIGN_QUIZ = 'ASSIGN_QUIZ';
export const GET_QUIZLIST = 'GET_QUIZLIST';
export const CREATE_QUIZ = 'CREATE_QUIZ';
export const QUIZ_DETAILS = 'QUIZ_DETAILS';
export const GET_PROFESSORSUBJECTS = 'GET_PROFESSORSUBJECTS';
export const GET_PROFESSORBATCHS = 'GET_PROFESSORBATCHS';
export const QUIZ_FILEUPLOAD = 'QUIZ_FILEUPLOAD';
export const QUIZ_PDFANSWER = 'QUIZ_PDFANSWER';
export const QUIZ_QUESTIONANSWER = 'QUIZ_QUESTIONANSWER';
export const CREATE_QUIZQUESTION = 'CREATE_QUIZQUESTION';
export const CREATE_NOTES = 'CREATE_NOTES';
export const NOTEES_FILEUPLOAD = 'NOTEES_FILEUPLOAD';
export const NOTES_DETAILS = 'NOTES_DETAILS';
export const UPDATE_PROFESSORQUIZEDUEDATE = 'UPDATE_PROFESSORQUIZEDUEDATE';
export const UPDATE_QUIZCHECKINGSTATUS = 'UPDATE_QUIZCHECKINGSTATUS';
export const UPDATE_HOMEWORKEDUEDATE = 'UPDATE_HOMEWORKEDUEDATE';
export const GET_HOMEWORKDETAIL = 'GET_HOMEWORKDETAIL';
export const UPDATE_HOMEWORK = 'UPDATE_HOMEWORK';
export const GET_EDITQUIZ = 'GET_EDITQUIZ';
export const UPDATE_QUIZDETAIL = 'UPDATE_QUIZDETAIL';
export const GET_EDITQUIZUPLOADTYPE = 'GET_EDITQUIZUPLOADTYPE';
export const UPDATE_UPLOADTYPEQUIZ = 'UPDATE_UPLOADTYPEQUIZ';
export const QUIZ_QUESTIONANSWERLIST = 'QUIZ_QUESTIONANSWERLIST';
export const UPDATE_QUIZQUESTIONANSWER = 'UPDATE_QUIZQUESTIONANSWER';
export const DOWNLOADSTUDENTSUBMISSION_FILE = 'DOWNLOADSTUDENTSUBMISSION_FILE';
export const DOWNLOAD_QUIZFILE = 'DOWNLOAD_QUIZFILE';
export const DOWNLOAD_NOTESFILE = 'DOWNLOAD_NOTESFILE';
export const UPDATE_PROFESSORLASTSEEN = 'UPDATE_PROFESSORLASTSEEN';
export const PROFESSOR_TIMETABLE = 'PROFESSOR_TIMETABLE';
export const PROFESSOR_BATCHLIST = 'PROFESSOR_BATCHLIST';
export const HOMEWORK_DRIVEFILE = 'HOMEWORK_DRIVEFILE';
export const NOTES_DRIVEFILE = 'NOTES_DRIVEFILE';
export const GET_PROFESSORPROFILE = 'GET_PROFESSORPROFILE';
export const UPDATE_PROFESSORPROFILE = 'UPDATE_PROFESSORPROFILE';

export const HOMEWORK_ANNOTATION = 'HOMEWORK_ANNOTATION';
export const ANNOTATION_FILE = 'ANNOTATION_FILE';
export const PROFESSOR_QUIZPREVIEW = 'PROFESSOR_QUIZPREVIEW';
export const GET_DEADLINENOTIFICATIONS = 'GET_DEADLINENOTIFICATIONS';
export const UPDATE_PROFESSORNOTICELASTSEEN = 'UPDATE_PROFESSORNOTICELASTSEEN,';
export const PROFESSOR_NOTIFICATIONSUBLIST = 'PROFESSOR_NOTIFICATIONSUBLIST';
export const PROFESSOR_QUIZSTATUSCHECKING = 'PROFESSOR_QUIZSTATUSCHECKING';
export const UPDATE_PROFESSORCOMMENTLASTSEEN = 'UPDATE_PROFESSORCOMMENTLASTSEEN';
export const DELETE_NOTICE = 'DELETE_NOTICE';
export const DELETE_BATCHHOMEWORK = 'DELETE_BATCHHOMEWORK';
export const DELETE_BATCHQUIZ = 'DELETE_BATCHQUIZ';
export const DELETE_BATCHNOTES = 'DELETE_BATCHNOTES';
export const CREATE_BATCHHOMEWORKFROMDRIVE = 'CREATE_BATCHHOMEWORKFROMDRIVE';
export const CREATE_BATCHNOTESFROMDRIVE = 'CREATE_BATCHNOTESFROMDRIVE';
export const GET_PROFESSORTIMETABLEHOMEWORKDUEINFO = 'GET_PROFESSORTIMETABLEHOMEWORKDUEINFO';
export const GET_PROFESSORTIMETABLENOTICEINFO = 'GET_PROFESSORTIMETABLENOTICEINFO';
export const GET_PROFESSORBATCHDETAILNOTICES = 'GET_PROFESSORBATCHDETAILNOTICES';
export const GET_PROFESSORBATCHDETAILRECENTSUBMISSION = 'GET_PROFESSORBATCHDETAILRECENTSUBMISSION'
export const GET_PROFESSOREXPIREDBATCHDATA = 'GET_PROFESSOREXPIREDBATCHDATA';
export const ADD_PROFQUETYPEQUIZIMAGE = 'ADD_PROFQUETYPEQUIZIMAGE';
export const REMOVE_PROFQUETYPEQUIZIMAGE = 'REMOVE_PROFQUETYPEQUIZIMAGE';
export const UPLOADFILETOHOMEDRIVE = 'UPLOADFILETOHOMEDRIVE';
export const UPLOADNOTEFILETODRIVE = 'UPLOADNOTEFILETODRIVE';
export const GET_ALLBATCHATTENDANCEDATAOFSTUDENT = 'GET_ALLBATCHATTENDANCEDATAOFSTUDENT';
export const GET_PROFBATCHATTENDANCEDEFAULTERSTUDENT = 'GET_PROFBATCHATTENDANCEDEFAULTERSTUDENT'
export const SUBMITMARKSOFSTUDENTS = 'SUBMITMARKSOFSTUDENTS'
export function addHomework(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professor/homeWork/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_HOMEWORK,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getHomeworkDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let payload = data.payload;
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professor/batchHomeworkDetail/`;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_HOMEWORKDETAILS,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getClassesSubjectBatches(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/classesSubject/`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_CLASSESSUBJECTSBATCHES,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getProfessorDashboard(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorDashboardDetails/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORDASHBOARD,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getProfessorBatchDashboard(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorDashboardBatch/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORBATCHDASHBOARD,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function createNewNoticeBatchDetailDahboard(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorBatchNotice/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CREATE_NOTICE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentListBatchDashboard(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/batchStudentList/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_DASHBOARDSTUDENTLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getSubmissionList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://192.168.2.23:9000/institude/2/branch/2/batchHomework/studentSubmissionList/
  let URL = `${BASE_URL}institude/${data.instituteId}/branch/${data.branchId}/batchHomework/studentSubmissionList/`;
  let payload = data.payload

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {

    });
}

export function showAllNotice(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorBatchNotice/`;
  let payload = data.payload;
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SHOW_ALLNOTICE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function professorTimeTableInfo(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://192.168.2.23:9000/institude/2/branch/2/professor/timeTableInfo/
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professor/timeTableInfo/`;
  let payload = data.payload;

  return dispatch => {

    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFESSOR_TIMETABLEINFO,
          payload: response
        })

      })
      .catch(function (error) {

      });
  }
}

export function getFolderNameList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/subjectFolder/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_FOLDERLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }

}

export function homeWorkFileUpload(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professor/uploadHomework/`

  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: HOMEWORK_FILEUPLOAD,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function createFolderName(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/subjectFolder/`;
  let payload = data.payload;
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: CREATE_FOLDERNAME,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function downLoadHomeWorkFile(data, token) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + (token ? token : data.token),

    }

  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/downloadFile/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOAD_FILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function changeHomeworkStatus(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/homeWorkbatchStatus/`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CHANGE_HOMEWORKSTATUS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentHomeWorkChecking(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/studentCheckingHomework/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTCHECKING,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function homeWorkSubmission(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/studentHomeworkSubmition/homeworkSubmissionInfo/ `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: HOMEWORKSUBMISSION_FINISH,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function updateHomeWorkCheckingStatus(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/updateStatus/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: UPDATE_HOMEWORKCHECKINGSTATUS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getQuizList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professores/quizList/ `;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_QUIZLIST,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}


export function assignNewQuiz(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/batchQuiz/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ASSIGN_QUIZ,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }

}

export function addQuizWithPDFAnswer(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/professorId/4/quizes/3/quizFileId/1/quizPdfAnswer/ ==POST
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizPdfAnswer/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: QUIZ_PDFANSWER,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }

}

export function addNewQuizQuestionAnswer(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizAnswer/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: QUIZ_QUESTIONANSWER,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }

}


export function createNewQuiz(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quiz/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CREATE_QUIZ,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getQuizDetails(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizBatchDetails/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: QUIZ_DETAILS,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getQuizQuesionAnswerList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizDetails/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {
        dispatch({
          type: QUIZ_QUESTIONANSWERLIST,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getQuizTableList(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizList/`;
  let payload = data.payload;
  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
    });
}

export function getHomeWorkList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://192.168.2.23:9000/institude/2/branch/2/professorHomeworkList/
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorHomeworkList/`;
  let payload = data.payload;


  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {

      return response;
    })
    .catch(function (error) {
    });

}

export function editQuizQuestion(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizDetails/ `;
  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_QUIZQUESTIONANSWER,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getProfessorSubjects(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/classesSubject/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORSUBJECTS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorBatch(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/classesSubject/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORBATCHS,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getQuizeSubmissionList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professor/studentQuizInfo/`;
  let payload = data.payload

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {

    });
}

export function quizFileUpload(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  // http://127.0.0.1:7000/institude/2/branch/2/professorsId/4/class/12/subject/12/subjectFolder/1/quizId/3/quizFile/ === POST
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorsId/quizFile/`
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: QUIZ_FILEUPLOAD,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function createNotesDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/notes/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CREATE_NOTES,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function notesFileUpload(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorsId/notesUpload/ `
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: NOTEES_FILEUPLOAD,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getNotesList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/notesList/`;
  let payload = data.payload;


  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {

      return response;
    })
    .catch(function (error) {

    });

}

export function getNotesDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let payload = data.payload;
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/batchNotesDetails/`;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: NOTES_DETAILS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateProfessorQuizDueDate(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/batchStatus/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_PROFESSORQUIZEDUEDATE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateQuizCheckingStatus(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/batchStatus/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_QUIZCHECKINGSTATUS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateProfessorHomeworkDueDate(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/professorId/4/homeWorkId/9/batchHomeworkId/3/updateStatus/ == PUT
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/updateStatus/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_HOMEWORKEDUEDATE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getHomeWorkDetail(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let payload = data.payload;

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/GetHomeworkInfo/`;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_HOMEWORKDETAIL,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateProfessorHomework(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/UpdatehomeWork/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_HOMEWORK,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getQuizEditDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/professores/4/quizes/2/ 
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizes/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_EDITQUIZ,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateQuizDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/professores/4/quizes/2/ === PUT
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizes/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_QUIZDETAIL,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getEditQuizUploadTypeQuestion(data) {
  // http://35.154.43.111:7000/institude/2/branch/2/professorId/4/quizId/3/quizPdfDetails/
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizPdfDetails/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_EDITQUIZUPLOADTYPE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}



export function updateUploadTypeQuize(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/professorId/4/quizId/3/quizPdfDetails/ === PUT
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizPdfDetails/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_UPLOADTYPEQUIZ,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}


export function downLoadStudentHomeWorkSubmissionFile(data, token) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + (token ? token : data.token)
    }

  };
  // http://127.0.0.1:7000/institude/2/branch/2/student/HomeworkDownload/ === POST
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/HomeworkDownload/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOADSTUDENTSUBMISSION_FILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function downloadQuizFile(data, ptoken) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + (ptoken ? ptoken : data.token)
    }

  };
  // http://127.0.0.1:7000/institude/2/branch/2/professorId/quizDownload/
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizDownload/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOAD_QUIZFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function downloadNotesFile(data, ptoken) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + (ptoken ? ptoken : data.token)
    }

  };
  // http://127.0.0.1:7000/institude/2/branch/2/professorId/notesDownload/
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/notesDownload/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOAD_NOTESFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateProfessorLastSeen(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/updateLastSeen/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_PROFESSORLASTSEEN,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function professorTimeTable(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  //http://127.0.0.1:7000/institude/2/branch/2/professorId/TimetableInfo 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/TimetableInfo `;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFESSOR_TIMETABLE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function professorBatchList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  //http://127.0.0.1:7000/institude/2/branch/2/professorId/batchList/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/batchList/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFESSOR_BATCHLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function homeWorkDriveFileUploading(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  //http://127.0.0.1:7000/institude/2/branch/2/professorDrive/selectHomeworkDrive/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/selectHomeworkDrive/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: HOMEWORK_DRIVEFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function notesDriveFileUploading(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  //http://127.0.0.1:7000/institude/2/branch/2/professorDrive/selectNotesDrive/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorDrive/selectNotesDrive/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: NOTES_DRIVEFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorProfile(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/profileDetail/`;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORPROFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function saveHomeworkAnnotation(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/homeworkAnnotation/`
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: HOMEWORK_ANNOTATION,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}
export function getAnnotationFile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/annotationFile/`
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ANNOTATION_FILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateProfessorProfile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/updateProfessorProfile/  `;
  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_PROFESSORPROFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}


export function getProfessorQuizPreview(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/studentQuizPreview/ `
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFESSOR_QUIZPREVIEW,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getDeadlineNotifications(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/DeadlineNofication/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_DEADLINENOTIFICATIONS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateProfessorNoticeLastseen(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/noticeLastSeenUpdate/ `;
  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_PROFESSORNOTICELASTSEEN,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorNotiSubmissionList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/submissionInfo/ `
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFESSOR_NOTIFICATIONSUBLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function quizStatusChecking(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizStatusChecking/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: PROFESSOR_QUIZSTATUSCHECKING,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}


export function updateProfessorCommentLastSeen(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/SubmissionUpdateLastseen/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_PROFESSORCOMMENTLASTSEEN,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteNotice(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/deleteNotice/  `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_NOTICE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteBatchHomework(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/deleteBatchhomework/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_BATCHHOMEWORK,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteBatchQuiz(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/deleteBatchQuiz/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_BATCHQUIZ,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteBatchNotes(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/deleteBatchNotes/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_BATCHNOTES,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function createBatchHomeworkFromDrive(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/createBatchHomeWork/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CREATE_BATCHHOMEWORKFROMDRIVE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function createBatchNotesFromDrive(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/createBatchNotes/ `;

  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: CREATE_BATCHNOTESFROMDRIVE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}


export function getProfessorTimetableHomeworkdueInfo(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/professorTimeHomeworkDuestableInfo`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORTIMETABLEHOMEWORKDUEINFO,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorTimetableNoticeInfo(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/professorTimetableNoticeInfo`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORTIMETABLENOTICEINFO,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorBatchDetailNotices(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorDashboardBatchDetailsNotice/ `;

  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORBATCHDETAILNOTICES,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorBatchDetailRecentSubmissions(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorDashboardBatchDetailsRecentSubmissions/`;

  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSORBATCHDETAILRECENTSUBMISSION,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfessorExpiredBatchData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorAllExpiredBatchDetails/ `;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFESSOREXPIREDBATCHDATA,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function addProfQuizImage(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizAnswerQuestionImage/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_PROFQUETYPEQUIZIMAGE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteProfQuizImage(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorId/quizAnswerQuestionRemoveImage/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: REMOVE_PROFQUETYPEQUIZIMAGE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function uploadFileToHomeDrive(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professor/uploadFileToHomeDriveFolder/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPLOADFILETOHOMEDRIVE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function uploadNoteFileToDrive(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/professorsId/uploadNotesFileToDrive/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPLOADNOTEFILETODRIVE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getAllBatchAttendanceDataOfStudent(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/overallReport/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_ALLBATCHATTENDANCEDATAOFSTUDENT,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getProfBatchAttendanceDefaulterStudent(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/batchDefaulterStudentList/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_PROFBATCHATTENDANCEDEFAULTERSTUDENT,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function submitMarksOfStudents(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + data.token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/professorHomeworkMarkAssign/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SUBMITMARKSOFSTUDENTS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}