import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout } from '../../actions/authAction';
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  logout() {
    localStorage.clear();
    this.props.history.push('/');
    this.props.logout();
  }


  componentWillUnmount() {
    var ifConnected = window.navigator.onLine;
    if(ifConnected){
    window.fcWidget.destroy();
    }
  }

  getProfile() {
    let typeOfUser = this.props.userType;
    if (typeOfUser == 'PROFESSOR') {
      this.props.history.push('/app/get-professorProfile')
    }
    else if (typeOfUser == 'STUDENT') {
      this.props.history.push('/app/get-studentProfile')
    }
    else if (typeOfUser == 'INSTITUTE') {
      this.props.history.push('/app/get-professorProfile')
    }
    else if (typeOfUser == 'ADMIN') {
      this.props.history.push('/app/admin-getprofile')
    }

  }

  render() {
    let loginData = this.props.login;
    let loginData1 = this.props.authCheck;
    return (
      <div className="c-header">
        <ToastContainer />
        <div className="c-left-sect" style={{ width: "60%" }}>
          <a><img src="/./logo1.svg" alt="logo" style={{ width: "24%", maxHeight: "36px", display: "inline-block" }} /></a>
        </div>
        <div className="c-right-sect">
          <ul>
            <li>
              <div className="clearfix user--prof dropdown">
                <div className="user--img"><img src='/./user_avatar.png' alt="" /></div>
                <button className="user--options" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                  {/* {loginData ? (loginData.data.firstname.length > 8) ? loginData.data.firstname.slice(0, 5) + "..." : loginData.data.firstname : (loginData1.data.response.user_name.length > 8) ? loginData1.data.response.user_name.slice(0, 5) + "..." : loginData1.data.response.user_name} */}
                  <i className="icon"></i>
                </button>


                <div className="dropdown-menu cust--dd userprof--dd" aria-labelledby="dLabel">
                  <div className="userprof--dd_header">
                    <div className="user_img"><img src='/./user_avatar.png' alt="" /></div>
                    {/* <span className="user_name"> {loginData ? loginData.data.firstname : loginData1.data.response.user_name}</span> */}
                    <button className="btnuser_prof" onClick={this.getProfile.bind(this)} >View Profile</button>
                  </div>
                  <ul>
                    {/* <li className="linkbtn hover-pointer"><a onClick={this.passwordChange.bind(this)} >Change Password</a></li>
                    <li className="linkbtn hover-pointer"><a onClick={this.termsOfUse.bind(this)}>Terms of use</a></li>
                    <li className="linkbtn hover-pointer"><a onClick={this.privacyPolicy.bind(this)}>Privacy Policy</a></li> */}
                    <li className="linkbtn hover-pointer"><a onClick={this.logout.bind(this)}>Sign out</a></li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => ({
  userName: auth.userName,
  authCheck: auth.authCheck,
  login: auth.login,
  userType: auth.userType,
  token: auth.token
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logout,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Header)
