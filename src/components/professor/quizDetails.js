import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getQuizDetails, getQuizeSubmissionList, updateProfessorQuizDueDate,
  updateQuizDetail, getQuizEditDetail, updateQuizCheckingStatus, deleteBatchQuiz
} from '../../actions/professorActions';
import $ from "jquery";
import fileDownload from 'js-file-download';
import { EditQuizModal } from '../common/professorModel/editQuizModel';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { DeleteModal } from '../common/deleteModal';
import { infoToste, errorToste, successToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
let table = '0';

class QuizDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchQuizDetail: {
        batch_name: "",
        class_name: "",
        folder_name: "",
        subject_name: "",
        topic: "",
        title: "",
        start_date: moment(),
        end_date: '',
        pro: {},
      },
      fileList: [],
      isEdit: false,
      submissionList: [],
      selectedQuiz: {},
      deleteObj: null,
      id: 0,
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
    const pro = this.props.location.state ? this.props.location.state.data : '';
    const pro1 = this.props.location.state ? this.props.location.state.data1 : '';
    this.setState({ instituteId: this.props.instituteId });
    this.getQuizDetai(pro);
  }

  initializeDatatable() {

    table = $("#quizSubmissions").dataTable({
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
        "defaultContent": `<button class="link--btn">View Details</button>`
      }, { orderable: false, targets: [2, 4] },
      {
        targets: [2],
        "render": (data, type, row) => {

          let rowhtml;
          let className = this.getClassForStatus(row[2]);
          return rowhtml = `<span class="${className}" id="status"  >${row[2]}</span>`;
        }
      }, {
        targets: [1, 3],
        className: 'c-bold'
      },
      ],
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

    var _ = this;
    $('#quizSubmissions tbody').on('click', 'button', function () {
      var data = table.api().row($(this).parents('tr')).data();
      if (data[2] == 'Submitted') {
        _.onGotoQuizPreviewPage(data[4]);
      }
      else {
        infoToste("Quiz is Not Submitted Yet");
      }
    });

  }

  getClassForStatus(data) {
    let css;
    switch (data) {
      case 'Not Submitted': {
        css = ""
        break;
      }
      case 'Submitted': {
        css = "c-state"
        break;
      }
    }
    return css;

  }

  callNewDataList(data, callback, settings) {

    const pro = this.props.location.state.data;
    let order_column
    if (data.order[0].column == 0) {
      order_column = "roll_no"
    }
    else if (data.order[0].column == 1) {
      order_column = "firstname"
    }
    else if (data.order[0].column == 2) {
      order_column = "status"
    }
    else if (data.order[0].column == 3) {
      order_column = "marks"
    }

    let order_type;
    if (data.order[0].dir == "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }

    let apiData = {
      payload: {
        record_per_page: data.length,
        page_number: data.start / data.length + 1,
        order_column: order_column,
        order_type: order_type,
        batch_quiz_id: pro.batch_quiz_id,
        batch_id: this.state.batchQuizDetail.batch_id,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }

    getQuizeSubmissionList(apiData).then(res => {
      this.handleResponse(res, callback)
    });
  }

  handleResponse(res, callback) {

    if (res && res.status == 200) {
      var columnData = [];

      this.setState({ count: res.data.response.totalCount })
      let submissionList = res.data.response.studentSubmission;

      if (submissionList && submissionList.length > 0) {
        submissionList.map((data, index) => {
          var arr = []
          arr[0] = data.roll_no;
          arr[1] = data.firstname + " " + data.lastname;
          arr[2] = data.status;
          arr[3] = data.marks + (data.total ? "/" + data.total : '');;
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

  onGotoQuizPreviewPage(submissionList) {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : '';
    let { batchQuizDetail } = this.state;
    if (batchQuizDetail.quiz_type == "upload_pdf") {
      this.props.history.push({
        pathname: 'professor-uploadTypepdf',
        state: { data: batchQuizDetail, dataOfTable: submissionList, batchDetail: pro1 }
      })
    }
    else {
      this.props.history.push({
        pathname: 'professor-questiontyperesult',
        state: { data: batchQuizDetail, dataOfTable: submissionList, batchDetail: pro1 }

      })

    }

  }

  getQuizDetai(pro) {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        batch_quiz_id: pro.batch_quiz_id,
      }

    }
    this.props.getQuizDetails(apiData).then(() => {
      let res = this.props.quizDetail;

      if (res && res.status == 200) {
        this.setState({
          batchQuizDetail: res.data.response.batchQuizDetail[0],
          fileList: res.data.response.files,
        }, () => {
          this.initializeDatatable();
        })
      }
    })

  }

  onChanageDashBoardPage() {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : '';
    this.props.history.push({
      pathname: '/app/quiz-directory',
      state: { data: pro1 }
    });
  }

  onChangeEdit() {
    let { isEdit } = this.state;
    isEdit = !isEdit;
    this.setState({ isEdit });
  }

  onEndDate(date) {
    let { batchQuizDetail, isEdit } = this.state;
    this.updateDueDate(date, batchQuizDetail.batch_quiz_id);
    batchQuizDetail.end_date = date;
    isEdit = !isEdit;
    this.setState({ batchQuizDetail, isEdit });
  }

  onEditQuizPage() {
    $("#editQuiz .close").click();
    let { batchQuizDetail } = this.state;
    const pro1 = this.props.location.state ? this.props.location.state.data1 : '';
    if (batchQuizDetail.quiz_type === "upload_pdf") {
      this.props.history.push({
        pathname: `edit-uploadtypequiz`,
        state: { data: batchQuizDetail, pro1: pro1 }
      })
    }
    else {
      this.props.history.push({
        pathname: '/app/edit-quizquestionanswer',
        state: { data: batchQuizDetail, pro1: pro1 }
      })
    }
  }

  updateDueDate(date, batch_quiz_id) {

    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        batch_quiz_id: batch_quiz_id,
        "end_date": date
      }
    }
    this.props.updateProfessorQuizDueDate(apiData);
  }

  onSetQuizDetail() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        quiz_id: pro.quiz_id,
      }
    }

    this.props.getQuizEditDetail(apiData).then(() => {
      let res = this.props.quizData;

      if (res && res.status == 200) {

        this.setState({ selectedQuiz: res.data.response });
      }
    })
  }

  onDeleteModel(key, id) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, id })
  }

  onDeleteEntry(flag) {
    let { id } = this.state;
    if (flag == 'deletequiz') {
      this.onDeleteQuiz(id);
      $("#quizSubmit .close").click();
    }
  }

  onDeleteQuiz(id) {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : '';
    let data = {
      payload: {
        batch_quiz_id: id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.deleteBatchQuiz(data).then(() => {
      let res = this.props.batchDeleteQuiz;
      if (res && res.data.status == 200) {
        this.props.history.push({
          pathname: '/app/quiz-directory',
          state: { data: pro1 }
        });
        successToste("Quiz Deleted Successfully")
      }
      else if (res && res.data.status == 500) {
        errorToste("Something Went Wrong")
      }
    })
  }

  renderFileList() {
    let { fileList } = this.state;
    if (fileList && fileList.length == 0) return;
    else if (fileList && fileList.length > 0) {
      return fileList.map((file, index) => {
        return (
          <a key={"file" + index} className="linkbtn hover-pointer" ><i className="icon cg-pdf"></i>{file.file_name}</a>
        )
      })
    }
  }

  renderDueDateEdit() {
    let { batchQuizDetail } = this.state;
    if (!this.state.isEdit) {
      return (
        <div>
          <span className="info-type">{moment(batchQuizDetail.end_date).format("DD MMM YYYY hh:mm a")}</span>
          <span className="link--btn pull-right linkbtn hover-pointer" onClick={this.onChangeEdit.bind(this)}>Extend End Date</span>
        </div>
      )
    } else {
      return (
        <DatePicker className="form-control fld--date" selected={batchQuizDetail.end_date ? moment(batchQuizDetail.end_date) : moment()} onChange={this.onEndDate.bind(this)} />
      )
    }
  }

  render() {
    let { batchQuizDetail } = this.state;
    const pro = this.props.location.state ? this.props.location.state.data : '';
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.onChanageDashBoardPage.bind(this)} >Back to All Quizes</a>
              </div>
              <span className="c-heading-sm">Professor</span>
              <span className="c-heading-lg">{batchQuizDetail.title ? batchQuizDetail.title : ""}</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "deletequiz", pro.batch_quiz_id)}>Delete Quiz</button>
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-3 col-sm-12 col-xs-12">
              <div className="block-title st-colored noborder">DETAILS</div>
              <span className="link--btn pull-right linkbtn hover-pointer"><button className="link--btn" id="edit" data-toggle="modal" data-target="#editQuiz" onClick={this.onSetQuizDetail.bind(this)} >View/Edit</button></span>
              <div className="clearfix margin25-bottom">
                <div className="form-group static-fld">
                  <label>Topic</label>
                  <span className="info-type">{batchQuizDetail.topic ? batchQuizDetail.topic : ""}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Subject</label>
                  <span className="info-type">{batchQuizDetail.subject_name ? batchQuizDetail.subject_name : ""}</span>
                </div>
                <div className="form-group static-fld clearfix">
                  <label>Folder</label>
                  <span className="info-type">{batchQuizDetail.folder_name ? batchQuizDetail.folder_name : ""}</span>
                  {/* <button className="link--btn pull-right"><i className="icon cg-folder-o"></i>Open</button> */}
                </div>
                <div className="form-group static-fld">
                  <label>Batch</label>
                  <span className="info-type">{batchQuizDetail.batch_name ? batchQuizDetail.batch_name : ""}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Class</label>
                  <span className="info-type">{batchQuizDetail.class_name ? batchQuizDetail.class_name : ""}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Date Assigned</label>
                  <span className="info-type">{moment(batchQuizDetail.start_date).format("DD MMM YYYY hh:mm a")}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Due Date</label>
                  {this.renderDueDateEdit()}
                </div>
              </div>
              {(this.state.fileList && this.state.fileList.length != 0) ?
                <div className="clearfix btn--listing">
                  <div className="block-title st-colored">Files</div>
                  {this.renderFileList()}
                </div> : ""}
            </div>
            <div className="col-md-9 col-sm-12 col-xs-12">
              <div className="block-title st-colored noborder">SUBMISSIONS</div>
              <div className="c-container__data">
                <div className="card-container for--table">
                  <div className="c-table">
                    <table className="table data--table" id="quizSubmissions">
                      <thead>
                        <tr>
                          <th style={{ width: "16%" }}>Roll No.</th>
                          <th style={{ width: "27%" }}>Name</th>
                          <th style={{ width: "18%" }}>Status</th>
                          <th style={{ width: "19%" }}>Marks</th>
                          <th style={{ width: "20%" }} className="nosort">Action</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
        <EditQuizModal quiz={this.state.selectedQuiz} onEditQuestionPage={this.onEditQuizPage.bind(this)} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  professorId: professor.professorId,
  quizDetail: professor.quizDetail,
  updateQuizDate: professor.updateQuizDate,
  updateQuizCheckingstatus: professor.updateQuizCheckingstatus,
  token: auth.token,
  editquizdetail: professor.editquizdetail,
  quizData: professor.quizData,
  batchDeleteQuiz: professor.batchDeleteQuiz
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getQuizDetails,
      updateProfessorQuizDueDate,
      updateQuizCheckingStatus,
      getQuizEditDetail,
      updateQuizDetail,
      deleteBatchQuiz,

    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetails)