import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { getStudentAttendanceBatches, getStudentBatchAttendanceData, studentBatchAttendanceDetails } from '../../actions/studentAction';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class StudentAttendanceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getReportButtonFlag: false,
      getstudlist: false,
      date: moment(),
      studentBatches: [],
      batch_id: null,
      instituteId: 0,
      addloader: true,
      isBatchAvailable: false,
      attendanceData: [],
      batchData: [],
      selectedBatchIndex: 0,
      studentReportCardFlag: false,
      batchShowDetails: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.instituteId != nextProps.instituteId) {
      this.setState({ instituteId: nextProps.instituteId }, () => {
        let batchid = this.props.location.state ? this.props.location.state.data : null;
        if (batchid != null) {
          this.setState({ batch_id: batchid, studentReportCardFlag: true }, () => {
            this.getAttendanceData()
            this.onSelectBatch(batchid, 0)
          })
        }
        else {
          this.getAttendanceData()
        }
      });
    }
  }

  componentDidMount() {
    let batchid = this.props.location.state ? this.props.location.state.data : null;
    if (batchid != null) {
      this.setState({ batch_id: batchid, studentReportCardFlag: true }, () => {
        this.getAttendanceData()
        this.onSelectBatch(batchid, 0)
      })
    }
    else {
      this.getAttendanceData()
    }
  }

  getAttendanceData() {
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getStudentAttendanceBatches(data).then(() => {
      let res = this.props.studentBatchAttendance;
      if (this.state.studentReportCardFlag == false) {
        if (res && res.data.Status == 200) {
          this.setState({ batch_id: res.data.response[0].batch_id, studentBatches: res.data.response, addloader: false, isBatchAvailable: false }, () => {
            if (res && res.data.response) {
              this.onSelectBatch(res.data.response[0], 0)
            }
          })
        } else if (res && res.data.status == 500) {
          this.setState({ studentBatches: [], batch_id: "", isBatchAvailable: true, attendanceData: [], batchData: [] })
        }
      }
      else {
        if (res && res.data.Status == 200) {
          res.data.response.forEach((data, index) => {
            if (this.state.batch_id == data.batch_id) {
              this.setState({ batch_id: data.batch_id, studentBatches: res.data.response, addloader: false, isBatchAvailable: false }, () => {
                if (res && res.data.response) {
                  this.onSelectBatch(data, index)
                }
              })
            }
          })

        } else if (res && res.data.status == 500) {
          this.setState({ studentBatches: [], batch_id: "", isBatchAvailable: true, attendanceData: [], batchData: [] })
        }
      }
    })
  }

  goToReportCard() {
    this.props.history.push("/app/student-report");
  }

  onSelectBatch(data, index) {
    this.setState({ batch_id: data && data.batch_id ? data.batch_id : data, selectedBatchIndex: index }, () => {
      let data = {
        payload: {
          batch_id: this.state.batch_id,
          student_id:""
        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token
      }
      this.props.getStudentBatchAttendanceData(data).then(() => {
        let res = this.props.studentbatchAttendanceData;

        if (res && res.data.status == 200) {
          this.setState({
            attendanceData: res.data.response.attendanceData,
            batchData: res.data.response.batchData
          })
        }
      })
      this.props.studentBatchAttendanceDetails(data).then(() => {
        let resBatchData = this.props.studentBatchAttendanceData
        if (resBatchData && resBatchData.data.status == 200) {
          this.setState({ batchShowDetails: resBatchData.data.response[0] });
        }
      })
    })
  }

  renderBatches() {
    let { studentBatches } = this.state;
    if (studentBatches && studentBatches.length > 0) {

      return studentBatches.map((data, index) => {
        if (this.state.studentReportCardFlag == true) {
          if (data.batch_id === this.state.batch_id) {
            let active = this.state.selectedBatchIndex == index ? 'st-active' : "";
            return (
              <li key={"batch" + index}>
                <button className={`leftNav-link ${active}`} onClick={this.onSelectBatch.bind(this, data, index)}>
                  <span className="navHeading">{data.class_name + " > " + data.subject_name}</span>
                  <span className="navSubHeading">{data.batch_name}</span>
                </button>
              </li>
            )
          }
        }
        else {
          let active = this.state.selectedBatchIndex == index ? 'st-active' : "";
          return (
            <li key={"batch" + index}>
              <button className={`leftNav-link ${active}`} onClick={this.onSelectBatch.bind(this, data, index)}>
                <span className="navHeading">{data.class_name + " > " + data.subject_name}</span>
                <span className="navSubHeading">{data.batch_name}</span>
              </button>
            </li>
          )
        }
      })
    }
  }

  renderBatchLectureData() {
    return (
      <div className="cardGraph_number">
        <div className="sect_num">
          <span className="sect_num_prime">{this.state.batchShowDetails && this.state.batchShowDetails.lectureCount ? this.state.batchShowDetails.lectureCount : 0}</span>
          <span className="sect_num_info">No. of Lectures</span>
        </div>
        <div className="sect_num">
          <span className="sect_num_prime">{(this.state.batchShowDetails && this.state.batchShowDetails.lectureCount) ? this.state.batchShowDetails.studentAttendanceCount + " / " + this.state.batchShowDetails.lectureCount : 0 + "/" + 0}</span>
          <span className="sect_num_info">Attendance Marked</span>
        </div>
        <div className="sect_num">
          <span className="sect_num_prime">{this.state.batchShowDetails && this.state.batchShowDetails.batchAvg ? this.state.batchShowDetails.batchAvg.toFixed(2) + "%" : 0 + "%"}</span>
          <span className="sect_num_info">Average Attendance</span>
        </div>
      </div>
    )
  }

  dateWiseAttendanceList() {
    let { attendanceData } = this.state;

    if (attendanceData && attendanceData.length > 0) {
      return attendanceData.map((data, index) => {
        var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday")
        var d = new Date(data.lectureDate);
        let dayName = weekday[d.getDay()];

        return (
          <li key={"datewiseattendancedata" + index} role="presentation"  >
            <button className={`tabLink`} >
              <div className="divider-block text--left">
                <span className="tabText text-bold">{moment(data.lectureDate).format("DD MMM YYYY")}</span>
                <span className="tabText">{dayName}</span>
              </div>
              {(data.markedValue == true) ?
                <div className="divider-block text--right">
                  <span style={{ marginLeft: "210px" }} className="tabText st-green">{"Present"}</span>
                </div>
                : (data.markedValue == false) ?
                  <div className="divider-block text--right">
                    <span style={{ marginLeft: "213px", color: "#990000" }} className="tabText st-gray">{"Absent"}</span>
                  </div>
                  : <div className="divider-block text--right">
                    <span style={{ marginLeft: "200px" }} className="tabText st-gray">{"Unmarked"}</span>
                  </div>}
            </button>
          </li>
        )
      })
    }
  }

  render() {
    return (
      <div className="c-container clearfix">
        <a href={this.state.downloadUrl} id="download" hidden />
        <div >

          <div className="clearfix">
            <div className="divider-container">
              <div className="divider-block text--left">
                <span className="c-heading-lg">Attendance</span>
                {this.state.isBatchAvailable == true ? <span style={{ color: "red" }}>There is no data available</span> : ""}
              </div>
              {this.state.studentReportCardFlag == true ? <div className="divider-block text--right">
                <button className="c-btn grayshade" onClick={this.goToReportCard.bind(this)}>Back to Report Card</button>
              </div> : ""}

            </div>
          </div>
          {/* {this.state.studentBatches.length == 0 ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "45%", marginTop: "15%" }}>
            <ClipLoader
              className={override}
              sizeUnit={"px"}
              size={50}
              color={'#123abc'}
            /></div> : */}

          <div className="c-container__data">
            <div className="divider-container drive--section">
              <div className="divider-block text--left d_section_1" >
                <div className="c-leftNav">
                  <div className="leftNav-header">BATCHES</div>
                  <div className="leftNav-navPanel" style={{ height: "470px", overflow: "auto" }}>
                    <ul>
                      {this.renderBatches()}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <div className="divider-block text--left d_section_2">
                  <div className="c-leftNav-panel">

                    <div className="panelScoreLine">
                      {this.renderBatchLectureData()}
                    </div>

                    <div className="panelAttendance-tabs">
                      <div className="tabPanel_H">
                        <ul className="nav nav-tabs" role="tablist" >
                          <div style={{ height: "470px", overflow: "auto" }}>
                            {this.dateWiseAttendanceList()}
                          </div>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* }  */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, student, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  studentBatchAttendance: student.studentBatchAttendance,
  studentbatchAttendanceData: student.studentbatchAttendanceData,
  studentBatchAttendanceData: student.studentBatchAttendanceDetailsData
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStudentAttendanceBatches,
      getStudentBatchAttendanceData,
      studentBatchAttendanceDetails
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentAttendanceDetails); 