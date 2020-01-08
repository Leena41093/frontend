import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'bootstrap-datepicker';
import { submitQuizResult } from '../../actions/studentAction';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { getBranches } from '../../actions/index';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';

class StudentQuizQuestionTypeResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quizPreview: [],
      quizMarks: {},
      pro:{},
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps){
		
		let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){
    if(this.state.instituteId != nextProps.instituteId){
			// localStorage.removeItem("instituteid")
      // this.setState({instituteId:nextProps.instituteId},()=>{
				// const pro = this.props.location.state?this.props.location.state.data:"";
				// this.getClassesOfStudent();
				// table.fnDraw()
				this.props.history.push("/app/dashboard");
      // });
		}
	
		}
  }

  componentDidMount() {
    this.setState({instituteId:this.props.instituteId});
    const pro = this.props.location.state ? this.props.location.state.data :"";
    const pro1 = this.props.location.state ? this.props.location.state.data1:"";
    this.getQuizResultData(pro);

  }

  getQuizResultData(pro) {
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        quiz_id: pro.quiz_id,
        batch_quiz_id: pro.batch_quiz_id,
      }
    }
    this.props.submitQuizResult(apiData).then(() => {
      let res = this.props.quizResult;

      if (res && res.status == 200) {
        this.setState({
          quizPreview: res.data.response.quizPreview,
          quizMarks: res.data.response.quizMarks,
          pro,
        })
      }

    })
  }

  getClassName(correctAns, studentAns, label) {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    if (studentAns === "0") {
      return "custome-field field-radiobtn"
    }
    else if (correctAns == studentAns) {
      if (correctAns == label) {
        return "custome-field field-radiobtn st-correctAns"
      }
    }
    else if (correctAns == label && moment(pro.end_date) < moment()) {
      return "custome-field field-radiobtn st-correctAns"
    }
    else if (studentAns == label) {
      return "custome-field field-radiobtn st-wrongAns"
    }

    return "custome-field field-radiobtn"

  }

  gotoQuizDirectory() {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    this.props.history.push({ pathname: "studentquiz-directory", state: { data: pro1 } })
  }

  renderQueAns() {
    let { quizPreview } = this.state;
    if (quizPreview && quizPreview.length > 0) {
      return quizPreview.map((question, index) => {
        return (
          <div key={"que" + index} className="c-queList__sect">
            <div className="c-queList__sect__num">{question.question_no}</div>
            <div className="queList__header">
              <span className="static-ques">
                {question.question}
              </span>
              {(question.image_url && question.image_name) ? <div >
                <img style={{ height: "150px", width: "200px" }} src={question.image_url} />
                

              </div>
              : ""}
          </div>
            <div className="queList__body">
              {0 < question.quizOptions ?
                <label htmlFor={"queList-" + index + 1} className={this.getClassName(question.right_answer, question.student_answer, 1)}>
                  <input type="radio" name={"queList" + index} id={"queList-" + index + 1} value="checkone" checked={question.student_answer == "1" ? true : false} disabled />
                  <i></i>
                  <span>{question.option1}</span>
                </label> : ""}
              {1 < question.quizOptions ?
                <label htmlFor={"queList-" + index + 2} className={this.getClassName(question.right_answer, question.student_answer, 2)}>
                  <input type="radio" name={"queList" + index} id={"queList-" + index + 2} value="checkone" checked={question.student_answer == "2" ? true : false} disabled />
                  <i></i>
                  <span>{question.option2}</span>
                </label> : ""}
              {2 < question.quizOptions ?
                <label htmlFor={"queList-" + index + 3} className={this.getClassName(question.right_answer, question.student_answer, 3)}>
                  <input type="radio" name={"queList" + index} id={"queList-" + index + 3} value="checkone" checked={question.student_answer == "3" ? true : false} disabled />
                  <i></i>
                  <span>{question.option3}</span>
                </label> : ""}
              {3 < question.quizOptions ?
                <label htmlFor={"queList-" + index + 4} className={this.getClassName(question.right_answer, question.student_answer, 4)}>
                  <input type="radio" name={"queList" + index} id={"queList-" + index + 4} value="checkone" checked={question.student_answer == "4" ? true : false} disabled />
                  <i></i>
                  <span>{question.option4}</span>
                </label> : ""}
            </div>
          </div>
        )
      })
    }
  }

  render() {
    let { quizMarks, pro } = this.state;
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.gotoQuizDirectory.bind(this)}>Back to All Quizzes</a>
              </div>
              <span className="c-heading-lg">{pro.topic ? pro.topic : ""} {quizMarks ? <span className="c-count st-green lg">{quizMarks.status}</span> : ""}</span>
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-3 col-sm-6 col-xs-12">
              {quizMarks ?
                <div className="clearfix margin25-bottom">
                  <div className="block-title st-colored noborder">MARKS</div>
                  <div className="c-marks-block">
                    <span className="marks-detl">{(quizMarks.student_marks ? quizMarks.student_marks : 0) + "/" + (quizMarks.total_marks ? quizMarks.total_marks : 0)}</span>
                  </div>
                </div> : ""}

              <div className="block-title st-colored noborder">DETAILS</div>

              <div className="clearfix margin25-bottom">
                <div className="form-group static-fld">
                  <label>Topic</label>
                  <span className="info-type">{pro.topic}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Subject</label>
                  <span className="info-type">{pro.subject_name}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Folder</label>
                  <span className="info-type">{pro.folder_name}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Batch</label>
                  <span className="info-type">{pro.batch_name}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Class</label>
                  <span className="info-type">{pro.class_name}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Date Assigned</label>
                  <span className="info-type">{moment(pro.start_date).format("DD MMM YYYY hh:mm a")}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Due Date</label>
                  <span className="info-type">{moment(pro.end_date).format("DD MMM YYYY hh:mm a")}</span>
                </div>
              </div>
            </div>
            <div className="col-md-9 col-sm-6 col-xs-12">
              <div className="block-title st-colored noborder">QUIZ</div>
              <div className=" clearfix" style={{ overflow: "auto", height: "500px" }}>
                <div className="c-queList type--1">
                  {this.renderQueAns()}
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
  quizResult: student.quizResult,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    submitQuizResult,
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentQuizQuestionTypeResult)