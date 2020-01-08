import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAttendanceAdminDashboardStudentList, getStudentList, getAdminAttendanceBatches,
   getAdminAttendanceProfessorList,getAdminAttendanceGraphdata,getIsProfessorAdmin } from '../../actions/index';
import { professorBatchList } from '../../actions/professorActions';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4themes_material from '@amcharts/amcharts4/themes/material'
import { ClipLoader } from 'react-spinners';
import { Scrollbars } from 'react-custom-scrollbars';
import { css } from 'react-emotion';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class AttendanceDirectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allbatches: [],
      alldefaultstudents: [],
      professorDetails: [],
      weekBatchDetails: {},
      graphdata: [],
      resgraphdata: [],
      selectedSort: 60,
      addloader: true,
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps){
		
		let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){
    if(this.state.instituteId != nextProps.instituteId){
      var datas = {
        institudeId: this.props.instituteId,
        branchId: this.props.branchId,
        token: this.props.token,
      }
      this.props.getIsProfessorAdmin(datas).then(()=>{
       let res = this.props.ProfessorAdmin;
       if(res && res.data.status == 200 && res.data.response.isProfessorAdmin == false ){
       this.props.history.push("/app/dashboard");
       }
       else{
        this.setState({ allbatches: [],
          alldefaultstudents: [],
          professorDetails: [],
          weekBatchDetails: {},
          graphdata: [],
          resgraphdata: [],
          selectedSort: 60,
          addloader: true,
          instituteId:0},()=>{
            this.renderGraph()
            this.setState({instituteId:this.props.instituteId})
            this.getAdminProfessors();
            this.getAdminBatches();
            this.getAdminStudentlist();
            this.getAdmindata();
          })
       }
      })
     
			// localStorage.removeItem("instituteid")
      // this.setState({instituteId:nextProps.instituteId},()=>{
				// const pro = this.props.location.state?this.props.location.state.data:"";
				// this.getClassesOfStudent();
				// table.fnDraw()
				// this.props.history.push("/app/dashboard");
      // });
		}
	
		}
  }

  componentDidMount() {
    this.setState({instituteId:this.props.instituteId})
    this.getAdminProfessors();
    this.getAdminBatches();
    this.getAdminStudentlist();
    this.getAdmindata();
  }

  getAdmindata() {
    let graphData = {
        payload: {
          today_dates: moment(),
          week: "False",
        },
        institudeId: this.props.instituteId,
        branchId: this.props.branchId,
        token: this.props.token
    }
    this.props.getAdminAttendanceGraphdata(graphData).then(()=>{
      let res = this.props.adminAttendanceGraphdata;
      if (res && res.data.status == 200) {
        let graphdata = res.data.response.dayWiseBatchDetails;
        let graphobj = []
        graphdata.forEach((data, index) => {
          
          let d = new Date(data.Date)
          let day = d.getDate();
          let month = d.getMonth();
          let year = d.getFullYear();
          var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
          let obj = {
            Date: day + " " + monthNames[month],
            average: data.average,
            year: year
          }
          graphobj.push(obj);
        })
        this.setState({graphdata: graphobj,weekBatchDetails:res.data.response.weeklyBatchDetails,resgraphdata:res.data.response.dayWiseBatchDetails
        },()=>{
         { this.renderGraph() }
        })
      }
    })
  }

  getAdminProfessors(){
    let proflistdata = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getAdminAttendanceProfessorList(proflistdata).then(()=>{
      let res = this.props.adminAttendanceProflist;
      if (res && res.data.status == 200) {
      this.setState({professorDetails:res.data.response})
      }
    })
  }

  getAdminBatches(){
    let batchData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getAdminAttendanceBatches(batchData).then(() => {
      let res = this.props.batchesList;
      if (res && res.data.status == 200) {
        this.setState({ allbatches: res.data.response });
      }
    })
  }

  getAdminStudentlist(){
    let data = {
      payload: {
        defaulter_percentage: this.state.selectedSort
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getAttendanceAdminDashboardStudentList(data).then(() => {
      let res = this.props.studentDefaulterList;
      if (res && res.data.status == 200) {
        this.setState({ alldefaultstudents: res.data.response, addloader: false });
      }
    })
  }

  renderGraph() {
    var self = this;
    am4core.ready(function () {

      // Themes begin
      am4core.useTheme(am4themes_material);
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      var chart = am4core.create("chartdiv", am4charts.XYChart);

      // Add data
   
      chart.data = self.state.graphdata;

      // Create axes

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "Date";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
        if (target.dataItem && target.dataItem.index & 2 == 2) {
          return dy + 25;
        }
        return dy;
      });

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "average";
      series.dataFields.categoryX = "Date";
      series.name = "average";
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]%";
      series.columns.template.fillOpacity = .8;

      var columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;

    }); // end am4core.ready()
  }

  gotoBatchDetails() {

  }

  onSelectSortValue(sortvalue) {
    this.setState({ selectedSort: sortvalue }, () => {
      this.getAdminStudentlist();
    })
  }

  gotoSelectBatchAttendance(batch, index) {
    if(this.props.userType !== "ADMIN"){
    this.props.history.push({
      pathname: `/app/attendancebatchesdetails`,
      state: { data: { batch: [batch], adminflag: true } }
    })
  }
  }

  renderProfessorList() {
    let { professorDetails } = this.state;
    if (professorDetails && professorDetails.length > 0) {
      return professorDetails.map((profList, index) => {

        return (
          <li key={"proflist-" + index}>
            <div className="studentInfoRow">
              <div className="studentInfo">
                <div className="studSection student_img">
                  <img src={profList.professor_user_pic ? profList.professor_user_pic : "/images/avatars/Avatar_default.jpg"} />
                </div>

                <div className="studSection student_name">
                  {profList ? (profList.professor_firstName + " " + profList.professor_lastName) : ""}
                </div>

                <div className="studSection student_num">
                  <div className="cardGraph_number">
                    <div className="sect_num">
                      <span className="sect_num_prime">{profList ? profList.total_lectures : ""}</span>
                      <span className="sect_num_info">Lectures</span>
                    </div>
                    <div className="sect_num">
                      <span className="sect_num_prime">{profList ? (profList.total_marked_lecture + "/" + profList.total_lectures) : ""}</span>
                      <span className="sect_num_info">Marked</span>
                    </div>
                    <div className="sect_num">
                      <span className="sect_num_prime">{profList ? Math.round(profList.avgAttendance) + "%" : 0 + "%"}</span>
                      <span className="sect_num_info">Attendance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        )
      })
    }
  }

  renderBatchlist() {
    let { allbatches } = this.state;
    if (allbatches && allbatches.length > 0) {
      return allbatches.map((batchList, index) => {
        return (
          <li key={"batchList-" + index}>
            <button className="batches_setails" onClick={this.gotoSelectBatchAttendance.bind(this, batchList, index)}>
              <div className="batchInfo">
                <div className="batchSection">
                  <span className="cust-m-info nomargin text-bold">{(batchList.class_name && batchList.subject_name) ? (batchList.class_name + " > " + batchList.subject_name) : ""}</span>
                  <span className="cust-m-info nomargin">{batchList.batch_name}</span>
                </div>
                <div className="batchSection small">
                  <span className="batch_p">{batchList.avgBatchAttendance ? Math.round(batchList.avgBatchAttendance) + "%" : 0 + "%"}</span>
                </div>
              </div>
            </button>
          </li>)
      })
    }
  }

  renderDefaulterList() {
    let alldefaultstudents = this.state.alldefaultstudents;
    if (alldefaultstudents && alldefaultstudents.length > 0) {
      return alldefaultstudents.map((studentList, index) => {
        return (
          <li key={"studentList-" + index}>
            <div className="studentInfoRow">
              <div className="studentInfo">
                <div className="studSection student_img">
                  <img src={studentList.user_pic ? studentList.user_pic : "/images/avatars/Avatar_default.jpg"} />
                </div>

                <div className="studSection student_name">
                  <span className="cust-m-info text-bold">{(studentList.student_firstName && studentList.student_lastName) ? (studentList.student_firstName + " " + studentList.student_lastName) : ""}</span>
                  <span className="cust-m-info text-normal">{(studentList.class_name && studentList.subject_name) ? (studentList.class_name + " > " + studentList.subject_name) : ""}</span>
                </div>

                <div className="studSection student_num">{studentList.avgStudentAttendance ? Math.round(studentList.avgStudentAttendance) + "%" : 0 + "%"}</div>
              </div>
            </div>
          </li>)
      })
    }
  }

  render() {
    return (
      <div>
        <div className="c-container clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Administration</span>
              <span className="c-heading-lg">Attendance</span>
            </div>
          </div>
          {/* {this.state.addloader == true ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "45%", marginTop: "15%" }}>
            <ClipLoader
              className={override}
              sizeUnit={"px"}
              size={50}
              color={'#123abc'}

            /></div> : */}
            <div className="c-container__data">

              <div className="card-container">

                <div className="c-card nopad">

                  <div className="c-card__title type--2">
                    <span className="c-heading-sm card--title">
                      Institute Analytics
                  </span>
                    <span className="c-heading-sm card--Subtitle">
                      {this.state.graphdata[0] ? this.state.graphdata[0].Date + " " + this.state.graphdata[0].year : ""} - {this.state.graphdata[this.state.graphdata.length - 1] ? this.state.graphdata[this.state.graphdata.length - 1].Date + " " + this.state.graphdata[this.state.graphdata.length - 1].year : ""}{}
                    </span>
                  </div>
                  <div className="c-cardGraph">
                    <div className="cardGraph_bar" id="chartdiv"></div>
                    <div className="cardGraph_number">
                      <div className="sect_num">
                        <span className="sect_num_prime">{this.state.weekBatchDetails && this.state.weekBatchDetails.total ? this.state.weekBatchDetails.total : 0}</span>
                        <span className="sect_num_info">No. of Lectures</span>
                      </div>
                      <div className="sect_num">
                        <span className="sect_num_prime">{(this.state.weekBatchDetails.marked && this.state.weekBatchDetails.total) ? (this.state.weekBatchDetails.marked + "/" + this.state.weekBatchDetails.total) : 0}</span>
                        <span className="sect_num_info">Attendance Marked</span>
                      </div>
                      <div className="sect_num">
                        <span className="sect_num_prime">{this.state.weekBatchDetails ? this.state.weekBatchDetails.avg ? Math.round(this.state.weekBatchDetails.avg) + "%" : 0 + "%" : 0 + "%"}</span>
                        <span className="sect_num_info">Average Attendance</span>
                      </div>
                    </div>
                  </div>



                  <div className="studInfoListing">
                    <div className="c-card__title nopad">
                      <span className="c-heading-sm card--Subtitle">
                        PROFESSORS
                    </span>
                    </div>

                    <div className="c-card__items">
                      <div className="scrollbar3" id="style3">
                        <ul>
                          {this.renderProfessorList()}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>



                <div className="c-card nopad">

                  <div className="c-card__title type--2 clearfix">
                    <span className="c-heading-sm card--Subtitle pull-left">
                      BATCHES
                  </span>
                    {/* <span className="c-heading-sm card--Subtitle pull-right">
                    SETTINGS
                  </span> */}
                  </div>

                  <div className="c-list type-2 c-card__items large ">
                    <div className="scrollbar2" id="style2">
                      <ul>
                        {this.renderBatchlist()}
                      </ul>
                    </div>
                  </div>
                </div>



                <div className="c-card nopad">

                  <div className="c-card__title type--2 clearfix">
                    <span className="c-heading-sm card--Subtitle pull-left">
                      DEFAULTERS
                  </span>
                    <div className="form-group cust-fld pull-right nomargin">
                      <div className="dropdown">
                        <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Below {this.state.selectedSort}%
                      </button>
                        <ul className="dropdown-menu" aria-labelledby="dLabel">
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 10)}>Below 10%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 20)}>Below 20%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 30)}>Below 30%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 40)}>Below 40%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 50)}>Below 50%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 60)}>Below 60%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 70)}>Below 70%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 80)}>Below 80%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 90)}>Below 90%</a></li>
                          <li><a href="javascript:void(0);" className="dd-option" onClick={this.onSelectSortValue.bind(this, 100)}>Below 100%</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="c-list type-3 c-card__items large">
                  <div className="scrollbar4" id="style4">
                      <ul>
                        {this.renderDefaulterList()}
                      </ul>
                    </div>
                  </div>
                </div>


              </div>

            </div>
          {/* } */}
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ app, professor, professorDrive, auth }) => ({
  adminAttendancedetail: app.adminAttendancedetail,
  branchId: app.branchId,
  instituteId: app.institudeId,
  userType:auth.userType,
  token: auth.token,
  studentDefaulterList: app.adminStudentDefaulterList,
  batchesList: app.adminAttendanceBatchesList,
  adminAttendanceProflist:app.adminAttendanceProflist,
  adminAttendanceGraphdata:app.adminAttendanceGraphdata,
  ProfessorAdmin : app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { getAttendanceAdminDashboardStudentList, getAdminAttendanceBatches,
      getAdminAttendanceProfessorList,getAdminAttendanceGraphdata,getIsProfessorAdmin }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceDirectory)    