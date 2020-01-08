import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStudentQuizList, getStudentClasses, getStudentSubjects, getStudentBatch } from '../../actions/studentAction';
import moment from 'moment';
import $ from 'jquery';
var dt = require('datatables.net')
let table = "0";

class StudentQuizDirectory extends Component {
  constructor(props) {
    super(props);
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.state = {
      studentQuizList: [],
      count: 0,
      searchText: '',
      selectedClassId: pro ? pro[0].class_id : "",
      selectedClassName: pro ? pro[0].class_name : "All",
      selectedSubjectName: pro ? pro[0].subject_name : "All",
      selectedSubjectId: pro ? pro[0].subject_id : "",
      selectedBatchName: pro ? pro[0].batch_name : "All",
      selectedBatchId: pro ? pro[0].batch_id : "",
      classesList: [],
      subjectList: [],
      batches: [],
      completedStatus: "",
      submissionOpenStatus: "",
      instituteId: 0,
    }
  }

  componentWillReceiveProps(nextProps) {

    let id = localStorage.getItem("instituteid");

    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        // localStorage.removeItem("instituteid")
        // this.setState({instituteId:nextProps.instituteId},()=>{
        //   table.fnDraw()
        // });
        this.props.history.push("/app/dashboard");
      }
    }
  }

  componentDidMount() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.setState({ instituteId: this.props.instituteId })
    if (pro) {
      this.setState({
        selectedClassId: pro[0].class_id,
        selectedClassName: pro[0].class_name,
        selectedSubjectName: pro[0].subject_name,
        selectedSubjectId: pro[0].subject_id,
        selectedBatchName: pro[0].batch_name,
        selectedBatchId: pro[0].batch_id
      })
    }
    this.initQuizTable();
    this.getClassesOfStudent();
  }

  getClassesOfStudent() {
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getStudentClasses(data).then(() => {
      let resclasses = this.props.studentClasses;

      if (resclasses && resclasses.status == 200) {
        this.setState({ classesList: resclasses.data.response.classesList }, () => {
          if (this.state.selectedClassId) {
            let apiData = {
              payload: {
                "class_id": this.state.selectedClassId,
              },
              institute_id: this.props.instituteId,
              branch_id: this.props.branchId,
              token: this.props.token
            }
            this.props.getStudentSubjects(apiData).then(() => {
              let resstudentsub = this.props.studentSubjects

              if (resstudentsub && resstudentsub.status == 200) {
                this.setState({ subjectList: resstudentsub.data.response.subjectList })
              }
            })
          }
          if (this.state.selectedSubjectId) {
            let apiData = {
              payload: {
                "subject_id": this.state.selectedSubjectId,
              },
              institute_id: this.props.instituteId,
              branch_id: this.props.branchId,
              token: this.props.token
            }
            this.props.getStudentBatch(apiData).then(() => {
              let resstudentbat = this.props.studentBatches;
              if (resstudentbat) {
                this.setState({
                  batches: resstudentbat.subjectList
                })
              }
            })
          }
        })
      }
    })
  }


  initQuizTable() {

    table = $("#quizs")
      .dataTable({
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
        serverSide: true,
        "columnDefs": [{
          "targets": -1,
          "data": null,
          "defaultContent": `<button class="link--btn" id="view">View Detail</button>
                             `
        }, { orderable: false, targets: [3, 6, 7] },
        {
          targets: [5],
          "render": (data, type, row) => {

            let rowhtml;
            let className = this.getClassForStatus(row[5]);
            return rowhtml = `<span class="${className}" id="status"  >${row[5]}</span>`;
          }
        },
        {
          targets: [2, 6],
          className: 'c-bold'
        },

        ],
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
    $('#quizs tbody').on('click', '#view', function () {


      var data = table.api().row($(this).parents('tr')).data();

      _.onChangeQuizDetail(data[7]);
    });
  }

  getClassForStatus(data) {
    let css;
    switch (data) {
      case 'Unsubmitted': {
        css = "unsubmitted"
        break;
      }
      case 'Completed': {
        css = "c-state"
        break;
      }
    }
    return css;

  }

  callNewDataList(data, callback, settings) {
    let order_column
    if (data.order[0].column === 0) {
      order_column = "end_date"
    }
    else if (data.order[0].column === 1) {
      order_column = "topic"
    }
    else if (data.order[0].column === 2) {
      order_column = "title"
    }
    else if (data.order[0].column === 3) {
      order_column = "folder_name"
    }
    else if (data.order[0].column === 4) {
      order_column = "end_date"
    }
    else if (data.order[0].column === 5) {
      order_column = "status"
    }
    else if (data.order[0].column === 6) {
      order_column = "marks"
    }

    let order_type;
    if (data.order[0].dir === "asc") {
      order_type = 0;
    } else {
      order_type = 1;
    }

    const { searchText } = this.state;
    let apiData = {
      payload: {
        "searchText": searchText ? (searchText).trim() : '',
        "record_per_page": data.length,
        "page_number": data.start / data.length + 1,
        "order_column": order_column,
        "order_type": order_type,
        "class_id": this.state.selectedClassId,
        "subject_id": this.state.selectedSubjectId,
        "batch_id": this.state.selectedBatchId,
        "COMPLETED": this.state.completedStatus,
        "UNSUBMITTED": this.state.submissionOpenStatus
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    getStudentQuizList(apiData).then(res => {
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {

    if (res && res.status == 200 && res.data.response) {
      var columnData = [];

      this.setState({ count: res.data.response.totalCount })
      let QuizList = res.data.response.quizData;
      if (QuizList && QuizList.length > 0) {
        QuizList.map((data, index) => {
          var arr = [];
          arr[0] = moment(data.start_date).format("DD MMM YYYY");
          arr[1] = data.topic;
          arr[2] = data.title;
          arr[3] = data.folder_name;
          arr[4] = moment(data.end_date).format("DD MMM YYYY");
          arr[5] = data.status;
          arr[6] = data.marks + (data.total ? "/" + data.total : '');
          arr[7] = data;
          columnData.push(arr);
        })
      }

      callback({
        recordsTotal: this.state.count,
        recordsFiltered: this.state.count,
        data: columnData
      });
    }
  }

  onChangeQuizDetail(studentQuizList) {

    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: 'studentquiz-details',
      state: { data: studentQuizList, instituteId: this.props.instituteId, data1: pro ? pro : "" }
    })
  }

  onChangeSearchtext(event) {
    this.setState({ searchText: event.target.value }, () => {
      table.fnDraw();
    })
  }


  onChnageCompletedStatus() {
    let { completedStatus } = this.state;
    if (completedStatus == "COMPLETED") {
      completedStatus = "";
    }
    else {
      completedStatus = "COMPLETED"
    }
    this.setState({ completedStatus }, () => {
      table.fnDraw();
    })
  }

  onChnageSubmissionOpenStatus() {
    let { submissionOpenStatus } = this.state;
    if (submissionOpenStatus == "SUBMISSION_OPEN") {
      submissionOpenStatus = "";
    }
    else {
      submissionOpenStatus = "SUBMISSION_OPEN"
    }
    this.setState({ submissionOpenStatus }, () => {
      table.fnDraw();
    })
  }

  onChangeClass(cls) {
    if (cls == "All") {
      this.setState({
        selectedClassName: "All",
        selectedClassId: "",
        subjects: [],
        batches: [],
        selectedSubjectName: "All",
        selectedSubjectId: "",
        selectedBatchName: "All",
        selectedBatchId: "",
      }, () => {
        table.fnDraw();

      })
    } else {
      this.setState({
        selectedClassName: cls.class_name,
        selectedClassId: cls.class_id,
        selectedSubjectName: "All",
        selectedSubjectId: "",
        selectedBatchName: "All",
        selectedBatchId: ""
      }, () => {
        table.fnDraw();
        let apiData = {
          payload: {
            "class_id": this.state.selectedClassId,
          },
          institute_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token
        }

        this.props.getStudentSubjects(apiData).then(() => {
          let res = this.props.studentSubjects

          if (res && res.status == 200) {
            this.setState({ subjectList: res.data.response.subjectList })
          }
        })
      })
    }
  }

  onChangeSubject(sub) {
    if (sub == "All") {
      this.setState({
        selectedSubjectName: "All",
        selectedSubjectId: "",
        selectedBatchId: "",
        selectedBatchName: "All",
        batches: [],
        selectedFolderId: "",
        selectedFolderName: "All",
        folders: [],
      }, () => {
        table.fnDraw();

      })
    } else {
      this.setState({
        selectedSubjectName: sub.subject_name,
        selectedSubjectId: sub.subject_id,
        selectedBatchId: "",
        selectedBatchName: "All"
      }, () => {
        table.fnDraw();
        let apiData = {
          payload: {
            "subject_id": this.state.selectedSubjectId,
          },
          institute_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token
        }

        this.props.getStudentBatch(apiData).then(() => {
          let res = this.props.studentBatches;
          if (res) {
            this.setState({
              batches: res.subjectList

            })
          }
        })
      })
    }

  }

  onChangeBatch(batch) {
    if (batch == "All") {
      this.setState({ selectedBatchName: "All", selectedBatchId: "" }, () => { table.fnDraw(); })
    } else {
      this.setState({
        selectedBatchName: batch.batch_name,
        selectedBatchId: batch.batch_id,
      }, () => {
        table.fnDraw();
      })
    }
  }

  renderClassList() {
    let { classesList } = this.state;

    let ClassArr = [];
    ClassArr.push(
      <li key={"cls"}>
        <a className="dd-option" onClick={this.onChangeClass.bind(this, "All")}>{"All"}</a>
      </li>
    )
    if (this.state.classesList && this.state.classesList.length > 0) {
      classesList.map((cls, index) => {
        ClassArr.push(
          <li key={"cls" + index}>
            <a className="dd-option" onClick={this.onChangeClass.bind(this, cls)}>{cls.class_name}</a>
          </li>
        )
      })
    }
    return (ClassArr)

  }

  renderSubjectList() {
    let subjectArr = [];
    subjectArr.push(
      <li key={"sub"}><a onClick={this.onChangeSubject.bind(this, "All")} className="dd-option">All</a>
      </li>
    )
    let subjectList = this.state.subjectList;
    if (subjectList && subjectList.length > 0) {
      subjectList.map((data, index) => {
        subjectArr.push(<li key={"sub" + index}><a onClick={this.onChangeSubject.bind(this, data)} className="dd-option">{data.subject_name}</a></li>)
      })
    }

    return (subjectArr);
  }

  renderBatchList() {
    let batchArr = [];
    batchArr.push(
      <li key={"batch"}>
        <a onClick={this.onChangeBatch.bind(this, "All")}
          className="dd-option">All</a>
      </li>
    )
    let batchList = this.state.batches;
    if (batchList && batchList.length > 0) {
      batchList.map((data, index) => {
        batchArr.push(<li key={"batch" + index}><a onClick={this.onChangeBatch.bind(this, data)} className="dd-option">{data.batch_name}</a></li>)
      })
    }
    return batchArr;
  }

  render() {
    return (
      <div className="c-container clearfix">

        <div className="clearfix">
          <div className="divider-container nomargin">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Quiz</span>
            </div>
          </div>
        </div>

        <div className="divider-container">
          <div className="divider-block text--left">
            <div className="form-group cust-fld">
              <label>Search Quiz</label>
              <input type="search" className="form-control" value={this.state.searchText} onChange={this.onChangeSearchtext.bind(this)} placeholder="Quiz Title/Topic" />
            </div>
          </div>
          <div className="divider-block text--right"></div>
        </div>

        <div className="c-container__data no-round">
          <div className="c-inlineForm">
            <div className="inline--flexbox">
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Status</label>
                  <br />
                  <label htmlFor="check-1" className="custome-field field-checkbox">
                    <input type="checkbox" name="check-one" id="check-1" value="checkone" onChange={this.onChnageCompletedStatus.bind(this)} checked={this.state.completedStatus === "COMPLETED" ? true : false} />
                    <i></i> <span>Completed</span>
                  </label>
                  <br />
                  <label htmlFor="check-3" className="custome-field field-checkbox">
                    <input type="checkbox" name="check-one" id="check-3" value="checkone" onChange={this.onChnageSubmissionOpenStatus.bind(this)} checked={this.state.submissionOpenStatus === "SUBMISSION_OPEN" ? true : false} />
                    <i></i> <span>Unsubmitted</span>
                  </label>
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Class Name</label>
                  <div className="dropdown">
                    <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {(this.state.selectedClassName && this.state.selectedClassName.length > 18) ? this.state.selectedClassName.slice(0, 18) + ".." : this.state.selectedClassName}

                    </button>
                    <ul className="dropdown-menu" style={{ height: "150px", overflow: "auto" }} aria-labelledby="dLabel">
                      {this.renderClassList()}

                    </ul>
                  </div>
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Subject Name</label>
                  <div className="dropdown">
                    <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {(this.state.selectedSubjectName && this.state.selectedSubjectName.length > 18) ? this.state.selectedSubjectName.slice(0, 18) + ".." : this.state.selectedSubjectName}

                    </button>
                    <ul className="dropdown-menu" style={{ height: "150px", overflow: "auto" }} aria-labelledby="dLabel">
                      {this.renderSubjectList()}

                    </ul>
                  </div>
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Batch Name</label>
                  <div className="dropdown">
                    <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {(this.state.selectedBatchName && this.state.selectedBatchName.length > 18) ? this.state.selectedBatchName.slice(0, 18) + ".." : this.state.selectedBatchName}

                    </button>
                    <ul className="dropdown-menu" style={{ height: "150px", overflow: "auto" }} aria-labelledby="dLabel">
                      {this.renderBatchList()}

                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>


          <div className="card-container for--table">
            <div className="c-table">
              <table id="quizs" className="table data--table">
                <thead>
                  <tr>
                    <th style={{ width: "11%" }}>Date</th>
                    <th style={{ width: "14%" }}>Topic</th>
                    <th style={{ width: "18%" }}>Title</th>
                    <th style={{ width: "12%" }} className="nosort">Folder</th>
                    <th style={{ width: "12%" }}>Due Date</th>
                    <th style={{ width: "13%" }}>Status</th>
                    <th style={{ width: "10%" }}>Marks</th>
                    <th style={{ width: "11%" }} className="nosort">Action</th>
                  </tr>
                </thead>

              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, student }) => ({
  instituteId: app.institudeId,
  branchId: app.branchId,
  studentQuizList: student.studentQuizList,
  token: auth.token,
  studentClasses: student.studentClasses,
  studentSubjects: student.studentSubjects,
  studentBatches: student.studentBatches,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStudentQuizList,
      getStudentClasses,
      getStudentSubjects,
      getStudentBatch
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentQuizDirectory)        