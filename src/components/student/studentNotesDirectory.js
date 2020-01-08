import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStudentNoteList, getStudentClasses, getStudentSubjects, getStudentBatch } from '../../actions/studentAction';
import moment from 'moment';
import $ from "jquery";
var dt = require('datatables.net')
let table = '0';

class StudentNotesDirectory extends Component {
  constructor(props) {
    super(props);
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.state = {
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
      instituteId: 0,
    }
  }

  componentWillReceiveProps(nextProps) {

    let id = localStorage.getItem("instituteid");

    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        localStorage.removeItem("instituteid")
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
    this.initNotesTable();
    this.getClassesOfStudent();
  }

  getClassesOfStudent() {
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getStudentClasses(data).then(() => {
      let res = this.props.studentClasses;

      if (res && res.status == 200) {
        this.setState({ classesList: res.data.response.classesList }, () => {
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
              let resstudentsubjects = this.props.studentSubjects

              if (resstudentsubjects && resstudentsubjects.status == 200) {
                this.setState({ subjectList: resstudentsubjects.data.response.subjectList })
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
              let resstudentbatches = this.props.studentBatches;
              if (resstudentbatches) {
                this.setState({
                  batches: resstudentbatches.subjectList
                })
              }
            })
          }
        })
      }
    })
  }

  initNotesTable() {

    table = $("#notesTable")
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
          "defaultContent": `<button class="link--btn">View Details</button>`
        }, { orderable: false, targets: [3, 4] },
        {
          targets: [2],
          className: 'c-bold'
        }],
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
    $('#notesTable tbody').on('click', 'button', function () {

      var data = table.api().row($(this).parents('tr')).data();

      _.onChangeNotesDetail(data[4]);
    });
  }

  callNewDataList(data, callback, settings) {
    let order_column
    if (data.order[0].column === 0) {
      order_column = "share_date"
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

    let order_type;
    if (data.order[0].dir === "asc") {
      order_type = 0;
    } else {
      order_type = 1;
    }

    const { searchText } = this.state;
    let apiData = {
      payload: {
        searchText: searchText ? (searchText).trim() : '',
        record_per_page: data.length,
        page_number: data.start / data.length + 1,
        order_column: order_column,
        order_type: order_type,
        class_id: this.state.selectedClassId,
        subject_id: this.state.selectedSubjectId,
        batch_id: this.state.selectedBatchId,
        subject_folder_id: ""
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    getStudentNoteList(apiData).then(res => {

      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {
    if (res && res.status == 200 && res.data.response) {
      var columnData = [];

      this.setState({ count: res.data.response.totalCount })
      let notesList = res.data.response.notesDetails;
      if (notesList && notesList.length > 0) {
        notesList.map((data, index) => {
          var arr = [];
          arr[0] = moment(data.share_date).format("DD MMM YYYY");
          arr[1] = data.topic;
          arr[2] = data.title;
          arr[3] = data.folder_name;
          arr[4] = data;
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

  onChangeNotesDetail(notes) {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: 'studentnotes-details',
      state: { data: notes, instituteId: this.props.instituteId, data1: pro }
    })
  }

  onChangeSearchText(event) {
    this.setState({ searchText: event.target.value }, () => {
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
              <span className="c-heading-sm">Student</span>
              <span className="c-heading-lg">Notes</span>
            </div>

          </div>
        </div>

        <div className="divider-container">
          <div className="divider-block text--left">
            <div className="form-group cust-fld">
              <label>Search Notes</label>
              <input type="search" value={this.state.searchText} onChange={this.onChangeSearchText.bind(this)} className="form-control" placeholder="Notes Title/Topic" />
            </div>
          </div>
          <div className="divider-block text--right"></div>
        </div>

        <div className="c-container__data no-round">
          <div className="c-inlineForm">
            <div className="inline--flexbox">
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
              <table id="notesTable" className="table data--table">
                <thead>
                  <tr>
                    <th style={{ width: "13%" }}>Date</th>
                    <th style={{ width: "25%" }}>Topic</th>
                    <th style={{ width: "27%" }}>Title</th>
                    <th style={{ width: "20%" }} className="nosort">Folder</th>
                    <th style={{ width: "15%" }} className="nosort">Action</th>
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
  token: auth.token,
  studentClasses: student.studentClasses,
  studentSubjects: student.studentSubjects,
  studentBatches: student.studentBatches,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStudentNoteList,
      getStudentClasses,
      getStudentSubjects,
      getStudentBatch
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentNotesDirectory)      