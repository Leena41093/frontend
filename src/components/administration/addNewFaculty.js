import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddStudentBatchModel } from '../common/addStudentBatchModal';
import { getProfessorDetail } from '../../actions/index';
import { AddProfessor, addStudentProfessorRegistration, invitationSend, getIsProfessorAdmin } from '../../actions/index';
import {
  getClasses, getSubjects, getBatches, addProfessorBatches,
  updateProfessorDetails, deleteProfessorBatch, updateUserRole, deleteStudentProfessor
} from '../../actions/index';
import $ from "jquery";
import DatePicker from 'react-datepicker';
import moment from 'moment';
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
        professorDetail: {
          "types": "",
          "firstname": "",
          "gender": "",
          "lastname": "",
          "username": "",
          "email": "",
          "mobile": "",
          "address": "",
          "DOB": moment(),
          "emergency_contact_name": "",
          "emergency_contact": "",
          "college": "",
          "designation": "",
          "user_type": "",
          "role_type": "",
          "isProfessorAdmin": false
        },
        batchDetails: [],
      },
      professor_id: 4,
      homeworkCount: 0,
      quizCount: 0,
      activity: { homeworkDone: null, quizDone: null, totalQuiz: null, totalHomework: null },
      editable: true,
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
      isEmergencyContactVisible:false,
      startDate: moment(),
      professor: true,
      admin: false,
      pro: {},
      deleteObj: null,
      isLastNameVisible: false,
      invitationRes: false,
      disableAddBatchButton: true,
      isGenderSelected: false,
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps){
		
		let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){

    if(this.state.instituteId != nextProps.instituteId){
      this.setState({instituteId:nextProps.instituteId},()=>{
        var datas = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token,
        }
        this.props.getIsProfessorAdmin(datas).then(()=>{
         let res = this.props.ProfessorAdmin;
         if(res && res.data.status == 200 && res.data.response.isProfessorAdmin == false ){
         this.props.history.push("/app/dashboard");
         }
        })
      })
		}
		}
  }

  componentDidMount(){
    this.setState({instituteId:this.props.instituteId})
  }

  validate() {
    let professorDetail = this.state.Professor.professorDetail;
    var isValidForm = true;
    var regx = /^[a-zA-Z ]+$/;
    if (professorDetail.firstname.length == 0 || !professorDetail.firstname.match(regx)) {
      this.setState({ isFirstNameVisible: true });
      isValidForm = false
    }
    if (professorDetail.lastname.length == 0 || !professorDetail.lastname.match(regx)) {
      this.setState({ isLastNameVisible: true });
      isValidForm = false
    }
    if (professorDetail.mobile.length == 0 || professorDetail.mobile.length != 10) {
      this.setState({ isPhoneNumberVisible: true });
      isValidForm = false
    }
    if (professorDetail.emergency_contact) {
            
      if(professorDetail.emergency_contact.length != 10){
          
          this.setState({ isEmergencyContactVisible: true });
          isValidForm = false
      }else{
          this.setState({ isEmergencyContactVisible: false });
      }
      
    }
    if (!this.state.professor && !this.state.admin) {
      this.setState({ isRoleSelected: true });
      isValidForm = false
    }
    return isValidForm;
  }

  onPersonalDetailChange(propertyName, event) {
    if (propertyName == "firstname") {
      this.setState({ isFirstNameVisible: false })
    }
    if (propertyName == "lastname") {
      this.setState({ isLastNameVisible: false })
    }
    if (propertyName == "mobile") {
      this.setState({ isPhoneNumberVisible: false })
    }
    if (propertyName == "emergency_contact") {
      this.setState({ isEmergencyContactVisible: false })
    }
    let Professor = this.state.Professor;
    let professorDetail = Professor.professorDetail;
    professorDetail = { ...professorDetail, [propertyName]: event.target.value };
    Professor = { ...Professor, professorDetail };
    this.setState({ Professor });
  }

  onSendInivitationAgain() {
    let { professorDetail } = this.state;
    let payloadType;
    if (professorDetail.designation == "INSTITUTE") {
      payloadType = "Institute"
    }
    else if (professorDetail.designation == "Professor") {
      payloadType = "Professor"
    }
    let apiData = {
      payload: {
        type: payloadType,
        id: this.state.professor_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.invitationSend(apiData).then(() => {
      let res = this.props.sendInvitation
      if (res && res.status == 200) {
        successToste("Invitation Send Successfully");
      }
      else {
        errorToste("Something Went Wrong")
      }
    })
  }

  onSaveChanges() {
    let { professor, admin } = this.state;
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
      if (professor && admin) {
        this.state.Professor.professorDetail.designation = 'Professor';
        this.state.Professor.professorDetail.user_type = 'PROFESSOR';
        this.state.Professor.professorDetail.role_type = 'PROFESSOR';
        this.state.Professor.professorDetail.isProfessorAdmin = true;
        this.state.Professor.professorDetail.types = 'Professor';
      } else {
        if (professor) {
          this.state.Professor.professorDetail.designation = 'Professor';
          this.state.Professor.professorDetail.user_type = 'PROFESSOR';
          this.state.Professor.professorDetail.role_type = 'PROFESSOR';
          this.state.Professor.professorDetail.types = 'Professor';
        } else {
          this.state.Professor.professorDetail.designation = 'INSTITUTE';
          this.state.Professor.professorDetail.user_type = 'INSTITUTE';
          this.state.Professor.professorDetail.role_type = 'INSTITUTE';
          this.state.Professor.professorDetail.types = 'Institute';
        }
      }


      this.state.Professor.professorDetail.username = this.state.Professor.professorDetail.firstname


      let data = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        "payload": this.state.Professor.professorDetail,
      }
      this.props.addStudentProfessorRegistration(data).then(() => {
        let res = this.props.studentProfessorRegiAdd;

        if (res && res.status == 200) {

          this.setState({ professorDetail: res.response, professor_id: res.response.professor_id });
          successToste("Faculty Added Successfully");
          let payloadType;
          if (this.state.professorDetail.designation == "INSTITUTE") {
            payloadType = "Institute"
          }
          else if (this.state.professorDetail.designation == "Professor") {
            payloadType = "Professor"
          }
          let apiData = {
            payload: {
              type: payloadType,
              id: this.state.professor_id
            },
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token
          }
          this.props.invitationSend(apiData).then(() => {
            let resInvitation = this.props.sendInvitation

            if (resInvitation && resInvitation.status == 200) {

              successToste("Invitation Send Successfully");
              this.setState({ invitationRes: true, disableAddBatchButton: false })
            }
            else {
              errorToste("Something Went Wrong")
            }
          })
        } else if (res && res.status == 500) {

          errorToste(res.message)
        } else {
          errorToste("Something Went Wrong");
        }
      })
    }
  }

  backButton() {
    this.props.history.push('/app/faculty-directory')
  }

  OnChangeEditable() {
    let editable = !this.state.editable

    this.setState({ editable });
  }

  onSelectMale(value) {

    let Professor = this.state.Professor;
    let professorDetail = Professor.professorDetail;
    professorDetail = { ...professorDetail, gender: value };
    Professor = { ...Professor, professorDetail };
    this.setState({ Professor });
  }

  onSelectFemale(value) {
    let Professor = this.state.Professor;
    let professorDetail = Professor.professorDetail;
    professorDetail = { ...professorDetail, gender: value };
    Professor = { ...Professor, professorDetail };
    this.setState({ Professor });
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
      let datas = {
        'institude_id': this.props.instituteId,
        'branch_id': this.props.branchId,
        'professor_id': this.state.professor_id,
        token: this.props.token
      }
      this.props.getProfessorDetail(datas).then(() => {
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
      let datas = {
        'institude_id': this.props.instituteId,
        'branch_id': this.props.branchId,
        'professor_id': this.state.professor_id,
        token: this.props.token
      }

      this.props.getProfessorDetail(datas).then(() => {

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
        infoToste("User Designation Updated Successfully");
      } else {
        infoToste("User Designation Not Update");
      }
    })
  }

  onDeleteModel(key) {
    this.setState({ deleteObj: key });
  }

  onDeleteEntry(flag) {
    if (flag == 'deleteProfessor') {
      this.onDeleteProfessor();
      $("#quizSubmit .close").click();
    }
  }

  renderBatchClass(index) {
    return this.state.Professor.batchDetails[index].timeTable.map((ClassDetail, idx) => {

      return (
        <li key={"classdetail" + idx} >
          <a href="javascript:void(0);">
            <span>{ClassDetail.subject_name}</span>
            <span>{this.state.day[ClassDetail.day]} {ClassDetail.start_time}{" to "}{ClassDetail.end_time}</span>
          </a>
          <div className="card__elem__setting">
            <button className="act-delete" onClick={this.deleteBatches.bind(this, ClassDetail.batch_id)} ></button>
          </div>
        </li>
      )
    })
  }

  quizCountShow() {
    if (this.state.quizCount == 0) {
      return (
        <div>
          <label>Quizes</label>
          <span class="info-type st-disabled">Not Added Yet</span>
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
          <span class="info-type st-disabled">Not Added Yet</span>
        </div>
      )
    } else {
      return (
        <div>
          <label>Homeworks</label>
          <span class="info-type st-alert">{this.state.Professor.activity.homeworkCount}</span>
        </div>
      )
    }
  }

  renderBatch() {
    return this.state.Professor.batchDetails.map((batch, index) => {
      if (batch.timeTable.length == 0) return false
      return (
        <div key={"batch" + index} className="c-batchList">
          <span className="c-batchList__title">{batch.className} <img src="/images/Arrow.png" alt="logo" style={{ height: "10px", width: "20px" }} /> {batch.batchName}</span>
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
        <div className="clearfix">
          <div className="c-card__form" style={{ overflow: "auto", height: "355px" }} >
            <div >
              <div className="divider-container" >
                <div className="divider-block text--left">
                  <div className="form-group cust-fld">
                    <label>First Name<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Professor.professorDetail.firstname} onChange={this.onPersonalDetailChange.bind(this, "firstname")} placeholder="Please Enter First Name" />
                    {this.state.isFirstNameVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid first name </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Last Name<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Professor.professorDetail.lastname} onChange={this.onPersonalDetailChange.bind(this, "lastname")} placeholder="Please Enter Last Name" />
                    {this.state.isLastNameVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid last name </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Phone<sup style={{ color: "red" }}>*</sup></label>
                    <input type="Number" min="1" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Professor.professorDetail.mobile} onChange={this.onPersonalDetailChange.bind(this, "mobile")} placeholder="Phone" />
                    {this.state.isPhoneNumberVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid phone number</label> : <br />}
                  </div>
                </div>
                {/* <div className="divider-block text--left">
              <div className="c-user-pic">
                <span className="fld-title">Avatar</span>
                <div className="user--img"><img src="/images/avatars/Avatar_13.jpg" alt="Avatar" /></div>
                <button className="link--btn">Change Avatar</button>
              </div>
            </div> */}
              </div>
              <div className="form-group cust-fld">
                <label>Gender</label><br />
                <label className="custome-field field-checkbox" style={{ marginRight: "10px" }}>
                  <input type="checkbox" name="check" id="check-male1" value="MALE" onChange={this.onSelectMale.bind(this, "MALE")} checked={this.state.Professor.professorDetail.gender == "MALE" ? true : false} />
                  <i></i> <span>Male</span>
                </label>

                <label className="custome-field field-checkbox">
                  <input type="checkbox" name="check" id="check-male2" value="FEMALE" onChange={this.onSelectFemale.bind(this, "FEMALE")} checked={this.state.Professor.professorDetail.gender == "FEMALE" ? true : false} />
                  <i></i> <span>Female</span>
                </label>
               
              </div>
              <div className="form-group cust-fld">
                <label>Email</label>
                <input type="email" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Professor.professorDetail.email} onChange={this.onPersonalDetailChange.bind(this, "email")} placeholder="Email" />
               
              </div>
              <div className="form-group cust-fld">
                <label>College</label>
                <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Professor.professorDetail.college} onChange={this.onPersonalDetailChange.bind(this, "college")} placeholder="College" />
                
              </div>
              <div className="form-group cust-fld">
                <label>Date of Birth</label>
                <DatePicker className="form-control" selected={this.state.Professor.professorDetail.DOB ? moment(this.state.Professor.professorDetail.DOB) : moment()} onChange={this.handleChange.bind(this)} />
                
              </div>
              <div className="form-group cust-fld">
                <label>Emergency Contact Name</label>
                <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Professor.professorDetail.emergency_contact_name} onChange={this.onPersonalDetailChange.bind(this, "emergency_contact_name")} placeholder="Emergency Contact Name" />
                
              </div>
              <div className="form-group cust-fld">
                <label>Emergency Contact</label>
                <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Professor.professorDetail.emergency_contact} onChange={this.onPersonalDetailChange.bind(this, "emergency_contact")} placeholder="Emergency Contact" />
                {this.state.isEmergencyContactVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Emergency Contact</label> : <br />}
              </div>
            </div>

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
                  <span className="info-type">{this.state.Professor.professorDetail.firstname ? this.state.Professor.professorDetail.firstname : "Not Added Yet"}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Phone</label>
                  <span className="info-type">{this.state.Professor.professorDetail.mobile ? this.state.Professor.professorDetail.mobile : "Not Added Yet"}</span>

                </div>
              </div>
              <div className="divider-block text--left">
                <div className="c-user-pic">
                  <div className="user--img"><img src="/images/avatars/Avatar_default.jpg" alt="Avatar" /></div>
                </div>
              </div>
            </div>

            <div className="form-group static-fld">
              <label>Email</label>
              <span className="info-type">{this.state.Professor.professorDetail.email ? this.state.Professor.professorDetail.email : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>College</label>
              <span className="info-type">{this.state.Professor.professorDetail.college ? this.state.Professor.professorDetail.college : "Not Added Yet"}</span>

            </div>
            <div className="form-group static-fld">
              <label>Date of Birth</label>
              <span className="info-type">{this.state.Professor.professorDetail.DOB ? moment(this.state.Professor.professorDetail.DOB).format("DD-MM-YYYY") : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>Emergency Contact Name</label>
              <span className="info-type">{this.state.Professor.professorDetail.emergency_contact_name ? this.state.Professor.professorDetail.emergency_contact_name : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>Emergency Contact</label>
              <span className="info-type">{this.state.Professor.professorDetail.emergency_contact ? this.state.Professor.professorDetail.emergency_contact : "Not Added Yet"}</span>
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

    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a onClick={this.backButton.bind(this)} >Back to Staff Directory</a>
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
                <label className="custome-field field-checkbox" style={{ marginRight: "10px", display: "inline-block" }}>
                  <input type="checkbox" name="check-one" id="check-Professor" value="checkone" checked={this.state.professor} />
                  <i></i> <span>Professor</span>
                </label>

                <label style={{ display: "inline-block" }} className="custome-field field-checkbox">
                  <input type="checkbox" name="check-one" id="check-Admin" value="checkone" onChange={this.onSelectAdminRole.bind(this)} checked={this.state.admin} />
                  <i></i> <span>Admin</span>
                </label>
                <br />
                {this.state.isRoleSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Designation</label> : <br />}
              </div> */}
            </div>
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
                {this.state.admin == true && this.state.professor == true || this.state.professor ? this.state.invitationRes == false ?
                  <div className="c-actiontd st-alert"><button style={{ color: "white" }} className="c-btn-large primary btn" onClick={this.onSaveChanges.bind(this)} ><i class="icon cg-envelope-o"></i>&nbsp;&nbsp;Invite Faculty</button></div>
                  : <div className="c-actiontd st-alert"><button style={{ color: "white" }} className="c-btn-large primary btn" onClick={this.onSendInivitationAgain.bind(this)} ><i class="icon cg-envelope-o"></i>&nbsp;&nbsp;Invite Again</button></div>
                  : this.state.invitationRes == false ?
                    <div className="c-actiontd st-alert" style={{ width: "60%" }}><button style={{ color: "white" }} className="c-btn-large primary btn" onClick={this.onSaveChanges.bind(this)} ><i class="icon cg-envelope-o"></i>&nbsp;&nbsp;Invite Faculty</button></div>
                    : <div className="c-actiontd st-alert" style={{ width: "60%" }}><button style={{ color: "white" }} className="c-btn-large primary btn" onClick={this.onSendInivitationAgain.bind(this)} ><i class="icon cg-envelope-o"></i>&nbsp;&nbsp;Invite Again</button></div>
                  // <div ><button style={{ color: "white", marginTop: "20px" }} className=" prime c-btn btn" onClick={this.onSaveChanges.bind(this)} ><i class="icon cg-envelope-o"></i>&nbsp;&nbsp;Invite Faculty</button></div>
                  // : <div ><button style={{ color: "white" }} className=" prime c-btn btn" onClick={this.onSendInivitationAgain.bind(this)} ><i class="icon cg-envelope-o"></i>Invite Again</button></div>
                }
              </div>
            </div>
            {(this.state.professor) || (this.state.professor && this.state.admin) ? <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Batches
                <span className="c-count filled">{this.state.Professor.batchDetails.length}</span>
                </span>
              </div>
              {this.renderBatchDetail()}
              <div className="c-card__btnCont">
                {(this.state.professor) || (this.state.professor && this.state.admin) ? <button style={{ color: "white" }} className="c-btn-large primary btn" data-toggle="modal" disabled={this.state.disableAddBatchButton} data-target="#addBatch">+ Add Batches</button> : ""}
              </div>
              <AddStudentBatchModel professorId={this.state.Professor.professorDetail.professor_id} onAddStudentBatch={(data) => { this.onProfessorBatchAdd(data) }} {...this.props} />
            </div> : ""}
            {/* {this.state.professor || (this.state.professor && this.state.admin) ? <div class="c-card">
              <div class="c-card__title">
                <span class="c-heading-sm card--title">
                  Activity
								</span>
              </div>
              <div class="c-card__items">
                <div class="c-card__form">
                  <div class="form-group static-fld">
                    {this.homeworkCountShow()}
                  </div>
                  <div class="form-group static-fld">
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
  userType: auth.userType,
  ProfessorAdmin: app.professorAdmin,
  isProfessorAdmin: auth.isProfessorAdmin,
  studentProfessorDelete: app.studentProfessorDelete,
  studentProfessorRegiAdd: app.studentProfessorRegiAdd,
  sendInvitation: app.sendInvitation
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
      AddProfessor,
      addStudentProfessorRegistration,
      invitationSend,
      getIsProfessorAdmin
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(FacultyDetail)
