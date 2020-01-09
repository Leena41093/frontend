import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfessorDashboard, professorTimeTableInfo } from '../../actions/professorActions';
import { checkProfileSelectedOrNot, profilePicUpload, getProfilePic } from '../../actions/index';
import { getBranches } from '../../actions/sidebarAction';
import moment from 'moment';
import { ProfilePicModal } from '../common/profilepic';
import { ToastContainer } from 'react-toastify';
import $ from 'jquery';
import 'bootstrap-datepicker';
import { successToste } from '../../constant/util';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class ProfessorDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentBranch: 'select',
      professorDashboard: {},
      isDateChange: false,
      professorTimeTable: [],
      timeTableDate: moment(),
      instituteId: 0,
      flag: true,
      flag1: true,
      currentDate: moment(),
      addloader: true,

    }
  }

  componentWillReceiveProps(nextProps) {

    var id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        this.setState({ instituteId: nextProps.instituteId, professorTimeTable: [], professorDashboard: {}, flag1: true }, () => {
          const data = {
            instituteId: nextProps.instituteId,
            token: this.props.token,
          }
          this.props.getBranches(data).then(() => {
            if (this.props.branches && this.props.branches.length > 0) {
              const branch = this.props.branches[0];
              this.getDashbord(branch.branch_id)
            }
          })
        })
      }
    }
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId },()=>{
      if(this.props.instituteId != null){
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
      this.getDashbord(this.props.branchId)
    }

    else {
      const data = {
        instituteId: this.props.instituteId,
        token: this.props.token,
      }
      this.props.getBranches(data).then(() => {
        if (this.props.branches && this.props.branches.length > 0) {
          const branch = this.props.branches[0];
          this.getDashbord(branch.branch_id)
        }
      })
    }
  }
  });
    if ($(".c-inline-calender").length) {
      $('.c-inline-calender').datepicker({
        startDate: new Date()
      });
    }
    $('#myDatePicker').datepicker().on('changeDate', function (date) {

    })
    
  }

  getDashbord(branchId) {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: branchId,
      token: this.props.token,
    }
    this.props.getProfessorDashboard(data).then(() => {
      let obj = {};
      let clsbatches = [];
      let res = this.props.professorDashboard;
      if (res && res.status === 200 && res.data.response.length != 0) {

        let professorDetail = res.data.response.batchDetail;
        professorDetail.map((cls, index) => {
          if (obj.hasOwnProperty(cls.class_name)) {
            obj[cls.class_name].push(cls);
          } else {

            obj[cls.class_name] = [];
            obj[cls.class_name].push(cls);
          }
        })

        for (const [key, value] of Object.entries(obj)) {

          clsbatches.push({ batches: value, class_name: key });
        }
        this.setState({ professorDashboard: clsbatches, flag1: false });
      } else {
        this.setState({ professorDashboard: [], addloader: false, });
      }
    })

    if ($(".c-inline-calender").length) {
      $('.c-inline-calender').datepicker({

        startDate: new Date()
      }).datepicker('setDate', "0")
    }
    $('#myDatePicker').datepicker().on('changeDate', (date) => {

      this.setState({ timeTableDate: date.date })
      let dd = String(moment(date.date).format("YYYY-MM-DD"));
      let day = new Date(date.date).getDay();

      this.onChangeDate(dd, day);
    })
    var date = this.state.currentDate;

    let dd = String(moment(date._d).format("YYYY-MM-DD"));
    let day = new Date(date._d).getDay();

    this.onChangeDate(dd, day);
  }

  professorBatchDashboardPage(batch) {
    this.props.history.push({
      pathname: '/app/professor-batchDetaildashboard',
      state: { data: batch.batch_id }
    });
  }

  onChangeDate(dd, mm) {
    if (mm == 0) {
      mm = 7
    }

    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "day": mm,
        "date": dd,
      }
    }
    this.props.professorTimeTableInfo(data).then(() => {
      let res = this.props.timeTableInfo
      if (res && res.data.status === 200) {
        this.setState({ professorTimeTable: res.data.response.timeTable, flag: false })
      }
    })
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
      if (res && res.data.status == 200) {
        $("#newprofilepic .close").click();
        const downloadPic = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token
        }
        this.props.getProfilePic(downloadPic).then(() => {
          var res = this.props.getProfilePicture
          if (res && res.status == 200) {
            this.setState({ userProfileUrl: res.response.profilePicture != "" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg" })
          }
          else if (res && res.status == 500) {
            this.setState({ userProfileUrl: "/images/avatars/Avatar_Default.jpg" })
          }
        })
        successToste("Profile Set Successfully");
      }
    })
  }

  renderProfessorbatchDashbord() {
    let batchDetail = this.state.professorDashboard;

    if (batchDetail && batchDetail.length > 0) {
      return batchDetail.map((cls, index) => {

        return (<div key={"key" + index} className="grid-block" >
          <div className="block-title">{cls.class_name}</div>
          <div className="block-cardGrid">
            {cls.batches.map((batch, index) => {
              return (<div key={"batchkey" + index} className="cardgrid--item" onClick={this.professorBatchDashboardPage.bind(this, batch)}>
                <div className="cardgrid--item-header">
                  <h2 className="c-heading-sm card--title">
                    {batch.subject_name}
                    {batch.homeWorkSubmissionCount || batch.quizSubmissionCount > 0 ? <span className="c-count pull-right st-colored">NEW</span> : ''}
                  </h2>
                  <span>{batch.batch_name}</span>
                </div>

                <div className="cardgrid--item-section">
                  <ul className="item-listing">
                    <li>
                      <i className="icon cg-users"></i>
                      <span>{batch.studentCount} Students</span>
                    </li>
                  </ul>
                </div>
                <div className="cardgrid--item-section">
                  <ul className="item-listing st-coloured">
                    <li>
                      {batch.homeWorkSubmissionCount != 0 ? <i className="icon cg-glasses-with-circular-lenses"></i> : ""}
                      {batch.homeWorkSubmissionCount != 0 ? <span>{batch.homeWorkSubmissionCount} New Homeworks Submitted</span> : ""}
                    </li>
                    <li>
                      {batch.quizSubmissionCount != 0 ? <i className="icon cg-bulb"></i> : ""}
                      {batch.quizSubmissionCount != 0 ? <span>{batch.quizSubmissionCount} New Quizzes Submitted</span> : ""}
                    </li>
                  </ul>
                </div>
              </div>
              )
            })
            }
          </div>
        </div>
        )
      });
    }
  }

  renderTimetable() {
    let timeTable = this.state.professorTimeTable;

    if (timeTable && timeTable.length > 0) {
      return timeTable.map((timetable, index) => {
        return (
          <div key={"key" + index} className="c-dtls-date">
            <span className="c-heading-sm card--title">{timetable.start_time}</span>
            <div className="c-inner-bcrm">
              <span>{timetable.class_name}</span>
              <span>{timetable.subject_name}</span>
              <span>{timetable.batch_name}</span>
            </div>
            <div className="cust-m-info">{timetable.branch_name}</div>
          </div>
        )
      })
    }
  }

  render() {
    return (
      <div>
        <button id="openmodal" data-toggle="modal" data-target="#newprofilepic" hidden></button>
        <ToastContainer />
        <div className="c-container clearfix">
          <div className="clearfix">
            <div className="divider-container">
              <div className="divider-block text--left">
                <span className="c-heading-sm">Professor</span>
                <span className="c-heading-lg">Dashboard</span>
              </div>
            </div>
          </div>

          <div className="c-container__data st--blank">
            <div className="clearfix row">
              <div className="col-md-8 col-sm-6 col-xs-12">
                {this.renderProfessorbatchDashbord()}
              </div>
            </div>
          </div>

        </div>
        <ProfilePicModal onSelectProfile={(data) => this.saveProfile(data)} userType={this.props.userType} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, sidebar, auth }) => ({
  professorDashboard: professor.professorDashboard,
  branchId: app.branchId,
  instituteId: app.institudeId,
  branches: sidebar.branches,
  userType: auth.userType,
  timeTableInfo: professor.timeTableInfo,
  professorId: professor.professorId,
  token: auth.token,
  profileSelectedOrNot: app.profileSelectedOrNot,
  profileUpload: app.profileUpload,
  getProfilePicture: app.getProfilePicture
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getProfessorDashboard, getBranches, professorTimeTableInfo, checkProfileSelectedOrNot,
    profilePicUpload, getProfilePic
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorDashboard)