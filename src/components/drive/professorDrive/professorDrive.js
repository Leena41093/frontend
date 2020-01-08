import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getProfessorDriveClassList, getProfessorDriveSubjectList, getProfessorDriveSubjectFolderList,
  getProfessorFolderFileList, renameProfessorFileName, deleteProfessorDriveFile, getDriveFolderAndFiles,
  createDriveFolder, addPersonalDriveFiles, getFilesOfDriveFolder, downloadPersonalDriveFiles, quizListDrive
} from '../../../actions/professorDriveAction';
import {
  downLoadHomeWorkFile, downloadNotesFile, downloadQuizFile, getClassesSubjectBatches, createNewQuiz,
  getQuizEditDetail, updateQuizDetail
} from '../../../actions/professorActions';
// import fileDownload from 'js-file-download';
import { DeleteModal } from '../../common/deleteModal';
import { CreateDriveFolderModel } from '../../common/professorModel/createDriveFolderModel';
import { successToste, errorToste } from '../../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import { CreateQuizModal } from '../../common/professorModel/createNewQuizModal';
import { PdfViewModel } from '../../common/professorModel/pdfViewModel';
import { EditQuizModal } from '../../common/professorModel/editQuizModel'
import $ from "jquery";


class ProfessorDrive extends Component {

  constructor(props) {
    super(props);

    this.state = {
      classes: [],
      clsSubjects: [],
      selectedClass: "",
      files: {},
      isRename: { homeWorkFiles: [], quizFiles: [], notesFiles: [] },
      isFolderSelected: false,
      folderSubject: [],
      deleteObj: null,
      file: {},
      index: 0,
      Type: '',
      idx: 0,
      subjectindex: [],
      classIdx: "",
      subIdx: "",
      isSubjectSelected: false,
      disableSub: true,
      personalDriveFlag: false,
      personalFolders: [],
      personlFiles: [],
      Files: {},
      personalDriveFolderFileFlag: false,
      foldersFiles: [],
      selectedFoldId: null,
      selectedPersonalFiles: false,
      folderClick: false,
      personalDriveClick: false,
      instituteId: 0,
      foldername: "",
      hwtab: false,
      quiztab: false,
      notestab: false,
      selectedclassdata: {},
      selectedsubjectdata: {},
      selectedfolderdata: {},
      driveNoteFlag: false,
      sendDataForQuiz: {},
      pro1: {},
      quizfiles: [],
      selectedQuiz: {},
      addhwclickflag: true,
      sendDataToPdfViewModel: {}
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
    this.setState({ instituteId: this.props.instituteId });
    this.getClasses()
  }

  getClasses() {
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorDriveClassList(data).then(() => {
      let res = this.props.driveClasses;
      if (res && res.status == 200) {
        this.setState({ classes: res.data.response }, () => { this.setState({ selectedClass: this.state.classes[0].class_name }) })
      }
    })
  }

  onSelectClass(cls, index) {
    let { clsSubjects, folderSubject, isFolderSelected } = this.state;
    this.setState({ selectedclassdata: cls });
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "class_id": cls.class_id,
      }
    }
    this.props.getProfessorDriveSubjectList(data).then(() => {
      let res = this.props.driveSubject;
      if (res && res.status == 200) {
        clsSubjects[index] = res.data.response;
        folderSubject = res.data.response;
        this.setState({
          clsSubjects, selectedsubjectdata: {}, isSubjectSelected: false, isFolderSelected: false, selectedClass: cls.class_name, hwtab: false, quiztab: false, notestab: false,
          folderSubject, personalDriveFlag: false, idx: index, personalFolders: [], personlFiles: [], foldersFiles: [], selectedFoldId: null
        });
      }
    })
  }

  onSelectSubject(sub, classIndex, subIndex) {
    let { clsSubjects } = this.state;
    let subjects = clsSubjects[classIndex];
    let subject = subjects[subIndex];
    this.setState({ selectedsubjectdata: sub })
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "subject_id": sub.subject_id,
      }
    }
    this.props.getProfessorDriveSubjectFolderList(data).then(() => {
      let res = this.props.driveFolder;
      if (res && res.status == 200) {
        subject.folder = res.data.response
        this.setState({ clsSubjects, selectedfolderdata: {}, isFolderSelected: false, classIdx: classIndex, subIdx: subIndex, isSubjectSelected: true, disableSub: false, hwtab: false, quiztab: false, notestab: false }, () => {
        })
      }
    })
  }

  onSelectFolder(folder) {
    let { isFolderSelected, notestab, quiztab } = this.state;
    let hwtabflag = false;
    if (quiztab == true || notestab == true) {
      hwtabflag = false
    }
    else {
      hwtabflag = true
    }

    this.setState({ selectedfolderdata: folder, hwtab: hwtabflag });
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "subject_folder_id": folder.subject_folder_id,
      }
    }
    this.props.getProfessorFolderFileList(data).then(() => {
      let res = this.props.driveFile;
      if (res && res.status == 200) {
        this.setState({ files: res.data.response, isFolderSelected: true }, () => { if (this.state.addhwclickflag == true) { this.hwTabClicked() } });
      }
    })
    this.props.quizListDrive(data).then(() => {
      let res = this.props.quizlistfordrive;
      if (res && res.data.status == 200) {
        this.setState({ quizfiles: res.data.response })
      }
    })
  }

  onSelecteRename(index, property) {
    let { isRename } = this.state;
    isRename[property][index] = true;
    this.setState({ isRename });
  }

  onChnageFileName(index, property, event) {
    let { files } = this.state;

    if (property == "quizFiles") {
      files[property][0][index].file_name = event.target.value;
    }
    else if (property == "homeWorkFiles" || property == "notesFiles") {
      files[property][index].file_name = event.target.value;
    }
    // isRename[index] = false;
    this.setState({ files });
  }

  onRenameFileName(index, property, file, Type) {
    let { isRename, files } = this.state;
    let id;
    if (Type === "homework") {
      id = file.homework_file_id
    }
    else if (Type === "quiz") {
      id = file.quiz_files_id
    }
    else if (Type === "notes") {
      id = file.notes_file_id
    }
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "category": Type,
        "file_id": id,
        "file_name": property == "quizFiles" ? files[property][0][index].file_name : files[property][index].file_name,
      }
    }
    this.props.renameProfessorFileName(data);
    isRename[property][index] = false;
    this.setState({ isRename });
  }

  onSetQuizDetail(file, type, index) {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        quiz_id: file.quiz_id,
      }
    }

    this.props.getQuizEditDetail(apiData).then(() => {
      let res = this.props.quizData;

      if (res && res.status == 200) {

        this.setState({ selectedQuiz: res.data.response });
      }
    })
  }

  onDeleteModel(file, key, index) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, file, index });
  }

  onDeleteEntry(flag) {
    let { file, Type, index } = this.state;
    if (flag == 'homework') {

      this.onSelectDeleteFile(file, flag, index);
      $("#quizSubmit .close").click();
    }
    else if (flag == 'quiz') {
      this.onSelectDeleteFile(file, flag, index)
      $("#quizSubmit .close").click();
    }
    else if (flag == 'notes') {
      this.onSelectDeleteFile(file, flag, index)
      $("#quizSubmit .close").click();
    }
  }

  onSelectDeleteFile(file, Type, index) {
    let { files } = this.state;
    let id;
    if (Type === "homework") {
      let homeWorkFiles = files.homeWorkFiles;
      let arr = homeWorkFiles;
      arr.splice(index, 1);
      homeWorkFiles = arr;
      files = { ...files, homeWorkFiles };
      id = file.homework_file_id;
    }
    else if (Type === "quiz") {
      let quizFiles = files.quizFiles[0];
      let arr = quizFiles;
      arr.splice(index, 1);
      let newArray = [];
      newArray.push(arr);
      files = { ...files, quizFiles: newArray };
      id = file.quiz_files_id;
    }
    else if (Type === "notes") {
      let notesFiles = files.notesFiles;
      let arr = notesFiles;
      arr.splice(index, 1);
      notesFiles = arr;
      files = { ...files, notesFiles };
      id = file.notes_file_id;
    }
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "file_id": id,
        "category": Type
      }
    }
    this.props.deleteProfessorDriveFile(data).then(() => {
      let res = this.props.deleteFile;
      if (res && res.status == 200) {
        this.setState({ files });
      }
      successToste("File deleted Successfully")
    })
  }

  onSelectOpenFile(file, type) {
    if (type == 'homework') {
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
    else if (type == 'notes') {
      let data = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: {
          "notes_file_id": file.notes_file_id,
        }
      }
      this.props.downloadNotesFile(data).then(() => {
        let res = this.props.notesFiledata;

        if (res && res.data.status == 200) {
          let Url = res.data.response;
          var sendData = {
            file: file,
            pdfUrl: Url,
            type: type
          }
          this.setState({ sendDataToPdfViewModel: sendData })
        } else if (res && res.data.status == 500) {
          errorToste('Something Went Wrong')
        }
      })
    }
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


  handleChange(e) {

    let { Files } = this.state;
    var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : "";
    if (fileSize > 20) {
      errorToste("Please Add File Less Than 20MB")
    } else {
      this.setState({ Files: e.target.files[0] }, () => {
        let { personlFiles } = this.state;

        const formData = new FormData();
        formData.append('filename', this.state.Files);
        formData.append('my_folders_id', '');
        formData.append('folderFlag', 'FALSE');
        let apiData = {
          institute_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
          payload: formData,
        }
        this.props.addPersonalDriveFiles(apiData).then(() => {
          let res = this.props.addPersonalFile;

          if (res && res.data.status == 200) {
            this.state.personlFiles.push(res.data.response);
            this.setState({ personlFiles, foldersFiles: [] });
            this.getPersonalFoldersFiles();
          }
          else if (res && res.data.status == 500) {
            errorToste(res.data.message)
          }
        })
      })
    }
  }

  getDriveFileOFfolder(id, foldername, e) {
    let { Files } = this.state;
    var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : ""
    if (fileSize > 20) {
      errorToste("Please Add File Less Than 20MB")
    } else {
      this.setState({ Files: e.target.files[0] }, () => {
        let { foldersFiles } = this.state;

        const formData = new FormData();
        formData.append('filename', this.state.Files);
        formData.append('my_folders_id', id);
        formData.append('folderFlag', 'TRUE');
        let apiData = {
          institute_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
          payload: formData,
        }
        this.props.addPersonalDriveFiles(apiData).then(() => {
          let res = this.props.addPersonalFile;

          if (res && res.data.status == 200) {
            this.state.foldersFiles.push(res.data.response);
            this.setState({ foldersFiles });
            this.getPersonalDrivesFilesofFolder(id, foldername)
          }
          else if (res && res.data.status == 500) {
            errorToste(res.data.message)
          }
        })
      })
    }
  }

  newFolder(foldername) {
    let { personalFolders } = this.state;
    let data = {
      payload: {
        folder_name: foldername
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.createDriveFolder(data).then(() => {
      let res = this.props.professorDriveNewFolder;

      if (res && res.data.status == 200) {
        this.state.personalFolders.push(res.data.response)

        this.setState({ personalFolders });
        successToste("New Folder Created Successfully");
        this.getPersonalFoldersFiles();
      } else if (res && res.data.status == 500) {
        errorToste(res.data.message)
      }
    })
  }

  getPersonalFoldersFiles() {
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getDriveFolderAndFiles(data).then(() => {
      let res = this.props.getProfDriveFolderAndFiles;
      if (res && res.data.status == 200) {
        this.setState({
          personalFolders: res.data.response.personalFolders, personalDriveFlag: true,
          personlFiles: res.data.response.personlFiles, foldersFiles: [],
          selectedPersonalFiles: true, folderClick: false, clsSubjects: [], folderSubject: [], selectedClass: '', personalDriveClick: true
        })
      }
      else if (res && res.data.status == 500) {
        errorToste(res.data.message)
      }
    })
  }

  onEditQuizPage() {
    $("#editQuiz .close").click();
    let { selectedQuiz } = this.state;
    const pro1 = this.props.location.state ? this.props.location.state.data1 : '';
    if (selectedQuiz.quiz_type === "upload_pdf") {
      this.props.history.push({
        pathname: `edit-uploadtypequiz`,
        state: { data: selectedQuiz, pro1: { fromDrive: true } }
      })
    }
    else {
      this.props.history.push({
        pathname: '/app/edit-quizquestionanswer',
        state: { data: selectedQuiz, pro1: { fromDrive: true } }
      })
    }
  }

  createNewHw() {
    let { selectedclassdata, selectedsubjectdata, selectedfolderdata } = this.state;
    let sendData = { selectedclassdata, selectedsubjectdata, selectedfolderdata }
    var obj = {
      class_name: this.state.selectedclassdata.class_name, class_id: this.state.selectedclassdata.class_id,
      subject_name: this.state.selectedsubjectdata.subject_name, subject_id: this.state.selectedsubjectdata.subject_id,
      folder_name: this.state.selectedfolderdata.folder_name, subject_folder_id: this.state.selectedfolderdata.subject_folder_id,
      fromdrive: true
    }
    this.props.history.push({ pathname: "/app/newhomework-detail", state: { data: obj } })
  }

  createNewQuizFromDrive() {
    let { selectedclassdata, selectedsubjectdata, selectedfolderdata } = this.state;
    let sendData = { selectedclassdata, selectedsubjectdata, selectedfolderdata, fromdrive: true };
    var obj = {
      class_name: this.state.selectedclassdata.class_name, class_id: this.state.selectedclassdata.class_id,
      subject_name: this.state.selectedsubjectdata.subject_name, subject_id: this.state.selectedsubjectdata.subject_id,
      fromdrive: true
    }
    this.setState({ sendDataForQuiz: sendData, pro1: obj }, () => {
      $("#openquizmodal").click();
    })
  }

  createNewNotes() {
    let { selectedclassdata, selectedsubjectdata, selectedfolderdata } = this.state;
    let sendData = { selectedclassdata, selectedsubjectdata, selectedfolderdata, driveNoteFlag: true }
    this.props.history.push({ pathname: "/app/create-notes", state: { data: sendData } })
  }

  getPersonalDrivesFilesofFolder(id, foldername) {
    let { foldersFiles } = this.state;
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        my_folders_id: id
      }
    }
    this.props.getFilesOfDriveFolder(data).then(() => {
      let res = this.props.getProfessorDriveFilesOfFolders;
      if (res && res.data.status == 200) {
        this.setState({
          personalDriveFolderFileFlag: true, foldersFiles: res.data.response.files, personalFolders: [],
          personlFiles: [], selectedFoldId: id, selectedPersonalFiles: false, folderClick: true, personalDriveClick: false,
          foldername: foldername
        })
      } else if (res && res.data.status == 500) {
        errorToste(res.data.massage);
      }
    })
  }

  openPersonalDriveFile(file, type) {

    let data = {
      payload: {
        my_drive_files_id: file.my_drive_files_id
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.downloadPersonalDriveFiles(data).then(() => {
      let res = this.props.personalDriveFileDownload;
      if (res && res.data.status == 200) {
        var sendData = {
          file: file,
          pdfUrl: res.data.response,
          type: type
        }
        this.setState({ sendDataToPdfViewModel: sendData })
      }
      else if (res && res.data.status == 500) {
        errorToste(res.data.message)
      }
    })
  }

  renderFolder(clsIndex, subIndex) {
    let { clsSubjects } = this.state;
    let subjects = clsSubjects[clsIndex];
    let folders = subjects[subIndex].folder;
    if (folders && folders.length > 0) {
      return folders.map((folder, index) => {
        return (
          <button key={"folder" + index} onClick={this.onSelectFolder.bind(this, folder)} className="unit__btn"><i></i>{folder.folder_name}</button>
        )
      })
    }
  }

  renderFolders(clsIndex, subIndex) {
    let { clsSubjects } = this.state;
    let subjects = clsSubjects[clsIndex];
    let folders = subjects[subIndex].folder;
    if (folders && folders.length > 0) {
      return folders.map((folder, index) => {
        return (
          <button key={"folder" + index} className="folder_unit folder">
            <div className="unit__body" onClick={this.onSelectFolder.bind(this, folder)} >
              <i></i>
              <span className="unit__header">{folder.folder_name}</span>
            </div>
          </button>
        )
      })
    }
  }

  renderSubject(index) {
    let { clsSubjects } = this.state;
    let subjects = clsSubjects[index];
    if (subjects && subjects.length > 0) {
      return subjects.map((subject, idx) => {

        return (
          <div key={"subject" + idx} className="panel panel-default d_sect_child">
            <div className="panel-heading" role="tab">
              <a className="panel-title" role="button" data-toggle="collapse" onClick={this.onSelectSubject.bind(this, subject, index, idx)} href={"#drive_par_" + idx + "_c" + index}>
                <i></i>{subject.subject_name}
              </a>
            </div>
            <div id={"drive_par_" + idx + "_c" + index} className="panel-collapse collapse" role="tabpanel">
              <div className="panel-body">
                <div className="sect__unitlist">
                  {this.renderFolder(index, idx)}
                </div>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  renderClasses() {
    let { classes } = this.state;
    if (classes && classes.length > 0) {
      return classes.map((cls, index) => {
        return (
          <div key={"cls" + index} className="clearfix d_sect_parent">
            <div className="panel panel-default d_sect_child">
              <div className="panel-heading" role="tab">
                <a className="panel-title" role="button" data-toggle="collapse" onClick={this.onSelectClass.bind(this, cls, index)} href={"#drive_par_" + index}>
                  <i></i>{cls.class_name}
                </a>
              </div>
              <div id={"drive_par_" + index} className="panel-collapse collapse" role="tabpanel">
                <div className="panel-body">
                  <div className="clearfix d_sect_parent sect_firstChild">
                    {this.renderSubject(index)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  renderHomeWorkFiles() {
    let { files, isRename } = this.state;
    let HomeworkFiles = files.homeWorkFiles;
    if (HomeworkFiles && HomeworkFiles.length > 0) {
      return HomeworkFiles.map((file, index) => {

        return (
          <div key={"homeworkfile" + index} className="folder_unit file">
            <div className="unit__body dropdown">
              <i></i>
              {isRename.homeWorkFiles[index] ? <input type="text" style={{ width: "158px" }} className="unit__header" onBlur={this.onRenameFileName.bind(this, index, "homeWorkFiles", file, "homework")} onChange={this.onChnageFileName.bind(this, index, "homeWorkFiles")} value={file.file_name} /> :
                <span className="unit__header">{file && file.file_name ? file.file_name.slice(0, 17) + "..." : ""}</span>
              }
              <div className="unit__info">

              </div>
              <button className="unit__setting" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                <li><a data-toggle="modal" data-target="#pdfviewmodel" onClick={this.onSelectOpenFile.bind(this, file, 'homework')}>Open File</a></li>
                <li role="separator" className="divider"></li>
                <li><a data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, file, "homework", index)}>Delete</a></li>
                <li><a onClick={this.onSelecteRename.bind(this, index, "homeWorkFiles")} >Rename</a></li>
              </ul>
            </div>
          </div>
        )
      })
    }
  }

  renderQuizFiles() {
    let { quizfiles, isRename } = this.state;

    // let quizFiles = files.quizFiles[0];
    if (quizfiles && quizfiles.length > 0) {
      return quizfiles.map((file, index) => {
        return (
          <div key={"quizFile" + index} className="folder_unit file">
            <div className="unit__body dropdown">
              <i></i>
              {isRename.quizFiles[index] ? <input type="text" style={{ width: "158px" }} className="unit__header" onBlur={this.onRenameFileName.bind(this, index, "quizFiles", file, "quiz")} onChange={this.onChnageFileName.bind(this, index, "quizFiles")} value={file.file_name} /> :
                <span className="unit__header">{file && file.quiz_title ? file.quiz_title.slice(0, 17) + "..." : ""}</span>
              }
              <div className="unit__info">

              </div>
              <button className="unit__setting" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                {/* <li><a onClick={this.onSelectOpenFile.bind(this, file, "quiz")}>Open File</a></li> */}
                <li><a data-toggle="modal" data-target="#editQuiz" onClick={this.onSetQuizDetail.bind(this, file, "quiz", index)} >View/Edit</a></li>
                {/* <li role="separator" className="divider"></li>
                <li><a data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, file, "quiz", index)}>Delete</a></li> */}
              </ul>
            </div>
          </div>
        )

      })
    }
  }

  renderNotesFiles() {
    let { files, isRename } = this.state;
    let notesFiles = files.notesFiles;
    if (notesFiles && notesFiles.length > 0) {
      return notesFiles.map((file, index) => {
        return (
          <div key={"notesFile" + index} className="folder_unit file">
            <div className="unit__body dropdown">
              <i></i>
              {isRename.notesFiles[index] ? <input type="text" style={{ width: "158px" }} className="unit__header" onBlur={this.onRenameFileName.bind(this, index, "notesFiles", file, "notes")} onChange={this.onChnageFileName.bind(this, index, "notesFiles")} value={file.file_name} /> :
                <span className="unit__header">{file && file.file_name ? file.file_name.slice(0, 17) + "..." : ""}</span>
              }
              <div className="unit__info">

              </div>
              <button className="unit__setting" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                <li><a data-toggle="modal" data-target="#pdfviewmodel" onClick={this.onSelectOpenFile.bind(this, file, 'notes')}>Open File</a></li>
                <li role="separator" className="divider"></li>
                <li><a data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, file, "notes", index)}>Delete</a></li>
                {/* <li><a >View Information</a></li> */}
                <li><a onClick={this.onSelecteRename.bind(this, index, "notesFiles")} >Rename</a></li>
              </ul>
            </div>
          </div>
        )
      })
    }
  }

  renderSubjectFolder(index) {
    let { folderSubject } = this.state;
    if (folderSubject && folderSubject.length > 0) {
      var subjectindex = []
      return folderSubject.map((subject, idx) => {

        subjectindex.push(idx);
        return (
          <button key={"subjectFolder" + idx} className="folder_unit folder">
            <div className="unit__body" onClick={this.onSelectSubject.bind(this, subject, index, idx)} >
              <i></i>
              <span className="unit__header">{subject.subject_name}</span>
            </div>
          </button>
        )
      })
      this.setState({ subjectindex: subjectindex })
    }
  }

  hwTabClicked() {
    this.setState({ hwtab: true, quiztab: false, notestab: false, addhwclickflag: false })
  }

  quizTabClicked() {
    this.setState({ hwtab: false, quiztab: true, notestab: false })
  }

  notesTabClicked() {
    this.setState({ hwtab: false, quiztab: false, notestab: true })
  }

  renderFoldersAndFile() {
    let { isFolderSelected, idx } = this.state;
    if (isFolderSelected) {
      return (
        <div className="drive_dataSect__tabs">
          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation" className="active" onClick={this.hwTabClicked.bind(this)}><a href="#tab_homework" aria-controls="tab_homework" role="tab" data-toggle="tab">HOMEWORKS</a></li>
            <li role="presentation" onClick={this.quizTabClicked.bind(this)}><a href="#tab_quiz" aria-controls="tab_quiz" role="tab" data-toggle="tab">QUIZZES</a></li>
            <li role="presentation" onClick={this.notesTabClicked.bind(this)}><a href="#tab_notes" aria-controls="tab_notes" role="tab" data-toggle="tab">NOTES</a></li>
          </ul>
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="tab_homework">
              <div className="clearfix drive_folderBtn">
              </div>
              <div className="drive_folderSect clearfix" style={{ overflow: "auto", height: "300px" }}>
                {this.renderHomeWorkFiles()}
              </div>
            </div>
            <div role="tabpanel" className="tab-pane" id="tab_quiz">
              <div className="clearfix drive_folderBtn">
              </div>
              <div className="drive_folderSect clearfix" style={{ overflow: "auto", height: "300px" }}>
                {this.renderQuizFiles()}
              </div>
            </div>
            <div role="tabpanel" className="tab-pane" id="tab_notes">
              <div className="clearfix drive_folderBtn">
              </div>
              <div className="drive_folderSect clearfix" style={{ overflow: "auto", height: "300px" }}>
                {this.renderNotesFiles()}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="drive_folderSect">
          {this.state.disableSub ? this.renderSubjectFolder(idx) : <div></div>}
          {this.state.isSubjectSelected ? this.renderFolders(this.state.classIdx, this.state.subIdx) : <div></div>}
        </div>
      )
    }
  }

  renderPersonalFiles() {
    let { personlFiles } = this.state;

    if (personlFiles && personlFiles.length > 0) {
      return personlFiles[0].map((file, index) => {
        return (
          <div key={"homeworkfile" + index} className="folder_unit file">
            <div className="unit__body dropdown">
              <i></i>
              <span className="unit__header">{file && file.file_name ? file.file_name.slice(0, 17) + "..." : ""}</span>
              <div className="unit__info">
              </div>
              <button className="unit__setting" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                <li><a data-toggle="modal" data-target="#pdfviewmodel" onClick={this.openPersonalDriveFile.bind(this, file, 'drive')}>Open File</a></li>
                <li role="separator" ></li>
              </ul>
            </div>
          </div>
        )
      })
    }
  }

  renderDriveFolder() {
    let { personalFolders } = this.state;
    if (personalFolders && personalFolders.length > 0) {
      return personalFolders.map((folder, idx) => {
        return (
          <button key={"subjectFolder" + idx} className="folder_unit folder linkbtn hover-pointer" onClick={this.getPersonalDrivesFilesofFolder.bind(this, folder.my_folders_id, folder.folder_name)}>
            <div className="unit__body linkbtn hover-pointer"  >
              <i></i>
              <span className="unit__header linkbtn hover-pointer">{folder.folder_name}</span>
            </div>
          </button>
        )
      })
    }
  }

  renderFiles() {
    let { foldersFiles } = this.state;
    if (foldersFiles && foldersFiles.length > 0) {

      return foldersFiles.map((folderfiles, index) => {

        return (
          <div key={"homeworkfile" + index} className="folder_unit file">
            <div className="unit__body dropdown">
              <i></i>
              {folderfiles && folderfiles.file_name ? <span className="unit__header">{folderfiles.file_name.slice(0, 17) + "..."}</span> : ""}


              <div className="unit__info">

              </div>
              <button className="unit__setting" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                <li><a data-toggle="modal" data-target="#pdfviewmodel" onClick={this.openPersonalDriveFile.bind(this, folderfiles, 'drive')}>Open File</a></li>
                <li role="separator" ></li>

              </ul>
            </div>
          </div>
        )
      })
    }
  }

  renderPersonalDriveFoldersFiles() {
    return (
      <div>

        <div role="tabpanel" className="tab-pane active" id="tab_homework" style={{ overflow: "auto", height: "350px" }}>
          <div className="clearfix drive_folderBtn">

            {this.state.folderClick == true ?
              <div>
                <span style={{ fontSize: "20px" }}>{this.state.foldername ? this.state.foldername : ""}</span>
                <input ref={(ref) => this.getFile = ref} style={{ display: "none" }} type="file" accept="application/pdf" onChange={this.getDriveFileOFfolder.bind(this, this.state.selectedFoldId, this.state.foldername)} />
                <button className="c-btn prime pull-right" onClick={(e) => this.getFile.click()}>Add New File</button></div> : <div></div>}
          </div>
          {this.state.personalDriveClick ?
            <div>
              {(this.state.personlFiles.length > 0) ?
                <div className="drive_folderSect clearfix" >
                  {this.renderPersonalFiles()}
                </div> : ""}
              <div className="drive_folderSect">
                {this.renderDriveFolder()}
              </div>
            </div> :
            <div className="drive_folderSect">
              {this.renderFiles()}
            </div>}

        </div>


      </div>
    )
  }

  addNewQuiz(newQuiz) {
    let self = this;
    let data = {
      payload: {
        quiz_title: newQuiz.quiz_title,
        quiz_topic: newQuiz.quiz_title,
        subject_folder_id: newQuiz.subject_folder_id,
        subject_id: newQuiz.subject_id,
        class_id: newQuiz.class_id,
        quiz_type: newQuiz.quiz_type,
        marks_for_each_question: newQuiz.marks_for_each_question,
        duration: newQuiz.duration
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    self.props.createNewQuiz(data).then(() => {
      let quiz_id = this.state;
      let res = this.props.newQuiz;

      if (res && res.data.status == 200) {

        let data = {
          quiz_id: res.data.response.quiz_id,
          quiz_type: res.data.response.quiz_type,
          class_id: res.data.response.class_id,
          subject_id: res.data.response.subject_id,
          subject_folder_id: res.data.response.subject_folder_id,
          data: res.data.response,
          duration: res.data.response.duration,

        }
        if (res.data.response.quiz_type == "upload_pdf") {
          $(".close").click();
          this.props.history.push({
            pathname: '/app/professor-quizuploadpdf',
            state: { data, pro1: this.state.pro1 }
          })

        }
        else if (res.data.response.quiz_type == "type_questions") {
          $(".close").click();
          this.props.history.push({
            pathname: '/app/professor-quiztypequestion',
            state: { data, pro1: this.state.pro1 }
          })
        }

      }
      else if (res && res.data.status == 500) {
        errorToste(res.data.message)
      }
    })
  }

  onQuizTypeSelect(type) {

    $('.modal-overlay').fadeOut('fast', function () {
      $(this).remove();
    });
    $(".custom-modal-sm").fadeOut('fast');
  }

  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "500px" }}>
        <ToastContainer />
        <button data-toggle="modal" data-target="#createQuiz" id="openquizmodal" hidden></button>
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Professor</span>
              <span className="c-heading-lg">Drive</span>
            </div>

          </div>
        </div>
        <div className="c-container__data">
          <div className="divider-container drive--section">
            <div className="divider-block text--left d_section_1">
              <div className="search__sect">
                <div className="form-group cust-fld nomargin">

                </div>
              </div>
              <div className="drive__sect">
                {this.renderClasses()}
              </div>
              <div className="pfile__sect" >
                <button className="unit__btn" onClick={this.getPersonalFoldersFiles.bind(this)} ><i></i>Personal Files</button>

              </div>
            </div>
            {this.state.personalDriveFlag == true ?
              <div className="divider-block text--left d_section_2">

                <div className="drive_dataSect">
                  <div className="drive_dataSect__head">
                    <div className="divider-container">
                      <div className="divider-block text--left">
                        <span className="c-heading-lg"></span>
                      </div>
                      <div className="divider-block text--right">
                        {this.state.selectedPersonalFiles == true ?
                          <div>
                            <button className="c-btn prime" data-toggle="modal" data-target="#createDrivefolder">Create Folder</button>
                            <input ref={(ref) => this.getFile = ref} style={{ display: "none" }} type="file" accept="application/pdf" onChange={this.handleChange.bind(this)} />
                            <button className="c-btn prime" onClick={(e) => this.getFile.click()}>Add New File</button>
                          </div> : <div></div>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="drive_dataSect__body">
                    {this.renderPersonalDriveFoldersFiles()}
                  </div>

                </div>
              </div> :
              <div className="divider-block text--left d_section_2">

                <div className="drive_dataSect">
                  <div className="drive_dataSect__head">
                    <div className="divider-container">
                      <div className="divider-block text--left">
                        <span className="c-heading-lg">{this.state.selectedClass}{this.state.isSubjectSelected == true ? " > " + this.state.selectedsubjectdata.subject_name : ""}{this.state.isFolderSelected == true ? " > " + this.state.selectedfolderdata.folder_name : ""}</span>
                      </div>
                      <div className="divider-block text--right">
                        <div>
                          {this.state.hwtab == true ? <button className="c-btn prime pull-right" onClick={this.createNewHw.bind(this)}>Add New Homework</button> : ""}
                          {this.state.quiztab == true ? <button className="c-btn prime pull-right" onClick={this.createNewQuizFromDrive.bind(this)}>Add New Quiz</button> : ""}
                          {this.state.notestab == true ? <button className="c-btn prime pull-right" onClick={this.createNewNotes.bind(this)}>Add New Notes</button> : ""}
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="drive_dataSect__body">
                    {this.renderFoldersAndFile()}
                  </div>
                </div>
              </div>}
          </div>
        </div>

        <CreateDriveFolderModel onCreateNewDriveFolder={(data) => { this.newFolder(data) }} />
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
        <CreateQuizModal onQuizTypeSelect={this.onQuizTypeSelect} onAddnewQuiz={(data) => { this.addNewQuiz(data) }} {...this.props} datasend={this.state.sendDataForQuiz} />
        <EditQuizModal quiz={this.state.selectedQuiz} onEditQuestionPage={this.onEditQuizPage.bind(this)} {...this.props} />
        <PdfViewModel sendDataToPdfViewModel={this.state.sendDataToPdfViewModel} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, professorDrive, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,

  driveClasses: professorDrive.driveClasses,
  driveSubject: professorDrive.driveSubject,
  driveFolder: professorDrive.driveFolder,
  driveFile: professorDrive.driveFile,
  fileRename: professorDrive.fileRename,
  deleteFile: professorDrive.deleteFile,
  downloadFileData: professor.downloadFileData,
  notesFiledata: professor.notesFiledata,
  professorId: professor.professorId,
  quizFileData: professor.quizFileData,
  token: auth.token,
  getProfDriveFolderAndFiles: professorDrive.getProfDriveFolderAndFiles,
  professorDriveNewFolder: professorDrive.professorDriveNewFolder,
  addPersonalFile: professorDrive.addPersonalFile,
  getProfessorDriveFilesOfFolders: professorDrive.getProfessorDriveFilesOfFolders,
  personalDriveFileDownload: professorDrive.personalDriveFileDownload,
  classesSubjectsBatches: professor.classesSubjectsBatches,
  newQuiz: professor.newQuiz,
  quizlistfordrive: professorDrive.quizlistfordrivedata,
  quizData: professor.quizData,
})


const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getProfessorDriveClassList,
      getProfessorDriveSubjectList,
      getProfessorDriveSubjectFolderList,
      getProfessorFolderFileList,
      renameProfessorFileName,
      deleteProfessorDriveFile,
      downLoadHomeWorkFile,
      downloadNotesFile,
      downloadQuizFile,
      getDriveFolderAndFiles,
      createDriveFolder,
      addPersonalDriveFiles,
      getFilesOfDriveFolder,
      downloadPersonalDriveFiles, getClassesSubjectBatches,
      createNewQuiz,
      quizListDrive,
      getQuizEditDetail,
      updateQuizDetail
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorDrive)