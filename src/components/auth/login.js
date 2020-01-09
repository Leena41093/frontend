import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { errorToste } from '../../constant/util';
import { ToastContainer } from 'react-toastify';
import { loginStudent, storeStudentToken, checkAuth } from '../../actions/authAction';
import './bootstrap-spacing.css'
import $ from 'jquery'
class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailVisible: false,
      isPasswordVisible: false,
      flag: true
    }
  }


  componentDidMount() {

    var baseUrl = document.URL
    var uri_dec = decodeURIComponent(baseUrl);
    var url = new URL(uri_dec);
    var userid = url.searchParams.get("userid");
    var password = url.searchParams.get("auth");
    if (userid) {
      this.setState({ email: userid, password: password }, () => {
        this.handelSubmit();
      });
    }
    else {
      let localData = localStorage.getItem("persist:root");
      if (JSON.parse(localData) && JSON.parse(localData).auth && JSON.parse(JSON.parse(localData).auth) && JSON.parse(JSON.parse(localData).auth).token) {
        if (JSON.parse(JSON.parse(localData).auth).user_type != "INSTITUTE" || JSON.parse(JSON.parse(localData).auth).user_type != "ADMIN") {
          this.props.history.push('/app/dashboard');
        }
        else {
          this.props.history.push('/app/class-manager');
        }
      }
    }
    let self = this;
    $(document).keypress(function (e) {
      if (e.which == 13) {
        if (self.state.flag == true) {
          self.setState({ flag: false }, () => { self.handelSubmit() })
        }
      }
    });
  }

  handleEmailChange(event) {

    let email = event.target.value;
    this.setState({ email: email, isEmailVisible: false });
  }

  handlePassChange(event) {
    this.setState({
      password: event.target.value, isPasswordVisible: false
    })
  }

  getForgotPasswordPage() {
    this.props.history.push("forgotpassword")
  }

  validate() {
    var isValidForm = true;
    if (!this.state.email) {
      this.setState({ isEmailVisible: true });
      isValidForm = false;
    }
    if (!this.state.password) {
      this.setState({ isPasswordVisible: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  handelSubmit(event) {
    const isValidForm = this.validate();
    let apiData = {
      payload: {
        "email": this.state.email, "password": this.state.password,
      }
    }
    if (!isValidForm) {
      return;
    }
    else {
      this.props.checkAuth(apiData).then(() => {
        let res = this.props.authCheck;


        if (res && res.data.status == 200) {

          if (res.data.response.token == "new") {


            this.props.loginStudent(apiData).then(() => {
              let res = this.props.login;

              if (res && res.status == 200) {
                let data = {
                  payload: {
                    "master_user_id": res.data.userid,
                    "token": res.data.token,
                    "user_type": res.data.user_type,
                  }
                }
                this.props.storeStudentToken(data).then(() => {
                  if (res.data.user_type == "STUDENT" || res.data.user_type == "PROFESSOR") {
                    this.props.history.push('/app/dashboard');
                  } else if (res.data.user_type == "INSTITUTE" || res.data.user_type == "ADMIN") {
                    this.props.history.push('/app/class-manager');
                  }
                })

              }
              else {
                errorToste("Invalid User,Please Check Username and Password")
              }
            })
          } else {
            let data = {
              payload: {
                "master_user_id": res.data.response.master_user_id,
                "token": res.data.response.token,
                "user_type": res.data.response.user_type,
              }
            }
            this.props.storeStudentToken(data).then(() => {

              if (res.data.response.user_type == "STUDENT" || res.data.response.user_type == "PROFESSOR") {
                this.props.history.push('/app/dashboard');
              } else if (res.data.response.user_type == "INSTITUTE" || res.data.response.user_type == "ADMIN") {
                this.props.history.push('/app/class-manager');
              }
            })
          }
        }
        else if (res && res.data.status == 500) {
          this.props.loginStudent(apiData).then(() => {
            let res = this.props.login;

            if (res && res.status == 200) {
              let data = {
                payload: {
                  "master_user_id": res.data.userid,
                  "token": res.data.token,
                  "user_type": res.data.user_type,
                }
              }
              this.props.storeStudentToken(data).then(() => {
                if (res.data.user_type == "STUDENT" || res.data.user_type == "PROFESSOR") {
                  this.props.history.push('/app/dashboard');
                } else if (res.data.user_type == "INSTITUTE" || res.data.user_type == "ADMIN") {
                  this.props.history.push('/app/class-manager');
                }
              })

            }
            else {
              errorToste("Invalid User,Please Check Username and Password")
            }

          })
        }

      })

    }
  }

  render() {
    return (
      <div >
        <ToastContainer />
        <div className="spacer d-none d-md-block"></div>
        <div className="container">
          <div className="cg-card row justify-content-center ">
            <div style={{background:"#FFFFFF"}} className="col-12 col-md-6 col-lg-8 bg-maroon p-4">
              <img src="/images/img/logo1.svg" height="30" />

              <img className="illustration mt-4" src="/images/img/splashScreen.jpeg" />
            </div>
            <div className="col-12 col-md-6 col-lg-4 bg-white p-4">
              <h2>
                Welcome!
                </h2>
              <p className="d-none d-md-block">
                Please login to your  account.
              </p>
              <div className="d-none d-md-block">
                
                <form className="mt-3">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" value={this.state.email} onChange={this.handleEmailChange.bind(this)} placeholder="Email" />
                    {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }} >Please Enter Valid Email</label> : <div></div>}
                  </div>
                  <div className="form-group pt-1">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={this.state.password} onChange={this.handlePassChange.bind(this)} placeholder="Password" />
                    {this.state.isPasswordVisible ? <label className="help-block" style={{ color: "red" }} >Please Enter Valid Password</label> : <div></div>}
                  </div>
                </form>
                <button  className="btn btn-primary btn-block mt-4" onClick={this.handelSubmit.bind(this)}>Login</button>
                <div className="mt-2">
                  <a className="linkbtn hover-pointer"  onClick={this.getForgotPasswordPage.bind(this)}>Forgot Password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="spacer d-none d-md-block"></div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  login: auth.login,
  storeToken: auth.storeToken,
  authCheck: auth.authCheck
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loginStudent,
      storeStudentToken,
      checkAuth
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Login)
