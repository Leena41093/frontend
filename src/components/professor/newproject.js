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
import {addProjectData} from '../../actions/inventoryAdminAction'
class NewProjectDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      project: {
        projectDetail: {
        project_name:"",
        client_name:"",
        start_date:moment(),
        end_date:moment(),
        no_employee:""
        },
        employeeDetails: [],
      },
      professor_id: 4,
      homeworkCount: 0,
      quizCount: 0,
      activity: { homeworkDone: null, quizDone: null, totalQuiz: null, totalHomework: null },
      editable: true,
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isProjectNameVisible: false,
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
      isClientNameVisible: false,
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
    let projectDetail = this.state.project.projectDetail;
    var isValidForm = true;
    var regx = /^[a-zA-Z ]+$/;
    if (projectDetail.project_name.length == 0 || !projectDetail.project_name.match(regx)) {
      this.setState({ isProjectNameVisible: true });
      isValidForm = false
    }
    if (projectDetail.client_name.length == 0 || !projectDetail.client_name.match(regx)) {
      this.setState({ isClientNameVisible: true });
      isValidForm = false
    }
    return isValidForm;
  }

  onPersonalDetailChange(propertyName, event) {
    if (propertyName == "project_name") {
      this.setState({ isProjectNameVisible: false })
    }
    if (propertyName == "client_name") {
      this.setState({ isClientNameVisible: false })
    }
    let project = this.state.project;
    let projectDetail = project.projectDetail;
    projectDetail = { ...projectDetail, [propertyName]: event.target.value };
    project = { ...project, projectDetail };
    this.setState({ project });
  }

  onSaveChanges() {
     let self = this;
    let {project} = this.state;
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
       let data= {
          payload:{
            "project_name":project.projectDetail.project_name,
            "client_name":project.projectDetail.client_name,
            "start_date":project.projectDetail.start_date,
            "end_date":project.projectDetail.end_date,
            "team_size":0,
            "empData":[]
          },
          company_id:this.props.company_id,
          branch_id:this.props.branch_id
       }

       console.log("-=--=-=>",data)
       this.props.addProjectData(data).then(()=>{
         let res = this.props.addProject;
         if(res){
            console.log(res)
            successToste("project created Sucessfully")
            self.props.history.push("/app/projects-directory")
         }
       })
    }
  }

  backButton() {
    this.props.history.push('/app/projects-directory')
  }

  onProfessorBatchAdd(payload) {

    
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

  handleChange(type,date) {
    let project = this.state.project;
    let projectDetail = project.projectDetail;
    if(type == "start_date"){
    projectDetail = { ...projectDetail, start_date: moment(date) };
    }else if(type == "end_date"){
      projectDetail = { ...projectDetail, end_date: moment(date) };
    }
    project = { ...project, projectDetail };
    this.setState({ project });
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
    return this.state.project.employeeDetails[index].timeTable.map((ClassDetail, idx) => {

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
    return this.state.project.employeeDetails.map((batch, index) => {
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
                    <label>Project Name<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control"  value={this.state.project.projectDetail.project_name} onChange={this.onPersonalDetailChange.bind(this, "project_name")} placeholder="Please Enter First Name" />
                    {this.state.isProjectNameVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid project name </label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Client Name<sup style={{ color: "red" }}>*</sup></label>
                    <input type="text" className="form-control"  value={this.state.project.projectDetail.client_name} onChange={this.onPersonalDetailChange.bind(this, "client_name")} placeholder="Please Enter Last Name" />
                    {this.state.isClientNameVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid client name </label> : <br />}
                  </div>
                 
                </div>
               
              </div>
             
             

              <div className="form-group cust-fld">
                <label>Start Date</label>
                <DatePicker className="form-control" selected={this.state.project.projectDetail.start_date ? moment(this.state.project.projectDetail.start_date) : moment()} onChange={this.handleChange.bind(this,"start_date")} />
              </div>
              <div className="form-group cust-fld">
                <label>End Date</label>
                <DatePicker className="form-control" selected={this.state.project.projectDetail.end_date ? moment(this.state.project.projectDetail.end_date) : moment()} onChange={this.handleChange.bind(this,"end_date")} />
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
                  <label>Project Name</label>
                  <span className="info-type">{this.state.project.projectDetail.project_name ? this.state.project.projectDetail.project_name : "Not Added Yet"}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Client Name</label>
                  <span className="info-type">{this.state.project.projectDetail.client_name ? this.state.project.projectDetail.client_name : "Not Added Yet"}</span>
                </div>
              </div>
            </div>

            
            <div className="form-group static-fld">
              <label>Start Date</label>
              <span className="info-type">{this.state.project.projectDetail.start_date ? moment(this.state.project.projectDetail.start_date).format("DD-MM-YYYY") : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>End Date</label>
              <span className="info-type">{this.state.project.projectDetail.end_date ? moment(this.state.project.projectDetail.end_date).format("DD-MM-YYYY") : "Not Added Yet"}</span>
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
    if (this.state.project.employeeDetails.length == 0) {
      return (
        <div style={{ height: "380px" }}>
          <div className="c-card__img">
            <img src="/images/card-img-3.png" alt="logo" />
          </div>
          <div className="c-card__info">No employees added yet.</div>
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
            <a onClick={this.backButton.bind(this)} >Back to Project Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg nomargin">Add New Project</span>
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
                  PROJECT DETAILS
                </span>
              </div>
              {this.renderPersonalDetails()}
              <div className="c-card__btnCont">
               
                  <div className="c-actiontd st-alert"><button style={{ color: "white" }} className="c-btn-large primary btn" onClick={this.onSaveChanges.bind(this)} >Add Project</button></div>
                
              </div>
            </div>
            {/* <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Employees
                <span className="c-count filled"></span>
                </span>
              </div>
              {this.renderBatchDetail()}
              <div className="c-card__btnCont">
                {(this.state.project) ? <button style={{ color: "white" }} className="c-btn-large primary btn" data-toggle="modal" disabled={this.state.disableAddBatchButton} data-target="#addBatch">+ Add Employees</button> : ""}
              </div>
              <AddStudentBatchModel professorId={this.state.project.projectDetail.professor_id} onAddStudentBatch={(data) => { this.onProfessorBatchAdd(data) }} {...this.props} />
            </div> */}
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
  sendInvitation: app.sendInvitation,
  addProject :app.addprojectdata,
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
      AddProfessor,
      addStudentProfessorRegistration,
      invitationSend,
      getIsProfessorAdmin,
      addProjectData
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(NewProjectDetail)
