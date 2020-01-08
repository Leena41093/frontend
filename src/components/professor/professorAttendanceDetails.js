import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';

import { NewMarkAttendanceModel } from '../common/professorModel/newMarkAttendanceModel';

import { ViewDefaultersListModel } from '../common/professorModel/viewDefaultersListModel';
import {
    getAttendanceListModel, submitAttendance,
    getProfessorAttendanceBatchesData, getProfessorAttendanceBatches,
    getAttendanceListOnDate, updateAttendanceList, downloadStudentReport,
    getAttendanceStudentReport, searchForAttendanceStudent
} from '../../actions/index';
import { getProfessorProfile, getAllBatchAttendanceDataOfStudent, getProfBatchAttendanceDefaulterStudent } from '../../actions/professorActions';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import $ from 'jquery';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class ProfessorAttendanceDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getReportButtonFlag: false,
            studentListDateArr: [],
            batchList: [],
            selectedBatchIndex: 0,
            selectedDates: 0,
            getstudlist: false,
            markAttBtn: false,
            batch_id: null,
            professorDetail: [],

            professorBatches: [],
            studentList: [],
            markedUnmarkedData: [],
            noOfLecture: '',

            totalStudent: "",
            defaulterStudentArr: [],
            defaulterStudentCount: "",
            markedLecture: '',
            status: '',
            date: moment(),
            getBatchData: true,
            StudentDetails: [],
            studentreportdata: [],
            downloadUrl: "",
            getStudentsReportDate: moment(),
            week: false,
            class_name: "",
            subject_name: "",
            batch_name: "",
            studentListDateEditArr: [],
            markattmsg: false,
            markedcount: 0,
            totalcount: 0,

            flagofviewreport: false,
            downloadStudentReportData: [],
            editFlag: false,
            addloader: true,
            addloaderdata: false,
            isDataAvaialable: false,
            instituteId: 0,
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
        let adminflag = this.props.location.state ? this.props.location.state.data.adminflag : false;
        let professorflag = this.props.location.state ? this.props.location.state.data.professorflag : false;
        let admindata = this.props.location.state ? this.props.location.state.data.batch : null;

        this.setState({ instituteId: this.props.instituteId, admindata: admindata, adminflag: adminflag, professorflag: professorflag }, () => {
            if (this.state.professorflag && this.state.professorflag == true) {
                let apiData = {
                    institute_id: this.props.instituteId,
                    branch_id: this.props.branchId,
                    token: this.props.token
                }
                this.props.getProfessorAttendanceBatches(apiData).then(() => {
                    let res = this.props.profAttendancebatches;
                    if (res && res.data.status == 200) {
                        this.setState({
                            batch_id: res.data.response[0].batch_id,
                            batchList: res.data.response, class_name: res.data.response[0].class_name, subject_name: res.data.response[0].subject_name,
                            batch_name: res.data.response[0].batch_name, isDataAvaialable: false
                        }, () => {
                            this.setState({ addloader: false });
                            if (res && res.data.response) {
                                this.onSelectBatch(res.data.response[0], 0)
                            }
                        })
                    } else if (res && res.data.status == 500) {
                        this.setState({ isDataAvaialable: true })
                    }
                })

            }
            else if (this.state.adminflag) {
                this.setState({
                    batch_id: this.state.admindata.batch_id,
                    batchList: this.state.admindata, class_name: this.state.admindata.class_name, subject_name: this.state.admindata.subject_name,
                    batch_name: this.state.admindata.batch_name
                }, () => {
                    this.setState({ addloader: false })
                    if (this.state.admindata) {
                        this.onSelectBatch(admindata[0], 0)
                    }
                })
            }
        })

    }

    titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    getStudAttendencereport() {
        this.setState({ getReportButtonFlag: true }, () => {
            let datas = {
                payload: {
                    batch_id: this.state.batch_id,
                    today_dates: this.state.getStudentsReportDate,
                    week: this.state.week
                },
                institute_id: this.props.instituteId,
                branch_id: this.props.branchId,
                token: this.props.token
            }

            this.props.getAttendanceStudentReport(datas).then(() => {
                var res = this.props.getStudentAttendanceReport
                if (res && res.data.status == 200) {

                    this.setState({ studentreportdata: res.data.response.weeklyReport }, () => {

                    });
                }
            })
            let overAllStudentReportData = {
                payload: {
                    batch_id: this.state.batch_id
                },
                institude_id: this.props.instituteId,
                branch_id: this.props.branchId,
                token: this.props.token
            }
            let self = this
            this.props.getAllBatchAttendanceDataOfStudent(overAllStudentReportData).then(() => {
                var ress = self.props.overAllReportDatas;
                if (ress && ress.data.status == 200) {
                    self.setState({ downloadStudentReportData: ress.data.response.overAllReport });
                }
            })

        })
    }

    gotoAttendanceBatchDetails(event) {
        this.setState({ getReportButtonFlag: false })
    }

    markAttendance(studentList, id) {
        let data = {
            payload: {
                batch_id: id,
                // professor_id: this.state.professorId,
                lecture_date: moment.parseZone(this.state.date).format(),
                isextraclass: "False",
                studentAttendanceData: studentList
            },
            institute_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token,
        }
        this.props.submitAttendance(data).then(() => {
            let res = this.props.attendanceMark;

            if (res && res.status == 200) {
                this.setState({ editFlag: false })
                successToste("Attendance Saved Successfully");
                $("#newattendanceSubmit .close").click();
                if (this.state.batchList && this.state.batchList.length > 0) {
                    this.onSelectBatch(this.state.batchList[this.state.selectedBatchIndex], this.state.selectedBatchIndex)
                }
            }
            else if (res && res.status == 500) {
                errorToste("Something Went Wrong");
                $("#newattendanceSubmit .close").click();

            }
        })
    }

    attendanceEdit() {
        let { studentListDateArr } = this.state;
        // let data = {
        //     payload: {
        //         batch_id: this.state.batch_id,
        //         lecture_date: this.state.date
        //     },
        //     institute_id: this.props.instituteId,
        //     branch_id: this.props.branchId,
        //     token: this.props.token,
        // }
        // this.props.getAttendanceListOnDate(data).then(() => {
        //     let res = this.props.attendanceListonDate;
        //     if (res && res.data.status == 200) {
        //         this.setState({ studentListDateEditArr: res.data.response, editFlag: true })
        //     } else if (res && res.data.status == 500) {
        //         errorToste(res.data.message)
        //     }
        // })

        this.setState({ studentListDateEditArr: studentListDateArr, editFlag: true })

    }

    backtoAttendanceDirectory() {
        this.props.history.push('/app/attendance-directory')
    }

    onSelectBatch(bts, index) {

        this.setState({
            selectedBatchIndex: index, batch_id: bts.batch_id, selectedDates: 0, studentListDateArr: [], date: "", getstudlist: false,
            getBatchData: true, class_name: bts.class_name, subject_name: bts.subject_name, batch_name: bts.batch_name, addloaderdata: true, studentreportdata: []
        }, () => {
            let data = {
                payload: {
                    batch_id: bts.batch_id,
                },
                institute_id: this.props.instituteId,
                branch_id: this.props.branchId,
                token: this.props.token,
            }
            this.props.getProfessorAttendanceBatchesData(data).then(() => {
                let res = this.props.profAttendanceBatchesData;

                if (res && res.data.status == 200) {

                    this.setState({
                        noOfLecture: res.data.response.batchDetails.no_of_lecture,
                        totalStudent: res.data.response.batchDetails.total_student,
                        // defaulterStudentArr: res.data.response.defaulterStudent,
                        // defaulterStudentCount: res.data.response.defaulterStudent.length,
                        avgAttendance: res.data.response.batchDetails.avg_attendance,
                        markedUnmarkedData: res.data.response.markedUnmarkedData,
                        markedLecture: res.data.response.batchDetails.marked_lecture
                    }, () => {
                        this.setState({ addloaderdata: false })
                        if ((this.state.markedUnmarkedData && this.state.markedUnmarkedData.length > 0)) {

                            this.getStudentlistOnDate(this.state.markedUnmarkedData[this.state.selectedDates].batch_status,
                                this.state.markedUnmarkedData[this.state.selectedDates].batch_date,
                                this.state.selectedDates);
                        }
                    })

                    let dataOfDefaulterStudent = {
                        payload: {
                            batch_id: bts.batch_id,
                        },
                        institute_id: this.props.instituteId,
                        branch_id: this.props.branchId,
                        token: this.props.token,
                    }
                    this.props.getProfBatchAttendanceDefaulterStudent(dataOfDefaulterStudent).then(() => {
                        let res = this.props.profBatchAttendanceDefaulterStudent
                        if (res && res.data.status == 200) {
                            this.setState({
                                defaulterStudentArr: res.data.response,
                                defaulterStudentCount: res.data.response.length,
                            })
                        }
                    })
                }
                if (this.state.getReportButtonFlag == true) {
                    this.getStudAttendencereport();
                }
            })
        })
    }

    getStudentlistOnDate(status, date, index) {

        this.setState({ selectedDates: index, date: date }, () => {
            if (status == "UnMarked") {
                let data = {
                    payload: {
                        batch_id: this.state.batch_id,
                        lecture_date: this.state.date
                    },
                    institute_id: this.props.instituteId,
                    branch_id: this.props.branchId,
                    token: this.props.token,
                }
                this.props.getAttendanceListOnDate(data).then(() => {
                    let res = this.props.attendanceListonDate;
                    if (res && res.data.status == 200) {
                        this.setState({ StudentDetails: res.data.response, editFlag: false })
                    }
                })
            }

            if (status == "Marked") {
                let data = {
                    payload: {
                        batch_id: this.state.batch_id,
                        lecture_date: this.state.date
                    },
                    institute_id: this.props.instituteId,
                    branch_id: this.props.branchId,
                    token: this.props.token,
                }
                this.props.getAttendanceListOnDate(data).then(() => {
                    let res = this.props.attendanceListonDate;
                    if (res && res.data.status == 200) {
                        this.setState({ getstudlist: true, editFlag: false, markattmsg: false, date: date, markAttBtn: false, studentListDateArr: res.data.response })
                    } else if (res && res.data.status == 500) {
                        errorToste(res.data.message)
                    }
                })
            }
            else if (status == "UnMarked") {
                if (moment(this.state.date) > moment()) {
                    this.setState({ markAttBtn: false, markattmsg: true, date: date, getstudlist: false })
                } else {
                    this.setState({ markAttBtn: true, date: date, getstudlist: false })
                }
            }
        })
    }

    downloadReport() {
        var data = {
            payload: {
                batch_id: this.state.batch_id,
                studentData: this.state.downloadStudentReportData
            },
            institute_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token,
        }
        this.props.downloadStudentReport(data).then(() => {
            let res = this.props.studentAttendaceReport;
            if (res && res.data.status == 200) {

                this.setState({ downloadUrl: res.data.response }, () => { document.getElementById('download').click() })
            }
        })
    }

    sortDate(flag) {
        var data = this.state.studentreportdata;
        if (data && data[0]) {
            if (flag == "previous") {
                let date = new Date(data[0].Attendance[0].dates);
                date.setDate(date.getDate() - 1);
                this.setState({ getStudentsReportDate: date, week: "False" })
                this.getStudAttendencereport()
            }
            else if (flag == "next") {
                let date = new Date(data[0].Attendance[data[0].Attendance.length - 1].dates);
                date.setDate(date.getDate() + 1);
                this.setState({ getStudentsReportDate: date, week: "True" })
                this.getStudAttendencereport()
            }
        }
    }

    renderBatches() {
        let { batchList } = this.state;
        if (batchList && batchList.length > 0) {
            return batchList.map((bts, index) => {

                let active = this.state.selectedBatchIndex == index ? 'st-active' : "";
                return (
                    <li key={"batch" + index}>
                        <button className={`leftNav-link ${active}`} onClick={this.onSelectBatch.bind(this, bts, index)}>
                            <span className="navHeading">{bts.class_name + " > " + bts.subject_name}</span>
                            <span className="navSubHeading">{bts.batch_name}</span>
                        </button>
                    </li>
                )
            })
        }
    }

    renderBatchLectureData() {
        return (
            <div className="cardGraph_number">
                <div className="sect_num">
                    <span className="sect_num_prime">{this.state.noOfLecture ? this.state.noOfLecture : 0}</span>
                    <span className="sect_num_info">No. of Lectures</span>
                </div>
                <div className="sect_num">
                    <span className="sect_num_prime">{(this.state.markedLecture || this.state.noOfLecture) ? this.state.markedLecture + " / " + this.state.noOfLecture : 0 + "/" + 0}</span>
                    <span className="sect_num_info">Attendance Marked</span>
                </div>
                <div className="sect_num">
                    <span className="sect_num_prime">{this.state.avgAttendance ? Math.round(this.state.avgAttendance) + "%" : 0 + "%"}</span>
                    <span className="sect_num_info">Average Attendance</span>
                </div>
                <div className="sect_num">
                    <span className="sect_num_prime">{this.state.totalStudent ? this.state.totalStudent : 0}</span>
                    <span className="sect_num_info">Total Students</span>
                </div>
                <div className="sect_num">
                    <span className="sect_num_prime">{this.state.defaulterStudentCount ? this.state.defaulterStudentCount : 0}</span>
                    <span className="sect_num_info">Defaulter Students</span>
                    {(this.state.defaulterStudentCount != 0) ?
                        <button className="sect_num_btn" data-toggle="modal" data-target="#viewDefaultrs">View</button>
                        : ""}

                </div>
            </div>
        )
    }

    dateWiseAttendanceList() {
        let { markedUnmarkedData } = this.state;

        if (markedUnmarkedData && markedUnmarkedData.length > 0) {
            return markedUnmarkedData.map((data, index) => {

                let activedate = this.state.selectedDates == index ? 'active' : "";
                var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
                    "Friday", "Saturday")
                var d = new Date(data.batch_date);
                let dayName = weekday[d.getDay()];

                return (
                    <li key={"datewiseattendancedata" + index} role="presentation" className={activedate} >
                        <button className={`tabLink`} onClick={this.getStudentlistOnDate.bind(this, data.batch_status, data.batch_date, index)}>
                            <div className="divider-block text--left">
                                <span className="tabText text-bold">{moment(data.batch_date).format("DD MMM YYYY")}</span>
                                <span className="tabText">{dayName}</span>
                            </div>
                            {data.batch_status == "Marked" ?
                                <div className="divider-block text--right">
                                    <span style={{ marginLeft: "59px" }} className="tabText st-green">{"Marked" + " " + data.present_student + "/" + data.total_student}</span>
                                </div>
                                :
                                <div className="divider-block text--right">
                                    <span style={{ marginLeft: "63px" }} className="tabText st-gray">{"Unmarked"}</span>
                                </div>}
                        </button>
                    </li>
                )
            })
        }
        else if (markedUnmarkedData && markedUnmarkedData.length == 0) {
            return (
                <div style={{ color: "red", marginLeft: "65px", marginTop: "100px" }}>No Lectures Conducted Yet</div>
            )
        }
    }

    renderDates() {
        var data = this.state.studentreportdata;

        if (data && data[0]) {
            return data[0].Attendance.map((data, index) => {
                var d = new Date(data.dates);
                let month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                return (
                    <td key={"renderdates" + index}><span className="c-heading-sm card--Subtitle nomargin">{d.getDate() + " " + month_names[d.getMonth()]}</span></td>
                )
            })
        }
    }

    returnPresenty(data, index) {
        if (index == 0) {
            return data.Attendance.map((dates, i) => {

                if (dates.present == true) {
                    return (<td key={"date-" + i}><div className="c-attendanceStatus st-present"></div></td>);
                }
                else if (dates.present == false) {
                    return (<td key={"date-" + i}><div className="c-attendanceStatus st-absent"></div></td>);
                }
                else if (dates.present == "-") {
                    return (<td key={"date-" + i}><div className="c-attendanceStatus st-block"></div></td>)
                }
            })
        } else {
            return data.Attendance.map((dates, i) => {

                if (dates.present == true) {
                    return (<td key={"date-" + i}><div className="c-attendanceStatus st-present"></div></td>);
                }
                else if (dates.present == false) {
                    return (<td key={"date-" + i}><div className="c-attendanceStatus st-absent"></div></td>);
                }
                else if (dates.present == "-") {
                    return (<td key={"date-" + i}><div className="c-attendanceStatus st-block"></div></td>)
                }
            })
        }
    }

    renderAttendance() {

        if (this.state.studentreportdata && this.state.studentreportdata.length > 0) {
            return this.state.studentreportdata.map((data, index) => {

                return (
                    <tr key={"studentData-" + index}>
                        <td style={{ width: "250px" }} className="text--left">
                            <div className="studentInfo">
                                <div className="studSection student_img">
                                    <img src={data.picture_url ? data.picture_url : "/images/avatars/Avatar_default.jpg"} className="mCS_img_loaded" />
                                </div>
                                <div className="studSection student_name">
                                    <span className="static-text sm text-bold">{data.firstname + " " + data.lastname}</span>
                                    <span className="static-text sm">{data.roll_no}</span>
                                </div>
                            </div>
                        </td>
                        {this.returnPresenty(data, index)}

                    </tr>
                )
            })

        }
    }

    renderlist() {
        let { studentListDateArr } = this.state;
        if (studentListDateArr && studentListDateArr.length > 0) {
            return studentListDateArr.map((stud, index) => {
                return (
                    <li key={"list" + index} className="st-present">
                        <div className="studentInfoRow">
                            <div className="studentInfo">
                                <div className="studSection student_img">
                                    <img src={stud.user_pic ? stud.user_pic : "/images/avatars/Avatar_default.jpg"} className="mCS_img_loaded" />
                                </div>

                                <div className="studSection student_name">
                                    <span className="static-text sm text-bold">{(stud.student_firstName && stud.student_lastName) ? (stud.student_firstName + "  " + stud.student_lastName) : ""}</span>
                                    <span className="static-text sm">{stud.student_rollNumber ? stud.student_rollNumber : ""}</span>
                                </div>

                                {stud.marked_status == true ?
                                    <div className="studSection student_num text-right">
                                        <span className="attendance_status st-present">Present</span>
                                    </div> :
                                    <div className="studSection student_num text-right">
                                        <span className="attendance_statusabsent st-absent ">Absent</span>
                                    </div>}
                            </div>
                        </div>
                    </li>
                )
            })
        }
    }

    renderMarkAttendanceModel() {
        return (
            <div role="tabpanel" className="tab-pane" id="profile">

                {/* <div className="tabpanel_heading">
					<div className="divider-block text--left">
						<span className="static-text">{moment(this.state.date).format("DD MMM YYYY")}</span>
					</div>
				</div> */}
                <div className="tabpanel_Listing" style={{ marginTop: "-445px" }}>

                    <div className="tabpanel_Listing_blank">
                        <div className="blank_img">
                            <img src="/images/card-img-4.png" alt="" />
                        </div>
                        <div className="static-text sm">Attendance not marked yet.</div>

                        <div className="c-card__btnCont">
                            <button className="c-btn-large primary" data-toggle="modal" data-target="#newattendanceSubmit">Mark Attendance</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderModelForNextDate() {
        return (
            <div role="tabpanel" className="tab-pane" id="profile">

                {/* <div className="tabpanel_heading">
					<div className="divider-block text--left">
						<span className="static-text">{moment(this.state.date).format("DD MMM YYYY")}</span>
					</div>
				</div> */}
                <div className="tabpanel_Listing" style={{ marginTop: "-445px" }}>

                    <div className="tabpanel_Listing_blank">
                        <div className="blank_img">
                            <img src="/images/card-img-4.png" alt="" />
                        </div>
                        <div className="static-text sm">Attendance not marked yet.</div>

                        <div className="c-card__btnCont">
                            <button className="btn c-btn-large primary" data-toggle="modal" data-target="#newattendanceSubmit" disabled>Mark Attendance</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="c-container clearfix">
                <ToastContainer />
                <a href={this.state.downloadUrl} id="download" hidden />
                <div >

                    <div className="clearfix">
                        <div className="divider-container">

                            <div className="divider-block text--left">
                                {this.state.adminflag == true ?
                                    <a style={{ color: "#ae0a00" }} className="linkbtn hover-pointer" onClick={this.backtoAttendanceDirectory.bind(this)}>Back to Attendance Directory</a> : ""}
                                <span className="c-heading-lg">Attendance</span>
                                {(this.state.isDataAvaialable == true) ? <span style={{ color: "red" }}>There is no data available</span> : ""}
                            </div>
                            {/* <div className="divider-block text--right">
								<button className="c-btn prime">Create Extra class Attendance</button>
							</div> */}
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
                        <div className="divider-container drive--section">
                            <div className="divider-block text--left d_section_1">

                                <div className="c-leftNav">

                                    <div className="leftNav-header">BATCHES</div>
                                    <div className="leftNav-navPanel" >
                                        <ul>
                                            <div className="scrollbar5" id="style5">
                                                {this.renderBatches()}
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            {this.state.getReportButtonFlag == true ?
                                <div>
                                    <div className="divider-block text--left d_section_2">
                                        <div className="c-leftNav-panel">

                                            <div className="panelHeading divider-container">
                                                <div className="divider-block text--left">
                                                    <button onClick={this.gotoAttendanceBatchDetails.bind(this)} className="link--btn"><i className="icon cg-angle-left" ></i>Back</button>
                                                </div>
                                                <div className="divider-block text--right">
                                                    <button className="c-btn prime" onClick={this.downloadReport.bind(this)}>Download Report</button>
                                                </div>
                                            </div>


                                            <div className="c-divTable">
                                                <div className="c-divTable_head">
                                                    <table className="table">
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ width: "250px" }} className="text--left">
                                                                    <span className="c-heading-sm card--Subtitle pull-left nomargin">STUDENTS</span>
                                                                    <div className="form-group cust-fld sm pull-right nomargin">

                                                                    </div>
                                                                </td>

                                                                {this.renderDates()}


                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="c-divTable_body c-card__items" style={{ overflowY: "auto" }}>
                                                    <table className="table">
                                                        {/* {this.state.addloaderdata == true ? <tbody style={{display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "45%", marginTop: "15%" }}>
																<ClipLoader
																	className={override}
																	sizeUnit={"px"}
																	size={50}
																	color={'#123abc'}

																/></tbody> : */}
                                                        <tbody>
                                                            {this.renderAttendance()}
                                                        </tbody>
                                                        {/* } */}
                                                    </table>
                                                </div>

                                                <div className="c-btnContainer pad10 text-right">
                                                    <button className="c-btn-bordered" onClick={this.sortDate.bind(this, "previous")}>Previous Week</button>
                                                    <button className="c-btn-bordered" onClick={this.sortDate.bind(this, "next")}>Next Week</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                :
                                <div>

                                    <div className="divider-block text--left d_section_2">
                                        <div className="c-leftNav-panel">

                                            <div className="panelHeading divider-container">
                                                <div className="divider-block text--left">
                                                    {(this.state.batchList && this.state.batchList.length > 0) ?
                                                        <span>{this.state.class_name + " > " + this.state.subject_name + " > " + this.state.batch_name}</span> : ""}
                                                </div>

                                                {((this.state.totalStudent != 0) && (this.state.markedUnmarkedData.length != 0)) ? <div className="divider-block text--right">
                                                    <button className="c-btn prime" onClick={this.getStudAttendencereport.bind(this)}>View Student Report</button>
                                                </div> :
                                                    <div className="divider-block text--right">
                                                        <button disabled className="btn c-btn prime" onClick={this.getStudAttendencereport.bind(this)}>View Student Report</button>
                                                    </div>}
                                            </div>
                                            {/* {this.state.addloaderdata == true ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "45%", marginTop: "15%" }}>
																<ClipLoader
																	className={override}
																	sizeUnit={"px"}
																	size={50}
																	color={'#123abc'}

																/></div> : */}
                                            <div>
                                                {this.state.getBatchData == true ?
                                                    <div className="panelScoreLine">
                                                        {this.renderBatchLectureData()}
                                                    </div> : ""}


                                                <div className="panelAttendance-tabs">
                                                    <div className="tabPanel_H">

                                                        <ul className="nav nav-tabs" role="tablist" >
                                                            <div className="scrollbar2" id="style2">
                                                                {this.dateWiseAttendanceList()}
                                                            </div>
                                                        </ul>


                                                        <div className="tab-content">
                                                            <div role="tabpanel" className="tab-pane fade in active" id="home">
                                                                {this.state.getstudlist == true ?
                                                                    <div className="tabpanel_heading">
                                                                        <div className="divider-block text--left">
                                                                            <span className="static-text">{this.state.date ? moment(this.state.date).format("DD MMM YYYY") : ""}</span>
                                                                        </div>
                                                                        <div className="divider-block text--right">
                                                                            <button className="link--btn pull-right text-bold" onClick={this.attendanceEdit.bind(this)} data-toggle="modal" data-target="#newattendanceSubmit"><i className="icon cg-ic-create-black-24-px"></i>Edit</button>

                                                                        </div>
                                                                    </div> : ""}


                                                                {this.state.getstudlist == true ?
                                                                    <div className="tabpanel_Listing c-card__items">

                                                                        <ul >
                                                                            <div className="scrollbar2" id="style2">
                                                                                {this.renderlist()}
                                                                            </div>
                                                                        </ul>

                                                                    </div> : ""}
                                                            </div>

                                                            {this.state.markAttBtn == true ?
                                                                <div>
                                                                    {this.renderMarkAttendanceModel()}
                                                                </div> :
                                                                (this.state.markattmsg == true) ?
                                                                    <div>
                                                                        {this.renderModelForNextDate()}
                                                                    </div> : ""
                                                            }
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            {/* } */}
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>

                    </div>
                    {/* } */}
                </div>
                <NewMarkAttendanceModel {...this.props} editFlag={this.state.editFlag} onMarkAttendance={(data, id) => { this.markAttendance(data, id) }}
                    class_name={this.state.class_name} subject_name={this.state.subject_name} batch_name={this.state.batch_name} date={moment(this.state.date)} batch_id={this.state.batch_id} StudentDetails={this.state.StudentDetails} editStudentArr={this.state.studentListDateEditArr}

                />

                <ViewDefaultersListModel defaulterStudentArr={this.state.defaulterStudentArr} defaulterStudentCount={this.state.defaulterStudentCount} />

            </div>
        )
    }
}

const mapStateToProps = ({ app, professor, auth }) => ({
    modelAttendanceList: app.modelAttendanceList,
    branchId: app.branchId,
    instituteId: app.institudeId,
    token: auth.token,
    attendanceMark: app.attendanceMark,
    professorProfile: professor.professorProfile,
    profAttendanceBatchesData: app.profAttendanceBatchesData,
    profAttendancebatches: app.profAttendancebatches,
    attendanceListonDate: app.attendanceListonDate,
    updateStudentAttendancelist: app.updateStudentAttendancelist,
    studentAttendaceReport: app.studentAttendaceReport,
    getStudentAttendanceReport: app.getStudentAttendanceReport,
    studentAttendanceSearch: app.studentAttendanceSearch,
    overAllReportDatas: professor.overAllStudentReportData,
    profBatchAttendanceDefaulterStudent: professor.profBatchAttendanceDefaulterStudent
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getAttendanceListModel,
            submitAttendance,
            getProfessorProfile,
            getProfessorAttendanceBatchesData,
            getProfessorAttendanceBatches,
            getAttendanceListOnDate,
            updateAttendanceList,
            downloadStudentReport,
            getAttendanceStudentReport,
            searchForAttendanceStudent,
            getAllBatchAttendanceDataOfStudent,
            getProfBatchAttendanceDefaulterStudent
        }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorAttendanceDetails); 