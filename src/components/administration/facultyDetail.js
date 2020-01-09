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
      instituteId: 0
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
    if (pro.isProfessorAdmin) {
      this.setState({ professor: true, admin: true });
    } else {
      if (pro.designation == "Professor") {
        this.setState({ professor: true, admin: false });
      } if (pro.designation == "INSTITUTE") {
        this.setState({ professor: false, admin: true });
      }
    }
    if (pro.state == true) {
      this.setState({ isNewProfessor: true })
    } else {
      if (pro.professor_id != undefined) {
        this.setState({ professor_id: pro.professor_id })
      }
      let data = {
        'institude_id': this.props.instituteId,
        'branch_id': this.props.branchId,
        'professor_id': pro.professor_id,
        token: this.props.token,
      }
      this.props.getProfessorDetail(data).then(() => {
        let res = this.props.professorDetail;
        if (res && res.status == 200) {
          if (res.data.response && res.data.response.activity) {
            this.setState({
              Professor: res.data.response,
              homeworkCount: res.data.response.activity.homeworkCount,
              quizCount: res.data.response.activity.quizCount,
              pro
            });
          }

        }
      });
    }
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

  onPersonalDetailChange(propertyName, event) {
    if (propertyName == "firstName") {
      this.setState({ isFirstNameVisible: false })
    }
    if (propertyName == "mobile") {
      this.setState({ isPhoneNumberVisible: false })
    }
    if (propertyName == "email") {
      this.setState({ isEmailVisible: false })
    }
    if (propertyName == "college") {
      this.setState({ isCollegeVisible: false })
    }
    if (propertyName == "DOB") {
      this.setState({ isDOBVisible: false })
    }
    if (propertyName == "emergency_contact_name") {
      this.setState({ isECNVisible: false })
    }
    if (propertyName == "emergency_contact") {
      this.setState({ isECVisible: false })
    }
    let Professor = this.state.Professor;
    let professorDetail = Professor.professorDetail;
    professorDetail = { ...professorDetail, [propertyName]: event.target.value };
    Professor = { ...Professor, professorDetail };
    this.setState({ Professor });
  }

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

  OnChangeEditable(event) {
    let editable = !this.state.editable
    this.setState({ editable });
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

  handleChange(date) {
    let Professor = this.state.Professor;
    let professorDetail = Professor.professorDetail;
    professorDetail = { ...professorDetail, DOB: date };
    Professor = { ...Professor, professorDetail };
    this.setState({ Professor });
  }

  onSelectProfessorRole() {
    let { professor } = this.state;
    professor = !professor
    if (professor) {
      this.setState({ isRoleSelected: false })
    }
    this.setState({ professor });
  }

  onSelectAdminRole() {
    let { admin } = this.state;
    admin = !admin
    if (admin) {
      this.setState({ isRoleSelected: false })
    }
    this.setState({ admin });
  }

  onChangeRole(payload) {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      payload: payload,
      token: this.props.token
    }
    this.props.updateUserRole(apiData).then(() => {
      let res = this.props.roleUpdate;
      if (res && res.status == 200) {
        this.props.history.push('/app/faculty-directory')
        infoToste("Changes Saved Successfully");
      } else if (res && res.status == 500) {
        infoToste("User Designation Not Update");
      }
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

  quizCountShow() {
    if (this.state.quizCount == 0) {
      return (
        <div>
          <label>Quizes</label>
          <span className="info-type st-disabled">Not Added Yet</span>
        </div>
      )
    } else {
      return (
        <div>
          <label>Quizes</label>
          <span className="info-type st-alert">{this.state.Professor.activity.quizCount}</span>
        </div>
      )
    }
  }

  homeworkCountShow() {
    if (this.state.homeworkCount == 0) {
      return (
        <div>
          <label>Homeworks</label>
          <span className="info-type st-disabled">Not Added Yet</span>
        </div>
      )
    } else {
      return (
        <div>
          <label>Homeworks</label>
          <span className="info-type st-alert">{this.state.Professor.activity.homeworkCount}</span>
        </div>
      )
    }
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
    if (this.state.editable) {
      return (
        <div className="c-card__form">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="form-group static-fld">
                <label>Name</label>
                <input type="text" className="form-control" value={this.state.Professor.professorDetail.firstname} onChange={this.onPersonalDetailChange.bind(this, "firstname")} placeholder="Full Name Goes Here" />
                {this.state.isFirstNameVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid name </label> : <br />}
              </div>
              <div className="form-group static-fld">
                <label>Phone</label>
                <input type="text" className="form-control" value={this.state.Professor.professorDetail.mobile} onChange={this.onPersonalDetailChange.bind(this, "mobile")} placeholder="Phone" />
                {this.state.isPhoneNumberVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid phone number</label> : <br />}
              </div>
            </div>
            <div className="divider-block text--left">
              <div className="c-user-pic">
                <span className="fld-title">Avatar</span>
                <div className="user--img"><img src={this.state.Professor.profilePicture ? this.state.Professor.profilePicture : "/images/avatars/Avatar_default.jpg"} alt="Avatar" /></div>
                <button className="link--btn">Change Avatar</button>
              </div>
            </div>
          </div>

          <div className="form-group static-fld">
            <label>Email</label>
            <input type="email" className="form-control" value={this.state.Professor.professorDetail.email} onChange={this.onPersonalDetailChange.bind(this, "email")} placeholder="Email" />
            {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }}>Please enter email</label> : <br />}
          </div>
          <div className="form-group static-fld">
            <label>College</label>
            <input type="text" className="form-control" value={this.state.Professor.professorDetail.college} onChange={this.onPersonalDetailChange.bind(this, "college")} placeholder="College" />
            {this.state.isCollegeVisible ? <label className="help-block" style={{ color: "red" }}>Please enter college name</label> : <br />}
          </div>
          <div className="form-group static-fld">
            <label>Date of Birth</label>
            <DatePicker className="form-control" selected={this.state.Professor.professorDetail.DOB ? moment(this.state.Professor.professorDetail.DOB) : moment()} onChange={this.handleChange.bind(this)} />
            {this.state.isDOBVisible ? <label className="help-block" style={{ color: "red" }}>Please enter DOB</label> : <br />}
          </div>
          <div className="form-group static-fld">
            <label>Emergency Contact Name</label>
            <input type="text" className="form-control" value={this.state.Professor.professorDetail.emergency_contact_name} onChange={this.onPersonalDetailChange.bind(this, "emergency_contact_name")} placeholder="Emergency Contact Name" />
            {this.state.isECNVisible ? <label className="help-block" style={{ color: "red" }}>Please enter emergency contact name</label> : <br />}
          </div>
          <div className="form-group static-fld">
            <label>Emergency Contact</label>
            <input type="text" className="form-control" value={this.state.Professor.professorDetail.emergency_contact} onChange={this.onPersonalDetailChange.bind(this, "emergency_contact")} placeholder="Emergency Contact" />
            {this.state.isECVisible ? <label className="help-block" style={{ color: "red" }}>Please enter emergency contact</label> : <br />}
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="c-card__form">
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group static-fld">
                  <label>Name</label>
                  <span className="info-type">{this.state.Professor.professorDetail ? this.state.Professor.professorDetail.firstname + " " + this.state.Professor.professorDetail.lastname : "Not Added Yet"}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Phone</label>
                  <span className="info-type">{this.state.Professor.professorDetail ? this.state.Professor.professorDetail.mobile : "Not Added Yet"}</span>

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
              <span className="info-type">{this.state.Professor.professorDetail ? (this.state.Professor.professorDetail.email != "") ? this.state.Professor.professorDetail.email : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>College</label>
              <span className="info-type">{this.state.Professor.professorDetail ? (this.state.Professor.professorDetail.college != "") ? this.state.Professor.professorDetail.college : "Not Added Yet." : "Not Added Yet."}</span>

            </div>
            <div className="form-group static-fld">
              <label>Date of Birth</label>
              <span className="info-type">{this.state.Professor.professorDetail ? moment(this.state.Professor.professorDetail.DOB).format("DD-MM-YYYY") : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>Emergency Contact Name</label>
              <span className="info-type">{this.state.Professor.professorDetail ? (this.state.Professor.professorDetail.emergency_contact_name != "") ? this.state.Professor.professorDetail.emergency_contact_name : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>Emergency Contact</label>
              <span className="info-type">{this.state.Professor.professorDetail ? (this.state.Professor.professorDetail.emergency_contact != "") ? this.state.Professor.professorDetail.emergency_contact : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
          </div>
          <div className="c-card__btnCont">
            {/* <button style={{ marginTop: '57px', height: '40px' }} className="c-btn primary btn-custom" onClick={this.OnChangeEditable.bind(this)}>
              Edit Personal Details</button> */}
          </div>
        </div>
      )
    }
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
                  Batches
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
        {/* <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} /> */}
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
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
  ProfessorAdmin: app.professorAdmin
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
      getIsProfessorAdmin
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(FacultyDetail)
