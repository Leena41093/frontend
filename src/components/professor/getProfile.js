import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
// import { getProfessorProfile, updateProfessorProfile } from '../../actions/professorActions';
// import { ProfilePicModal } from '../common/profilepic';
import DatePicker from 'react-datepicker';
import { profilePicUpload, getProfilePic } from '../../actions/index';
import moment from 'moment';
import $ from 'jquery';
class GetProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      professorDetail: [],
      editable: false,
      isFirstNameVisible: false,
      isLastNameVisible: false,
      isPhoneNumberVisible: false,
      isEmailVisible: false,
      isCollegeVisible: false,
      isDobVisible: false,
      isECNVisible: false,
      isECVisible: false,
      isAddressVisible: false,
      userProfileUrl: "/images/avatars/Avatar_Default.jpg",
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

  componentWillMount() {
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorProfile(apiData).then(() => {
      let res = this.props.professorProfile;

      if (res && res.status == 200) {
        this.setState({ professorDetail: res.data.response[0] })

      }
    })
  }

  componentDidMount() {
    this.setState({instituteId:this.props.instituteId});
    const data = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token
    }
    this.props.getProfilePic(data).then(() => {
      var res = this.props.getProfilePicture
      if (res && res.status == 200) {
        this.setState({ userProfileUrl: res.response.profilePicture != "" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg" })
      }
      else if (res && res.status == 500) {
        this.setState({ userProfileUrl: "/images/avatars/Avatar_Default.jpg" })
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

  validate() {
    let { professorDetail } = this.state;
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
      if (professorDetail.emergency_contact.length  != 10) {
        this.setState({ isECVisible: true });
        isValidForm = false
      }else{
        this.setState({ isECVisible: false });
      }
    }
    return isValidForm;
  }

  onPersonalDetailChange(propertyName, event) {
    if (propertyName == 'firstname') {
      this.setState({ isFirstNameVisible: false });
    }
    if (propertyName == 'lastname') {
      this.setState({ isLastNameVisible: false });
    }
    if (propertyName == "mobile") {
      this.setState({ isPhoneNumberVisible: false })
    }
    if (propertyName == "emergency_contact") {
      this.setState({ isECVisible: false })
    }
    let { professorDetail } = this.state;
    professorDetail = { ...professorDetail, [propertyName]: event.target.value };
    this.setState({ professorDetail });
  }

  onSaveChanges(event) {
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      let apiData = {
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: {
          "firstname": this.state.professorDetail.firstname,
          "lastname": this.state.professorDetail.lastname,
          "mobile": this.state.professorDetail.mobile,
          "address": "pune",
          "DOB": this.state.professorDetail.DOB,
          "emergency_contact_name": this.state.professorDetail.emergency_contact_name,
          "emergency_contact": this.state.professorDetail.emergency_contact,
          "college": this.state.professorDetail.college
        }
      }

      this.props.updateProfessorProfile(apiData).then(() => {
        let res = this.props.editProfessorProfile;

        let { editable } = !this.state.editable;
        this.setState({ editable });
        if (res && res.data.status == 200) {
          successToste("Profile Updated Successfully");
        }
        else if (res && res.data.status == 500) {
          errorToste(this.titleCase(res.data.message));
        }
        else {
          errorToste("Something Went Wrong");
        }
      })
    }
  }

  OnChangeEditable() {
    let editable = !this.state.editable;
    this.setState({ editable })
  }

  handleChange(date) {
    let { professorDetail } = this.state;
    if (date == null) {
      professorDetail = { ...professorDetail, DOB: moment() };
    }
    else {
      professorDetail = { ...professorDetail, DOB: date };
    }
    this.setState({ professorDetail });
  }

  backToDirectory() {
    let res = this.props.professorProfile;
    let type = this.props.userType;
    if (type == 'PROFESSOR' && (res.data.response && res.data.response[0].isProfessorAdmin) == true) {
      this.props.history.push('/app/dashboard');
    }
    else if (type == 'INSTITUTE' && (res.data.response && res.data.response[0].isProfessorAdmin) == false) {
      this.props.history.push('/app/class-manager')
    }
    else if (type == 'PROFESSOR' && (res.data.response && res.data.response[0].isProfessorAdmin) == false) {
      this.props.history.push('/app/dashboard');
    }
  }

  saveProfile(data) {
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
            this.setState({ userProfileUrl: res.response.profilePicture != "" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg" })
          }
          else if (res && res.status == 500) {
            this.setState({ userProfileUrl: "/images/avatars/Avatar_Default.jpg" })
          }
        })
        successToste("Profile Set Successfully");
      }
    })
  }

  renderPersonDetailCard() {
    if (this.state.editable) {

      return (
        <div className="row">
          <div className="col-sm-6">
            <div className="clearfix">
              <div className="c-card__form">
                <div className="form-group cust-fld">
                  <label>First Name <sup>*</sup></label>
                  <input type="text" className="form-control" value={this.state.professorDetail.firstname} onChange={this.onPersonalDetailChange.bind(this, "firstname")} placeholder="First Name" />
                  {this.state.isFirstNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Name</label> : <br />}
                </div>
                <div className="form-group cust-fld">
                  <label>Last Name <sup>*</sup></label>
                  <input type="text" className="form-control" value={this.state.professorDetail.lastname} onChange={this.onPersonalDetailChange.bind(this, "lastname")} placeholder="Last Name" />
                  {this.state.isLastNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Name</label> : <br />}
                </div>
                <div className="divider-container">
                  <div className="divider-block text--left">
                    <div className="form-group cust-fld">
                      <label>Phone <sup>*</sup></label>
                      <input type="Number" min="1" value={this.state.professorDetail.mobile} onChange={this.onPersonalDetailChange.bind(this, "mobile")} className="form-control" placeholder="Phone" />
                      {this.state.isPhoneNumberVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Phone Number</label> : <br />}
                    </div>
                    <div className="form-group cust-fld">
                      <label>Email</label>
                      <input type="email" value={this.state.professorDetail.email} className="form-control" placeholder="Email" />
                      {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Email</label> : <br />}
                    </div>
                  </div>

                </div>
                <div className="form-group cust-fld">
                  <label>College</label>
                  <input type="text" value={this.state.professorDetail.college} className="form-control" onChange={this.onPersonalDetailChange.bind(this, 'college')} placeholder="College" />
                  {this.state.isCollegeVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter College Name</label> : <br />}
                </div>

                <div className="form-group cust-fld">
                  <label>Date of Birth</label>
                  <DatePicker className="form-control fld--date" selected={moment(this.state.professorDetail.DOB)} onChange={this.handleChange.bind(this)} />
                  {this.state.isDobVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Date of Birth</label> : <br />}
                </div>
                <div className="form-group cust-fld">
                  <label>Guardian Name</label>
                  <input type="text" value={this.state.professorDetail.emergency_contact_name} className="form-control" onChange={this.onPersonalDetailChange.bind(this, "emergency_contact_name")} placeholder="Emergency Contact Name" />
                  {this.state.isECNVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Emergency Contact Name</label> : <br />}
                </div>
                <div className="form-group cust-fld">
                  <label>Guardian Phone</label>
                  <input type="number" min="1" className="form-control" value={this.state.professorDetail.emergency_contact} onChange={this.onPersonalDetailChange.bind(this, 'emergency_contact')} placeholder="Emergency Contact" />
                  {this.state.isECVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Emergency Phone Number</label> : <br />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="row">
          <div className="col-sm-6">
            <div className="c-card__form">
              <div className="divider-container">
                <div className="divider-block text--left">
                  <div className="form-group static-fld">
                    <label>First Name</label>
                    <span className="info-type">{this.state.professorDetail ? this.state.professorDetail.firstname != "" ? this.state.professorDetail.firstname : "Not Added Yet" : "Not Added Yet"}</span>
                  </div>
                  <div className="form-group static-fld">
                    <label>Last Name</label>
                    <span className="info-type">{this.state.professorDetail ? this.state.professorDetail.lastname != "" ? this.state.professorDetail.lastname : "Not Added Yet" : "Not Added Yet"}</span>
                  </div>
                  <div className="form-group static-fld">
                    <label>Phone</label>
                    <span className="info-type">{this.state.professorDetail ? this.state.professorDetail.mobile != "" ? this.state.professorDetail.mobile : "Not Added Yet" : "Not Added Yet"}</span>
                  </div>
                </div>
              </div>
              <div className="form-group static-fld">
                <label>Email</label>
                <span className="info-type">{this.state.professorDetail ? this.state.professorDetail.email != "" ? this.state.professorDetail.email : "Not Added Yet" : "Not Added Yet"}</span>
              </div>
              <div className="form-group static-fld">
                <label>College</label>
                <span className="info-type st-disabled">{this.state.professorDetail ? this.state.professorDetail.college != "" ? this.state.professorDetail.college : "Not Added Yet" : "Not Added Yet"}</span>
              </div>
              <div className="form-group static-fld">
                <label>Date of Birth</label>
                <span className="info-type st-disabled">{this.state.professorDetail ? this.state.professorDetail.DOB != "" ? moment(this.state.professorDetail.DOB).format("MM-DD-YYYY") : "Not Added Yet" : "Not Added Yet"}</span>
              </div>
              <div className="form-group static-fld">
                <label>Emergency Contact Name</label>
                <span className="info-type st-disabled">{this.state.professorDetail ? this.state.professorDetail.emergency_contact_name != "" ? this.state.professorDetail.emergency_contact_name : "Not Added Yet" : "Not Added Yet"}</span>
              </div>
              <div className="form-group static-fld">
                <label>Emergency Contact</label>
                <span className="info-type st-disabled">{this.state.professorDetail ? this.state.professorDetail.emergency_contact != "" ? this.state.professorDetail.emergency_contact : "Not Added Yet" : "Not Added Yet"}</span>
              </div>
            </div>
            <div className="c-card__btnCont">
              <button className="c-btn primary btn-custom" onClick={this.OnChangeEditable.bind(this)} >Edit Personal Details</button>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="c-user-pic pull-left">
              <div className="user--img"><img src={this.props.profilePictureUrl} alt="Avatar" /></div>
              <button className="link--btn" data-toggle="modal" data-target="#newprofilepic">Change Picture</button>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a className="linkbtn hover-pointer" onClick={this.backToDirectory.bind(this)}>Back to Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Staff Details</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.backToDirectory.bind(this)} >Back</button>
              <button className="c-btn prime" onClick={this.onSaveChanges.bind(this)}>Save changes</button>
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
        {/* <ProfilePicModal onSelectProfile={(data) => this.saveProfile(data)} userType={this.props.userType} Gender={this.state.professorDetail.gender} showCancelBtn={true}{...this.props} /> */}
      </div>
    )
  }
}

const mapStateToProps = ({ app,  auth }) => ({
  // professorProfile: professor.professorProfile,
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  userType: auth.userType,
  // editProfessorProfile: professor.editProfessorProfile,
  profileUpload: app.profileUpload,
  getProfilePicture: app.getProfilePicture,
  profilePictureUrl: app.profilePictureUrl
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // getProfessorProfile,
      // updateProfessorProfile,
      profilePicUpload,
      getProfilePic
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GetProfile)    