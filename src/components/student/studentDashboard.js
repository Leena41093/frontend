import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'bootstrap-datepicker';
import { getStudentDashboardDetail, getStudentCommentActivities, getStudentBatchNotices, getStudentClassesData } from '../../actions/studentAction';
import { getBranches } from '../../actions/sidebarAction';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { CountDown } from '../../constant/countDown';
import { ViewStudentAllActivities } from '../student/studentModal/viewStudentAllActivities';
import { StudentDashbordNotice } from '../student/studentModal/studentDashbordNoticeModal';
import { ProfilePicModal } from '../common/profilepic';
import { checkProfileSelectedOrNot, profilePicUpload, getProfilePic, } from '../../actions/index';
import $ from 'jquery';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class StudentDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classData: [],
      studentBatch: [],
      batchNotices: "",
      clsbatches: [],
      currentBatchTab: 0,
      notices: [],
      commentActivities: [],
      activityCount: 0,
      currentClassSelect: {},
      instituteId: 0,
      flag: false,
      addloader: true,
      class_id: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    // if(this.state.flag){

    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {

        //  localStorage.removeItem("instituteid")
        this.setState({ instituteId: nextProps.instituteId, studentBatch: [], commentActivities: [], activityCount: "", clsbatches: [], currentClassSelect: {}, notices: [], batchNotices: [] }, () => {
          // if (this.props.branchId) {

          //   this.getDetail(this.props.branchId)
          // }


          const data = {
            instituteId: this.state.instituteId,
            token: this.props.token,
          }

          this.props.getBranches(data).then(() => {
            if (this.props.branches && this.props.branches.length > 0) {
              const branch = this.props.branches[0];
              let datas = {
                token: this.props.token,
                institute_id: this.state.instituteId,
                branch_id: branch.branch_id
              }

              this.props.getStudentClassesData(datas).then(() => {
                let res = this.props.studentclassdata;
                if (res && res.data.status == 200) {
                  this.setState({ classData: res.data.response, class_id: res.data.response[0].class_id }, () => {
                    this.getDetail(branch.branch_id)
                  });
                }
                else if(res && res.data.status == 500){
                  this.setState({ classData: [], class_id: ""})
                }
              })

            }
          })


        });
      }
    }

    // }
  }


  componentDidMount() {

    if(this.props.instituteId != null && this.props.branchId != null && this.props.instituteId != "" && this.props.branchId != ""){
    const data = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
    }
    this.props.checkProfileSelectedOrNot(data).then(() => {
      var res = this.props.profileSelectedOrNot;
      if (res && res.data.status == 200) {
        if (res.data.response.profileIncomplete == true) {
          $(document).ready(function () {
            $("#openmodal").click();
          });
        }
      }
    })
    if (this.props.branchId) {

      this.setState({ instituteId: this.props.instituteId }, () => {
        let datas = {
          token: this.props.token,
          institute_id: this.state.instituteId,
          branch_id: this.props.branchId
        }

        this.props.getStudentClassesData(datas).then(() => {
          let res = this.props.studentclassdata;
          
          if (res && res.data.status == 200) {
            this.setState({ classData: res.data.response, class_id: res.data.response[0] ? res.data.response[0].class_id:"" }, () => {
              this.getDetail(this.props.branchId)
            });
          }
          else if(res && res.data.status == 500){
            this.setState({classData:[],class_id:""})
          }
        })

      })

    }
    else {
      const data = {
        instituteId: this.props.instituteId,
        token: this.props.token,
      }

      this.props.getBranches(data).then(() => {
        if (this.props.branches && this.props.branches.length > 0) {
          const branch = this.props.branches[0];
          this.getDetail(branch.branch_id)
        }
      })
    }
  }
  }

  getDetail(branchId) {
    var id = localStorage.getItem("instituteid");
    if (id == this.state.instituteId) {

      let apiData = {
        token: this.props.token,
        institute_id: this.state.instituteId,
        branch_id: branchId,
        payload: {
          class_id: this.state.class_id
        }
      }

      let obj = {};
      let { clsbatches } = this.state;
      this.props.getStudentDashboardDetail(apiData).then(() => {
        let res = this.props.dashboardData;
        if (res && res.data.status == 200) {
          this.setState({
            clsbatches: [],
            studentBatch: res.data.response.studentBatch,
            flag: true

          }, () => {
            if (this.state.studentBatch && this.state.studentBatch.length > 0) {
              clsbatches = this.state.studentBatch;

              this.setState({ clsbatches, currentClassSelect: clsbatches[0], addloader: false }, () => {
                this.getNoticeQuizHwData();
              });
            }
          })
        }
      })



    }
    else {
      let apiData = {
        token: this.props.token,
        institute_id: this.state.instituteId,
        branch_id: branchId,
        payload: {
          class_id: this.state.class_id
        }
      }

      
      let { clsbatches } = this.state;
      this.props.getStudentDashboardDetail(apiData).then(() => {
        let res = this.props.dashboardData;
        if (res && res.data.status == 200) {
          this.setState({
            clsbatches: [],
            studentBatch: res.data.response.studentBatch,
            flag: true

          }, () => {
            if (this.state.studentBatch && this.state.studentBatch.length > 0) {
              clsbatches = this.state.studentBatch;

              this.setState({ clsbatches, currentClassSelect: clsbatches[0], addloader: false }, () => {
                this.getNoticeQuizHwData();
              });
            }
          })
        }
      })

    }


  }

  getNoticeQuizHwData() {
    let apiData1 = {
      token: this.props.token,
      institute_id: this.state.instituteId,
      branch_id: this.props.branchId,
      payload: {
        class_id: this.state.class_id
      }
    }
    this.props.getStudentCommentActivities(apiData1).then(() => {
      let res = this.props.commentActivitiesData;
      if (res && res.data.status == 200) {
        let countActivity = res.data.response.commentActivities ? res.data.response.commentActivities.length : 0;
        this.setState({ commentActivities: res.data.response.commentActivities, activityCount: countActivity, });
      }
    })
    this.props.getStudentBatchNotices(apiData1).then(() => {
      let res = this.props.batchdeadlinenotices;
      if (res && res.data.status == 200) {
        this.setState({ batchNotices: res.data.response });
      }
    })
  }

  gotoBatchDetail(batch) {
    this.props.history.push({
      pathname: 'batchdetail-dashboard',
      state: { data: batch, instituteId: this.state.instituteId }
    })
  }

  renderClassTabList() {
    let { classData } = this.state;
    if (classData && classData.length > 0) {

      return classData.map((studentClass, index) => {
        let active = (index === 0) ? "active" : "";
        return (
          <li key={"stud" + index} role="presentation" onClick={this.selectStudentClass.bind(this, studentClass)} className={active}  >
            <a href={"#tab_" + index} aria-controls={"#tab_" + index} role="tab" data-toggle="tab">{studentClass.class_name}</a>
          </li>
        )
      })
    }
    else{  
      return (      
      <div style={{color:"red"}}>No Classes Found for this Institute</div>      
      )
    }
  }

  selectStudentClass(selectedstudentClass) {
    this.setState({ currentClassSelect: selectedstudentClass, class_id: selectedstudentClass.class_id }, () => {
      this.getDetail(this.props.branchId);
    })
  }

  renderBatches(batches) {
    if (batches && batches.length > 0) {
      return batches.map((batch, index) => {
        return (
          <div key={"batch" + index} className="block-cardGrid">
            <div className="cardgrid--item" onClick={this.gotoBatchDetail.bind(this, batch)}>
              <div className="cardgrid--item-header">
                <h2 className="c-heading-sm card--title">
                  {batch.subject_name}
                  {batch.newHomeworkCount || batch.newQuizCount || batch.newNotesCount > 0 ? <span className="c-count pull-right st-colored">NEW</span> : ""}
                </h2>
                <span>{batch.batch_name}</span>
              </div>
              <div className="cardgrid--item-section">
                <ul className="item-listing st-coloured">
                  <li>
                    {batch.newHomeworkCount != 0 ? <i className="icon cg-icon-homework-active"></i> : ""}
                    {batch.newHomeworkCount != 0 ? <span>{batch.newHomeworkCount + " " + "New Homeworks"}</span> : ""}
                  </li>
                  <li>
                    {batch.newQuizCount != 0 ? <i className="icon cg-icon-quiz-active"></i> : ""}
                    {batch.newQuizCount != 0 ? <span>{batch.newQuizCount + " " + "New Quizzes"}</span> : ""}
                  </li>
                  <li>
                    {batch.newNotesCount != 0 ? <i className="icon cg-icon-notes-active"></i> : ""}
                    {batch.newNotesCount != 0 ? <span>{batch.newNotesCount + " " + "New Notes"} </span> : ""}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  renderCommentActivities() {
    let commentActivity = this.state.commentActivities;
    if (commentActivity && commentActivity.length > 0) {
      let count = 0;
      return commentActivity.map((comment, index) => {
        if (count < 3) {
          count++;
          return (
            <li key={"key" + index}>
              <div className="user_img"><img src={comment.picture_url} alt="" /></div>
              <div className="msg__info">{comment.commenttedUserName} commented on {comment.homeworkTitle ? comment.homeworkTitle : comment.notesTitle} : <strong>" {comment.commentText} "</strong></div>
              <div className="msg__time">{moment(comment.commentTime).fromNow()}</div>
            </li>
          )
        }
      })
    }
  }



  renderClassTab() {
    let { clsbatches } = this.state;
    let tabClassName = 0
    if (clsbatches && clsbatches.length > 0) {


      // tabClassName = this.state.currentBatchTab == index ? "tab-pane active" : "tab-pane";
      return (
        <div role="tabpanel" className={tabClassName} id={"tab_"}>
          <div className="grid-block">
            {this.renderBatches(clsbatches)}

          </div>

        </div>
      )
    }
  }

  renderHomeWorkDeadLine(homeWorkDeadline) {
    if (homeWorkDeadline && homeWorkDeadline.length > 0) {
      return homeWorkDeadline.map((homework, index) => {
        const now = moment();
        const myDate = moment(homework.end_date);
        if (moment(homework.end_date) > moment()) {
          if (myDate.subtract(24, 'hour').isBefore(now)) {
            return (
              <div key={"hwdeadlin" + index} className="c-studcard-01 col-orange">
                <div className="title__1">{homework.title}</div>
                <div className="title__2" ><CountDown date={homework.end_date} /></div>
                <div className="title__3">{homework.topic}</div>
                <div className="c-inner-bcrm dot">
                  <span>{homework.subject_name}</span>
                  <span>{moment(homework.end_date).fromNow()}</span>
                </div>
              </div>
            )
          }
        }
      })
    }
  }

  renderQuizDeadline(quizDeadline) {
    if (quizDeadline && quizDeadline.length > 0) {
      return quizDeadline.map((quiz, index) => {
        const now = moment();
        const myDate = moment(quiz.end_date);
        if (moment(quiz.end_date) > moment()) {
          if (myDate.subtract(24, 'hour').isBefore(now)) {
            return (
              <div key={"quizdeadline" + index} className="c-studcard-01 st-colour col-red">
                <div className="title__1">{quiz.title}</div>
                <div className="title__2"><CountDown date={quiz.end_date} /></div>
                <div className="title__3">{quiz.topic}</div>
                <div className="c-inner-bcrm dot">
                  <span>{quiz.subject_name}</span>
                  <span>{moment(quiz.end_date).fromNow()}</span>
                </div>
              </div>
            )
          }
        }
      })
    }
  }

  renderDeadLineBoard() {
    let { batchNotices } = this.state;
    if (batchNotices && batchNotices.homeWorkDeadline) {
      return (
        <div>
          {this.renderHomeWorkDeadLine(batchNotices.homeWorkDeadline)}
          {this.renderQuizDeadline(batchNotices.quizDeadline)}
        </div>
      )

    }
  }

  saveProfile(data) {
    const payloaddata = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
      payload: {
        filename: data.filename,
        gender: data.gender
      }
    }

    this.props.profilePicUpload(payloaddata).then((value) => {
      var res = this.props.profileUpload;
      if (res.data.status == 200) {
        $("#newprofilepic .close").click();
        const downloadPic = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token
        }
        this.props.getProfilePic(downloadPic).then(() => {
          var res = this.props.getProfilePicture
          if (res.status == 200) {
            this.setState({ userProfileUrl: res.response.profilePicture != "" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg" })
          }
          else if (res.status == 500) {
            this.setState({ userProfileUrl: "/images/avatars/Avatar_Default.jpg" })
          }
        })
        successToste("Profile Set Successfully");
      }

    })
  }

  renderNotice() {
    let notices = this.state.batchNotices.notices;
    if (notices) {

      let count = 0;
      // let batchNotice = notices.batches[0].batchNotices;
      return notices.map((notice, index) => {
        if (count < 3) {
          count++
          return (
            <div key={"notices" + index} className="c-studcard-02">
              <div className="title__1">{notice.notice_text}</div>
              <div className="clearfix">
                <div className="c-inner-bcrm dot pull-left">
                  <span>{notice.subject_name}</span>
                  <span>{moment(notice.notice_date).fromNow()}</span>
                </div>
                <div className="pull-right">
                  <div className="prof__pic" data-toggle="tooltip" data-placement="left" title={notice.professor_name}><img src={notice.picture_url} /></div>
                </div>
              </div>
            </div>
          )
        }
      })
    }
  }

  // renderNotesBoard() {

  //   let { studentBatch } = this.state;
  //   if (studentBatch && studentBatch.length > 0) {
  //     return studentBatch.map((notice, index) => {
  //       return (
  //         <div key={"notice" + index}>
  //           {this.renderNotice()}
  //         </div>
  //       )
  //     })
  //   }
  // }

  render() {
    return (
      <div className="c-container clearfix">
        <button id="openmodal" data-toggle="modal" data-target="#newprofilepic" hidden></button>
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Student</span>
              <span className="c-heading-lg">Dashboard</span>
              {/* {(this.state.studentBatch.length == 0&& this.state.commentActivities.length==0) ? <span style={{color:"red"}}>There is no data available</span>:""} */}
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
            <div className="col-md-9 col-sm-6 col-xs-12">
              <div className="drive_dataSect__tabs  tabs--sm clearfix">
                <ul className="nav nav-tabs margin25-bottom" role="tablist">
                  {this.renderClassTabList()}
                </ul>
                <div className="tab-content">
                  {this.renderClassTab()}
                </div>
                <div className="stud_activities">
                  <div className="block-title st-colored margin10-bottom">ACTIVITIES ({this.state.activityCount})</div>
                  <ul>
                    {this.renderCommentActivities()}

                  </ul>
                </div>
                <div className="clearfix margin25-bottom">
                  <button className="c-btn-white" data-toggle="modal" data-target="#viewActivity">Show All Activities</button>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12" >
              <div className="block-title st-colored">NOTICE BOARD</div>
              <div className="clearfix" style={{ overflow: "auto" }} >
                {this.state.batchNotices && this.state.batchNotices.homeWorkDeadline && this.state.batchNotices.quizDeadline ? this.renderDeadLineBoard() : <div></div>}
              </div>
              <div className="clearfix" style={{ overflow: "auto" }}>
                {this.renderNotice()}
              </div>
              <div className="clearfix margin25-bottom">
                <button className="c-btn-white" data-toggle="modal" data-target="#viewNotice">Show All Notice</button>
              </div>

            </div>
          </div>
        </div>
        {/* } */}
        <StudentDashbordNotice noticeList={this.state.batchNotices.notices} />
        <ViewStudentAllActivities activityList={this.state.commentActivities} />
        <ProfilePicModal onSelectProfile={(data) => this.saveProfile(data)} userType={this.props.userType}{...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, student, sidebar }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  branches: sidebar.branches,
  dashboardData: student.dashboardData,
  userType: auth.userType,
  token: auth.token,
  profileSelectedOrNot: app.profileSelectedOrNot,
  profileUpload: app.profileUpload,
  getProfilePicture: app.getProfilePicture,
  commentActivitiesData: student.commentactiviesdata,
  batchdeadlinenotices: student.batchnoticesdeadlinedata,
  studentclassdata: student.studentclassesdata
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getStudentDashboardDetail,
    getBranches, checkProfileSelectedOrNot,
    profilePicUpload, getProfilePic,
    getStudentCommentActivities,
    getStudentBatchNotices,
    getStudentClassesData
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard)