import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getHomeworkDetails, getSubmissionList, downLoadHomeWorkFile,
  updateHomeWorkCheckingStatus, updateProfessorHomeworkDueDate, deleteBatchHomework, submitMarksOfStudents
} from '../../actions/professorActions';
import moment from 'moment';
import $ from "jquery";
// import fileDownload from 'js-file-download';
import DatePicker from 'react-datepicker';
import { DeleteModal } from '../common/deleteModal';
import { PdfViewModel } from '../common/professorModel/pdfViewModel';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { ToastContainer } from 'react-toastify';
let table = '0';

class HomeworkDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      batch_homework_id: null,
      homeworkDetails: [],
      submissionList: [],
      fileList: [],
      pro: {},
      isEdit: false,
      columndata: [],
      deleteObj: null,
      instituteId: 0,
      id: 0,
      sendDataToPdfViewModel: {}
    }
  }

  componentWillReceiveProps(nextProps) {

    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        // localStorage.removeItem("instituteid")
        // this.setState({instituteId:nextProps.instituteId},()=>{
        // const pro = this.props.location.state?this.props.location.state.data:"";
        // this.getClassesOfStudent();
        // table.fnDraw()
        this.props.history.push("/app/dashboard");
        // });
      }

    }
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId });
    this.initializeDatatable();
    const pro = this.props.location.state ? this.props.location.state.data : '';
    const datas = this.props.location.state ? this.props.location.state.pros : '';
    this.getHomeWork(pro);
  }

  getHomeWork(pro) {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "batch_homework_id": pro.batch_homework_id
      }
    }
    this.props.getHomeworkDetails(data).then(() => {

      let res = this.props.homeworkDetails;
      if (res && res.status == 200) {
        this.setState({ homeworkDetails: res.data.response ? res.data.response.batchHomeworkDetail[0] : '', fileList: res.data.response ? res.data.response.files : '', pro });
      }
    })
  }

  initializeDatatable() {

    table = $("#submissionList").dataTable({
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
        "defaultContent": `<button class="link--btn" >View Details</button>`
      }, { orderable: false, targets: [2, 4] },

      {
        targets: [2],
        "render": (data, type, row) => {

          let rowhtml;
          let className = this.getClassForStatus(row[2]);
          return rowhtml = `<span class="${className}" id="status"  >${row[2]}</span>`;
        }
      },
      {
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
    // $(".dataTables_info").css('margin-right', '200%');

    var _ = this;
    $('#submissionList tbody').on('click', 'button', function () {
      var data = table.api().row($(this).parents('tr')).data();

      if (data[2] == "checked" || data[2] == "Not checked") {
        _.onGotoHomeworkCheckingPage(data[4]);
      } else {
        infoToste("Homework is Not Submitted Yet");
      }
    });

  }

  saveMarks(value, index) {

    let { columndata } = this.state;
    // if (isNaN(Number(value))) { 
    //   infoToste("Please Enter Number")
    // }
    // else{
    if (columndata && columndata.length > 0) {
      if (columndata[index].total_marks == 0) {
        let id = columndata[index].student_homework_submission_id;
        let apiData = {
          payload: {
            student_homework_submission_id: id,
            marks: value
          },
          institute_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token
        }
        this.props.submitMarksOfStudents(apiData).then(() => {
          let res = this.props.sumittedMarks;

          if (res && res.data.status == 200) {
            table.fnDraw();
            // infoToste("Mark Submitted Successfully")

          } else if (res && res.data.status == 500) {
            infoToste("Something Went Wrong")
          }
        })

      }
      else {

        if (Number(columndata[index].total_marks) < value) {
          infoToste("Please Enter Marks Less Than Total")
        }
        else {

          let id = columndata[index].student_homework_submission_id;
          let apiData = {
            payload: {
              student_homework_submission_id: id,
              marks: value
            },
            institute_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token
          }
          this.props.submitMarksOfStudents(apiData).then(() => {
            let res = this.props.sumittedMarks;

            if (res && res.data.status == 200) {
              table.fnDraw();
              // infoToste("Mark Submitted Successfully")

            } else if (res && res.data.status == 500) {
              errorToste("Something Went Wrong")
            }
          })

        }
      }

    }
    // }
  }

  getClassForStatus(data) {
    let css;
    switch (data) {
      case 'Not Submitted': {
        css = ""
        break;
      }
      case 'Not checked': {
        css = "c-state st-orange"
        break;
      }
      case 'checked': {
        css = "c-state"
        break;
      }
    }
    return css;

  }

  callNewDataList(data, callback, settings) {
    const pro = this.props.location.state ? this.props.location.state.data : '';
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
        batch_homework_id: pro.batch_homework_id
      },
      instituteId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
    }
    getSubmissionList(apiData).then(res => {
      this.handleResponse(res, callback)
    });
  }

  isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  handleResponse(res, callback) {
    let self = this
    $(document).off().on('keypress', '.marks', function (evt) {
      return self.isNumberKey(evt)
    })
    $(document).on('change', '.marks', function (data) {
      self.saveMarks(data.target.value, data.target.id);
    });

    if (res && res.status == 200) {
      var columnData = [];

      this.setState({ count: res.data.response.total_count })
      let submissionList = res.data.response.studentSubmission;
      if (submissionList && submissionList.length > 0) {
        submissionList.map((data, index) => {
          var disabledval = true;
          let checkedval = false
          if (data.status == "checked") {
            disabledval = false
            checkedval = true
          }
          else if (data.status == "Not checked") {
            disabledval = false
          }
          var arr = []
          arr[0] = data.roll_no;
          arr[1] = data.firstname + " " + data.lastname;
          arr[2] = data.status;
          //  <input type='text' class="marks" id = `+index+` pattern="[0-9]" value =`+ data.marks +` style="width:40px !important; text-align:center;" disabled />
          arr[3] = disabledval == true ? `-` : checkedval == true ? `<input type='text' class="marks" id = ` + index + `   style="width:40px !important;text-align:center; border:1.5px solid #15BA27 !important;" value =` + data.marks + ` ></input>` : "<input type='text' class='marks' id = " + index + "  style=' width:40px !important;text-align:center; border:1.5px solid #FFCC01 !important;' value =" + data.marks + " ></input>"
          arr[4] = data;
          columnData.push(arr);

        })
      }
      this.setState({ columndata: submissionList });

      callback({
        recordsTotal: this.state.count,
        recordsFiltered: this.state.count,
        data: columnData
      });
    }
  }

  onGotoHomeworkCheckingPage(data) {
    let { homeworkDetails } = this.state;

    let studentData = {
      homework_id: homeworkDetails.homework_id,
      student_id: data.id,
      studentHomeworkSubmission_id: data.student_homework_submission_id,
      batch_homework_id: homeworkDetails.batch_homework_id,
      firstname: data.firstname,
      lastname: data.lastname,
      roll_no: data.roll_no,
      total_marks: data.total_marks,
      marks_obtained: data.marks,
      status: data.status,
      batch_id: homeworkDetails.batch_id,
      class_id: homeworkDetails.class_id,
      subject_id: homeworkDetails.subject_id,
      title: homeworkDetails.title
    }
    const pro = this.props.location.state ? this.props.location.state.data : '';
    this.props.history.push({
      pathname: 'homework-checking',
      state: { data: studentData, pros: pro }
    })
  }

  onGotoAllHomework() {
    const pro = this.props.location.state ? this.props.location.state.data : '';
    const datas = this.props.location.state ? this.props.location.state.pros : '';
    this.props.history.push({
      pathname: '/app/homework-directory',
      state: { data: pro.class_name ? pro : datas }
    })
  }

  downLoadFile(file, type) {
    // var sendData = {
    //   file: file,
    //   type: type
    // }
    // this.setState({sendDataToPdfViewModel:sendData})
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "homework_file_id": file.homework_file_id,
      }
    }
    this.props.downLoadHomeWorkFile(data).then(() => {
      let res = this.props.downloadFileData;

      if (res && res.data.status == 200) {
        let hwurl = res.data.response;
        var sendData = {
          file: file,
          pdfUrl: hwurl,
          type: type
        }
        this.setState({ sendDataToPdfViewModel: sendData })
      } else if (res && res.data.status == 500) {
        errorToste('Something Went Wrong')
      }
    })
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  onStatusChange() {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        home_work_id: this.state.pro.homework_id,
        batch_homework_id: this.state.pro.batch_homework_id,
      }
    }
    this.props.updateHomeWorkCheckingStatus(apiData).then(() => {
      let res = this.props.updateStatus;

      if (res && res.status == 200) {
        const pro = this.props.location.state ? this.props.location.state.data : '';
        const datas = this.props.location.state ? this.props.location.state.pros : '';
        this.props.history.push({
          pathname: '/app/homework-directory',
          state: { data: pro.class_name ? pro : datas }
        })
      }
    })
  }

  onChangeEdit() {
    let { isEdit } = this.state;
    isEdit = !isEdit;
    this.setState({ isEdit });
  }

  onEndDate(date) {

    let { homeworkDetails, isEdit } = this.state;
    this.updateDueDate(date, homeworkDetails);
    homeworkDetails.end_date = date;
    isEdit = !isEdit;
    this.setState({ homeworkDetails, isEdit });
  }

  onChangeEditHomework() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: `edit-homeworkDetail`,
      state: { data: pro }
    })
  }

  updateDueDate(date, homework) {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "end_date": date,
        "home_work_id": homework.homework_id,
        "batch_homework_id": homework.batch_homework_id
      }
    }

    this.props.updateProfessorHomeworkDueDate(apiData)
  }

  onDeleteModel(key, id) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, id })
  }

  onDeleteEntry(flag) {
    let { id } = this.state;
    if (flag == 'deletehomework') {
      this.onDeleteHomework(id);
      $("#quizSubmit .close").click();
    }
  }

  onDeleteHomework(id) {
    let data = {
      payload: {
        batch_homework_id: id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.deleteBatchHomework(data).then(() => {
      let res = this.props.batchHomeworkDelete;

      if (res && res.data.status == 200) {
        const pro = this.props.location.state ? this.props.location.state.data : '';
        const datas = this.props.location.state ? this.props.location.state.pros : '';
        this.props.history.push({
          pathname: '/app/homework-directory',
          state: { data: pro.class_name ? pro : datas }
        })
        successToste("Homework Deleted Successfully")
      }
      else if (res && res.data.status == 500) {
        errorToste("Something Went Wrong")
      }
    })
  }

  renderFileList() {
    let { fileList } = this.state;
    if (fileList && fileList.length > 0) {
      return fileList.map((file, index) => {
        return (
          <a key={"file" + index} className="linkbtn hover-pointer" ><i className="icon cg-pdf"></i>{file.file_name.slice(0, 15) + "..."}<button className="c-btn prime" data-toggle="modal" data-target="#pdfviewmodel" onClick={this.downLoadFile.bind(this, file, 'homework')}>View File</button></a>
        )
      })
    }
  }

  renderDueDate() {
    let { homeworkDetails } = this.state;

    if (!this.state.isEdit) {
      return (
        <div>
          <span className="info-type">{moment(homeworkDetails.end_date).format("DD MMM YYYY hh:mm a")}</span>
          <span className="link--btn pull-right linkbtn hover-pointer" onClick={this.onChangeEdit.bind(this)}>Extend End Date</span>
        </div>
      )
    } else {
      return (
        <DatePicker className="form-control fld--date" selected={homeworkDetails.end_date ? moment(homeworkDetails.end_date) : moment()} onChange={this.onEndDate.bind(this)} />
      )
    }
  }

  render() {
    const pro = this.props.location.state ? this.props.location.state.data : '';
    let endDate = new Date(this.state.homeworkDetails.end_date);
    let momentDate = new Date(moment());

    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a onClick={this.onGotoAllHomework.bind(this)} className="linkbtn hover-pointer">Back to All Homeworks</a>
              </div>
              <span className="c-heading-lg">{this.state.homeworkDetails.title} {pro.status == 'CHECKED' ? <span className="c-count st-colored lg">Completed</span> : <span className="c-count st-colored lg">Checking</span>}</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "deletehomework", pro.batch_homework_id)}>Delete HW</button>
              {((+endDate) >= (+momentDate)) ?

                <button className="c-btn grayshade btn" disabled={true} >Mark all submissions as checked</button>
                : <button className="c-btn prime" onClick={this.onStatusChange.bind(this)} >Mark all submissions as checked</button>}
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-3 col-sm-12 col-xs-12">
              <div className="block-title st-colored noborder">DETAILS</div>
              <span className="link--btn pull-right linkbtn hover-pointer" onClick={this.onChangeEditHomework.bind(this)}>View/Edit</span>
              <div className="clearfix margin25-bottom">
                <div className="form-group static-fld">
                  <label>Topic</label>
                  <span className="info-type">{this.state.homeworkDetails.topic}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Subject</label>
                  <span className="info-type">{this.state.homeworkDetails.subject_name}</span>
                </div>
                <div className="form-group static-fld clearfix">
                  <label>Folder</label>
                  <span className="info-type">{this.state.homeworkDetails.folder_name}</span>
                  {/* <button className="link--btn pull-right"><i className="icon cg-folder-o"></i>Open</button> */}
                </div>
                <div className="form-group static-fld">
                  <label>Batch</label>
                  <span className="info-type">{this.state.homeworkDetails.batch_name}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Date Assigned</label>
                  <span className="info-type">{moment(this.state.homeworkDetails.start_date).format("DD MMM YYYY hh:mm a")}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Due Date</label>
                  {this.renderDueDate()}
                  {/* <span className="info-type">{moment(this.state.homeworkDetails.end_date).format("DD MMM YYYY hh:mm a")}</span> */}
                </div>
              </div>
              <div className="clearfix btn--listing">
                <div className="block-title st-colored">Files</div>
                {this.renderFileList()}
              </div>
            </div>

            <div className="col-md-9 col-sm-12 col-xs-12">
              <div className="block-title st-colored noborder">SUBMISSIONS</div>
              <div className="c-container__data">
                <div className="card-container for--table">
                  <div className="c-table">
                    <table id="submissionList" className="table data--table">
                      <thead>
                        <tr>
                          <th style={{ width: "16%" }}>Roll No.</th>
                          <th style={{ width: "27%" }}>Name</th>
                          <th style={{ width: "18%" }}>Status</th>
                          <th style={{ width: "19%" }}>{this.state.homeworkDetails.total_marks && this.state.homeworkDetails.total_marks != 0 ? "Marks / " + this.state.homeworkDetails.total_marks : "Marks"}</th>
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
        <PdfViewModel sendDataToPdfViewModel={this.state.sendDataToPdfViewModel} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({
  homeworkDetails: professor.homeworkDetails,
  branchId: app.branchId,
  instituteId: app.institudeId,
  downloadFileData: professor.downloadFileData,
  updateStatus: professor.updateStatus,
  updateHomeworkDuedate: professor.updateHomeworkDuedate,
  token: auth.token,
  batchHomeworkDelete: professor.batchHomeworkDelete,
  sumittedMarks: professor.submittedMarksOfStudents
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getHomeworkDetails,
      downLoadHomeWorkFile,
      updateHomeWorkCheckingStatus,
      updateProfessorHomeworkDueDate,
      deleteBatchHomework,
      submitMarksOfStudents
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkDetails)