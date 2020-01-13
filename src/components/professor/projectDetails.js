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
import { getEmployeeDetail,getProjectEmployeeData ,getAllEmployee} from '../../actions/inventoryAdminAction';
import $ from "jquery";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { validateFormField } from '../../helpers/validate';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { Scrollbars } from 'react-custom-scrollbars';
import { DeleteModal } from '../common/deleteModal';
import Select from 'react-select';
class ProjectDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectDetails:{},
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
      project_id:null,
      projectEmployeeDetails:{},
      option:[],
      addedEmployees:[]
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
                  this.props.history.push('/app/project-directory')
                });
              }
            }
          })
        })
      }
    }
  }

  componentDidMount() {
   this.setState({ insituteId: this.props.instituteId })
    var pro = this.props ? this.props.location.state.data : ""
    console.log("data",pro);
      if (pro.project_id != undefined) {
        this.setState({ project_id: pro.project_id, projectDetails : pro })
      }
      let apiData = {
        company_id: this.props.company_id,
        branch_id: this.props.branch_id,
        payload: {
          "project_id":pro.project_id
        }
      }
     

      this.props.getProjectEmployeeData(apiData).then(() => {
        // console.log("res", this.props.employeeDetail);
        let res = this.props.projectEmployeeDetailsData;
        if (res && res.status == 200) {
         //  Employee = {projectDetails: res.data.response.projectDetails }
          this.setState({ projectEmployeeDetails: res.data.response.projectDetails })
        }
      })
    
  }

  getAllEmployeeList(){
    let data = {
      company_id:this.props.company_id,
      branch_id:this.props.branch_id
    }
    this.props.getAllEmployee(data).then(()=>{
      let res= this.props.allEmplyees;
      let arr =[]
      if(res){
       
        res.data.response.map((data, index) => {
          let temp = { value: data.emp_id, label: data.emp_name};
          arr.push(temp);
        })
      }
      this.setState({  option: arr });
    })
  }

  renderEmployeeCard() {
    if (this.state.addedEmployees && this.state.addedEmployees.length) {
      return (
        <div className="c-card__items h-small">
          <Scrollbars >
            <ul>
              {this.renderEmployeeList()}
            </ul>
          </Scrollbars >
        </div>
      )
    } else {
      return (
        <div>
          <div className="c-card__img">
            <img src="/images/card-img-5.png" alt="" />
          </div>
          <div className="c-card__info">No Employees added yet</div>
        </div>
      )
    }
  }

  deleteEmp(employee){
   
      let {addedEmployees} = this.state;
      addedEmployees.splice(employee, 1);
      this.setState({ addedEmployees });
    
  }
  
  renderEmployeeList() {
    console.log("dfsfsf",this.state.addedEmployees)
    if (!this.state.addedEmployees) return false
    return (
      this.state.addedEmployees.map((emp, index) => {
        return (
          <li key={"emp" + index}>
            <div className="card__elem">
              {emp.label}
              <div className="card__elem__setting">

                <button><i className="icon cg-rubbish-bin-delete-button" onClick={this.deleteEmp.bind(this, index)}></i></button>
              </div>
            </div>
          </li>
        )
      })
    )
  }

  onAddEmployess(data){
   this.setState({addedEmployees:data},()=>{
     successToste("Employee Added Successfully");
   })
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
    this.props.history.push('/app/projects-directory')
  }

  // OnChangeEditable(event) {
  //   let editable = !this.state.editable
  //   this.setState({ editable });
  // }

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

  // handleChange(date) {
  //   let Professor = this.state.Professor;
  //   let professorDetail = Professor.professorDetail;
  //   professorDetail = { ...professorDetail, DOB: date };
  //   Professor = { ...Professor, professorDetail };
  //   this.setState({ Professor });
  // }

  // onSelectProfessorRole() {
  //   let { professor } = this.state;
  //   professor = !professor
  //   if (professor) {
  //     this.setState({ isRoleSelected: false })
  //   }
  //   this.setState({ professor });
  // }

  // onSelectAdminRole() {
  //   let { admin } = this.state;
  //   admin = !admin
  //   if (admin) {
  //     this.setState({ isRoleSelected: false })
  //   }
  //   this.setState({ admin });
  // }

  // onChangeRole(payload) {
  //   let apiData = {
  //     institude_id: this.props.instituteId,
  //     branch_id: this.props.branchId,
  //     payload: payload,
  //     token: this.props.token
  //   }
  //   this.props.updateUserRole(apiData).then(() => {
  //     let res = this.props.roleUpdate;
  //     if (res && res.status == 200) {
  //       this.props.history.push('/app/faculty-directory')
  //       infoToste("Changes Saved Successfully");
  //     } else if (res && res.status == 500) {
  //       infoToste("User Designation Not Update");
  //     }
  //   })
  // }

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

  // quizCountShow() {
  //   if (this.state.quizCount == 0) {
  //     return (
  //       <div>
  //         <label>Quizes</label>
  //         <span className="info-type st-disabled">Not Added Yet</span>
  //       </div>
  //     )
  //   } else {
  //     return (
  //       <div>
  //         <label>Quizes</label>
  //         <span className="info-type st-alert">{this.state.Professor.activity.quizCount}</span>
  //       </div>
  //     )
  //   }
  // }

  // homeworkCountShow() {
  //   if (this.state.homeworkCount == 0) {
  //     return (
  //       <div>
  //         <label>Homeworks</label>
  //         <span className="info-type st-disabled">Not Added Yet</span>
  //       </div>
  //     )
  //   } else {
  //     return (
  //       <div>
  //         <label>Homeworks</label>
  //         <span className="info-type st-alert">{this.state.Professor.activity.homeworkCount}</span>
  //       </div>
  //     )
  //   }
  // }

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
    let { projectDetails } = this.state;
    
      return (
        <div>
          <div className="c-card__form">
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group static-fld">
                  <label>Project Name</label>
                  <span className="info-type">{projectDetails ? projectDetails.project_name: "Not Added Yet"}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Client Name</label>
                  <span className="info-type">{projectDetails ? projectDetails.client_name : "Not Added Yet"}</span>

                </div>
              </div>
            </div>

            <div className="form-group static-fld">
              <label>Start Date</label>
              <span className="info-type">{projectDetails ? moment(projectDetails.start_date).format("DD-MM-YYYY") : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>End Date</label>
              <span className="info-type">{projectDetails ? moment(projectDetails.end_date).format("DD-MM-YYYY") : "Not Added Yet."}</span>

            </div>
            <div className="form-group static-fld">
              <label>Number of Employees</label>
              <span className="info-type">{projectDetails ? projectDetails.team_size  : "Not Added Yet"}</span>
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
            <a className="linkbtn hover-pointer" onClick={this.backButton.bind(this)} >Back to Project Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg nomargin">Project Details</span>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
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
                  PROJECT DETAILS
                </span>
              </div>
              {this.renderPersonalDetails()}
            </div>
           <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Employess
                <span className="c-count filled">{this.state.Professor.batchDetails.length}</span>
                </span>
              </div>
              <div className="row">
                <div className="col-sm-8">
                <Select
                        // defaultValue={[colourOptions[2], colourOptions[3]]}
                        isMulti
                        name="students"
                        closeMenuOnSelect={false}
                        options={this.state.option}
                        onFocus={this.getAllEmployeeList.bind(this)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selected) => { this.setState({selectedValues:selected}) }}
                    />
                     {this.renderEmployeeCard()}
                </div>
                <div className="col-sm-4">
                <button className="c-btn-large primary" onClick={this.onAddEmployess.bind(this,this.state.selectedValues)}>+ Add Employee</button>
                </div>
              </div>
            
              
              {/* <AddStudentBatchModel professorId={this.state.Professor.professorDetail.professor_id} onAddStudentBatch={(data) => { this.onProfessorBatchAdd(data) }} {...this.props} /> */}
            </div> 
           
          </div>
        </div>
      
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
  company_id:app.companyId,
  branch_id:app.AdminbranchId,
  projectEmployeeDetailsData: inventoryAdmin.projectEmployeeData,
  allEmplyees:inventoryAdmin.getAllEmployees
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
      getProjectEmployeeData,
      getAllEmployee
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails)
