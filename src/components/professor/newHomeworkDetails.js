import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addHomework, getClassesSubjectBatches, getProfessorSubjects, getProfessorBatch, getFolderNameList,
  homeWorkFileUpload, createFolderName, homeWorkDriveFileUploading, createBatchHomeworkFromDrive,
  uploadFileToHomeDrive
} from '../../actions/professorActions';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successToste, errorToste, } from '../../constant/util';
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

class NewHomeworkDetails extends Component {

  constructor(props) {
    super(props);
    this.onGetFile = this.onGetFile.bind(this);
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.state = {
      classes: [],
      subjects: [],
      batches: [],
      selectedClassId: pro.class_id ? pro.class_id : '',
      selectedClassname: pro.class_name ? pro.class_name : 'Class Name',
      selectedSubjectId: pro.subject_id ? pro.subject_id : '',
      selectedSubjectname: pro.subject_name ? pro.subject_name : 'Subject Name',
      selectedBatchId: '',
      selectedBatchname: pro.batch_name ? pro.batch_name : 'Batch Name',
      selectedFolderId: pro.subject_folder_id ? pro.subject_folder_id : '',
      homework: {
        name: '',
        topic: '',
        folder_name: pro.folder_name ? pro.folder_name : 'Folder Name',
        start_date: moment(),
        end_date: moment().add('days', 1),
        status: 'SUBMISSION_OPEN',
        total_marks: 0,
      },
      isNameVisible: false,
      isTopicVisible: false,
      isFoldernameVisible: false,
      isStartdateVisisble: false,
      isEnddateVisisble: false,
      isSelectedClassnameVisible: false,
      isSelectedSubjectnameVisible: false,
      isSelectedBatchnameVisible: false,
      isfileSelected: false,
      isTotalmarksVisible: false,
      folderArr: [],
      isEnddatevalid: false,
      files: [],
      flags: [],
      loders: [],
      driveFiles: [],
      cls: {},
      subject: {},
      folder: {},
      home_work_id: "",
      fileSelection: "both",
      isAssignHomeworkClick: false,
      isBatchVisible: false,
      isClassAvailable: false,
      isSubjectAvailable: false,
      instituteId: 0,
      pro: {},
      fileSizeErrorMsg: false,
      isFileSizeValid: false,
      fileUploadingStatusFlag:false
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
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.setState({ instituteId: this.props.instituteId, pro });
    this.getClassSubjectBatchDropDown(pro)
  }

  getClassSubjectBatchDropDown(pro) {
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
                if (pro.class_name === data.class_name) {
                  this.setState({
                    selectedClassId: data.class_id,
                    cls: { class_name: pro.class_name, class_id: data.class_id }
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

  validate() {
    let { homework, selectedClassId, selectedSubjectId, selectedBatchId, selectedFolderId } = this.state;
    let isValidForm = true;

    if (!selectedClassId) {
      this.setState({ isSelectedClassnameVisible: true });
      isValidForm = false;
    }

    if (!selectedSubjectId) {
      this.setState({ isSelectedSubjectnameVisible: true });
      isValidForm = false;
    }
    if (this.state.pro.fromdrive != true) {
      if (!selectedBatchId) {
        this.setState({ isSelectedBatchnameVisible: true });
        isValidForm = false;
      }
    }
    if (homework.name.length === 0) {
      this.setState({ isNameVisible: true });
      isValidForm = false;
    }

    if (!selectedFolderId) {
      this.setState({ isFoldernameVisible: true });
      isValidForm = false;
    }
    if ((homework.end_date <= homework.start_date) || !homework.end_date) {

      this.setState({ isEnddateVisisble: true });
      isValidForm = false;
    }
    if (this.state.fileSelection == "both") {
      this.setState({ isfileSelected: true });
      isValidForm = false;
    }
    if (this.state.fileSelection == "local") {
      if (this.state.files.length == 0) {
        this.setState({ isfileSelected: true, fileSizeErrorMsg: false });
        isValidForm = false;

      }
    }

    if (this.state.fileSelection == "drive") {
      if (this.state.driveFiles.length == 0) {
        this.setState({ isfileSelected: true });
        isValidForm = false;

      }
    }
    return isValidForm;
  }

  onHomeworkAdd() {
    let flagset = false;
    if(this.validate() == true){
      flagset = true;
    }
    
    this.setState({fileUploadingStatusFlag:flagset},()=>{
      const pro = this.props.location.state ? this.props.location.state.data : "";
      let { fileSelection } = this.state;
      const isValidForm = this.validate();
  
      if (!isValidForm) {
        return;
      }
      else {
        let sendpayload = {};
        if (this.state.pro.fromdrive != true) {
          sendpayload = {
            name: this.state.homework.name,
            topic: this.state.homework.name,
            folder_name: this.state.homework.folder_name,
            start_date: moment(),
            end_date: this.state.homework.end_date,
            status: "SUBMISSION_OPEN",
            class_id: this.state.selectedClassId,
            subject_id: this.state.selectedSubjectId,
            batch_id: this.state.selectedBatchId,
            total_marks: this.state.homework.total_marks ? this.state.homework.total_marks : 0,
            isDrive: false
          }
        }
        else {
          sendpayload = {
            name: this.state.homework.name,
            topic: this.state.homework.name,
            folder_name: this.state.homework.folder_name,
            start_date: moment(),
            end_date: this.state.homework.end_date,
            status: "SUBMISSION_OPEN",
            class_id: this.state.selectedClassId,
            subject_id: this.state.selectedSubjectId,
            total_marks: this.state.homework.total_marks ? this.state.homework.total_marks : 0,
            isDrive: true
          }
        }
        let data = {
          payload: sendpayload,
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
  
        }
  
        this.setState({ isAssignHomeworkClick: true })
        this.props.addHomework(data).then(() => {
          let res = this.props.newHomework;
  
          let length = this.state.files.length;
          let count = 0;
          if (res && res.status == 200) {
            successToste("Homework Added Successfully");
  
            let data = res;
            if (fileSelection === "local") {
              this.state.files.map((file, index) => {
                let { loders } = this.state;
                const formData = new FormData();
                formData.append('filename', file);
                formData.append('class_id', this.state.selectedClassId);
                formData.append('subject_id', this.state.selectedSubjectId);
                if (this.state.pro.fromdrive != true) {
                  formData.append('batch_id', this.state.selectedBatchId);
                  formData.append('batch_homework_id', res.data.response.batch_homework_id);
                }
                formData.append('subject_folder_id', this.state.selectedFolderId);
                let hwid = ""
                if (this.state.pro.fromdrive != true) {
                  hwid = res.data.response.homework_id
                }
                else {
                  hwid = res.data.response.home_work_id
                }
                formData.append('home_work_id', hwid);
                formData.append('driveFlag', this.state.flags[index]);
                let apiData = {
                  institude_id: this.props.instituteId,
                  branch_id: this.props.branchId,
                  token: this.props.token,
                  payload: formData,
                }
                loders[index] = true;
                this.setState({ loders }, () => {
                  if (this.state.pro.fromdrive != true) {
                    this.props.homeWorkFileUpload(apiData).then(() => {
                      count++;
                      successToste("PDF Added Successfully");
  
                      loders[index] = false;
                      this.setState({ loders }, () => {
                        //successToste("PDF added successfully");
                      });
                      if (length === count) {
  
                        this.props.history.push({
                          pathname: '/app/homework-directory',
                          state: { data: pro }
                        });
                      }
                    })
                  }
                  else {
                    this.props.uploadFileToHomeDrive(apiData).then(() => {
                      let res = this.props.homeworkfileupload;
                      count++;
                      successToste("PDF Added Successfully");
  
                      loders[index] = false;
                      this.setState({ loders }, () => {
                        //successToste("PDF added successfully");
                      });
                      if (length === count) {
  
                        this.props.history.push({
                          pathname: '/app/professor-drive',
                          state: { data: pro }
                        });
                      }
                    })
                  }
  
                })
              })
            }
  
          }
        });
      }
    })
   
  }

  getFolderList() {
    if (this.state.pro.fromdrive != true) {
      let apiData = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: { subject_id: this.state.selectedSubjectId },
      }
      this.props.getFolderNameList(apiData).then(() => {
        let res = this.props.folderList;

        if (res && res.status == 200) {
          this.setState({ folderArr: res.data.response }, () => {
            if (this.state.folderArr && this.state.folderArr.length > 0) {
              let { homework } = this.state;
              let folder_name = this.state.folderArr[0].folder_name;
              folder_name = this.state.folderArr[0].folder_name;

              homework = { ...homework, folder_name };
              this.setState({
                homework,
                isFoldernameVisible: false,
                selectedFolderId: this.state.folderArr[0].subject_folder_id,
                folder: { folder_name: folder_name, folder_id: this.state.folderArr[0].subject_folder_id }
              });
            }
          });
        }
      })
    }
  }

  onGetFile(e) {

    let { files, flags, loders } = this.state;

    var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : ""
    if (fileSize > 20) {
      this.setState({ fileSizeErrorMsg: true, isfileSelected: false })
    } else {
      files.push(e.target.files[0]);

      flags.push("True")
      loders.push(false);
      this.setState({
        files,
        flags,
        loders,
        isfileSelected: false,
        fileSelection: "local", fileSizeErrorMsg: false
      });
    }

  }

  onSelectClass(class_id, name, event) {
    this.setState({
      selectedClassId: class_id,
      selectedClassname: name,
      isSelectedClassnameVisible: false,

    }, () => {
      this.setState({ cls: { class_name: this.state.selectedClassname, class_id: this.state.selectedClassId } })
      this.getSubject();
    })
  }

  onSelectSubject(subject) {
    this.setState({
      selectedSubjectId: subject.subject_id,
      selectedSubjectname: subject.subject_name, isSelectedSubjectnameVisible: false
    }, () => {
      this.setState({ subject: { subject_name: this.state.selectedSubjectname, subject_id: this.state.selectedSubjectId } })
      this.getBatches();
      this.getFolderList();
    });
  }

  onSelectBatch(batch) {
    this.setState({
      selectedBatchId: batch.batch_id,
      selectedBatchname: batch.batch_name,
      isSelectedBatchnameVisible: false
    });
  }

  onChangeEndDate(date) {
    let { homework } = this.state;
    homework = { ...homework, end_date: date };
    this.setState({ homework, isEnddateVisisble: false });
  }

  onGotoDrive() {
    this.props.history.push("/app/professor-drive")
  }

  backToAllHomework(event) {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: 'homework-directory',
      state: { data: pro }
    });
  }

  onSelectFolder(folder) {
    let { homework } = this.state;
    let folder_name = homework.folder_name;
    folder_name = folder.folder_name;

    homework = { ...homework, folder_name };
    this.setState({
      homework,
      isFoldernameVisible: false,
      selectedFolderId: folder.subject_folder_id,
      folder: { folder_name: folder_name, folder_id: folder.subject_folder_id }
    });
  }

  onInputChange(property, event) {
    if (property == 'class_name') {
      this.setState({ isSelectedClassnameVisible: false });
    }
    if (property == 'subject_name') {
      this.setState({ isSelectedSubjectnameVisible: false });
    }
    if (property == 'batch_name') {
      this.setState({ isSelectedBatchnameVisible: false });
    }
    if (property == 'name') {
      this.setState({ isNameVisible: false });
    }

    if (property == 'start_date') {
      this.setState({ isStartdateVisisble: false });
    }
    if (property == 'end_date') {
      this.setState({ isEnddateVisisble: false });
    }



    let { homework } = this.state;
    let name = homework.name;

    homework = { ...homework, [property]: event.target.value };
    this.setState({ homework });
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
        let folder_name = homework.folder_name;
        folder_name = FolderName;
        homework = { ...homework, folder_name };
        this.setState({
          homework,
          folderArr,
          selectedFolderId: res.data.response.subject_folder_id,
          folder: { folder_name: homework.folder_name, folder_id: res.data.response.subject_folder_id }
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

  uploadFile(files) {

    let { fileSelection, driveFiles, homework } = this.state;
    homework = { ...homework, name: files[0].title, topic: files[0].topic, folder_name: files[0].folder_name, total_marks: files[0].total_marks }
    this.setState({ home_work_id: files[0].home_work_id, fileSelection: "drive", driveFiles: files, isfileSelected: false, homework });
  }

  renderClasses() {
    if (this.state.classes && this.state.classes.length > 0) {
      return this.state.classes.map((classname, index) => {
        return (
          <li key={"key" + index}>
            <a onClick={this.onSelectClass.bind(this, classname.class_id, classname.class_name)} className="dd-option">{classname.class_name}</a>
          </li>
        )
      })
    }
  }

  renderFoldername() {
    if (this.state.folderArr && this.state.folderArr.length > 0) {
      return this.state.folderArr.map((folder, index) => {
        return (
          <li key={"key" + index}>
            <a onClick={this.onSelectFolder.bind(this, folder)} className="dd-option">{folder.folder_name}</a>
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
            <a onClick={this.onSelectBatch.bind(this, batch)} className="dd-option">{batch.batch_name}</a>
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
                {this.state.pro.fromdrive != true ? <label htmlFor={"check-f1" + index} className="custome-field field-checkbox">
                  <input type="checkbox" name="check-one" id={"check-f1" + index} value="checkone" onChange={this.onSaveDrive.bind(this, index)} checked={this.state.flags[index] == "True" ? true : false} />
                  <i></i><span>Save to Drive</span>
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
        <div className="c-file-uploader" >
          <span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
          <span className="uploader__info">or</span>

          <button className="uploader__btn"><input type="file" accept="application/pdf" onChange={this.onGetFile} /></button>
          {/* <button className="uploader__btn" aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp" >Select file from CleverGround Drive</button> */}
        </div>
      )
    }

    if (fileSelection === "local") {
      return (
        <div className="c-file-uploader" >
          <span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
          <span className="uploader__info">or</span>
          {this.state.files.length == 0 || this.state.fileSizeErrorMsg == true ?
            <button className="uploader__btn"><input type="file" accept="application/pdf" onChange={this.onGetFile} /></button>
            : <span style={{ color: "red", marginLeft: "60px" }}>{"Can Add Only One File"}</span>}
          {/* <button className="uploader__btn" aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp" >Select file from CleverGround Drive</button> */}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "200px" }}>
        <ToastContainer />
        <div className="clearfix">
          {this.state.pro.fromdrive != true ? <div className="c-brdcrum">
            <a className="linkbtn hover-pointer" onClick={this.backToAllHomework.bind(this)}>Back to All Homeworks</a>
          </div> : <div className="c-brdcrum">
              <a className="linkbtn hover-pointer" onClick={this.onGotoDrive.bind(this)}>Back to Drive</a>
            </div>}
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">New Homework</span>
              {this.state.selectedBatchname != "Batch Name" ? <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname}-{this.state.selectedSubjectname}-{this.state.selectedBatchname}</span> : <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname}-{this.state.selectedSubjectname}</span>}
              {this.state.fileUploadingStatusFlag == true ? <span style={{color:"red"}}> File is uploading please Wait!</span>:""}

            </div>
            <div className="divider-block text--right">
              {this.state.pro.fromdrive != true ? <div>
                <button onClick={this.backToAllHomework.bind(this)} className="c-btn grayshade">Back</button>
                <button onClick={this.onHomeworkAdd.bind(this)} disabled={this.state.isAssignHomeworkClick} className="c-btn prime">Assign Homework</button>
              </div> : <div className="c-brdcrum">
                  <button onClick={this.onGotoDrive.bind(this)} className="c-btn grayshade">Back</button>
                  <button onClick={this.onHomeworkAdd.bind(this)} disabled={this.state.isAssignHomeworkClick} className="c-btn prime">Save Homework to Drive</button>
                </div>}

            </div>
          </div>
        </div>

        <div className="c-container__data">
          <div className="card-container type--2">
            <div className="c-card sect--1" style={{ width: "980px" }}>
              <div className="block-title st-colored noborder">HOMEWORK DETAILS</div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group cust-fld">
                    <label>Homework Title <sup>*</sup></label>
                    <input type="text" value={this.state.homework.name} onChange={this.onInputChange.bind(this, "name")} className="form-control" placeholder="Enter Homework Title" />
                    {this.state.isNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Select Homework Title</label> : <br />}
                  </div>

                  <div className="form-group cust-fld" style={{ marginTop: "42px" }}>
                    <div className="clearfix">
                      <label className="pull-left">Folder <sup>*</sup></label>
                      {this.state.pro.fromdrive != true ? this.state.selectedSubjectId ?
                        <button className="link--btn pull-right" data-toggle="modal" data-target="#createfolder">Create New Folder</button> :
                        <button className="link--btn pull-right" onClick={this.folderCreate.bind(this)}>Create New Folder</button> : ""}
                    </div>
                    <div className="dropdown">

                      <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.homework.folder_name}
                      </button>

                      <ul className="dropdown-menu" style={{ marginTop: "-22px", overflow: "auto", height: "100px" }}>
                        {this.renderFoldername()}
                      </ul>
                      {this.state.isFoldernameVisible ? <label className="help-block" style={{ color: "red" }}>Please Select Folder Name</label> : <br />}
                    </div>

                  </div>
                </div>
                <div className="col-sm-6 ">
                  <div className="form-group cust-fld" >


                    <div className="divider-container" >

                      <div className="divider-block text--left" >
                        <label style={{ marginBottom: "-12px" }}>Due Date <sup>*</sup></label><br />
                        <div className="borderdatepicker">
                          <DatePicker
                            className="form-control fld--date"
                            selected={this.state.homework.end_date ? moment(this.state.homework.end_date.endOf('day')) : moment()}
                            onChange={this.onChangeEndDate.bind(this)}
                          />
                        </div>
                        {this.state.isEnddateVisisble ? <label className="help-block" style={{ color: "red" }}> End Date Should Be Greater Than Start Date</label> : <br />}
                        {/* {this.state.isEnddatevalid ? <label className="help-block" style={{ color: "red" }}> End date should be greater than start date</label> : <br />} */}

                      </div>


                    </div>

                    <div className="form-group cust-fld" style={{ marginTop: "35px" }}>
                      <label>Total Marks</label>
                      <input type="Number" min="1" value={this.state.homework.total_marks} onChange={this.onInputChange.bind(this, "total_marks")} className="form-control " placeholder="Enter Total Marks" />
                      {/* {this.state.isTotalmarksVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Total Marks</label> : <br />} */}
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="c-card sect--2">

              <div className="row">
                <div className="form-group cust-fld" style={{ marginTop: "52px" }}>
                  <div className="divider-container" >

                  </div>


                </div>

                <div className="col-md-6">

                  <div className="form-group cust-fld" style={{ width: "300px", marginTop: "-9px" }}>
                    <label>Homework File <sup>*</sup></label>
                    {this.renderFileSelectionPopup()}
                    {this.state.fileUploadingStatusFlag == true  ? <span style={{color:"red"}}> File is uploading please Wait!</span>:""}
                    {this.state.isfileSelected == true? <label className="help-block" style={{ color: "red" }}>Please Select File</label> : <br />}
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
        <CreateNewFolderModel onCreateNewFolder={(data) => { this.newFolder(data) }} />
        <SelectHomeworkModel {...this.props} cls={this.state.cls} subject={this.state.subject} folder={this.state.folder} onSelectFiles={(data) => { this.uploadFile(data) }} flag={"homework"} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, professorDrive, auth }) => ({

  classes: app.classes,
  subjects: app.subjects,
  batches: app.batches,
  newHomework: professor.newHomework,
  branchId: app.branchId,
  instituteId: app.institudeId,
  classesSubjectsBatches: professor.classesSubjectsBatches,
  folderList: professor.folderList,
  fileUpload: professor.fileUpload,
  createFolder: professor.createFolder,
  professorSubjects: professor.professorSubjects,
  professorBatches: professor.professorBatches,
  driveFile: professorDrive.driveFile,
  uploadingStatus: professor.uploadingStatus,
  token: auth.token,
  homeworkfileupload: professor.saveHomeworkToDrive
  // newBatchHomeworkFromDrive: professor.newBatchHomeworkFromDrive
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addHomework,
      getClassesSubjectBatches,
      getFolderNameList,
      homeWorkFileUpload,
      createFolderName,
      getProfessorSubjects,
      getProfessorBatch,
      getProfessorFolderFileList,
      homeWorkDriveFileUploading,
      createBatchHomeworkFromDrive,
      uploadFileToHomeDrive
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NewHomeworkDetails)