import React, { Component } from 'react';
//import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getClasses, addEnquiry, getEnquiryList, getRestoreId, storeRestoreId, getProfilePic, getIsProfessorAdmin } from '../../actions/index';
import moment from 'moment';
import { AddEnquiryModal } from '../common/addEnquiryModal';
import { logout } from '../../actions/authAction';

import { getDeadlineNotifications, updateProfessorNoticeLastseen, getProfessorNotiSubmissionList, updateProfessorCommentLastSeen } from '../../actions/professorActions';
import { getStudentDeadlineNotifications, updateStudentNoticeLastseen, getStudentNotiSubmissionList, updateCommentLastSeen } from '../../actions/studentAction';
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";
import { successToste, errorToste } from '../../constant/util';
let table = '0';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

      homeworkDeadline: [],
      quizDeadline: [],
      newNotices: [],
      allNotices: [],
      newAssign: [],
      oldAssign: [],
      assignNewNote: [],
      NotificationCount: 0,
      enquiry: {},
      isEnquiryAdd: false,
      newNotesAssignList: [],
      newQuizAssignList: [],
      newHomeworkAssignList: [],
      homeworkDues: [],
      quizDues: [],
      selfHomeworkChecked: [],
      selfHomeworkSubmission: [],
      selfQuizChecked: [],
      totalCount: 0,
      professorNewSubmissionlist: [],
      professorOldSubmissionlist: [],
      studentNewSubmissionlist: [],
      studentOldSubmissionlist: [],
      profSubmissionNotificationCount: 0,
      newComments: [],
      submissionNotiCount: 0,
      newAssignSubmission: [],
      oldAssignSubmission: [],
      totalNotiSubCount: 0,
      restoreid: "",
      userProfileUrl: "",
      isProfessorAdmin:false
    }
  }

  logout() {
    localStorage.clear();
    this.props.history.push('/');
    this.props.logout();
  }

  componentWillReceiveProps(nextProps) {
    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        // localStorage.removeItem("instituteid")
        this.setState({ instituteId: nextProps.instituteId }, () => {
          const data = {
            institudeId: this.props.instituteId,
            branchId: this.props.branchId,
            token: this.props.token
          }
          this.props.getProfilePic(data).then(() => {
            var res = this.props.getProfilePicture
            if (res && res.status == 200) {
              this.setState({ userProfileUrl: res.response.profilePicture!="" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg"})
            }
            else if(res && res.status == 500){
              this.setState({userProfileUrl:"/images/avatars/Avatar_Default.jpg"})
            }
          })

          var datas = {
            institudeId: this.props.instituteId,
            branchId: this.props.branchId,
            token: this.props.token,
          }
          this.props.getIsProfessorAdmin(datas).then(() => {
            var res = this.props.ProfessorAdmin;
            if (res && res.data.status == 200) {
             this.setState({isProfessorAdmin: res.data.response.isProfessorAdmin})
            }
            })
            this.getNotifications();
          this.professorNotificationSubmissionlist();
        });
      }
    }
  }

  componentDidMount() {

    let localData = localStorage.getItem("persist:root");

    if (!(JSON.parse(localData) && JSON.parse(localData).auth && JSON.parse(JSON.parse(localData).auth) && JSON.parse(JSON.parse(localData).auth).token)) {
      this.props.history.push('/');
    } else if (JSON.parse(localData) && JSON.parse(JSON.parse(localData).auth).userType == "SUPERADMIN" || JSON.parse(localData) && JSON.parse(JSON.parse(localData).auth).userType == "SALES" || JSON.parse(localData) && JSON.parse(JSON.parse(localData).auth).userType == "SUBADMIN") {
      this.logout();
    }
    const data = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token
    }
    if(data.institudeId != null && data.branchId != null && data.institudeId != "" && data.branchId != ""){
    this.props.getProfilePic(data).then(() => {
      var res = this.props.getProfilePicture
      if ( res && res.status == 200) {
        this.setState({ userProfileUrl: res.response.profilePicture!="" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg"})
      }
      else if( res && res.status == 500){
        this.setState({userProfileUrl:"/images/avatars/Avatar_Default.jpg"})
      }
    })

    this.getNotifications();
    this.professorNotificationSubmissionlist();
  }
  }

  componentWillUnmount() {
    var ifConnected = window.navigator.onLine;
    if(ifConnected){
    window.fcWidget.destroy();
    }
  }

  getNotifications() {
    if (this.props.userType == 'PROFESSOR') {
      let data = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,

      }
      this.props.getDeadlineNotifications(data).then(() => {
        let res = this.props.deadlineNotifications;

        if (res && res.status == 200) {
          let count = (res.data.response.newNotification ? res.data.response.newNotification.length : 0) +
            (res.data.response.oldNotification ? res.data.response.oldNotification.length : 0);

          this.setState({

            newNotices: res.data.response.newNotices,
            allNotices: res.data.response.allNotices,
            newAssign: res.data.response.newNotification,
            oldAssign: res.data.response.oldNotification,

            NotificationCount: count,
            totalCount: res.data.response.totalCount ? res.data.response.totalCount : 0
          })
        }
      })
    }
    else if (this.props.userType == 'STUDENT') {

      let data = {
        payload: {},
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.getStudentDeadlineNotifications(data).then(() => {
        let res = this.props.studentNotifications;
        if (res && res.status == 200) {
          let count = (res.data.response.newAssign ? res.data.response.newAssign.length : 0) +
            (res.data.response.oldAssign ? res.data.response.oldAssign.length : 0) +
            (res.data.response.selfHomeworkSubmission ? res.data.response.selfHomeworkSubmission.length : 0);


          if (res.data.response.newAssign && res.data.response.newAssign.length > 0) {
            var totalCount = 0;
            res.data.response.newAssign.forEach((item) => {
              if (item.notice_text) {
                totalCount = totalCount + 0;
              }
              else {
                totalCount = totalCount + 1;
              }
            })
          }

          this.setState({
            newAssign: res.data.response.newAssign,
            oldAssign: res.data.response.oldAssign,
            newNotesAssignList: res.data.response.newNotesAssignList,
            NotificationCount: count,
            totalCount: totalCount
          })
        }
      })

    }

  }

  professorNotificationSubmissionlist() {
    if (this.props.userType == 'PROFESSOR') {
      let data = {
        payload: {},
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.getProfessorNotiSubmissionList(data).then(() => {
        let res = this.props.professorNotifiSubmissionlist;

        if (res && res.status == 200) {
          let notificationCount = (res.data.response.newSubmissionList ? res.data.response.newSubmissionList.length : 0) +
            (res.data.response.oldSubmissionList ? res.data.response.oldSubmissionList.length : 0)


          this.setState({
            professorNewSubmissionlist: res.data.response.newSubmissionList,
            professorOldSubmissionlist: res.data.response.oldSubmissionList,
            submissionNotiCount: notificationCount,
            totalNotiSubCount: res.data.response ? res.data.response.totalCount : 0
          })
        }
      })
    }
    else if (this.props.userType == 'STUDENT') {
      let data = {
        payload: {},
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.getStudentNotiSubmissionList(data).then(() => {
        let res = this.props.studentNotiSublist;
        
        if (res && res.status == 200) {
          let notificationCount = (res.data.response.newSubmissions ? res.data.response.newSubmissions.length : 0) +
            (res.data.response.oldSubmissions ? res.data.response.oldSubmissions.length : 0)


          let totalNotiSubCount = res.data.response.newSubmissions ? res.data.response.newSubmissions.length : 0;
          this.setState({
            studentNewSubmissionlist: res.data.response.newSubmissions,
            studentOldSubmissionlist: res.data.response.oldSubmissions,
            newNotices: res.data.response.newNotices,
            newComments: res.data.response.newComments,
            submissionNotiCount: notificationCount,
            totalNotiSubCount: totalNotiSubCount
          })
        }
      })
    }
  }

  getProfile() {
    let typeOfUser = this.props.userType;
    if (typeOfUser == 'PROFESSOR') {
      this.props.history.push('/app/get-professorProfile')
    }
    else if (typeOfUser == 'STUDENT') {
      this.props.history.push('/app/get-studentProfile')
    }
    else if (typeOfUser == 'INSTITUTE') {
      this.props.history.push('/app/get-professorProfile')
    }
    else if (typeOfUser == 'ADMIN') {
      this.props.history.push('/app/admin-getprofile')
    }

  }

  termsOfUse() {
    this.props.history.push({ pathname: '/app/terms-of-use' })
  }

  privacyPolicy() {
    this.props.history.push({ pathname: '/app/privacy-policy' })
  }

  passwordChange() {
    this.props.history.push({ pathname: '/app/change-password' })
  }

  onGetSubmission() {
    if (this.props.userType == 'PROFESSOR') {


      let studHwSubId = [];
      let studQuizSubId = [];

      if (this.state.professorNewSubmissionlist && this.state.professorNewSubmissionlist.length > 0) {
        this.state.professorNewSubmissionlist.map((data) => {

          if (data.type == 'homework') {
            studHwSubId.push(data.student_homework_submission_id)
          }
          if (data.type == 'quiz') {
            studQuizSubId.push(data.student_quiz_submission_id)
          }

        })
      }

      let data = {
        payload: {
          student_quiz_submission_ids: studQuizSubId,
          student_homework_submission_id: studHwSubId,

          last_seen: moment()
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }

      this.props.updateProfessorCommentLastSeen(data).then(() => {
        this.setState({ totalNotiSubCount: 0 })
      })

    }
    else if (this.props.userType == 'STUDENT') {
      let studHwSubId = [];
      let studQuizSubId = [];
      let studNoticeSubId = [];
      let studCommentId = [];

      if (this.state.studentNewSubmissionlist && this.state.studentNewSubmissionlist.length > 0) {
        this.state.studentNewSubmissionlist.map((data) => {

          if (data.type == 'homework') {
            studHwSubId.push(data.student_homework_submission_id)
          }
          else if (data.type == 'quiz') {
            studQuizSubId.push(data.student_quiz_submission_id)
          }

        })
      }

      if (this.state.newNotices && this.state.newNotices.length > 0) {
        this.state.newNotices.map((data) => {
          studNoticeSubId.push(data.batch_notice_id)
        })
      }

      if (this.state.newComments && this.state.newComments.length > 0) {
        this.state.newComments.map((data) => {
          studCommentId.push(data.comment_id)
        })
      }

      let data = {
        payload: {
          student_quiz_submission_id: studQuizSubId,
          student_homework_submission_id: studHwSubId,
          batch_notice_id: studNoticeSubId,
          comment_id: studCommentId,
          last_seen: moment()
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }

      this.props.updateCommentLastSeen(data).then(() => {
        this.setState({ totalNotiSubCount: 0 })
      })
    }
  }

  renderOnclick() {

    if (this.props.userType == 'PROFESSOR') {

      let homeworkId = [];
      let quizId = [];
      let notesId = [];
      let noticeId = [];

      if (this.state.newAssign && this.state.newAssign.length > 0) {
        this.state.newAssign.map((data) => {
          if (data.type == "homework") {
            homeworkId.push(data.batch_homework_id)
          }
          else if (data.type == "quiz") {
            quizId.push(data.batch_quiz_id)
          }
          else if (data.type == "notes") {
            notesId.push(data.batch_notes_id)
          }
          else if(data.hasOwnProperty("notice_text")) {
            noticeId.push(data.batch_notice_id)
          }
        })
      }

      let data = {
        payload: {
          "notice_last_seen": moment(),
          "batch_notice_ids": noticeId,
          "batch_homework_id": homeworkId,
          "batch_quiz_id": quizId,
          "batch_notes_id": notesId
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.updateProfessorNoticeLastseen(data).then(() => {
        this.setState({ totalCount: 0 })
      })

    }
    else if (this.props.userType == 'STUDENT') {
      let homeworkId = [];
      let quizId = [];
      let notesId = [];
      if (this.state.newAssign && this.state.newAssign.length > 0) {
        this.state.newAssign.map((data) => {
          if (data.type == "homework") {
            homeworkId.push(data.batch_homework_id)
          }
          else if (data.type == "quiz") {
            quizId.push(data.batch_quiz_id)
          }
          else if (data.type == "notes") {
            notesId.push(data.batch_notes_id)
          }
        })
      }


      let data = {
        payload: {
          batch_notes_ids: notesId,
          batch_homework_ids: homeworkId,
          batch_quiz_ids: quizId,
          last_seen: moment()
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.updateStudentNoticeLastseen(data).then(() => {
        this.setState({ totalCount: 0 })
      })
    }
  }

  onEnquiryAdd(enquiry) {

    let firstname = enquiry.enquiry.firstname.split(' ');
    let name = firstname[0];
    let surname = firstname[firstname.length - 1];
    let statusFlag = enquiry.enquiry.status;

    if (statusFlag && statusFlag.length > 0) {
      statusFlag = enquiry.enquiry.status
    } else {
      statusFlag = "Added"
    }
    let data = {
      payload: {
        firstname: name,
        lastname: surname,
        class_id: enquiry.enquiry.class_id,
        note: enquiry.enquiry.note,
        mobile: Number(enquiry.enquiry.mobile),
        email: enquiry.enquiry.email,
        status: statusFlag,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      enquiry_id: enquiry.enquiry.enquiry_id,
      token: this.props.token,
    }

    if (enquiry && enquiry.enquiry.enquiry_id) {

      this.props.updateEnquiry(data).then(() => {
        let updatedenquiry = this.props.updatedEnquiryResponse;
        if (updatedenquiry && updatedenquiry.status === 200) {
          let { editable } = !this.state.editable;
          this.setState({ editable });
        }
        table.fnDraw();
        successToste("Enquiry Updated Successfully")
      })
    }
    else {
      this.setState({ isEnquiryAdd: true })
      this.props.addEnquiry(data).then(() => {
        let res = this.props.newEnquiry

        if (res && res.status == 200) {
          this.props.history.push('/app/enquiry-detail')
          toast.info("Enquiry Added Successfully", {
            position: toast.POSITION.TOP_CENTER
          });
        }
        else if (res && res.status == 500) {
          errorToste(res.message)
        }
        else {
          toast.info('Something went wrong', {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
    }
    $("#addnewEnquiryHeader .close").click();
  }

  onEditEnquiry(enquiry, flag) {
    if (flag != false) {
      enquiry.isEdit = true
    }
    this.setState({ enquiry })
  }

  renderNotifications() {
    if (this.props.userType == 'PROFESSOR') {
      let oldAssign = this.state.oldAssign;
      let notification = [];

      let newAssign = this.state.newAssign;
      if (newAssign && newAssign.length > 0) {
        notification.push(newAssign.map((quiz, index) => {

          return (
            <div key={"recentSub1" + index}>
              {quiz.type == "homework" ?
                <li className="notify-type t-homework">
                  <a>
                    <div className="notifi-img"></div>
                    <h5 className="notify-info">New homework <strong style={{ fontWeight: "700" }}>{quiz.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{quiz.subject} </strong> is assigned</h5>
                    <span className="notify-time">{moment(quiz.creationTime).fromNow()}</span>
                  </a>
                </li> : (quiz.type == "quiz" ?
                  <li className="notify-type t-quiz">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">New quiz <strong style={{ fontWeight: "700" }}>{quiz.quizTopic}</strong> in subject <strong style={{ fontWeight: "700" }}>{quiz.subject} </strong> is assigned</h5>
                      <span className="notify-time">{moment(quiz.creationTime).fromNow()}</span>
                    </a>
                  </li> : (quiz.type == "notes") ?
                    <li key={"recentSub" + index} className="notify-type t-notes">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">New Notes <strong style={{ fontWeight: "700" }}>{quiz.notesTopic}</strong> in subject <strong style={{ fontWeight: "700" }}>{quiz.subject} </strong> is assigned</h5>
                        <span className="notify-time">{moment(quiz.creationTime).fromNow()}</span>
                      </a>
                    </li> :(quiz.hasOwnProperty("notice_text"))?
                    <li className="notify-type t-quiz">
                      <a>
                        <img src={quiz.picture_url} style={{ height: "20px", width: "20px", marginLeft: "-45px" }} className="user-img" alt="" />
                        <h5 className="notify-info" style={{ marginTop: "-24px" }}>New Notice <strong style={{ fontWeight: "700" }}>{quiz.notice_text}</strong>  is created</h5>
                        <span className="notify-time">{moment(quiz.created_at).fromNow()}</span>
                      </a>
                    </li>:""
                )
              }
            </div>
          )
        }))
      }

      if (oldAssign && oldAssign.length > 0) {
        notification.push(oldAssign.map((data, index) => {
          return (

            <div key={"recentSub2" + index}>
              {data.type == "homework" ?
                <li className="notify-type t-homework">
                  <a>
                    <div className="notifi-img"></div>
                    <h5 className="notify-info">New homework <strong style={{ fontWeight: "700" }}>{data.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject} </strong> is assigned</h5>
                    <span className="notify-time">{moment(data.creationTime).fromNow()}</span>
                  </a>
                </li> : (data.type == "quiz" ?
                  <li className="notify-type t-quiz">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">New quiz <strong style={{ fontWeight: "700" }}>{data.quizTopic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject} </strong> is assigned</h5>
                      <span className="notify-time">{moment(data.creationTime).fromNow()}</span>
                    </a>
                  </li> : (data.type == "notes") ?
                    <li className="notify-type t-notes">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">New notes <strong style={{ fontWeight: "700" }}>{data.notesTopic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject} </strong> is assigned</h5>
                        <span className="notify-time">{moment(data.creationTime).fromNow()}</span>
                      </a>
                    </li> :
                    <li className="notify-type t-quiz">
                      <a>
                        <img src={data.picture_url} style={{ height: "20px", width: "20px", marginLeft: "-45px" }} className="user-img" alt="" />
                        <h5 className="notify-info" style={{ marginTop: "-24px" }}>New Notice <strong style={{ fontWeight: "700" }}>{data.notice_text}</strong>  is created</h5>
                        <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                      </a>
                    </li>)}
            </div>

          )
        }))
      }


      return notification;
    }
    else if (this.props.userType == 'STUDENT') {

      let newAssign = this.state.newAssign;
      let notification = [];
      if (newAssign && newAssign.length > 0) {
        notification.push(newAssign.map((data, index) => {
          return (

            <div key={"recentSub3" + index}>
              <div  >
                {data.type == "homework" ?
                  <li  className="notify-type t-homework">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">New homework <strong style={{ fontWeight: "700" }}>{data.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name} </strong> is assigned</h5>
                      <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                    </a>
                  </li> : (data.type == "quiz") ?
                    <li  className="notify-type t-quiz">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">New quiz <strong style={{ fontWeight: "700" }}>{data.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name} </strong> is assigned</h5>
                        <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                      </a>
                    </li> : (data.type == "notes") ?
                      <li  className="notify-type t-notes">
                        <a>
                          <div className="notifi-img"></div>
                          <h5 className="notify-info">New Notes <strong style={{ fontWeight: "700" }}>{data.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name} </strong> is assigned</h5>
                          <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                        </a>
                      </li> : ""
                }
              </div>

              <div>
                {(data.type == "homeworkChecked") ?
                  <li className="notify-type t-homework">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">Your homework <strong style={{ fontWeight: "700" }}>{data.topic} </strong> is now checked.You've got  <strong style={{ fontWeight: "700" }}>{data.marksGot ? data.marksGot : ""} </strong>marks</h5>
                      <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                    </a>
                  </li> : (data.type == "quizChecked") ?
                    <li className="notify-type t-quiz">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">Your quiz <strong style={{ fontWeight: "700" }}>{data.topic}</strong> is now checked. You've got  <strong style={{ fontWeight: "700" }}>{data.marks + "/" + data.total} </strong>marks</h5>
                        <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                      </a>
                    </li> : ""
                }
              </div>

              <div>
                {(data.type == "homeworkSubmitted") ?
                  <li className="notify-type t-homework">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">You submitted homework <strong style={{ fontWeight: "700" }}>{data.topic} </strong></h5>
                      <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                    </a>
                  </li> : (data.type == "quizSubmitted") ?
                    <li className="notify-type t-quiz">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">You submitted quiz <strong style={{ fontWeight: "700" }}>{data.topic}</strong>. You've got  <strong style={{ fontWeight: "700" }}>{data.marks + "/" + data.total} </strong>marks</h5>
                        <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                      </a>
                    </li> : ""
                }
              </div>
            </div>
          )
        }))
      }


      let oldAssign = this.state.oldAssign;
      if (oldAssign && oldAssign.length > 0) {
        notification.push(oldAssign.map((data, index) => {
          return (
            <div key={"recentSub6" + index}>


              <div>
                {(data.type == "homeworkSubmitted") ?
                  <li className="notify-type t-homework">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">You submitted homework <strong style={{ fontWeight: "700" }}>{data.topic} </strong></h5>
                      <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                    </a>
                  </li> : (data.type == "quizSubmitted") ?
                    <li className="notify-type t-quiz">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">You submitted quiz <strong style={{ fontWeight: "700" }}>{data.topic}</strong>. You've got  <strong style={{ fontWeight: "700" }}>{data.marks + "/" + data.total} </strong>marks</h5>
                        <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                      </a>
                    </li> : ""
                }
              </div>

              <div>
                {(data.type == "homeworkChecked") ?
                  <li className="notify-type t-homework">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">Your homework <strong style={{ fontWeight: "700" }}>{data.topic} </strong> is now checked.You've got  <strong style={{ fontWeight: "700" }}>{data.marksGot ? data.marksGot : ""} </strong>marks</h5>
                      <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                    </a>
                  </li> : (data.type == "quizChecked") ?
                    <li className="notify-type t-quiz">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">Your quiz <strong style={{ fontWeight: "700" }}>{data.topic}</strong> is now checked. You've got  <strong style={{ fontWeight: "700" }}>{data.marks + "/" + data.total} </strong>marks</h5>
                        <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                      </a>
                    </li> : ""
                }
              </div>
              <div>
                {(data.type == "homework") ?
                  <li className="notify-type t-homework">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">New homework <strong style={{ fontWeight: "700" }}>{data.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name} </strong> is assigned</h5>
                      <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                    </a>
                  </li> : (data.type == "quiz" ?
                    <li className="notify-type t-quiz">
                      <a>
                        <div className="notifi-img"></div>
                        <h5 className="notify-info">New quiz <strong style={{ fontWeight: "700" }}>{data.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name} </strong> is assigned</h5>
                        <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                      </a>
                    </li> : (data.type == "notes") ?
                      <li className="notify-type t-notes">
                        <a>
                          <div className="notifi-img"></div>
                          <h5 className="notify-info">New Notes <strong style={{ fontWeight: "700" }}>{data.topic}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name} </strong> is assigned</h5>
                          <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                        </a>
                      </li> : "")
                }
              </div>
            </div>
          )
        }))
      }


      return notification;
    }
  }

  renderProfSubmissionNotifications() {
    let { professorNewSubmissionlist, professorOldSubmissionlist } = this.state;
    let notification = [];
    if (this.props.userType == "PROFESSOR") {
      if (professorNewSubmissionlist && professorNewSubmissionlist.length > 0) {
        notification.push(professorNewSubmissionlist.map((data, index) => {
          return (
            <div key={"recentSub" + index}>
              {data.type == "homework" ?
                <li className="notify-type t-homework">
                  <a>
                    <div className="notifi-img"></div>
                    <h5 className="notify-info" >{data.firstName + " " + data.lastName} submitted {data.type}  <strong style={{ fontWeight: "700" }}>{data.homeworkTitle}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name}</strong></h5>
                    <span className="notify-time">{moment(data.submissionTime).fromNow()}</span>
                  </a>
                </li> :
                <li className="notify-type t-quiz">
                  <a>
                    <div className="notifi-img"></div>
                    <h5 className="notify-info">{data.firstName + " " + data.lastName} submitted {data.type}   <strong style={{ fontWeight: "700" }}>{data.quizTitle}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name}</strong></h5>
                    <span className="notify-time">{moment(data.submissionTime).fromNow()}</span>
                  </a>
                </li>}
            </div>


          )
        }))
      }

      if (professorOldSubmissionlist && professorOldSubmissionlist.length > 0) {
        notification.push(professorOldSubmissionlist.map((data, index) => {
          return (
            <div  key={"recentSub" + index}>
              {data.type == "homework" ?
                <li className="notify-type t-homework">
                  <a>
                    <div className="notifi-img"></div>
                    <h5 className="notify-info">{data.firstName + " " + data.lastName} submitted {data.type}  <strong style={{ fontWeight: "700" }}>{data.homeworkTitle}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name}</strong></h5>
                    <span className="notify-time">{moment(data.submissionTime).fromNow()}</span>
                  </a>
                </li> :
                <li className="notify-type t-quiz">
                  <a>
                    <div className="notifi-img"></div>
                    <h5 className="notify-info">{data.firstName + " " + data.lastName} submitted {data.type}   <strong style={{ fontWeight: "700" }}>{data.quizTitle}</strong> in subject <strong style={{ fontWeight: "700" }}>{data.subject_name}</strong></h5>
                    <span className="notify-time">{moment(data.submissionTime).fromNow()}</span>
                  </a>
                </li>}
            </div>
          )
        }))
      }
      return notification;
    }
    else if (this.props.userType == "STUDENT") {
      let { studentNewSubmissionlist, studentOldSubmissionlist } = this.state;
      if (studentNewSubmissionlist && studentNewSubmissionlist.length > 0) {
        notification.push(studentNewSubmissionlist.map((data, index) => {
          return (
            <div key={"recentSub" + index}>
              {(data.type == "homework") ?
                <li className="notify-type t-homework">
                  <a>
                    <div className="notifi-img"></div>
                    {data.marks && data.total ?
                      <h5 className="notify-info">
                        {data.firstName + " " + data.lastName} submitted  {data.type}  <strong style={{ fontWeight: "700" }}>{data.homeworkTitle}</strong>
                      </h5> :
                      <h5 className="notify-info">{data.firstName + " " + data.lastName} submitted  {data.type}  <strong style={{ fontWeight: "700" }}>{data.homeworkTitle}</strong>
                      </h5>}

                    <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                  </a>
                </li> :



                <li className="notify-type t-quiz">

                  <a>
                    <div className="notifi-img"></div>
                    {data.marks && data.total ?
                      <h5 className="notify-info" >
                        {data.firstName + " " + data.lastName} submitted  {data.type} <strong style={{ fontWeight: "700" }}>{data.quizTitle}</strong> and got  <strong style={{ fontWeight: "700" }}>{data.marks + "/" + data.total}</strong>
                      </h5> :
                      <h5 className="notify-info">{data.firstName + " " + data.lastName} submitted  {data.type} <strong style={{ fontWeight: "700" }}>{data.quizTitle}</strong>
                      </h5>}
                    <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                  </a>
                </li>

              }
            </div>


          )
        }))
      }

      if (studentOldSubmissionlist && studentOldSubmissionlist.length > 0) {
        notification.push(studentOldSubmissionlist.map((data, index) => {
          return (
            <div key={"recentSub" + index} >
              {(data.type == "homework") ?
                <li className="notify-type t-homework">
                  <a>
                    <div className="notifi-img"></div>
                    <h5 className="notify-info" >{data.firstName + " " + data.lastName} submitted {data.type}  <strong style={{ fontWeight: "700" }}>{data.homeworkTitle}</strong> </h5>
                    <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                  </a>
                </li> :
                (data.type == "quiz") ?
                  <li className="notify-type t-quiz">
                    <a>
                      <div className="notifi-img"></div>
                      <h5 className="notify-info">{data.firstName + " " + data.lastName} submitted {data.type}   <strong style={{ fontWeight: "700" }}>{data.quizTitle}</strong> and got <strong style={{ fontWeight: "700" }}>{data.marks + "/" + data.total}</strong></h5>
                      <span className="notify-time">{moment(data.created_at).fromNow()}</span>
                    </a>
                  </li> : ""
              }
            </div>


          )
        }))
      }

    }
    return notification;
  }

  renderNewEnquiryButton() {
    
    if (this.props.userType == 'INSTITUTE' || this.props.userType == 'ADMIN') {
      return (
        <li>
          <button data-toggle="modal" data-target="#addnewEnquiryHeader" onClick={this.onEditEnquiry.bind(this, false, false)} className="user-custBtn">New Enquiry</button>
        </li>
      )
    }
    if (this.props.userType == 'PROFESSOR' && this.state.isProfessorAdmin == true) {
      return (
        <li>
          <button data-toggle="modal" data-target="#addnewEnquiryHeader" onClick={this.onEditEnquiry.bind(this, false, false)} className="user-custBtn">New Enquiry</button>
        </li>
      )
    }
  }

  render() {
    let loginData = this.props.login;
    let loginData1 = this.props.authCheck;
    return (
      <div className="c-header">
        <ToastContainer />
        <div className="c-left-sect" style={{ width: "60%" }}>
          <a><img src="/./logo1.svg" alt="logo" style={{ width: "24%", maxHeight: "36px", display: "inline-block" }} /></a>
        </div>
        <div className="c-right-sect">
          <ul>
            <li>
              <div className="clearfix user--prof dropdown">
                <div className="user--img"><img src={this.props.profilePictureUrl} alt="" /></div>
                <button className="user--options" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                  {loginData ? (loginData.data.firstname.length > 8) ? loginData.data.firstname.slice(0, 5) + "..." : loginData.data.firstname : (loginData1.data.response.user_name.length > 8) ? loginData1.data.response.user_name.slice(0, 5) + "..." : loginData1.data.response.user_name}
                  <i className="icon"></i>
                </button>


                <div className="dropdown-menu cust--dd userprof--dd" aria-labelledby="dLabel">
                  <div className="userprof--dd_header">
                    <div className="user_img"><img src={this.props.profilePictureUrl} alt="" /></div>
                    <span className="user_name"> {loginData ? loginData.data.firstname : loginData1.data.response.user_name}</span>
                    <button className="btnuser_prof" onClick={this.getProfile.bind(this)} >View Profile</button>
                  </div>
                  <ul>
                    <li className="linkbtn hover-pointer"><a onClick={this.passwordChange.bind(this)} >Change Password</a></li>
                    <li className="linkbtn hover-pointer"><a onClick={this.termsOfUse.bind(this)}>Terms of use</a></li>
                    <li className="linkbtn hover-pointer"><a onClick={this.privacyPolicy.bind(this)}>Privacy Policy</a></li>
                    <li className="linkbtn hover-pointer"><a onClick={this.logout.bind(this)}>Sign out</a></li>
                  </ul>
                </div>
              </div>
            </li>

           

            

            {/* {this.renderNewEnquiryButton()} */}
          </ul>
        </div>
        {/* <AddEnquiryModal onAddEnquiry={(data) => { this.onEnquiryAdd(data) }} enquiry={this.state.enquiry} classes={this.props.classes}   {...this.props} from="Header" /> */}
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, professor, student }) => ({
  classes: app.classes,
  userName: auth.userName,
  authCheck: auth.authCheck,
  login: auth.login,
  userType: auth.userType,
  token: auth.token,
  deadlineNotifications: professor.deadlineNotifications,
  professorId: professor.professorId,
  branchId: app.branchId,
  instituteId: app.institudeId,
  newEnquiry: app.newEnquiry,
  enquiry_id: app.enquiry_id,
  isProfessorAdmin: auth.isProfessorAdmin,
  studentNotifications: student.studentNotifications,
  studentNoticeLastssenUpdate: student.studentNoticeLastssenUpdate,
  professorNoticeLastSeen: professor.professorNoticeLastSeen,
  professorNotifiSubmissionlist: professor.professorNotifiSubmissionlist,
  studentNotiSublist: student.studentNotiSublist,
  studentCommentLastseeUpdate: student.studentCommentLastseeUpdate,
  professorUpdateCommentLastSeen: professor.professorUpdateCommentLastSeen,
  getRestoredId: app.getRestoredId,
  storeRestoredId: app.storeRestoredId,
  getProfilePicture: app.getProfilePicture,
  profilePictureUrl:app.profilePictureUrl,
  ProfessorAdmin: app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getClasses,
      getDeadlineNotifications,
      addEnquiry,
      getEnquiryList,
      getStudentDeadlineNotifications,
      updateStudentNoticeLastseen,
      updateProfessorNoticeLastseen,
      logout,
      getProfessorNotiSubmissionList,
      getStudentNotiSubmissionList,
      updateCommentLastSeen,
      updateProfessorCommentLastSeen,
      getRestoreId,
      storeRestoreId,
      getProfilePic,
      getIsProfessorAdmin
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Header)
