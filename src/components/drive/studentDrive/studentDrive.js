import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getStudentDriveClassList, getStudentDriveSubjectList, getStudentDriveFolderList, getStudentDriveFileList,
  renameStudentDriveFileName, deleteStudentDriveFile
} from '../../../actions/studentDriveAction';
import { getDriveFolderAndFiles, createDriveFolder, addPersonalDriveFiles, getFilesOfDriveFolder, downloadPersonalDriveFiles } from '../../../actions/professorDriveAction';
import { downloadStudentHomeworkFile, downloadStudentHomeworkDrivefile } from '../../../actions/studentAction';
// import fileDownload from 'js-file-download';
import { successToste, errorToste } from '../../../constant/util';
import { CreateDriveFolderModel } from '../../common/professorModel/createDriveFolderModel';
import { DeleteModal } from '../../common/deleteModal';
import { PdfViewModel } from '../../common/professorModel/pdfViewModel';
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";

class StudentDrive extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      clsSubjects: [],
      files: {},
      isRename: [],
      selectedClass: "",
      isFolderSelected: false,
      folders: [],
      deleteObj: null,
      index: 0,
      file: {},
      instituteId: 0,
      idx: 0,
      subjectindex: [],
      classIdx: "",
      subIdx: "",
      isSubjectSelected: false,
      disableSub: true,
      personalDriveFlag: false,
      selectedPersonalFiles: false,
      folderClick: false,
      personalFolders: [],
      personlFiles: [],
      Files: {},
      personalDriveFolderFileFlag: false,
      foldersFiles: [],
      selectedFoldId: null,
      personalDriveClick: false,
      foldername: "",
      selectedSubjectData: {},
      selectedFolderData: {},
      sendDataToPdfViewModel: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    // let id  = localStorage.getItem("instituteid");
    // if(id == nextProps.instituteId){
    if (this.state.instituteId != nextProps.instituteId) {
      // localStorage.removeItem("instituteid")
      this.setState({ instituteId: nextProps.instituteId }, () => {
        this.setState({ folders: [], selectedClass: "" })
        this.getClasses();

      });
      // }
    }
  }

  componentDidMount() {
    this.getClasses();
  }

  getClasses() {
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getStudentDriveClassList(data).then(() => {
      let res = this.props.driveClasses

      if (res && res.status == 200) {
        this.setState({ classes: res.data.response.classes })
      }
    })
  }

  onSelectClass(cls, index) {
    let { clsSubjects, folders } = this.state;
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "class_id": cls.class_id,
      }
    }
    this.props.getStudentDriveSubjectList(data).then(() => {
      let res = this.props.driveSubjects;
      if (res && res.status == 200) {
        clsSubjects[index] = res.data.response.subjects;
        folders = res.data.response.subjects;
        this.setState({
          clsSubjects, selectedClass: cls.class_name, isSubjectSelected: false, isFolderSelected: false, folders, idx: index, personalDriveFlag: false,
          personalFolders: [], personlFiles: [], foldersFiles: [],
        });
      }
    })
  }

  onSelectSubject(sub, classIndex, subIndex) {
    this.setState({ selectedSubjectData: sub })
    let { clsSubjects } = this.state;
    let subjects = clsSubjects[classIndex];
    let subject = subjects[subIndex];

    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "subject_id": sub.subject_id,
      }
    }
    this.props.getStudentDriveFolderList(data).then(() => {
      let res = this.props.driveFolder;
      if (res && res.status == 200) {
        subject.folder = res.data.response.folderNames;
        this.setState({ clsSubjects, classIdx: classIndex, subIdx: subIndex, isSubjectSelected: true, disableSub: false, isFolderSelected: false })
      }
    })
  }

  onSelectFolder(folder) {
    this.setState({ selectedFolderData: folder })
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "subject_folder_id": folder.subject_folder_id,
      }
    }
    this.props.getStudentDriveFileList(data).then(() => {
      let res = this.props.driveFiles;
      if (res && res.status == 200) {
        this.setState({ files: res.data.response, isFolderSelected: true });
      }
    })
  }

  onSelectOpenFile(file, type) {
    let data = {
      payload: {
        homework_file_id: file.student_home_work_submission_file_id
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.downloadStudentHomeworkDrivefile(data).then(() => {
      let res = this.props.downloadStudentHWDriveFile;
      if (res && res.status === 200) {
        var sendData = {
          file: file,
          pdfUrl: res.data.response,
          type: type
        }
        this.setState({ sendDataToPdfViewModel: sendData })
      } else if (res && res.status == 500) {
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

  onSelecteRename(index) {
    let { isRename } = this.state;
    isRename[index] = true;
    this.setState({ isRename });
  }

  onChnageFileName(index, event) {
    let { files } = this.state;
    files[index].file_name = event.target.value;
    this.setState({ files });
  }

  onRenameFileName(index, file) {
    let { isRename, files } = this.state;

    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "file_id": file.student_home_work_submission_file_id,
        "file_name": files[index].file_name,
      }
    }
    this.props.renameStudentDriveFileName(data);
    isRename[index] = false;
    this.setState({ isRename });
  }

  onDeleteModel(key, file, index) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, file, index });
  }

  onDeleteEntry(flag) {
    let { file, index } = this.state;
    if (flag == 'homework') {

      this.onSelectDeleteFile(file, index);
      $("#quizSubmit .close").click();
    }
  }

  onSelectDeleteFile(file, index) {
    let { files } = this.state;
    files.splice(index, 1);
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "file_id": file.student_home_work_submission_file_id,
      }
    }
    this.props.deleteStudentDriveFile(data).then(() => {
      let res = this.props.deleteFile;
      if (res && res.status == 200) {
        this.setState({ files });
      }
      successToste("File deleted successfully")
    })
  }

  handleChange(e) {
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
    var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : "";
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
          personlFiles: [], selectedFoldId: id, selectedPersonalFiles: false, folderClick: true, personalDriveClick: false, foldername: foldername
        })
      } else if (res && res.data.status == 500) {
        errorToste(res.data.message);
      }
    })
  }

  openPersonalDriveFile(file, type) {

    // this.props.history.push({
    //   pathname:'/app/pdf-view',
    //   state:{sendData}
    // })
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        my_drive_files_id: file.my_drive_files_id
      }
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
      } else if (res && res.data.status == 500) {
        errorToste('Something Went Wrong')
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

        this.setState({ personalFolders })
        this.getPersonalFoldersFiles();
      } else if (res && res.data.status == 500) {
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
          <div key={"subject" + index} className="panel panel-default d_sect_child">
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
    let HomeworkFiles = files;
    if (HomeworkFiles && HomeworkFiles.length > 0) {
      return HomeworkFiles.map((file, index) => {
        return (
          <div key={"homeworkfile" + index} className="folder_unit file">
            <div className="unit__body dropdown">
              <i></i>
              {isRename[index] ? <input type="text" style={{ width: "158px" }} className="unit__header" onBlur={this.onRenameFileName.bind(this, index, file)} onChange={this.onChnageFileName.bind(this, index)} value={file.file_name} /> :
                <span className="unit__header">{file && file.file_name ? file.file_name.slice(0, 17) + "..." : ""}</span>
              }
              <div className="unit__info">
              </div>
              <button className="unit__setting" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                <li><a data-toggle="modal" data-target="#pdfviewmodel" onClick={this.onSelectOpenFile.bind(this, file, "studentdriveHomework")} >Open File</a></li>
                <li role="separator" className="divider"></li>
                {/* <li><a data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "homework", file, index)} >Delete</a></li> */}
                {/* <li><a >View Information</a></li> */}
                <li><a onClick={this.onSelecteRename.bind(this, index)} >Rename</a></li>
              </ul>
            </div>
          </div>
        )
      })
    }
  }

  renderSubjectFolder(index) {
    let { folders } = this.state;
    if (folders && folders.length > 0) {
      var subjectindex = []
      return folders.map((folder, idx) => {
        subjectindex.push(idx);
        return (
          <button key={"folder" + idx} className="folder_unit folder">
            <div className="unit__body" onClick={this.onSelectSubject.bind(this, folder, index, idx)} >
              <i></i>
              <span className="unit__header">{folder.subject_name}</span>

            </div>
          </button>

        )
      })
      this.setState({ subjectindex: subjectindex })
    }
  }

  renderFolderFile() {
    let { isFolderSelected, idx } = this.state;
    if (isFolderSelected) {
      return (
        <div className="drive_dataSect__tabs">
          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation" className="active"><a href="#tab_homework" aria-controls="tab_homework" role="tab" data-toggle="tab">HOMEWORKS</a></li>
          </ul>
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="tab_homework">
              <div className="clearfix drive_folderBtn">
                {/* <button className="c-btn prime nomargin">Add new Note</button> */}
              </div>
              <div className="drive_folderSect clearfix">
                {this.renderHomeWorkFiles()}
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
            <div className="unit__body"  >
              <i></i>
              <span className="unit__header">{folder.folder_name}</span>
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
        <div role="tabpanel" className="tab-pane active" id="tab_homework">
          <div className="clearfix drive_folderBtn">

            {this.state.folderClick == true ?
              <div>
                <span style={{ fontSize: "20px" }}>{this.state.foldername ? this.state.foldername : ""}</span>
                <input ref={(ref) => this.getFile = ref} style={{ display: "none" }} type="file" accept="application/pdf" onChange={this.getDriveFileOFfolder.bind(this, this.state.selectedFoldId, this.state.foldername)} />
                <button className="c-btn prime pull-right" onClick={(e) => this.getFile.click()}>Add New File</button>
              </div> : <div></div>}
          </div>
          {this.state.personalDriveClick ?
            <div>
              <div className="drive_folderSect clearfix">
                {this.renderPersonalFiles()}
              </div>

              <div className="drive_folderSect linkbtn hover-pointer">
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


  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "500px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Drive</span>
            </div>
            <div className="divider-block text--right">
              {/* <button className="c-btn prime">Add New File</button> */}
            </div>
          </div>
        </div>
        <div className="c-container__data">
          <div className="divider-container drive--section">
            <div className="divider-block text--left d_section_1">
              <div className="search__sect">
                <div className="form-group cust-fld nomargin">
                  {/* <label>Search File</label> */}
                  {/* <input type="text" className="form-control" placeholder="First Name" /> */}
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
                        <span className="c-heading-lg">{this.state.selectedClass}{this.state.isSubjectSelected == true ? " > " + this.state.selectedSubjectData.subject_name : ""}{this.state.isFolderSelected == true ? " > " + this.state.selectedFolderData.folder_name : ""}</span>
                      </div>
                    </div>
                  </div>
                  <div className="drive_dataSect__body">
                    {this.renderFolderFile()}
                  </div>
                </div>
              </div>}
          </div>
        </div>
        <CreateDriveFolderModel onCreateNewDriveFolder={(data) => { this.newFolder(data) }} />
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}    {...this.props} />
        <PdfViewModel sendDataToPdfViewModel={this.state.sendDataToPdfViewModel} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, student, studentDrive, auth, professorDrive }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  driveClasses: studentDrive.driveClasses,
  driveSubjects: studentDrive.driveSubjects,
  driveFolder: studentDrive.driveFolder,
  driveFiles: studentDrive.driveFiles,
  downloadFileData: student.downloadFileData,
  renameFile: studentDrive.renameFile,
  deleteFile: studentDrive.deleteFile,
  token: auth.token,
  downloadStudentHWDriveFile: student.downloadStudentHWDriveFile,
  getProfDriveFolderAndFiles: professorDrive.getProfDriveFolderAndFiles,
  professorDriveNewFolder: professorDrive.professorDriveNewFolder,
  addPersonalFile: professorDrive.addPersonalFile,
  getProfessorDriveFilesOfFolders: professorDrive.getProfessorDriveFilesOfFolders,
  personalDriveFileDownload: professorDrive.personalDriveFileDownload
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStudentDriveClassList,
      getStudentDriveSubjectList,
      getStudentDriveFolderList,
      getStudentDriveFileList,
      downloadStudentHomeworkFile,
      renameStudentDriveFileName,
      deleteStudentDriveFile,
      downloadStudentHomeworkDrivefile,
      getDriveFolderAndFiles,
      createDriveFolder,
      addPersonalDriveFiles,
      getFilesOfDriveFolder,
      downloadPersonalDriveFiles
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentDrive)