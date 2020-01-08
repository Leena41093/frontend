import { combineReducers } from 'redux'
import app from './appReducer';
import professor from './professorReducer';
import auth from './authReducer';
import student from './studentReducer';
import professorDrive from './professorDriveReducer';
import studentDrive from './studentDriveReducer';
import sidebar from './sidebarReducer';
import finance from './financeReducer';

export default combineReducers({
  app,
  professor,
  auth,
  student,
  professorDrive,
  studentDrive,
  sidebar,
  finance
})
