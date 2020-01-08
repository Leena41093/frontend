import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import URLSearchParams from "url-search-params";
import Viewer from './viewer';
import { downloadNotesFile, downLoadHomeWorkFile, downloadQuizFile, downLoadStudentHomeWorkSubmissionFile, } from '../../../actions/professorActions';
import { downloadPersonalDriveFiles } from '../../../actions/professorDriveAction';
import { getStudentHomeworkDetails, downloadStudentHomeworkFile, downloadStudentQuizFileFromMobile, downloadStudentNotesFile, downloadStudentHomeworkDrivefile, } from '../../../actions/studentAction';
const mainUrl = window.location.search.replace("?", "?&");

const searchParams = new URLSearchParams(mainUrl);
class ViewerContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: [],
      pdfData: null,
      readonly: searchParams.get("readonly") ? true : false,
      renderMarker: false,
      showTip: false,
    }

    this.getFileData = this.getFileData.bind(this);
  }

  componentWillMount() {
    this.getFileData();
  }

  getPayLoad() {
    let type = searchParams.get("type");
    let id = searchParams.get("id");
    let homework_id = searchParams.get("homework_id");
    let batch_homework_id = searchParams.get("batch_homework_id");
    let batch_id = searchParams.get("batch_id");
    let batch_quiz_id = searchParams.get("batch_quiz_id");
    let quiz_id = searchParams.get("quiz_id");
    let my_drive_files_id = searchParams.get("my_drive_files_id");

    if (type == "notes") {
      return { [type + "_file_id"]: id };
    } else if (type == 'quiz') {
      return { "quiz_files_id": id };
    } else if (type == 'homework') {
      return { "homework_file_id": id };
    } else if (type == "homeworkSubmission") {
      return { "Student_home_work_submission_file_id": id };
    } else if (type == "studentHomework") {
      return { "homework_file_id": id };
    } else if (type == "studentHomewokSubmission") {
      return {
        "homework_id": homework_id,
        "batch_homework_id": batch_homework_id,
        "batch_id": batch_id,
      };
    } else if (type == "studentQuiz") {
      return {
        "batch_quiz_id": batch_quiz_id,
        "quiz_id": quiz_id
      };
    } else if (type == "studentNotes") {
      return {
        "notes_file_id": id
      };
    } else if (type == "drive") {
      return {
        "my_drive_files_id": my_drive_files_id
      }
    } else if (type == "studentdriveHomework") {
      return {
        "homework_file_id": id
      }

    } else {
      return {};
    }
  }

  getResponse() {
    let type = searchParams.get("type");
    if (type == 'notes') {
      return this.props.notesFiledata;
    } else if (type == 'quiz') {
      return this.props.quizFileData;
    } else if (type == 'homework') {
      return this.props.downloadFileData
    } else if (type == "homeworkSubmission") {
      return this.props.studentSubmissionFile;
    } else if (type == "studentHomework") {
      return this.props.studentDownloadFileData;
    } else if (type == "studentHomewokSubmission") {
      let resData = {
        message: "success",
        status: 200,
        "data": {
          message: "success",
          "response": this.props.studentHomeworkDetails.data.response.studentSubmission,
          status: 200
        }
      }
      return resData;
    } else if (type == "studentQuiz") {
      return this.props.studentQuizfileData;
    } else if (type == "studentNotes") {
      return this.props.notesData;
    } else if (type == "drive") {
      return this.props.personalDriveFileDownload;
    } else if (type == "studentdriveHomework") {
      return this.props.downloadStudentHWDriveFile;
    }
  }

  getDownloadFunction() {
    let type = searchParams.get("type");
    if (type == 'notes') {
      return this.props.downloadNotesFile;
    } else if (type == 'quiz') {
      return this.props.downloadQuizFile;
    } else if (type == 'homework') {
      return this.props.downLoadHomeWorkFile;
    } else if (type == "homeworkSubmission") {
      return this.props.downLoadStudentHomeWorkSubmissionFile;
    } else if (type == "studentHomework") {
      return this.props.downloadStudentHomeworkFile;
    } else if (type == "studentHomewokSubmission") {
      return this.props.getStudentHomeworkDetails;
    } else if (type == "studentQuiz") {
      return this.props.downloadStudentQuizFileFromMobile;
    } else if (type == "studentNotes") {
      return this.props.downloadStudentNotesFile;
    } else if (type == "drive") {
      return this.props.downloadPersonalDriveFiles;
    } else if (type == "studentdriveHomework") {
      return this.props.downloadStudentHomeworkDrivefile;
    }
  }

  getFileData() {
    let type = searchParams.get("type");
    let token = searchParams.get("token");
    let data = {
      institude_id: searchParams.get("instituteId"),
      branch_id: searchParams.get("branchId"),
      institute_id: searchParams.get("instituteId"),
      payload: this.getPayLoad(),
      token: token
    }

    // let data = {
    // payload: {
    //   homework_file_id: file.student_home_work_submission_file_id
    // },
    //   institute_id: this.props.instituteId,
    //   branch_id: this.props.branchId,
    //   token: this.props.token,
    // }

    // this.props.downloadStudentHomeworkDrivefile(data).then(() => {
    //   let res = this.props.downloadStudentHWDriveFile;
    //   if (res && res.status === 200) {
    //     let Fdata = this.b64toBlob(res.data.response);
    //     fileDownload(Fdata, file.file_name);
    //   }
    // })

    // let studentData ={
    //   institute_id: searchParams.get("instituteId"),
    //   branch_id: searchParams.get("branchId"),
    //   payload: this.getPayLoad(),
    //   token: token
    // }
    //token = searchParams.get("token");
    let renderMarker = searchParams.get("renderMarker");
    let showTip = searchParams.get("showTip");
    showTip = showTip ? showTip : this.props.showTip;
    let downloadFunction = this.getDownloadFunction();
    downloadFunction(data, token).then(() => {
      let res = this.getResponse();
      if (res && res.status == 200) {
        if (type == "homeworkSubmission") {
          this.setState({ pdfData: res.data.response.pdfData, renderMarker, showTip });
        } else {
          this.setState({ pdfData: res.data.response, renderMarker, showTip });
        }
      }
    })
  }

  convertDataURIToBinary(raw) {
    var raw = atob(raw);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  onComment(data) {

    // window.postMessage(data[0].comment.text);
  }

  render() {
    if (this.state.pdfData) {
      return <Viewer nosidebar={true} url={this.convertDataURIToBinary(this.state.pdfData)} onComment={(data) => this.onComment(data)} input={this.state.input} readonly={this.state.readonly} renderMarker={this.state.renderMarker} showTip={this.state.showTip} />
    } else {
      return <div></div>;
    }
  }

}

const mapStateToProps = ({ app, professor, student, professorDrive }) => ({
  notesFiledata: professor.notesFiledata,
  downloadFileData: professor.downloadFileData,
  quizFileData: professor.quizFileData,
  studentSubmissionFile: professor.studentSubmissionFile,
  studentDownloadFileData: student.downloadFileData,
  studentHomeworkDetails: student.studentHomeworkDetails,
  studentQuizfileData: student.quizfiledatamobile,
  notesData: student.notesData,
  personalDriveFileDownload: professorDrive.personalDriveFileDownload,
  downloadStudentHWDriveFile: student.downloadStudentHWDriveFile,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      downloadNotesFile,
      downLoadHomeWorkFile,
      downloadQuizFile,
      downLoadStudentHomeWorkSubmissionFile,
      downloadStudentHomeworkFile,
      getStudentHomeworkDetails,
      downloadStudentQuizFileFromMobile,
      downloadStudentNotesFile,
      downloadPersonalDriveFiles,
      downloadStudentHomeworkDrivefile,
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ViewerContainer)

