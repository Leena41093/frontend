import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { forgotPassword } from '../../actions/authAction';
import { verifyPassword } from '../../actions/authAction';
import { OtpModel } from '../common/otpModel';
import { ToastContainer } from 'react-toastify';
import { errorToste } from '../../constant/util';
import $ from "jquery";
import './signin.css'
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      isMobileVisible: false,
    }
  }

  validate() {
    var isValidForm = true;
    if (!this.state.mobile || this.state.mobile.length != 10) {
      this.setState({ isMobileVisible: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  sendOtp() {
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
      let data = {
        payload: {
          mobile: this.state.mobile
        }
      }

      this.props.forgotPassword(data).then(() => {
        let res = this.props.passwordForgot
        if (res && res.status == 200) {
          if (res && res.data.status == 200) {
            $('#next2').click();
          }
          else if (res && res.data.status == 500) {
            errorToste(res.data.message);
          }
        }
      })
    }
  }

  handleMobileChange(event) {
    this.setState({ mobile: event.target.value, isMobileVisible: false });
  }

  backButton() {
    this.props.history.push("/")
  }

  renderForgotPassword() {
    return (
      <div className="c-card__items " >
        <div className="c-card__form">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="form-group static-fld">
                <label>Mobile Number<span style={{ color: "red", paddingLeft: "2px" }}>*</span></label>
                <input style={{ marginBottom: '10px' }}
                  type="text" data-test="email"
                  className="form-control"
                  placeholder="Enter Mobile Number"
                  value={this.state.mobile}
                  onChange={this.handleMobileChange.bind(this)}
                />
                {this.state.isMobileVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Registered Mobile Number</label> : <br />}
                <button className="c-btn primary" onClick={this.sendOtp.bind(this)} >Next</button>
                <button className="c-btn primary" onClick={this.backButton.bind(this)} >Back</button>
                <button className="link--btn" id='next2' hidden="hidden" data-toggle="modal" data-target="#otpenter">next</button>
              </div>


            </div>

          </div>

        </div>
      </div>

    )
  }

  goToLogin() {
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
            <a className="pull-right linkbtn hover-pointer" onClick={this.goToLogin.bind(this)} style={{ color: "white", fontSize: "15px", marginTop: "10px" }}>Login</a>
          </div>
        </div>
        <div className="c-container clearfix pattern-bg" >
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

                <div className="col-sm-4" style={{ border: "1px solid #A30000", borderRadius: "8px", paddingTop: "43px", marginTop: "20px" }}>
                  <div className="c-card__title">
                    <span className="c-heading-sm card--title">

                      Forgot Password
                          </span>
                  </div>

                  {this.renderForgotPassword()}

                </div>
              </div>
            </div>
          </div>
          <OtpModel   {...this.props} />
        </div>
      </div>

    )
  }

}

const mapStateToProps = ({ app, auth }) => ({
  passwordForgot: auth.passwordForgot,
  passwordVerify: auth.passwordVerify
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      forgotPassword,
      verifyPassword
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)