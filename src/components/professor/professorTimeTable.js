import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  professorTimeTable, createNewNoticeBatchDetailDahboard, professorBatchList,
  deleteNotice, getProfessorTimetableHomeworkdueInfo, getProfessorTimetableNoticeInfo
} from '../../actions/professorActions';
import DatePicker from 'react-datepicker';
import { ViewNotice } from '../common/professorModel/viewNoticeSection';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { infoToste, errorToste } from '../../constant/util';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
import { NewNoticeModel } from '../common/professorModel/newNoticeModel';
import { DeleteModal } from '../common/deleteModal';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

let calendar = "";

class ProfessorTimeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      professorEvent: [],
      recentNotices: [],
      addloader: TextTrackCueList,
      batchId: "",
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
    this.setState({ instituteId: this.props.instituteId });
    this.getEvent();
    this.getAllNotices();
  }

  getAllNotices() {
    let { recentNotices } = this.state;
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorTimetableNoticeInfo(apiData).then(() => {
      let res = this.props.professorTimetableNoticeinfo;

      if (res && res.data.status == 200) {
        recentNotices = res.data.response.batchNoticeData;
        if (recentNotices > 0) {
          this.setState({ batchId: recentNotices[0].batch_id })
        }
        this.setState({ recentNotices, })
      }
    })
  }

  getEvent() {
    let { professorEvent, recentNotices } = this.state;
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    var homeworks = [];
    var quizs = [];
    var notices = [];
    var schedules = [];

    this.props.getProfessorTimetableHomeworkdueInfo(apiData).then(() => {
      let { professorEvent } = this.state;

      let res = this.props.professorTimetableHwDueInfo;

      if (res && res.data.status == 200) {
        homeworks = res.data.response.homeworkDueDetails;

        quizs = res.data.response.quizDueDetails;
        if (homeworks && homeworks.length > 0) {

          homeworks.map((homework, index) => {

            professorEvent.push({
              title: "HW ->" + homework.title,
              start: homework.end_date,
              name: homework.subject_name,
              color: "#FFCC01",
              textColor: 'black',
            })
          })
        }
        if (quizs && quizs.length > 0) {
          quizs.map((quiz, index) => {

            professorEvent.push({
              title: "Quiz->" + quiz.title,
              start: quiz.end_date,
              name: quiz.title,
              color: "#990000",
              textColor: 'white',
            })
          })
        }
        this.setState({ professorEvent, addloader: false })
      }
    })

    this.props.professorTimeTable(apiData).then(() => {
      let { professorEvent } = this.state;
      let res = this.props.timeTable;

      if (res && res.data.status == 200) {


        schedules = res.data.response.professorSchedule;

        if (schedules && schedules.length > 0) {
          schedules.map((schedule, index) => {
            let title = `${schedule.subject_name} ${schedule.start_time} to ${schedule.end_time}`
            schedule.scheduleDates.map((date, idx) => {

              professorEvent.push({
                title: title,
                start: date.batch_date,
                name: title,
                color: "#F2F2F5",
                textColor: "#696969",
              })
            })
          })
        }
        this.setState({ professorEvent }, () => {
          $('#calendar').fullCalendar('destroy');
          this.initializeCalendar();
        })
      }
    })
  }

  initializeCalendar() {
    calendar = $('#calendar').fullCalendar({
      defaultView: 'month',
      editable: true,
      events: this.state.professorEvent,
      displayEventTime: false,
      eventRender: function (event, element) {
        element.css("margin-bottom", "1px");
        element.css("border-radius", "9px");
        element.attr('title', event.name);
      },
      eventLimit: true,
    })
  }

  newNotice(payload) {
    let { recentNotices } = this.state;
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
        recentNotices.push(res.data.response);
        this.setState({ recentNotices });
        $("#createNotice .close").click();
        infoToste("New Notice Created Successfully");
        this.getAllNotices();
      } else if (res && res.data.status == 500) {
        $("#createNotice .close").click();
        errorToste(res.data.message);
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

  refreshDatas() {
    this.getEvent();
  }

  onNoticeDelete(id) {
    let { recentNotices } = this.state;
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
        infoToste("New Notice Created Successfully");
        this.getAllNotices();
      }
    })
  }

  renderRecentNotices() {
    let { recentNotices } = this.state;

    if (recentNotices && recentNotices.length > 0) {
      let count = 0;
      return recentNotices.map((notice, index) => {
        if (count < 3) {
          count++;
          return (
            <div key={"notice" + index} className="c-studcard-02">
              <div className="title__1">{notice.notice_text}</div>
              <div className="clearfix">
                <div className="c-inner-bcrm dot pull-left">
                  <span>{notice.subject_name}</span>
                  <span>{moment(notice.created_at).fromNow()}</span>
                </div>
                <div className="pull-right">
                  <span ><i data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteNotice.bind(this, notice.batch_notice_id, "notice")} className="icon cg-rubbish-bin-delete-button linkbtn hover-pointer" ></i></span>
                  {/* <div className="prof__pic" data-toggle="tooltip" data-placement="left" title={notice.professor_name}><img src="/images/avatars/Avatar_10.jpg" /></div> */}
                </div>
              </div>
            </div>
          )
        }
      })
    }
  }

  render() {
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Timetable</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" data-toggle="modal" data-target="#createNotice">Add New Notice</button>
            </div>
          </div>
        </div>
        {/* {this.state.addloader == true ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "45%", marginTop: "15%" }}>
          <ClipLoader
            className={override}
            sizeUnit={"px"}
            size={50}
            color={'#123abc'}

          /></div> : */}
        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="c-inline-calender"></div>
              <div className="block-title st-colored noborder">Notice</div>
              <div className="clearfix margin25-bottom">
                {this.renderRecentNotices()}
              </div>
              <div className="clearfix margin25-bottom">
                <button className="c-btn-white" data-toggle="modal" data-target="#viewNotice">Show All Notice</button>
              </div>
            </div>
            <div className="col-md-9 col-sm-6 col-xs-12">
              <div className="block-title st-colored noborder">Calender</div>
              <div id="calendar"></div>
            </div>
          </div>
        </div>
        {/* } */}
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
        <NewNoticeModel onCreateNewNotice={(data) => { this.newNotice(data) }} batchId={this.state.batchId} {...this.props} disabledflag={false} batchdetailflag={false}/>
        <ViewNotice noticeList={this.state.recentNotices} batchId={this.state.batchId} instituteId={this.props.instituteId} branchId={this.props.branchId} token={this.props.token} sentfrom="proTimeTable" deleteNoticeFun={this.props.deleteNotice.bind((this))} refreshDatas={this.refreshDatas.bind(this)} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  timeTable: professor.timeTable,
  createNotice: professor.createNotice,
  batchList: professor.batchList,
  token: auth.token,
  noticeDelete: professor.noticeDelete,
  professorTimetableHwDueInfo: professor.professorTimetableHwDueInfo,
  professorTimetableNoticeinfo: professor.professorTimetableNoticeinfo
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      professorTimeTable,
      createNewNoticeBatchDetailDahboard,
      professorBatchList,
      deleteNotice,
      getProfessorTimetableHomeworkdueInfo,
      getProfessorTimetableNoticeInfo
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorTimeTable)