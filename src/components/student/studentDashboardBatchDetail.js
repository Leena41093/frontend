import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'bootstrap-datepicker';
import { getStudentBatchDetailDashBoard,updateStudentLastSeen,getstudentDashboardBatchDetailsNotices,
  getstudentDashboardBatchDetailsRecentSubmission } from '../../actions/studentAction';
import {ViewStudentDetailDashbordNotice} from '../student/studentModal/viewStudentDetailDashbordNoticeModal';
import {ViewStudentSubmissionlist} from '../student/studentModal/viewStudentSubmissionlist';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class StudentDashboardBatchDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      batchDetail: [],
      batchNotice: [],
      quizSection: {},
      homeworkSection: {},
      recentSubmission: [],
      instituteId:0,
      notesSection: [],
      addloader:true,
    }
  }

  componentWillReceiveProps(nextProps){
    const pro = this.props.location.state ? this.props.location.state.instituteId : null;
    if(pro != nextProps.instituteId){
			
      this.setState({instituteId:nextProps.instituteId},()=>{

       this.props.history.push("/app/dashboard")
      });
		}

	}

  componentDidMount() {
    const pro = this.props.location.state ? this.props.location.state.data : null;
   
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "batch_id": pro.batch_id
      }
    }
    this.props.getStudentBatchDetailDashBoard(apiData).then(() => {
      let res = this.props.studentBatchDashboard;
      if(res && res.data.status == 200){
      this.setState({ batchDetail: res.data.response.batchDetail,homeworkSection:res.data.response.homeworkSection,quizSection:res.data.response.quizSection,notesSection:res.data.response.notesSection },()=>{
        this.setState({addloader:false});
      });
    }
    })

    this.props.getstudentDashboardBatchDetailsNotices(apiData).then(()=>{
      let batchdetailnoticeres = this.props.studentBatchDetailNotices
      if(batchdetailnoticeres && batchdetailnoticeres.status ==200){
        this.setState({batchNotice:batchdetailnoticeres.data.response})
      }
    })

    this.props.getstudentDashboardBatchDetailsRecentSubmission(apiData).then(()=>{
      let batchdetailrecentsubmissionresponse = this.props.studentBatchDetailRecentSubmission
      if(batchdetailrecentsubmissionresponse && batchdetailrecentsubmissionresponse.status ==200){
        this.setState({recentSubmission:batchdetailrecentsubmissionresponse.data.response})
      }
    })
    this.updateOfStudentlastseen();
  }

  updateOfStudentlastseen(){
    const pro = this.props.location.state.data;
    let data={
      payload:{
        batch_id: pro.batch_id,
        last_time: moment()
      },
      branch_id: this.props.branchId,
      institute_id: this.props.instituteId,
      token: this.props.token,
    }
    this.props.updateStudentLastSeen(data).then(()=>{
      let res = this.props.studentLastseenUpdate;
    })
  }

  goToDashboard() {
    this.props.history.push({
      pathname: 'dashboard',
    })
  }

  backToAllHomework(){
    let {batchDetail} = this.state;
    this.props.history.push({
      pathname:'/app/studenthomework-directory',
    state:{data:batchDetail}})
  }

  backToAllQuiz(){
    let {batchDetail} = this.state;
    this.props.history.push({pathname:'/app/studentquiz-directory',
    state:{data:batchDetail}
    })
  }

  backToAllNotes(){
    let {batchDetail} = this.state;
    this.props.history.push({pathname:'/app/studentnotes-directory',
    state:{data:batchDetail} 
  })
  }

  renderHomeworkDetail() {
    let { homeworkSection } = this.state;
   
    return (
      <div className="c-card-dtl linkbtn hover-pointer" onClick={this.backToAllHomework.bind(this)}>
        <div className="c-card-dtl__header">
          <div className="clearfix h-with-btn nomargin">
            <h3>HOMEWORKS</h3>
            <button onClick={this.backToAllHomework.bind(this)}>VIEW ALL HOMEWORKS</button>
          </div>
        </div>
        <div className="c-card-dtl__body">
          <div className="body__section">
            <span className="s__number">{homeworkSection ? homeworkSection.totalAssigned : 0}</span>
            <span className="s__info">Total Assigned</span>
          </div>
          <div className="body__section">
            <span className="s__number">{homeworkSection ? homeworkSection.unChecked : 0}</span>
            <span className="s__info">Unchecked</span>
          </div>
          <div className="body__section">
            <span className="s__number">{homeworkSection ? homeworkSection.submissionDue : 0}</span>
            <span className="s__info">Submissions Open</span>
          </div>
        </div>
        <div className="c-card-dtl__footer col--orange">
          <div className="divider-container nomargin">
            <div className="divider-block text--left"><span className="cust-m-info nomargin">{homeworkSection ? homeworkSection.name : ""}</span></div>
            <div className="divider-block"><span className="cust-m-info nomargin text-bold">{homeworkSection ? homeworkSection.topic : ""}</span></div>
            <div className="divider-block text--right"><span className="cust-m-info nomargin">{homeworkSection ? moment(homeworkSection.date).fromNow() : moment().fromNow()}</span></div>
          </div>
        </div>
      </div>
    )
  }

  renderQuizDetail() {
    let { quizSection } = this.state;
    return (
      <div className="c-card-dtl linkbtn hover-pointer"  onClick={this.backToAllQuiz.bind(this)}>
        <div className="c-card-dtl__header">
          <div className="clearfix h-with-btn nomargin">
            <h3>MCQS</h3>
            <button onClick={this.backToAllQuiz.bind(this)}>VIEW ALL MCQS</button>
          </div>
        </div>
        <div className="c-card-dtl__body">
          <div className="body__section">
            <span className="s__number">{quizSection ? quizSection.totalAssigned : 0}</span>
            <span className="s__info">Total Assigned</span>
          </div>
          <div className="body__section">
            <span className="s__number">{quizSection ? quizSection.submissionOpen : 0}</span>
            <span className="s__info">Submissions Open</span>
          </div>
        </div>
        <div className="c-card-dtl__footer col--green">
          <div className="divider-container nomargin">
            <div className="divider-block text--left"><span className="cust-m-info nomargin">{quizSection ? quizSection.name : ""}</span></div>
            <div className="divider-block"><span className="cust-m-info nomargin text-bold">{quizSection ? quizSection.topic : " "}</span></div>
            <div className="divider-block text--right"><span className="cust-m-info nomargin">{quizSection ? moment(quizSection.date).fromNow() : moment().fromNow()}</span></div>
          </div>
        </div>
      </div>
    )
  }

  renderNotesDetail() {
    let { notesSection } = this.state;
    return (
      <div className="c-card-dtl linkbtn hover-pointer"  onClick={this.backToAllNotes.bind(this)}>
        <div className="c-card-dtl__header">
          <div className="clearfix h-with-btn nomargin">
            <h3>Notes</h3>
            <button onClick={this.backToAllNotes.bind(this)}>VIEW ALL Notes</button>
          </div>
        </div>
        <div className="c-card-dtl__body">
          <div className="body__section">
            <span className="s__number">{notesSection ? notesSection.totalNotes : 0}</span>
            <span className="s__info">Total Notes</span>
          </div>
        </div>
        <div className="c-card-dtl__footer col--orange">
          <div className="divider-container nomargin">
            <div className="divider-block text--left"><span className="cust-m-info nomargin">{notesSection ? notesSection.name : ""}</span></div>
            <div className="divider-block"><span className="cust-m-info nomargin text-bold">{notesSection ? notesSection.title : ""}</span></div>
            <div className="divider-block text--right"><span className="cust-m-info nomargin">{notesSection ? moment(notesSection.date).fromNow() : moment().fromNow()}</span></div>
          </div>
        </div>
      </div>
    )
  }

  renderSubmission() {
    let { recentSubmission } = this.state;
    if (recentSubmission && recentSubmission.length > 0) {
      let count =0;
      return recentSubmission.map((submission, index) => {
        if(count< 3){
          count++;
        return (
          <li key={"submission" + index}>
            <img src={submission.picture_url} className="user-img" alt="" />
            <span className="news__heading">{submission.firstname + " " + submission.lastname + " submitted "+ submission.type + " " + submission.topic}</span>
            <span className="news__info">{moment(submission.submitTime).fromNow()}</span>
          </li>
        )
      }
      })
    }
  }

  renderNotice() {
    let { batchNotice } = this.state;
    if (batchNotice && batchNotice.length > 0) {
      let count =0;
      
      return batchNotice.map((notice, index) => {
        if(count<3){
          count++;
        return (
          <div key={"notice" + index} className="c-notice-card">
            <h3>{moment(notice.notice_date).format("ddd, DD MMM YYYY")}</h3>
            <span>
              {notice.notice_text}
            </span>
          </div>
        )
      }
      })
    }
  }

  renderGeneralDetail(batchDetail) {
    return (
      <div className="clearfix margin25-bottom">
        <div className="form-group static-fld">
          <label>Class</label>
          <span className="info-type">{batchDetail ? batchDetail.class_name : ""}</span>
        </div>
        <div className="form-group static-fld">
          <label>Subject</label>
          <span className="info-type">{batchDetail ? batchDetail.subject_name : ""}</span>
        </div>
        <div className="form-group static-fld">
          <label>Faculty</label>
          <span className="info-type">{batchDetail ? batchDetail.professor_firstname + " " + batchDetail.professor_lastname : ""}</span>
        </div>
        <div className="form-group static-fld">
          <label>Duration</label>
          <span className="info-type">{batchDetail ? moment(batchDetail.start_date).format("DD MMM YYYY") + " - " + moment(batchDetail.end_date).format("DD MMM YYYY") : ""}</span>
        </div>
        <div className="form-group static-fld">
          <label>Schedule</label>
          <span className="info-type">{batchDetail ? batchDetail.schedule_type : ""}</span>
        </div>
      </div>
    )
  }

  render() {
    let batchDetail = this.state.batchDetail ? this.state.batchDetail[0]:"";
    return (
      <div className="c-container clearfix">
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.goToDashboard.bind(this)}>Back to Dashboard</a>
              </div>
              <span className="c-heading-lg">{batchDetail ? batchDetail.batch_name : ""}</span>
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
              {this.renderGeneralDetail(batchDetail)}
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
            {this.renderHomeworkDetail()}
              {this.renderQuizDetail()}
              
              {this.renderNotesDetail()}
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="clearfix margin20-bottom">
                <div className="block-title st-colored noborder">RECENT SUBMISSIONS</div>
                <div className="news--listing" >
                  <ul>
                    {this.renderSubmission()}
                  </ul>
                </div>
                <div className="clearfix margin25-bottom">
                  <button className="c-btn-white" data-toggle="modal"  data-target="#viewSubmission">Show All Submission</button>
                </div>
              </div>
              <div className="clearfix">
                <div className="clearfix h-with-btn">
                  <h3>NOTICES</h3>
                </div>
                <div className="clearfix">
                  {this.renderNotice()}
                </div>
                <div className="clearfix margin25-bottom">
                  <button className="c-btn-white" data-toggle="modal"  data-target="#viewNotice">Show All Notice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
        <ViewStudentDetailDashbordNotice noticeList={this.state.batchNotice}/>
        <ViewStudentSubmissionlist submissionList={this.state.recentSubmission}/>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, student }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  studentBatchDashboard: student.studentBatchDashboard,
  studentLastseenUpdate:student.studentLastseenUpdate,
  studentBatchDetailNotices: student.studentdashboardbatchdetailnotices,
  studentBatchDetailRecentSubmission: student.studentdashboardbatchdetailrecentsubmission
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getStudentBatchDetailDashBoard,updateStudentLastSeen,getstudentDashboardBatchDetailsNotices,
    getstudentDashboardBatchDetailsRecentSubmission
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboardBatchDetail)