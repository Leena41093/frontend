import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { successToste, errorToste } from '../../constant/util';
import { getAdminProfileData, updateAdminProfileData,getIsProfessorAdmin } from '../../actions/index';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { getProfessorProfile, updateProfessorProfile } from '../../actions/professorActions';
import { profilePicUpload, getProfilePic } from '../../actions/index';
import { ProfilePicModal } from '../common/profilepic';
import $ from 'jquery';

class AdminGetProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      professorDetail: [],
      adminDetail: [],
      editable: false,
      isFirstNameVisible: false,
      isLastNameVisible: false,
      isAddressVisible: false,
      isMobileVisible: false,
      isCollegeVisible: false,
      isDobVisible: false,
      isECNVisible: false,
      isECVisible: false,
      userProfileUrl: "/images/avatars/Avatar_default.jpg",
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

  componentDidMount() {
    this.setState({instituteId:this.props.instituteId})
    this.getUserProfile();
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }

  getUserProfile() {
    if (this.props.userType == "ADMIN") {
      const downloadPic = {
        institudeId: this.props.instituteId,
        branchId: this.props.branchId,
        token: this.props.token
      }
      this.props.getProfilePic(downloadPic).then(() => {
        var res = this.props.getProfilePicture

        if (res && res.status == 200) {

          this.setState({ userProfileUrl: res.response.profilePicture != null ? res.response.profilePicture : "/images/avatars/Avatar_default.jpg" })
        }
        else if (res && res.status == 500) {

          this.setState({ userProfileUrl: "/images/avatars/Avatar_default.jpg" })
        }
      })
      let data = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.getAdminProfileData(data).then(() => {
        let res = this.props.adminProfileData
        if (res && res.status == 200) {
          this.setState({ adminDetail: res.response.profileDetails })
        }

      })
    }
    else if (this.props.userType == "INSTITUTE") {
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
  }

  backToDirectory() {
    let res = this.props.professorProfile;
    let type = this.props.userType;

    if (type == 'INSTITUTE' && (res.data.response && res.data.response[0].isProfessorAdmin) == false) {
      this.props.history.push('/app/faculty-directory')
    }
    else if (type == "ADMIN") {
      this.props.history.push('/app/class-manager')

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
          var resprofilepicture = this.props.getProfilePicture

          if (resprofilepicture && resprofilepicture.status == 200) {

            this.setState({ userProfileUrl: resprofilepicture.response.profilePicture != null ? resprofilepicture.response.profilePicture : "/images/avatars/Avatar_default.jpg" })
          }
          else if (resprofilepicture && resprofilepicture.status == 500) {

            this.setState({ userProfileUrl: "/images/avatars/Avatar_default.jpg" })
          }
        })
        successToste("Profile Set Successfully");
      }

    })
  }

  onSaveChanges() {
    if (this.props.userType == "ADMIN") {
      const isValidForm = this.validate();
      if (!isValidForm) {
        return;
      }
      else {
        let data = {
          payload: {
            firstname: this.state.adminDetail.firstname,
            lastname: this.state.adminDetail.lastname,
            email: this.state.adminDetail.email,
            address: this.state.adminDetail.address,
            mobile: this.state.adminDetail.mobile

          },
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
        }
        this.props.updateAdminProfileData(data).then(() => {
          let { editable } = !this.state.editable;
          this.setState({ editable });
          successToste("Profile Updated Successfully");
        })
      }
    }
    else if (this.props.userType == "INSTITUTE") {
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
          if (res && res.data.status == 500) {
            errorToste(this.titleCase(res.data.message));
          }
          else if (res && res.data.status == 200) {
            let { editable } = !this.state.editable;
            this.setState({ editable });
            successToste("Profile Updated Successfully");
          }
          else {
            errorToste("Something Went Wrong");
          }
        })
      }
    }
  }

  validate() {
    let { adminDetail, professorDetail } = this.state;
    var isValidForm = true;
    if (this.props.userType == "ADMIN") {
      var regx = /^[a-zA-Z ]+$/;
      if (adminDetail.firstname.length == 0 || !adminDetail.firstname.match(regx)) {
        this.setState({ isFirstNameVisible: true });
        isValidForm = false
      }
      if (adminDetail.lastname.length == 0 || !adminDetail.lastname.match(regx)) {
        this.setState({ isLastNameVisible: true });
        isValidForm = false
      }
      if (adminDetail.mobile.length == 0 || adminDetail.mobile.length != 10) {

        this.setState({ isMobileVisible: true });
        isValidForm = false
      }
      if (!adminDetail.address) {
        this.setState({ isAddressVisible: true });
        isValidForm = false
      }
      return isValidForm;
    }
    else if (this.props.userType == "INSTITUTE") {
      if (professorDetail.firstname.length == 0 || !professorDetail.firstname.match(regx)) {
        this.setState({ isFirstNameVisible: true });
        isValidForm = false
      }
      if (professorDetail.lastname.length == 0 || !professorDetail.lastname.match(regx)) {
        this.setState({ isLastNameVisible: true });
        isValidForm = false
      }
      if (professorDetail.mobile.length == 0 || professorDetail.mobile.length != 10) {
        this.setState({ isMobileVisible: true });
        isValidForm = false
      }
      return isValidForm;
    }
  }

  onPersonalDetailChange(property, event) {
    if (this.props.userType == "ADMIN") {
      if (property == 'firstname') {
        this.setState({ isFirstNameVisible: false });
      }
      if (property == 'lastname') {
        this.setState({ isLastNameVisible: false });
      }
      if (property == 'mobile') {
        this.setState({ isMobileVisible: false });
      }
      if (property == "address") {
        this.setState({ isAddressVisible: false })
      }
      let { adminDetail } = this.state;
      adminDetail = { ...adminDetail, [property]: event.target.value };
      this.setState({ adminDetail });
    }
    else if (this.props.userType == "INSTITUTE") {
      if (property == 'firstname') {
        this.setState({ isFirstNameVisible: false });
      }
      if (property == 'lastname') {
        this.setState({ isLastNameVisible: false });
      }
      if (property == "mobile") {
        this.setState({ isMobileVisible: false })
      }
      let { professorDetail } = this.state;
      professorDetail = { ...professorDetail, [property]: event.target.value };
      this.setState({ professorDetail });
    }
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

  OnChangeEditable() {
    let editable = !this.state.editable;
    this.setState({ editable })
  }

  renderPersonDetailCard() {
    if (this.props.userType == "ADMIN") {
      if (this.state.editable) {

        return (
          <div className="row">
            <div className="col-sm-6">

              <div className="clearfix">
                <div className="c-card__form">
                  <div className="form-group cust-fld">
                    <label>First Name <sup>*</sup></label>
                    <input type="text" className="form-control" value={this.state.adminDetail.firstname} onChange={this.onPersonalDetailChange.bind(this, "firstname")} placeholder="First Name" />
                    {this.state.isFirstNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid FirstName</label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Last Name <sup>*</sup></label>
                    <input type="text" className="form-control" value={this.state.adminDetail.lastname} onChange={this.onPersonalDetailChange.bind(this, "lastname")} placeholder="Last Name" />
                    {this.state.isLastNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid LastName</label> : <br />}
                  </div>
                  <div className="divider-container">
                    <div className="divider-block text--left">
                      <div className="form-group cust-fld">
                        <label>Phone <sup>*</sup></label>
                        <input type="number" min="1" value={this.state.adminDetail.mobile} className="form-control" onChange={this.onPersonalDetailChange.bind(this, "mobile")} placeholder="Phone" />
                        {this.state.isMobileVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Phone Number</label> : <br />}
                      </div>
                      <div className="form-group cust-fld">
                        <label>Email</label>
                        <input type="email" value={this.state.adminDetail.email} className="form-control" placeholder="Email" />
                        {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Email</label> : <br />}
                      </div>
                    </div>

                  </div>
                  <div className="form-group cust-fld">
                    <label>Address</label>
                    <input type="text" value={this.state.adminDetail.address} className="form-control" onChange={this.onPersonalDetailChange.bind(this, 'address')} placeholder="Address" />
                    {this.state.isAddressVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Address</label> : <br />}
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
                      <span className="info-type">{this.state.adminDetail ? this.state.adminDetail.firstname != "" ? this.state.adminDetail.firstname : "Not Added Yet" : "Not Added Yet"}</span>
                    </div>
                    <div className="form-group static-fld">
                      <label>Last Name</label>
                      <span className="info-type">{this.state.adminDetail ? this.state.adminDetail.lastname != "" ? this.state.adminDetail.lastname : "Not Added Yet" : "Not Added Yet"}</span>
                    </div>
                    <div className="form-group static-fld">
                      <label>Phone</label>
                      <span className="info-type">{this.state.adminDetail ? this.state.adminDetail.mobile != "" ? this.state.adminDetail.mobile : "Not Added Yet" : "Not Added Yet"}</span>
                    </div>
                  </div>
                </div>
                <div className="form-group static-fld">
                  <label>Email</label>
                  <span className="info-type">{this.state.adminDetail ? this.state.adminDetail.email != "" ? this.state.adminDetail.email : "Not Added Yet" : "Not Added Yet"}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Address</label>
                  <span className="info-type st-disabled">{this.state.adminDetail ? this.state.adminDetail.address != "" ? this.state.adminDetail.address : "Not Added Yet" : "Not Added Yet"}</span>
                </div>



              </div>
              <div className="c-card__btnCont">
                <button className="c-btn primary btn-custom" onClick={this.OnChangeEditable.bind(this)} >Edit Personal Details</button>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="c-user-pic pull-left">
                <div className="user--img"><img src={this.state.userProfileUrl} alt="Avatar" /></div>
                <button className="link--btn" data-toggle="modal" data-target="#newprofilepic">Change Picture</button>
              </div>
            </div>
          </div>
        )
      }
    }
    else if (this.props.userType == "INSTITUTE") {
      if (this.state.editable) {

        return (
          <div className="row">
            <div className="col-sm-6">
              <div className="clearfix">
                <div className="c-card__form">
                  <div className="form-group cust-fld">
                    <label>First Name</label>
                    <input type="text" className="form-control" value={this.state.professorDetail.firstname} onChange={this.onPersonalDetailChange.bind(this, "firstname")} placeholder="First Name" />
                    {this.state.isFirstNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Name</label> : <br />}
                  </div>
                  <div className="form-group cust-fld">
                    <label>Last Name</label>
                    <input type="text" className="form-control" value={this.state.professorDetail.lastname} onChange={this.onPersonalDetailChange.bind(this, "lastname")} placeholder="Last Name" />
                    {this.state.isLastNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Name</label> : <br />}
                  </div>
                  <div className="divider-container">
                    <div className="divider-block text--left">
                      <div className="form-group cust-fld">
                        <label>Phone</label>
                        <input type="number" value={this.state.professorDetail.mobile} className="form-control" onChange={this.onPersonalDetailChange.bind(this, "mobile")} placeholder="Phone" />
                        {this.state.isMobileVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Phone Number</label> : <br />}
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
                <div className="user--img"><img src={this.state.userProfileUrl} alt="Avatar" /></div>
                <button className="link--btn" data-toggle="modal" data-target="#newprofilepic">Change Picture</button>
              </div>
            </div>
          </div>

        )
      }
    }
  }

  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a onClick={this.backToDirectory.bind(this)}>Back to Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Admin Details</span>
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
        <ProfilePicModal onSelectProfile={(data) => this.saveProfile(data)} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({

  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  userType: auth.userType,
  adminProfileData: app.adminProfileData,
  adminProfileUpdate: app.adminProfileUpdate,
  professorProfile: professor.professorProfile,
  editProfessorProfile: professor.editProfessorProfile,
  profileUpload: app.profileUpload,
  getProfilePicture: app.getProfilePicture,
  profilePictureUrl: app.profilePictureUrl,
  ProfessorAdmin:app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAdminProfileData,
      updateAdminProfileData,
      getProfessorProfile,
      updateProfessorProfile,
      profilePicUpload,
      getProfilePic,
      getIsProfessorAdmin
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(AdminGetProfile) 