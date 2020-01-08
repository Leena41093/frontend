import React, { Component } from 'react';
import { CreateNewFolderModel } from '../../common/professorModel/createNewFolderModel';
import $ from 'jquery';
import { successToste, errorToste, infoToste } from '../../../constant/util';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

export class CreateQuizModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classes: [],
      subjects: [],
      batches: [],
      selectedClassId: '',
      selectedSubjectId: '',
      selectedBatchId: '',
      pro: {},
      selectedClassname: 'Class Name',
      selectedSubjectname: 'Subject Name',
      selectedBatchname: '',
      folderArr: [],
      folder_name: 'Folder Name',
      selectedFolderId: '',
      newQuiz: {
        quiz_title: '',
        quiz_topic: '',
        subject_folder_id: '',
        subject_id: '',
        class_id: '',
        quiz_type: 'upload_pdf',
        marks_for_each_question: 1,
        duration: '',
      },
      duration_type: '',
      error: {
        isClassnameVisible: false,
        isSubjectNameVisible: false,
        isQuizTitleVisible: false,
        isQuizTopicVisible: false,
        isFolderNameVisible: false,
        isMarksForQueVisible: false,
        isQuizTypeVisible: false,
        isDurationSelected: false,
      },
      flag: true,
      driveQuizFlag:false
    }
  }

  componentWillReceiveProps(props) {
    let { newQuiz } = this.state;

    if (this.props.pro) {
      newQuiz = {
        ...newQuiz, class_id: this.props.pro.class_id,
        subject_id: this.props.pro.subject_id, quiz_type: 'upload_pdf',
        marks_for_each_question: 1, quiz_title: '', quiz_topic: ''
      }
      this.setState({
        newQuiz, selectedClassname: this.props.pro.class_name,
        selectedSubjectname: this.props.pro.subject_name
      }, () => {
        if (this.state.flag) {
          if (this.state.newQuiz.subject_id) {
            this.setState({ flag: false })
            this.getFolderList();
          }
        }
      });
    }
    else if (props.datasend && props.datasend.fromdrive == true) {
      
      newQuiz = {
        ...newQuiz, class_id: props.datasend.selectedclassdata.class_id,
        subject_id: props.datasend.selectedsubjectdata.subject_id, quiz_type: 'upload_pdf',
        marks_for_each_question: 1, subject_folder_id: props.datasend.selectedfolderdata.subject_folder_id, quiz_title: '', quiz_topic: ''
      }
      this.setState({
        driveQuizFlag:props.datasend.fromdrive,
        newQuiz, selectedClassname: props.datasend.selectedclassdata.class_name,
        selectedSubjectname: props.datasend.selectedsubjectdata.subject_name, folder_name: props.datasend.selectedfolderdata.folder_name,
        selectedFolderId: props.datasend.selectedfolderdata.subject_folder_id
      }, () => {
        if (this.state.flag) {
          if (this.state.newQuiz.subject_id) {
            this.setState({ flag: false })

          }
        }
      });
    }
  }

  componentDidMount() {
    let { newQuiz } = this.state;
    let datafromdrive = this.props.datasend
    if (datafromdrive && datafromdrive.fromdrive == true) {
      return;
    }
    else {
      let data = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.getClassesSubjectBatches(data).then(() => {
        let res = this.props.classesSubjectsBatches;
        if (res && res.status == 200) {
          this.setState({
            classesSubjectsBatches: res.data.response,
            classes: res.data.response.classes,
          })
        }
      })
    }
  }

  getFolderList() {

    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: { subject_id: this.state.newQuiz.subject_id },
    }
    this.props.getFolderNameList(apiData).then(() => {
      let res = this.props.folderList;

      if (res && res.status == 200) {
        this.setState({ folderArr: res.data.response }, () => {
          if (this.state.folderArr && this.state.folderArr.length > 0) {
            let { newQuiz, error } = this.state;
            error = { ...error, isFolderNameVisible: false }


            let { folder_name } = this.state;
            folder_name = this.state.folderArr[0].folder_name;
            newQuiz = { ...newQuiz, subject_folder_id: this.state.folderArr[0].subject_folder_id }
            this.setState({
              newQuiz, folder_name: folder_name, error
            })
          }
        });
      }
    })
  }

  onSelectClass(cls) {

    let { newQuiz } = this.state;
    let class_id = newQuiz.class_id;
    let { error } = this.state;
    error = { ...error, isClassnameVisible: false }
    newQuiz = { ...newQuiz, class_id: cls.class_id }
    this.setState({
      newQuiz,
      selectedClassname: cls.class_name
    }, () => {
      let apiData = {
        payload: {
          "class_id": this.state.newQuiz.class_id,
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.getProfessorSubjects(apiData).then(() => {
        let res = this.props.professorSubjects;
        if (res && res.status == 200) {
          this.setState({ subjects: res.data.response.subjects, error })
        }
      })
    })
  }

  onSelectSubject(subject) {
    let { newQuiz } = this.state;
    let subject_id = newQuiz.subject_id;
    let { error } = this.state;
    error = { ...error, isSubjectNameVisible: false }
    newQuiz = { ...newQuiz, subject_id: subject.subject_id }
    this.setState({
      newQuiz,
      selectedSubjectname: subject.subject_name
    }, () => {
      if (this.state.newQuiz.subject_id != '') {
        this.getFolderList();
        this.setState({ folder_name: '', error })
      }
    })
  }

  onSelectFolder(folder) {
    let { newQuiz, error } = this.state;
    error = { ...error, isFolderNameVisible: false }
    let subject_folder_id = folder.subject_folder_id

    let { folder_name } = this.state;
    newQuiz = { ...newQuiz, subject_folder_id: folder.subject_folder_id }
    this.setState({
      newQuiz, folder_name: folder.folder_name, error
    })
  }

  handleAddNewQuiz() {

    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      let { newQuiz } = this.state;
      this.props.onAddnewQuiz(newQuiz)
    }
  }

  validate() {

    let { newQuiz, selectedClassId, selectedSubjectId, error, selectedFolderId } = this.state;
    let isValidForm = true;
    if (!newQuiz.class_id) {
      error = { ...error, isClassnameVisible: true };
      isValidForm = false;
    }
    if (!newQuiz.subject_id) {
      error = { ...error, isSubjectNameVisible: true };
      isValidForm = false;
    }
    if (!newQuiz.quiz_title) {
      error = { ...error, isQuizTitleVisible: true };
      isValidForm = false;
    }
    // if (!newQuiz.quiz_topic) {
    //   error = { ...error, isQuizTopicVisible: true };
    //   isValidForm = false;
    // }
    if (!newQuiz.subject_folder_id) {
      error = { ...error, isFolderNameVisible: true };
      isValidForm = false;
    }
    if (!newQuiz.marks_for_each_question) {

      error = { ...error, isMarksForQueVisible: true };
      isValidForm = false;
    }
    if (newQuiz.marks_for_each_question == 0) {
      error = { ...error, isMarksForQueVisible: true };
      isValidForm = false;
    }
    if (!newQuiz.duration) {
      error = { ...error, isDurationSelected: true, };
      isValidForm = false;
    }
    if (newQuiz.duration == 0) {
      error = { ...error, isDurationSelected: true };
      isValidForm = false;
    }
    if (!newQuiz.quiz_type) {
      error = { ...error, isQuizTypeVisible: true };
      isValidForm = false;
    }
    this.setState({ error });
    return isValidForm;
  }

  onInputChange(property, errorProperty, event) {
    let { newQuiz, error } = this.state;
    let quiz_title = newQuiz.quiz_title;
    newQuiz = { ...newQuiz, [property]: event.target.value }
    error = { ...error, [errorProperty]: false }
    this.setState({ newQuiz, error })
  }

  folderCreate() {
    errorToste("Please Select Class and Subject")
  }

  newFolder(FolderName) {

    var { folderArr, newQuiz, error } = this.state;
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "folder_name": FolderName,
        "subject_id": this.state.newQuiz.subject_id,
      }
    }
    this.props.createFolderName(apiData).then(() => {
      let res = this.props.createFolder;
      if (res && res.data.status == 200) {

        error = { ...error, isFolderNameVisible: false }
        let subject_folder_id = res.data.response.subject_folder_id

        newQuiz = { ...newQuiz, subject_folder_id: res.data.response.subject_folder_id }
        folderArr.push(res.data.response);


        this.setState({

          folderArr,
          folder_name: FolderName,
          selectedFolderId: res.data.response.subject_folder_id,
          folder: { folder_name: FolderName, folder_id: res.data.response.subject_folder_id },
          newQuiz, error
        }, () => {

          successToste("Folder Created Successfully");
        });
      }
      else if (res && res.data.status == 500) {
        errorToste(res.data.message);
        $("#createfolder .close").click();
      }
      else {
        errorToste("Something Went Wrong");
        $("#createfolder .close").click();
      }
    })
  }

  getCss() {
    let css = 'st-active'
    let { newQuiz } = this.state;
    if (newQuiz.quiz_type == 'type_questions') {
      return css
    }
    return;
  }

  getUploadCss() {
    let css = 'st-active'
    let { newQuiz } = this.state;
    if (newQuiz.quiz_type == 'upload_pdf') {
      return css
    }
    return;
  }

  handleCancel() {
    $("#createQuiz .close").click();
    let newQuiz = {
      quiz_title: '',
      quiz_topic: '',
      subject_folder_id: '',
      subject_id: '',
      class_id: '',
      quiz_type: 'type_questions',
      marks_for_each_question: 1
    }
    this.setState({ newQuiz })
  }

  onChangeQueType(type) {
    let { newQuiz } = this.state;
    newQuiz = { ...newQuiz, quiz_type: type }
    this.setState({ newQuiz })
  }

  onDurationChange(event) {
    let { newQuiz, error } = this.state;
    error = { ...error, isDurationSelected: false }
    newQuiz = { ...newQuiz, duration: event.target.value }
    this.setState({ newQuiz, error });
  }

  renderCreateFolderButton() {
    if (this.state.driveQuizFlag == true) {
      return (
        <div className="form-group cust-fld">
          <div className="clearfix">
            <label className="pull-left">Folder <sup>*</sup></label>
          </div>
          <div className="dropdown">
            <input type="text" className="form-control" value={this.state.folder_name} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="form-group cust-fld">
          <div className="clearfix">
            <label>Folder <sup>*</sup></label>
            {this.state.newQuiz.subject_id ?
              <button className="link--btn pull-right" data-toggle="modal" data-target="#createfolder">Create New Folder</button>
              : <button className="link--btn pull-right" onClick={this.folderCreate.bind(this)}>Create New Folder</button>}

          </div>
          <div className="dropdown">
            <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.state.folder_name}
            </button>

            <ul className="dropdown-menu" aria-labelledby="dLabel" style={{ marginTop: "-22px", height: "100px", overflow: "auto" }}>
              {this.renderFolder()}
            </ul>
            {this.state.error.isFolderNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Select Folder Name</label> : <br />}
          </div>
        </div>
      )
    }
  }

  renderClasses() {
    let { classes } = this.state;
    let classArr = [];
    if (this.state.classes && this.state.classes.length > 0) {
      classes.map((cls, index) => {
        classArr.push(
          <li key={"cls" + index}>
            <a onClick={this.onSelectClass.bind(this, cls)} className="dd-option">{cls.class_name}</a>
          </li>
        )
      })
    }
    return (classArr)
  }

  renderSubjects() {
    let subjectArr = [];
    let subjectList = this.state.subjects;
    if (subjectList && subjectList.length > 0) {
      subjectList.map((subject, index) => {
        subjectArr.push(
          <li key={"key" + index}>
            <a onClick={this.onSelectSubject.bind(this, subject)} className="dd-option">{subject.subject_name}</a>
          </li>
        )
      })
    }
    return (subjectArr);
  }

  renderFolder() {
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

  render() {

    return (
      <div className="modal fade custom-modal-sm width--lg" id="createQuiz" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCancel.bind(this)}><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">CREATE NEW QUIZ</h4>
            </div>
            <div className="modal-body">

              <div className="divider-container addBatch-container">

                <div className="divider-block">
                 
                  <span style={{ fontWeight: "bold", fontSize: "15px" }}>{this.state.selectedClassname} - {this.state.selectedSubjectname}</span>

                  <div className="form-group cust-fld">
                    <label>Quiz Title <sup>*</sup></label>
                    <input type="text" value={this.state.newQuiz.quiz_title} onChange={this.onInputChange.bind(this, "quiz_title", "isQuizTitleVisible")} className="form-control" placeholder="Quiz Title" />
                    {this.state.error.isQuizTitleVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Quiz Title</label> : <br />}
                  </div>

                  {this.renderCreateFolderButton()}
                </div>
                <div className="divider-block">


                  <div className="form-group cust-fld" style={{ marginTop: "42px" }}>
                    <label>Marks for each question <sup>*</sup></label>
                    <input type="Number" min="1" value={this.state.newQuiz.marks_for_each_question} onChange={this.onInputChange.bind(this, "marks_for_each_question", "isMarksForQueVisible")} className="form-control" placeholder="Enter Marks" />
                    {this.state.error.isMarksForQueVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Marks</label> : <br />}
                  </div>

                  <div className="form-group cust-fld" >
                    <label>Duration<sup>*</sup></label>
                    <input type="number" min="1" value={this.state.newQuiz.duration} className="form-control fld--time" placeholder="Enter End Time In Minutes" onChange={this.onDurationChange.bind(this)} />
                    {this.state.error.isDurationSelected ? <label className="help-block" style={{ color: "red" }}>Please Enter Duration</label> : <br />}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Select Quiz type</label>
                    <div className="c-btnRadio">
                      <button onClick={this.onChangeQueType.bind(this, 'upload_pdf')} className={this.getUploadCss()}>Upload PDF</button>
                      <button onClick={this.onChangeQueType.bind(this, 'type_questions')} className={this.getCss()}>Type Questions</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal" onClick={this.handleCancel.bind(this)}>Cancel</button>
                <button onClick={this.handleAddNewQuiz.bind(this)} className="c-btn primary">Create Quiz</button>
              </div>
            </div>
          </div>
        </div>
        <CreateNewFolderModel onCreateNewFolder={(data) => { this.newFolder(data) }} />
      </div>
    )
  }
}

export default (CreateQuizModal)