import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from "react-router-dom";
import moment from 'moment';
import {
  getQuizTableList, getClassesSubjectBatches, getProfessorSubjects,
  getProfessorBatch, getFolderNameList, getQuizEditDetail, updateQuizDetail, quizStatusChecking
} from '../../actions/professorActions';
import $ from "jquery";
import { EditQuizModal } from '../common/professorModel/editQuizModel';
import { ToastContainer, toast } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
let table = '0';

class QuizDirectory extends Component {

  constructor(props) {
    super(props);
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.state = {
      quizs: [],
      count: 0,
      searchText: "",
      completedStatus: "",
      submissionOpenStatus: "",
      selectedClassId: pro ? pro.class_id : "",
      selectedClassName: pro ? pro.class_name : "All",
      selectedSubjectName: pro ? pro.subject_name : "All",
      selectedSubjectId: pro ? pro.subject_id : "",
      selectedBatchName: pro ? pro.batch_name : "All",
      selectedBatchId: pro ? pro.batch_id : "",
      selectedFolderName: "All",
      selectedFolderId: "",
      classes: [],
      subjects: [],
      batches: [],
      folders: [],
      selectedQuiz: {},
      instituteId: 0
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
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.setState({ instituteId: this.props.instituteId });
    this.initClassList();
    this.updateQuizStatusChecking();
    this.initQuizTable();
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }

  updateQuizStatusChecking() {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.quizStatusChecking(data);
  }

  initClassList() {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getClassesSubjectBatches(data).then(() => {

      let res = this.props.classesSubjectsBatches;
      if (res && res.status === 200) {
        this.setState({ classes: res.data.response.classes }, () => {
          if (this.state.selectedClassId) {
            let apiData = {
              payload: {
                "class_id": this.state.selectedClassId,
              },
              institude_id: this.props.instituteId,
              branch_id: this.props.branchId,
              token: this.props.token
            }
            this.props.getProfessorSubjects(apiData).then(() => {
              let res = this.props.professorSubjects;
              if (res && res.status == 200) {
                this.setState({ subjects: res.data.response.subjects })
              }
            })
          }
          if (this.state.selectedSubjectId) {
            let apiData = {
              payload: {
                "subject_id": this.state.selectedSubjectId,
              },
              institude_id: this.props.instituteId,
              branch_id: this.props.branchId,
              token: this.props.token,
            }
            let Data = {
              institude_id: this.props.instituteId,
              branch_id: this.props.branchId,
              token: this.props.token,
              payload: { subject_id: this.state.selectedSubjectId }

            }

            this.props.getFolderNameList(Data).then(() => {
              let res = this.props.folderList;

              if (res && res.status == 200) {
                this.setState({ folders: res.data.response });
              }
            })

            this.props.getProfessorBatch(apiData).then(() => {
              let res = this.props.professorBatches;

              if (res) {
                this.setState({ batches: res.batches })
              }
            })

          }
        });
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
          "defaultContent": `<button class="link--btn" id="view">View Details</button>`
        },
        { orderable: false, targets: [4, 6] },
        {
          targets: [5],
          "render": (data, type, row) => {

            let rowhtml;
            let className = this.getClassForStatus(row[5]);
            return rowhtml = `<span class="${className}" id="status"  >${row[5]}</span>`;
          }
        },
        {
          targets: [2],
          className: 'c-bold'
        }
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

      _.onChangeQuizDetail(data[6]);
    });
  }

  getClassForStatus(data) {
    let css;
    switch (data) {
      case 'Submission_open': {
        css = ""
        break;
      }
      case 'Inactive': {
        css = "c-state st-orange"
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
      order_column = "subject_name"
    }
    else if (data.order[0].column === 4) {
      order_column = "folder_name"
    }
    else if (data.order[0].column === 5) {
      order_column = "status"
    }

    let order_type;
    if (data.order[0].dir === "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }

    const { searchText } = this.state;
    let apiData = {
      payload: {
        "searchText": searchText ? (searchText).trim() : '',
        "record_per_page": data.length,
        "page_number": data.start / data.length + 1,
        "COMPLETED": this.state.completedStatus,
        "SUBMISSION_OPEN": this.state.submissionOpenStatus,
        "order_column": order_column,
        "order_type": order_type,
        "class_id": this.state.selectedClassId,
        "subject_id": this.state.selectedSubjectId,
        "batch_id": this.state.selectedBatchId,
        "subject_folder_id": this.state.selectedFolderId,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }

    getQuizTableList(apiData).then(res => {
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {

    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
      this.setState({ count: res.data.response.totalCount })
      let QuizList = res.data.response.quizDetail;
      if (QuizList && QuizList.length > 0) {
        QuizList.map((data, index) => {
          let status = this.titleCase(data.status.replace("_", " "));
          var arr = [];
          let batch = data.subject_name + ">" + data.batch_name;
          arr[0] = moment(data.end_date).format("DD MMM YYYY");
          arr[1] = data.topic;
          arr[2] = data.title;
          arr[3] = batch;
          arr[4] = data.folder_name;
          arr[5] = status;
          arr[6] = data,
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



  onChangeQuizDetail(quiz) {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: `quiz-detail`,
      state: { data: quiz, data1: pro }
    })
  }

  onChangeSearchText(event) {
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
        selectedFolderId: "",
        selectedFolderName: "All",
        folders: [],
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
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
        }
        this.props.getProfessorSubjects(apiData).then(() => {
          let res = this.props.professorSubjects;
          if (res && res.status == 200) {
            this.setState({ subjects: res.data.response.subjects })
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
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
        }
        let Data = {
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
          payload: { subject_id: this.state.selectedSubjectId },

        }

        this.props.getFolderNameList(Data).then(() => {
          let res = this.props.folderList;

          if (res && res.status == 200) {
            this.setState({ folders: res.data.response });
          }
        })
        this.props.getProfessorBatch(apiData).then(() => {
          let res = this.props.professorBatches;


          this.setState({ batches: res.batches })
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

  onChangeFolder(folder) {
    if (folder == "All") {
      this.setState({ selectedFolderId: "", selectedFolderName: "All" }, () => { table.fnDraw(); })
    } else {
      this.setState({
        selectedFolderName: folder.folder_name,
        selectedFolderId: folder.subject_folder_id,
      }, () => {
        table.fnDraw();
      })
    }
  }



  addNewQuiz() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    let quizs = []
    this.props.history.push({
      pathname: 'assign-newquiz',
      state: { data: pro }
    })
  }

  goToDashbordDetail() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({ pathname: '/app/professor-batchDetaildashboard', state: { data: pro.batch_id } })
  }

  renderClassList() {
    let { classes } = this.state;
    let ClassArr = [];
    ClassArr.push(
      <li key={"cls"}>
        <a className="dd-option" onClick={this.onChangeClass.bind(this, "All")}>{"All"}</a>
      </li>
    )
    if (this.state.classes && this.state.classes.length > 0) {
      classes.map((cls, index) => {
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
    let res = this.props.professorSubjects;
    subjectArr.push(<li key={"sub"}><a onClick={this.onChangeSubject.bind(this, "All")} className="dd-option">All</a></li>)
    let subjectList = this.state.subjects;
    if (subjectList && subjectList.length > 0) {
      subjectList.map((data, index) => {
        subjectArr.push(<li key={"sub" + index}><a onClick={this.onChangeSubject.bind(this, data)} className="dd-option">{data.subject_name}</a></li>)
      })
    }

    return (subjectArr);
  }

  renderBatchList() {
    let batchArr = [];
    batchArr.push(<li key={"batch"}><a onClick={this.onChangeBatch.bind(this, "All")} className="dd-option">All</a></li>)
    let batchList = this.state.batches;
    if (batchList && batchList.length > 0) {
      batchList.map((data, index) => {
        batchArr.push(<li key={"batch" + index}><a onClick={this.onChangeBatch.bind(this, data)} className="dd-option">{data.batch_name}</a></li>)
      })
    }
    return (batchArr)
  }

  renderFolderName() {
    let folderArr = [];
    folderArr.push(<li key={"folder"}><a onClick={this.onChangeFolder.bind(this, "All")} className="dd-option">All</a></li>)
    let folderList = this.state.folders;
    if (folderList && folderList.length > 0) {
      folderList.map((data, index) => {
        folderArr.push(<li key={"folder" + index}><a onClick={this.onChangeFolder.bind(this, data)} className="dd-option">{data.folder_name}</a></li>)
      })
    }
    return (folderArr)
  }

  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container nomargin">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Professor</span>
              <div className="c-brdcrum">
                <a onClick={this.goToDashbordDetail.bind(this)} className="linkbtn hover-pointer">Back to Dashbord Detail</a>
              </div>
              <span className="c-heading-lg">Quiz</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" onClick={this.addNewQuiz.bind(this)}>Add New Quiz</button>
            </div>
          </div>
        </div>
        <div className="divider-container">
          <div className="divider-block text--left">
            <div className="form-group cust-fld">
              <label>Search Quiz</label>
              <input type="search" className="form-control" value={this.state.searchText} onChange={this.onChangeSearchText.bind(this)} placeholder="Quiz Title/Topic" />
            </div>
          </div>
          <div className="divider-block text--right"></div>
        </div>
        <div className="c-container__data no-round">
          <div className="c-inlineForm">
            <div className="inline--flexbox">
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Status</label><br />
                  <label htmlFor="check-1" className="custome-field field-checkbox">
                    <input type="checkbox" name="check-one" id="check-1" value="checkone" onChange={this.onChnageCompletedStatus.bind(this)} checked={this.state.completedStatus === "COMPLETED" ? true : false} />
                    <i></i> <span>Completed</span>
                  </label><br />
                  <label htmlFor="check-3" className="custome-field field-checkbox">
                    <input type="checkbox" name="check-one" id="check-3" value="checkone" onChange={this.onChnageSubmissionOpenStatus.bind(this)} checked={this.state.submissionOpenStatus === "SUBMISSION_OPEN" ? true : false} />
                    <i></i> <span>Submissions Open</span>
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
                    <ul className="dropdown-menu" aria-labelledby="dLabel" style={{ height: "150px", overflow: "auto" }}>
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
                    <ul className="dropdown-menu" aria-labelledby="dLabel" style={{ height: "150px", overflow: "auto" }}>
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
                    <ul className="dropdown-menu" aria-labelledby="dLabel" style={{ height: "150px", overflow: "auto" }}>
                      {this.renderBatchList()}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Folder</label>
                  <div className="dropdown">
                    <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {(this.state.selectedFolderName && this.state.selectedFolderName.length > 18) ? this.state.selectedFolderName.slice(0, 18) + ".." : this.state.selectedFolderName}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dLabel">
                      {this.renderFolderName()}
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
                    <th style={{ width: "13%" }}>Date</th>
                    <th style={{ width: "14%" }}>Topic</th>
                    <th style={{ width: "17%" }}>Title</th>
                    <th style={{ width: "20%" }}>Batch</th>
                    <th style={{ width: "12%" }} className="nosort">Folder</th>
                    <th style={{ width: "15%" }}>Status</th>
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

const mapStateToProps = ({ app, professor, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  professorId: professor.professorId,
  classesSubjectsBatches: professor.classesSubjectsBatches,
  professorSubjects: professor.professorSubjects,
  professorBatches: professor.professorBatches,
  folderList: professor.folderList,
  quizData: professor.quizData,
  editquiz: professor.editquiz,
  token: auth.token,
  quizStatusCheckingProfessor: professor.quizStatusCheckingProfessor
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getClassesSubjectBatches,
      getProfessorSubjects,
      getProfessorBatch,
      getFolderNameList,
      getQuizEditDetail,
      updateQuizDetail,
      quizStatusChecking
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(QuizDirectory)     