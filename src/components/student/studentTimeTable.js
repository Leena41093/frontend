import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { studentTimeTable, getStudentTimetableDeadlineInfo, getStudentTimetableNoticeInfo } from '../../actions/studentAction';
import { ViewStudentTimetableNotice } from '../student/studentModal/viewStudentTimetableNotice';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

let calendar = "";

class StudentTimeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentEvent: [],
      recentNotices: [],
      instituteId: 0,
      addloader: true
    }
  }

  componentWillReceiveProps(nextProps) {
    let id = localStorage.getItem("instituteid");
    
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        // localStorage.removeItem("instituteid")
        // $('#calendar').fullCalendar('removeEvents');
        this.setState({ instituteId: nextProps.instituteId,studentEvent:[],  recentNotices: [] }, () => {
        
          this.getEvent();
        });
      }
    }

  }

  componentDidMount() {
    this.setState({instituteId:this.props.instituteId},()=>{
      this.getEvent();
    })
   
  }

  getEvent() {

    let { studentEvent, recentNotices } = this.state;
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    let homeworks = [];
    let quizs = [];
    let notices = [];
    let schedules = [];

    this.props.getStudentTimetableDeadlineInfo(apiData).then(() => {
      let {studentEvent} = this.state;
      studentEvent = [];
      let res = this.props.studentTimetableDeadlineinfo;
      if (res && res.data.status == 200) {
        
        homeworks = res.data.response.homeworkDueDetails;
        quizs = res.data.response.quizDueDetails;
        if (homeworks && homeworks.length > 0) {
          homeworks.map((homework, index) => {
            studentEvent.push({
              title: "HW ->" + homework.title,
              start: homework.end_date,
              name: homework.title,
              color: "#FFCC01",
              textColor: 'black',

            })
          })
        }
        if (quizs && quizs.length > 0) {
          quizs.map((quiz, index) => {
            studentEvent.push({
              title: "Quiz->" + quiz.title,
              start: quiz.end_date,
              name: quiz.title,
              color: "#990000",
              textColor: 'white',
            })
          })
        }
        this.setState({ studentEvent, addloader: false }, () => {
         
        })
      }
    })
    this.props.getStudentTimetableNoticeInfo(apiData).then(() => {
      let {studentEvent} = this.state;
      let res = this.props.studentTimetableNotice
      if (res && res.data.status == 200) {

        recentNotices = res.data.response.batchNoticeDetails;

        // notices = res.data.response.noticesData;
        // if (notices && notices.length > 0) {
        //   notices.map((notice, index) => {
        //     studentEvent.push({
        //       title: "+Notices",
        //       start: notice.created_at,
        //       name: notice.notice_text,
        //       color: "#FFFFFF",
        //       textColor: "black",
        //     })
        //   })
        // }
        this.setState({  recentNotices, addloader: false }, () => {
         
        })
      }
    })

    this.props.studentTimeTable(apiData).then(() => {
      let {studentEvent} = this.state;
      let res = this.props.timetable;
    
      if (res && res.status == 200) {

        schedules = res.data.response.scheduleObj;


        if (schedules && schedules.length > 0) {
          schedules.map((schedule, index) => {
            let title = `${schedule.subject_name} ${schedule.start_time} to ${schedule.end_time}`
            schedule.scheduleDates.map((date, idx) => {

              studentEvent.push({
                title: title,
                name: title,
                start: date.batch_date,
                color: "#F2F2F5",
                textColor: "#696969",
              })
            })
          })
        }
        this.setState({ studentEvent,  addloader: false }, () => {
          this.initializeFullCalender()
        })
      }
    })
  }

  initializeFullCalender() {
    $('#calendar').fullCalendar('destroy');
    calendar = $('#calendar').fullCalendar({
      defaultView: 'month',
      editable: true,
      events: this.state.studentEvent,
      displayEventTime: false,
      eventRender: function (event, element) {
        element.css("margin-bottom", "1px");
        element.css("border-radius", "9px");
        element.attr('title', event.name);
      },
      eventLimit: true,
    })

    
  }

  renderRecentNotices() {
    let { recentNotices } = this.state;

    if (recentNotices && recentNotices.length > 0) {
      let count = 0
      return recentNotices.map((notices, index) => {
        if (count < 3) {
          count++;
          return (
            <div key={"notices" + index} className="c-studcard-02">
              <div className="title__1">{notices.notice_text}</div>
              <div className="clearfix">
                <div className="c-inner-bcrm dot pull-left">
                  {/* <span>{notices.subject_name}</span> */}
                  <span>{moment(notices.created_at).fromNow()}</span>
                </div>
                <div className="pull-right">
                  <div className="prof__pic" data-toggle="tooltip" data-placement="left" title={notices.professor_name}><img src={notices.picture_url} /></div>
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
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Timetable</span>
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
        < ViewStudentTimetableNotice noticeList={this.state.recentNotices} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, student, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  timetable: student.timetable,
  token: auth.token,
  studentTimetableDeadlineinfo: student.studentTimetableDeadlineinfo,
  studentTimetableNotice: student.studentTimetableNotice
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      studentTimeTable,
      getStudentTimetableDeadlineInfo,
      getStudentTimetableNoticeInfo
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentTimeTable)