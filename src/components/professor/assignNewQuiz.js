import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import $ from "jquery";
import { CreateQuizModal } from '../common/professorModel/createNewQuizModal';
import { getFolderNameList, getQuizList, getClassesSubjectBatches, assignNewQuiz, createFolderName, createNewQuiz, getProfessorSubjects, getProfessorBatch } from '../../actions/professorActions';
import { SelectQuizModel } from '../common/professorModel/selectQuizModel';
import { getProfessorDriveSubjectFolderList, getFolderQuizList } from '../../actions/professorDriveAction';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class AssignNewQuiz extends Component {
  constructor(props) {
    super(props);
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.state = {

      classes: [],
      subjects: [],
      batches: [],
      selectedClassname: pro.class_name ? pro.class_name : 'Class Name',
      selectedSubjectname: pro.subject_name ? pro.subject_name : 'Subject Name',
      selectedBatchname: pro.batch_name ? pro.batch_name : 'Batch Name',
      selectedClassId: "",
      selectedSubjectId: "",
      selectedBatchId: '',
      start_date: moment(),
      end_date: moment(),
      start_time: '',
      end_time: '',
      quizList: [],
      selectedQuizTopicname: '',
      selectedQuiz: [],
      duration: ['Untimed'],
      quiz_id: '',
      error: {
        isClassnameVisible: false,
        isSubjectVisible: false,
        isBatchVisible: false,
        isQuizTopicSelected: false,
        isDurationSelected: false,
        isEnddateVisisble: false,
      },
      newQuiz: {},
      isSubjectSelected: false,
      cls: {},
      sub: {},
      folderList: [],
      isAssignQuizClick: false,
      isBatchAvailable: false,
      isClassAvailable: false,
      isSubjectAvailable: false,
      pro1: {},
      batchdetail: {},
      messageDisplay: false,
      strict_mode: false,
      instituteId: 0,
      addloader: true,
      incompleteQuiz: false
    }
    this.onQuizTypeSelect = this.onQuizTypeSelect.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        this.props.history.push("/app/dashboard");
      }
    }
    var obj = {
      class_name: this.state.selectedClassname, class_id: this.state.selectedClassId,
      subject_name: this.state.selectedSubjectname, subject_id: this.state.selectedSubjectId,
      batch_name: this.state.selectedBatchname, batch_id: this.state.selectedBatchId
    }
    const batchdetail = this.props.location.state ? this.props.location.state.data1 : "";
    this.setState({ pro1: obj, batchdetail: batchdetail })
  }

  componentDidMount() {
    const pro = this.props.location.state ? this.props.location.state.data : "";

    this.setState({ instituteId: this.props.instituteId });
    if (pro && pro.duration) {
      this.setState({ duration: pro.duration })
    }
    var batchdetail = this.props.location.state ? this.props.location.state.data1 : "";

    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getClassesSubjectBatches(data).then(() => {

      let res = this.props.classesSubjectsBatches;
      if (res && res.status == 200) {
        if (res.data.status == 500) {
          this.setState({
            isClassAvailable: true, isSubjectAvailable: true, isBatchAvailable: true, classesSubjectsBatches: res.data.response,
            classes: res.data.response.classes,
            newQuiz: res.data.response,

          })
        } else if (res && res.data.status == 200) {
          this.setState({
            classesSubjectsBatches: res.data.response,
            classes: res.data.response.classes,
            newQuiz: res.data.response,
            batchdetail: batchdetail,

          }, () => {

            if (this.state.classes && this.state.classes.length > 0) {
              this.state.classes.map((data, index) => {
                if (pro.class_name == data.class_name) {

                  this.setState({ selectedClassId: data.class_id, }, () => {

                    this.setState({ cls: { class_name: pro.class_name, class_id: this.state.selectedClassId } })
                    this.getSubject();
                  })
                }
              })
            }


            if (this.state.classes && this.state.classes.length > 0) {
              this.state.classes.map((data, index) => {

                if (data.class_id == pro.class_id) {
                  this.setState({ selectedClassId: pro.class_id }, () => {
                    this.state.selectedClassname = data.class_name;
                    this.setState({
                      selectedQuiz: {
                        selectedQuiz: {
                          Subject_folder: " ",
                          branch_id: pro.branch_id,
                          institude_id: pro.institude_id,
                          professor_id: pro.professor_id,
                          quiz_id: pro.quiz_id,
                          quiz_title: pro.quiz_title,
                          quiz_topic: pro.quiz_topic,
                          quiz_type: pro.quiz_type
                        }
                      }, selectedQuizTopicname: pro.quiz_title,
                    })
                    this.getSubject();
                  })


                }
              })
            }
          });
        }
      }
    })

    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getQuizList(apiData).then(() => {
      let res = this.props.quizList;
      if (res && res.status == 200) {
        this.setState({ quizList: res.data.response })
      }
    })
  }

  getSubject() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    let apiData = {
      payload: {
        class_id: this.state.selectedClassId,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorSubjects(apiData).then(() => {
      let res = this.props.professorSubjects;
      if (res && res.status == 200) {
        if (res.data.response.subjects.length == 0) {
          this.setState({ isSubjectAvailable: true, subjects: res.data.response.subjects })
        }
        else {
          this.setState({ subjects: res.data.response.subjects }, () => {
            this.state.subjects.map((data, index) => {
              if (pro.subject_name == data.subject_name) {
                this.setState({ selectedSubjectId: data.subject_id }, () => {

                  this.setState({ sub: { subject_name: this.state.selectedSubjectname, subject_id: this.state.selectedSubjectId }, isSubjectSelected: true, addloader: false });
                  this.getDriveFolder();
                  this.getBatches();
                })
              }


              if (this.state.subjects && this.state.subjects.length > 0) {
                this.state.subjects.map((data, index) => {

                  if (data.subject_id == pro.subject_id) {
                    this.state.selectedSubjectname = data.subject_name
                    if (this.state.selectedSubjectname == data.subject_name) {
                      this.setState({ selectedSubjectId: data.subject_id }, () => {

                        this.setState({
                          selectedQuiz: {
                            selectedQuiz: {
                              Subject_folder: " ",
                              branch_id: pro.branch_id,
                              institude_id: pro.institude_id,
                              professor_id: pro.professor_id,
                              quiz_id: pro.quiz_id,
                              quiz_title: pro.quiz_title,
                              quiz_topic: pro.quiz_topic,
                              quiz_type: pro.quiz_type
                            }
                          }, selectedQuizTopicname: pro.quiz_title, isSubjectSelected: true, addloader: false
                        })
                        this.getDriveFolder();
                        this.getBatches();
                      })
                    }
                  }
                })
              }
            })
          })
        }
      }
    })
  }

  getDriveFolder() {
    if (this.state.selectedSubjectId) {
      let data = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: {
          "subject_id": this.state.selectedSubjectId
        }
      }
      this.props.getFolderNameList(data).then(() => {
        let res = this.props.folderList;
        if (res && res.status == 200) {

          this.setState({ folderList: res.data.response }, () => {
          })
        }
      })
    }
  }

  getBatches() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    let apiData = {
      payload: {
        subject_id: this.state.selectedSubjectId,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorBatch(apiData).then(() => {
      let res = this.props.professorBatches;
      if (res.batches.length == 0) {
        this.setState({ isBatchAvailable: true, batches: res.batches });
      }
      else {
        this.setState({ batches: res.batches, isBatchAvailable: false }, () => {
          this.state.batches.map((data, index) => {
            if (this.state.selectedBatchname == data.batch_name) {
              this.setState({ selectedBatchId: data.batch_id });
            }


            if (this.state.batches && this.state.batches.length > 0) {
              this.state.batches.map((data, index) => {

                if (this.state.batchdetail) {


                  if (data.batch_id == this.state.batchdetail.batch_id) {
                    this.state.selectedBatchname = data.batch_name
                    if (this.state.selectedBatchname == data.batch_name) {
                      this.setState({ selectedBatchId: data.batch_id }, () => {
                        this.setState({
                          selectedQuiz: {
                            selectedQuiz: {
                              Subject_folder: " ",
                              branch_id: pro.branch_id,
                              institude_id: pro.institude_id,
                              professor_id: pro.professor_id,
                              quiz_id: pro.quiz_id,
                              quiz_title: pro.quiz_title,
                              quiz_topic: pro.quiz_topic,
                              quiz_type: pro.quiz_type
                            }
                          }, selectedQuizTopicname: pro.quiz_title
                        })
                      })

                    }
                  }
                }
              })
            }
          })
        })
      }
    })
  }

  onSelectClass(cls) {
    let { error } = this.state;
    error = { ...error, isClassnameVisible: false }
    this.setState({
      error, selectedClassId: cls.class_id,
      selectedClassname: cls.class_name,
      isClassnameVisible: false,

    }, () => {
      this.setState({ cls: { class_name: this.state.selectedClassname, class_id: this.state.selectedClassId } })
      this.getSubject();
    })
  }

  onSelectSubject(subject) {
    let { error } = this.state;
    error = { ...error, isSubjectVisible: false }
    this.setState({
      error, selectedSubjectId: subject.subject_id,
      selectedSubjectname: subject.subject_name,
      isSubjectSelected: true,
    }, () => {
      this.setState({ sub: { subject_name: this.state.selectedSubjectname, subject_id: this.state.selectedSubjectId } })
      this.getDriveFolder();
      this.getBatches();
    })
  }

  onSelectBatch(batch) {
    let { error } = this.state;
    error = { ...error, isBatchVisible: false }
    this.setState({
      selectedBatchId: batch.batch_id,
      selectedBatchname: batch.batch_name, error
    })
  }

  onChangeStartDate(date) {
    let { start_date } = this.state;
    this.setState({
      start_date: date
    })
  }

  onChangeEndDate(date) {
    let { end_date } = this.state;
    this.setState({ end_date: date })
  }

  onSelectQuiz(quiz, data) {
    $("#studentDrive .close").click();
    let { selectedQuiz, error } = this.state;
    error = { ...error, isQuizTopicSelected: false }
    if (quiz) {
      selectedQuiz = { ...selectedQuiz, selectedQuiz: quiz, }
      this.setState({ selectedQuizTopicname: quiz.quiz_title, batchdetail: data, duration: quiz.duration, selectedQuiz, error, messageDisplay: true, incompleteQuiz: quiz.incompleteQuiz });
    }
  }

  validate() {
    let { error, selectedClassId, selectedSubjectId, selectedBatchId, duration, selectedQuizTopicname } = this.state;
    let isValidForm = true;
    if (!selectedClassId) {
      error = { ...error, isClassnameVisible: true };
      isValidForm = false;
    }
    if (!selectedSubjectId) {
      error = { ...error, isSubjectVisible: true };
      isValidForm = false;
    }
    if (!selectedBatchId) {
      error = { ...error, isBatchVisible: true };
      isValidForm = false;
    }
    if (!selectedQuizTopicname) {
      error = { ...error, isQuizTopicSelected: true };
      isValidForm = false;
    }
    if ((this.state.end_date <= this.state.start_date) || !this.state.end_date) {

      error = { ...error, isEnddateVisisble: true };
      isValidForm = false;
    }
    if (!duration) {
      error = { ...error, isDurationSelected: true, };
      isValidForm = false;
    }
    if (duration == 0) {
      error = { ...error, isDurationSelected: true };
      isValidForm = false;
    }
    this.setState({ error });
    return isValidForm;
  }

  onAssignQuiz() {

    // var batchdetail = this.props.location.state ? this.props.location.state.data1 : "";
    let { batchdetail } = this.state;
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      let data = {
        payload: {
          subject_id: this.state.selectedSubjectId,
          class_id: this.state.selectedClassId,
          start_date: moment(),
          end_date: this.state.end_date,
          duration: this.state.duration,
          batch_id: this.state.selectedBatchId,
          quiz_id: this.state.selectedQuiz.selectedQuiz.quiz_id,
          strict_mode: this.state.strict_mode
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.setState({ isAssignQuizClick: true })
      this.props.assignNewQuiz(data).then(() => {
        let res = this.props.assignQuiz;
        if (res && res.data.status == 200) {
          this.props.history.push({
            pathname: '/app/quiz-directory',
            state: { data: batchdetail }
          });
        }
        successToste("Quiz Assigned Successfully");
      })
    }
  }

  addNewQuiz(newQuiz) {
    let data = {
      payload: {
        quiz_title: newQuiz.quiz_title,
        quiz_topic: newQuiz.quiz_title,
        subject_folder_id: newQuiz.subject_folder_id,
        subject_id: newQuiz.subject_id,
        class_id: newQuiz.class_id,
        quiz_type: newQuiz.quiz_type,
        marks_for_each_question: newQuiz.marks_for_each_question,
        duration: newQuiz.duration
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.createNewQuiz(data).then(() => {
      let quiz_id = this.state;
      let res = this.props.newQuiz;

      if (res && res.data.status == 200) {

        let data = {
          quiz_id: res.data.response.quiz_id,
          quiz_type: res.data.response.quiz_type,
          class_id: res.data.response.class_id,
          subject_id: res.data.response.subject_id,
          subject_folder_id: res.data.response.subject_folder_id,
          data: res.data.response,
          duration: res.data.response.duration,

        }
        if (res.data.response.quiz_type == "upload_pdf") {
          $(".close").click();
          this.props.history.push({
            pathname: '/app/professor-quizuploadpdf',
            state: { data, pro1: this.state.pro1 }
          })

        }
        else if (res.data.response.quiz_type == "type_questions") {
          $(".close").click();
          this.props.history.push({
            pathname: '/app/professor-quiztypequestion',
            state: { data, pro1: this.state.pro1 }
          })
        }

      }
      else if (res && res.data.status == 500) {
        errorToste(res.data.message)
      }
    })
  }

  activateStrictMode(value) {
    this.setState({ strict_mode: !value })
  }

  onGotoDirectory() {

    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: 'quiz-directory',
      state: { data: pro }
    });
  }

  onDurationChange(event) {
    let { duration, error } = this.state;
    error = { ...error, isDurationSelected: false }
    duration = event.target.value

    if (event.target.value == '') {
      this.setState({ messageDisplay: true })
    }
    else {
      this.setState({ messageDisplay: false });
    }
    this.setState({ duration, error });
  }

  renderClasses() {
    if (this.state.classes && this.state.classes.length > 0) {
      return this.state.classes.map((cls, index) => {
        return (
          <li key={"cls" + index}>
            <a onClick={this.onSelectClass.bind(this, cls)} className="dd-option">{cls.class_name}</a>
          </li>
        )
      })
    }
  }

  renderSubjects() {
    if (this.state.subjects && this.state.subjects.length > 0) {
      return this.state.subjects.map((subject, index) => {
        return (
          <li key={"key" + index}>
            <a href="javascript:void(0);" onClick={this.onSelectSubject.bind(this, subject)} className="dd-option">{subject.subject_name}</a>
          </li>
        )
      })
    }
  }

  renderBatches() {
    if (this.state.batches && this.state.batches.length > 0) {
      return this.state.batches.map((batch, index) => {
        return (
          <li key={"key" + index}>
            <a onClick={this.onSelectBatch.bind(this, batch)} className="dd-option">{batch.batch_name}</a>
          </li>
        )
      })
    }
  }

  renderSelectedQuiz() {
    let { selectedQuiz } = this.state;
    if (this.state.selectedQuizTopicname == '') {
      return
    }
    else {
      return (
        <div>
          <div className="form-group static-fld">
            <label>Title:</label>
            <span className="info-type">{selectedQuiz.selectedQuiz.quiz_title ? selectedQuiz.selectedQuiz.quiz_title : ""}</span>
          </div>
          <div className="form-group static-fld">
            <label>Topic:</label>
            <span className="info-type">{selectedQuiz.selectedQuiz.quiz_title ? selectedQuiz.selectedQuiz.quiz_title : ""}</span>
          </div>

          <div className="form-group static-fld clearfix">
            {this.state.messageDisplay ?
              <div>
                <label>Folder:</label>
                <span className="info-type">{selectedQuiz.selectedQuiz.Subject_folder ? selectedQuiz.selectedQuiz.Subject_folder : ""}</span>
              </div> : ""}
          </div>

        </div>
      )
    }
  }

  render() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                {!this.state.selectedQuizTopicname ?
                  <a className="linkbtn hover-pointer" onClick={this.onGotoDirectory.bind(this)}>Back to All Quizzes</a> : ""}
              </div>
            </div>
          </div>

          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Assign Quiz</span>
              {this.state.selectedQuizTopicname ? <label style={{ color: "red" }}>Please Select Due Date and Assign Quiz <sup>*</sup></label> : ""}
              <br />
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname} - {this.state.selectedSubjectname} - {this.state.selectedBatchname}</span>
            </div>
            <div className="divider-block text--right">
              {!this.state.selectedQuizTopicname ?
                <button className="c-btn grayshade" onClick={this.onGotoDirectory.bind(this)}>Back</button> : ""}
              {this.state.incompleteQuiz == true ?
                <button className="btn c-btn prime" disabled>Assign Quiz</button> :
                <button onClick={this.onAssignQuiz.bind(this)} disabled={this.state.isAssignQuizClick} className="c-btn prime">Assign Quiz</button>}
            </div>
          </div>
        </div>
        {this.state.addloader == true ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "45%", marginTop: "15%" }}>
          <ClipLoader
            className={override}
            sizeUnit={"px"}
            size={50}
            color={'#123abc'}

          /></div> :
          <div className="c-container__data">
            <div className="card-container">
              <div className="c-card">
                <div className="c-card__form">

                  <div className="quiz-btns noborder" style={{ marginLeft: "-6%" }}>
                    <span className="c-heading-sm card--title  margin25-bottom">
                      SELECT QUIZ
                  </span>
                  </div>

                  <div className="quiz-btns">

                    {!this.state.selectedQuizTopicname ?
                      <div className="c-quiz-btn">
                        <button data-toggle="modal" data-target="#createQuiz">
                          <i className="i-img"><img src="/images/icon_add.png" /></i>
                          Create new Quiz
                       </button>
                        {!this.state.selectedQuizTopicname ? <div style={{ marginTop: "15px", marginBottom: "15px", marginLeft: "68px" }}>
                          <span style={{ fontSize: "15px" }}>{"OR"}</span>
                        </div> : ""}
                      </div>

                      : ""}

                    {this.state.isSubjectSelected ?
                      <div className="c-quiz-btn">
                        {this.state.selectedQuizTopicname ?
                          <div>
                            <button style={{ border: "1.5px solid #FFCC01" }} aria-expanded="false" data-toggle="modal" data-target="#studentDrive">
                              <i className="i-img"><img src="/images/icon_folder.png" /></i>

                              {this.state.selectedQuizTopicname}
                            </button> <span style={{ color: "green", fontSize: "14px" }}>{"Quiz Topic is Selected"}</span><br />
                            {this.state.incompleteQuiz == true ? <span style={{ color: "red" }}>Quiz Incomplete. Please Select another Quiz.</span> : ""}
                          </div>
                          :
                          <button aria-expanded="false" data-toggle="modal" data-target="#studentDrive">
                            <i className="i-img"><img src="/images/icon_folder.png" /></i>

                            {"Select Quiz from CleverGround Drive"}
                          </button>

                        }
                        {this.state.error.isQuizTopicSelected ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Please Select Quiz Topic</label> : ""}
                      </div>
                      : ""}


                  </div>

                  <div className="quiz-btns noborder" style={{ marginLeft: "-6%" }}>
                    <span className="c-heading-sm card--title  margin25-bottom">SELECTED QUIZ</span>
                    {this.renderSelectedQuiz()}
                  </div>
                </div>
              </div>

              <div className="c-card">
                <div className="clearfix" style={{ marginLeft: "6%" }}>

                  <span className="c-heading-sm card--title margin25-bottom">QUIZ SCHEDULE</span>
                  <div className="form-group cust-fld">
                    <label className="custome-field field-checkbox" style={{ marginRight: "10px", display: "inline-block" }}>
                      <input type="checkbox" name="check-one" id="check-strictmode" value="checkone" onChange={this.activateStrictMode.bind(this, this.state.strict_mode)} checked={this.state.strict_mode} />
                      <i></i> <span><b><strong>Strict Mode</strong></b></span>
                    </label>
                  </div>
                  <div className="row">


                    <div className="form-group cust-fld col-sm-6" style={{ marginTop: "16px" }}>
                      <label>Due Date <sup>*</sup></label>

                      <div className="divider-block text--left">
                        <div className="form-group cust-fld" >
                          <div className="borderdatepicker">
                            <DatePicker
                              className="form-control fld--date "
                              selected={this.state.end_date ? moment(this.state.end_date.endOf('day')) : moment()}
                              onChange={this.onChangeEndDate.bind(this)}
                            />
                          </div>
                          {this.state.error.isEnddateVisisble ? <label className="help-block" style={{ color: "red" }}> End Date Should Be Greater Than Start Date</label> : <br />}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="form-group cust-fld" style={{ width: "80%", paddingLeft: '30px' }}>
                  <label>Duration<sup>*</sup></label>

                  <input value={this.state.duration} type="number" min="1" className="form-control fld--time" placeholder="Enter End Time In Minutes" onChange={this.onDurationChange.bind(this)} />
                  {this.state.error.isDurationSelected ? <label className="help-block" style={{ color: "red" }}>Please Enter Duration</label> : <br />}
                </div>
              </div>
            </div>
          </div>
        }
        <SelectQuizModel {...this.props} cls={this.state.cls} subject={this.state.sub} folderList={this.state.folderList} onSelectQuiz={(data, data1) => { this.onSelectQuiz(data, data1) }} pro={this.state.pro1} />
        <CreateQuizModal onQuizTypeSelect={this.onQuizTypeSelect} onAddnewQuiz={(data) => { this.addNewQuiz(data) }} {...this.props} quiz_id={this.state.quiz_id} pro={this.state.pro1} />
      </div>
    )
  }

  onQuizTypeSelect(type) {

    $('.modal-overlay').fadeOut('fast', function () {
      $(this).remove();
    });
    $(".custom-modal-sm").fadeOut('fast');
  }
}

const mapStateToProps = ({ app, professor, professorDrive, auth }) => ({
  classes: app.classes,
  branchId: app.branchId,
  instituteId: app.institudeId,
  professorId: professor.professorId,
  folderList: professor.folderList,
  quizList: professor.quizList,
  classesSubjectsBatches: professor.classesSubjectsBatches,
  assignQuiz: professor.assignQuiz,
  newQuiz: professor.newQuiz,
  professorSubjects: professor.professorSubjects,
  professorBatches: professor.professorBatches,
  driveFolder: professorDrive.driveFolder,
  DriveQuizList: professorDrive.DriveQuizList,
  createFolder: professor.createFolder,
  token: auth.token,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFolderNameList,
      getQuizList,
      getClassesSubjectBatches,
      assignNewQuiz,
      createNewQuiz,
      getProfessorSubjects,
      getProfessorBatch,
      getProfessorDriveSubjectFolderList,
      getFolderQuizList,
      createFolderName,
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AssignNewQuiz)    