import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getClasses, getBatches, getSubjects, addClass, updateClassList, deleteClass, addSubject, updateSubjectList, updateClass, deleteSubject, updateSubject, addBatches, updateBatch, updateBatchList, deleteBatch } from '../../actions/index';
import { AddClassModal } from '../common/addClassModal';
import { AddSubjectModal } from '../common/addSubjectModal';
import { AddBatchModal } from '../common/addBatchModal';
import { Link, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { DeleteModal } from '../common/deleteModal';
import $ from "jquery";
import { Scrollbars } from 'react-custom-scrollbars';
import { checkProfileSelectedOrNot, profilePicUpload, getProfilePic, getSubjectBatchList, batchAutoCreation, getIsProfessorAdmin, getClassManagerFlow } from '../../actions/index';
import { ProfilePicModal } from '../common/profilepic';
class ClassManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedClassIndex: 0,
      selectedSubjectIndex: 0,
      selectedBatchIndex: 0,
      classes: [],
      subjects: [],
      batches: [],
      isClassModalVisible: false,
      isSubjectModalVisible: false,
      isBatchModalVisible: false,
      deleteObj: null,
      deleteSub: false,

      classPayload: {
        payload: {
          class_id: '',
          class_name: '',
          branch_id: '',

        },
        institude_id: ''
      },
      index: 0,
      obj: {},
      type: '',
      disableAddSubject: true,
      disableAddBatch: true,
      selectedClassNm: "",
      flag: true,
      instituteId: 0
    }
  }

  componentWillReceiveProps(nextProps) {

    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {

      if (this.state.instituteId != nextProps.instituteId) {
        this.setState({ instituteId: nextProps.instituteId }, () => {
          var datas = {
            institudeId: this.props.instituteId,
            branchId: this.props.branchId,
            token: this.props.token,
          }
          this.props.getIsProfessorAdmin(datas).then(() => {
            let res = this.props.ProfessorAdmin;
            if (res && res.data.status == 200 && res.data.response.isProfessorAdmin == false) {
              this.props.history.push("/app/dashboard");
            }
          })
        })
      }
    }
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId }, () => {
      if (this.props.instituteId != null && this.props.branchId != null && this.props.instituteId != "" && this.props.branchId != "") {
        const data = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token,
        }
        this.props.checkProfileSelectedOrNot(data).then(() => {
          var res = this.props.profileSelectedOrNot;
          if (res && res.data.status == 200) {
            if (res.data.response.profileIncomplete == true) {
              $(document).ready(function () {
                $("#openmodal").click();
              });
            }
          }
        })

        let apiData = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token,
        }
        this.props.getClassManagerFlow(apiData).then(() => {
          let resOfClassMangerFlow = this.props.classManagerFlow;


        })

        let Data = {
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
        }
        this.props.getClasses(Data).then(() => {
          let res = this.props.classes

          if (res && res.length > 0) {
            this.setState({ classes: res, disableAddSubject: false, disableAddBatch: true }, () => {
              this.state.classes[0].token = this.props.token,
                this.state.classes[0].institude_id = this.props.instituteId,
                this.props.getSubjects(this.state.classes[0]).then(() => {
                  
                  let resOfSubjects = this.props.subjects;
                  this.setState({ subjects: resOfSubjects, disableAddBatch: false }, () => {
                    if (this.state.subjects && this.state.subjects.length > 0) {
                      let data = this.state.subjects[0];
                      data['institude_id'] = this.props.instituteId;
                      data.token = this.props.token
                      this.props.getBatches(data).then(() => {
                        let res = this.props.batches

                        this.setState({ batches: res })
                      })
                    }
                  })
                })

            })
          }
        })
      }
    })
  }

  handleClassClick(cls, index) {
    cls.token = this.props.token;
    cls.institude_id = this.props.instituteId;
    this.props.getSubjects(cls).then(() => {
      let res = this.props.subjects;
      this.setState({
        selectedClass: cls.class_id, selectedClassIndex: index, selectedClassNm: cls.class_name,
        disableAddSubject: false, disableAddBatch: true, subjects: res
      });
    });

  }

  handleSubjectClick(sub, index) {

    let data = sub;
    data['institude_id'] = this.props.instituteId;
    data.token = this.props.token,
      this.props.getBatches(data).then(() => {
        let res = this.props.batches;
        this.setState({
          batches: res, selectedSubject: sub.subject_id, selectedSubjectIndex: index,
          selectedSubjectNm: sub.subject_name, disableAddBatch: false
        });
      });

  }

  handleBatchClick(batch, index) {
    this.setState({ selectedBatch: batch.batch_id, selectedBatchIndex: index });
    this.props.history.push('/app/batch-details')
  }

  handleEditClass(cls) {
    if (this.props.branchId == undefined) {
      toast.info("Select Branch Name ", {
        position: toast.POSITION.TOP_CENTER
      });
      $('.modal-overlay').fadeOut('fast', function () {
        $(this).remove();
      });
      $(".custome-modal").fadeOut('fast');
    }
    else {
      var self = this
      $('.modal-overlay').click(function () {
        $('.modal-overlay').fadeOut('fast', function () {
          $(this).remove();
        });
        $(".custome-modal").fadeOut('fast');
        self.setState({
          isClassModalVisible: false,
          isSubjectModalVisible: false,
          isBatchModalVisible: false,
        });
      });
      this.setState({
        isClassModalVisible: false,
        isSubjectModalVisible: false,
        isBatchModalVisible: false,
      }, () => {
        this.setState({
          editedClass: cls,
          isClassModalVisible: true,
          isSubjectModalVisible: false,
          isBatchModalVisible: false,
          selectedSubjectNm: "",
          selectedSubject: "",
          disableAddSubject: true,
          disableAddBatch: true
        });
      });

    }
  }

  handleEditSubject(sub) {
    if (this.state.selectedClassNm || this.state.classes.length > 0) {
      var self = this
      $('.modal-overlay').click(function () {
        $('.modal-overlay').fadeOut('fast', function () {
          $(this).remove();
        });
        $(".custome-modal").fadeOut('fast');
        self.setState({
          isClassModalVisible: false,
          isSubjectModalVisible: false,
          isBatchModalVisible: false,
        });
      });
      this.setState({
        editedSubject: sub,
        isClassModalVisible: false,
        isSubjectModalVisible: true,
        isBatchModalVisible: false
      });
    } else if (this.state.classes.length) {
      toast.info("Add Class Name ", {
        position: toast.POSITION.TOP_CENTER
      });

      $('.modal-overlay').fadeOut('fast', function () {
        $(this).remove();
      });
      $(".custome-modal").fadeOut('fast');
    }
    else {
      toast.info("select Class Name ", {
        position: toast.POSITION.TOP_CENTER
      });

      $('.modal-overlay').fadeOut('fast', function () {
        $(this).remove();
      });
      $(".custome-modal").fadeOut('fast');
    }
  }

  handleEditBatch(bts, index) {

    if (this.state.selectedSubjectNm || this.state.subjects.length > 0) {
      var self = this
      $('.modal-overlay').click(function () {
        $('.modal-overlay').fadeOut('fast', function () {
          $(this).remove();
        });
        $(".custome-modal").fadeOut('fast');
        self.setState({
          isClassModalVisible: false,
          isSubjectModalVisible: false,
          isBatchModalVisible: false,
        });
      });
      this.setState({
        editedBatch: bts,
        isClassModalVisible: false,
        isSubjectModalVisible: false,
        isBatchModalVisible: true
      });

    } else {
      errorToste("Add or Select Subject Name")
      $('.modal-overlay').fadeOut('fast', function () {
        $(this).remove();
      });
      $(".custome-modal").fadeOut('fast');
    }
  }

  onModalClose() {
    $('.modal-overlay').fadeOut('fast', function () {
      $(this).remove();
    });
    $(".custome-modal").fadeOut('fast');
    this.setState({
      isClassModalVisible: false,
      isSubjectModalVisible: false,
      isBatchModalVisible: false,
    });
  }

  onClassAdd(obj) {

    let data = {
      payload: {
        'class_name': obj.editedClass.class_name,
        'class_id': obj.editedClass.class_id,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    };
    let { isSubjectModalVisible, selectedClass, selectedClassNm, selectedSubject, selectedSubjectNm } = this.state;

    if (obj && obj.editedClass.class_id) {

      this.props.updateClass(data).then(() => {
        let updatedClass = this.props.updatedClass;

        if (updatedClass && updatedClass.class_id) {
          let classList = this.state.classes;
          let newClassList = [];
          classList.map((cls) => {

            if (cls.class_id === updatedClass.class_id) {

              newClassList = newClassList.concat(updatedClass);
            }
            else {

              newClassList = newClassList.concat(cls);
            }
          })
          // this.props.updateClassList(newClassList);
          successToste("Class Updated Successfully");
          this.setState({ isClassModalVisible: false, classes: newClassList });
        }
        else {
          let objValue = this.isEmpty(this.props.updatedClass)
          this.setState({
            isSubjectModalVisible: false
          })
          if (objValue == true) {
            errorToste("Class Name Already Exist");
          }
        }

      })
      $('.modal-overlay').fadeOut('fast', function () {
        $(this).remove();
      });
      $(".custome-modal").fadeOut('fast');
    }
    else {
      isSubjectModalVisible = true;
      this.props.addClass(data).then(() => {
        let newClass = this.props.newClass;

        if (newClass && newClass.class_id) {
          let classList = this.state.classes;
          classList = classList.concat(newClass);
          selectedClass = newClass.class_id;

          selectedClassNm = newClass.class_name;

          this.props.updateClassList(classList);
          this.setState({
            classes: classList,
            isClassModalVisible: false,
            selectedClass,
            selectedClassNm,

          }, () => { this.setState({ isSubjectModalVisible }) })
          this.handleClassClick(newClass, this.state.classes.length - 1)
          successToste("Class Added Successfully");
        }

        else {
          let objValue = this.isEmpty(this.props.newClass)
          this.setState({
            isSubjectModalVisible: false
          })
          if (objValue == true) {
            errorToste("Class Name Already Exist");
          }
        }

      })
    }
  }

  isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }

  onSubjectAdd(obj) {
    let data = {
      payload: {
        "subject_name": obj.editedSubject.subject_name,
      },
      subject_id: obj.editedSubject.subject_id,
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      class_id: this.state.selectedClass,
      token: this.props.token,
    };
    let { isBatchModalVisible, selectedSubject, selectedSubjectNm } = this.state;

    if (obj && obj.editedSubject.subject_id) {
      this.props.updateSubject(data).then(() => {
        let updatedSubject = this.props.updatedSubject;

        if (updatedSubject && updatedSubject.subject_id) {
          let subjectList = this.state.subjects;
          let newSubjectList = [];
          subjectList.map((sub) => {
            if (sub.subject_id === updatedSubject.subject_id) {
              newSubjectList = newSubjectList.concat(updatedSubject);
            }
            else {
              newSubjectList = newSubjectList.concat(sub);
            }
          })
          // this.props.updateSubjectList(newSubjectList);
          successToste("Subject Updated Successfully");
          this.setState({ subjects: newSubjectList, isSubjectModalVisible: false, })
        }
        else {
          let objValue = this.isEmpty(this.props.updatedSubject)
          this.setState({
            isSubjectModalVisible: false
          })
          if (objValue == true) {
            errorToste("Subject Name Already Exist");
          }
        }


      })
      $('.modal-overlay').fadeOut('fast', function () {
        $(this).remove();
      });
      $(".custome-modal").fadeOut('fast');
    }
    else {
      // isBatchModalVisible = true;
      this.props.addSubject(data).then(() => {
        let newSubject = this.props.newSubject;
        if (newSubject && newSubject.subject_id) {
          let subjectList = this.state.subjects;
          subjectList = subjectList.concat(newSubject);
          selectedSubject = newSubject.subject_id;
          selectedSubjectNm = newSubject.subject_name;
          this.props.updateSubjectList(subjectList);
          this.setState({
            subjects: subjectList,
            isSubjectModalVisible: false,
            isBatchModalVisible: obj.batchIdArray.length > 0 ? false : true,
            selectedSubject,
            selectedSubjectNm,
          }, () => {
            let dataAutoBatch = {

              institudeId: this.props.instituteId,
              branchId: this.props.branchId,
              token: this.props.token,
              payload: {

                "subject_id": newSubject.subject_id,
                "batchIds": obj.batchIdArray

              }

            }
            this.props.batchAutoCreation(dataAutoBatch).then(() => {
              var responses = this.props.autoBatchCreate;
              let subjects = this.state.subjects;
              let batches = this.state.batches;
              if (subjects && subjects.length > 0) {

                subjects.map((sub, index) => {
                  if (subjects.length - 1 == index) {
                    this.handleSubjectClick(sub, index);
                  }
                })
              }
              if (obj.batchIdArray && obj.batchIdArray.length > 0) {
                $('.modal-overlay').fadeOut('fast', function () {
                  $(this).remove();
                });
                $(".custome-modal").fadeOut('fast');
              }
            })

          })
          successToste("Subject Added Successfully");
        }
        else {
          let objValue = this.isEmpty(this.props.newSubject)
          this.setState({
            isBatchModalVisible: false
          })
          if (objValue == true) {
            errorToste("Subject Name Already Exist");
          }
        }

      })
    }
  }

  onBatchAdd(obj) {

    let data = {
      payload: {
        'name': obj.editedBatch.name,
        'start_date': obj.editedBatch.start_date,
        'end_date': obj.editedBatch.end_date,
        "subject_id": [this.state.selectedSubject],
        'batch_id': obj.editedBatch.batch_id,
        'STATUS': 'ACTIVE',
      },
      institude_id: this.props.instituteId,
      class_id: this.state.selectedClass,
      branch_id: this.props.branchId,
      token: this.props.token

    };
    if (obj && obj.editedBatch.batch_id) {
      this.props.updateBatch(data).then(() => {
        let updatedBatch = this.props.updatedBatch;

        if (updatedBatch && updatedBatch.batch_id) {
          let batchList = this.state.batches;
          let newBatchList = [];
          batchList.map((bts) => {
            if (bts.batch_id === updatedBatch.batch_id) {
              let batch = {
                end_date: "2018-10-01T01:43:00Z",
                name: data.payload.name,
                start_date: "2018-08-01T15:43:00Z",
                batch_id: updatedBatch.batch_id,
                class_id: this.state.selectedClass,
                institude_id: this.props.instituteId,
              }
              newBatchList = newBatchList.concat(batch);
            }
            else {
              newBatchList = newBatchList.concat(bts);
            }
          })
          this.props.updateBatchList(newBatchList);
        }
      })
    }
    else {
      this.props.addBatches(data).then(() => {
        let newBatch = this.props.newBatch;

        if (newBatch && newBatch.batch_id) {
          let batchList = this.state.batches;
          let batch = {
            batch_id: newBatch.batch_id,
            class_id: this.state.selectedClass,
            end_date: "2018-10-01T01:43:00Z",
            institude_id: this.props.instituteId,
            name: data.payload.name,
            start_date: "2018-08-01T15:43:00Z"
          }
          batchList = batchList.concat(batch);
          this.props.updateBatchList(batchList);

          let batchdata = {
            data: {
              'batch_id': newBatch.batch_id,
              'class_id': this.state.selectedClass,
              'branch_id': this.props.branchId,
            },
            subject_id: this.state.selectedSubject,
          }
          this.props.history.push({
            pathname: '/app/batch-details',
            state: { data: batchdata }
          })
        }
        else {
          let objValue = this.isEmpty(this.props.newBatch);
          if (objValue == true) {
            errorToste("Batch Name Already Exist");
          }
        }

      })
    }
  }

  onDeleteModel(key, obj, index) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, obj, index })
  }

  onDeleteEntry(flag) {

    let { obj, index } = this.state;
    if (flag == "cls") {
      this.onClassDelete(obj, index);
      $("#quizSubmit .close").click();
    }
    else if (flag == "sub") {
      this.onSubjectDelete(obj, index)
      $("#quizSubmit .close").click();
    }
    else if (flag == "batch") {
      this.onBatchDelete(obj, index)
      $("#quizSubmit .close").click();
    }
  }

  onClassDelete(cls, index) {

    let data = {
      payload: {
        'class_id': cls.class_id,
        'class_name': cls.class_name,
        'branch_id': cls.branch_id,
      },
      'institude_id': this.props.instituteId,
      token: this.props.token,
    }

    this.props.deleteClass(data).then(() => {
      let deleteClassResponse = this.props.deleteClassResponse;

      if (deleteClassResponse && deleteClassResponse.status === 200) {
        let classList = this.state.classes;
        classList.splice(index, 1);

        // this.props.updateClassList(classList)
        this.setState({ classes: classList })

      }
      successToste("Class Deleted Successfully");
    })

  }

  onSubjectDelete(sub, index) {
    let data = {
      payload: {
        'subject_id': sub.subject_id,
        'subject_name': sub.subject_name,
      },
      'institude_id': this.props.instituteId,
      'class_id': this.state.selectedClass,
      'branch_id': this.props.branchId,
      token: this.props.token,
    }
    this.props.deleteSubject(data).then(() => {
      let deleteSubjectResponse = this.props.deleteSubjectResponse;
      if (deleteSubjectResponse && deleteSubjectResponse.status === 200) {
        let subjectList = this.state.subjects;
        subjectList.splice(index, 1);
        // this.props.updateSubjectList(subjectList);
        this.setState({ subjects: subjectList })
      }
      successToste("Subject Deleted Successfully");
    })
  }

  onBatchDelete(bts, index) {
    let data = {
      payload: {},
      'institude_id': this.props.instituteId,
      'batch_id': bts.batch_id,
      'branch_id': this.props.branchId,
      token: this.props.token,
    }
    this.props.deleteBatch(data).then(() => {
      let res = this.props.deleteBatchResponse;
      if (res && res.status === 200) {
        let batchList = this.state.batches;
        batchList.splice(index, 1);
        // this.props.updateBatchList(batchList);
        successToste("Batch Deleted Successfully");
        this.setState({ batches: batchList })
      }
      else if (res && res.status == 500) {
        errorToste("Batch Not Deleted")
      }
    })
  }

  saveProfile(data) {
    const payloaddata = {
      institudeId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
      payload: {
        filename: data.filename,
        gender: data.gender
      }
    }

    this.props.profilePicUpload(payloaddata).then((value) => {
      var res = this.props.profileUpload;
      if (res.data.status == 200) {
        $("#newprofilepic .close").click();
        const downloadPic = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token
        }
        this.props.getProfilePic(downloadPic).then(() => {
          var res = this.props.getProfilePicture
          if (res.status == 200) {
            this.setState({ userProfileUrl: res.response.profilePicture != "" ? res.response.profilePicture : "/images/avatars/Avatar_Default.jpg" })
          }
          else if (res.status == 500) {
            this.setState({ userProfileUrl: "/images/avatars/Avatar_Default.jpg" })
          }
        })
        successToste("Profile Set Successfully");
      }

    })
  }

  gotoBatchDetails(data) {
    this.props.history.push({
      pathname: `/app/batch-details`,
      state: { data: data }
    })
  }

  onOpenClassModel(event) {
    this.setState({ classModel: !this.state.classModel })
  }

  renderClassTitleView() {
    let classes = this.state.classes;
    if (classes && classes.length > 0) {
      return (
        <div className="c-card__title">
          <span className="c-heading-sm card--title">
            Classes
            <span className="c-count filled">{classes.length}</span>
          </span>
        </div>
      )
    }
    return (
      <div className="c-card__title">
        <span className="c-heading-sm card--title">
          Classes
          <span className="c-count">0</span>
        </span>
      </div>
    )
  }



  renderClasses() {

    let classes = this.state.classes;

    let subjects = this.props.subjects;
    if (classes && classes.length > 0) {
      if (this.state.selectedClassNm == '' || this.state.selectedClassNm == null) {
        this.state.selectedClass = this.props.classes[0].class_id
        this.state.selectedClassNm = this.props.classes[0].class_name
        this.state.classes[0].token = this.props.token,
          this.state.classes[0].institude_id = this.props.instituteId,
          this.props.getSubjects(this.state.classes[0]);

      }

      return classes.map((cls, index) => {
        let selected = this.state.selectedClassIndex === index ? 'st-selected' : '';

        let stAlert = cls.inComplete ? 'st-alert' : ''
        return (
          <li key={'cls' + index}>
            <div className={`card__elem  ${stAlert} ${selected}`} onClick={this.handleClassClick.bind(this, cls, index)}>
              <div>
                {cls.class_name}
              </div>
              <div className="card__elem__setting">
                <button style={{ marginLeft: "-3px" }} className="c-btn-large" onClick={this.handleEditClass.bind(this, cls)}>
                  <i className="st-edit c-state1" ></i>
                </button>
                <button className="act-delete" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "cls", cls, index)}></button>
              </div>

            </div>
          </li>
        )
      })
    }
  }

  renderClassCard() {

    let classes = this.state.classes;
    if (classes && classes.length > 0) {
      return (
        <div className="c-card__items" >
          <Scrollbars >
            <ul>
              {this.renderClasses()}
            </ul>
          </Scrollbars>
        </div>
      )
    }
    return (
      <div className="c-card__items">
        <div className="c-card__img"><img src="/images/card-img-1.png" alt="logo" /></div>
        <div className="c-card__info">No class added yet</div>
      </div>
    )
  }

  renderSubjectTitleView() {
    let subjects = this.state.subjects;
    if (subjects && subjects.length > 0) {
      return (
        <div className="c-card__title">
          <span className="c-heading-sm card--title">
            Subjects
            <span className="c-count filled">{subjects.length}</span>
          </span>
        </div>
      )
    }
    return (
      <div className="c-card__title">
        <span className="c-heading-sm card--title">
          Subjects
          <span className="c-count">0</span>
        </span>
      </div>
    )
  }

  renderSubjects() {

    let subjects = this.state.subjects;
    let batches = this.props.batches;
    if (subjects && subjects.length > 0) {
      if (this.state.selectedSubjectNm == '' || this.state.selectedSubjectNm == null) {
        this.state.selectedSubjectNm = this.state.subjects[0].subject_name
        this.state.selectedSubject = this.state.subjects[0].subject_id
      }
      return subjects.map((sub, index) => {
        let selected = this.state.selectedSubjectIndex === index ? 'st-selected' : '';
        let stAlert = sub.inComplete ? 'st-alert' : ''
        return (
          <li key={'sub' + index} >
            <div className={`card__elem ${selected} ${stAlert} `} onClick={this.handleSubjectClick.bind(this, sub, index)}>
              <div>
                {sub.subject_name}
              </div>
              <div className="card__elem__setting">
                <button style={{ marginLeft: "-3px" }} className="c-btn-large" onClick={this.handleEditSubject.bind(this, sub)}>
                  <i className="st-edit c-state1"></i>
                </button>
                <button className="act-delete" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "sub", sub, index)} ></button>
              </div>
            </div>
          </li>
        )
      })
    }
  }

  renderSubjectCard() {

    let subjects = this.state.subjects;
    if (subjects && subjects.length > 0) {
      return (
        <div className="c-card__items" >
          <Scrollbars >
            <ul>
              {this.renderSubjects()}
            </ul>
          </Scrollbars >
        </div>
      )
    }

    return (
      <div className="c-card__items">
        <div className="c-card__img"><img src="/images/card-img-2.png" alt="logo" /></div>
        <div className="c-card__info">No subject added yet</div>
      </div>
    )
  }

  renderBatchTitleView() {
    let batches = this.state.batches;
    if (batches && batches.length > 0) {
      return (
        <div className="c-card__title">
          <span className="c-heading-sm card--title">
            Batches
            <span className="c-count filled">{batches.length}</span>
          </span>
        </div>
      )
    }
    return (
      <div className="c-card__title">
        <span className="c-heading-sm card--title">
          Batches
          <span className="c-count">0</span>
        </span>
      </div>
    )
  }

  renderBatches() {
    let batches = this.state.batches;

    if (batches && batches.length > 0) {
      return batches.map((bts, index) => {

        let selected = this.state.selectedBatchIndex === index ? 'st-selected' : '';
        let stAlert = bts.inComplete ? 'st-alert' : ''
        let bgStrike = bts.isExpired == 'EXPIRED' ? 'line-through' : '';
        let bgColor = bts.isExpired == 'EXPIRED' ? '#FFCFCF' : ''

        let data = {
          data: bts,
          subject_id: this.state.selectedSubject
        }

        return (

          <li key={"key" + index}>
            <div className={`card__elem ${selected} ${stAlert} `} >
              <div onClick={this.gotoBatchDetails.bind(this, data)} style={{ textDecoration: bgStrike, backgroundColor: bgColor }}>
                {bts.name}
              </div>

              <div className="card__elem__setting">
                <button className="act-delete" data-toggle="modal" data-target="#quizSubmit"
                  onClick={this.onDeleteModel.bind(this, "batch", bts, index)} >

                </button>

              </div>
            </div>
          </li>

        )
      })
    }
  }

  renderBatchCard() {
    let batches = this.props.batches;
    if (batches && batches.length > 0) {
      return (
        <div className="c-card__items batch--list">
          <Scrollbars >
            <ul>
              {this.renderBatches()}
            </ul>
          </Scrollbars >
        </div>
      )
    }
    return (
      <div className="c-card__items">
        <div className="c-card__img"><img src="/images/card-img-3.png" alt="logo" /></div>
        <div className="c-card__info">No batch added yet</div>
      </div>
    )
  }

  // toggleModalCSS() {
  //   if (!this.state.isClassModalVisible) {
  //     return "c-btn primary btn-custom";
  //   } else {
  //     return "c-btn primary btn-custom";
  //   }
  // }

  renderClassModal() {
    if (this.state.isClassModalVisible) {
      return (
        <AddClassModal
          editedClass={this.state.editedClass}
          onClassAdd={(data) => { this.onClassAdd(data) }}
          onModalClose={this.onModalClose.bind(this)} />
      )
    }
  }

  subjectModelRender() {
    if (this.state.isSubjectModalVisible) {
      return (
        <AddSubjectModal
          classNm={this.state.selectedClassNm}
          classId={this.state.selectedClass}
          branchId={this.props.branchId}
          instituteId={this.props.instituteId}
          token={this.props.token}
          editedSubject={this.state.editedSubject}
          onSubjectAdd={(data) => { this.onSubjectAdd(data) }}
          onModalClose={this.onModalClose.bind(this)} {...this.props} />
      )
    }
  }

  batchModelRender() {
    if (this.state.isBatchModalVisible) {

      return (
        <AddBatchModal
          subjectNm={this.state.selectedSubjectNm}
          classNm={this.state.selectedClassNm}
          editedBatch={this.state.editedBatch}
          onBatchAdd={(data) => { this.onBatchAdd(data) }}
          onModalClose={this.onModalClose.bind(this)} {...this.props} />
      )
    }
  }

  render() {
    return (

      <div className="c-container clearfix" style={{ paddingBottom: "15px" }}>
        <button id="openmodal" data-toggle="modal" data-target="#newprofilepic" hidden></button>
        <ToastContainer />
        <div className="clearfix">
          <span className="c-heading-sm">Administration</span>
          <span className="c-heading-lg">Class Manager</span>
        </div>
        <div className="c-container__data" >
          <div className="card-container">

            <div className="c-card">

              {this.renderClassTitleView()}

              {this.renderClassCard()}


              <div className="c-card__btnCont">
                <button className="c-btn-large primary st-modal " onClick={this.handleEditClass.bind(this, null)}>+ Add New Class</button>
              </div>

              {this.renderClassModal()}

            </div>

            <div className="c-card">

              {this.renderSubjectTitleView()}

              {this.renderSubjectCard()}

              <div className="c-card__btnCont">
                <button style={{ color: "white" }} className="c-btn-large primary st-modal btn" onClick={this.handleEditSubject.bind(this, null)} disabled={this.state.disableAddSubject} >+ Add New Subject</button>
              </div>

              {this.subjectModelRender()}

            </div>

            <div className="c-card">

              {this.renderBatchTitleView()}

              {this.renderBatchCard()}

              <div className="c-card__btnCont">
                <button style={{ color: "white" }} className="c-btn-large primary st-modal btn" onClick={this.handleEditBatch.bind(this, null)} disabled={this.state.disableAddBatch} >+ Add New Batch</button>
              </div>
              {this.batchModelRender()}


            </div>
          </div>
        </div>
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }} onClassDelete={(data) => { this.onClassDelete(data) }}   {...this.props} />
        <ProfilePicModal onSelectProfile={(data) => this.saveProfile(data)} userType={this.props.userType} {...this.props} />
      </div>

    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  classes: app.classes,
  subjects: app.subjects,
  batches: app.batches,
  branchId: app.branchId,
  newClass: app.newClass,
  deleteClassResponse: app.deleteClassResponse,
  deleteSubjectResponse: app.deleteSubjectResponse,
  newSubject: app.newSubject,
  userType: auth.userType,
  newBatch: app.newBatch,
  updatedClass: app.updatedClass,
  updatedSubject: app.updatedSubject,
  updatedBatch: app.updatedBatch,
  deleteBatchResponse: app.deleteBatchResponse,
  instituteId: app.institudeId,
  token: auth.token,
  profileSelectedOrNot: app.profileSelectedOrNot,
  profileUpload: app.profileUpload,
  getProfilePicture: app.getProfilePicture,
  getSubBatchList: app.getSubBatchList,
  autoBatchCreate: app.batchAutoCreate,
  ProfessorAdmin: app.professorAdmin,
  classManagerFlow: app.classManagerFlow,
  updateclasses: app.updateclasses
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getClasses,
      getSubjects, getBatches, addClass, updateClassList,
      deleteClass, deleteSubject, addSubject, updateSubjectList,
      updateClass, updateSubject, addBatches, updateBatch,
      updateBatchList, deleteBatch, checkProfileSelectedOrNot,
      profilePicUpload, getProfilePic, getSubjectBatchList, batchAutoCreation,
      getIsProfessorAdmin, getClassManagerFlow
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ClassManager)
