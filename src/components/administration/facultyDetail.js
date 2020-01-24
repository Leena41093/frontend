import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AddStudentBatchModel } from '../common/addStudentBatchModal';
import { getEmployeeDetail, getAccessories, getProjectes, assignProjectAndAccessories, deleteAccessoriesfromEmp, deleteProjectfromEmp,deleteEmployee } from '../../actions/inventoryAdminAction';
import $ from "jquery";

import moment from 'moment';
import { validateFormField } from '../../helpers/validate';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import 'react-toastify/dist/ReactToastify.css';
import { Scrollbars } from 'react-custom-scrollbars';
// import { DeleteModal } from '../common/deleteModal';

class FacultyDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Employee: {
        employeeDetail: {},
        projectes: [],
        accessories: []
      },
      editable: false,
      pro: {},
      emp_id: null,
    }
  }

  
  componentWillMount() {

    var pro = this.props ? this.props.location.state.data : ""
    console.log("data", pro);
    if (pro.emp_id != undefined) {
      this.setState({ emp_id: pro.emp_id })
    }
    let apiData = {
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload: {
        "emp_id": pro.emp_id
      }
    }
    let { Employee } = this.state;

    this.props.getEmployeeDetail(apiData).then(() => {
      console.log("res", this.props.employeeDetail);
      let res = this.props.employeeDetail;
      if (res && res.status == 200) {
        Employee = { ...Employee, employeeDetail: res.data.response.empployeeDetails }
        Employee = { ...Employee, projectes: res.data.response.projectInfo }
        Employee = { ...Employee, accessories: res.data.response.accessoryInfo }
        this.setState({ Employee })
      }
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

  
  backButton(event) {
    this.props.history.push('/app/employee-directory')
  }

  onProfessorBatchAdd(payload) {
    this.getEmpDetail()
    $("#addBatch .close").click();
  }
   
  getEmpDetail(){
    var pro = this.props ? this.props.location.state.data : ""

    if (pro.emp_id != undefined) {
      this.setState({ emp_id: pro.emp_id })
    }
    let apiData = {
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload: {
        "emp_id": pro.emp_id
      }
    }
    let { Employee } = this.state;

    this.props.getEmployeeDetail(apiData).then(() => {
      
      let res = this.props.employeeDetail;
      if (res && res.status == 200) {
        Employee = { ...Employee, projectes: res.data.response.projectInfo }
        Employee = { ...Employee, accessories: res.data.response.accessoryInfo }
        Employee = { ...Employee, employeeDetail: res.data.response.empployeeDetails }
        this.setState({ Employee })
      }
    })
  }



  onDeleteModel(key, value) {
    var pro = this.props ? this.props.location.state.data : ""
    let data = {
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload: {
        "project_id": value.project_id,
        "emp_id":pro && pro.emp_id ?pro.emp_id:0,
        "accessory_id": value.accessory_id,
      }
    }

    if (key == "project") {
      this.props.deleteProjectfromEmp(data).then(() => {
        let res = this.props.deleteProject
        if (res && res.data.status == 200) {
          this.getEmpDetail()
          successToste("project Deleted Successfully")
        }
      })
    }else{
      this.props.deleteAccessoriesfromEmp(data).then(() => {
        let res = this.props.deleteAccessories
        if (res && res.data.status == 200) {
          this.getEmpDetail()
          successToste("Accessories Deleted Successfully")
        }
      })
    }
  }

  onDeleteProfessor() {
    let pro = this.props ? this.props.location.state.data : "";
    
    let data = {
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload: {
             "emp_id":pro && pro.emp_id ?pro.emp_id:0,
     
      }
    }
    this.props.deleteEmployee(data).then(()=>{
      let res = this.props.deleteEmp;
      if(res && res.data.status == 200 ){
        this.props.history.push('/app/employee-directory');
        successToste("Employee Deleted Successfully")
      }else{
        errorToste("Something Went Wrong");
      }
    })
    
  }

  renderBatch() {
    let { Employee } = this.state;
    return Employee.projectes.map((batch, index) => {
      return (
        <div key={"batch" + index} className="c-batchList">
          <span className="c-batchList__title">
            {batch.project_name}
            <div className="card__elem__setting1">
              <button style={{ marginRight: "-220px", marginTop: "-7px" }}  onClick={this.onDeleteModel.bind(this, "project", batch)} className="act-delete pull-right"></button>
            </div>
          </span>
        </div>
      )
    })
  }

  renderAccessories() {
    let { Employee } = this.state;
    return Employee.accessories.map((batch, index) => {
      return (
        <div key={"batch" + index} className="c-batchList">
          <span className="c-batchList__title">
            {batch.accessory_name}
            <div className="card__elem__setting1">
              <button style={{ marginRight: "-220px", marginTop: "-7px" }}  onClick={this.onDeleteModel.bind(this,"accessories",batch)} className="act-delete pull-right"></button>
            </div>
          </span>
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
                <div className="user--img"><img src={"/images/avatars/Avatar_default.jpg"} alt="Avatar" /></div>
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
            <span className="info-type">{Employee.employeeDetail ? moment(Employee.employeeDetail.DOB).format("DD-MM-YYYY") : "Not Added Yet"}</span>
          </div>
          <div className="form-group static-fld">
            <label>Company Name</label>
            <span className="info-type">{Employee.employeeDetail ? Employee.employeeDetail.designation : "Not Added Yet."}</span>
          </div>
          <div className="form-group static-fld">
            <label>Contact Number</label>
            <span className="info-type">{Employee.employeeDetail ? Employee.employeeDetail.mobile : "Not Added Yet."}</span>
          </div>
        </div>
        <div className="c-card__btnCont">
        </div>
      </div>
    )
  }

  renderBatchDetail() {
    // if (this.state.Employee.projectes.length == 0 ) {
    //   return (
    //     <div style={{ height: "380px" }}>
    //       <div className="c-card__img">
    //         <img src="/images/card-img-3.png" alt="logo" />
    //       </div>
    //       <div className="c-card__info">No batches added yet.</div>
    //     </div>
    //   )
    // } else {
    return (
      <div className="c-card__items">
        <Scrollbars >
          {this.renderBatch()}
          {this.renderAccessories()}
        </Scrollbars >
      </div>
    )
    // }
  }


  render() {
    var pro = this.props.location.state.data ? this.props.location.state.data : ""
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a className="linkbtn hover-pointer" onClick={this.backButton.bind(this)} >Back to Employee Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg nomargin">Employee Details</span>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.backButton.bind(this)}>Back</button>
              <button className="c-btn prime"  onClick={this.onDeleteProfessor.bind(this)}>Delete</button>
              {/* // <button className="c-btn prime" onClick={this.onSaveChanges.bind(this)} >Save changes</button>  */}
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
                <span className="c-count filled">{this.state.Employee.projectes.length+this.state.Employee.accessories.length}</span>
                </span>
              </div>
              {this.renderBatchDetail()}
              <div className="c-card__btnCont">
                {pro.designation == "INSTITUTE" ? "" : <button className="c-btn-large primary" data-toggle="modal" data-target="#addBatch">+ Add Project & Accessories</button>}
              </div>
              <AddStudentBatchModel emp_id={pro && pro.emp_id ? pro.emp_id : 0} onAddStudentBatch={(data) => { this.onProfessorBatchAdd(data) }} {...this.props} />
            </div> : ""}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({  auth, inventoryAdmin }) => ({
  employeeDetail: inventoryAdmin.employeeDetail,
  accessories: inventoryAdmin.accessories,
  projectes: inventoryAdmin.projectes,
  company_id: auth.companyId,
  branch_id: auth.AdminbranchId,
  assignProjectAccessories: inventoryAdmin.assignProjectAccessories,
  deleteProject: inventoryAdmin.deleteProject,
  deleteAccessories: inventoryAdmin.deleteAccessories,
  deleteEmp: inventoryAdmin.deleteEmp
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getEmployeeDetail,
      getAccessories,
      getProjectes,
      assignProjectAndAccessories,
      deleteAccessoriesfromEmp,
      deleteProjectfromEmp,
      deleteEmployee
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(FacultyDetail)
