import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getEmployeeDetail,getProjectEmployeeData ,getAllEmployee,projectEmployeeDetails,deleteProject,
  addEmployeeProject, deleteProjectEmployee} from '../../actions/inventoryAdminAction';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import { successToste } from '../../constant/util';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
class ProjectDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      pro: {},
      project_id:null,
      projectEmployeeDetails:{},
      option:[],
      addedEmployees:[]
    }
  }

  componentDidMount() {
   this.setState({ insituteId: this.props.instituteId })
    var pro = this.props ? this.props.location.state.data : ""
   
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
      
        let res = this.props.projectEmployeeDetailsData;
        if (res && res.status == 200) {
          this.setState({ projectEmployeeDetails: res.data.response.projectDetails })
        }
      })

    this.props.projectEmployeeDetails(apiData).then(()=>{
      let resdata = this.props.projectEmployeeDetailsDatas;
      if( resdata && resdata.status ==200 ){
        this.setState({addedEmployees:resdata.data.response})
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

  deleteEmp(employee,empid){
   
      let {addedEmployees} = this.state;
      let empidarray = [];
      addedEmployees.splice(employee, 1);
      this.setState({ addedEmployees },()=>{
      this.state.addedEmployees.forEach((emp,index)=>{
        empidarray.push(emp.emp_id);
    })
    var pro = this.props ? this.props.location.state.data : ""
     let apidata={
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload: {
        project_id:pro.project_id,
        emp_id:empid
      }
     }
     this.props.deleteProjectEmployee(apidata).then(()=>{
      let res = this.props.deleteEmployee;
      if(res && res.data.status == 200){
        successToste("Employee Deleted Successfully");
      }
     
     });
   
  });
  }

  renderEmployeeList() {
    if (!this.state.addedEmployees) return false
    return (
      this.state.addedEmployees.map((emp, index) => {
        return (
          <li key={"emp" + index}>
            <div className="card__elem">
              {emp.emp_name}
              <div className="card__elem__setting">

                <button><i className="icon cg-rubbish-bin-delete-button" onClick={this.deleteEmp.bind(this, index,emp.emp_id)}></i></button>
              </div>
            </div>
          </li>
        )
      })
    )
  }

  onAddEmployess(data){
    let {addedEmployees} = this.state;
    let empidarray =[];
    data.forEach((emps,i)=>{
      let obj = {emp_id: emps.value,emp_name:emps.label}
      addedEmployees.push(obj);
    })
    addedEmployees.forEach((emp,index)=>{
        empidarray.push(emp.emp_id);
    })
   this.setState({addedEmployees},()=>{
    var pro = this.props ? this.props.location.state.data : ""
     let apidata={
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload: {
        project_id:pro.project_id,
        empIds:empidarray
      }
     }
     this.props.addEmployeeProject(apidata).then(()=>{
      let res = this.props.addEmployee;
      if(res && res.data.status == 200){
        successToste("Employee Added Successfully");
      }
     
     });
   })
  }
  
  backButton(event) {
    this.props.history.push('/app/projects-directory')
  }

  onDeleteModel() {
    var pro = this.props ? this.props.location.state.data : ""
    let apiData = {
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload: {
        "project_id":pro.project_id
      }
    }

    this.props.deleteProject(apiData).then(()=>{
      let res = this.props.deleteProjects;
      if(res && res.data.status == 200){
        successToste("Project Delete Successfully");
        this.props.history.push('/app/projects-directory')
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
                <span className="c-count filled">{this.state.addedEmployees.length}</span>
                </span>
              </div>
              <div className="row">
                <div className="col-sm-8">
                <Select
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
            </div>            
          </div>
        </div>      
      </div>
    )
  }
}

const mapStateToProps = ({ auth,  inventoryAdmin }) => ({
  employeeDetail: inventoryAdmin.employeeDetail,
  company_id:auth.companyId,
  branch_id:auth.AdminbranchId,
  projectEmployeeDetailsData: inventoryAdmin.projectEmployeeData,
  allEmplyees:inventoryAdmin.getAllEmployees,
  projectEmployeeDetailsDatas:inventoryAdmin.projectEmployeeDetailss,
  deleteProjects :inventoryAdmin.deleteproject,
  addEmployee :inventoryAdmin.addEmployeesToProject,
  deleteEmployee:inventoryAdmin.deleteEmployeeFromProject
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getEmployeeDetail,
      getProjectEmployeeData,
      getAllEmployee,
      projectEmployeeDetails,
      deleteProject,
      addEmployeeProject,
      deleteProjectEmployee
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails)
