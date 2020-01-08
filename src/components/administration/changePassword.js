import React, { Component } from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { successToste, errorToste } from '../../constant/util';
import { checkingPassword, updatePassword } from '../../actions/index';

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {

      oldPassword: '',
      newPassword: '',
      confirmNewPw:'',
      userId: '',
      isOldPasswordVisible: false,
      isNewPasswordVisible: false,
      isConfirmNewPasswordVisible:false,
      isConfirmNewPwMatch:false
    }
  }

  componentDidMount() {
    
    this.setState({ userId: this.props.auth.login ? this.props.auth.login.data.userid : this.props.auth.authCheck.data.response.master_user_id})
  }

  handleChangeOldPassword(event) {
    
    this.setState({ oldPassword: event.target.value, isOldPasswordVisible: false })
  }

  handleChangeNewPassword(event) {
    
    this.setState({ newPassword: event.target.value, isNewPasswordVisible: false })
  }

  handleChangeConfirmNewPassword(event){
    this.setState({confirmNewPw:event.target.value,isConfirmNewPasswordVisible:false,isConfirmNewPwMatch:false})
  }

  validate() {
    let isValidForm = true;
    if (!this.state.oldPassword) {
      this.setState({ isOldPasswordVisible: true });
      isValidForm = false
    }
    if (!this.state.newPassword) {
      this.setState({ isNewPasswordVisible: true });
      isValidForm = false
    }
    if (!this.state.confirmNewPw) {
      this.setState({ isConfirmNewPasswordVisible: true });
      isValidForm = false
    }
    if (this.state.confirmNewPw != this.state.newPassword) {
      this.setState({ isConfirmNewPwMatch: true });
      isValidForm = false
    }
    return isValidForm;
  }

  passwordChange() {
    let typeOfUser = this.props.userType;
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
      let data = {
        payload: {
          old_password: this.state.oldPassword,
          new_password: this.state.newPassword
        },
        token: this.props.token
      }
      this.props.checkingPassword(data).then(() => {
        let res = this.props.passwordCheck;
        
        if (res && res.status == 200) {
          let data = {
            payload: {
              password: this.state.newPassword
            },
            user_id: this.state.userId,
            token: this.props.token
          }
          
          this.props.updatePassword(data).then(() => {
            let res = this.props.passwordUpdate
            
             if(typeOfUser == "PROFESSOR" || typeOfUser == "STUDENT"){
              
               this.props.history.push("/app/dashboard");
               
             }
             else if(typeOfUser == "ADMIN"){
              successToste("Password Updated Successfully")
              this.props.history.push("/app/class-manager")
             }
             successToste("Password Updated Successfully")
          })
          
        }
        else if (res && res.status == 500) {
          errorToste("Old Password Not Match")
        }
      })
    }
  }

  render() {
    
    return (
      <div className="form-login">
        <ToastContainer />
        <div className="custome-modal__heading">
          <h3 style={{ marginLeft: '50px' }}>Change Password</h3>
        </div>
        <div className="custome-modal__body">
          <div className="cust-m-info"></div>
          <div className="form-group cust-fld" style={{ padding: '25px' }}>
            <label>Old Password <sup>*</sup></label>
            <input
              type="password"
              className="form-control"
              placeholder="Old Password"
              value={this.state.oldPassword}
              onChange={this.handleChangeOldPassword.bind(this)}
            />
            {this.state.isOldPasswordVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Old Password</label> : <br />}
            <br/>
            <label style={{ marginTop: "20px" }}> New Password <sup>*</sup></label>
            <input type="password"
              className="form-control"
              placeholder="New Password"
              value={this.state.newPassword}
              onChange={this.handleChangeNewPassword.bind(this)}
            />
            {this.state.isNewPasswordVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter New Password</label> : <br />}
            <br/>
            <label style={{ marginTop: "20px" }}>Confirm New Password <sup>*</sup></label>
            <input type="password"
            className="form-control"
              placeholder="Confirm New Password"
              value={this.state.confirmNewPw}
              onChange={this.handleChangeConfirmNewPassword.bind(this)}
            />
            {this.state.isConfirmNewPasswordVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Confirm New Password</label> : this.state.isConfirmNewPwMatch ? <label className="help-block" style={{ color: "red" }}>Confirm Password Should Be Match With New Password</label> : <br />}
            
          </div>

        </div>
       
        <div className="clearfix text--right">
          
          <button style = {{marginLeft:"25px"}} className="c-btn primary" onClick={this.passwordChange.bind(this)} >Change</button>
        </div>
        

      </div>
    )
  }

}

const mapStateToProps = ({ app, auth }) => ({
  passwordCheck: app.passwordCheck,
  passwordUpdate: app.passwordUpdate,
  token: auth.token,
  auth: auth,
  userType: auth.userType,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkingPassword,
      updatePassword

    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)