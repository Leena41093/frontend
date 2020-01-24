import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createEmployeeDetail } from '../../actions/inventoryAdminAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';


class FacultyDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Employee: {
        employeeDetail: {
          "username": "",
          "user_type": "",
          "password": "",
          "token": "",
          "emp_name": "",
          "email": "",
          "designation": "",
          "address": "",
          "role": "",
          "DOB": moment(),
        }
      },
      isError: {
        "username": false,
        "password": false,
        "emp_name": false,
        "email": false,
        "address": false,
      },
      role: ["CEO", "Manager", "Employee", "HR"],
      user_type: ["ADMIN", "EMPLOYEE"],
      designation: ["SoftwareDeveloper", "HR", "Senior softwareDeveloper", "Traine Engineer", "Tester"],      
      editable: true,
      pro: {}      
    }
  }

  onPersonalDetailChange(propertyName, event) {
    let { Employee, isError } = this.state;
    isError = { ...isError, [propertyName]: false }
    Employee.employeeDetail = { ...Employee.employeeDetail, [propertyName]: event.target.value }
    this.setState({ isError, Employee })
  }

  handleChangeDesignation(value, propertyName) {
    let { Employee } = this.state;
    Employee.employeeDetail = { ...Employee.employeeDetail, [propertyName]: value }
    this.setState({ Employee })
  }

  onSaveEmployee() {
    let { Employee } = this.state;
    let data ={
      company_id:this.props.company_id,
      branch_id:this.props.branch_id,
      payload:Employee.employeeDetail
    }    
    this.props.createEmployeeDetail(data).then(()=>{
      let res = this.props.createEmp;
      this.props.history.push('/app/employee-directory')
    })
  }

  backButton() {
    this.props.history.push('/app/employee-directory')
  }

  handleChange(date) {
    let { Employee } = this.state;
    Employee.employeeDetail = { ...Employee.employeeDetail, DOB: moment(date).format("YYYY-MM-DD") };
    this.setState({ Employee });
  }

  renderPersonalDetails() {
    let { Employee, isError } = this.state;
    if (this.state.editable) {
      return (
        <div className="clearfix">
          <div className="c-card__form" style={{ overflow: "auto", height: "355px" }} >
            <div >
              <div className="divider-container" >
                <div className="divider-block text--left">
                  <div className="form-group cust-fld">
                    <label>User Name<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Employee.employeeDetail.username} onChange={this.onPersonalDetailChange.bind(this, "username")} placeholder="Please Enter First Name" />
                    {isError.username ? <label className="help-block" style={{ color: "red" }}>Please enter valid username </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Password<sup style={{ color: "red" }}>*</sup></label>
                    <input type="password" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Employee.employeeDetail.lastname} onChange={this.onPersonalDetailChange.bind(this, "password")} placeholder="Please Enter Password" />
                    {isError.password ? <label className="help-block" style={{ color: "red" }}>Please enter valid password </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Employee Name<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Employee.employeeDetail.lastname} onChange={this.onPersonalDetailChange.bind(this, "emp_name")} placeholder="Please Enter emp_name" />
                    {isError.emp_name ? <label className="help-block" style={{ color: "red" }}>Please enter valid empname </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Email<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Employee.employeeDetail.email} onChange={this.onPersonalDetailChange.bind(this, "email")} placeholder="Please Enter email" />
                    {isError.email ? <label className="help-block" style={{ color: "red" }}>Please enter valid email </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Mobile<sup style={{ color: "red" }}>*</sup></label>
                    <input type="number" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Employee.employeeDetail.mobile} onChange={this.onPersonalDetailChange.bind(this, "mobile")} placeholder="Please Enter mobile" />
                    {isError.mobile ? <label className="help-block" style={{ color: "red" }}>Please enter valid mobile </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Address<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Employee.employeeDetail.address} onChange={this.onPersonalDetailChange.bind(this, "address")} placeholder="Please Enter address" />
                    {isError.address ? <label className="help-block" style={{ color: "red" }}>Please enter address </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>UserType</label>
                    <div class="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {Employee.employeeDetail.user_type}
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dLabel">
                        {this.renderusertype()}
                      </ul>
                    </div>
                  </div>
                  <div className="form-group cust-fld">
                    <label>Role</label>
                    <div class="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {Employee.employeeDetail.role}
                      </button>
                      <ul class="dropdown-menu" aria-labelledby="dLabel">
                        {this.renderRole()}
                      </ul>
                    </div>
                  </div>
                  <div className="form-group cust-fld">
                    <label>Date of Birth</label>
                    <DatePicker className="form-control fld--date" selected={Employee.employeeDetail.DOB ? moment(Employee.employeeDetail.DOB) : moment()} onChange={this.handleChange.bind(this)} />
                  </div>

                  <div className="form-group cust-fld">
                    <label>Designation</label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {Employee.employeeDetail.designation}
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dLabel">
                        {this.renderDesignation()}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

  }

  renderDesignation() {
    let { designation } = this.state;
    return designation.map((value, index) => {
      return (
        <li key={"designation" + index}><a onClick={this.handleChangeDesignation.bind(this, value, "designation")} href="javascript:void(0);" class="dd-option">{value}</a></li>
      )
    })
  }


  renderRole() {
    let { role } = this.state;
    return role.map((value, index) => {
      return (
        <li key={"role" + index}><a onClick={this.handleChangeDesignation.bind(this, value, "role")} href="javascript:void(0);" class="dd-option">{value}</a></li>
      )
    })
  }

  renderusertype() {
    let { user_type } = this.state;
    return user_type.map((value, index) => {
      return (
        <li key={"user_type" + index}><a onClick={this.handleChangeDesignation.bind(this, value, "user_type")} href="javascript:void(0);" class="dd-option">{value}</a></li>
      )
    })
  }

  render() {
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a onClick={this.backButton.bind(this)} >Back to Staff Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg nomargin">Employee Details</span>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="divider-container">
            <div class="divider-block text--right">
              <button class="c-btn grayshade" onClick={this.backButton.bind(this)}>Back</button>
            </div>
          </div>
        </div>
        <div className="c-container__data">
          <div className="card-container">
            <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  PERSONAL DETAILS
                </span>
              </div>
              {this.renderPersonalDetails()}
              <div className="c-card__btnCont">
                <div className="c-actiontd st-alert"><button style={{ color: "white" }} className="c-btn-large primary btn" onClick={this.onSaveEmployee.bind(this)} >&nbsp;&nbsp;ADD EMPLOYEE</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({  auth, inventoryAdmin }) => ({
  createEmp: inventoryAdmin.createEmp,
  company_id:auth.companyId,
  branch_id:auth.AdminbranchId
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createEmployeeDetail
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(FacultyDetail)
