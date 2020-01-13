import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddStudentBatchModel } from '../common/addStudentBatchModal';
import { getProfessorDetail } from '../../actions/index';
import {
  getClasses, getSubjects, getBatches, addProfessorBatches,
  updateProfessorDetails, deleteProfessorBatch, updateUserRole, deleteStudentProfessor,
  getIsProfessorAdmin
} from '../../actions/index';

import { getProfilePic } from '../../actions/index';
import { getEmployeeDetail,getAccessories,getProjectes } from '../../actions/inventoryAdminAction';
import $ from "jquery";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { validateFormField } from '../../helpers/validate';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { Scrollbars } from 'react-custom-scrollbars';
import { DeleteModal } from '../common/deleteModal';

class FacultyDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Employee: {
        employeeDetail: {},
      },
      Professor: {
        professorDetail: {},
        batchDetails: [],
      },
      professor_id: 4,
      homeworkCount: 0,
      quizCount: 0,
      activity: { homeworkDone: null, quizDone: null, totalQuiz: null, totalHomework: null },
      editable: false,
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isFirstNameVisible: false,
      isPhoneNumberVisible: false,
      isEmailVisible: false,
      isCollegeVisible: false,
      isDOBVisible: false,
      isECNVisible: false,
      isECVisible: false,
      isNewProfessor: false,
      isRoleSelected: false,
      startDate: moment(),
      professor: false,
      admin: false,
      pro: {},
      deleteObj: null,
      branchId: 0,
      id: 0,
      userProfileUrl: "",
      instituteId: 0,
      emp_id:null,
    }
  }

  componentWillReceiveProps(nextProps) {
    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {

      if (this.state.instituteId != nextProps.instituteId) {
        this.setState({ instituteId: nextProps.instituteId }, () => {
          var datas = {
            institudeId: this.props.instituteId,
            branchId: this.props.branchId,
            token: this.props.token,
          }
          this.props.getIsProfessorAdmin(datas).then(() => {
            let res = this.props.ProfessorAdmin;
            if (res && res.data.status == 200 && res.data.response.isProfessorAdmin == false) {
              this.props.history.push("/app/dashboard");
            }
            else {
              var pro = this.props ? this.props.location.state.branchId : ""
              if (pro != nextProps.branchId) {
                this.setState({ branchId: nextProps.branchId }, () => {
                  this.props.history.push('/app/faculty-directory')
                });
              }
            }
          })
        })
      }
    }
  }

  componentWillMount() {

    var pro = this.props ? this.props.location.state.data : ""
    console.log("data",pro);
      if (pro.emp_id != undefined) {
        this.setState({ emp_id: pro.emp_id })
      }
      let apiData = {
        company_id: this.props.company_id,
        branch_id: this.props.branch_id,
        payload: {
          "emp_id":pro.emp_id
        }
      }
      let { Employee } = this.state;

      this.props.getEmployeeDetail(apiData).then(() => {
        console.log("res", this.props.employeeDetail);
        let res = this.props.employeeDetail;
        if (res && res.status == 200) {
          Employee = { ...Employee, employeeDetail: res.data.response.empployeeDetails }
          this.setState({ Employee })
        }
      })
    
  }

  componentDidMount() {
    this.setState({ insituteId: this.props.instituteId })
  }
  validate() {
    let professorDetail = this.state.Professor.professorDetail;
    var isValidForm = true;

    if (!this.state.professor && !this.state.admin) {
      this.setState({ isRoleSelected: true });
      isValidForm = false
    }
    return isValidForm;
  }

  // onPersonalDetailChange(propertyName, event) {
  //   if (propertyName == "firstName") {
  //     this.setState({ isFirstNameVisible: false })
  //   }
  //   if (propertyName == "mobile") {
  //     this.setState({ isPhoneNumberVisible: false })
  //   }
  //   if (propertyName == "email") {
  //     this.setState({ isEmailVisible: false })
  //   }
  //   if (propertyName == "college") {
  //     this.setState({ isCollegeVisible: false })
  //   }
  //   if (propertyName == "DOB") {
  //     this.setState({ isDOBVisible: false })
  //   }
  //   if (propertyName == "emergency_contact_name") {
  //     this.setState({ isECNVisible: false })
  //   }
  //   if (propertyName == "emergency_contact") {
  //     this.setState({ isECVisible: false })
  //   }
  //   let Professor = this.state.Professor;
  //   let professorDetail = Professor.professorDetail;
  //   professorDetail = { ...professorDetail, [propertyName]: event.target.value };
  //   Professor = { ...Professor, professorDetail };
  //   this.setState({ Professor });
  // }

  onSaveChanges(event) {
    let { pro } = this.state;
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      if (this.state.editable) {

        successToste("Changes Saved Successfully");
        let { editable } = !this.state.editable;
        this.setState({ editable })
        let payload = {
          "professor_id": pro.professor_id,
          "admin_flag": this.state.admin,
          "professor_flag": this.state.professor,
        }
        this.onChangeRole(payload);

        // })
      } else {
        let payload = {
          "professor_id": pro.professor_id,
          "admin_flag": this.state.admin,
          "professor_flag": this.state.professor,
        }
        this.onChangeRole(payload);
      }
    }
  }

  backButton(event) {
    this.props.history.push('/app/faculty-directory')
  }

  onProfessorBatchAdd(payload) {
    let data1 = {
      batch_professor: payload
    }
    let data = {
      "payload": data1,
      'institude_id': this.props.instituteId,
      'branch_id': this.props.branchId,
      'professor_id': this.state.professor_id,
      token: this.props.token
    }
    this.props.addProfessorBatches(data).then(() => {
      successToste("Batch Added Successfully");
      let data = {
        'institude_id': this.props.instituteId,
        'branch_id': this.props.branchId,
        'professor_id': this.state.professor_id,
        token: this.props.token
      }
      this.props.getProfessorDetail(data).then(() => {
        let res = this.props.professorDetail;
        if (res && res.status == 200) {
          this.setState({ Professor: res.data.response });
        }
      });
    })
    $("#addBatch .close").click();
  }

  deleteBatches(batch_id) {
    var data = {
      'institude_id': this.props.instituteId,
      'branch_id': this.props.branchId,
      'professor_id': this.state.professor_id,
      'batch_id': batch_id,
      token: this.props.token
    }
    this.props.deleteProfessorBatch(data).then(() => {
      successToste("Batch Deleted Successfully")
      let data = {
        'institude_id': this.props.instituteId,
        'branch_id': this.props.branchId,
        'professor_id': this.state.professor_id,
        token: this.props.token
      }
      this.props.getProfessorDetail(data).then(() => {
        let res = this.props.professorDetail;
        if (res && res.status == 200) {
          this.setState({ Professor: res.data.response });
        }
      });
    })
  }

  onDeleteModel(key, id) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, id });
  }

  onDeleteEntry(flag) {
    let { obj, index, id } = this.state;

    if (flag == 'deleteProfessor') {
      this.onDeleteProfessor(id);
      $("#quizSubmit .close").click();
    }
    if (flag == 'deleteBatchProfessor') {

      this.deleteBatches(id);
      $("#quizSubmit .close").click();
    }
  }

  onDeleteProfessor(id) {
    let pro = this.props ? this.props.location.state.data : "";
    let payloadType;
    if (pro.designation == "Professor" || pro.designation == 'PROFESSOR') {
      payloadType = "Professor"
    }
    else if (pro.designation == "INSTITUTE" || pro.designation == "Institute") {
      payloadType = "Institute"
    }
    let data = {
      payload: {
        types: payloadType,
        id: id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.deleteStudentProfessor(data).then(() => {
      let res = this.props.studentProfessorDelete;
      if (res && res.status == 200) {
        this.props.history.push('/app/faculty-directory');
        successToste("Faculty Deleted Successfully")
      }
      else if (res && res.status == 500) {
        errorToste("Something Went Wrong");
      }
    })
  }

  renderBatchClass(index) {
    return this.state.Professor.batchDetails[index].timeTable.map((ClassDetail, idx) => {
      return (
        <li key={"classdetail" + idx} >
          <a href="javascript:void(0);">
            <span>{ClassDetail.subject_name}</span>
            <span>{this.state.day[ClassDetail.day]} {ClassDetail.start_time}{" to "}{ClassDetail.end_time}</span>
          </a>
        </li>
      )
    })
  }
  
  renderBatch() {
    return this.state.Professor.batchDetails.map((batch, index) => {

      if (batch.timeTable.length == 0) return false
      return (
        <div key={"batch" + index} className="c-batchList">

          <span className="c-batchList__title">{batch.className} <img src="/images/Arrow.png" alt="logo" style={{ height: "10px", width: "20px" }} /> {batch.batchName}
            <div className="card__elem__setting1">

              <button style={{ marginRight: "-220px", marginTop: "-7px" }} data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "deleteBatchProfessor", batch.timeTable[0].batch_id)} className="act-delete pull-right"></button>
            </div>

          </span>


          <div className="c-batchList__list">
            <ul>
              {this.renderBatchClass(index)}
            </ul>
          </div>
        </div>
      )
    })
  }

  renderPersonalDetails() {
    let { Employee } = this.state;
    
      return (
        <div>
          <div className="c-card__form">
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group static-fld">
                  <label>Name</label>
                  <span className="info-type">{Employee.employeeDetail ? Employee.employeeDetail.emp_name : "Not Added Yet"}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Address</label>
                  <span className="info-type">{Employee.employeeDetail ? Employee.employeeDetail.address : "Not Added Yet"}</span>

                </div>
              </div>
              <div className="divider-block text--left">
                <div className="c-user-pic">
                  <div className="user--img"><img src={this.state.Professor.profilePicture ? this.state.Professor.profilePicture : "/images/avatars/Avatar_default.jpg"} alt="Avatar" /></div>
                </div>
              </div>
            </div>

            <div className="form-group static-fld">
              <label>Email</label>
              <span className="info-type">{Employee.employeeDetail ? Employee.employeeDetail.email : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>Designation</label>
              <span className="info-type">{Employee.employeeDetail ? Employee.employeeDetail.designation : "Not Added Yet."}</span>

            </div>
            <div className="form-group static-fld">
              <label>Date of Birth</label>
              <span className="info-type">{Employee.employeeDetail ?  moment(Employee.employeeDetail.DOB).format("DD-MM-YYYY")  : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>Company Name</label>
              <span className="info-type">{this.state.Professor.professorDetail ? (this.state.Professor.professorDetail.emergency_contact_name != "") ? this.state.Professor.professorDetail.emergency_contact_name : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>Contact Number</label>
              <span className="info-type">{this.state.Professor.professorDetail ? (this.state.Professor.professorDetail.emergency_contact != "") ? this.state.Professor.professorDetail.emergency_contact : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
          </div>
          <div className="c-card__btnCont">
          </div>
        </div>
      )
  }

  renderBatchDetail() {
    if (this.state.Professor.batchDetails.length == 0) {
      return (
        <div style={{ height: "380px" }}>
          <div className="c-card__img">
            <img src="/images/card-img-3.png" alt="logo" />
          </div>
          <div className="c-card__info">No batches added yet.</div>
        </div>
      )
    } else {
      return (
        <div className="c-card__items">
          <Scrollbars >
            {this.renderBatch()}
          </Scrollbars >
        </div>
      )
    }
  }


  render() {
    var pro = this.props.location.state.data ? this.props.location.state.data : ""
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a className="linkbtn hover-pointer" onClick={this.backButton.bind(this)} >Back to Staff Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg nomargin">Staff Details</span>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              {/* <div className="form-group cust-fld">
                <label >Access Rights</label><br />
                {pro.designation != "INSTITUTE" ?
                  <label htmlFor="check-all" className="custome-field field-checkbox" style={{ marginRight: "10px", display: "inline-block" }}>
                    <input type="checkbox" name="check-one" id="check-Professor" value="checkone" onChange={this.onSelectProfessorRole.bind(this)} checked={this.state.professor} />
                    <i></i> <span>Professor</span>
                  </label>
                  : ""}
                <label style={{ display: "inline-block" }} htmlFor="check-Admin" className="custome-field field-checkbox">
                  <input type="checkbox" name="check-one" id="check-Admin" value="checkone" onChange={this.onSelectAdminRole.bind(this)} checked={this.state.admin} />
                  <i></i> <span>Admin</span>
                </label>
                {this.state.isRoleSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Designation</label> : <br />}
              </div> */}
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.backButton.bind(this)}>Back</button>
              <button className="c-btn prime" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "deleteProfessor", pro.professor_id)}>Delete</button>
              <button className="c-btn prime" onClick={this.onSaveChanges.bind(this)} >Save changes</button>
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
            </div>
            {pro.designation != 'INSTITUTE' ? <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Project And Accessories
                <span className="c-count filled">{this.state.Professor.batchDetails.length}</span>
                </span>
              </div>
              {this.renderBatchDetail()}
              <div className="c-card__btnCont">
                {pro.designation == "INSTITUTE" ? "" : <button className="c-btn-large primary" data-toggle="modal" data-target="#addBatch">+ Add Batches</button>}
              </div>
              <AddStudentBatchModel professorId={this.state.Professor.professorDetail.professor_id} onAddStudentBatch={(data) => { this.onProfessorBatchAdd(data) }} {...this.props} />
            </div> : ""}
            {/* {pro.designation != 'INSTITUTE' ? <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Activity
								</span>
              </div>
              <div className="c-card__items">
                <div className="c-card__form">
                  <div className="form-group static-fld">
                    {this.homeworkCountShow()}
                  </div>
                  <div className="form-group static-fld">
                    {this.quizCountShow()}
                  </div>
                </div>
              </div>
            </div> : ""} */}
          </div>
        </div>
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, inventoryAdmin }) => ({
  professorDetail: app.professorDetail,
  classes: app.classes,
  subjects: app.subjects,
  batches: app.batches,
  updateProfessorDetail: app.updateProfessorDetail,
  branchId: app.branchId,
  instituteId: app.institudeId,
  roleUpdate: app.roleUpdate,
  token: auth.token,
  isProfessorAdmin: auth.isProfessorAdmin,
  studentProfessorDelete: app.studentProfessorDelete,
  getProfilePicture: app.getProfilePicture,
  profilePictureUrl: app.profilePictureUrl,
  ProfessorAdmin: app.professorAdmin,
  employeeDetail: inventoryAdmin.employeeDetail,
  accessories:inventoryAdmin.accessories,
  projectes:inventoryAdmin.projectes,
  company_id:app.companyId,
  branch_id:app.AdminbranchId
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getClasses,
      getSubjects,
      getBatches,
      addProfessorBatches,
      updateProfessorDetails,
      deleteProfessorBatch,
      getProfessorDetail,
      updateUserRole,
      deleteStudentProfessor,
      getProfilePic,
      getIsProfessorAdmin,
      getEmployeeDetail,
      getAccessories,
      getProjectes 
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(FacultyDetail)
