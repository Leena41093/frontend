import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import {getStudentProfile,updateStudentProfile} from '../../actions/studentAction'
import DatePicker from 'react-datepicker';
import {profilePicUpload,getProfilePic } from '../../actions/index';
import { ProfilePicModal } from '../common/profilepic';
import $ from 'jquery';
import moment from 'moment';

class GetStudentProfile extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      studentDetail:[],
      editable:false,
      isFirstNameVisible: false,
      isLastNameVisible:false,
      isPhoneNumberVisible: false,
      isEmailVisible: false,
      isCollegeVisible: false,
      isAddressVisible: false,
      isDobVisible: false,
      isGardianName: false,
      isGardianPhone: false,
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps){
		
		let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){
    if(this.state.instituteId != nextProps.instituteId){
			// localStorage.removeItem("instituteid")
      // this.setState({instituteId:nextProps.instituteId},()=>{
				// const pro = this.props.location.state?this.props.location.state.data:"";
				// this.getClassesOfStudent();
				// table.fnDraw()
				this.props.history.push("/app/dashboard");
      // });
		}
	
		}
  }
  
  componentDidMount(){
    this.setState({instituteId:this.props.instituteId});
    let apiData={
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token :this.props.token
    }
    this.props.getStudentProfile(apiData).then(()=>{
      let res = this.props.studentProfile;
      if(res && res.status == 200){
        this.setState({studentDetail:res.data.response[0]})
      }
    })
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }

  validate(){
    let {studentDetail} = this.state;
    var isValidForm = true;
    var regx = /^[a-zA-Z ]+$/;
    if (studentDetail.firstname.length == 0 || !studentDetail.firstname.match(regx)) {
      this.setState({ isFirstNameVisible: true });
      isValidForm = false
    }
    if (studentDetail.lastname.length == 0 || !studentDetail.lastname.match(regx)) {
      this.setState({ isLastNameVisible: true });
      isValidForm = false
    }
    if (studentDetail.mobile.length == 0 || studentDetail.mobile.length != 10) {
      this.setState({ isPhoneNumberVisible: true });
      isValidForm = false
    }
    if (studentDetail.guradian_phone) {
      if (studentDetail.guradian_phone.length  != 10) {
        this.setState({ isGardianPhone: true });
        isValidForm = false
      }else{
        this.setState({ isGardianPhone: false });
      }
    }
    
    return isValidForm;
  }

  onPersonalDetailChange(propertyName, event){
    if (propertyName == "firstname") {
      this.setState({ isFirstNameVisible: false })
    }
    if (propertyName == "lastname") {
      this.setState({ isLastNameVisible: false })
    }
    if (propertyName == "mobile") {
      this.setState({ isPhoneNumberVisible: false })
    }
    if (propertyName == "guradian_phone") {
      this.setState({ isGardianPhone: false })
    }
   
    let {studentDetail}  = this.state;
    studentDetail = {...studentDetail,[propertyName]:event.target.value};
    this.setState({studentDetail});
  }   

  onSaveChanges(event){
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
    let data={
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token :this.props.token,
      payload:{
        "firstname": this.state.studentDetail.firstname,
	      "lastname": this.state.studentDetail.lastname,
	      "mobile": this.state.studentDetail.mobile,
      	"address": "pune",
	      "DOB": this.state.studentDetail.DOB,
	      "guradian_name": this.state.studentDetail.guradian_name,
	      "guradian_phone":this.state.studentDetail.guradian_phone,
	      "class_name": "class_1",
	      "college":this.state.studentDetail.college,
	      "email": "sohel@gmail.com"
      }
    }
    
    this.props.updateStudentProfile(data).then(()=>{
      let res = this.props.editStudentProfile;
      if(res && res.data.status == 500){
        errorToste(this.titleCase(res.data.message))
      }
      else if(res && res.data.status == 200){
      let {editable} = !this.state.editable;
      this.setState({editable})
      successToste("Profile Updated Successfully");
      }
      else{
        errorToste("Something Went Wrong");
      }
    })
  }
  }

  OnChangeEditable(){
    let editable = !this.state.editable;
    this.setState({editable})
  }

  handleChange(date){
    let {studentDetail} = this.state;
    if(date == null){
      studentDetail = {...studentDetail,DOB:moment()};
    }
    else{
    studentDetail = {...studentDetail,DOB:date};
   }
    this.setState({studentDetail});
  }

  backToDashboard(){
    this.props.history.push('/app/dashboard')
  }

  saveProfile(data){
    const payloaddata = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
      payload: {
          filename: data.filename,
          gender: data.gender
      }
  }
  this.props.profilePicUpload(payloaddata).then((value) => {
      var res = this.props.profileUpload;
      if (res && res.data.status == 200) {
          $("#newprofilepic .close").click();
          const downloadPic = {
            institudeId: this.props.instituteId,
            branchId: this.props.branchId,
            token: this.props.token
          }
          this.props.getProfilePic(downloadPic).then(() => {
            var res = this.props.getProfilePicture
            if (res && res.status == 200) {
              this.setState({ userProfileUrl: res.response.profilePicture!="" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg"})
            }
            else if(res && res.status == 500){
              this.setState({userProfileUrl:"/images/avatars/Avatar_Default.jpg"})
            }
          })
          successToste("Profile Set Successfully");
      }

  })
  }

  renderPersonDetailCard(){
    if (this.state.editable) {
      return (
        <div className="row">
        <div className="col-sm-6">
        <div className="clearfix">
          <div className="c-card__form">
            <div className="form-group cust-fld">
              <label>First Name <sup>*</sup></label>
              <input type="text" className="form-control" value={this.state.studentDetail.firstname} onChange={this.onPersonalDetailChange.bind(this, "firstname")} placeholder="First Name" />
              {this.state.isFirstNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Name</label> : <br />}
            </div>
            <div className="form-group cust-fld">
              <label>Last Name <sup>*</sup></label>
              <input type="text" className="form-control" value={this.state.studentDetail.lastname} onChange={this.onPersonalDetailChange.bind(this, "lastname")} placeholder="Last Name" />
              {this.state.isLastNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Name</label> : <br />}
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>Phone <sup>*</sup></label>
                  <input type="number" min="1"  value={this.state.studentDetail.mobile} onChange={this.onPersonalDetailChange.bind(this, "mobile")} className="form-control" placeholder="Phone" />
                  {this.state.isPhoneNumberVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Phone Number</label> : <br />}
                </div>
                <div className="form-group cust-fld">
                  <label>Email</label>
                  <input type="email" value={this.state.studentDetail.email} className="form-control"  placeholder="Email" />
                  {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Email</label> : <br />}
                </div>
              </div>
          </div>
            <div className="form-group cust-fld">
              <label>College</label>
              <input type="text" value={this.state.studentDetail.college} className="form-control" onChange={this.onPersonalDetailChange.bind(this, 'college')} placeholder="College" />
              {this.state.isCollegeVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter College Name</label> : <br />}
            </div>
            
            <div className="form-group cust-fld">
              <label>Date of Birth</label>
              <DatePicker className="form-control fld--date" selected={this.state.studentDetail && this.state.studentDetail.DOB? moment(this.state.studentDetail.DOB) :moment()} onChange={this.handleChange.bind(this)} />
              {this.state.isDobVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Date of Birth</label> : <br />}
            </div>
            <div className="form-group cust-fld">
              <label>Guardian Name</label>
              <input type="text" value={this.state.studentDetail.guradian_name} className="form-control" onChange={this.onPersonalDetailChange.bind(this, "guradian_name")} placeholder="Guardian Name" />
              {this.state.isGardianName ? <label className="help-block" style={{ color: "red" }}>Please Enter Guradian Name</label> : <br />}
            </div>
            <div className="form-group cust-fld">
              <label>Guardian Phone</label>
              <input type="number" min="1" className="form-control" value={this.state.studentDetail.guradian_phone} onChange={this.onPersonalDetailChange.bind(this, 'guradian_phone')} placeholder="Guardian Phone" />
              {this.state.isGardianPhone ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Guradian Phone Number</label> : <br />}
            </div>
          </div>
        </div>
          </div>
        </div>
      )
    }
    else {
      return(
      <div className="row">
      <div className="col-sm-6">
          <div className="c-card__form">
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group static-fld">
                  <label>First Name</label>
                  <span className="info-type">{this.state.studentDetail ? (this.state.studentDetail.firstname != null) && (this.state.studentDetail.firstname != "") ?this.state.studentDetail.firstname : "Not Added Yet" : "Not Added Yet"}</span> 
                </div>
                <div className="form-group static-fld">
                  <label>Last Name</label>
                  <span className="info-type">{this.state.studentDetail ? (this.state.studentDetail.lastname != null) &&(this.state.studentDetail.lastname != "") ? this.state.studentDetail.lastname : "Not Added Yet" : "Not Added Yet"}</span> 
                </div>
                <div className="form-group static-fld">
                  <label>Phone</label>
                  <span className="info-type">{this.state.studentDetail ? (this.state.studentDetail.mobile != null) && (this.state.studentDetail.mobile != "") ?this.state.studentDetail.mobile : "Not Added Yet" :"Not Added Yet"}</span>
                </div>
              </div>
            </div>
            <div className="form-group static-fld">
              <label>Email</label>
               <span className="info-type">{this.state.studentDetail ? (this.state.studentDetail.email != null) &&  (this.state.studentDetail.email != "") ? this.state.studentDetail.email: "Not Added Yet" :"Not Added Yet"}</span> 
            </div>
            <div className="form-group static-fld">
              <label>College</label>
               <span className="info-type st-disabled">{this.state.studentDetail ? (this.state.studentDetail.college != null) &&  (this.state.studentDetail.college!= "")? this.state.studentDetail.college :"Not Added Yet" : "Not Added Yet"}</span>
            </div>
          
            <div className="form-group static-fld">
              <label>Date of Birth</label>
              <span className="info-type st-disabled">{this.state.studentDetail  ?  (this.state.studentDetail.DOB != null) && (this.state.studentDetail.DOB != "")  ? moment(this.state.studentDetail.DOB).format("MM-DD-YYYY") : "Not Added Yet" :"Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>Guardian Name</label>
              <span className="info-type st-disabled">{this.state.studentDetail ? (this.state.studentDetail.guradian_name != null) && (this.state.studentDetail.guradian_name!= "") ? this.state.studentDetail.guradian_name : "Not Added Yet" : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>Guardian Phone</label>
              <span className="info-type st-disabled">{this.state.studentDetail ?  (this.state.studentDetail.guradian_phone != null) && (this.state.studentDetail.guradian_phone != "") ?this.state.studentDetail.guradian_phone : "Not Added Yet" : "Not Added Yet"}</span>
            </div>
          </div>
          <div className="c-card__btnCont">
            <button className="c-btn primary btn-custom" onClick={this.OnChangeEditable.bind(this)} >Edit Personal Details</button>
          </div>
          </div>
          <div className="col-sm-6">
        <div className="c-user-pic pull-left">
                <div className="user--img"><img src={this.props.profilePictureUrl} alt="Avatar" /></div>
                <button className="link--btn"  data-toggle="modal" data-target="#newprofilepic">Change Picture</button>
              </div>
        </div>
        </div>
      )
    }
  }

  render(){
    return(
      <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
      <ToastContainer/>
       
        <div className="clearfix">
          <div className="c-brdcrum">
            <a className="linkbtn hover-pointer" onClick={this.backToDashboard.bind(this)}>Back to Dashboard</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Student Details</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.backToDashboard.bind(this)} >Back</button>
              <button className="c-btn prime"  onClick={this.onSaveChanges.bind(this)}>Save changes</button>
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
              {this.renderPersonDetailCard()}
            </div>
          </div>
        </div>
        <ProfilePicModal onSelectProfile={(data)=> this.saveProfile(data)} userType={this.props.userType} showCancelBtn={true} {...this.props}/>
      </div>
    )
  }
}

const mapStateToProps = ({ app,student,auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  studentProfile:student.studentProfile,
  token: auth.token,
  userType: auth.userType,
  editStudentProfile:student.editStudentProfile,
  profileUpload:app.profileUpload,
  getProfilePicture: app.getProfilePicture,
  profilePictureUrl:app.profilePictureUrl
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStudentProfile,
      updateStudentProfile,
      profilePicUpload,
      getProfilePic
    },
    dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GetStudentProfile) 