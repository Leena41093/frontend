import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getClassesSubjectBatches, getProfessorSubjects, getProfessorBatch,
  getFolderNameList, createFolderName, createNotesDetail, notesFileUpload, notesDriveFileUploading, uploadNoteFileToDrive
} from '../../actions/professorActions';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { CreateNewFolderModel } from '../common/professorModel/createNewFolderModel';
import $ from 'jquery';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
import { SelectHomeworkModel } from '../common/professorModel/selectHomeworkModel';
import { getProfessorFolderFileList } from '../../actions/professorDriveAction';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;


class CreateNotesDetails extends Component {

  constructor(props) {
    super(props);
    this.onGetFile = this.onGetFile.bind(this);
    const pro = this.props.location.state ? this.props.location.state.data : "";;
    this.state = {
      classes: [],
      subjects: [],
      batches: [],
      selectedClassId: '',
      selectedClassname: '',
      selectedSubjectId: '',
      selectedSubjectname: ' ',
      selectedBatchId: '',
      selectedBatchname: '',
      selectedFolderName: 'Folder Name',
      selectedFolderId: '',
      folderArr: [],
      notes: {
        "topic": "",
        "title": "",
        "class_id": "",
        "subject_id": "",
        "batch_id": "",
        "share_date": moment(),
      },
      files: [],
      flags: [],
      loders: [],
      error: {
        isClassSelected: false,
        isSubjectSelected: false,
        isBatchSelected: false,
        isTitleVisible: false,
        isTopicVisible: false,
        isFolderVisible: false,
        isPublishDateVisible: false,
        isFileUpload: false,

      },
      fileSelection: "both",
      cls: {},
      subject: {},
      folder: {},
      driveFiles: [],
      isAssignNoteClick: false,
      isBatchVisible: false,
      isClassAvailable: false,
      isSubjectAvailable: false,
      instituteId: 0,
      driveNoteFlag: false,
      fileSizeErrorMsg: false,
      isFileSizeValid: false,
      fileUploadingStatusFlag:false
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
    const navigatedData = this.props.location.state ? this.props.location.state.data : "";


    this.setState({ instituteId: this.props.instituteId })
    if (navigatedData.driveNoteFlag) {
      this.setState({
        driveNoteFlag: navigatedData.driveNoteFlag,
        selectedClassname: navigatedData.selectedclassdata.class_name,
        selectedSubjectname: navigatedData.selectedsubjectdata.subject_name,
        selectedFolderName: navigatedData.selectedfolderdata.folder_name,
        selectedClassId: navigatedData.selectedclassdata.class_id,
        selectedSubjectId: navigatedData.selectedsubjectdata.subject_id,
        selectedFolderId: navigatedData.selectedfolderdata.subject_folder_id
      })
    } else {
      this.setState({
        selectedClassname: navigatedData.class_name,
        selectedSubjectname: navigatedData.subject_name,

        selectedClassId: navigatedData.class_id,
        selectedSubjectId: navigatedData.subject_id,
        selectedBatchname: navigatedData.batch_name,
        selectedBatchId: navigatedData.batch_id
      })
      this.getClassSubjectBatchDropDown(navigatedData)
    }
  }

  getClassSubjectBatchDropDown(navigatedData) {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getClassesSubjectBatches(data).then(() => {

      let res = this.props.classesSubjectsBatches;
      if (res && res.status === 200) {
        if (res.data.status == 500) {
          this.setState({ isClassAvailable: true, isSubjectAvailable: true, isBatchVisible: true, classesSubjectsBatches: res.data.response, classes: res.data.response.classes, })
        }
        else {
          this.setState({
            classesSubjectsBatches: res.data.response,
            classes: res.data.response.classes,
          }, () => {
            if (this.state.classes && this.state.classes.length > 0) {
              this.state.classes.map((data, index) => {
                if (navigatedData.class_name === data.class_name) {
                  this.setState({
                    selectedClassId: data.class_id,
                    cls: { class_name: navigatedData.class_name, class_id: data.class_id }
                  }, () => {
                    this.getSubject();
                  });
                }
              })
            }
          })
        }
      }
    })
  }

  getSubject() {
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
        if (res.data.response.subjects.length == 0) {
          this.setState({ isSubjectAvailable: true, subjects: res.data.response.subjects })
        }
        else {
          this.setState({ subjects: res.data.response.subjects }, () => {
            this.state.subjects.map((data, index) => {
              if (this.state.selectedSubjectname === data.subject_name) {
                this.setState({ selectedSubjectId: data.subject_id, subject: { subject_name: data.subject_name, subject_id: data.subject_id } }, () => {
                  this.getBatches();
                  this.getFolderList();
                });
              }
            })
          })
        }
      }
    })
  }

  getFolderList() {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: { subject_id: this.state.selectedSubjectId }
    }
    this.props.getFolderNameList(apiData).then(() => {
      let res = this.props.folderList;
      if (res && res.status == 200) {
        this.setState({ folderArr: res.data.response }, () => {
          if (this.state.folderArr && this.state.folderArr.length > 0) {
            let { error } = this.state;
            error = { ...error, isFolderVisible: false };
            let folder_name = this.state.folderArr[0].folder_name;
            folder_name = this.state.folderArr[0].folder_name;

            this.setState({
              error,
              isFolderVisible: false,
              selectedFolderName: this.state.folderArr[0].folder_name,
              selectedFolderId: this.state.folderArr[0].subject_folder_id,
              folder: { folder_name: folder_name, folder_id: this.state.folderArr[0].subject_folder_id }
            });
          }
        });
      }
    })
  }

  getBatches() {
    let apiData = {
      payload: {
        "subject_id": this.state.selectedSubjectId,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorBatch(apiData).then(() => {
      let res = this.props.professorBatches;
      if (res.batches.length == 0) {
        this.setState({ isBatchVisible: true, batches: res.batches });
      }
      else {
        this.setState({ batches: res.batches, isBatchVisible: false }, () => {
          this.state.batches.map((data, index) => {
            if (this.state.selectedBatchname === data.batch_name) {
              this.setState({ selectedBatchId: data.batch_id });
            }
          })
        })
      }
    })
  }

  onSelectClass(cls) {

    let { error } = this.state;
    error = { ...error, isClassSelected: false }
    this.setState({
      selectedClassId: cls.class_id,
      selectedClassname: cls.class_name,
      error,
      cls: { class_name: cls.class_name, class_id: cls.class_id }
    }, () => {
      this.getSubject();
    })
  }

  onSelectSubject(subject) {
    let { error } = this.state;
    error = { ...error, isSubjectSelected: false };
    this.setState({
      error,
      selectedSubjectId: subject.subject_id,
      selectedSubjectname: subject.subject_name,
      subject: { subject_name: subject.subject_name, subject_id: subject.subject_id }
    }, () => {
      this.getBatches();
      this.getFolderList();
    });
  }

  onSelectBatch(batch) {
    let { error } = this.state;
    error = { ...error, isBatchSelected: false }
    this.setState({
      error,
      selectedBatchId: batch.batch_id,
      selectedBatchname: batch.batch_name,
      isSelectedBatchnameVisible: false
    });
  }

  onSelectFolder(folder) {
    let { error } = this.state;
    error = { ...error, isFolderVisible: false };
    this.setState({
      error,
      selectedFolderName: folder.folder_name,
      selectedFolderId: folder.subject_folder_id,
      folder: { folder_name: folder.folder_name, folder_id: folder.subject_folder_id }
    });
  }

  folderCreate() {
    errorToste("Please Select Class and Subject")
  }

  newFolder(FolderName) {
    let { folderArr, homework } = this.state;
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "folder_name": FolderName,
        "subject_id": this.state.selectedSubjectId,
      }
    }
    this.props.createFolderName(apiData).then(() => {
      let res = this.props.createFolder;

      if (res && res.data.status == 200) {
        folderArr.push(res.data.response);

        this.setState({
          folderArr,
          selectedFolderId: res.data.response.subject_folder_id,
          selectedFolderName: res.data.response.folder_name,
          folder: { folder_name: res.data.response.folder_name, folder_id: res.data.response.subject_folder_id }
        }, () => {
          successToste("Folder Created Successfully");
        });
        $("#createfolder .close").click();
      }
      else if (res && res.data.status == 500) {
        errorToste("Folder Name Already Exist");
        $("#createfolder .close").click();
      }
      else if (res == null) {
        errorToste("Something Went Wrong");
        $("#createfolder .close").click();
      }
    })
  }

  onInputChnage(property, errorProperty, event) {
    let { notes, error } = this.state;
    error = { ...error, [errorProperty]: false };
    notes = { ...notes, [property]: event.target.value };
    this.setState({ notes, error });
  }

  validate() {
    let { selectedClassId, selectedSubjectId, selectedFolderId, selectedBatchId, notes, error, files } = this.state;
    let isValidForm = true;
    if (this.state.driveNoteFlag == true) {
      if (!selectedClassId) {
        error = { ...error, isClassSelected: true };
        isValidForm = false;
      }
      if (!selectedSubjectId) {
        error = { ...error, isSubjectSelected: true };
        isValidForm = false;
      }
      if (!notes.title) {
        error = { ...error, isTitleVisible: true };
        isValidForm = false;
      }
      if (!selectedFolderId) {
        error = { ...error, isFolderVisible: true };
        isValidForm = false;
      }
      if (this.state.fileSelection == "both") {
        error = { ...error, isFileUpload: true };
        isValidForm = false;
      }
      if (this.state.fileSelection == "local") {
        if (this.state.files.length == 0) {
          error = { ...error, isFileUpload: true };
          isValidForm = false;
        }
      }

      this.setState({ error });
      return isValidForm;
    } else {
      if (!selectedClassId) {
        error = { ...error, isClassSelected: true };
        isValidForm = false;
      }

      if (!selectedSubjectId) {
        error = { ...error, isSubjectSelected: true };
        isValidForm = false;
      }
      if (!selectedBatchId) {
        error = { ...error, isBatchSelected: true };
        isValidForm = false;
      }
      if (!notes.title) {
        error = { ...error, isTitleVisible: true };
        isValidForm = false;
      }
      if (!selectedFolderId) {
        error = { ...error, isFolderVisible: true };
        isValidForm = false;
      }
      if (this.state.fileSelection == "both") {
        error = { ...error, isFileUpload: true };
        isValidForm = false;
      }
      if (this.state.fileSelection == "local") {
        if (this.state.files.length == 0) {
          error = { ...error, isFileUpload: true, fileSizeErrorMsg: false };
          isValidForm = false;
        }
      }


      this.setState({ error });
      return isValidForm;
    }
  }

  saveNotesToDrive() {
    let flagset = false;
    if(this.validate() == true){
      flagset = true;
    }

    this.setState({fileUploadingStatusFlag:flagset},()=>{
    const navigatedData = this.props.location.state ? this.props.location.state.data : "";
    let { fileSelection } = this.state;
    const isValidForm = this.validate();

    if (!isValidForm) {
      return;
    }
    else {

      let apiData = {
        payload: {
          "topic": this.state.notes.title,
          "title": this.state.notes.title,
          "class_id": this.state.selectedClassId,
          "subject_id": this.state.selectedSubjectId,
          "subject_folder_id": this.state.selectedFolderId,

          "share_date": moment(),
          isDrive: true
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.createNotesDetail(apiData).then(() => {

        let res = this.props.createNotes;

        if (res && res.data.status == 200) {
          let length = this.state.files.length;
          let count = 0;
          if (fileSelection == "local") {
            this.state.files.map((file, index) => {
              let { loders } = this.state;
              const formData = new FormData();
              formData.append('filename', file);
              formData.append('class_id', this.state.selectedClassId);
              formData.append('subject_id', this.state.selectedSubjectId);

              formData.append('subject_folder_id', this.state.selectedFolderId);
              formData.append('notes_id', res.data.response.notes_id);
              // formData.append('batch_notes_id', res.data.response.batch_notes_id);
              formData.append('driveFlag', this.state.flags[index]);
              let apiData = {
                institude_id: this.props.instituteId,
                branch_id: this.props.branchId,
                token: this.props.token,
                payload: formData,
              }
              loders[index] = true;
              this.setState({ loders }, () => {
                this.props.uploadNoteFileToDrive(apiData).then(() => {
                  let res = this.props.notesFileUploadToDrive

                  count++;
                  loders[index] = false;
                  this.setState({ loders }, () => {

                  });
                  if (length === count) {
                    this.props.history.push({
                      pathname: '/app/professor-drive',
                      state: { data: navigatedData }
                    });
                  }
                })
              })
            })
          }
        }
      })
    }
  })
  }

  assignNotes() {
    let flagset = false;
    if(this.validate() == true){
      flagset = true;
    }
    
    this.setState({fileUploadingStatusFlag:flagset},()=>{
    const navigatedData = this.props.location.state ? this.props.location.state.data : "";
    let { fileSelection } = this.state;
    const isValidForm = this.validate();

    if (!isValidForm) {
      return;
    }
    else {
      let apiData = {
        payload: {
          "topic": this.state.notes.title,
          "title": this.state.notes.title,
          "class_id": this.state.selectedClassId,
          "subject_id": this.state.selectedSubjectId,
          "subject_folder_id": this.state.selectedFolderId,
          "batch_id": this.state.selectedBatchId,
          "share_date": moment(),
          isDrive: false
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,

      }

      this.setState({ isAssignNoteClick: true })
      this.props.createNotesDetail(apiData).then(() => {
        let res = this.props.createNotes;
        let length = this.state.files.length;
        let count = 0;
        if (res && res.status == 200) {

          if (fileSelection == "local") {
            this.state.files.map((file, index) => {
              let { loders } = this.state;
              const formData = new FormData();
              formData.append('filename', file);
              formData.append('class_id', this.state.selectedClassId);
              formData.append('subject_id', this.state.selectedSubjectId);
              formData.append('batch_id', this.state.selectedBatchId);
              formData.append('subject_folder_id', this.state.selectedFolderId);
              formData.append('notes_id', res.data.response.notes_id);
              formData.append('batch_notes_id', res.data.response.batch_notes_id);
              formData.append('driveFlag', this.state.flags[index]);
              let apiData = {
                institude_id: this.props.instituteId,
                branch_id: this.props.branchId,
                token: this.props.token,
                payload: formData,
              }
              loders[index] = true;
              this.setState({ loders }, () => {

                this.props.notesFileUpload(apiData).then(() => {
                  count++;
                  loders[index] = false;
                  this.setState({ loders }, () => {

                  });
                  if (length === count) {
                    this.props.history.push({
                      pathname: '/app/notes-directory',
                      state: { data: navigatedData }
                    });
                  }
                })
              })
            })
          }
        }
        successToste("Notes Added Successfully");
      })
    }
  })
  }

  onGetFile(e) {
    let { files, flags, loders, error } = this.state;
    var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : "";
    if (fileSize > 20) {
      this.setState({ fileSizeErrorMsg: true })
    } else {
      files.push(e.target.files[0]);
      flags.push("True")
      loders.push(false);
      error = { ...error, isFileUpload: false }
      this.setState({
        files,
        flags,
        loders,
        error,
        fileSelection: "local", fileSizeErrorMsg: false
      });
    }
  }

  onSaveDrive(index) {
    let { flags } = this.state;
    if (this.state.flags[index] == "True") {
      flags[index] = "False";
    } else {
      flags[index] = "True";
    }
    this.setState({ flags }, () => {

    })
  }

  onDeleteFile(index) {
    let { files, flags, driveFiles, fileSelection } = this.state;
    if (fileSelection === "local") {
      files.splice(index, 1);
      flags.splice(index, 1);
      this.setState({ files, flags, fileSizeErrorMsg: false }, () => {

      });
    }
    if (fileSelection === "drive") {
      driveFiles.splice(index, 1);
      this.setState({ driveFiles });
    }
  }

  onChanageNotesPage() {
    const navigatedData = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: 'notes-directory',
      state: { data: navigatedData }
    })
  }

  gotoDrivePage() {
    this.props.history.push('/app/professor-drive')
  }

  uploadDriveFile(files) {
    let { fileSelection, driveFiles, error } = this.state;
    error = { ...error, isFileUpload: false }
    this.setState({ fileSelection: "drive", driveFiles: files, error });
  }

  renderSubmitButton() {
    if (this.state.driveNoteFlag == true) {
      return (
        <div className="divider-block text--right">
          <button className="c-btn grayshade" onClick={this.gotoDrivePage.bind(this)}>Back</button>
          <button className="c-btn prime" disabled={this.state.isAssignNoteClick} onClick={this.saveNotesToDrive.bind(this)}>Save Notes To Drive</button>
        </div>)
    } else {
      return (
        <div className="divider-block text--right">
          <button className="c-btn grayshade" onClick={this.onChanageNotesPage.bind(this)}>Back</button>
          <button className="c-btn prime" disabled={this.state.isAssignNoteClick} onClick={this.assignNotes.bind(this)}>Assign Notes</button>
        </div>
      )
    }
  }

  renderCreateFolderButton() {
    let { error } = this.state;
    if (this.state.driveNoteFlag == true) {
      return (
        <div className="form-group cust-fld">
          <div className="clearfix">
            <label className="pull-left">Folder <sup>*</sup></label>
          </div>
          <div className="dropdown">
            <input type="text" className="form-control" value={this.state.selectedFolderName} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="form-group cust-fld">
          <div className="clearfix">
            <label className="pull-left">Folder <sup>*</sup></label>
            {this.state.selectedSubjectId ?
              <button className="link--btn pull-right" data-toggle="modal" data-target="#createfolder">Create New Folder</button>
              : <button className="link--btn pull-right" onClick={this.folderCreate.bind(this)}>Create New Folder</button>}
          </div>
          <div className="dropdown">
            <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.state.selectedFolderName}
            </button>
            <ul className="dropdown-menu" style={{ overflow: "auto", height: "100px" }}>
              {this.renderFolder()}
            </ul>
          </div>
          {error.isFolderVisible ? <label className="help-block" style={{ color: "red" }}>Please Select Folder</label> : <br />}
        </div>
      )
    }
  }

  renderClasses() {
    if (this.state.classes && this.state.classes.length > 0) {
      return this.state.classes.map((cls, index) => {
        return (
          <li key={"key" + index}>
            <a onClick={this.onSelectClass.bind(this, cls)} className="dd-option">{cls.class_name}</a>
          </li>
        )
      })
    }
  }

  renderSubjects() {
    if (this.state.subjects && this.state.subjects.length > 0) {
      return this.state.subjects.map((subject, index) => {
        return (
          <li key={"key" + index}>
            <a onClick={this.onSelectSubject.bind(this, subject)} className="dd-option">{subject.subject_name}</a>
          </li>
        )
      })
    }
  }

  renderBatches() {
    if (this.state.batches && this.state.batches.length > 0) {
      return this.state.batches.map((batch, index) => {
        return (
          <li key={"key" + index}>
            <a href="javascript:void(0);" onClick={this.onSelectBatch.bind(this, batch)} className="dd-option">{batch.batch_name}</a>
          </li>
        )
      })
    }
  }

  renderFolder() {
    if (this.state.folderArr && this.state.folderArr.length > 0) {
      return this.state.folderArr.map((folder, index) => {
        return (
          <li key={"key" + index}>
            <a href="javascript:void(0);" onClick={this.onSelectFolder.bind(this, folder)} className="dd-option">{folder.folder_name}</a>
          </li>
        )
      })
    }
  }

  renderFileName() {
    let { fileSelection, driveFiles } = this.state;
    if (fileSelection == "local") {
      if (this.state.files && this.state.files.length > 0) {
        return this.state.files.map((file, index) => {
          return (
            <div key={"file" + index} className="c-upfile">
              <div className="c-upfile__name" >{file ? file.name : ''}
                <ClipLoader
                  className={override}
                  style={{ marginRight: "5%" }}
                  sizeUnit={"px"}
                  size={20}
                  color={'#123abc'}
                  loading={this.state.loders[index]}
                />
              </div>
              <div className="c-upfile__opt">
                {this.state.driveNoteFlag != true ? <label htmlFor={"check-f1" + index} className="custome-field field-checkbox">
                  <input type="checkbox" name="check-one" id={"check-f1" + index} value="checkone" onChange={this.onSaveDrive.bind(this, index)} checked={this.state.flags[index] == "True" ? true : false} />
                  <i></i> <span>Save to Drive</span>
                </label> : ""}
                <button className="btn-delete" onClick={this.onDeleteFile.bind(this, index)} ><i className="icon cg-times"></i></button>
              </div>
            </div>
          )
        })
      }
    }
  }

  renderFileSelectionPopup() {
    let { fileSelection } = this.state;
    if (fileSelection === "both") {
      return (
        <div className="c-file-uploader">
          <span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
          <span className="uploader__info">or</span>
          <button className="uploader__btn"><input type="file" accept="application/pdf" onChange={this.onGetFile} /></button>
        </div>
      )
    }
    if (fileSelection === "local") {
      return (
        <div className="c-file-uploader">
          <span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
          <span className="uploader__info">or</span>
          {this.state.files.length == 0 ?
            <button className="uploader__btn"><input type="file" accept="application/pdf" onChange={this.onGetFile} /></button>
            : <span style={{ color: "red", marginLeft: "60px" }}>{"Can Add Only One File"}</span>}
        </div>
      )
    }
  }

  render() {
    let { error } = this.state;
    return (
      <div className="c-container clearfix">
        <div className="clearfix">
          <div className="c-brdcrum">
            {this.state.driveNoteFlag == true ?
              <a onClick={this.gotoDrivePage.bind(this)} className="linkbtn hover-pointer" >Back to Drive</a> :
              <a onClick={this.onChanageNotesPage.bind(this)} className="linkbtn hover-pointer" >Back to All Notes</a>}
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">New Notes</span>
              {this.state.driveNoteFlag == true ?
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname}-{this.state.selectedSubjectname}</span> :
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname}-{this.state.selectedSubjectname}-{this.state.selectedBatchname}</span>}
                {this.state.fileUploadingStatusFlag == true? <span style={{color:"red"}}> File is uploading please Wait!</span>:""}
            </div>
            {this.renderSubmitButton()}

          </div>
        </div>
        <div className="c-container__data">
          <div className="card-container type--2">
            <div className="c-card sect--1" style={{ width: "800px" }}>
              <div className="block-title st-colored noborder">NOTES DETAILS</div>
              <div className="form-group cust-fld">
                <label>Notes Title <sup>*</sup></label>
                <input type="text" className="form-control" value={this.state.notes.title} onChange={this.onInputChnage.bind(this, "title", "isTitleVisible")} placeholder="Enter Title" />
                {error.isTitleVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Notes Title</label> : <br />}
              </div>

              {this.renderCreateFolderButton()}
            </div>
            <div className="c-card sect--2">

              <div className="row">

                <div className="col-md-6">
                  <div className="form-group cust-fld" style={{ width: "300px" }}>
                    <label>Notes File <sup>*</sup></label>
                    {this.renderFileSelectionPopup()}
                    {this.state.fileUploadingStatusFlag == true? <span style={{color:"red"}}> File is uploading please Wait!</span>:""}
                    {error.isFileUpload ? <label className="help-block" style={{ color: "red" }}>Please Select File</label> : <br />}
                    {this.state.fileSizeErrorMsg == true ? <label className="help-block" style={{ color: "red" }}>Please Select File Less than 20MB.</label> : <br />}
                    {/* {this.state.isFileSizeValid == true ? <label className="help-block" style={{ color: "red" }}>Please Select File Less than 20MB.</label> : <br />} */}
                    <div className="clearfix" style={{ width: "300px" }}>
                      {this.renderFileName()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <CreateNewFolderModel onCreateNewFolder={(data) => { this.newFolder(data) }} />
        <SelectHomeworkModel {...this.props} cls={this.state.cls} subject={this.state.subject} folder={this.state.folder} flag={"notes"} onSelectFiles={(data) => { this.uploadDriveFile(data) }} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, professorDrive, auth }) => ({
  newHomework: professor.newHomework,
  branchId: app.branchId,
  instituteId: app.institudeId,
  classesSubjectsBatches: professor.classesSubjectsBatches,
  folderList: professor.folderList,
  fileUpload: professor.fileUpload,
  createFolder: professor.createFolder,
  professorSubjects: professor.professorSubjects,
  professorBatches: professor.professorBatches,
  createNotes: professor.createNotes,
  notesUpload: professor.notesUpload,
  driveFile: professorDrive.driveFile,
  uploadDriveNotes: professor.uploadDriveNotes,
  token: auth.token,
  notesFileUploadToDrive: professor.notesFileUploadToDrive
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getClassesSubjectBatches,
      getFolderNameList,
      createFolderName,
      getProfessorSubjects,
      getProfessorBatch,
      createNotesDetail,
      notesFileUpload,
      getProfessorFolderFileList,
      notesDriveFileUploading,
      uploadNoteFileToDrive
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateNotesDetails)