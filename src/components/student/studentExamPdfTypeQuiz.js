import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'bootstrap-datepicker';
import { getStudentQuizExam, submitQuizTypePDF, quizStartExamStatusChange, getResumeQuizData, resumePdfQuiz, downloadStudentQuizFile } from '../../actions/studentAction';
import { getBranches } from '../../actions/index';
import {  errorToste, infoToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { StopWatch } from '../../constant/stopWatch';
import $ from 'jquery';
import Viewer from '../common/pdf/viewer';


class StudentExamPdfTypeQuiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pro: {},
      quizData: [],
      fileData: [],
      questionAnsArray: [],
      remainingQuestionCount: 0,
      id: "",
      count_timer: 0,
      pdfData: null,
      flag:true,
      strict_mode:false
    }
  }

  componentWillMount() {
    // this.startsync();
  }

  // startsync() {
  //   const pro = this.props.location.state.data;
  //   let id = setInterval(() => { this.updateStudentAnswer(pro) }, 10000)
  //   this.setState({ id }, () => {
  //   });
  // }

  componentDidMount() {
    const pro =  this.props.location.state ? this.props.location.state.data :"";
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    this.getQuizExamData(pro);
    this.setState({strict_mode:pro.strict_mode},()=>{
      if(this.state.strict_mode == true){
      this.goInFullscreen($("#typequizfullscreen").get(0));
      }
    });
  }

  goInFullscreen(element) {
    if (element.requestFullscreen)
      element.requestFullscreen();
    else if (element.mozRequestFullScreen)
      element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen)
      element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen)
      element.msRequestFullscreen();
  }

  getQuizExamData(pro) {
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token:this.props.token,
      payload: {
        "quiz_type": pro.quiz_type,
        "batch_quiz_id": pro.batch_quiz_id,
        "quiz_id": pro.quiz_id
      }
    }
    if (pro.attemptStatus === "INPROGRESS") {
      this.props.getResumeQuizData(apiData).then(() => {
        let res = this.props.resumeQuizData
        if (res && res.status == 200) {
          this.setState({
            quizData: res.data.response.quizPreview[0],
            fileData: res.data.response.quizFile[0]
          }, () => {
            this.downloadQuizData(pro);


            let { questionAnsArray, quizData, remainingQuestionCount, count_timer } = this.state;
            count_timer = (quizData.time_taken) / 10;
            let numberOfOptionsArr = JSON.parse("[" + quizData.no_of_options + "]");
            let numberOfAnswersArr = JSON.parse("[" + quizData.answer + "]");
            numberOfOptionsArr.map((option, index) => {
              if (numberOfAnswersArr[index]) {
                remainingQuestionCount++;
              }
              questionAnsArray.push({
                ans: numberOfAnswersArr[index],
                option: option,
                question: index + 1
              })
            });
            this.setState({ questionAnsArray, pro, remainingQuestionCount, count_timer })
          })
        }
      })
    } else {
      // this.statusChange(pro);
      this.props.getStudentQuizExam(apiData).then(() => {
        let res = this.props.quizData
        if (res && res.status == 200 && res.data.response.quizData) {
          this.setState({
            quizData: res.data.response.quizData[0],
            fileData: res.data.response.quizFile[0]
          }, () => {
            this.downloadQuizData(pro);
            let { questionAnsArray } = this.state;
            let NumberOfOptionsArr = JSON.parse("[" + this.state.quizData.no_of_options + "]");
            NumberOfOptionsArr.map((option, index) => {
              questionAnsArray.push({
                ans: "0",
                option: option,
                question: index + 1
              })
            })
            this.setState({
              questionAnsArray,
              pro,
              remainingQuestionCount: NumberOfOptionsArr.length
            })
          })
        }
      })
    }
  }

  downloadQuizData(pro) {
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token:this.props.token,
      payload: {
        "batch_quiz_id": pro.batch_quiz_id,
        "quiz_id": pro.quiz_id
      }
    }
    this.props.downloadStudentQuizFile(data).then(() => {
      let res = this.props.quizfileData;
     
      if (res && res.data.status == 200) {
        this.setState({ pdfData: res.data.response });
       
      }else if (res && res.data.status == 500){
        errorToste('Something Went Wrong')
      }
    })
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  convertDataURIToBinary(raw) {
    var raw = atob(raw);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  gotoQuizDirectory(batch) {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    this.props.history.push({
      pathname: 'studentquiz-directory',state:{data:pro1}
    })
  }

  onSubmitQuiz() {
    $("#quizTimeout .close").click();
    // $("#quizSubmit .close").click();
    this.submitExam()
  }

  onSubmitQuizONCross(){
    $("#quizTimeout .close").click();
  }

  onSubmitQuizBysubmitModel(){
    $("#quizSubmit .close").click();
    this.submitExam() 
  }

  onResumeQuiz() {
    let { id } = this.state;
    clearInterval(id);
    this.props.history.push('studentquiz-directory');
  }

  submitExam() {
    let { questionAnsArray, pro, fileData, id } = this.state;
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    let ans = [];
    let que_number = [];
    questionAnsArray.map((question, index) => {
      ans.push(question.ans);
      que_number.push(question.question);
    })

    let payload = {
      "batch_quiz_id": pro.batch_quiz_id,
      "quiz_id": pro.quiz_id,
      "submission_date": moment(),
      "time_taken": pro.duration,
      "marks": 0,
      "total": 0,
      "questions_no": String(que_number),
      "answer": String(ans),
      "quiz_marks": 0,
      "quiz_files_id": fileData.quiz_files_id,
      "count_timer": 0
    }
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token:this.props.token,
      payload: payload,
    }
    this.props.submitQuizTypePDF(apiData).then(() => {
      let res = this.props.quizPdfTypeSubmissionResponse;
      if (res && res.status == 200) {
        clearInterval(id);
        infoToste("PDF Quiz Submitted Successfully");
        this.props.history.push({
          pathname: 'studentresult_pdftype',
          state: { data: pro ,data1:pro1}
        })
      }
    })
  }

  handleOptionButton(index, event) {
    let { questionAnsArray } = this.state;
    questionAnsArray[index] = { ...questionAnsArray[index], ans: event.target.value }
    let count = 0;
    this.setState({ questionAnsArray }, () => {
      questionAnsArray.map((question, index) => {
        if (question.ans === "0") {
          count++;
        }
      })
      this.setState({ remainingQuestionCount: count })
    });
  }

  stopMethod() {
    $("#timeout").click();
  }

  

  renderOption(index) {
    let { questionAnsArray } = this.state;
    let length = Number(questionAnsArray[index].option);
    let answer = String(questionAnsArray[index].ans);

    switch (length) {
      case 2: {
        return (
          <div className="queList__body">
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 1} className="custome-field field-radiobtn">
                  <input type="radio" name={index} onClick={this.handleOptionButton.bind(this, index)} id={"quetion" + index + 1} checked={answer === "1" ? true : false} value="1" />
                  <i></i> <span>Option 1</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 2} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 2} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "2" ? true : false} value="2" />
                  <i></i> <span>Option 2</span>
                </label>
              </div>
            </div>
          </div>
        )
        break;
      }
      case 3: {
        return (
          <div className="queList__body">
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 3} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 3} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "1" ? true : false} value="1" />
                  <i></i> <span>Option 1</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 4} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 4} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "2" ? true : false} value="2" />
                  <i></i> <span>Option 2</span>
                </label>
              </div>
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 5} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 5} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "3" ? true : false} value="3" />
                  <i></i> <span>Option 3</span>
                </label>
              </div>
            </div>
          </div>
        )
        break;
      }
      case 4: {
        return (
          <div className="queList__body">
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 6} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 6} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "1" ? true : false} value="1" />
                  <i></i> <span>Option 1</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 7} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 7} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "2" ? true : false} value="2" />
                  <i></i> <span>Option 2</span>
                </label>
              </div>
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 8} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 8} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "3" ? true : false} value="3" />
                  <i></i> <span>Option 3</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 9} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 9} onClick={this.handleOptionButton.bind(this, index)} checked={answer === "4" ? true : false} value="4" />
                  <i></i> <span>Option 4</span>
                </label>
              </div>
            </div>
          </div>
        )
        break;
      }
    }
  }

  renderQuizFile() {
    let { pdfData } = this.state;
    if (pdfData) {
      return (
        <div style={{ width: "100%" }}>
          {/* <Viewer url={this.convertDataURIToBinary(pdfData)} readonly={true} /> */}
          <iframe src={pdfData+"#toolbar=0"} style={{ width: "100%", height: "550px" }} frameBorder="0"></iframe>
        </div>
      )
    } else {
      return false
    }
  }

  renderQuizQuestionList() {
    let { questionAnsArray } = this.state;
    if (questionAnsArray && questionAnsArray.length > 0) {
      return questionAnsArray.map((question, index) => {
        return (
          <div key={"question" + index} className="c-queList__sect">
            <div className="c-queList__sect__num">{index + 1}</div>
            {this.renderOption(index)}
          </div>
        )
      })
    }
  }

  renderStopWatch() {
    let { pro, quizData } = this.state;
    let time = 0;
    if (pro.attemptStatus === "INPROGRESS") {
      let time_taken = quizData.time_taken;
      time = (pro.duration * 60) - time_taken;

    } else {
      time = pro.duration * 60;
    }

    if (pro.duration == 'Untimed') {
      return (
        <div></div>
      )
    } else {
      return (
        <div>
          {time ? <span className="marks-detl"><StopWatch date={Number(time)} stopMethod={this.stopMethod.bind(this)} /></span> : ""}
        </div>
      )
    }

  }

  goFullScreen(){
    if(this.state.flag == true){
      this.goInFullscreen($("#typequizfullscreen").get(0));
     }
  }
  
  // changeFlag(flags){
  //   this.setState({flag : !flags},()=>{
  //    if(this.state.flag == true){
  //      $("#submitquiz").click();
  //    } 
  //   })
  // }

  render() {
    const pro = this.props.location.state.data;
    let flags = this.state.flag;
    var self = this
    document.onfullscreenchange = function ( event ) {

      self.setState({flag : !flags},()=>{
        if(self.state.flag == true){
          self.onSubmitQuizBysubmitModel();
        } 
       })

  }; 
    return (
      <div className="c-container clearfix" id="typequizfullscreen">
       <ToastContainer/>
        <div className="clearfix">
          {/* <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.gotoQuizDirectory.bind(this)} >Back to All Quizzes</a>
              </div>
            </div>
          </div> */}
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">{pro.topic}</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" id="timeout" data-toggle="modal" data-target="#quizTimeout" data-backdrop="static" data-keyboard="false" style={{ visibility: 'hidden' }} >Quiz</button>
              {/* <button className="c-btn prime" onClick={this.onResumeQuiz.bind(this)}  >Resume Quiz</button> */}
              <button className="c-btn prime" data-toggle="modal" data-target="#quizSubmit" id="submitquiz">Submit Quiz</button>
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="card-container">

            {this.renderQuizFile()}

            <div className="c-card nopad" >
              <div className="c-queList">
                <div className="c-marks-block margin25-bottom" style={{height:"120px"}}>
                  {this.renderStopWatch()}
                  <div  className="cust-m-info">{this.state.remainingQuestionCount ? this.state.remainingQuestionCount + " Remaining" : "0 Remaining"}</div>
                </div>
                <div style={{overflow:"auto",height:"525px"}}>
                {this.renderQuizQuestionList()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade custom-modal-sm width--sm" id="quizSubmit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                <h4 className="c-heading-sm card--title">Submit Quiz</h4>
              </div>
              <div className="modal-body">
                <div className="cust-m-info">Do you really want to submit the quiz?</div>
              </div>
              <div className="modal-footer">
                <div className="clearfix text--right">
                  <button className="c-btn grayshade" data-dismiss="modal" onClick={this.goFullScreen.bind(this)}>No</button>
                  <button className="c-btn primary" onClick={this.onSubmitQuizBysubmitModel.bind(this)}>Yes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade custom-modal-sm width--sm" id="quizTimeout" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.onSubmitQuizONCross.bind(this)}><i className="icon cg-times"></i></button>
              </div>
              <div className="modal-body">
                <div className="c-timeoutModal">
                  <div className="timeout--img"></div>
                  <div className="timeout--msg">Time Over!</div>
                  <div className="timeout--time">00:00:00</div>
                  <div className="timeout--btn"><button className="c-btn prime" onClick={this.onSubmitQuiz.bind(this)}>Get Score</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, student }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  quizData: student.quizData,
  quizPdfTypeSubmissionResponse: student.quizPdfTypeSubmissionResponse,
  changeStatusExam: student.changeStatusExam,
  resumeQuizData: student.resumeQuizData,
  resumePdfType: student.resumePdfType,
  quizfileData: student.quizfileData,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getStudentQuizExam,
    submitQuizTypePDF,
    quizStartExamStatusChange,
    getResumeQuizData,
    resumePdfQuiz,
    downloadStudentQuizFile,
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentExamPdfTypeQuiz)