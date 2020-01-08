
import React, { Component } from 'react';

export class AddSubjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedSubject: this.props.editedSubject ? this.props.editedSubject : this.getEmptyObject(),
      isSubjectnameVisisble: false,
      subjectBatchList: [],
      flag: true,
      batchNameArray: [],
      batchIdArray: [],
      batchSelected: [],

    }
  }

  getEmptyObject() {
    return {
      subject_name: '',
      subject_id: ''
    }
  }

  componentDidMount() {
    let data = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
      payload: {
        "class_id": this.props.classId
      }
    }
    this.props.getSubjectBatchList(data).then(() => {
      const res = this.props.getSubBatchList;

      if (res && res.data.status == 200) {
        let checkedArray = [];
        res.data.response.forEach(() => {
          checkedArray.push(false);
        })
        this.setState({ subjectBatchList: res.data.response, batchSelected: checkedArray }, () => {
        })
      }
    })
  }

  handleBatchClick(batchid, batchname, index) {
    let { batchNameArray, batchIdArray, batchSelected } = this.state;
    if (batchSelected[index] == false) {
      batchSelected.splice(index, 1, true)
      batchIdArray.push(batchid);
      batchNameArray.push(batchname);
      this.setState({ batchIdArray, batchNameArray, batchSelected })
    }
    else if (batchSelected[index] == true) {
      batchSelected.splice(index, 1, false)
      batchIdArray.splice(index, 1);
      batchNameArray.splice(index, 1);
      this.setState({ batchIdArray, batchNameArray, batchSelected })
    }

  }

  renderBatchList() {
    var batchArray = [];
    this.state.subjectBatchList.map((item, index) => {
      batchArray.push(<li style={{ marginLeft: "10px" }} key={"index" + index}><input type="checkbox" value={item.batch_id} style={{ marginLeft: "10px", fontSize: "16px" }} onClick={this.handleBatchClick.bind(this, item.batch_id, item.batch_name, index)} /><span style={{ marginLeft: "5px" }}>{item.batch_name}</span></li>);
    });
    return batchArray;
  }

  onInputChange(event) {
    let { editedSubject } = this.state;
    editedSubject = { ...editedSubject, subject_name: event.target.value };
    this.setState({ editedSubject, isSubjectnameVisisble: false });
  }

  validate() {
    let isValidForm = true;
    let { editedSubject } = this.state;
    let pattern = /^[0-9a-zA-Z- _]+$/;
    if (!editedSubject.subject_name || !editedSubject.subject_name.match(pattern)) {

      this.setState({ isSubjectnameVisisble: true });
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
      let { editedSubject, batchIdArray } = this.state;
      this.props.onSubjectAdd({ editedSubject, batchIdArray });
    }
  }

  render() {
    return (
      <div className="custome-modal" id="newSubjectName" style={{ display: "block" }}>
        <div className="custome-modal__heading">
          Add New Subject
          <button className="close__modal act-c-modal" onClick={this.props.onModalClose}><i className="icon cg-times"></i></button>
        </div>
        <div className="custome-modal__body">
          <div className="cust-m-info">Create new subject and add batches in it</div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="form-group static-fld">
                <label>Class</label>
                <span className="info-type">{this.props.classNm}</span>
              </div>
            </div>
          </div>
          <div className="form-group cust-fld">
            <label>Subject Name<sup>*</sup></label>
            <input type="text"
              className="form-control"
              placeholder="Enter Subject Name"
              value={this.state.editedSubject.subject_name}
              onChange={this.onInputChange.bind(this)} />
            {this.state.isSubjectnameVisisble ? <span className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Please Enter Valid Subject Name </span> : <br />}
          </div>
          <div className="form-group cust-fld">
            <label>Select Batches</label>
            <div className="dropdown">
              <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 dropdown">


                <button style={{width:"182px",marginLeft:"-13px"}} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {String(this.state.batchNameArray)}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dLabel" style={{ height: "100px", overflow: "auto" }} placeholder="Select Batches">
                  {this.renderBatchList()}
                </ul>
              </div>
            </div>
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <button className="c-btn-large primary">Add</button>
            </div>

          </div>
        </div>
        <div className="divider-container">
          <div className="divider-block"><button className="c-btn-large clean act-c-modal" onClick={this.props.onModalClose} style={{ border: "1px solid lightgray" }}>Cancel</button></div>
          <div className="divider-block">
            <button className="c-btn-large primary st-modal"
              onClick={this.handleNextClick.bind(this)}>Next</button></div>
        </div>

      </div>
    )
  }
}
