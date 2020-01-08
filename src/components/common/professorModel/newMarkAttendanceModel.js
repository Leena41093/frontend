import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

export class NewMarkAttendanceModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentCount: '',
      presentCount: '',
      class_name: "",
      subject_name: "",
      batch_name: "",
      StudentDetails: [],
      count: 0,
      allMarkedChecked: false,
      editFlag: false,
      studentAttendance: [],
      searchText: "",
      searchFlag: false,
      SearchDataArr: [],
      flag: true,
    }
  }

  componentWillReceiveProps(props) {

    if (props && props.editFlag == true) {

      this.setState({
        editFlag: props.editFlag, StudentDetails: props.editStudentArr, class_name: props.class_name,
        subject_name: props.subject_name, batch_name: props.batch_name, batch_id: props.batch_id,
        date: props.date,
        totalStudent: props.editStudentArr.length
      }, () => {

        if (this.state.count == this.state.totalStudent) {
          this.setState({ allMarkedChecked: true })
        } else if (this.state.count == 0) {
          this.setState({ allMarkedChecked: false })
        } else if (this.state.count != this.state.totalStudent) {
          this.setState({ allMarkedChecked: false });
        }
        this.calculateCount();


      })
    } else {
      if (this.state.flag == true) {
        let student = [];
        props.StudentDetails.map((stud, index) => {
          stud.marked_status = true;
          student.push(stud)
        })
        this.setState({
          StudentDetails: student
          , class_name: props.class_name,
          subject_name: props.subject_name, batch_name: props.batch_name, batch_id: props.batch_id, date: props.date
          , totalStudent: student.length
        }, () => {
          this.calculateCount();
        })
      }
    }
  }

  getattendanceStatus(index, id) {
    let { StudentDetails } = this.state;
    this.state.StudentDetails.forEach((stud, idx) => {

      if (index == idx) {
        if (stud.marked_status == "absent" || stud.marked_status == false) {
          let { count, totalStudent } = this.state;
          StudentDetails[idx] = { ...StudentDetails[idx], marked_status: true };
          this.setState({ StudentDetails }, () => { })
        } else if (stud.marked_status == true) {
          let { count, totalStudent } = this.state;
          StudentDetails[idx] = { ...StudentDetails[idx], marked_status: "absent" };
          this.setState({ StudentDetails }, () => { })
        }
        this.calculateCount();
      }
    })
  }

  calculateCount() {
    let { StudentDetails, count } = this.state;
    count = 0
    StudentDetails.forEach((stud, index) => {
      if (stud.marked_status == true) {
        count++;
      }
    })
    this.setState({ count }, () => {
      if (count == this.state.totalStudent) {
        this.setState({ allMarkedChecked: true })
      } else if (count != this.state.totalStudent) {
        this.setState({ allMarkedChecked: false })
      } else if (count == 0) {
        this.setState({ allMarkedChecked: false })
      }
    })
  }

  getButtonlabel() {
    if (this.state.editFlag == true) {
      return 'Save Attendance';
    } else {
      return 'Submit Attendance';
    }
  }

  searchStudent(event) {
    this.setState({ searchText: event.target.value }, () => {
      if (this.state.searchText == "") {
        this.setState({ searchFlag: false, flag: false })
      } else {
        this.setState({flag:false},()=>{
        let data = {
          payload: {
            searchText: this.state.searchText,
            batch_id: this.state.batch_id,
            lecture_date: moment.parseZone(this.state.date).format()
          },
          institute_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token
        }

        this.props.searchForAttendanceStudent(data).then(() => {
          let res = this.props.studentAttendanceSearch;
          let resArr = res.data.response;
          if (res && res.data.status == 200) {
            this.state.StudentDetails.forEach((item, i) => {

              resArr.forEach((res, idx) => {
                if (item.student_id == res.student_id) {
                  if (item.marked_status == "absent" || item.marked_status == false) {
                    resArr[idx] = { ...resArr[idx], marked_status: false }
                    this.setState({ SearchDataArr: resArr, searchFlag: true, flag: false })
                  } else {
                    resArr[idx] = { ...resArr[idx], marked_status: true }
                    this.setState({ SearchDataArr: resArr, searchFlag: true, flag: false })
                  }

                }
              })
            })
          }
        })
      })
      }
    })
  }

  getSearchAttendanceStatus(index, id) {

    let { SearchDataArr } = this.state;
    SearchDataArr.forEach((data, i) => {
      if (i === index) {
        if (data.marked_status == "absent" || data.marked_status == false) {


          SearchDataArr[i] = { ...SearchDataArr[i], marked_status: true };

          this.setState({ SearchDataArr })
        } else {

          SearchDataArr[i] = { ...SearchDataArr[i], marked_status: "absent" };

          this.setState({ SearchDataArr })
        }
      }
      this.calculateCount();
    })

    let { StudentDetails } = this.state;
    StudentDetails.forEach((item, index) => {

      if (item.student_id == id) {
        this.getattendanceStatus(index, id)
      }
    })
  }

  checkAllMarked() {
    if (this.state.allMarkedChecked == false) {
      this.setState({ allMarkedChecked: true, count: this.state.totalStudent }, () => {

        let { StudentDetails } = this.state;
        this.state.StudentDetails.forEach((stud, idx) => {
          StudentDetails[idx] = { ...StudentDetails[idx], marked_status: true };
          this.setState({ StudentDetails })
        })

      })
    } else {
      this.setState({ allMarkedChecked: false, count: 0 }, () => {

        let { StudentDetails } = this.state;
        this.state.StudentDetails.forEach((stud, idx) => {
          StudentDetails[idx] = { ...StudentDetails[idx], marked_status: "absent" };
          this.setState({ StudentDetails }, () => {

          })
        })

      })
    }

  }

  submitAttendance() {
    let { StudentDetails, studentAttendance } = this.state;

    StudentDetails.map((obj, index) => {

      if (obj.marked_status == "absent" || obj.marked_status == false) {
        var status = "False"
      } else {
        var status = "True"
      }
      this.state.studentAttendance.push({
        student_id: obj.student_id,
        present: status
      })
    })
    this.setState({ studentAttendance }, () => {

    })

    this.props.onMarkAttendance(this.state.studentAttendance, this.props.batch_id, this.state.date);
    this.setState({
      studentCount: '', presentCount: '', class_name: "", subject_name: "", batch_name: "",
      StudentDetails: [], count: 0, allMarkedChecked: false, studentAttendance: [], searchText: "",
      searchFlag: false, SearchDataArr: [], totalStudent: 0, flag: true
    }, () => { $("#newattendanceSubmit .close").click(); })

  }

  closeModel() {
    // $("#newattendanceSubmit").hide();
    this.setState({ flag: true })
    $("#newattendanceSubmit .close").click()


    // this.setState({
    //   studentCount: '', presentCount: '', class_name: "", subject_name: "", batch_name: "",
    //   StudentDetails: [], count: 0, allMarkedChecked: false, editFlag: false, studentAttendance: [],
    //   searchText: "", searchFlag: false, SearchDataArr: [], totalStudent: 0,flag:true
    // })
  }

  renderSearchList() {
    let { SearchDataArr, } = this.state;
    if (SearchDataArr && SearchDataArr.length > 0) {
      return SearchDataArr.map((studlist, index) => {
        return (
          <li key={"studentlist" + index}>
            <div className="studentInfoRow">
              <div className="studentInfo">
                <div className="studSection student_num">
                  <label className="custome-field field-checkbox col-green">
                    <input type="checkbox" name="check-one" id="check-3" value="checkone" onChange={this.getSearchAttendanceStatus.bind(this, index, studlist.student_id, studlist.marked_status)} checked={(studlist.marked_status == "absent" || studlist.marked_status == false) ? false : true} />
                    <i></i>
                  </label>
                </div>
                <div className="studSection student_img">
                  <img src={studlist.user_pic ? studlist.user_pic : "/images/avatars/Avatar_default.jpg"} />
                </div>
                <div className="studSection student_name">
                  <span className="cust-m-info text-bold">{(studlist.student_firstName && studlist.student_lastName) ? (studlist.student_firstName + " " + studlist.student_lastName) : ""}</span>
                  <span className="cust-m-info text-normal">{studlist.student_rollNumber ? studlist.student_rollNumber : ""}</span>
                </div>
              </div>
            </div>
          </li>
        )
      })
    }
  }


  renderAttendancelist() {
    let { StudentDetails } = this.state;
    if (StudentDetails && StudentDetails.length > 0) {
      return StudentDetails.map((studlist, index) => {

        return (
          <li key={"studentlist" + index}>
            <div className="studentInfoRow">
              <div className="studentInfo">
                <div className="studSection student_num">
                  <label className="custome-field field-checkbox col-green">
                    <input type="checkbox" name="check-one" id="check-2" value="checkone" onChange={this.getattendanceStatus.bind(this, index, studlist.student_id)} checked={(studlist.marked_status == "absent" || studlist.marked_status == false) ? false : true} />
                    <i></i>
                  </label>
                </div>
                <div className="studSection student_img">
                  <img src={studlist.user_pic ? studlist.user_pic : "/images/avatars/Avatar_default.jpg"} />
                </div>
                <div className="studSection student_name">
                  <span className="cust-m-info text-bold">{(studlist.student_firstName && studlist.student_lastName) ? (studlist.student_firstName + " " + studlist.student_lastName) : ""}</span>
                  <span className="cust-m-info text-normal">{studlist.student_rollNumber ? studlist.student_rollNumber : ""}</span>
                </div>
              </div>
            </div>
          </li>
        )
      })
    }
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm width--sm" id="newattendanceSubmit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        {/* <ToastContainer /> */}
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModel.bind(this)}><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">MARK ATTENDANCE</h4>
            </div>
            <div className="modal-body" >

              <div className="divider-container margin0-top">
                <div className="divider-block w-70 text--left">
                  <span className="static-text sm margin5-bottom">{(this.state.class_name && this.state.subject_name) ? (this.state.class_name + " > " + this.state.subject_name) : ""}</span>
                  <span className="c-heading-sm card--title nomargin">{this.state.batch_name ? this.state.batch_name : ""}</span>
                  <br />
                  <input type="text" className="form-control cust-fld" id="searchName" value={this.state.searchText} onChange={this.searchStudent.bind(this)} placeholder="Search by Name" />
                </div>
                <div className="divider-block w-30 text--right">
                  <span className="c-heading-sm lg card--title nomargin">{this.state.count + "/" + this.state.totalStudent}</span>
                </div>
              </div>

              {this.state.searchFlag == true ?
                <div className="c-list type-3 type-checkBox c-card__items" style={{ height: "500px", overflow: "auto" }}>
                  <ul>
                    {this.renderSearchList()}
                  </ul>
                </div>

                :
                <div className="c-list type-3 type-checkBox c-card__items" style={{ height: "500px", overflow: "auto" }}>
                  <ul>
                    <li>
                      <div className="studentInfoRow">
                        <div className="studentInfo">
                          <div className="studSection student_num">
                            <label style={{ marginBottom: "10px" }} className="custome-field field-checkbox col-green">
                              <input type="checkbox" name="check-one" id="check-1" value="checkone" onChange={this.checkAllMarked.bind(this)} checked={this.state.allMarkedChecked == true ? true : false} />
                              <i></i>
                            </label>
                          </div>
                          <div className="studSection student_name">
                            <span className="cust-m-info text-bold" >Mark All Present</span>
                          </div>
                        </div>
                      </div>
                    </li>

                    {this.renderAttendancelist()}
                  </ul>
                </div>}
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal" onClick={this.closeModel.bind(this)}>Cancel</button>
                <button className="c-btn primary" onClick={this.submitAttendance.bind(this)}>{this.getButtonlabel()}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}

export default (NewMarkAttendanceModel)