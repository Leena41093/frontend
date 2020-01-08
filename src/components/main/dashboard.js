import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import ProfessorDashboard  from '../professor/professorDashboard';
import StudentDashboard from '../student/studentDashboard';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      professorDetail:[],
    }
  }

 
  
  
  renderStudentDashboard() {
    if (this.props.userType === "STUDENT") {
      return (
        <StudentDashboard {...this.props}/>
      )
    }
    else{
      return (
        <ProfessorDashboard {...this.props}/>
        // <StudentDashboard {...this.props}/>
      )
    }
    // return (
    //   <StudentDashboard {...this.props}/>
    // )
  }

  // renderAdminDashboard(){
  //   if (this.props.userType === "Student") {
  //     return (
  //       <ProfessorDashboard {...this.props}/>
  //     )
  //   }
  // }

  // renderProfessorDashboard(){
  //   if (this.props.userType === "Student") {
  //     return (
  //       <ProfessorDashboard {...this.props}/>
  //     )
  //   }
  // }

  render() {
    return (
      <div>
        {this.renderStudentDashboard()}
        {/* {this.renderAdminDashboard()}
        {this.renderProfessorDashboard()} */}
      </div>
    )
  }
}

const mapStateToProps = ({ auth ,professor,app}) => ({
  userType: auth.userType,
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
