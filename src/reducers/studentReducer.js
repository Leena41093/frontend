import {
    GET_STUDENTDASHBOARD, GET_STUDENTHOMEWORKLIST, GET_DASHBOARDBATCHDETAIL,
    SUBMIT_HOMEWORKDATE, GET_STUDENTHOMEWORKDETAILS, GET_STUDENTNOTESDETAIL,
    GET_STUDENTQUIZLIST, GET_STUDENTQUIZDETAIL, SUBMIT_HOMEWORKFILES, GET_QUIZEXAM, SUBMIT_QUIZTYPEQUESTION, SUBMIT_QUIZTYPEPDF,
    SUBMIT_QUIZRESULT, DOWNLOAD_STUDENTHOMEWORKFILE, UPDATE_STUDENTLASTSEEN, UPDATE_QUIZSTARTEXAMSTATUS, GET_QUIZRESUMEDATA,
    RESUME_QUESTIONTYPEQUIZ, RESUME_PDFTYPEQUIZ, GET_COMMENTLIST, ADD_COMMENT,
    COMMENT_LIKEDISLIKE, DOWNLOAD_QUIZFILE, DOWNLOAD_NOTESFILE, STUDENT_TIMETABLE, GET_STUDENTPROFILE, UPDATE_STUDENTPROFILE, GET_STUDENTNOTIFICATIONS,
    UPDATE_STUDENTNOTICELASTSEEN, GET_STUDENTCLASSES, GET_STUDENTSUBJECTS, GET_STUDENTBATCHS, STUDENT_NOTIFICATIONSUBLIST, UPDATE_STUDENTCOMMENTLASTSEEN, DOWNLOAD_STUDENTHOMEWORKDRIVEFILE,
    DELETE_COMMENT, GET_STUDENTATTENDANCEBATCHES, GET_STUDENTBATCHATTENDANCEDATA, GET_STUDENTCOMMENTACTIVITIES, GET_STUDENTBATCHNOTICESDEADLINE,
    GET_STUDENTCLASSESDATA, GET_STUDENTTIMETABLEDEADLINEINFO, GET_STUDENTTIMETABLENOTICEINFO, GET_STUDNETEXPIREDBATCHDATA, GET_STUDENTDASHBOARDBATCHDETAILNOTICES,
    GET_STUDENTDASHBOARDBATCHDETAILRECENTSUBMISSION, GET_STUDENTMONTHATTENDANCEAVERAGE, STUDENT_SUBJECTQUIZPERCENTAGE, STUDENT_SUBJECTHOMEWORKPERCENATGE, STUDENT_BATCHWISESUBMISSION, GET_STUDENTDETAILSBYSUBJECT, GET_STUDENTDETAILS
    , GET_STUDENTBATCHATTENDACEDETAILS, DOWNLOAD_QUIZFILE_MOBILE
} from '../actions/studentAction';

const initialState = {
    dashboardData: null,
    studentHomeworklist: null,
    studentHomeworkDetails: null,
    studentNotesDetails: null,
    studentsubmitHomeworkDate: null,
    studenthomeworkSubmission: null,
    studentQuizList: null,
    studentQuizDetail: null,
    quizData: null,
    quizQueTypeSubmissionResponse: null,
    quizPdfTypeSubmissionResponse: null,
    quizResult: null,
    downloadFileData: null,
    studentLastseenUpdate: null,
    changeStatusExam: null,
    resumeQuizData: null,
    resumeQuestionType: null,
    resumePdfType: null,
    commentList: null,
    commentAdd: null,
    isCommentlike: null,
    quizfileData: null,
    notesData: null,
    timetable: null,
    studentProfile: null,
    editStudentProfile: null,
    studentNotifications: null,
    studentNoticeLastssenUpdate: null,
    studentClasses: null,
    studentSubjects: null,
    studentBatches: null,
    studentNotiSublist: null,
    studentCommentLastseeUpdate: null,
    downloadStudentHWDriveFile: null,
    commentDelete: null,
    studentBatchAttendance: null,
    studentbatchAttendanceData: null,
    commentactiviesdata: null,
    batchnoticesdeadlinedata: null,
    studentclassesdata: null,
    studentTimetableDeadlineinfo: null,
    studentTimetableNotice: null,
    studentExpiredBatchInfo: null,
    studentdashboardbatchdetailnotices: null,
    studentdashboardbatchdetailrecentsubmission: null,
    getStudentMonthlyAttendanceAvg: null,
    getStudentSubjectQuizPercentage: null,
    getStudentSubjectHwPercentage: null,
    getStudentBatchwiseSubmission: null,
    getStudentDetailsBysubject: null,
    studentDetails: null,
    studentBatchAttendanceDetailsData: null,
    quizfiledatamobile: null
}

export default function student(state = initialState, action) {


    switch (action.type) {
        case GET_STUDENTDASHBOARD:
            return {
                ...state,
                dashboardData: action.payload,
            }
        case GET_STUDENTHOMEWORKLIST:
            return {
                ...state,
                studentHomeworklist: action.payload
            }
        case GET_DASHBOARDBATCHDETAIL:
            return {
                ...state,
                studentBatchDashboard: action.payload
            }
        case SUBMIT_HOMEWORKDATE:
            return {
                ...state,
                studentsubmitHomeworkDate: action.payload
            }

        case GET_STUDENTHOMEWORKDETAILS:
            return {
                ...state,
                studentHomeworkDetails: action.payload
            }
        case GET_STUDENTNOTESDETAIL:
            return {
                ...state,
                studentNotesDetails: action.payload
            }
        case SUBMIT_HOMEWORKFILES:
            return {
                ...state,
                studenthomeworkSubmission: action.payload,
            }
        case GET_STUDENTQUIZLIST:
            return {
                ...state,
                studentQuizList: action.payload
            }
        case GET_STUDENTQUIZDETAIL:
            return {
                ...state,
                studentQuizDetail: action.payload
            }
        case GET_QUIZEXAM:
            return {
                ...state,
                quizData: action.payload
            }
        case SUBMIT_QUIZTYPEQUESTION:
            return {
                ...state,
                quizQueTypeSubmissionResponse: action.payload
            }
        case SUBMIT_QUIZTYPEPDF:
            return {
                ...state,
                quizPdfTypeSubmissionResponse: action.payload
            }
        case SUBMIT_QUIZRESULT:
            return {
                ...state,
                quizResult: action.payload
            }
        case DOWNLOAD_STUDENTHOMEWORKFILE:
            return {
                ...state,
                downloadFileData: action.payload
            }
        case UPDATE_STUDENTLASTSEEN:
            return {
                ...state,
                studentLastseenUpdate: action.payload
            }
        case UPDATE_QUIZSTARTEXAMSTATUS:
            return {
                ...state,
                changeStatusExam: action.payload
            }
        case GET_QUIZRESUMEDATA:
            return {
                ...state,
                resumeQuizData: action.payload
            }
        case RESUME_QUESTIONTYPEQUIZ:
            return {
                ...state,
                resumeQuestionType: action.payload
            }
        case RESUME_PDFTYPEQUIZ:
            return {
                ...state,
                resumePdfType: action.payload
            }
        case GET_COMMENTLIST:
            return {
                ...state,
                commentList: action.payload
            }
        case ADD_COMMENT:
            return {
                ...state,
                commentAdd: action.payload
            }
        case COMMENT_LIKEDISLIKE:
            return {
                ...state,
                isCommentlike: action.payload
            }
        case DOWNLOAD_QUIZFILE:
            return {
                ...state,
                quizfileData: action.payload
            }
        case DOWNLOAD_QUIZFILE_MOBILE:
            return {
                ...state,
                quizfiledatamobile: action.payload
            }
        case DOWNLOAD_NOTESFILE:
            return {
                ...state,
                notesData: action.payload
            }
        case STUDENT_TIMETABLE:
            return {
                ...state,
                timetable: action.payload
            }
        case GET_STUDENTPROFILE:
            return {
                ...state,
                studentProfile: action.payload
            }
        case UPDATE_STUDENTPROFILE:
            return {
                ...state,
                editStudentProfile: action.payload
            }
        case GET_STUDENTNOTIFICATIONS:
            return {
                ...state,
                studentNotifications: action.payload
            }
        case UPDATE_STUDENTNOTICELASTSEEN:
            return {
                ...state,
                studentNoticeLastssenUpdate: action.payload
            }
        case GET_STUDENTCLASSES:
            return {
                ...state,
                studentClasses: action.payload
            }
        case GET_STUDENTSUBJECTS:
            return {
                ...state,
                studentSubjects: action.payload
            }
        case GET_STUDENTBATCHS:
            return {
                ...state,
                studentBatches: action.payload
            }
        case STUDENT_NOTIFICATIONSUBLIST:
            return {
                ...state,
                studentNotiSublist: action.payload
            }
        case UPDATE_STUDENTCOMMENTLASTSEEN:
            return {
                ...state,
                studentCommentLastseeUpdate: action.payload
            }
        case DOWNLOAD_STUDENTHOMEWORKDRIVEFILE:
            return {
                ...state,
                downloadStudentHWDriveFile: action.payload
            }
        case DELETE_COMMENT:
            return {
                ...state,
                commentDelete: action.payload
            }
        case GET_STUDENTATTENDANCEBATCHES:
            return {
                ...state,
                studentBatchAttendance: action.payload
            }
        case GET_STUDENTBATCHATTENDANCEDATA:
            return {
                ...state,
                studentbatchAttendanceData: action.payload
            }
        case GET_STUDENTCOMMENTACTIVITIES:
            return {
                ...state,
                commentactiviesdata: action.payload
            }
        case GET_STUDENTBATCHNOTICESDEADLINE:
            return {
                ...state,
                batchnoticesdeadlinedata: action.payload
            }
        case GET_STUDENTCLASSESDATA:
            return {
                ...state,
                studentclassesdata: action.payload
            }
        case GET_STUDENTTIMETABLEDEADLINEINFO:
            return {
                ...state,
                studentTimetableDeadlineinfo: action.payload
            }
        case GET_STUDENTTIMETABLENOTICEINFO:
            return {
                ...state,
                studentTimetableNotice: action.payload
            }
        case GET_STUDNETEXPIREDBATCHDATA:
            return {
                ...state,
                studentExpiredBatchInfo: action.payload
            }
        case GET_STUDENTDASHBOARDBATCHDETAILNOTICES:
            return {
                ...state,
                studentdashboardbatchdetailnotices: action.payload
            }
        case GET_STUDENTDASHBOARDBATCHDETAILRECENTSUBMISSION:
            return {
                ...state,
                studentdashboardbatchdetailrecentsubmission: action.payload
            }
        case GET_STUDENTMONTHATTENDANCEAVERAGE:
            return {
                ...state,
                getStudentMonthlyAttendanceAvg: action.payload
            }
        case STUDENT_SUBJECTQUIZPERCENTAGE:
            return {
                ...state,
                getStudentSubjectQuizPercentage: action.payload
            }
        case STUDENT_SUBJECTHOMEWORKPERCENATGE:
            return {
                ...state,
                getStudentSubjectHwPercentage: action.payload
            }
        case STUDENT_BATCHWISESUBMISSION:
            return {
                ...state,
                getStudentBatchwiseSubmission: action.payload
            }
        case GET_STUDENTDETAILSBYSUBJECT:
            return {
                ...state,
                getStudentDetailsBysubject: action.payload
            }
        case GET_STUDENTDETAILS:
            return {
                ...state,
                studentDetails: action.payload
            }
        case GET_STUDENTBATCHATTENDACEDETAILS:
            return {
                ...state,
                studentBatchAttendanceDetailsData: action.payload
            }
        default:
            return state
    }
}