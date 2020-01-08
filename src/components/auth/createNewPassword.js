import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { updateForgotPassword ,changePasswordForgotPage} from '../../actions/authAction';
import { ToastContainer } from 'react-toastify';
import { updatePassword } from '../../actions/index'
import { successToste} from '../../constant/util';


class CreateNewPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      userId: '',
      confirmNewPw:'',
      isPasswordVisible: false,
      isConfirmNewPasswordVisible:false,
      isConfirmNewPwMatch:false,
    }
  }

  componentDidMount() {
    const pro = this.props.location.data ? this.props.location.data : "";
    
    
    if(pro.email && pro.master_user_id){
      this.setState({ email: pro.email ,  userId: pro.master_user_id })
    }
     else{
      this.props.history.push("/")
       
     }
  }

  handleChangeNewPassword(event) {
    this.setState({ password: event.target.value,isPasswordVisible:false })
  }

  handleChangeConfirmNewPassword(event) {
    this.setState({ confirmNewPw: event.target.value ,isConfirmNewPasswordVisible:false,isConfirmNewPwMatch:false})
  }

  validate() {
    let isValidForm = true;
    if (!this.state.password) {
      this.setState({ isPasswordVisible: true });
      isValidForm = false
    }
    if (!this.state.confirmNewPw) {
      this.setState({ isConfirmNewPasswordVisible: true });
      isValidForm = false
    }
    if (this.state.password != this.state.confirmNewPw) {
      this.setState({ isConfirmNewPwMatch: true });
      isValidForm = false
    }
    return isValidForm;
  }

  changePassword() {
    const isValidForm =  this.validate();
    if (!isValidForm) {
      return;
    } else {

      let data = {
        payload: {
          password: this.state.password
        },
        user_id: this.state.userId,
      }
      this.props.updateForgotPassword(data).then(() => {
        let res = this.props.forgotPasswordUpdate
        
        if (res && res.status == 200) {
          let data = {
            payload:{
              new_password:this.state.password,
              master_user_id:res.data.id
            }
            
          }
          this.props.changePasswordForgotPage(data).then(()=>{
            let res =  this.props.changePassword;
            if(res && res.status == 200){
              this.props.history.push('/');
          successToste("Password Changed Successfully")
            }      
          })
          
        }
      })
    }
  }
  backButton(){
    this.props.history.push("/");
  }
  renderChangePassword(){
    return(
    <div className="c-card__items " >
      <div className="c-card__form">
          <div className="divider-container">
              <div className="divider-block text--left">
                  <div className="form-group static-fld">
                  <label>Email<span style={{color:"red",paddingLeft:"2px"}}>*</span></label>
                  <input
              type="text" data-test="password"
              className="form-control"
              placeholder="Email"
              value={this.state.email}

            />
            <label style={{ marginTop: "20px" }}> New Password <span style={{color:"red",paddingLeft:"2px"}}>*</span></label>
            <br/>
            <input type="password"

              data-test="password"
              className="form-control"
              placeholder="New Password"
              value={this.state.password}
              onChange={this.handleChangeNewPassword.bind(this)}
            />
            {this.state.isPasswordVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Password</label> : <br />}
            <br/>
            <label>Confirm New Password <span style={{color:"red",paddingLeft:"2px"}}>*</span></label>
            <input type="password"


              className="form-control"
              placeholder="Confirm New Password"
              value={this.state.confirmNewPw}
              onChange={this.handleChangeConfirmNewPassword.bind(this)}
            />
            {this.state.isConfirmNewPasswordVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Confirm New Password</label> : this.state.isConfirmNewPwMatch ? <label className="help-block" style={{ color: "red" }}>Confirm Password Should Be Match With New Password</label> : <br />}
           {/* <button className="c-btn grayshade" style={{ marginLeft: "800px", marginTop: "-10px" }}>Cancel</button> */}
          <button className="c-btn primary"  onClick={this.changePassword.bind(this)}>Change</button>
          <button className="c-btn primary"  onClick={this.backButton.bind(this)}>Back</button>

                  </div>
                  
               
              </div>
            
          </div>

      </div>
  </div>
    )
  }

  goToLogin(){
    this.props.history.push("/");
  }

  render() {
    return (
      <div>
      <div className="c-header">
        <ToastContainer />
        <div className="c-left-sect" style={{ width: "60%" }}>
          <a><img src="/./logo3.jpg" className="center" alt="logo" style={{ width: "24%", maxHeight: "36px", display: "inline-block" }} /></a>
        </div>
        <div className="c-right-sect" style={{ width: "30%" }}>
          <a className="pull-right linkbtn hover-pointer" onClick={this.goToLogin.bind(this)} style={{color:"white",fontSize:"15px",marginTop:"10px"}}>Login</a>
        </div>
        </div>
      <div className="c-container clearfix">
      <ToastContainer />

      <div className="clearfix">
          <div className="divider-container">

              <div className="divider-block text--right">
                  {/* <button className="c-btn grayshade" onClick={this.backButton.bind(this)}>Back</button> */}

              </div>
          </div>
      </div>
      <div className="c-container__data">
          <div className="card-container" style={{ height: '580px' }}>
              <div className="c-card">
                  <div className="col-sm-4"></div>
                  
                  <div className="col-sm-4"  style={{ border: "1px solid #A30000",borderRadius: "8px",paddingTop: "43px",marginTop:"20px",paddingBottom:"17px"}}>
                      <div className="c-card__title">
                          <span className="c-heading-sm card--title">
                         
                             Change Password
                          </span>
                      </div>

                      {this.renderChangePassword()}

                  </div>
              </div>
          </div>
      </div>
  </div>
</div>


      // <div className="form-login">
      //   <ToastContainer />
      //   <div className="custome-modal__heading">
      //     <h3 style={{ marginLeft: '50px' }}>Change Password</h3>
      //   </div>
      //   <div className="custome-modal__body">
      //     <div className="cust-m-info"></div>
      //     <div className="form-group cust-fld" style={{ padding: '25px' }}>
      //       <label>Email</label>
      //       <input
      //         type="text" data-test="password"
      //         className="form-control"
      //         placeholder="Email"
      //         value={this.state.email}

      //       />
      //       {/* {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Email</label> : <br />} */}
      //              </div>
      //   </div>
        
      //   <div className="clearfix text--right">
      //     {/* <button className="c-btn grayshade" style={{ marginLeft: "800px", marginTop: "-10px" }}>Cancel</button> */}
      //     <button className="c-btn primary" style={{ marginLeft: "30px"}} onClick={this.changePassword.bind(this)}>Change</button>
      //   </div>
       

      // </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  token: auth.token,
  auth: auth,
  forgotPasswordUpdate: auth.forgotPasswordUpdate,
  changePassword:auth.changePassword
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePassword,
      updateForgotPassword,
      changePasswordForgotPage
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewPassword)