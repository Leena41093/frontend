import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NewNoticeModel } from '../common/professorModel/newNoticeModel';
import { ViewStudentModel } from '../common/professorModel/viewStudentModel';
import { ViewNotice } from '../common/professorModel/viewNoticeSection';
import { ViewRecentSubmissionlist } from '../common/professorModel/viewRecentSubmissionlist';
import {
  getProfessorBatchDashboard, createNewNoticeBatchDetailDahboard,
  getStudentListBatchDashboard, showAllNotice, updateProfessorLastSeen, professorBatchList, deleteNotice,
  getProfessorBatchDetailNotices, getProfessorBatchDetailRecentSubmissions
} from '../../actions/professorActions';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import $ from 'jquery';
import { infoToste, errorToste } from '../../constant/util';
import { DeleteModal } from '../common/deleteModal';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class ProfessorBatchDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generalDetails: {},
      batchNotice: [],
      homeworkSection: {},
      notesSection: {},
      quizSection: {},
      recentStudentSubmission: [],
      notice: [],
      batchId: "",
      studentList: [],
      professor_id: null,
      deleteObj: null,
      index: 0,
      addloader: true,
      id: 0,
      instituteId: 0
    }
  }

  componentWillReceiveProps(nextProps) {

    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        this.props.history.push("/app/dashboard");
      }
    }
  }

  componentDidMount() {
    const Id = this.props.location.state.data ? this.props.location.state.data : null;
    this.setState({ batchId: Id, instituteId: this.props.instituteId }, () => {
      this.getBatchData();
      this.updateOfProfessorlastseen();
    })
  }

  getBatchData() {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "batch_id": this.state.batchId
      }
    }

    this.props.getProfessorBatchDashboard(data).then(() => {
      let res = this.props.batchDetailDashboard;
      if (res && res.data.status == 200) {
        this.setState({ generalDetails: res.data.response.generalDetails, homeworkSection: res.data.response.homeworkSection, quizSection: res.data.response.quizSection, notesSection: res.data.response.notesSection }, () => {
          this.setState({ addloader: false });
        });
      }
    })
    this.props.getProfessorBatchDetailNotices(data).then(() => {
      let res = this.props.professorBatchDetailNotice;
      if (res && res.data.status == 200) {
        this.setState({ batchNotice: res.data.response })
      }
    })
    this.props.getProfessorBatchDetailRecentSubmissions(data).then(() => {
      let res = this.props.professorBatchDetailRecentSubmissions;
      if (res && res.data.status == 200) {
        this.setState({ recentStudentSubmission: res.data.response })
      }
    })
  }

  updateOfProfessorlastseen() {
    const Id = this.props.location.state.data
    let data = {
      payload: {
        batch_id: Id,
        last_time: moment()
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.updateProfessorLastSeen(data).then(() => {
      let res = this.props.updateProfessorlastseen;

    })
  }

  getAllStudent() {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "batch_id": this.state.batchId
      }
    }
    this.props.getStudentListBatchDashboard(data).then(() => {
      let res = this.props.studentList;
      if (res && res.status == 200) {
        this.setState({ studentList: res.data.response }, () => {
          $("#getstudents").click();
        });
      }
    })
  }

  onChanageNewHomeWorkPage() {
    let { generalDetails } = this.state;
    this.props.history.push({
      pathname: 'newhomework-detail',
      state: { data: generalDetails }
    })
  }

  onChangeCreateQuizPage() {
    let { generalDetails } = this.state;
    this.props.history.push({
      pathname: 'assign-newquiz',
      state: { data: generalDetails }
    })
  }

  onChanageCreateNotesPage() {
    let { generalDetails } = this.state;
    this.props.history.push({
      pathname: 'create-notes',
      state: { data: generalDetails }
    })
  }

  onChanageDashBoardPage() {
    this.props.history.push({
      pathname: 'dashboard',
    })
  }

  onHandleNotice() {

    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        batch_id: this.state.batchId
      }
    }
    this.props.showAllNotice(data).then(() => {
      let res = this.props.showNotices;

      if (res && res.status == 200) {
        this.setState({ notice: res.data.response });
      }
    })
  }

  newNotice(payload) {

    let data = {
      payload: {
        batch_id: payload.batch_id,
        notice_date: payload.notice_date,
        notice_text: payload.notice_text
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }

    this.props.createNewNoticeBatchDetailDahboard(data).then(() => {
      let res = this.props.createNotice;

      if (res && res.data.status == 200) {
        this.getBatchData();
        $("#createNotice .close").click();
        infoToste("New Notice Created Successfully");
      } else if (res && res.data.status == 500) {
        this.getBatchData();
        $("#createNotice .close").click();
        errorToste(res.data.message)
      }
    })

  }

  onDeleteNotice(id, key) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, id })

  }

  onDeleteEntry(flag) {
    let { index, id } = this.state;
    if (flag == 'notice') {
      this.onNoticeDelete(id);
      $("#quizSubmit .close").click();
    }

  }

  refreshData() {
    this.getBatchData();
  }

  onNoticeDelete(id) {

    let data = {
      payload: {
        batch_notice_id: id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }

    this.props.deleteNotice(data).then(() => {
      let res = this.props.noticeDelete;
      if (res && res.data.status == 200) {
        this.getBatchData();
        infoToste("Notice Deleted Successfully");

      }
    })
  }

  goToHomeworkDirectory() {
    let { generalDetails } = this.state;
    this.props.history.push({
      pathname: '/app/homework-directory',
      state: { data: generalDetails }
    })
  }

  goToQuizDirectory() {
    let { generalDetails } = this.state;
    this.props.history.push({
      pathname: '/app/quiz-directory',
      state: { data: generalDetails }
    })
  }

  goToNotesDirectory() {
    let { generalDetails } = this.state;
    this.props.history.push({
      pathname: '/app/notes-directory',
      state: { data: generalDetails }
    })
  }

  generalDetails() {
    let { generalDetails } = this.state;
    return (
      <div className="clearfix margin25-bottom">
        <div className="form-group static-fld">
          <label>Class Name</label>
          <span className="info-type">{generalDetails ? generalDetails.class_name : ""}</span>
        </div>
        <div className="form-group static-fld">
          <label>Subject</label>
          <span className="info-type">{generalDetails ? generalDetails.subject_name : " "}</span>
        </div>
        <div className="form-group static-fld">
          <label>Faculty</label>
          <span className="info-type">{generalDetails ? generalDetails.professor_name : " "}</span>
        </div>
        <div className="form-group static-fld">
          <label>Duration</label>
          <span className="info-type">{moment(this.state.generalDetails.start_date).format("DD MMM YYYY") + ' - ' + moment(this.state.generalDetails.end_date).format("DD MMM YYYY")}</span>
        </div>
        <div className="form-group static-fld">
          <label>Schedule</label>
          <span className="info-type">{generalDetails ? generalDetails.schedule_type : ""}</span>
        </div>
      </div>
    )
  }

  renderHomeWorkDetail() {
    let homeworkSection = this.state.homeworkSection;
    return (
      <div className="c-card-dtl linkbtn hover-pointer" onClick={this.goToHomeworkDirectory.bind(this)}>
        <div className="c-card-dtl__header">
          <div className="clearfix h-with-btn nomargin">
            <h3>HomeWorks</h3>
            <button onClick={this.goToHomeworkDirectory.bind(this)}>VIEW ALL HOMEWORKS</button>
          </div>
        </div>

        <div className="c-card-dtl__body">
          <div className="body__section">
            <span className="s__number">{homeworkSection.totalAssigned || 0}</span>
            <span className="s__info">Total Assigned</span>
          </div>
          <div className="body__section">
            <span className="s__number">{homeworkSection.unChecked || 0}</span>
            <span className="s__info">Unchecked</span>
          </div>
          <div className="body__section">
            <span className="s__number">{homeworkSection.submissionOpen || 0}</span>
            <span className="s__info">Submissions Open</span>
          </div>
        </div>

        <div className="c-card-dtl__footer col--orange">
          <div className="divider-container nomargin">
            <div className="divider-block text--left"><span className="cust-m-info nomargin">{homeworkSection.name || ""}</span></div>
            <div className="divider-block"><span className="cust-m-info nomargin text-bold">{homeworkSection.topic || ""}</span></div>
            <div className="divider-block text--right"><span className="cust-m-info nomargin">{homeworkSection.date ? moment(homeworkSection.date).fromNow() : moment().fromNow()}</span></div>
          </div>
        </div>
      </div>
    )
  }

  renderQuizDetail() {
    let quizSection = this.state.quizSection;
    return (
      <div className="c-card-dtl linkbtn hover-pointer" onClick={this.goToQuizDirectory.bind(this)}>
        <div className="c-card-dtl__header">
          <div className="clearfix h-with-btn nomargin">
            <h3>MCQ's</h3>
            <button onClick={this.goToQuizDirectory.bind(this)}>VIEW ALL MCQ's</button>
          </div>
        </div>

        <div className="c-card-dtl__body">
          <div className="body__section">
            <span className="s__number">{quizSection.totalAssigned || 0}</span>
            <span className="s__info">Total Assigned</span>
          </div>
          <div className="body__section">
            <span className="s__number">{quizSection.submissionOpen || 0}</span>
            <span className="s__info">Submissions Open</span>
          </div>
        </div>

        <div className="c-card-dtl__footer col--green">
          <div className="divider-container nomargin">
            <div className="divider-block text--left"><span className="cust-m-info nomargin">{quizSection.title}</span></div>
            <div className="divider-block"><span className="cust-m-info nomargin text-bold">{quizSection.name}</span></div>
            <div className="divider-block text--right"><span className="cust-m-info nomargin">{quizSection.date ? moment(quizSection.date).fromNow() : moment().fromNow()}</span></div>
          </div>
        </div>
      </div>
    )
  }

  renderNotesSection() {
    let notesSection = this.state.notesSection
    return (
      <div className="c-card-dtl linkbtn hover-pointer" onClick={this.goToNotesDirectory.bind(this)}>
        <div className="c-card-dtl__header">
          <div className="clearfix h-with-btn nomargin">
            <h3>Notes</h3>
            <button onClick={this.goToNotesDirectory.bind(this)}>VIEW ALL Notes</button>
          </div>
        </div>

        <div className="c-card-dtl__body">
          <div className="body__section">
            <span className="s__number">{notesSection.totalNotes || 0}</span>
            <span className="s__info">Total Notes</span>
          </div>
        </div>

        <div className="c-card-dtl__footer col--orange">
          <div className="divider-container nomargin">
            <div className="divider-block text--left"><span className="cust-m-info nomargin">{notesSection.title}</span></div>
            <div className="divider-block"><span className="cust-m-info nomargin text-bold">{notesSection.name || " "}</span></div>
            <div className="divider-block text--right"><span className="cust-m-info nomargin">{notesSection.date ? moment(notesSection.date).fromNow() : moment().fromNow()}</span></div>
          </div>
        </div>
      </div>
    )
  }

  renderRecentSubmission() {
    let recentStudentSubmission = this.state.recentStudentSubmission;

    if (recentStudentSubmission && recentStudentSubmission.length > 0) {
      let count = 0;
      return recentStudentSubmission.map((data, index) => {
        if (count < 3) {
          count++;
          return (
            <li key={"recentSub" + index}>
              <img src={data.picture_url} className="user-img" alt="" />
              <span className="news__heading">{data.firstname + " " + data.lastname + " submitted" + " " + data.type + " " + data.topic}</span>
              <span className="news__info">{moment(data.submissionTime).fromNow()}</span>
            </li>
          )
        }
      })
    }
  }

  renderNoticeSection() {
    let batchNotice = this.state.batchNotice;
    if (batchNotice && batchNotice.length > 0) {
      let count = 0;
      return batchNotice.map((notice, index) => {

        if (count < 3) {
          count++;
          return (
            <div key={"notice" + index} className="c-notice-card">
              <h3>{moment(notice.notice_date).format("dddd DD MMM YYYY")}<span ><i data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteNotice.bind(this, notice.batch_notice_id, "notice")} className="icon cg-rubbish-bin-delete-button pull-right linkbtn hover-pointer" style={{ color: "#3D3F61", marginRight: "35px" }}></i></span></h3>
              <span>{notice.notice_text}</span>
            </div>
          )
        }
      })
    }
  }

  render() {
    return (
      <div className="c-container clearfix">
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.onChanageDashBoardPage.bind(this)}>Back to Dashboard</a>
              </div>
              <span className="c-heading-lg">{this.state.generalDetails ? this.state.generalDetails.batch_name || " " : ""}</span>
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
          <div className="c-container__data st--blank">
            <div className="clearfix row">
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="block-title st-colored noborder">GENERAL DETAILS</div>
                {this.generalDetails()}
                <div className="clearfix margin25-bottom">
                  <button className="c-btn-white" data-toggle="modal" data-target="#viewStudents" id="getstudents" hidden></button>
                  <button className="c-btn-white" onClick={this.getAllStudent.bind(this)}>Show all Students</button>
                </div>
                <div className="clearfix btn--listing">
                  <div className="c-heading-sm card--title">Create</div>
                  <a className="linkbtn hover-pointer" onClick={this.onChanageNewHomeWorkPage.bind(this)}>Create new Homework</a>
                  <a className="linkbtn hover-pointer" onClick={this.onChangeCreateQuizPage.bind(this)}>Create new Quiz</a>
                  <a className="linkbtn hover-pointer" onClick={this.onChanageCreateNotesPage.bind(this)}>Create new Note</a>
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-xs-12">
                {this.renderHomeWorkDetail()}
                {this.renderQuizDetail()}

                {this.renderNotesSection()}
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="clearfix margin20-bottom">
                  <div className="block-title st-colored noborder">RECENT SUBMISSIONS</div>
                  <div className="news--listing">
                    <ul>
                      {this.renderRecentSubmission()}
                    </ul>
                  </div>
                  <div className="clearfix margin25-bottom">
                    <button className="c-btn-white" data-toggle="modal" data-target="#viewSubmission">Show All Submission</button>
                  </div>
                </div>
                <div className="clearfix">
                  <div className="clearfix h-with-btn">
                    <h3>NOTICES</h3>

                    <button data-toggle="modal" data-target="#createNotice">CREATE NEW</button>
                  </div>
                  <div className="clearfix">
                    {this.renderNoticeSection()}
                  </div>
                  <div className="clearfix margin25-bottom">
                    <button className="c-btn-white" data-toggle="modal" onClick={this.onHandleNotice.bind(this)} data-target="#viewNotice">Show All Notice</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
        <NewNoticeModel onCreateNewNotice={(data) => { this.newNotice(data) }} batchId={this.state.batchId} {...this.props} disabledflag={true} batchdetailflag={true} />
        <ViewStudentModel studentList={this.state.studentList} />
        <ViewNotice noticeList={this.state.notice} batchId={this.state.batchId} sentfrom="proBatchDash" instituteId={this.props.instituteId} branchId={this.props.branchId} token={this.props.token} deleteNoticeFun={this.props.deleteNotice.bind((this))} refreshData={this.refreshData.bind(this)} />
        <ViewRecentSubmissionlist submissionList={this.state.recentStudentSubmission} />
        <ToastContainer />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({
  batchDetailDashboard: professor.batchDetailDashboard,
  createNotice: professor.createNotice,
  studentList: professor.studentList,
  branchId: app.branchId,
  instituteId: app.institudeId,
  showNotices: professor.showNotices,
  professorId: professor.professorId,
  updateProfessorlastseen: professor.updateProfessorlastseen,
  batchList: professor.batchList,
  token: auth.token,
  noticeDelete: professor.noticeDelete,
  professorBatchDetailNotice: professor.professorBatchdetailNoticesData,
  professorBatchDetailRecentSubmissions: professor.professorBatchdetailRecentSubmissionsData
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getProfessorBatchDashboard,
    createNewNoticeBatchDetailDahboard,
    getStudentListBatchDashboard,
    showAllNotice,
    updateProfessorLastSeen,
    professorBatchList,
    deleteNotice,
    getProfessorBatchDetailNotices,
    getProfessorBatchDetailRecentSubmissions
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorBatchDashboard)