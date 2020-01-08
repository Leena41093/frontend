import React, { Component } from 'react';
import $ from "jquery";
import { errorToste } from '../../constant/util';

export class OtpModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
     otp:'',
     isOtpVisible:false,
    }
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }
  
  validate(){
    var isValidForm = true;
    if(!this.state.otp)
    {
      this.setState({isOtpVisible:true});
      isValidForm = false;
    }
    return isValidForm;
  }

  verifyOtp(){
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
    let data = {
      payload:{
        otp:this.state.otp
      }
    }
    this.props.verifyPassword(data).then(()=>{
      let res = this.props.passwordVerify;
      if(res && res.data.status == 200){
        
        $('#cancel2').click();
        this.props.history.push(
          {
            pathname:'newpassword',
            data:res.data.response
        });

      }
      else if(res && res.data.status == 500){
        errorToste(this.titleCase(res.data.message))
      }
    })
   }
  }

  handleChangeOtp(event){
   this.setState({otp:event.target.value,isOtpVisible:false})
  }

  render() {
    
    return (
      <div className="modal fade custom-modal-sm" id="otpenter" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              
            </div>
            <div className="modal-body">
             <label >Enter OTP</label>
              <input style={{ marginBottom: '10px' }}
                type="Number" data-test="email"
                className="form-control"
                placeholder="Enter OTP"
                value={this.state.otp}
                onChange={this.handleChangeOtp.bind(this)}
              /> 
              {this.state.isOtpVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid OTP</label> : <br />}
            </div>
            <div className="modal-footer">
              <div className="divider-container nomargin">
                <div className="divider-block">
                  <button className="c-btn-large grayshade" data-dismiss="modal">Cancel</button>
                </div>
                <div className="divider-block">
                  <button  className="c-btn-large primary" onClick={this.verifyOtp.bind(this)}>Submit</button>
                  <button className="c-btn-large grayshade" id='cancel2'  hidden="hidden" data-dismiss="modal">Cancel1</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default (OtpModel)