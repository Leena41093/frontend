import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addHomework, getClassesSubjectBatches, getProfessorSubjects, getProfessorBatch, getFolderNameList,
  homeWorkFileUpload, createFolderName, homeWorkDriveFileUploading, createBatchHomeworkFromDrive
} from '../../actions/professorActions';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successToste, errorToste } from '../../constant/util';
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

class assignHomework extends Component {

  constructor(props) {
    super(props);
    this.onGetFile = this.onGetFile.bind(this);
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.state = {
      classes: [],
      subjects: [],
      batches: [],
      selectedClassId: '',
      selectedClassname: pro.class_name ? pro.class_name : 'Class Name',
      selectedSubjectId: '',
      selectedSubjectname: pro.subject_name ? pro.subject_name : 'Subject Name',
      selectedBatchId: '',
      selectedBatchname: pro.batch_name ? pro.batch_name : ' Batch Name',
      selectedFolderId: '',
      homework: {
        name: '',
        topic: '',
        folder_name: '',
        start_date: moment(),
        end_date: moment().add('days', 1),
        status: 'SUBMISSION_OPEN',
        total_marks: '',
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
      selectedHomeworkTitle: '',
      isHomeworkSelected: false,
      instituteId:0
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
        if (res && res.data.status == 500) {
          this.setState({ isClassAvailable: true, isSubjectAvailable: true, isBatchVisible: true, classesSubjectsBatches: res.data.response, classes: res.data.response.classes, })
        }
        else if (res && res.data.status == 200) {
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
    let { homework, selectedClassId, selectedSubjectId, selectedBatchId, selectedFolderId, selectedHomeworkTitle } = this.state;
    let isValidForm = true;


    if (!selectedHomeworkTitle) {
      this.setState({ isHomeworkSelected: true })
      isValidForm = false;
    }

    if ((homework.end_date <= homework.start_date) || !homework.end_date) {
      this.setState({ isEnddateVisisble: true });
      isValidForm = false;
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
    const pro = this.props.location.state ? this.props.location.state.data : "";
    let { fileSelection } = this.state;
    const isValidForm = this.validate();

    if (!isValidForm) {
      return;
    }
    else {
      let apiData = {
        payload: {
          class_id: this.state.selectedClassId,
          subject_id: this.state.selectedSubjectId,
          batch_id: this.state.selectedBatchId,
          homework_id: this.state.home_work_id,
          start_date: moment(),
          end_date: this.state.homework.end_date
        },
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }

      this.props.createBatchHomeworkFromDrive(apiData).then(() => {
        let res = this.props.newBatchHomeworkFromDrive;
        if (res && res.status == 200) {
          this.props.history.push({
            pathname: '/app/homework-directory',
            state: { data: pro }
          });

        }
        successToste("Homework Added Successfully");
      })
    }
  }

  getFolderList() {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: { subject_id: this.state.selectedSubjectId },
    }
    this.props.getFolderNameList(apiData).then(() => {
      let res = this.props.folderList;

      if (res && res.status == 200) {
        this.setState({ folderArr: res.data.response });
      }
    })
  }

  onGetFile(e) {
    let { files, flags, loders } = this.state;
    files.push(e.target.files[0]);

    flags.push("True")
    loders.push(false);
    this.setState({
      files,
      flags,
      loders,
      isfileSelected: false,
      fileSelection: "local"
    });
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
    if (property == 'topic') {
      this.setState({ isTopicVisible: false });
    }
    if (property == 'folder_name') {
      this.setState({ isFoldernameVisible: false });
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

  gotoNewHomeworkCreation() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({
      pathname: "newhomework-detail",
      state: { data: pro }
    })
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
      this.setState({ files, flags }, () => {

      });
    }
    if (fileSelection === "drive") {
      driveFiles.splice(index, 1);
      this.setState({ driveFiles });
    }
  }

  uploadFile(files) {

    let { fileSelection, driveFiles, homework } = this.state;
    if (files) {
      homework = { ...homework, name: files.title, topic: files.topic, folder_name: files.folder_name, total_marks: files.total_marks }
      this.setState({ selectedHomeworkTitle: files.title, home_work_id: files.home_work_id, fileSelection: "drive", driveFiles: files, isfileSelected: false, homework, isHomeworkSelected: false }, () => {
      });
    }
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
                <label htmlFor={"check-f1" + index} className="custome-field field-checkbox">
                  <input type="checkbox" name="check-one" id={"check-f1" + index} value="checkone" onChange={this.onSaveDrive.bind(this, index)} checked={this.state.flags[index] == "True" ? true : false} />
                  <i></i><span>Save to Drive</span>
                </label>
                <button className="btn-delete" onClick={this.onDeleteFile.bind(this, index)} ><i className="icon cg-times"></i></button>
              </div>
            </div>
          )
        })
      }
    }
    if (fileSelection == "drive") {
      if (driveFiles && driveFiles.length > 0) {
        return driveFiles.map((file, index) => {
          return (
            <div key={"file" + index} className="c-upfile">
              <div className="c-upfile__name" >{file.file_name}</div>
              <div className="c-upfile__opt">
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
          <button className="uploader__btn" aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp" >Select file from CleverGround Drive</button>
        </div>
      )
    }
    if (fileSelection === "drive") {
      return (
        <div className="c-file-uploader">
          <span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
          <span className="uploader__info">or</span>
          {this.state.driveFiles.length == 0 ?
            /* <button className="uploader__btn"><input type="file" onChange={this.onGetFile} /></button> */
            <button className="uploader__btn" aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp" >Select file from CleverGround Drive</button>
            : <span style={{ color: "red", marginLeft: "60px" }}>{"Can Add Only One File"}</span>}
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
          {/* <button className="uploader__btn" aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp" >Select file from CleverGround Drive</button> */}
        </div>
      )
    }
  }

  renderHomeworkDetail() {

    return (
      <div>
        <div className="form-group cust-fld">
          <div className="divider-container">

            <div className="divider-block text--left" style={{ width: "170px", }} >
              <label>Due Date <sup>*</sup></label>
              <div className="borderdatepicker">
                <DatePicker
                  className="form-control fld--date"
                  selected={this.state.homework.end_date ? moment(this.state.homework.end_date.endOf('day')) : moment()}

                  onChange={this.onChangeEndDate.bind(this)}
                />
              </div>
              {this.state.isEnddateVisisble ? <label className="help-block" style={{ color: "red" }}> End Date Should Be Greater Than Start Date</label> : <br />}
            </div>
          </div>
        </div>

        <div className="form-group static-fld">
          <label>Total Marks:</label>
          <span className="info-type">{this.state.homework ? this.state.homework.total_marks : ""}</span>
        </div>

        <div className="form-group static-fld">
          <label>Homework Title:</label>
          <span className="info-type">{this.state.homework ? this.state.homework.name : ""}</span>
        </div>

        <div className="form-group static-fld">
          <label>Homework Topic: </label>
          <span className="info-type">{this.state.homework ? this.state.homework.topic : ""}</span>
        </div>

        <div className="form-group static-fld">
          <label>Folder: </label>
          <span className="info-type" > {this.state.homework ? this.state.homework.folder_name : ""}</span>
        </div>
      </div>

    )
    // }
  }

  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "200px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a href="javascript:void(0)" onClick={this.backToAllHomework.bind(this)}>Back to All Homeworks</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">New Homework</span>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname} - {this.state.selectedSubjectname} - {this.state.selectedBatchname}</span>
            </div>
            <div className="divider-block text--right">
              <button onClick={this.backToAllHomework.bind(this)} className="c-btn grayshade">Back</button>
              <button onClick={this.onHomeworkAdd.bind(this)} disabled={this.state.isAssignHomeworkClick} className="c-btn prime">Assign Homework</button>
            </div>
          </div>
        </div>

        <div className="c-container__data">
          <div className="card-container type--2">
            <div className="c-card sect--1" style={{ width: "580px" }}>

              <div style={{ marginTop: "15px" }}>

                {/* {this.state.isSubjectSelected ? */}

               {this.state.selectedHomeworkTitle == "" ? 
               <div>
               <div className="c-quiz-btn">
                  
                  <button onClick={this.gotoNewHomeworkCreation.bind(this)} >
                    <i className="i-img"><img src="/images/icon_add.png" /></i>
                    Create new Homework
                  </button>
                </div>

                <div style={{ marginTop: "-8px", marginBottom: "19px", marginLeft: "68px" }}>
                  <span style={{ fontSize: "15px" }}>{"OR"}</span>
                </div></div> :""}

                <div className="c-quiz-btn">
                  {this.state.selectedHomeworkTitle ?
                    <div>
                      <button style={{ border: "1.5px solid #FFCC01" }} aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp">
                        <i className="i-img"><img src="/images/icon_folder.png" /></i>
                        {this.state.selectedHomeworkTitle}
                      </button> <span style={{ color: "green", fontSize: "14px" }}>{"Homework Topic is Selected"}</span>
                    </div>
                    :
                    <button aria-expanded="false" data-toggle="modal" data-target="#homeworkDrivePopUp">
                      <i className="i-img"><img src="/images/icon_folder.png" /></i>
                      {"Select Homework from CleverGround Drive"}
                    </button>
                  }

                </div>
                {/* {this.state.selectedQuizTopicname ? <button class="c-btn prime" id="edit" onClick={this.onGoToEditPage.bind(this)} >Edit</button> :""} */}

                {this.state.isHomeworkSelected ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Please Select Homework Topic</label> : <br />}

              </div>

            </div>

            <div className="c-card sect--2">
              <div style={{ marginTop: "15px" }} className="block-title st-colored noborder">HOMEWORK DETAILS</div>
              <div className="row">
                <div className="col-md-6">
                  {this.renderHomeworkDetail()}

                </div>

              </div>
            </div>
          </div>
        </div>
        <CreateNewFolderModel onCreateNewFolder={(data) => { this.newFolder(data) }} />
        <SelectHomeworkModel {...this.props} cls={this.state.cls} subject={this.state.subject} folder={this.state.folder} subject_id={this.state.selectedSubjectId} onSelectFiles={(data) => { this.uploadFile(data) }} flag={"homework"} />
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
  newBatchHomeworkFromDrive: professor.newBatchHomeworkFromDrive
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
      createBatchHomeworkFromDrive
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(assignHomework)