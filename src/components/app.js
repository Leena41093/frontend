import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Login from '../components/auth/login';
import Header from '../components/common/header';
import Sidebar from '../components/common/sidebar';
// import FreshChat from '../components/common/freshchat';
// import ClassManager from '../components/administration/classManager';
// import BatchDetails from '../components/administration/batchDetails';
// import StudentDirectory from '../components/administration/studentDirectory';
// import StudentDetails from '../components/administration/studentDetails';
// import FacultyDirectory from '../components/administration/facultyMgrDirectory';
// import FacultyDetail from '../components/administration/facultyDetail';
// import EnquiryDetails from '../components/administration/enquiryDetails';
// import addNewFaculty from '../components/administration/addNewFaculty';
// import addNewStudent from '../components/administration//addNewStudent';
import HomeworkDirectory from '../components/professor/homeworkDirectory';
import NewHomeworkDetails from '../components/professor/newHomeworkDetails';
import HomeworkDetails from '../components/professor/homeworkDetails';
//import ProfessorDashboard  from '../components/professor/professorDashboard';
import ProfessorBatchDashboard from '../components/professor/professorBatchDashboard';
import HomeWorkChecking from '../components/professor/homeworkChecking';
import QuizDirectory from '../components/professor/quizDirectory';
import AssignNewQuiz from '../components/professor/assignNewQuiz';
import QuizDetail from '../components/professor/quizDetails';
import ProfessorQuizUploadPdf from '../components/professor/professorQuizUploadPdf';
import ProfessorQuizTypeQuestion from '../components/professor/professorQuizTypeQuestion';
import NotesDirectory from '../components/professor/notesDirectory';
import CreateNotesDetails from '../components/professor/createNotesDetails';
import NotesDetail from '../components/professor/notesDetail';
import EditHomework from '../components/professor/editHomework';
//import StudentDashboard from '../components/student/studentDashboard';
import Dashboard from '../components/main/dashboard';
//import EditQuizPdfUpload from '../components/professor/editQuizPdfUpload';
import editQuizPdfUpload from '../components/professor/editQuizPdfUpload';
// import StudentHomeworkDirectory from '../components/student/studentHomeworkDirectory';
// import StudentDashboardBatchDetail from '../components/student/studentDashboardBatchDetail'
// import StudentHomeworkDeatils from '../components/student/studentHomeworkDetails';
// import StudentNotesDirectory from '../components/student/studentNotesDirectory';
// import StudentNotesDetail from '../components/student/studentNotesDetail';
// import StudentQuizDirectory from '../components/student/studentQuizDirectory';
// import StudentQuizDetail from '../components/student/studentQuizDetail';
// import StudentExamQuestionTypeQuiz from '../components/student/studentExamQuestionTypeQuiz';
// import StudentExamPdfTypeQuiz from '../components/student/studentExamPdfTypeQuiz';
// import StudentQuizQuestionTypeResult from '../components/student/studentQuizQuestionTypeResult';
// import StudentQuizPdfTypeResult from '../components/student/studentQuizPdfTypeResult';
import ProfessorDrive from '../components/drive/professorDrive/professorDrive';
// import StudentDrive from '../components/drive/studentDrive/studentDrive';
import ProfessorTimeTable from '../components/professor/professorTimeTable';
// import StudentTimeTable from '../components/student/studentTimeTable';
import EditQuizQuestionAnswer from '../components/professor/editQuizQuestionAnswer';
import GetProfile from '../components/professor/getProfile';
import GetStudentProfile from '../components/student/getStudentProfile';
import ProfessorQuizQuestiontypeResult from '../components/professor/professorQuizQuestiontypeResult';
import ProfessorPdfTypeResult from '../components/professor/professorPdfTypeResult';
import StudentPastYear from '../components/student/studentPastYear';
import ProfessorPastYear from '../components/professor/professorPastYear';
import Finance from '../components/administration/finance';
import FinanceDetail from '../components/administration/financeDetail';
import AdminGetProfile from '../components/administration/adminGetProfile';
import ChangePassword from '../components/administration/changePassword';
import PrivacyPolicy from './administration/privacy-policy';
import TermsOfUse from './administration/termsOfUse';
import Reports from './administration/reports';
import assignHomework from '../components/professor/assignHomework';
import AssignNotes from '../components/professor/assignNotes'
import ProfessorAttendanceDetails from '../components/professor/professorAttendanceDetails';
import AttendanceDirectory from '../components/administration/attendanceDirectory';
// import StudentAttendanceDetails from '../components/student/studentAttendanceDetails';
// import StudentReports from '../components/student/studentReport';
import PdfView from '../components/professor/pdfView';
// import FinanceDashboard from '../components/finance/financeDashboard/financeDashboard';
// import CreateNewInvoice from '../components/finance/financeDashboard/createNewInvoice';
// import AllStudentsFinanceDirectory from '../components/finance/financeDashboard/allStudentsFinanceDirectory';
// import StudentFinanceDetail from '../components/finance/financeDashboard/studentFinanceDetail'
// import FinanceFeeStructureSelection from '../components/finance/createFinance/financeFeeStructureSelection';
// import CreateFinanceFee from '../components/finance/createFinance/createFinanceFee';
// import FinanceInforamtion from '../components/finance/createFinance/financeInformation';
// import PaymentMethodConfiguration from '../components/finance/createFinance/paymentMethodConfiguration';
// import UnpaidInvoiceReciept from '../components/finance/financeDashboard/unpaidInvoiceReciept';
// import PaidInvoiceReciept from '../components/finance/financeDashboard/paidInvoiceReciept';

// import StudentFinanceDashboard from '../components/finance/financeDashboard/studentFinanceDashboard'
export const App = ({ match, history }) => {
  let localData = localStorage.getItem("persist:root");
  if (JSON.parse(localData) && JSON.parse(localData).auth && JSON.parse(JSON.parse(localData).auth) && JSON.parse(JSON.parse(localData).auth).token != null) {
    return (
      <div>
        <Header history={history} />
        <div className="c-body">
          <Sidebar history={history} />
          {/* <FreshChat /> */}
          {/* <ToastContainer /> */}

        <Route exact path={match.url} component={Dashboard}/>  
        {/* <Route path={`${match.url}/class-manager`} component={ClassManager}/> */}
        {/* <Route path={`${match.url}/batch-details`} component={BatchDetails}/> */}
        {/* <Route path={`${match.url}/student-directory`} component={StudentDirectory}/> */}
        {/* <Route path={`${match.url}/student-detail`} component={StudentDetails} />
        <Route path={`${match.url}/faculty-directory`} component={FacultyDirectory} />
        <Route path={`${match.url}/faculty-detail`} component={FacultyDetail} />
        <Route path={`${match.url}/enquiry-detail`} component={EnquiryDetails} /> */}
        {/* <Route path={`${match.url}/new-faculty`} component={addNewFaculty} />
        <Route path={`${match.url}/new-student`} component={addNewStudent} /> */}
        <Route path={`${match.url}/homework-directory`} component={HomeworkDirectory} />
        <Route path={`${match.url}/newhomework-detail`} component={NewHomeworkDetails } />
        <Route path={`${match.url}/homework-detail`} component={HomeworkDetails } />
        {/* <Route path={`${match.url}/professor-dashboard`} component={ProfessorDashboard } /> */}
        <Route path={`${match.url}/professor-batchDetaildashboard`} component={ProfessorBatchDashboard } />
        <Route path={`${match.url}/homework-checking`} component={HomeWorkChecking} />
        <Route path={`${match.url}/quiz-directory`} component={QuizDirectory} />
        <Route path={`${match.url}/assign-newquiz`} component={AssignNewQuiz} />
        <Route path={`${match.url}/quiz-detail`} component={QuizDetail} />
        <Route path={`${match.url}/professor-quizuploadpdf`} component={ProfessorQuizUploadPdf} />
        <Route path={`${match.url}/professor-quiztypequestion`} component={ProfessorQuizTypeQuestion} />
        <Route path={`${match.url}/notes-directory`} component={NotesDirectory} />
        <Route path={`${match.url}/create-notes`} component={CreateNotesDetails} />
        <Route path={`${match.url}/notes-detail`} component={NotesDetail} />
        <Route path={`${match.url}/edit-homeworkDetail`} component={EditHomework} />
        {/* <Route path={`${match.url}/student-dashboard`} component={StudentDashboard} /> */}
        <Route path={`${match.url}/dashboard`} component={Dashboard} />
        {/* <Route path={`${match.url}/studenthomework-directory`} component={StudentHomeworkDirectory} />
        <Route path={`${match.url}/edit-uploadtypequiz`} component={editQuizPdfUpload} />
        <Route path={`${match.url}/batchdetail-dashboard`} component={StudentDashboardBatchDetail} />
        <Route path={`${match.url}/studenthomework-details`} component={StudentHomeworkDeatils} />
        <Route path={`${match.url}/studentnotes-directory`} component={StudentNotesDirectory} />
        <Route path={`${match.url}/studentnotes-details`} component={StudentNotesDetail} />
        <Route path={`${match.url}/studentquiz-directory`} component={StudentQuizDirectory } />
        <Route path={`${match.url}/studentquiz-details`} component={ StudentQuizDetail } />
        <Route path={`${match.url}/studentexam_questiontype`} component={ StudentExamQuestionTypeQuiz } />
        <Route path={`${match.url}/studentexam_pdftype`} component={ StudentExamPdfTypeQuiz } />
        <Route path={`${match.url}/studentresult_questiontype`} component={ StudentQuizQuestionTypeResult } />
        <Route path={`${match.url}/studentresult_pdftype`} component={ StudentQuizPdfTypeResult } />  */}
        <Route path={`${match.url}/professor-drive`} component={ ProfessorDrive } /> 
        {/* <Route path={`${match.url}/student-drive`} component={ StudentDrive } />  */}
        <Route path={`${match.url}/professor-timetable`} component={ ProfessorTimeTable } />
        {/* <Route path={`${match.url}/student-timetable`} component={ StudentTimeTable } /> */}
        <Route path={`${match.url}/edit-quizquestionanswer`} component={EditQuizQuestionAnswer} /> 
        <Route path={`${match.url}/get-professorProfile`} component={GetProfile} /> 
        {/* <Route path={`${match.url}/get-studentProfile`} component={GetStudentProfile} /> */}
        <Route path={`${match.url}/professor-questiontyperesult`} component={ProfessorQuizQuestiontypeResult} /> 
        <Route path={`${match.url}/professor-uploadTypepdf`} component={ProfessorPdfTypeResult} />
        {/* <Route path={`${match.url}/student-pastyear`} component={StudentPastYear} /> */}
        <Route path={`${match.url}/professor-pastyear`} component={ProfessorPastYear} />
        {/* <Route path={`${match.url}/administration-finance`} component={Finance} /> */}
        {/* <Route path={`${match.url}/admin-getprofile`} component={AdminGetProfile} />
        <Route path={`${match.url}/finance-detail`} component={FinanceDetail} />
        <Route path={`${match.url}/change-password`} component={ChangePassword} /> */}
        {/* <Route path={`${match.url}/privacy-policy`} component={PrivacyPolicy} />
        <Route path={`${match.url}/terms-of-use`} component={TermsOfUse} />
        <Route path={`${match.url}/report`} component={Reports} /> */}
        <Route path={`${match.url}/assign-homework`} component={assignHomework} />
        <Route path={`${match.url}/assign-notes`} component={AssignNotes} />
        <Route path={`${match.url}/attendancebatchesdetails`} component={ProfessorAttendanceDetails} />
        {/* <Route path={`${match.url}/attendance-directory`} component={AttendanceDirectory} /> */}
        {/* <Route path={`${match.url}/student-attendance`} component={StudentAttendanceDetails} />
        <Route path={`${match.url}/student-report`} component={StudentReports} />  */}
        <Route path={`${match.url}/pdf-view`} component={PdfView} />  
        {/* <Route path={`${match.url}/finance-dashboard`} component={FinanceDashboard} />
        <Route path={`${match.url}/create-new-invoices`} component={CreateNewInvoice} /> */}
        {/* <Route path={`${match.url}/all-student-finance-directory`} component={AllStudentsFinanceDirectory} /> */}
        {/* <Route path={`${match.url}/student-finance-detail`} component={StudentFinanceDetail} /> */}
        {/* <Route path={`${match.url}/finance-feestructureselection`} component={FinanceFeeStructureSelection} /> */}
        {/* <Route path={`${match.url}/create-financefee`} component={CreateFinanceFee} /> */}
        {/* <Route path={`${match.url}/finance-information`} component={FinanceInforamtion} /> */}
        {/* <Route path={`${match.url}/finance-paymentmethodconfig`} component={PaymentMethodConfiguration} />        */}
        {/* <Route path={`${match.url}/finance-unpaidinvoicereciept`} component={UnpaidInvoiceReciept} />
        <Route path={`${match.url}/finance-paidinvoicereciept`} component={PaidInvoiceReciept} /> */}
        {/* <Route path={`${match.url}/student-finance-dashboard`} component={StudentFinanceDashboard} /> */}
        
        </div>
      </div>
    )
  }
  else {
    return (
      <Redirect to='/' />
    )
  }
};