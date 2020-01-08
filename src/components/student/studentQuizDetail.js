import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStudentQuizDetail } from '../../actions/studentAction';
import { RulesForStrictModeModel } from '../common/rulesForStrictModeModel';
import moment from 'moment';
import $ from "jquery"
class StudentQuizDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizDetail:
        {
          class_name: '',
          subject_name: '',
          batch_name: '',
          folder_name: '',
          topic: '',
          start_date: moment(),
          end_date: moment(),
          duration: '',
          pro: {},
          instituteId: 0,
        }
    }
  }

  componentWillReceiveProps(nextProps) {
    var pro = this.props ? this.props.location.state.instituteId : ""
    
    if (pro != nextProps.instituteId) {
      this.setState({ instituteId: nextProps.instituteId }, () => {
        this.props.history.push('/app/studentquiz-directory')
      });
    }
  }

  componentDidMount() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
   
    let apiData = {
      payload: {
        batch_id: pro.batch_id,
        batch_quiz_id: pro.batch_quiz_id
      },
      token: this.props.token,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
    }
    this.props.getStudentQuizDetail(apiData).then(() => {
      let res = this.props.studentQuizDetail;

      if (res && res.status == 200) {
        this.setState({ quizDetail: res.data.response[0], pro })
      }
    })
  }

  pad(num) {
    return ("0" + num).slice(-2);
  }

  hhmmss(secs) {
    var minutes = Math.floor(secs / 60);
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(secs);
  }

  backToQuizDirectory() {
    
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    this.props.history.push({ pathname: '/app/studentquiz-directory',state:{data:pro1} })
  }

  onStartQuiz() {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    
    if(this.state.quizDetail.strict_mode == true){
    $("#rulesbtn").click();
    }
    else if(this.state.quizDetail.strict_mode == false){
      this.startTest();
    }
  }

  startTest() {
    $("#rulesduringexam .close").click();
    let { quizDetail } = this.state;
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    if (quizDetail.quiz_type == "upload_pdf") {
      this.props.history.push({
        pathname: "studentexam_pdftype",
        state: { data: quizDetail, data1: pro1 }
      })
    }
    else {
      this.props.history.push({
        pathname: "studentexam_questiontype",
        state: { data: quizDetail, data1: pro1 }
      })
    }
  }
  onPreviewQuiz() {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    let { quizDetail } = this.state;
    if (quizDetail.quiz_type == "upload_pdf") {
      this.props.history.push({
        pathname: "studentresult_pdftype",
        state: { data: quizDetail, data1: pro1 }
      })
    }
    else {
      this.props.history.push({
        pathname: "studentresult_questiontype",
        state: { data: quizDetail, data1: pro1 }
      })
    }
  }

  renderQuizStartResume(pro) {
    let { quizDetail } = this.state;

    if (quizDetail.attemptStatus === "INACTIVE") {
      return (
        <div className="start-quiz-cont">
          <div className="clearfix"><button className="c-btn prime" onClick={this.onPreviewQuiz.bind(this)}>Preview</button></div>
        </div>
      )
    }
    else if (quizDetail.attemptStatus === "INPROGRESS") {
      return (
        <div className="start-quiz-cont">
          <span className="timer-st">{quizDetail.duration == 'Untimed' ? "" : this.hhmmss(quizDetail.duration * 60)}</span>
          <span className="timer-que">{quizDetail.questionCount ? quizDetail.questionCount + "Questions" : "0 Questions"}</span>
          <div className="clearfix"><button className="c-btn prime" onClick={this.onStartQuiz.bind(this)}>Start Again</button></div>
        </div>
      )
    }
    else if (quizDetail.attemptStatus === "UNSUBMITTED") {
      return (
        <div className="start-quiz-cont">
          <span className="timer-st">{quizDetail.duration == 'Untimed' ? "" : this.hhmmss(quizDetail.duration * 60)}</span>
          <span className="timer-que">{quizDetail.questionCount ? quizDetail.questionCount + " " + "Questions" : "0 Questions"}</span>
          <div className="clearfix"><button className="c-btn prime" onClick={this.onStartQuiz.bind(this)}>Start Quiz</button></div>
        </div>
      )
    }
  }

  quizExpired(quizDetail) {
    return (
      <div className="block-title st-colored noborder">
        This quiz expired on date <span>{quizDetail.end_date}</span>
      </div>
    )
  }

  render() {
    const pro = this.props.location.state.data;
    let { quizDetail } = this.state;

    return (
      <div className="c-container clearfix">
        <button className="link--btn" id="rulesbtn" data-toggle="modal" data-target="#rulesduringexam" hidden>OpenModel</button>
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.backToQuizDirectory.bind(this)}>Back to Quiz Directory</a>
              </div>
              <span className="c-heading-lg">{pro ? pro.title : ""}</span>
            </div>
          </div>
        </div>

        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="block-title st-colored noborder">DETAILS</div>
              <div className="clearfix margin25-bottom">
                <div className="form-group static-fld">
                  <label>Topic</label>
                  <span className="info-type">{quizDetail.topic ? quizDetail.topic : ''}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Subject</label>
                  <span className="info-type">{quizDetail.subject_name ? quizDetail.subject_name : ''}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Folder</label>
                  <span className="info-type">{quizDetail.folder_name ? quizDetail.folder_name : ''}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Batch</label>
                  <span className="info-type">{quizDetail.batch_name ? quizDetail.batch_name : ''}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Class</label>
                  <span className="info-type">{quizDetail.class_name ? quizDetail.class_name : ''}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Date Assigned</label>
                  <span className="info-type">{moment(quizDetail.start_date).format("DD MMM YYYY hh:mm a")}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Due Date</label>
                  <span className="info-type">{moment(quizDetail.end_date).format("DD MMM YYYY hh:mm a")}</span>
                </div>
              </div>
            </div>

            <div className="col-md-9 col-sm-6 col-xs-12">
              <div className="block-title st-colored noborder">QUIZ</div>
              <div className="c-container__data clearfix">
                {(moment(quizDetail.end_date) > moment(new Date()) || pro.status == "Completed") ?
                  this.renderQuizStartResume(pro)
                  :
                  <div className="block-title st-colored noborder">
                    This quiz expired on date <span style={{ fontSize: 'x-large' }}>{moment(quizDetail.end_date).format("DD MMM YYYY hh:mm a")}</span>
                  </div>
                }

              </div>
            </div>
          </div>
        </div>
        <RulesForStrictModeModel onStartTest={(data) => this.startTest.bind(this)}  {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, student }) => ({
  instituteId: app.institudeId,
  branchId: app.branchId,
  studentQuizDetail: student.studentQuizDetail,
  token: auth.token
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { getStudentQuizDetail },
    dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentQuizDetail)    