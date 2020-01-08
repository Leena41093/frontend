import {
	ADD_HOMEWORK, GET_HOMEWORKDETAILS,
	GET_CLASSESSUBJECTSBATCHES, GET_PROFESSORDASHBOARD,
	GET_PROFESSORBATCHDASHBOARD, CREATE_NOTICE, GET_DASHBOARDSTUDENTLIST,
	SHOW_ALLNOTICE, PROFESSOR_TIMETABLEINFO, GET_FOLDERLIST, HOMEWORK_FILEUPLOAD, CREATE_FOLDERNAME, DOWNLOAD_FILE,
	CHANGE_HOMEWORKSTATUS, GET_STUDENTCHECKING, HOMEWORKSUBMISSION_FINISH, UPDATE_HOMEWORKCHECKINGSTATUS, GET_QUIZLIST, ASSIGN_QUIZ, CREATE_QUIZ, QUIZ_DETAILS,
	GET_PROFESSORSUBJECTS, GET_PROFESSORBATCHS, QUIZ_FILEUPLOAD, QUIZ_PDFANSWER, CREATE_QUIZQUESTION,
	CREATE_NOTES, NOTEES_FILEUPLOAD, NOTES_DETAILS, UPDATE_PROFESSORQUIZEDUEDATE, UPDATE_QUIZCHECKINGSTATUS, UPDATE_HOMEWORKEDUEDATE,
	GET_HOMEWORKDETAIL, UPDATE_HOMEWORK, QUIZ_QUESTIONANSWER, GET_EDITQUIZ, UPDATE_QUIZDETAIL, GET_EDITQUIZUPLOADTYPE, UPDATE_UPLOADTYPEQUIZ,
	UPDATE_QUIZQUESTIONANSWER, QUIZ_QUESTIONANSWERLIST, DOWNLOADSTUDENTSUBMISSION_FILE, DOWNLOAD_QUIZFILE, DOWNLOAD_NOTESFILE, UPDATE_PROFESSORLASTSEEN,
	PROFESSOR_TIMETABLE, PROFESSOR_BATCHLIST, HOMEWORK_DRIVEFILE, NOTES_DRIVEFILE, GET_PROFESSORPROFILE, UPDATE_PROFESSORPROFILE
	, HOMEWORK_ANNOTATION, ANNOTATION_FILE, PROFESSOR_QUIZPREVIEW, GET_DEADLINENOTIFICATIONS,
	UPDATE_PROFESSORNOTICELASTSEEN, PROFESSOR_NOTIFICATIONSUBLIST, PROFESSOR_QUIZSTATUSCHECKING, UPDATE_PROFESSORCOMMENTLASTSEEN, DELETE_NOTICE,
	DELETE_BATCHHOMEWORK, DELETE_BATCHQUIZ, DELETE_BATCHNOTES, CREATE_BATCHHOMEWORKFROMDRIVE, CREATE_BATCHNOTESFROMDRIVE, GET_PROFESSORTIMETABLEHOMEWORKDUEINFO,
	GET_PROFESSORTIMETABLENOTICEINFO, GET_PROFESSORBATCHDETAILNOTICES, GET_PROFESSORBATCHDETAILRECENTSUBMISSION, GET_PROFESSOREXPIREDBATCHDATA, ADD_PROFQUETYPEQUIZIMAGE,
	REMOVE_PROFQUETYPEQUIZIMAGE, UPLOADFILETOHOMEDRIVE, UPLOADNOTEFILETODRIVE, GET_ALLBATCHATTENDANCEDATAOFSTUDENT, GET_PROFBATCHATTENDANCEDEFAULTERSTUDENT,
	SUBMITMARKSOFSTUDENTS
} from '../actions/professorActions';

const initialState = {
	professorId: null,
	newHomework: null,
	homeworkDetails: null,
	classesSubjectsBatches: null,
	batchDetailDashboard: null,
	createNotice: null,
	studentList: null,
	showNotices: null,
	timeTableInfo: null,
	folderList: null,
	fileUpload: null,
	createFolder: null,
	downloadFileData: null,
	changeStatusRes: null,
	studentChecking: null,
	homeworkSubmission: null,
	updateStatus: null,
	quizList: null,
	assignQuiz: null,
	newQuiz: null,
	quizQuestionAnswer: null,
	questionAnswer: null,
	quizDetail: null,
	professorSubjects: null,
	professorBatches: null,
	createNotes: null,
	notesUpload: null,
	notesDetail: null,
	updateQuizDate: null,
	updateHomeworkDuedate: null,
	editHomeworkData: null,
	quizData: null,
	editquizdetail: null,
	uploadtypeQuizData: null,
	UploadtypeQuizEdit: null,
	questionAnswerList: null,
	editedQuestionAnswer: null,
	studentSubmissionFile: null,
	quizFileData: null,
	notesFiledata: null,
	updateProfessorlastseen: null,
	timeTable: null,
	professorDashboard: null,
	batchList: null,
	uploadingStatus: null,
	uploadDriveNotes: null,
	updateQuizCheckingstatus: null,
	professorProfile: null,
	editProfessorProfile: null,
	// updateQuizCheckingstatus: null,
	saveAnnotation: null,
	annotationFile: null,
	professorQuizPreview: null,
	// notesFiledata: null,
	deadlineNotifications: null,
	professorNoticeLastSeen: null,
	professorNotifiSubmissionlist: null,
	quizStatusCheckingProfessor: null,
	professorUpdateCommentLastSeen: null,
	noticeDelete: null,
	batchHomeworkDelete: null,
	batchDeleteQuiz: null,
	batchNotesDelete: null,
	newBatchHomeworkFromDrive: null,
	newBatchNotesFromDrive: null,
	professorTimetableHwDueInfo: null,
	professorTimetableNoticeinfo: null,
	professorBatchdetailNoticesData: null,
	professorBatchdetailRecentSubmissionsData: null,
	professorExpiredBatchData: null,
	profQueTypeQuizImage: null,
	profQueTypeQuizImageDelete: null,
	saveHomeworkToDrive: null,
	notesFileUploadToDrive: null,
	overAllStudentReportData: null,
	profBatchAttendanceDefaulterStudent: null,
	submittedMarksOfStudents:null
}

export default function professor(state = initialState, action) {


	switch (action.type) {
		case ADD_HOMEWORK:
			return {
				...state,
				newHomework: action.payload
			}
		case GET_HOMEWORKDETAILS:
			return {
				...state,
				homeworkDetails: action.payload
			}
		case GET_CLASSESSUBJECTSBATCHES:
			return {
				...state,
				classesSubjectsBatches: action.payload
			}
		case GET_PROFESSORDASHBOARD:
			return {
				...state,
				professorDashboard: action.payload
			}
		case GET_PROFESSORBATCHDASHBOARD:
			return {
				...state,
				batchDetailDashboard: action.payload
			}
		case CREATE_NOTICE:
			return {
				...state,
				createNotice: action.payload
			}
		case GET_DASHBOARDSTUDENTLIST:
			return {
				...state,
				studentList: action.payload
			}
		case SHOW_ALLNOTICE:
			return {
				...state,
				showNotices: action.payload
			}
		case PROFESSOR_TIMETABLEINFO:
			return {
				...state,
				timeTableInfo: action.payload
			}
		case GET_FOLDERLIST:
			return {
				...state,
				folderList: action.payload
			}
		case HOMEWORK_FILEUPLOAD:
			return {
				...state,
				fileUpload: action.payload
			}
		case CREATE_FOLDERNAME:
			return {
				...state,
				createFolder: action.payload
			}
		case DOWNLOAD_FILE:
			return {
				...state,
				downloadFileData: action.payload
			}
		case CHANGE_HOMEWORKSTATUS:
			return {
				...state,
				changeStatusRes: action.payload
			}
		case GET_STUDENTCHECKING:
			return {
				...state,
				studentChecking: action.payload
			}
		case HOMEWORKSUBMISSION_FINISH:
			return {
				...state,
				homeworkSubmission: action.payload
			}
		case UPDATE_HOMEWORKCHECKINGSTATUS:
			return {
				...state,
				updateStatus: action.payload
			}
		case GET_QUIZLIST:
			return {
				...state,
				quizList: action.payload
			}
		case ASSIGN_QUIZ:
			return {
				...state,
				assignQuiz: action.payload
			}
		case CREATE_QUIZ:
			return {
				...state,
				newQuiz: action.payload
			}
		case QUIZ_QUESTIONANSWER:
			return {
				...state,
				quizQuestionAnswer: action.payload
			}
		case QUIZ_DETAILS:
			return {
				...state,
				quizDetail: action.payload
			}
		case GET_PROFESSORSUBJECTS:
			return {
				...state,
				professorSubjects: action.payload
			}
		case GET_PROFESSORBATCHS:
			return {
				...state,
				professorBatches: action.payload
			}
		case QUIZ_FILEUPLOAD:
			return {
				...state,
				quizFileUploaded: action.payload
			}
		case QUIZ_PDFANSWER:
			return {
				...state,
				quizPdfAnswer: action.payload
			}
		case CREATE_QUIZQUESTION:
			return {
				...state,
				newQuizQuestion: action.payload
			}
		case CREATE_NOTES:
			return {
				...state,
				createNotes: action.payload
			}
		case NOTEES_FILEUPLOAD:
			return {
				...state,
				notesUpload: action.payload
			}
		case NOTES_DETAILS:
			return {
				...state,
				notesDetail: action.payload
			}
		case UPDATE_PROFESSORQUIZEDUEDATE:
			return {
				...state,
				updateQuizDate: action.payload
			}
		case UPDATE_QUIZCHECKINGSTATUS:
			return {
				...state,
				updateQuizCheckingstatus: action.payload
			}
		case UPDATE_HOMEWORKEDUEDATE:
			return {
				...state,
				updateHomeworkDuedate: action.payload,
			}
		case GET_HOMEWORKDETAIL:
			return {
				...state,
				editHomeworkData: action.payload,
			}
		case UPDATE_HOMEWORK:
			return {
				...state,
				updateHomework: action.payload
			}
		case GET_EDITQUIZ:
			return {
				...state,
				quizData: action.payload
			}
		case UPDATE_QUIZDETAIL:
			return {
				...state,
				editquizdetail: action.payload
			}
		case GET_EDITQUIZUPLOADTYPE:
			return {
				...state,
				uploadtypeQuizData: action.payload
			}
		case UPDATE_UPLOADTYPEQUIZ:
			return {
				...state,
				UploadtypeQuizEdit: action.payload
			}
		case QUIZ_QUESTIONANSWERLIST:
			return {
				...state,
				questionAnswerList: action.payload
			}
		case UPDATE_QUIZQUESTIONANSWER:
			return {
				...state,
				editedQuestionAnswer: action.payload
			}
		case DOWNLOADSTUDENTSUBMISSION_FILE:
			return {
				...state,
				studentSubmissionFile: action.payload
			}
		case DOWNLOAD_QUIZFILE:
			return {
				...state,
				quizFileData: action.payload
			}
		case DOWNLOAD_NOTESFILE:
			return {
				...state,
				notesFiledata: action.payload,
			}
		case UPDATE_PROFESSORLASTSEEN:
			return {
				...state,
				updateProfessorlastseen: action.payload
			}
		case PROFESSOR_TIMETABLE:
			return {
				...state,
				timeTable: action.payload,
			}
		case PROFESSOR_BATCHLIST:
			return {
				...state,
				batchList: action.payload,
			}
		case HOMEWORK_DRIVEFILE:
			return {
				...state,
				uploadingStatus: action.payload,
			}
		case NOTES_DRIVEFILE:
			return {
				...state,
				uploadDriveNotes: action.payload,
			}
		case GET_PROFESSORPROFILE:
			return {
				...state,
				professorProfile: action.payload
			}
		case UPDATE_PROFESSORPROFILE:
			return {
				...state,
				editProfessorProfile: action.payload
			}
		case HOMEWORK_ANNOTATION:
			return {
				...state,
				saveAnnotation: action.payload,
			}
		case ANNOTATION_FILE:
			return {
				...state,
				annotationFile: action.payload,
			}
		case PROFESSOR_QUIZPREVIEW:
			return {
				...state,
				professorQuizPreview: action.payload
			}
		case GET_DEADLINENOTIFICATIONS:
			return {
				...state,
				deadlineNotifications: action.payload,
			}
		case UPDATE_PROFESSORNOTICELASTSEEN:
			return {
				...state,
				professorNoticeLastSeen: action.payload
			}
		case PROFESSOR_NOTIFICATIONSUBLIST:
			return {
				...state,
				professorNotifiSubmissionlist: action.payload
			}
		case PROFESSOR_QUIZSTATUSCHECKING:
			return {
				...state,
				quizStatusCheckingProfessor: action.payload
			}
		case UPDATE_PROFESSORCOMMENTLASTSEEN:
			return {
				...state,
				professorUpdateCommentLastSeen: action.payload
			}
		case DELETE_NOTICE:
			return {
				...state,
				noticeDelete: action.payload
			}
		case DELETE_BATCHHOMEWORK:
			return {
				...state,
				batchHomeworkDelete: action.payload
			}
		case DELETE_BATCHQUIZ:
			return {
				...state,
				batchDeleteQuiz: action.payload
			}
		case DELETE_BATCHNOTES:
			return {
				...state,
				batchNotesDelete: action.payload
			}
		case CREATE_BATCHHOMEWORKFROMDRIVE:
			return {
				...state,
				newBatchHomeworkFromDrive: action.payload
			}
		case CREATE_BATCHNOTESFROMDRIVE:
			return {
				...state,
				newBatchNotesFromDrive: action.payload
			}
		case GET_PROFESSORTIMETABLEHOMEWORKDUEINFO:
			return {
				...state,
				professorTimetableHwDueInfo: action.payload
			}
		case GET_PROFESSORTIMETABLENOTICEINFO:
			return {
				...state,
				professorTimetableNoticeinfo: action.payload
			}
		case GET_PROFESSORBATCHDETAILNOTICES:
			return {
				...state,
				professorBatchdetailNoticesData: action.payload
			}
		case GET_PROFESSORBATCHDETAILRECENTSUBMISSION:
			return {
				...state,
				professorBatchdetailRecentSubmissionsData: action.payload
			}
		case GET_PROFESSOREXPIREDBATCHDATA:
			return {
				...state,
				professorExpiredBatchData: action.payload
			}
		case ADD_PROFQUETYPEQUIZIMAGE:
			return {
				...state,
				profQueTypeQuizImage: action.payload
			}
		case REMOVE_PROFQUETYPEQUIZIMAGE:
			return {
				...state,
				profQueTypeQuizImageDelete: action.payload
			}

		case UPLOADFILETOHOMEDRIVE:
			return {
				...state,
				saveHomeworkToDrive: action.payload
			}

		case UPLOADNOTEFILETODRIVE:
			return {
				...state,
				notesFileUploadToDrive: action.payload
			}

		case GET_ALLBATCHATTENDANCEDATAOFSTUDENT:
			return {
				...state,
				overAllStudentReportData: action.payload
			}
		case GET_PROFBATCHATTENDANCEDEFAULTERSTUDENT:
			return {
				...state,
				profBatchAttendanceDefaulterStudent: action.payload
			}
		case SUBMITMARKSOFSTUDENTS:
			return{
				...state,
				submittedMarksOfStudents:action.payload
			}
		default:
			return state
	}
}