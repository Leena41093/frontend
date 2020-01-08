import {
	GET_CLASSES, GET_SUBJECTS, GET_BATCHES,
	ADD_CLASS, UPDATE_CLASSLIST, ADD_SUBJECT, UPDATE_SUBJECTLIST, UPDATE_CLASS, DELETE_CLASS, UPDATE_SUBJECT, ADD_BATCHES, UPDATE_BATCH, UPDATE_BATCHLIST, GET_BATCHDETAIL, DELETE_SUBJECT, DELETE_BATCH,
	GET_SEARCHSTUDENTDETAIL, UPDATE_BATCHDETAIL, GET_STUDENTDETAIL, GET_PROFESSORSDETAIL,
	ADD_STUDENTBATCHES, ADD_PROFESSORBATCHES, UPDATE_STUDENTDETAIL,
	ADD_PROFESSOR, ADD_STUDENT, GET_PROFESSORSDETAILS,
	GET_SEARCHPROFESSDETAIL, UPDATE_PROFESSOR_DETAILS, UPDATE_PROFESSORDETAIL,
	DELETE_PROFESSOR_BATCH, DELETE_STUDENTBATCH, DELETE_ENQUIRY, ADD_ENQUIRY,
	UPDATE_ENQUIRYSTATUS, UPDATE_ENQUIRY, ADD_STUDENTCOPY, GET_CLASSESONYEAR, UPLOAD_CSVFILE,
	ALL_STUDENTLIST, ALL_PROFESSORLIST, UPDATE_USERROLE, GET_INSTITUDES, ADD_FINANCE,
	GET_FINANCELIST, UPDATE_FINANCE, GET_FINANCEEDITDATA, DELETE_FINANCE,
	ADD_STUDENTPAYMENTSCHEDULE, ADD_STUDENTPAYMENTDETAIL, UPDATE_STUDENTPAYMENTDETAIL,
	DELETE_STUDENTPAYMENTDETAIL, ADD_STUDENTPAYMENT, ADD_STUDENTPAYMENTLIST,
	GET_YEARFORSTUDENTCOPY, ADD_STUDENTPROFESSOREGISTRATION, GET_ADMINPROFILE,
	UPDATE_ADMINPROFILE, INVITATION_SEND, PASSWORD_CHECK, UPDATE_PASSWORD, DELETE_STUDENTPROFESSOR,
	AUTO_ASSIGNHWQUIZNOTES, GET_RESTOREID, STORE_RESTOREID, GET_REPORTDATA, GETPROFILEPIC,
	CHECKPROFILESELECTEDORNOT, PROFILEPICUPLOAD, GETSTUDENTSTATUS, GETSUBJECTBATCHLIST,
	BATCHAUTOCREATION, SAVEASSISTANTPROFESSOR, GETATEENDANCEDETAILS, GETATEENDANCELISTMODEL,
	MARK_ATTENDANCE, GET_PROFATTENDANCEBATCHESDATA, GET_PROFATTENDANCEBATCHES, GET_ATTENDANCELISTONDATE,
	UPDATE_ATTENDANCELIST, GETSTUDENTATTENDANCEREPORT, DOWNLOADSTUDENTATTENDANCEREPORT, SEARCHTATTENDANCESTUDENT, GETATTENDANCEDASHBOARDSTUDENTLIST,
	GET_ADMINATTENDANCEBATCHES, GET_ADMINATTENDANCEPROFESSORLIST, GET_ADMINATTENDANCEGRAPHDATA,
	ISPROFESSORADMIN, GET_STUDENTDETAILS, GET_STUDENTBATCHWISEATTENDANCEREPORT
	, GET_PROFESSOREMAILCHECK, GET_STUDENTEMAILCHECK, CLASSMANAGERFLOW
} from '../actions/index';
import { notesDriveFileUploading } from '../actions/professorActions';

const initialState = {
	branches: [],
	classes: [],
	subjects: [],
	batches: [],
	institudeId: null,
	branchId: null,
	batchId: null,
	subjectId: null,
	enquiryId: null,
	professorId: null,
	newBatch: null,
	newSubject: null,
	newClass: null,
	updatedBatch: null,
	deleteClassResponse: null,
	deleteSubjectResponse: null,
	deleteBatchResponse: null,
	batchDetails: null,
	// studentsDetails: null,
	serachStudentDetails: null,
	updatedBatchDetail: null,
	studentBatch: null,
	updateStudentDetail: null,
	updateProfessorDetail: null,
	deleteEnquiryResponse: null,
	deleteStudBatch: null,
	updatedEnquiryStatus: null,
	updatedEnquiryResponse: null,
	professorDetail: null,
	newStudentCopy: null,
	classListYearwise: [],
	uploadedCsv: null,
	studentList: null,
	professorList: null,
	roleUpdate: null,
	institudes: null,
	financeAdd: null,
	financeList: null,
	financeUpdate: null,
	getFinanceeditData: null,
	financeDelete: null,
	studentPaymentScheduleAdd: null,
	studentPaymentDetailAdd: null,
	studentPaymentDetailUpdate: null,
	studentPaymentDetailDelete: null,
	studentPaymentAdd: null,
	studentPaymentList: null,
	yearListStudentCopy: null,
	studentProfessorRegiAdd: null,
	adminProfileData: null,
	adminProfileUpdate: null,
	sendInvitation: null,
	passwordCheck: null,
	passwordUpdate: null,
	studentProfessorDelete: null,
	autoAssignHwQuizNotes: null,
	getRestoredId: null,
	storeRestoredId: null,
	reportData: null,
	getProfilePicture: null,
	profileSelectedOrNot: null,
	profileUpload: null,
	profilePictureUrl: null,
	getSubBatchList: null,
	batchAutoCreate: null,
	studentTableStatus: null,
	saveAssistantProf: null,
	adminAttendancedetail: null,
	modelAttendanceList: null,
	attendanceMark: null,
	profAttendanceBatchesData: null,
	profAttendancebatches: null,
	attendanceListonDate: null,
	updateStudentAttendancelist: null,
	studentAttendaceReport: null,
	getStudentAttendanceReport: null,
	studentAttendanceSearch: null,
	adminStudentDefaulterList: null,
	adminAttendanceBatchesList: null,
	adminAttendanceProflist: null,
	adminAttendanceGraphdata: null,
	professorAdmin: null,
	studentDetailsForReport: null,
	studentBatchWiseAttendanceReport: null,
	professorEmailCheck: null,
	studentEmailCheck: null,
	classManagerFlow: null,
	updateclasses: null
}

export default function app(state = initialState, action) {


	switch (action.type) {

		case GET_CLASSES:
			return {
				...state,
				classes: action.payload,
				subjects: [],
				batches: [],
				branchId: action.branchId,
				institudeId: action.institudeId
			}
		case GET_SUBJECTS:
			return {
				...state,
				subjects: action.payload,
				batches: [],
				classId: action.payload
			}
		case GET_BATCHES:
			return {
				...state,
				batches: action.payload,
				subjectId: action.payload
			}
		case ADD_CLASS:
			return {
				...state,
				newClass: action.payload
			}
		case UPDATE_CLASSLIST:
			return {
				...state,
				updateclasses: action.payload
			}
		case UPDATE_CLASS:
			return {
				...state,
				updatedClass: action.payload
			}
		case DELETE_CLASS:
			return {
				...state,
				deleteClassResponse: action.payload
			}
		case ADD_SUBJECT:
			return {
				...state,
				newSubject: action.payload
			}
		case UPDATE_SUBJECTLIST:
			return {
				...state,
				subjects: action.payload
			}
		case UPDATE_SUBJECT:
			return {
				...state,
				updatedSubject: action.payload
			}
		case DELETE_SUBJECT:
			return {
				...state,
				deleteSubjectResponse: action.payload
			}
		case ADD_BATCHES:
			return {
				...state,
				newBatch: action.payload
			}
		case UPDATE_BATCH:
			return {
				...state,
				updatedBatch: action.payload
			}
		case UPDATE_BATCHLIST:
			return {
				...state,
				batches: action.payload
			}
		case DELETE_BATCH:
			return {
				...state,
				deleteBatchResponse: action.payload
			}
		case GET_BATCHDETAIL:
			return {
				...state,
				batchDetails: action.payload
			}

		case GET_SEARCHSTUDENTDETAIL:
			return {
				...state,
				serachStudentDetails: action.payload
			}

		case UPDATE_BATCHDETAIL:
			return {
				...state,
				updatedBatchDetail: action.payload
			}
		case GET_STUDENTDETAIL:
			return {
				...state,
				studentDetail: action.payload
			}
		case GET_PROFESSORSDETAILS:
			return {
				...state,
				professorDetail: action.payload
			}
		case GET_SEARCHPROFESSDETAIL:
			return {
				...state,
				serachProfessorDetails: action.payload
			}
		case GET_PROFESSORSDETAIL:
			return {
				...state,
				professorsDetails: action.payload
			}
		case ADD_STUDENTBATCHES:
			return {
				...state,
				studentBatch: action.payload
			}

		case ADD_PROFESSORBATCHES:
			return {
				...state,
				professorBatch: action.payload
			}

		case UPDATE_STUDENTDETAIL:
			return {
				...state,
				updateStudentDetail: action.payload
			}

		case UPDATE_PROFESSORDETAIL:
			return {
				...state,
				updateProfessorDetail: action.payload
			}

		case DELETE_PROFESSOR_BATCH:
			return {
				...state,
				deleteProfessorBatch: action.payload
			}

		case UPDATE_PROFESSOR_DETAILS:
			return {
				...state,
				professorDetail: action.payload
			}

		case DELETE_ENQUIRY:
			return {
				...state,
				deleteEnquiryResponse: action.payload
			}
		case ADD_ENQUIRY:
			return {
				...state,
				newEnquiry: action.payload
			}
		case DELETE_STUDENTBATCH:
			return {
				...state,
				deleteStudBatch: action.payload
			}
		case ADD_PROFESSOR:
			return {
				...state,
				newProfessor: action.payload
			}
		case ADD_STUDENT:
			return {
				...state,
				newStudent: action.payload
			}
		case UPDATE_ENQUIRYSTATUS:
			return {
				...state,
				updatedEnquiryStatus: action.payload
			}
		case UPDATE_ENQUIRY:
			return {
				...state,
				updatedEnquiryResponse: action.payload
			}
		case ADD_STUDENTCOPY:
			return {
				...state,
				newStudentCopy: action.payload
			}
		case GET_CLASSESONYEAR:
			return {
				...state,
				classListYearwise: action.payload
			}
		case UPLOAD_CSVFILE:
			return {
				...state,
				uploadedCsv: action.payload
			}
		case ALL_STUDENTLIST:
			return {
				...state,
				studentList: action.payload
			}
		case ALL_PROFESSORLIST:
			return {
				...state,
				professorList: action.payload
			}
		case UPDATE_USERROLE:
			return {
				...state,
				roleUpdate: action.payload,
			}
		case GET_INSTITUDES:
			return {
				...state,
				institudes: action.payload,
			}
		case ADD_FINANCE:
			return {
				...state,
				financeAdd: action.payload,
			}
		case GET_FINANCELIST:
			return {
				...state,
				financeList: action.payload
			}
		case UPDATE_FINANCE:
			return {
				...state,
				financeUpdate: action.payload
			}
		case GET_FINANCEEDITDATA:
			return {
				...state,
				getFinanceeditData: action.payload
			}
		case DELETE_FINANCE:
			return {
				...state,
				financeDelete: action.payload
			}
		case ADD_STUDENTPAYMENTSCHEDULE:
			return {
				...state,
				studentPaymentScheduleAdd: action.payload
			}
		case ADD_STUDENTPAYMENTDETAIL:
			return {
				...state,
				studentPaymentDetailAdd: action.payload
			}
		case UPDATE_STUDENTPAYMENTDETAIL:
			return {
				...state,
				studentPaymentDetailUpdate: action.payload
			}
		case DELETE_STUDENTPAYMENTDETAIL:
			return {
				...state,
				studentPaymentDetailDelete: action.payload
			}
		case ADD_STUDENTPAYMENT:
			return {
				...state,
				studentPaymentAdd: action.payload
			}
		case ADD_STUDENTPAYMENTLIST:
			return {
				...state,
				studentPaymentList: action.payload
			}
		case GET_YEARFORSTUDENTCOPY:
			return {
				...state,
				yearListStudentCopy: action.payload
			}
		case ADD_STUDENTPROFESSOREGISTRATION:
			return {
				...state,
				studentProfessorRegiAdd: action.payload
			}
		case GET_ADMINPROFILE:
			return {
				...state,
				adminProfileData: action.payload
			}
		case UPDATE_ADMINPROFILE:
			return {
				...state,
				adminProfileUpdate: action.payload
			}
		case INVITATION_SEND:
			return {
				...state,
				sendInvitation: action.payload
			}
		case PASSWORD_CHECK:
			return {
				...state,
				passwordCheck: action.payload
			}
		case UPDATE_PASSWORD:
			return {
				...state,
				passwordUpdate: action.payload
			}
		case DELETE_STUDENTPROFESSOR:
			return {
				...state,
				studentProfessorDelete: action.payload
			}
		case AUTO_ASSIGNHWQUIZNOTES:
			return {
				...state,
				autoAssignHwQuizNotes: action.payload
			}
		case GET_RESTOREID:
			return {
				...state,
				getRestoredId: action.payload
			}
		case STORE_RESTOREID:
			return {
				...state,
				storeRestoredId: action.payload
			}
		case GET_REPORTDATA:
			return {
				...state,
				reportData: action.payload
			}
		case GETPROFILEPIC:
			return {
				...state,
				getProfilePicture: action.payload,
				profilePictureUrl: action.payload.response.profilePicture
			}
		case CHECKPROFILESELECTEDORNOT:
			return {
				...state,
				profileSelectedOrNot: action.payload

			}
		case PROFILEPICUPLOAD:
			return {
				...state,
				profileUpload: action.payload
			}
		case GETSUBJECTBATCHLIST:
			return {
				...state,
				getSubBatchList: action.payload
			}
		case BATCHAUTOCREATION:
			return {
				...state,
				batchAutoCreate: action.payload
			}
		case GETSTUDENTSTATUS:
			return {
				...state,
				studentTableStatus: action.payload
			}
		case SAVEASSISTANTPROFESSOR:
			return {
				...state,
				saveAssistantProf: action.payload
			}
		case GETATEENDANCEDETAILS:
			return {
				...state,
				adminAttendancedetail: action.payload
			}
		case GETATEENDANCELISTMODEL:
			return {
				...state,
				modelAttendanceList: action.payload
			}
		case MARK_ATTENDANCE: {
			return {
				...state,
				attendanceMark: action.payload
			}
		}
		case GET_PROFATTENDANCEBATCHESDATA:
			return {
				...state,
				profAttendanceBatchesData: action.payload

			}
		case GET_PROFATTENDANCEBATCHES:
			return {
				...state,
				profAttendancebatches: action.payload
			}
		case GET_ATTENDANCELISTONDATE:
			return {
				...state,
				attendanceListonDate: action.payload
			}
		case UPDATE_ATTENDANCELIST:
			return {
				...state,
				updateStudentAttendancelist: action.payload
			}
		case GETSTUDENTATTENDANCEREPORT:
			return {
				...state,
				getStudentAttendanceReport: action.payload
			}
		case DOWNLOADSTUDENTATTENDANCEREPORT:
			return {
				...state,
				studentAttendaceReport: action.payload
			}
		case SEARCHTATTENDANCESTUDENT:
			return {
				...state,
				studentAttendanceSearch: action.payload
			}
		case GETATTENDANCEDASHBOARDSTUDENTLIST:
			return {
				...state,
				adminStudentDefaulterList: action.payload
			}
		case GET_ADMINATTENDANCEBATCHES:
			return {
				...state,
				adminAttendanceBatchesList: action.payload
			}
		case GET_ADMINATTENDANCEPROFESSORLIST:
			return {
				...state,
				adminAttendanceProflist: action.payload
			}
		case GET_ADMINATTENDANCEGRAPHDATA:
			return {
				...state,
				adminAttendanceGraphdata: action.payload
			}

		case ISPROFESSORADMIN:
			return {
				...state,
				professorAdmin: action.payload
			}

		case GET_STUDENTDETAILS:
			return {
				...state,
				studentDetailsForReport: action.payload
			}

		case GET_STUDENTBATCHWISEATTENDANCEREPORT:
			return {
				...state,
				studentBatchWiseAttendanceReport: action.payload
			}

		case GET_PROFESSOREMAILCHECK:
			return {
				...state,
				professorEmailCheck: action.paylaod
			}

		case GET_STUDENTEMAILCHECK:
			return {
				...state,
				studentEmailCheck: action.paylaod
			}
		case CLASSMANAGERFLOW:
			return {
				...state,
				classManagerFlow: action.payload
			}

		default:
			return state
	}
}