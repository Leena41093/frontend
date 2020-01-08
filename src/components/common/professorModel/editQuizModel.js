import React, { Component } from 'react';
import {errorToste,successToste} from '../../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";
export class EditQuizModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quizDetail: {},
      error:{
         "quiz_title":false,
         "quiz_topic":false,
         "marks_for_each_question":false,
         isDurationEnter:false,
         },
    }
  }

  componentWillReceiveProps(props) {
    
    this.setState({ quizDetail: props.quiz });
    
  }

  validate() {
    
    let {  error,quizDetail } = this.state;
    let isValidForm = true;
    
    if (!quizDetail.quiz_title) {
      error = { ...error, quiz_title: true };
      isValidForm = false;
    }

    // if (!quizDetail.quiz_topic) {
    //   error = { ...error, quiz_topic: true };
    //   isValidForm = false;
    // }
     
    if (!quizDetail.marks_for_each_question) {
      error = { ...error, marks_for_each_question: true };
      isValidForm = false;
    }

    if (quizDetail.marks_for_each_question == 0) {
      error = { ...error, marks_for_each_question: true };
      isValidForm = false;
    }

    if (!quizDetail.duration) {
      error = { ...error, isDurationEnter: true };
      isValidForm = false;
    }
    if(quizDetail.duration == 0){
      error = { ...error, isDurationEnter: true };
      isValidForm = false;
    }

    this.setState({ error });
    return isValidForm;
  }

  onInputChange(property, event) {
    let { quizDetail,error } = this.state;
    quizDetail = { ...quizDetail, [property]: event.target.value };
    error={...error,[property]:false};
    this.setState({ quizDetail,error });
  }

  onDurationChange(event) {
    let {  quizDetail, error } = this.state;
    error = { ...error, isDurationEnter: false }
    quizDetail ={...quizDetail,duration: event.target.value}
    this.setState({ quizDetail, error });
  }

  onEditQuiz() {
    const isValidForm = this.validate();
   
    if (!isValidForm) {
      return;
    }
    else {
    let { quizDetail } = this.state;
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token:this.props.token,      
      payload: {
        quiz_id: quizDetail.quiz_id,
        "quiz_title": quizDetail.quiz_title,
        "quiz_topic": quizDetail.quiz_title,
        "marks_for_each_question": Number(quizDetail.marks_for_each_question),
        duration:quizDetail.duration
      }
    }
    this.props.updateQuizDetail(apiData).then(()=>{
      let res = this.props.editquizdetail;
      if(res && res.status == 200){
        successToste("Quiz Details Updated Successfully")
      }
      $("#editQuiz .close").click();
    })
  }
  }

  render() {
    let { quizDetail,error } = this.state;
    return (
      <div className="modal fade custom-modal-sm width--lg" id="editQuiz" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
         <ToastContainer/>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">SAVE QUIZ</h4>
            </div>
            <div className="modal-body">
              <div className="divider-container addBatch-container">
                <div className="divider-block">
                  {/* <div className="cust-m-info">Enter details for the quiz.</div> */}
                  <span style={{ fontWeight: "bold", fontSize: "15px" }}>{quizDetail.class_name} - {quizDetail.subject_name}</span>
                  {/* <div className="form-group cust-fld">
                    <label>Class</label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {quizDetail.class_name}
                      </button>
                    </div>
                  </div>
                  <div className="form-group cust-fld">
                    <label>Subject</label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {quizDetail.subject_name}
                      </button>
                    </div>
                  </div> */}
                  <div className="form-group cust-fld">
                    <label>Quiz Title <sup>*</sup></label>
                    <input type="text" className="form-control" value={quizDetail.quiz_title || ''} onChange={this.onInputChange.bind(this, "quiz_title")} placeholder="Quiz Title" />
                    {error.quiz_title ? <label className="help-block" style={{ color: "red" }}>Enter Quiz Title</label> : <br />}
                  </div>

                  {/* <div className="form-group cust-fld">
                    <label>Topic of Quiz (Optional)</label>
                    <input type="text" className="form-control" value={quizDetail.quiz_topic || ''} onChange={this.onInputChange.bind(this, "quiz_topic")} placeholder="Quiz Title" />
                    {error.quiz_topic ? <label className="help-block" style={{ color: "red" }}>Enter Quiz Topic</label> : <br />}
                  </div> */}

                  <div className="form-group cust-fld">
                    <label>Folder <sup>*</sup></label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {quizDetail.Subject_folder}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="divider-block">
                  
                  <div className="form-group cust-fld" style={{marginTop:"42px"}}>
                    <label>Marks for each question</label>
                    <input type="Number" className="form-control" min="1" value={quizDetail.marks_for_each_question || ''} onChange={this.onInputChange.bind(this, "marks_for_each_question")} placeholder="Marks For Each Question" />
                    {error.marks_for_each_question ? <label className="help-block" style={{ color: "red" }}>Please Enter Non Zero Marks</label> : <br />}
                  </div>

                  <div className="form-group cust-fld" >
                    <label>Duration<sup>*</sup></label>
                    <input  type="number" value={quizDetail.duration} min="1"  className="form-control fld--time" placeholder="Enter End Time In Minutes" onChange={this.onDurationChange.bind(this)} />
                    {error.isDurationEnter ? <label className="help-block" style={{ color: "red" }}>Please Enter Non Zero Duration</label> : <br />}
                  </div>

                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal">Cancel</button>
                <button className="c-btn primary" onClick={this.onEditQuiz.bind(this)}>Save Quiz</button>
                <button className="c-btn primary" onClick={this.props.onEditQuestionPage}>Edit Question</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default (EditQuizModal)