import React from 'react';
import { Route, Redirect } from "react-router-dom";
import Header from '../components/common/header';
import Sidebar from '../components/common/sidebar';
import StudentDirectory from '../components/administration/studentDirectory';
import FacultyDirectory from '../components/administration/facultyMgrDirectory';
import FacultyDetail from '../components/administration/facultyDetail';
import addNewFaculty from '../components/administration/addNewFaculty';
import addNewStudent from '../components/administration//addNewStudent';
import Dashboard from '../components/main/dashboard';
import GetProfile from '../components/professor/getProfile';
import FinanceDashboard from '../components/finance/financeDashboard/financeDashboard';
import ProjectDirectory from '../components/professor/projectDirectory'
import ProjectDetails from '../components/professor/projectDetails'
import NewProjectDetail from '../components/professor/newproject'
import ComplaintsDirectory from '../components/professor/complaintsDirectory'

export const App = ({ match, history }) => {
  let localData = localStorage.getItem("persist:root");
  if (JSON.parse(localData) && JSON.parse(localData).auth && JSON.parse(JSON.parse(localData).auth) && JSON.parse(JSON.parse(localData).auth).inventoryToken != null) {
    return (
      <div>
        <Header history={history} />
        <div className="c-body">
          <Sidebar history={history} />
          <Route exact path={match.url} component={Dashboard} />
          <Route path={`${match.url}/faculty-directory`} component={FacultyDirectory} />
          <Route path={`${match.url}/faculty-detail`} component={FacultyDetail} />
          <Route path={`${match.url}/new-faculty`} component={addNewFaculty} />
          <Route path={`${match.url}/student-directory`} component={StudentDirectory} />
          
          <Route path={`${match.url}/new-student`} component={addNewStudent} />
          <Route path={`${match.url}/dashboard`} component={Dashboard} />
          <Route path={`${match.url}/get-professorProfile`} component={GetProfile} />
          <Route path={`${match.url}/finance-dashboard`} component={FinanceDashboard} />
          <Route path={`${match.url}/projects-directory`} component={ProjectDirectory} />
          <Route path={`${match.url}/project-detail`} component={ProjectDetails} />
          <Route path={`${match.url}/new-project`} component={NewProjectDetail} />
          <Route path={`${match.url}/complaints`} component={ComplaintsDirectory} />
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