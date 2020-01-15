import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import ProfessorDashboard  from '../professor/professorDashboard';

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      professorDetail:[],
    }
  }

  
  renderStudentDashboard() {
      return (
        <ProfessorDashboard {...this.props}/>
      )
  }

 
  render() {
    return (
      <div>
        {this.renderStudentDashboard()}
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
