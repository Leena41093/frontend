import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfessorDashboard, professorTimeTableInfo } from '../../actions/professorActions';
import { checkProfileSelectedOrNot, profilePicUpload, getProfilePic } from '../../actions/index';
import {getAdminDashboardData} from '../../actions/inventoryAdminAction'
import { getBranches } from '../../actions/sidebarAction';
import moment from 'moment';
import { ProfilePicModal } from '../common/profilepic';
import { ToastContainer } from 'react-toastify';
import Highcharts from "highcharts";
import dataModule from "highcharts/modules/data";
import $ from 'jquery';
import 'bootstrap-datepicker';
import { successToste } from '../../constant/util';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
dataModule(Highcharts);
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
      employeeData:{}
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
    this.renderIncomeExpenceGraph();
    this.renderPieGraph();
    this.getAdminData();
    this.setState({ instituteId: this.props.instituteId }, () => {
      if (this.props.instituteId != null) {
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

  getAdminData(){
    let data = {
      companyId:this.props.companyId,
      branch_id:this.props.BranchId
    }
    this.props.getAdminDashboardData(data).then(()=>{
      let res= this.props.admindashboarddetailsData;
      if(res && res.data.status == 200){
        this.setState({employeeData:res.data.response},()=>{
          this.renderProfessorbatchDashbord();
          this.renderComplaintsList()
          this.renderIncomeExpenceGraph();
          this.renderPieGraph();
        });
      }
    
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

  renderComplaintsList(){
    let{employeeData} = this.state;
    if(employeeData && employeeData.complaintsDetails){
      let complaintArray = employeeData.complaintsDetails;
      console.log("complaintArray:",complaintArray);
      return employeeData.complaintsDetails[0].map((complaint,index)=>{
        return (
          <li>
              <img src="./../images/avatars/user_avatar.png" className="user-img" alt="" />
              <span className="news__heading">{complaint.emp_name + " Complaining about " + complaint.complaint_text}</span>
              <span className="news__info"></span>
            </li>
        )
      })
    }
  }

  renderProfessorbatchDashbord() {
    let {employeeData} = this.state;
    if(employeeData != {}){
    return (
      <div className="row">
        <div className="col-sm-4">
          <div className="card">
            <div className="row">
              <div className="cardgrid--item">
                <div className="col-sm-4" style={{ paddingLeft: "0px" }}>
                  <img src="./../images/employee.png" width="60px" height="60px" />
                </div>
                <div className="col-sm-8">
                  <div className="cardgrid--item-header pull-right">
                    <h2 className="c-heading-sm card--title">
                      Employees
                  </h2>
    <h1 style={{ fontWeight: "40px", fontSize: "40px", margin: "0px" }}>{employeeData.employeeCount}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="row">
              <div className="cardgrid--item">
                <div className="col-sm-4" style={{ paddingLeft: "0px" }}>
                  <img src="./../images/analytics.png" width="60px" height="60px" />
                </div>
                <div className="col-sm-8">
                  <div className="cardgrid--item-header pull-right">
                    <h2 className="c-heading-sm card--title">
                      Projects
                </h2>
    <h1 style={{ fontWeight: "40px", fontSize: "40px", margin: "0px" }}>{employeeData.projectCount}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="col-sm-4">
          <div className="card">
            <div className="row">
              <div className="cardgrid--item">
                <div className="col-sm-4" style={{ paddingLeft: "0px" }}>
                  <img src="./../images/complaints.png" width="60px" height="60px" />
                </div>
                <div className="col-sm-8">
                  <div className="cardgrid--item-header pull-right">
                    <h2 className="c-heading-sm card--title">
                      Complaints
                </h2>
    <h1 style={{ fontWeight: "40px", fontSize: "40px", margin: "0px" }}>{employeeData.complaintsCount}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    )
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

  renderPieGraph() {
    let { employeeData } = this.state;
    // Make monochrome colors
    var pieColors = (function() {
      var colors = [],
        base = Highcharts.getOptions().colors[0],
        i;

      for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(
          Highcharts.Color(base)
            .brighten((i - 3) / 7)
            .get()
        );
      }
      return colors;
    })();

    // Build the chart
    Highcharts.chart("pieGraph", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: {
        text: ""
      },
      tooltip: {
        pointFormat: "<b>Rs.{point.y}</b> <p>({point.percentage:.1f}%)</p>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          colors: pieColors,
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b><br>Rs.{point.y}",
            distance: -50,
            filter: {
              property: "percentage",
              operator: ">",
              value: 4
            }
          }
        }
      },
      series: [
        {
          name: "Share",
          data: [
            { name: "Income", y: employeeData && employeeData.total_income != null ? employeeData.total_income : 0 },
            { name: "Expense", y: employeeData &&  employeeData.total_expense != null ? employeeData.total_expense : 0 }
          ]
        }
      ]
    });
  }

  renderIncomeExpenceGraph() {
    let { employeeData } = this.state;
    Highcharts.chart({
      chart: {
        type: "column",
        renderTo: "ResorcesGraph"
      },
      title: {
        text: ""
      },

      xAxis: {
        type: "category"
      },
      yAxis: {
        title: {
          text: ""
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.name}"
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>Rs.{point.y:.2f}</b> of total<br/>'
      },

      series: [
        {
          name: "",
          colorByPoint: false,
          data: [
            {
              name: "Assign Employees",
              y: employeeData && employeeData.assignEmpProjectCount>0? employeeData.assignEmpProjectCount:0

            },
            {
              name: "Free Employees",
              y: employeeData && employeeData.unassignEmpProjectCount>0? employeeData.unassignEmpProjectCount:0
            }
          ]
        }
      ]
    });
  }

  render() {
    return (
      <div>
        <button id="openmodal" data-toggle="modal" data-target="#newprofilepic" hidden></button>
        <ToastContainer />
        <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Dashboard</span>
              {/* {(this.state.studentBatch.length == 0&& this.state.commentActivities.length==0) ? <span style={{color:"red"}}>There is no data available</span>:""} */}
            </div>
          </div>
        <div className="c-container clearfix">
          <div className="c-container__data st--blank">
            {this.renderProfessorbatchDashbord()}
          </div>
        </div>
        <div className="c-container">
        <div className="row">
          <div className="col-sm-6">
          <div className="card">
          <h2 className="c-heading-sm card--title">
              Resorces Data
          </h2>
            <div id="ResorcesGraph" style={{ height: "200px" }}></div>
          </div>
        </div>
        <div className="col-sm-6">
        <div className="card">
          <h2 className="c-heading-sm card--title">
              Income Expense Data
          </h2>
            <div id="pieGraph" style={{ height: "200px" }}></div>
          </div>

        {/* <div className="divider-block" id="pieGraph" /> */}
        </div>
        </div>
      </div>
      <div className="c-container">
        <div className="row">
          <div className="col-sm-6">
          <div className="card">
          <h2 className="c-heading-sm card--title">
             Pending Complaints
          </h2>
          <div className="news--listing">
            <ul style={{height:"200px",overflowY:"auto"}}>
              {console.log("call",this.state.employeeData)}
              {this.state.employeeData && this.state.employeeData != {}? this.renderComplaintsList() : ""}
            </ul>
          </div>
        </div>
        </div>
      </div>
      </div>
      <ProfilePicModal onSelectProfile={(data) => this.saveProfile(data)} userType={this.props.userType} {...this.props} />
      </div >
    )
  }
}

const mapStateToProps = ({ app, professor, sidebar, auth, inventoryAdmin }) => ({
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
  getProfilePicture: app.getProfilePicture,
  admindashboarddetailsData : inventoryAdmin.adminDashboardDetail,
  companyId:app.companyId,
  BranchId:app.AdminbranchId,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getProfessorDashboard, getBranches, professorTimeTableInfo, checkProfileSelectedOrNot,
    profilePicUpload, getProfilePic,getAdminDashboardData
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorDashboard)