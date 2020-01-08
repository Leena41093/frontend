import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getStudentDetails, getStudentBatchWiseAttendanceReport, } from '../../actions/index';
import {
  getStudentMonthAttendanceAverage, getStudentSubjectQuizPercentage, getStudentBatchSubmission, getStudentDetailsBySubject,
  getStudentSubjectHomeworkPercentage
} from '../../actions/studentAction'
import Highcharts from 'highcharts';
import drilldow from "highcharts/modules/drilldown";
import dataModule from "highcharts/modules/data";
import $ from 'jquery';
import { infoToste } from '../../constant/util';
import { ToastContainer } from 'react-toastify';
drilldow(Highcharts);
dataModule(Highcharts);
var chart = ""
class StudentReports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      student_id: null,
      studentDetails: {},
      classDetails: [],
      selectedClass: {},
      batchWiseAttendace: [],
      class_id: null,
      avgGraphData: [],
      activeReportType: 'quiz',
      overAllAvg: "",
      firstname: "",
      lastname: "",
      batchWiseStudentSubmission: [],
      quizPercentData: [],
      marksgraphdata: [],
      marksdata: {},
      hwPercentData: [],
      instituteId: 0,
      submissionObj: {},
      colors: [],
      studentFlag: "",
      studentDoesNotContainAnyBatch: false
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
    let studentId = this.props.location.state ? this.props.location.state.data : null;
    this.setState({ instituteId: this.props.instituteId, student_id: studentId }, () => {
      this.getStudentDetails();
    })

  }


  getStudentDetails() {
    let data
    if (this.state.student_id == null) {
      data = {
        payload: {
          student_id: ""
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token
      }
    }
    else if (this.state.student_id != null && this.state.student_id != "") {
      data = {
        payload: {
          student_id: this.state.student_id
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token
      }
    }
    this.props.getStudentDetails(data).then(() => {
      let res = this.props.getStudentDetailsForReport;
      if (res && res.data.status == 200) {
        this.setState({
          studentDetails: res.data.response.studentDetails, classDetails: res.data.response.classDetails, selectedClass: res.data.response.classDetails && res.data.response.classDetails.length > 0 ? res.data.response.classDetails[0] : "",
          class_id: res.data.response.classDetails && res.data.response.classDetails.length > 0 ? res.data.response.classDetails[0].class_id : "",
          activeReportType: 'quiz',
          firstname: res.data.response.studentDetails.firstname, lastname: res.data.response.studentDetails.lastname,
          studentDoesNotContainAnyBatch: res.data.response.classDetails && res.data.response.classDetails.length > 0 ? false : true
        }, () => {
          if (this.state.studentDoesNotContainAnyBatch == true) {
            infoToste("Student does not added in any class")
          }
          if (this.state.class_id != "") {
            this.getStudentBatchAttendanceReport()
            this.getAverageGraph()
            if (this.state.activeReportType == "quiz") {
              this.getQuizGraphData();
            } else if (this.state.activeReportType == "homework") {
              this.getHomeworkGraphData();
            }
            this.getSubmissionGraphData()
          }
        })
      }
    })
  }

  getStudentBatchAttendanceReport() {
    let data
    if (this.state.student_id == null) {
      data = {
        institudeId: this.props.instituteId,
        branchId: this.props.branchId,
        token: this.props.token,
        payload: {
          class_id: this.state.selectedClass.class_id,
          student_id: ""
        }
      }
    }
    else if (this.state.student_id != null && this.state.student_id != "") {
      data = {
        institudeId: this.props.instituteId,
        branchId: this.props.branchId,
        token: this.props.token,
        payload: {
          class_id: this.state.selectedClass.class_id,
          student_id: this.state.student_id
        }
      }
    }

    this.props.getStudentBatchWiseAttendanceReport(data).then(() => {
      let res = this.props.getBatchWiseAttendanceReport
      if (res && res.data.status == 200) {
        this.setState({ batchWiseAttendace: res.data.response })
      }
    })
  }

  onChangeClass(classvalue) {
    this.setState({ selectedClass: classvalue, class_id: classvalue.class_id }, () => {
      this.getStudentBatchAttendanceReport();
      if (this.state.activeReportType == "quiz") {
        this.getQuizGraphData();
      } else if (this.state.activeReportType == "homework") {
        this.getHomeworkGraphData();
      }
      this.getAverageGraph();
      this.getSubmissionGraphData()
    });
  }

  isFloat(x) {
    if ((x % 1) === 0) {
      return x;
    }
    else {
      return Number(x.toFixed(1));
    }
  }

  getAverageGraph() {
    let apiData
    if (this.state.student_id == null) {
      apiData = {
        payload: {
          class_id: this.state.class_id,
          student_id: ""
        },
        institudeId: this.props.instituteId,
        branchId: this.props.branchId,
        token: this.props.token,
      }
    }
    else if (this.state.student_id != null && this.state.student_id != "") {
      apiData = {
        payload: {
          class_id: this.state.class_id,
          student_id: this.state.student_id
        },
        institudeId: this.props.instituteId,
        branchId: this.props.branchId,
        token: this.props.token,
      }
    }

    this.props.getStudentMonthAttendanceAverage(apiData).then(() => {
      let res = this.props.getStudentMonthlyAttendanceAvg

      if (res && res.data.status == 200) {
        let avgGraphData = res.data.response.monthAvg;
        let graphArr = []
        if (avgGraphData && avgGraphData.length > 0) {

          avgGraphData.forEach((obj, index) => {
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
            // if (obj.monthAvg != 0) {
            let avg = this.isFloat(obj.monthAvg);

            let graphObj = {
              name: monthNames[obj.month - 1],
              y: avg,
              color: '#990000'
            }
            graphArr.push(graphObj)
            // }
          })
        }
        this.setState({ avgGraphData: graphArr, overAllAvg: res.data.response.overAllAvg }, () => {

          this.renderAverageGraph()
        })

      }
    })
  }

  getQuizGraphData() {
    let self = this;
    let apiData
    if (this.state.student_id == null) {
      apiData = {
        payload: {
          class_id: self.state.class_id,
          student_id: ""
        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
    }
    else if (this.state.student_id != null && this.state.student_id != "") {
      apiData = {
        payload: {
          class_id: self.state.class_id,
          student_id: self.state.student_id
        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
    }


    this.props.getStudentSubjectQuizPercentage(apiData).then(() => {
      let resQuizGraphData = this.props.getStudentSubjectQuizPercentages;
      if (resQuizGraphData && resQuizGraphData.data.status == 200) {
        this.setState({ quizPercentData: resQuizGraphData.data.response.overAllData }, () => {
          let graphArray = this.state.quizPercentData;
          let newGraphArray = []
          var obj = {}
          graphArray.map((data, index) => {
            obj = {
              name: data.subject_name + " " + data.batch_name,
              y: data.total_sub_avg,
              drilldown: data.subject_name + " " + data.batch_name,
              subject_id: data.subject_id,
              batch_id: data.batch_id
            }
            newGraphArray.push(obj);
          })
          this.setState({ marksgraphdata: newGraphArray }, () => {
            this.renderMcqHwGraph()
          })
        })
      }
    });
  }

  getHomeworkGraphData() {
    let self = this;

    let apiData
    if (this.state.student_id == null) {
      apiData = {
        payload: {
          class_id: self.state.class_id,
          student_id: ""
        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
    }
    else if (this.state.student_id != null && this.state.student_id != "") {
      apiData = {
        payload: {
          class_id: self.state.class_id,
          student_id: self.state.student_id
        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token
      }
    }

    this.props.getStudentSubjectHomeworkPercentage(apiData).then(() => {
      let resHwGraphData = this.props.getStudentSubjectHwPercentages;
      if (resHwGraphData && resHwGraphData.data.status == 200) {
        this.setState({ hwPercentData: resHwGraphData.data.response.overAllData }, () => {
          let graphArray = this.state.hwPercentData;
          let newGraphArray = []
          var obj = {}
          graphArray.map((data, index) => {
            obj = {
              name: data.subject_name + " " + data.batch_name,
              y: data.total_sub_avg,
              drilldown: data.subject_name + " " + data.batch_name,
              subject_id: data.subject_id,
              batch_id: data.batch_id
            }
            newGraphArray.push(obj);
          })
          this.setState({ marksgraphdata: newGraphArray }, () => {
            this.renderMcqHwGraph()
          })
        })
      }
    });
  }

  getSubmissionGraphData() {
    var payloadData = {}
    if (this.state.activeReportType == 'quiz') {
      if (this.state.student_id == null) {
        payloadData = {
          class_id: this.state.class_id,
          student_id: "",
          types: "quiz"
        }
      }
      else if (this.state.student_id != null && this.state.student_id != "") {
        payloadData = {
          class_id: this.state.class_id,
          student_id: this.state.student_id,
          types: "quiz"
        }
      }

    } else {
      if (this.state.student_id == null) {
        payloadData = {
          class_id: this.state.class_id,
          student_id: "",
          types: "homework"
        }
      }
      else if (this.state.student_id != null && this.state.student_id != "") {
        payloadData = {
          class_id: this.state.class_id,
          student_id: this.state.student_id,
          types: "homework"
        }

      }
    }
    let apiData = {
      payload: payloadData,
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
    }
    this.props.getStudentBatchSubmission(apiData).then(() => {
      let res = this.props.getStudentBatchwiseSubmission;
      if (res && res.data.status == 200) {
        let batchData = res.data.response.batchWiseData;
        let unsubmitted = res.data.response ? res.data.response.submissionObj.totalUnSubmissionCount : 0
        let subjectArr = [];
        if (batchData && batchData.length > 0) {
          batchData.forEach((data, index) => {

            let submissionArr = [
              data.subject_name + " " + data.batch_name,
              data.student_submission_count,
            ]
            subjectArr.push(submissionArr)
          })
        }
        if (unsubmitted != 0) {
          let submissionArr = [
            'Unsubmitted', unsubmitted
          ]
          subjectArr.push(submissionArr)
        }

        this.setState({
          batchData: subjectArr,
          batchWiseStudentSubmission: res.data.response.batchWiseData,
          submissionObj: res.data.response.submissionObj
        }, () => {
          this.renderSubmissionGraph();
        })
      }
      else if (res && res.data.status == 500) {
        this.setState({
          batchData: [],
          batchWiseStudentSubmission: [],
          submissionObj: []
        })
      }
    })
  }

  goToAttendancePage(batchId) {
    if (this.state.student_id == null) {
      this.props.history.push({
        pathname: '/app/student-attendance',
        state: { data: batchId }
      });
    }
  }

  goToStudentDirectory() {
    this.props.history.push({
      pathname: '/app/student-directory'
    });
  }

  onChangeReportActive(type) {
    if (this.state.class_id == "") {
      infoToste("Student does not added in any class");
    }
    else {
      this.setState({
        activeReportType: type,
        quizPercentData: [],
        marksgraphdata: [],
        marksdata: {},
        hwPercentData: [],

      }, () => {
        if (this.state.activeReportType == "homework") {
          this.getHomeworkGraphData();
        }
        else if (this.state.activeReportType == "quiz") {
          this.getQuizGraphData();
        }
        this.getSubmissionGraphData()
      })
    }
  }

  getMarksGraphData(id) {
    let apidata;
    if (this.state.student_id == null) {
      apidata = {
        payload: {
          subject_id: id,
          types: this.state.activeReportType,
          student_id: ""

        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
    }
    else if (this.state.student_id != null && this.state.student_id != "") {
      apidata = {
        payload: {
          subject_id: id,
          types: this.state.activeReportType,
          student_id: this.state.student_id

        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
    }

    this.props.getStudentDetailsBySubject(apidata).then(() => {
      let subjectClickedDetailResponse = this.props.subjectClickedDetailResponse
      if (subjectClickedDetailResponse && subjectClickedDetailResponse.data.status == 200) {
        let marksArray = subjectClickedDetailResponse.data.response;
        let obj = []
        let marks = []
        marksArray.map((data, index) => {
          marks.push([`${index + 1}:${data.title}`, data.avgTotal])
        })

        obj = [{
          name: marksArray[0].subject_name,
          id: marksArray[0].subject_name,
          data: marks
        }]
        this.setState({ marksdata: obj }, () => {
          $("#update").click();
        })
      }
    })
  }

  isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return true;
    }
    return false;
  }

  renderClasses() {
    let { classDetails } = this.state;
    if (classDetails && classDetails.length > 0) {
      return classDetails.map((classvalue, index) => {
        return (
          <li key={index}><a className="listItem" onClick={this.onChangeClass.bind(this, classvalue)}>{classvalue.class_name}</a></li>
        )
      })
    }
  }

  renderBatches() {
    let { batchWiseAttendace } = this.state;

    return batchWiseAttendace.map((batch, index) => {
      return (
        <a key={index} data-toggle="tooltip" title={batch.class_name + " > " + batch.subject_name + " > " + batch.batch_name}>
          <li onClick={this.goToAttendancePage.bind(this, batch.batch_id)}>
            <button className="clearfix">
              <div className="pull-left className-list">
                <span>{batch.class_name.slice(0, 7) + ".."}</span> >
                            <span>{batch.subject_name.slice(0, 7) + ".."}</span> >
                            <span>{batch.batch_name.slice(0, 7) + ".."}</span>
              </div>
              <div className="pull-right marks-list">
                <span>{batch.batchAvg.toFixed(1)}%</span>
                <i className="icon cg-angle-right"></i>
              </div>
            </button>
          </li>
        </a>
      )

    })
  }

  renderBatchWiseSubmission() {
    if (this.state.batchWiseStudentSubmission && this.state.batchWiseStudentSubmission.length > 0) {
      return this.state.batchWiseStudentSubmission.map((data, index) => {
        return (
          <a key={"key" + index} data-toggle="tooltip" title={data.class_name + " > " + data.subject_name + " > " + data.batch_name}>

            <li style={{ display: "inline" }}>
              <div style={{ height: "10px", width: "10px", backgroundColor: this.state.colors[index] }}></div>
              <button className="clearfix" style={{ marginTop: "-25px", marginLeft: "18px" }}>

                <div className="pull-left className-list">
                  <div className="graphColor col-1"></div>
                  <span>{data.class_name.slice(0, 7) + ".."}</span>>
							    <span>{data.subject_name.slice(0, 7) + ".."}</span>>
							    <span>{data.batch_name.slice(0, 7) + ".."}</span>
                </div>
                <div style={{ marginRight: "15px" }} className="pull-right marks-list">
                  <span>{data.student_submission_count + "/" + data.batch_wise_homework_count}</span>
                </div>
              </button>
            </li>
          </a>
        )
      })
    }
  }

  renderSubmissionGraph() {
    let selectedtype = "submissiongraph"
    if (this.state.activeReportType != "quiz") {
      selectedtype = "submissiongraph1"
    }
    var total = this.isEmpty(this.state.submissionObj.total)

    Highcharts.chart(selectedtype, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: `<p style={{color:"#990000"}}>${total == true ? this.state.submissionObj.total : 0}</p><br>Submitted`,
        style: {
          fontSize: "12px"
        },
        align: 'center',
        verticalAlign: 'middle',
        y: 0
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: 20,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: 0,
          endAngle: 360,
          center: ['50%', '50%'],
          size: '110%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Submissions',
        innerSize: '50%',
        data: this.state.batchData
      }]

    });
    var colors = Highcharts.getOptions().colors

    var self = this;
    self.setState({ colors: colors })
  }

  renderMcqHwGraph() {
    // Create the chart

    let self = this;
    let selectedtype = "mcqandhwgraph"
    if (this.state.activeReportType != "quiz") {
      selectedtype = "mcqandhwgraph1"
    }
    chart = Highcharts.chart({
      chart: {
        type: 'column',
        renderTo: selectedtype,
        events: {
          drilldown: function (e) {
            if (!e.seriesOptions) {

              var chart = this
              chart.showLoading('Loading ...');
              let apidata;
              if (self.state.student_id == null) {
                apidata = {
                  payload: {
                    subject_id: e.point.subject_id,
                    batch_id: e.point.batch_id,
                    types: self.state.activeReportType,
                    student_id: ""

                  },
                  institute_id: self.props.instituteId,
                  branch_id: self.props.branchId,
                  token: self.props.token,
                }
              }
              else if (self.state.student_id != null && self.state.student_id != "") {
                apidata = {
                  payload: {
                    subject_id: e.point.subject_id,
                    batch_id: e.point.batch_id,
                    types: self.state.activeReportType,
                    student_id: self.state.student_id

                  },
                  institute_id: self.props.instituteId,
                  branch_id: self.props.branchId,
                  token: self.props.token,
                }
              }
              self.props.getStudentDetailsBySubject(apidata).then(() => {
                let subjectClickedDetailResponse = self.props.subjectClickedDetailResponse
                if (subjectClickedDetailResponse && subjectClickedDetailResponse.data.status == 200) {
                  let marksArray = subjectClickedDetailResponse.data.response;
                  let obj = []
                  let marks = []
                  marksArray.map((data, index) => {
                    marks.push([`${index + 1}:${data.title}`, data.avgTotal])
                  })

                  obj = [{
                    name: marksArray[0].subject_name + " " + marksArray[0].batch_name,
                    id: marksArray[0].subject_name + " " + marksArray[0].batch_name,
                    data: marks

                  }]
                  // let series = drilldowns[e.point.name];
                  chart.hideLoading();
                  chart.addSeriesAsDrilldown(e.point, obj[0]);
                }
              })
            }

          }
        }
      },
      title: { text: 'MARKS' },
      subtitle: {
        text: 'Click the columns to view detailed test marks'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Average Marks'
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
            format: '{point.y:.1f}% marks'
          },
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
      },

      series: [
        {
          name: this.state.activeReportType == 'quiz' ? "MCQ Report" : "Homework Report",
          cursor: "pointer",
          colorByPoint: true,
          data: this.state.marksgraphdata
        }
      ],
      drilldown: {
        series: []
      }
    });


  }

  renderAverageGraph() {


    Highcharts.chart({

      chart: {
        type: 'column',
        renderTo: 'averagegraph'
      },
      title: {
        text: 'Average Attendance'
      },

      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Attendance '
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
            format: '{point.y}%'
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
      },

      series: [
        {
          name: "Average Attendance",
          colorByPoint: false,
          data: this.state.avgGraphData

        }
      ]
    });

  }

  render() {
    return (
      <div className="c-container dark clearfix">
        <ToastContainer />
        <button id="update" hidden></button>
        <div className="clearfix">
          <div className="row divider-container">
            <div className="col-sm-9 text--left">
              <span className="c-heading-lg">{(this.state.firstname && this.state.lastname) ? this.state.firstname + " " + this.state.lastname + "’s Report Card" : ""}</span>
            </div>
            {/* <div className="col-sm-3">
							<button className="c-btn prime  pull-right">Share Report</button>
						</div> */}
            {this.state.student_id != null ?
              <div className="col-sm-3">
                <button className="c-btn grayshade pull-right" onClick={this.goToStudentDirectory.bind(this)}> Back </button>
              </div>
              : ""}
          </div>
        </div>

        <div className="clearfix">
          <div className="row">
            <div className="col-md-4">

              <div className="c-repoCard">
                <div className="divider-container stud-nameCard">
                  <div className="divider-block nameCard__pic">
                    <img src={this.state.studentDetails ? this.state.studentDetails.picture_url : "./images/avatars/Avatar_1.jpg"} alt="" />
                  </div>
                  <div className="divider-block nameCard__info">
                    <span className="studName">{(this.state.firstname && this.state.lastname) ? this.state.studentDetails.firstname + " " + this.state.studentDetails.lastname : ""}</span>
                    <span className="studColegName">{this.state.studentDetails ? this.state.studentDetails.branch_name : ""}</span>
                    {/* <span className="studStd">12th Standard</span> */}
                  </div>
                </div>
              </div>

              <div className="c-repoCard">
                <div className="block-title st-colored noborder nomargin color-dark">VIEW REPORTS OF</div>
                <div className="c-repoDropdown dropdown">
                  <button id="dLabel" type="button" data-toggle="dropdown" className="dropdown_btn">
                    {this.state.selectedClass !== {} ? this.state.selectedClass.class_name : ""}
                    <i className="icon cg-angle-down"></i>
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dLabel" style={{ height: "125px", overflow: "auto" }}>
                    {this.renderClasses()}
                  </ul>
                </div>
              </div>

              <div className="c-repoCard">
                <div className="block-title st-colored noborder nomargin color-dark">ATTENDANCE</div>
                <div className="divider-container stud-nameCard margin10-bottom">
                  <div className="divider-block nameCard__info nopad">
                    <span className="studName text-colored nomargin">{Math.round(this.state.overAllAvg) + "%"}</span>
                    {/* <span className="studColegName">Average Attendance</span> */}
                    {/* <span className="pull-right"><button className="c-btn grayshade">previous</button><button className="c-btn grayshade">Next</button></span> */}
                  </div>
                </div>

                <div className="stud-graph sm" id="averagegraph" style={{ width: "300px", height: "200px", margin: "0 auto", overflowX: "auto" }}></div>

                <div className="stud-attendanceList">
                  <div className="block-title st-colored noborder nomargin color-dark">BATCH-WISE ATTENDANCE</div>
                  <div className="attendanceList" style={{ height: "180px", overflowY: "auto" }}>
                    <ul>
                      {this.renderBatches()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-8">

              <div className="c-repoCard nopad">
                <div className="c-repoCard__tabs">


                  <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className="active"><a onClick={this.onChangeReportActive.bind(this, 'quiz')} href="#home" aria-controls="home" role="tab" data-toggle="tab">MCQ REPORT</a></li>
                    <li role="presentation"><a onClick={this.onChangeReportActive.bind(this, 'homework')} href="#profile" aria-controls="profile" role="tab" data-toggle="tab">HOMEWORK REPORT</a></li>
                  </ul>


                  <div className="tab-content">

                    <div role="tabpanel" className="tab-pane active" id="home">
                      {/* <div className="block-title st-colored noborder nomargin color-dark">MARKS</div> */}


                      <div className="stud-graph lg margin25-bottom" id="mcqandhwgraph"></div>


                      <div className="divider-container sectionDivider">


                        <div className="divider-block section01">
                          <div className="block-title st-colored noborder nomargin color-dark">Submission</div>

                          <div className="stud-graph" id="submissiongraph"></div>

                        </div>

                        <div className="divider-block section02">
                          <div className="block-title st-colored noborder nomargin color-dark">BATCH-WISE</div>

                          <div className="attendanceList" style={{ height: "150px", overflowY: "auto" }}>
                            <ul>
                              {this.renderBatchWiseSubmission()}
                            </ul>
                          </div>
                        </div>

                      </div>

                    </div>

                    <div role="tabpanel" className="tab-pane" id="profile">
                      <div className="stud-graph lg margin25-bottom" id="mcqandhwgraph1"></div>


                      <div className="divider-container sectionDivider">


                        <div className="divider-block section01">
                          <div className="block-title st-colored noborder nomargin color-dark">Submission</div>

                          <div className="stud-graph" id="submissiongraph1"></div>

                        </div>

                        <div className="divider-block section02">
                          <div className="block-title st-colored noborder nomargin color-dark">BATCH-WISE</div>

                          <div className="attendanceList" style={{ height: "150px", overflowY: "auto" }}>
                            <ul>
                              {this.renderBatchWiseSubmission()}
                            </ul>
                          </div>
                        </div>

                      </div></div>
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

const mapStateToProps = ({ app, auth, student }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  getStudentDetailsForReport: app.studentDetailsForReport,
  getBatchWiseAttendanceReport: app.studentBatchWiseAttendanceReport,
  getStudentMonthlyAttendanceAvg: student.getStudentMonthlyAttendanceAvg,
  getStudentSubjectQuizPercentages: student.getStudentSubjectQuizPercentage,
  getStudentBatchwiseSubmission: student.getStudentBatchwiseSubmission,
  subjectClickedDetailResponse: student.getStudentDetailsBysubject,
  getStudentSubjectHwPercentages: student.getStudentSubjectHwPercentage
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStudentDetails,
      getStudentBatchWiseAttendanceReport,
      getStudentMonthAttendanceAverage,
      getStudentSubjectQuizPercentage,
      getStudentBatchSubmission,
      getStudentDetailsBySubject,
      getStudentSubjectHomeworkPercentage
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentReports)