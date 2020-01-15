import axios from 'axios';
import { BASE_URL } from '../components/common/config';
export const GET_STUDENTCLASSESDATA = 'GET_STUDENTCLASSESDATA';
export const GET_STUDENTDASHBOARD = 'GET_STUDENTDASHBOARD';
export const GET_STUDENTHOMEWORKLIST = 'GET_STUDENTHOMEWORKLIST';
export const GET_DASHBOARDBATCHDETAIL = 'GET_DASHBOARDBATCHDETAIL';
export const SUBMIT_HOMEWORKDATE = 'SUBMIT_HOMEWORKDATE';
export const GET_STUDENTHOMEWORKDETAILS = 'GET_STUDENTHOMEWORKDETAILS';
export const GET_STUDENTNOTESDETAIL = 'GET_STUDENTNOTESDETAIL';
export const SUBMIT_HOMEWORKFILES = 'SUBMIT_HOMEWORKFILES';
export const GET_STUDENTQUIZLIST = 'GET_STUDENTQUIZLIST';
export const GET_STUDENTQUIZDETAIL = 'GET_STUDENTQUIZDETAIL';
export const GET_QUIZEXAM = 'GET_QUIZEXAM';
export const SUBMIT_QUIZTYPEQUESTION = 'SUBMIT_QUIZTYPEQUESTION';
export const SUBMIT_QUIZTYPEPDF = 'SUBMIT_QUIZTYPEPDF';
export const SUBMIT_QUIZRESULT = 'SUBMIT_QUIZRESULT';
export const DOWNLOAD_STUDENTHOMEWORKFILE = 'DOWNLOAD_STUDENTHOMEWORKFILE';
export const UPDATE_STUDENTLASTSEEN = 'UPDATE_STUDENTLASTSEEN';
export const UPDATE_QUIZSTARTEXAMSTATUS = 'UPDATE_QUIZSTARTEXAMSTATUS';
export const GET_QUIZRESUMEDATA = 'GET_QUIZRESUMEDATA';
export const RESUME_QUESTIONTYPEQUIZ = 'RESUME_QUESTIONTYPEQUIZ';
export const RESUME_PDFTYPEQUIZ = 'RESUME_PDFTYPEQUIZ';
export const GET_COMMENTLIST = 'GET_COMMENTLIST';
export const ADD_COMMENT = 'ADD_COMMENT';
export const COMMENT_LIKEDISLIKE = 'COMMENT_LIKEDISLIKE';
export const DOWNLOAD_QUIZFILE = 'DOWNLOAD_QUIZFILE';
export const DOWNLOAD_NOTESFILE = 'DOWNLOAD_NOTESFILE';
export const STUDENT_TIMETABLE = 'STUDENT_TIMETABLE';
export const GET_STUDENTPROFILE = 'GET_STUDENTPROFILE';
export const UPDATE_STUDENTPROFILE = 'UPDATE_STUDENTPROFILE';
export const GET_STUDENTNOTIFICATIONS = 'GET_STUDENTNOTIFICATIONS';
export const UPDATE_STUDENTNOTICELASTSEEN = 'UPDATE_STUDENTNOTICELASTSEEN';
export const GET_STUDENTCLASSES = 'GET_STUDENTCLASSES';
export const GET_STUDENTSUBJECTS = ' GET_STUDENTSUBJECTS';
export const GET_STUDENTBATCHS = 'GET_STUDENTBATCHS';
export const STUDENT_NOTIFICATIONSUBLIST = 'STUDENT_NOTIFICATIONSUBLIST';
export const UPDATE_STUDENTCOMMENTLASTSEEN = 'UPDATE_STUDENTCOMMENTLASTSEEN';
export const DOWNLOAD_STUDENTHOMEWORKDRIVEFILE = 'DOWNLOAD_STUDENTHOMEWORKDRIVEFILE';
export const GET_STUDENTATTENDANCEBATCHES = 'GET_STUDENTATTENDANCEBATCHES';
export const GET_STUDENTBATCHATTENDANCEDATA = 'GET_STUDENTBATCHATTENDANCEDATA'
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const GET_STUDENTCOMMENTACTIVITIES = 'GET_STUDENTCOMMENTACTIVITIES';
export const GET_STUDENTBATCHNOTICESDEADLINE = 'GET_STUDENTBATCHNOTICESDEADLINE'
export const GET_STUDENTTIMETABLEDEADLINEINFO = 'GET_STUDENTTIMETABLEDEADLINEINFO';
export const GET_STUDENTTIMETABLENOTICEINFO = 'GET_STUDENTTIMETABLENOTICEINFO';
export const GET_STUDNETEXPIREDBATCHDATA = 'GET_STUDNETEXPIREDBATCHDATA';
export const GET_STUDENTDASHBOARDBATCHDETAILNOTICES = 'GET_STUDENTDASHBOARDBATCHDETAILNOTICES'
export const GET_STUDENTDASHBOARDBATCHDETAILRECENTSUBMISSION = 'GET_STUDENTDASHBOARDBATCHDETAILRECENTSUBMISSION';
export const GET_STUDENTMONTHATTENDANCEAVERAGE = 'GET_STUDENTMONTHATTENDANCEAVERAGE';
export const STUDENT_SUBJECTQUIZPERCENTAGE = 'STUDENT_SUBJECTQUIZPERCENTAGE';
export const STUDENT_SUBJECTHOMEWORKPERCENATGE = 'STUDENT_SUBJECTHOMEWORKPERCENATGE';
export const STUDENT_BATCHWISESUBMISSION = 'STUDENT_BATCHWISESUBMISSION';
export const GET_STUDENTDETAILSBYSUBJECT = 'GET_STUDENTDETAILSBYSUBJECT';
export const GET_STUDENTDETAILS = 'GET_STUDENTDETAILS';
export const GET_STUDENTBATCHATTENDACEDETAILS = 'GET_STUDENTBATCHATTENDACEDETAILS';
export const DOWNLOAD_QUIZFILE_MOBILE = 'DOWNLOAD_QUIZFILE_MOBILE';
let token =`JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJiaHVzaGFuM0BnbWFpbC5jb20iLCJleHAiOjQ1Njg4MDQ1NDYsImVtYWlsIjoiYmh1c2hhbjNAZ21haWwuY29tIn0.5nD6ysJLChbte4EM1OL0rwU9hM3ZZtT2KtUcAa23KXQ`
export function getStudentClassesData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentDashboard_ClassDetails/ `;
  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTCLASSESDATA,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}


export function getStudentDashboardDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentDashboardDetail/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTDASHBOARD,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentHomeworkList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentHomeworkList/`;
  let payload = data.payload;

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {

      return response;
    })
    .catch(function (error) {

    });

}

export function getStudentBatchDetailDashBoard(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentDashboardBatchDetails/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_DASHBOARDBATCHDETAIL,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentHomeworkDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/homeworkDetail/`;
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTHOMEWORKDETAILS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function submitHomeworkDate(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  // http://127.0.0.1:7000/institude/2/branch/2/batchHomework/3/homeworkSubmission/  === POST 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/batchHomework/${data.batch_homework_id}/homeworkSubmission/`;

  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SUBMIT_HOMEWORKDATE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentNoteList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentNotesList/ `;
  let payload = data.payload;

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {

      return response;
    })
    .catch(function (error) {

    });
}

export function getStudentNoteDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token,
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/batchNotesDetails/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTNOTESDETAIL,
          payload: response

        })
      })
      .catch(function (error) {

      });
  }
}

export function submitHomeworkFile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentHomeworkUpload/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SUBMIT_HOMEWORKFILES,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentQuizList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentQuizList/ `;
  let payload = data.payload;

  return axios.post(URL, payload, API_CONFIG)
    .then(function (response) {

      return response;
    })
    .catch(function (error) {

    });
}

export function getStudentQuizDetail(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentBatchQuizDetail/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTQUIZDETAIL,
          payload: response

        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentQuizExam(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentQuizQuestions/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_QUIZEXAM,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function submitQuizTypeQuestion(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/student/SubmissionQuestionType/
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/SubmissionQuestionType/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SUBMIT_QUIZTYPEQUESTION,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function submitQuizTypePDF(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/PdfQuizSubmission/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SUBMIT_QUIZTYPEPDF,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function submitQuizResult(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token,

    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/QuizCompleteInfo/`;
  let payload = data.payload;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: SUBMIT_QUIZRESULT,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function downloadStudentHomeworkFile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }

  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/DownloadHome/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOAD_STUDENTHOMEWORKFILE,
          payload: response

        })
      })
      .catch(function (error) {

      });
  }
}

export function downloadStudentHomeworkDrivefile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/DownloadOwnHome/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOAD_STUDENTHOMEWORKDRIVEFILE,
          payload: response

        })
      })
      .catch(function (error) {

      });
  }
}

export function updateStudentLastSeen(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/updateLastSeen/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_STUDENTLASTSEEN,
          payload: response

        })
      })
      .catch(function (error) {

      });
  }
}

export function quizStartExamStatusChange(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/professorId/batchQuizAttemptStatus/`;
  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_QUIZSTARTEXAMSTATUS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getResumeQuizData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  // http://127.0.0.1:7000/institude/2/branch/2/student/getResumeQuiz/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/getResumeQuiz/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_QUIZRESUMEDATA,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function resumeQuestionQuiz(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/resumeQuiz/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: RESUME_QUESTIONTYPEQUIZ,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function resumePdfQuiz(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/resumeQuiz/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: RESUME_PDFTYPEQUIZ,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getCommentList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/commentList/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_COMMENTLIST,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function addComment(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/student/comment/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/comment/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: ADD_COMMENT,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function commentLikeDislike(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/student/commentAction/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/commentAction/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: COMMENT_LIKEDISLIKE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function downloadStudentQuizFile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/quizDownload/`;

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

export function downloadStudentQuizFileFromMobile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentQuizDownloadForMobile/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DOWNLOAD_QUIZFILE_MOBILE,
          payload: response

        })
      })
      .catch(function (error) {

      });
  }
}

export function downloadStudentNotesFile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }

  };
  // http://127.0.0.1:7000/institude/2/branch/2/student/notesDownload/ 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/notesDownload/`;

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

export function studentTimeTable(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  // http://127.0.0.1:7000/institude/2/branch/2/student/TimetableInfo 
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/TimetableInfo`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: STUDENT_TIMETABLE,
          payload: response

        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentProfile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/profileDetail/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTPROFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateStudentProfile(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/updateStudentProfile/ `;
  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_STUDENTPROFILE,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentDeadlineNotifications(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let payload = data.payload;
  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/noticeQuizList/`;

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTNOTIFICATIONS,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function updateStudentNoticeLastseen(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/noticeUpdateLastSeen/ `;
  let payload = data.payload;

  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_STUDENTNOTICELASTSEEN,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentClasses(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/getClasses/ `;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTCLASSES,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentSubjects(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };
  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/getClasses/`;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTSUBJECTS,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentBatch(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/getClasses/ `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTBATCHS,
          payload: response.data.response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentNotiSubmissionList(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/commentsSubmissionInfo/ `
  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: STUDENT_NOTIFICATIONSUBLIST,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function updateCommentLastSeen(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institude_id}/branch/${data.branch_id}/student/commentUpdateLastseen/`;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: UPDATE_STUDENTCOMMENTLASTSEEN,
          payload: response.data.response
        })
      })
      .catch(function (error) {

      });
  }
}

export function deleteComment(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/deleteComment/  `;
  let payload = data.payload
  return dispatch => {
    return axios.put(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: DELETE_COMMENT,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentAttendanceBatches(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/getStudentBatches/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTATTENDANCEBATCHES,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentBatchAttendanceData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "JWT " + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/getStudentAttendance/ `;
  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTBATCHATTENDANCEDATA,
          payload: response
        })
      })
      .catch(function (error) {

      });
  }
}

export function getStudentCommentActivities(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentDashboardComment/`;
  let payload = data.payload

  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTCOMMENTACTIVITIES,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentBatchNotices(data) {


  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentDashboardNoticeDeadlinesDetails/`;

  let payload = data.payload
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTBATCHNOTICESDEADLINE,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentTimetableDeadlineInfo(data) {
  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentTimetableDeadlineInfo`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTTIMETABLEDEADLINEINFO,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentTimetableNoticeInfo(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentTimetableNoticeInfo`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTTIMETABLENOTICEINFO,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentExpiredBatchData(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentDashboard_ExpiredBatchDetails/`;


  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDNETEXPIREDBATCHDATA,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getstudentDashboardBatchDetailsNotices(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentDashboardBatchDetailsNotices/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTDASHBOARDBATCHDETAILNOTICES,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getstudentDashboardBatchDetailsRecentSubmission(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentDashboardBatchRecentSubmission/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTDASHBOARDBATCHDETAILRECENTSUBMISSION,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentMonthAttendanceAverage(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/studentMonthAttendanceAvg/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTMONTHATTENDANCEAVERAGE,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentSubjectQuizPercentage(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentSubjectQuizPercentage/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: STUDENT_SUBJECTQUIZPERCENTAGE,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentSubjectHomeworkPercentage(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentHomeworkSubjectPercentage/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: STUDENT_SUBJECTHOMEWORKPERCENATGE,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentBatchSubmission(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institudeId}/branch/${data.branchId}/studentBatchWiseSubmission/ `;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: STUDENT_BATCHWISESUBMISSION,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentDetailsBySubject(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentSubjectWiseDetails/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTDETAILSBYSUBJECT,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function getStudentDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/studentDetails/`;

  return dispatch => {
    return axios.get(URL, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTDETAILS,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

export function studentBatchAttendanceDetails(data) {

  const API_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + token
    }
  };

  let URL = `${BASE_URL}institude/${data.institute_id}/branch/${data.branch_id}/student/studentBatchAttendanceDetails/`;

  let payload = data.payload;
  return dispatch => {
    return axios.post(URL, payload, API_CONFIG)
      .then(function (response) {

        dispatch({
          type: GET_STUDENTBATCHATTENDACEDETAILS,
          payload: response
        })
      })
      .catch(function (error) {
      });
  }
}

