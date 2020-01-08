import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import $ from "jquery";

export class AddBatchModal extends Component {
  
  constructor(props){
    super(props);
    this.state={
      editedBatch:this.getEmptyObject(),
      isBatchnameVisisble:false,
      isStartdateVisisble:false,
      isEnddateVisisble:false,
      className:'',
      subjectName:''
    }
  }

  componentDidMount(){
  }

  getEmptyObject(){
    return{
        name:'',
        start_date:moment(),
        end_date:moment().add(1,'years'),
    }
  }

  onNameInputChange(event){
    let {editedBatch} =this.state;
    editedBatch = { ...editedBatch,name:event.target.value}; 
    this.setState({editedBatch : editedBatch,isBatchnameVisisble:false});
  }

  onStartDateInputChange(date){
    let {editedBatch} =this.state;
    editedBatch = { ...editedBatch,start_date:date}; 
    this.setState({editedBatch : editedBatch,isStartdateVisisble:false});
  }

  onEndDateInputChange(date){
    let {editedBatch} =this.state;
    editedBatch = { ...editedBatch,end_date:date}; 
    this.setState({editedBatch:editedBatch,isEnddateVisisble:false});
  }

  validate(){
   
    let isValidForm = true;
    let {editedBatch} = this.state;
    let pattern =/^[0-9a-zA-Z- _]+$/ ;
    if(!editedBatch.name || !editedBatch.name.match(pattern) )
    {
      this.setState({ isBatchnameVisisble: true });
      isValidForm = false;
    }
    if(editedBatch.start_date == 0){
      
      this.setState({isStartdateVisisble:true});
      isValidForm = false;
    }
    if (!editedBatch.end_date || (moment(editedBatch.end_date).isBefore(editedBatch.start_date) || moment(editedBatch.end_date).isSame(editedBatch.start_date))) {
      
      this.setState({ isEnddateVisisble: true });
      isValidForm = false;
    }
    return isValidForm
  }

  handleNextClick(){
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else{
    let { editedBatch } =this.state;
    this.props.onBatchAdd({editedBatch});
    this.setState({editedBatch:this.getEmptyObject()});
    this.props.onModalClose()
    }
  }

  render() {
   
    return(
      <div className="custome-modal modal" id="newBatch" style={{display:"block"}} data-backdrop="static" data-keyboard="false" >  
        <div className="custome-modal__heading">
          Add New Batch
          <button className="close__modal act-c-modal" onClick={this.props.onModalClose}><i className="icon cg-times"></i></button>
        </div>
        <div className="custome-modal__body">
          <div className="cust-m-info" style={{marginBottom:"0px"}}>Create new Batch and add timings,professor and students in it.</div>
          
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="form-group static-fld" style={{marginTop:"0px",marginBottom:"0px"}}>
                <label>Class</label>
                <span className="info-type">{this.props.classNm}</span>
              </div>
            </div>
            <div className="divider-block text--left">
              <div className="form-group static-fld">
                <label>Subject</label>
                <span className="info-type">{this.props.subjectNm}</span>
              </div>
            </div>
          </div>
          
          <div className="form-group cust-fld" style={{marginTop:"-18px"}}>
            <label>Batch Name<sup>*</sup></label>
            <input type="text" 
            className="form-control" 
            placeholder="Enter Batch Name" 
            value={this.state.editedBatch.name}
            onChange={this.onNameInputChange.bind(this)}/>
            {this.state.isBatchnameVisisble ? <span className="help-block" style={{ color: "red" ,fontSize:"13px", fontWeight:"350"}}>Please Enter Valid  Batch Name </span>:<br/>}
          </div>
          <div className="row">
          <div className="form-group cust-fld col-sm-6" style={{marginTop:"0px"}}>
            <label>Start Date<sup>*</sup></label>
            <DatePicker  className="form-control fld--date"  selected={this.state.editedBatch.start_date?moment(this.state.editedBatch.start_date):moment()} onChange={this.onStartDateInputChange.bind(this)} />
            {this.state.isStartdateVisisble ? <label className="help-block" style={{ color: "red" }}>Enter Start date</label> : <br />}
           
          </div>
          <div className="form-group cust-fld col-sm-6" style={{marginBottom:"-26px",marginTop:"0px"}}>
            <label>End Date<sup>*</sup></label>
            <DatePicker className="form-control fld--date"  selected={this.state.editedBatch.end_date?moment(this.state.editedBatch.end_date):moment()} onChange={this.onEndDateInputChange.bind(this)} />
          </div>
          <div className="form-group cust-fld" style={{marginTop:"0px"}}>
          {this.state.isEnddateVisisble? <span className="help-block" style={{ color: "red" ,marginBottom:"2px",fontSize:"13px", fontWeight:"350",marginLeft:"14px"}}> End Date Should Be Greater Than Start Date</span> : <br />}
          </div>
          <div style={{marginTop:"5px", fontSize:"10px"}} className="cust-m-info color-red">Once the batch end date is passed,all students will be removed from batch.</div>
          </div>
          
          
          <br/>
        </div>
        <div className="divider-container">
          <div className="divider-block"><button className="c-btn-large clean act-c-modal" onClick={this.props.onModalClose} style={{border:"1px solid lightgray"}}>Cancel</button></div>
          <div className="divider-block">
          <button className="c-btn-large primary st-modal"
          onClick={this.handleNextClick.bind(this)}
          >Next</button></div>
        </div>
      
      </div>
    )
  }
}
