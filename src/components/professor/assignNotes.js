import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getClassesSubjectBatches, getProfessorSubjects, getProfessorBatch,
  getFolderNameList, createFolderName, createNotesDetail, notesFileUpload,
  notesDriveFileUploading, createBatchNotesFromDrive
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


class AssignNotes extends Component {

  constructor(props) {
    super(props);
    this.onGetFile = this.onGetFile.bind(this);
    const pro = this.props.location.state ? this.props.location.state.data : "";;
    this.state = {
      classes: [],
      subjects: [],
      batches: [],
      selectedClassId: '',
      selectedClassname: pro.class_name ? pro.class_name : 'Class Name',
      selectedSubjectId: '',
      selectedSubjectname: pro.subject_name ? pro.subject_name : 'Subject Name ',
      selectedBatchId: '',
      selectedBatchname: pro.batch_name ? pro.batch_name : 'Batch Name',
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
        isNotesSelected: false,
      },
      selectedNotesTitle: "",
      fileSelection: "both",
      cls: {},
      subject: {},
      folder: {},
      driveFiles: [],
      isAssignNoteClick: false,
      isBatchVisible: false,
      isClassAvailable: false,
      isSubjectAvailable: false,
      instituteId:0,
      notesId: '',
    }
  }

  componentWillReceiveProps(nextProps){
		
		let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){
    if(this.state.instituteId != nextProps.instituteId){
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
    this.setState({instituteId:this.props.instituteId});
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
        this.setState({ folderArr: res.data.response });
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

  onChangePublishDate(date) {
    let { notes } = this.state;
    notes = { ...notes, share_date: date };
    this.setState({ notes });
  }

  validate() {
    let { selectedClassId, selectedSubjectId, selectedFolderId, selectedBatchId, notes, error, files, selectedNotesTitle } = this.state;
    let isValidForm = true;

   
    if (selectedNotesTitle == '') {
      error = { ...error, isNotesSelected: true };
      isValidForm = false;
    }

    this.setState({ error });
    return isValidForm;
  }

  assignNotes() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    let { fileSelection } = this.state;
    const isValidForm = this.validate();

    if (!isValidForm) {
      return;
    }
    else {

      let apiData = {
        payload: {
          notes_id: this.state.notesId,
          class_id: this.state.selectedClassId,
          subject_id: this.state.selectedSubjectId,
          batch_id: this.state.selectedBatchId,
          share_date: moment()
        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.createBatchNotesFromDrive(apiData).then(() => {
        let res = this.props.newBatchNotesFromDrive;
        if (res && res.status == 200) {

          this.props.history.push({
            pathname: '/app/notes-directory',
            state: { data: pro }
          });
        }
        successToste("Notes Uploaded Successfully")
      });
    }
  }


  gotoNewNotesCreation() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: "create-notes",
      state: { data: pro }
    })
  }

  onGetFile(e) {
    let { files, flags, loders, error } = this.state;
    files.push(e.target.files[0]);
    flags.push("True")
    loders.push(false);
    error = { ...error, isFileUpload: false }
    this.setState({
      files,
      flags,
      loders,
      error,
      fileSelection: "local"
    });
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
      this.setState({ files, flags }, () => {

      });
    }
    if (fileSelection === "drive") {
      driveFiles.splice(index, 1);
      this.setState({ driveFiles });
    }
  }

  onChanageNotesPage() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: 'notes-directory',
      state: { data: pro }
    })
  }

  uploadDriveFile(files) {
    let { fileSelection, driveFiles, error, notes } = this.state;
    error = { ...error, isFileUpload: false, isNotesSelected: false }
    if (files) {
      notes = { ...notes, topic: files.notes_title, title: files.notes_topic, folder_name: files.folder_name }
      this.setState({ selectedNotesTitle: files.notes_title, notesId: files.notes_id, fileSelection: "drive", driveFiles: files, error, notes }, () => {
      });
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
                <label htmlFor={"check-f1" + index} className="custome-field field-checkbox">
                  <input type="checkbox" name="check-one" id={"check-f1" + index} value="checkone" onChange={this.onSaveDrive.bind(this, index)} checked={this.state.flags[index] == "True" ? true : false} />
                  <i></i> <span>Save to Drive</span>
                </label>
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
          {/* <button className="uploader__btn" aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp" >Select file from CleverGround Drive</button> */}
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

  renderNotesDetail() {
    let { error } = this.state;
    // if (this.state.selectedNotesTitle == '') {
    //   return;
    // } else {
    return (
      <div>
        

        <div className="form-group static-fld">
          <label>Notes Title: </label>
            <span className="info-type">{this.state.notes ? this.state.notes.title : ""}</span>

          {/* {error.isTitleVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Notes Title</label> : <br />} */}
        </div>

        <div className="form-group static-fld">
          <label>Notes Topic: </label>
            <span className="info-type">{this.state.notes ? this.state.notes.topic : ""}</span>
          {/* {error.isTopicVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Notes Topic</label> : <br />} */}
        </div>

        <div className="form-group static-fld">
          {/* <div className="clearfix"> */}
          <label>Folder: </label>
            <span className="info-type">{this.state.notes ? this.state.notes.folder_name : ""}</span>
         
        </div>
      </div>
    )
    // }
  }

  render() {
    let { error } = this.state;
    return (
      <div className="c-container clearfix">
        <div className="clearfix">
          <div className="c-brdcrum">
            <a onClick={this.onChanageNotesPage.bind(this)} className="linkbtn hover-pointer" >Back to All Notes</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">New Notes</span>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname} - {this.state.selectedSubjectname} - {this.state.selectedBatchname}</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.onChanageNotesPage.bind(this)}>Back</button>
              <button className="c-btn prime" disabled={this.state.isAssignNoteClick} onClick={this.assignNotes.bind(this)}>Assign Notes</button>
            </div>
          </div>
        </div>
        <div className="c-container__data">
          <div className="card-container type--2">
            <div className="c-card sect--1" style={{ width: "580px" }}>
              
              <div style={{ marginTop: "15px" }}>

                {/* {this.state.isSubjectSelected ? */}

                {this.state.selectedNotesTitle == "" ?
                <div>
                <div className="c-quiz-btn">
                  <button onClick={this.gotoNewNotesCreation.bind(this)} >
                    <i className="i-img"><img src="/images/icon_add.png" /></i>
                    Create new Notes
                      </button>
                </div>

                <div style={{ marginTop: "-8px", marginBottom: "19px", marginLeft: "68px" }}>
                  <span style={{ fontSize: "15px" }}>{"OR"}</span>
                </div></div> :""}

                <div className="c-quiz-btn">
                  {this.state.selectedNotesTitle ?
                    <div>
                      <button style={{ border: "1.5px solid #FFCC01" }} aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp">
                        <i className="i-img"><img src="/images/icon_folder.png" /></i>

                        {this.state.selectedNotesTitle}
                      </button> <span style={{ color: "green", fontSize: "14px" }}>{"Notes Topic is Selected"}</span>
                    </div>
                    :
                    <button aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp">
                      <i className="i-img"><img src="/images/icon_folder.png" /></i>

                      {"Select Notes from CleverGround Drive"}
                    </button>
                  }

                </div>
                {/* {this.state.selectedNotesTitle ? <button class="c-btn prime" id="edit" onClick={this.onGoToEditPage.bind(this)} >Edit</button> :""} */}
                {this.state.error.isNotesSelected ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Please Select Notes Topic</label> : <br />}
              </div>

            </div>
            <div className="c-card sect--2">
              <div style={{ marginTop: "15px" }} className="block-title st-colored noborder">NOTES DETAILS</div>
              <div className="row">
                <div className="col-md-6">
                  {this.renderNotesDetail()}


                </div>
                
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <CreateNewFolderModel onCreateNewFolder={(data) => { this.newFolder(data) }} />
        <SelectHomeworkModel {...this.props} cls={this.state.cls} subject={this.state.subject} folder={this.state.folder} flag={"notes"} subject_id={this.state.selectedSubjectId} onSelectFiles={(data) => { this.uploadDriveFile(data) }} />
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
  newBatchNotesFromDrive: professor.newBatchNotesFromDrive
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
      createBatchNotesFromDrive
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AssignNotes)