import React, { Component } from 'react';
import { validateFormField } from '../../helpers/validate';


export class AddEnquiryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enquiry: {
        firstname: "",
        phone: '',
        email: '',
        class_name: '',
        note: '',

      },
      isEdit: false,
      isFirstnameVisible: false,
      isMobileVisible: false,
      isEmailVisible: false,
      isClassnameVisible: false,
      isNotesVisible: false,
      isEmailValidationVisible: false,
    }
  }


  componentWillReceiveProps(newstate) {
    if (newstate.enquiry != null) {
      this.setState({ isEdit: newstate.enquiry.isEdit })
    }

    let enquiry = newstate.enquiry;

    if (!newstate.enquiry) {
      enquiry = this.getEmptyEnquiry();
    }
    else {
      let firstname = enquiry.firstname + " " + enquiry.lastname;
      enquiry = { ...enquiry, firstname, class_id: this.getClassId(enquiry.class_name) };
    }

    this.setState({ enquiry })
  }

  getEmptyEnquiry() {
    return {

      firstname: "",
      mobile: '',
      email: '',
      class_name: 0,
      note: '',
      class_id: ""
    }

  }

  getClassName(classId) {
    let class_name = '';
    this.props.classes.map((cls, index) => {
      if (cls.class_id == classId) {
        class_name = cls.class_name;
      }
    });
    return class_name;
  }

  onClassChange(event) {
    const classId = event.target.value;
    let { enquiry } = this.state;
    // let class_name = enquiry.class_name;
    enquiry = { ...enquiry, class_id: classId, class_name: this.getClassName(classId) }
    this.setState({ enquiry, isClassnameVisible: false });

  }

  handleCreateEnquiry() {
    const isValidForm = this.validate();

    if (!isValidForm) {
      return;
    }
    else {
      let { enquiry } = this.state;
      this.props.onAddEnquiry({ enquiry });
    }
  }

  onInputChange(property, event) {
    if (property == "firstname") {
      this.setState({ isFirstnameVisible: false })
    }
    if (property == "mobile") {
      this.setState({ isMobileVisible: false })
    }
    if (property == "email") {
      this.setState({ isEmailVisible: false })
    }
    let { enquiry } = this.state;
    // let firstname = enquiry.firstname;
    enquiry = { ...enquiry, [property]: event.target.value }
    this.setState({ enquiry });
  }

  validate() {

    let { enquiry } = this.state;
    let isValidForm = true;
    // var regx = /^[a-zA-Z ]+$/
    if (enquiry.firstname.length == 0) {
      this.setState({ isFirstnameVisible: true });
      isValidForm = false;
    }
    var pattern = /^[0-9]+$/;
    if (enquiry.mobile.length === 0 || enquiry.mobile.length != 10 || !enquiry.mobile.match(pattern)) {
      this.setState({ isMobileVisible: true });
      isValidForm = false;
    }
    let validemail = this.state.enquiry.email;
    if (validemail != "") {
      if (!validateFormField("email", enquiry.email)) {
        this.setState({ isEmailVisible: true })
        isValidForm = false;
      }
    }
    return isValidForm;
  }

  handleCancle() {
    this.setState({
      isFirstnameVisible: false, isMobileVisible: false,
      isClassnameVisible: false, isNoteVisible: false
    })
  }

  getButtonLabel() {
    if (this.state.isEdit) {
      return 'Save Enquiry';
    }
    return 'Create Enquiry';
  }

  getClassId(class_name) {
    let class_id = '';
    if (this.props.classes && this.props.classes.length > 0) {
      this.props.classes.map((cls, index) => {
        if (cls.class_name === class_name) {
          class_id = cls.class_id;
        }
      });
    }
    return class_id;
  }

  renderClassDropdown() {
    if (this.props.classes && this.props.classes.length > 0) {
      return this.props.classes.map((data, index) => {
        return (
          <option key={"key" + index} value={data.class_id}  >{data.class_name}</option>
        )
      });
    }
  }

  render() {
    let id = `addnewEnquiry${this.props.from ? this.props.from : ""}`;
    return (
      <div className="modal fade custom-modal-sm width--lg" id={id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.handleCancle.bind(this)} data-dismiss="modal" aria-label="Close" ><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">NEW ENQUIRY</h4>
            </div>
            <div className="modal-body">

              <div className="row">

                <div className="col-md-6 com-sm-12">
                  <div className="form-group cust-fld">
                    <label>Full Name<sup>*</sup></label>
                    <input type="text" className="form-control" value={this.state.enquiry.firstname} onChange={this.onInputChange.bind(this, "firstname")} placeholder="Full Name Goes Here" />
                    {this.state.isFirstnameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Fullname</label> : <br />}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Phone<sup>*</sup></label>
                    <input type="Number" className="form-control" value={this.state.enquiry.mobile || ''} onChange={this.onInputChange.bind(this, "mobile")} placeholder="Phone" />
                    {this.state.isMobileVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Mobile Number</label> : <br />}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Email Address </label>
                    <input type="email" className="form-control" value={this.state.enquiry.email || ''} onChange={this.onInputChange.bind(this, "email")} placeholder="Email Address" />
                    {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Email  </label> : <br />}

                  </div>
                </div>

                <div className="col-md-6 com-sm-12">
                  <div className="form-group cust-fld">
                    <label>Desired Class</label>
                    <div className="dropdown-custome">
                      <select style={{ color: "#3D3F61", fontSize: "14px" }} value={this.getClassId(this.state.enquiry.class_name)} onChange={this.onClassChange.bind(this)}>
                        {this.renderClassDropdown()}
                      </select>

                    </div>
                    {/* {this.state.isClassnameVisible ? <label className="help-block" style={{ color: "red" }}>Please Select Classname</label> : <br />}  */}
                  </div>


                  <div className="form-group cust-fld">
                    <label>Note </label>
                    <textarea type="text" className="form-control" value={this.state.enquiry.note || ''} onChange={this.onInputChange.bind(this, "note")} placeholder="Note"></textarea>
                    {/* {this.state.isNoteVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Note</label> : <br />} */}
                  </div>
                </div>

              </div>

            </div>

            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" onClick={this.handleCancle.bind(this)} data-dismiss="modal">Cancel</button>
                <button className="c-btn primary" onClick={this.handleCreateEnquiry.bind(this)}>{this.getButtonLabel()}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default (AddEnquiryModal)