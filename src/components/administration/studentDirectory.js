import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { getBatches, getSubjects, getStudentList, invitationSend, getStudentStatus, getIsProfessorAdmin, getEmailOfStudentDirectory } from '../../actions/index';
import { errorToste, successToste } from '../../constant/util';
import { bindActionCreators } from 'redux';
import $ from "jquery";

let table = '0';

class StudentDirectory extends Component {
  constructor(props) {

    super(props);
    this.state = {
      studentList: [],
      count: 0,
      searchText: '',
      selectedYear: "All",
      selectedClass: "All",
      selectedClassId: "",
      selectedSubject: "All",
      selectedSubjectId: "",
      selectedBatch: "All",
      selectedBatchId: "",
      selectedState: "",
      yearList: ["All"],
      classList: [],
      subjectList: [],
      batchList: [],
      // stateList: [],
      branchId: 0,
      subjects: [],
      instituteId: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {

      if (this.state.instituteId != nextProps.instituteId) {
        this.setState({ instituteId: nextProps.instituteId }, () => {
          var datas = {
            institudeId: this.props.instituteId,
            branchId: this.props.branchId,
            token: this.props.token,
          }
          this.props.getIsProfessorAdmin(datas).then(() => {
            let res = this.props.ProfessorAdmin;
            if (res && res.data.status == 200 && res.data.response.isProfessorAdmin == false) {
              this.props.history.push("/app/dashboard");
            }
            else {
              if (this.state.branchId != nextProps.branchId) {
                this.setState({ branchId: nextProps.branchId }, () => {
                  table.fnDraw()
                });
              }
            }
          })
        })
      }
    }
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId })
    let { yearList } = this.state;
    let currYear = new Date().getFullYear();
    let futureYear = currYear + 15;
    let pastYear = currYear - 15;
    for (let year = pastYear; year <= futureYear; year++) {
      yearList.push((year - 1) + "-" + (year));
    }
    this.setState({ yearList })

    if (this.props.classes && this.props.classes.length > 0) {
      this.setState({ classList: this.props.classes });
    }
    let data = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
    }
    this.props.getStudentStatus(data).then(() => {
      // let res = this.props.studentTableStatus;
    })
    this.props.getEmailOfStudentDirectory(data).then(() => {

    })

    this.initializeDatatable();
  }

  initializeDatatable() {

    table = $("#studentList").dataTable({
      "ajax": (data, callback, settings) => {
        this.callNewDataList(data, callback, settings);
        callback(
          {
            recordsTotal: this.state.count,
            recordsFiltered: this.state.count,
            data: []
          }
        );
      },
      "columnDefs": [{
        "targets": -1,
        "data": null,
        // "defaultContent": `<button class="link--btn" id="view">View Profile</button>`,
        targets: [6],
        "render": (data, type, row) => {

          let rowhtml;
          let title = this.getConditionForButton(row[6]);
          if (title) {
            return rowhtml = `<button class="link--btn" id="view">View Profile</button> 
            <button class="link--btn" id="invite" >${title}</button>`;
          } else {
            return rowhtml = `<button class="link--btn" id="view">View Profile</button>`
          }

        }
      }, { orderable: false, targets: [6] },

      {
        targets: [3],
        "render": (data, type, row) => {
          let rowhtml;
          let className = this.getClassForStatus(row[3]);

          return rowhtml = `<span class="${className}" id="status"  >${row[3]}</span>`;
        }
      }, {
        targets: [1],
        className: 'c-bold'
      }],
      serverSide: true,
      responsive: true,
      bFilter: false,
      dom: 'frtlip',
      bjQueryUI: true,
      bPaginate: true,
      pagingType: "full_numbers",
    });

    $(".dataTables_length").css('clear', 'none');
    $(".dataTables_length").css('margin-right', '2%');
    $(".dataTables_length").css('margin-top', '4px');
    // $(".dataTables_length").css('margin-left', '20%');

    $(".dataTables_info").css('clear', 'none');
    $(".dataTables_info").css('padding', '0');
    $(".dataTables_info").css('margin-top', '5px');
    // $(".dataTables_info").css('margin-right', '200%');


    var _ = this;
    $('#studentList tbody').on('click', '#view', function () {

      var data = table.api().row($(this).parents('tr')).data();

      _.onChangeStudentDetail(data[6]);
    });

    var _ = this;
    $('#studentList tbody').on('click', '#invite', function () {

      var data = table.api().row($(this).parents('tr')).data();
      _.onSendInvitation(data[6]);
    });
  }
  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }

  getClassForStatus(data) {
    let css;
    switch (data) {
      case 'Pass Out': {
        css = "PASS-OUT"
        break;
      }
      case 'Current': {
        css = "c-state"
        break;
      }
    }
    return css;

  }

  getConditionForButton(obj) {
    if (obj.is_invite == true && obj.is_register == false) {
      return "Invite Again";
    } else if (obj.is_invite == false && obj.is_register == false) {
      return "Invite";
    } else if (obj.is_invite == true && obj.is_register == true) {
      return false;
    }
  }

  callNewDataList(data, callback, settings) {
    let order_column
    if (data.order[0].column === 0) {
      order_column = "student_id"
    }
    else if (data.order[0].column === 1) {
      order_column = "firstname"
    }
    else if (data.order[0].column === 2) {
      order_column = "mobile"
    }
    else if (data.order[0].column === 3) {
      order_column = "state"
    }
    else if (data.order[0].column === 4) {
      order_column = "class_id"
    }
    else if (data.order[0].column === 5) {
      order_column = "year_of_addmission"
    }

    let order_type;
    if (data.order[0].dir === "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }
    // this.getStudentList(data,order_column, callback)
    let year = this.state.selectedYear == "All" ? "" : this.state.selectedYear;
    const { searchText } = this.state;
    let apiData = {
      payload: {
        "searchText": searchText ? (searchText).trim() : '',
        "record_per_page": data.length,
        "page_number": data.start / data.length + 1,
        "order_column": order_column,
        "order_type": order_type,
        "year_of_addmission": year,
        "class_id": this.state.selectedClassId,
        "subject_id": this.state.selectedSubjectId,
        "batch_id": this.state.selectedBatchId,
      },
      "instituteId": this.props.instituteId,
      "branchId": this.props.branchId,
      token: this.props.token
    }

    getStudentList(apiData).then(res => {
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {

    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
      this.setState({ count: res.data.response.totalCount })
      let studentList = res.data.response.studentDetail;
      if (studentList && studentList.length > 0) {
        studentList.map((data, index) => {
          var arr = [];
          let status = this.titleCase(data.state);
          let name = data.firstname + " " + data.lastname;
          arr[0] = data.roll_no;
          arr[1] = name;
          arr[2] = data.mobile;
          arr[3] = status;
          arr[4] = data.class_name;
          arr[5] = data.year_of_addmission;
          arr[6] = data
          columnData.push(arr);
        })
      }
      callback({
        recordsTotal: this.state.count,
        recordsFiltered: this.state.count,
        data: columnData
      });
    }
    else if (res && res.data.status == 500) {
      this.setState({ count: 0 })
    }
  }

  onChangeStudentDetail(data) {
    this.props.history.push({
      pathname: 'student-detail',
      state: { data: data, branchId: this.props.branchId }
    })
  }

  onSendInvitation(data) {
    let apiData = {
      payload: {
        type: "Student",
        id: data.student_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.invitationSend(apiData).then(() => {
      let res = this.props.sendInvitation
      if (res && res.status == 200) {
        successToste("Invitation Send Successfully");
      }
      else {
        errorToste("Something Went Wrong")
      }
    })
  }

  serachStudent(event) {
    this.setState({ searchText: event.target.value }, () => {
      table.fnDraw();
    });
  }

  onNewStudent(event) {
    var flag = true
    this.props.history.push({
      pathname: '/app/new-student',
    })
  }

  // onChangeYear(year) {
  //   if (year == "All") {
  //     this.setState({ selectedYear: "" }, () => { table.fnDraw(); })
  //   } else {
  //     this.setState({
  //       selectedYear: year,
  //     }, () => {
  //       table.fnDraw();
  //     });
  //   }
  // }

  onChangeClass(cls) {
    if (cls == "All") {
      this.setState({
        selectedClass: "All", selectedClassId: "", selectedSubject: "All",
        selectedSubjectId: "", selectedBatch: "All", selectedBatchId: "", subjectList: [], batchList: []
      }, () => { table.fnDraw(); })
    } else {
      this.setState({
        selectedClass: cls.class_name,
        selectedClassId: cls.class_id,
      }, () => {
        cls.token = this.props.token,
          cls.institude_id = this.props.instituteId
        this.props.getSubjects(cls).then(() => {
          let subjects = this.props.subjects;
          this.setState({ subjectList: subjects, selectedSubject: "All", selectedSubjectId: "", selectedBatch: "All", selectedBatchId: "" })
        });


        table.fnDraw();
      })
    }
  }

  onChangeSubject(sub) {
    if (sub == "All") {
      this.setState({
        selectedSubject: "All", selectedSubjectId: "", selectedBatch: "All",
        selectedBatchId: "", batchList: []
      }, () => { table.fnDraw(); })
    } else {
      this.setState({
        selectedSubject: sub.subject_name,
        selectedSubjectId: sub.subject_id,
      }, () => {
        sub.token = this.props.token,
          this.props.getBatches(sub).then(() => {
            let batches = this.props.batches;
            this.setState({ batchList: batches, selectedBatch: "All", selectedBatchId: "" })
          });
        table.fnDraw();
      })
    }
  }

  onChangeBatch(batch) {
    if (batch == "All") {
      this.setState({ selectedBatch: "All", selectedBatchId: "" }, () => { table.fnDraw(); })
    } else {
      this.setState({
        selectedBatch: batch.name,
        selectedBatchId: batch.batch_id,
      }, () => {
        table.fnDraw();
      })
    }
  }

  // renderYearDropDown() {
  //   return this.state.yearList.map((data, index) => {
  //     return (
  //       <li key={"year" + index}><a className="dd-option" onClick={this.onChangeYear.bind(this, data)}>{data}</a></li>
  //     )
  //   })
  // }

  renderClassDropDown() {
    let ClassArr = [];
    ClassArr.push(
      <li key={"class"}>
        <a className="dd-option" onClick={this.onChangeClass.bind(this, "All")}>All</a>
      </li>)
    if (this.state.classList && this.state.classList.length > 0) {
      this.state.classList.map((data, index) => {
        ClassArr.push(<li key={"class" + index}><a className="dd-option" onClick={this.onChangeClass.bind(this, data)}>{data.class_name}</a></li>)
      })
    }
    return (ClassArr)
  }

  renderSubjectDropDown() {
    let subjectArr = [];

    let { subjectList } = this.state;
    subjectArr.push(
      <li key={"sub"}>
        <a onClick={this.onChangeSubject.bind(this, "All")} className="dd-option">All</a>
      </li>)
    if (subjectList && subjectList.length > 0) {
      subjectList.map((data, index) => {
        subjectArr.push(<li key={"sub" + index}><a onClick={this.onChangeSubject.bind(this, data)} className="dd-option">{data.subject_name}</a></li>)
      })
    }
    return (subjectArr)
  }

  renderBatchDropDown() {
    let batchArr = [];
    batchArr.push(<li key={"batch"}><a onClick={this.onChangeBatch.bind(this, "All")} className="dd-option">All</a></li>)
    let { batchList } = this.state;
    if (batchList && batchList.length > 0) {
      batchList.map((data, index) => {
        batchArr.push(<li key={"batch" + index}><a onClick={this.onChangeBatch.bind(this, data)} className="dd-option">{data.name}</a></li>)
      })
    }
    return (batchArr)
  }

  render() {
    return (
      <div>
        <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
          <ToastContainer />
          <div className="clearfix">
            <div className="divider-container">
              <div className="divider-block text--left  test">
                <span className="c-heading-sm">Administration</span>
                <span className="c-heading-lg">Student Directory</span>
              </div>
              <div className="divider-block text--right">
                <button className="c-btn prime" onClick={this.onNewStudent.bind(this)} >Add New Student</button>
              </div>
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>Search Student</label>
                  <input type="search" className="form-control" value={this.state.searchText} onChange={this.serachStudent.bind(this)} placeholder="Enter Student Name" />
                </div>
              </div>
              <div className="divider-block text--right">
              </div>
            </div>
          </div>

          <div className=" no-round">
            <div className="c-inlineForm">
              <div className="inline--flexbox">
                {/* <div className="inline--flex">
                  <div className="form-group cust-fld">
                    <label>Year Of Admission</label>
                    <div className="dropdown" >
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.selectedYear}
                      </button>
                      <ul className="dropdown-menu" style={{ height:"200px",overflow:"auto"}} aria-labelledby="dLabel">
                        {this.renderYearDropDown()}
                      </ul>
                    </div>
                  </div>
                </div> */}
                <div className="inline--flex">
                  <div className="form-group cust-fld">
                    <label>Class Name</label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {(this.state.selectedClass && this.state.selectedClass.length > 18) ? this.state.selectedClass.slice(0, 18) + ".." : this.state.selectedClass}
                      </button>
                      <ul className="dropdown-menu" style={{ height: "200px", overflow: "auto" }} aria-labelledby="dLabel">
                        {this.renderClassDropDown()}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="inline--flex">
                  <div className="form-group cust-fld">
                    <label>Subject Name</label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {(this.state.selectedSubject && this.state.selectedSubject.length > 18) ? this.state.selectedSubject.slice(0, 18) + ".." : this.state.selectedSubject}
                      </button>
                      <ul className="dropdown-menu" style={{ height: "200px", overflow: "auto" }} aria-labelledby="dLabel">
                        {this.renderSubjectDropDown()}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="inline--flex">
                  <div className="form-group cust-fld">
                    <label>Batch Name</label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {(this.state.selectedBatch && this.state.selectedBatch.length > 18) ? this.state.selectedBatch.slice(0, 18) + ".." : this.state.selectedBatch}
                      </button>
                      <ul className="dropdown-menu" style={{ height: "200px", overflow: "auto" }} aria-labelledby="dLabel">
                        {this.renderBatchDropDown()}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className="card-container for--table">
              <div className="c-table">
                <table id="studentList" className="table data--table">
                  <thead>
                    <tr>
                      <th style={{ width: "11%" }}>ID / Roll No</th>
                      <th style={{ width: "21%" }}>Name</th>
                      <th style={{ width: "15%" }}>Phone</th>
                      <th style={{ width: "10%" }}>State</th>
                      <th style={{ width: "15%" }}>Current Class</th>
                      <th style={{ width: "15%" }}>Year of Adm.</th>
                      <th style={{ width: "13%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  classes: app.classes,
  subjects: app.subjects,
  batches: app.batches,
  token: auth.token,
  sendInvitation: app.sendInvitation,
  studentTableStatus: app.studentTableStatus,
  ProfessorAdmin: app.professorAdmin,
  studentEmailChecking: app.studentEmailCheck

})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSubjects,
      getBatches,
      invitationSend,
      getStudentStatus,
      getIsProfessorAdmin,
      getEmailOfStudentDirectory
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentDirectory)
