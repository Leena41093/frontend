import React, { Component } from 'react';
import $ from 'jquery';
export class AddClassModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editedClass: this.props.editedClass ? this.props.editedClass : this.getEmptyClass(),
      isClassnameVisisble: false,
      isClassnameValid: false
    }
  }

  componentDidMount() {

    $("#newclassName").on('hide.bs.modal', function () {

      $(this).data('bs.modal', null);
    });
  }

  getEmptyClass() {
    return {
      class_name: '',
      class_id: ''
    }
  }

  onInputChange(event) {
    let { editedClass } = this.state;
    editedClass = { ...editedClass, class_name: event.target.value };
    this.setState({ editedClass, isClassnameVisisble: false });
  }

  validate() {

    let isValidForm = true;
    let { editedClass } = this.state;
    let pattern = /^[0-9a-zA-Z- _]+$/;
    if (!editedClass.class_name || !editedClass.class_name.match(pattern)) {

      this.setState({ isClassnameVisisble: true });
      isValidForm = false;
    }
    return isValidForm
  }

  handleNextClick() {
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      let { editedClass } = this.state;
      this.props.onClassAdd({ editedClass });
    }
  }

  onModalClose() {
    $('body').removeClass('modal-open')
    $('.modal-overlay').fadeOut('fast', function () {
      $(this).remove();
    });
    $(".custome-modal").fadeOut('fast');
    this.props.onModalClose();
  }

  render() {
    return (
      <div className="custome-modal" id="newclassName" style={{ display: "block" }}>
        <div className="custome-modal__heading">
          Add New class
            <button className="close__modal act-c-modal" onClick={this.onModalClose.bind(this)}><i className="icon cg-times"></i></button>
        </div>
        <div className="custome-modal__body">
          <div className="cust-m-info">Create new class and add subjects in it.</div>
          <div className="form-group cust-fld">
            <label>Class Name<sup>*</sup></label>
            <input type="text"
              className="form-control"
              placeholder="Enter Class Name"
              value={this.state.editedClass.class_name}
              onChange={this.onInputChange.bind(this)} />
            {this.state.isClassnameVisisble ? <span className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Please Enter Valid Class Name </span> : <br />}
            {/* {this.state.isClassnameValid ? <span className="help-block" style={{ color: "red" }}>Please enter valid classname</span>:<br/>} */}
          </div>
        </div>
        <div className="divider-container">
          <div className="divider-block">
            <button className="c-btn-large clean act-c-modal" onClick={this.props.onModalClose} style={{ border: "1px solid lightgray" }}>Cancel</button></div>
          <div className="divider-block">
            <button
              className="c-btn-large primary st-modal"
              onClick={this.handleNextClick.bind(this)}>Next</button></div>
        </div>
      </div>
    )
  }
}