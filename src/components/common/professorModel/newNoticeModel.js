import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export class NewNoticeModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newNotice: {
        batch_id:"",
        notice_date: moment(),
        notice_text: "",
      },
      batchList:[],
      isNoticeTextEmpty:false,
      batchId:"",
      disabledflag:false
    }
  }

  componentWillReceiveProps(nextProps){
    let disabledflags = true
    if(this.props.disabledflag != true){
      disabledflags= false
    }
    else{
      var newNotice=this.state.newNotice;
      newNotice = {...newNotice,batch_id: nextProps.batchId}
      this.setState({newNotice})
    }
    
    this.setState({batchId:nextProps.batchId,disabledflag:disabledflags})
  }

  componentDidMount() {
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token:this.props.token,
    }
    this.props.professorBatchList(apiData).then(() => {
      let res = this.props.batchList
      if(res && res.data.status == 200){
       var newNotice=this.state.newNotice;
       newNotice = {...newNotice,batch_id: res.data.response && res.data.response[0].batch_id}
       this.setState({batchList:res.data.response,newNotice});
      }
    })
  }

  handleNoticesDateChange(date) {
    let { newNotice } = this.state;
    newNotice = { ...newNotice, notice_date: date }
    this.setState({ newNotice });
  }

  handleNoticesTextChange(event) {
    let { newNotice } = this.state;
    newNotice = { ...newNotice, notice_text: event.target.value }
    this.setState({ newNotice,isNoticeTextEmpty : false });
  }

  handleCancel(){
    let {newNotice} = this.state;
    newNotice = {...newNotice,notice_text:''}
    this.setState({newNotice})
  }
   
  validate(){
    
    let isValidForm = true;
    let {newNotice ,isNoticeTextEmpty}= this.state;
   
    if(newNotice.notice_text.length==0){
      this.setState({isNoticeTextEmpty:true});
      isValidForm = false;
    }
    return isValidForm;
  }

  onHandleClick() {
   
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
    let { newNotice,batchList } = this.state;
    let data = newNotice;
      if(data.batch_id.length == 0){
        data.batch_id = this.state.batchId
      }
    newNotice = { ...newNotice, notice_text: "" }
    newNotice = { ...newNotice, notice_date: moment() }
    this.setState({ newNotice });
    
    this.props.onCreateNewNotice(data);
    }
  }

  onSelectBatch(event){
    let {newNotice} = this.state;
    newNotice = {...newNotice,batch_id: Number(event.target.value)}
    this.setState({newNotice});
  }

  renderBatch(){
    let {batchList} = this.state;
    if(batchList && batchList.length > 0){
      return batchList.map((batch,index)=>{
        if(this.props.batchdetailflag == true){
          if(this.state.batchId == batch.batch_id){
          return(
            <option key={"batch"+index} value={batch.batch_id}>{batch.name}</option> 
          ) 
          }
        }
        else if(this.props.batchdetailflag == false){
        return(
          <option key={"batch"+index} value={batch.batch_id}>{batch.name}</option> 
        )
        }
      })
    }
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm" id="createNotice" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCancel.bind(this)}><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">New Notice</h4>
            </div>
            <div className="modal-body">
              <div className="cust-m-info">Enter date for notice and write your notice.</div>
              <div className="form-group cust-fld">
                <label>Date</label>
                <DatePicker className="form-control fld--date" selected={moment(this.state.newNotice.notice_date)} onChange={this.handleNoticesDateChange.bind(this)} disabled/>
              </div>
              <div className="form-group static-fld">
                <label>Batch</label>
                <div className="dropdown-custome">
                  <select style={{color:"#3D3F61",fontSize:"14px",cursor: "pointer"}} value={this.state.newNotice.batch_id} onChange={this.onSelectBatch.bind(this)} disabled={this.state.disabledflag == true ? true : false}>
                  {this.renderBatch()}
                  </select>
                </div>
              </div>
              <div className="form-group cust-fld">
                <label>Notice</label>
                <textarea className="form-control" value={this.state.newNotice.notice_text} placeholder="Notice" onChange={this.handleNoticesTextChange.bind(this)}></textarea>
                {this.state.isNoticeTextEmpty ? <label className="help-block" style={{ color: "red" }}>Enter Notice Text</label> : <br />}
              </div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal" onClick={this.handleCancel.bind(this)}>Cancel</button>
                <button className="c-btn primary" onClick={this.onHandleClick.bind(this)}>Create Notice</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
