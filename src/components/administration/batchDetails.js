import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CopyBatchModal } from '../common/copyBatchModal';
import { CsvUploadModal } from '../common/csvUploadModal';
import { getBatchDetail, addStudentCopy, getSubjects, getBatches, getClassesOnSelectedYear, uploadCsvFile, invitationSend, getFinancelist, getEditFinanceData,getIsProfessorAdmin } from '../../actions/index';
import { updateBatchDetails, searchProfessorsDetails, serachStudentsDetails, getAllStudent, getYearListForStudentCopy, getAllProfessor, autoAssignHomeworkQuizNotes } from '../../actions/index';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import $ from "jquery";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { ToastContainer, toast } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'react-select';
const optionszx= [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
class BatchDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batch: {
        batchDetail: {},
        subjectDetail: {},
        studentDetails: [],
        professorDetails: [],
        schedule_type: 'WEEKLY',
        timeTableDetail: []
      },
      batchassistant: {
        batchDetail: {},
        subjectDetail: {},
        studentDetails: [],
        assistantDetails: [],
        schedule_type: 'WEEKLY',
        timeTableDetail: []
      },
      timeTableObject: {},
      disableTimeTableObject: {},
      selectedDay: 0,
      newStudentName: "",
      scheduleArr: ["WEEKLY"],
      weekdayField: [],
      days: [
        { day: 1, name: 'Monday', letter: 'M', isSelected: false },
        { day: 2, name: 'Tuesday', letter: 'T', isSelected: false },
        { day: 3, name: 'Wednesday', letter: 'W', isSelected: false },
        { day: 4, name: 'Thursday', letter: 'T', isSelected: false },
        { day: 5, name: 'Friday', letter: 'F', isSelected: false },
        { day: 6, name: 'Saturday', letter: 'S', isSelected: false },
        { day: 7, name: 'Sunday', letter: 'S', isSelected: false },
      ],
      professor_id: null,
      pro: {},
      sameTimeObj: {},
      isLoading: false,
      professor: {},
      assistantprofessor: {},
      newStudent: {},
      isSameTimeEveryday: false,
      isBatchNameVisible: false,
      isStartDateVisible: false,
      isEndDateVisible: false,
      isScheduleTypeVisible: false,
      isDayVisible: false,
      isProfessorVisible: false,
      isAssistantProfessorVisible:false,
      isStudentVisible: false,
      isTimeInvalid: false,
      isDiffrentTimeInvalid: {},
      isDateInvalid: false,
      isStudntEmpty: false,
      yearList: [],
      classList: [],
      branchId: 0,
      disabledTimeFlag: false,
      count: 0,
      errorFlag: false,
      assitantProfessorId:"",
      displayProfessorExists:false,
      displayAssistantProfessorExists:false,
      instituteId:0,
      selectedValues:[],
      errmsg:false
    }
    this.onSaveChange = this.onSaveChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){

    if(this.state.instituteId != nextProps.instituteId){
      this.setState({instituteId:nextProps.instituteId},()=>{
        var datas = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token,
        }
        this.props.getIsProfessorAdmin(datas).then(()=>{
         let res = this.props.ProfessorAdmin;
         if(res && res.data.status == 200 && res.data.response.isProfessorAdmin == false ){
         this.props.history.push("/app/dashboard");
         }
         else{
          const pro = this.props.location.state ? this.props.location.state.data : null;
          if (pro && pro.data.branch_id != nextProps.branchId) {
            this.setState({ branchId: nextProps.branchId }, () => {
              this.props.history.push('/app/class-manager')
            });
          }
         }
        })
      })
		}
		}
  }


  componentDidMount() {
    this.setState({instituteId:this.props.instituteId})
    const pro = this.props.location.state ? this.props.location.state.data : null;
    var timeObj = this.state.timeTableObject
    var count = 0;
    var i;
    var setflag;
    for (i in timeObj) {
      if (timeObj.hasOwnProperty(i)) {
        count++;
      }
    }

    if (count == 0) {
      this.setState({ disabledTimeFlag: true });
    }
    else {
      this.setState({ disabledTimeFlag: false, count: count })
    }

    let data = {
      batch_id: pro.data.batch_id,
      class_id: pro.data.class_id,
      subject_id: pro.subject_id,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }

    this.props.getBatchDetail(data).then(() => {
      let res = this.props.batchDetails;
      if (res && res.status === 200) {
        let batch = res.response;
        let batchassistant = res.response;
        let studentList = res.response.studentDetails;
        if (studentList && studentList.length > 0) {
          studentList[0].is_verified = true;
        }
        const timeTableDetail = batch.timeTableDetail;
        // let { isSameTimeEveryday } = this.state;
        let sametimeObj = {
          day: [],
          start_time: "",
          end_time: ""
        }
        let obj = {};
        if (timeTableDetail && timeTableDetail.length) {
          if (timeTableDetail[0].sameTimeFlag) {
            timeTableDetail.map((day, index) => {
              sametimeObj.day.push(day);
              sametimeObj.start_time = day.start_time;
              sametimeObj.end_time = day.end_time;
            })
            this.setState({ isSameTimeEveryday: true, sameTimeObj: sametimeObj });

          } else {

            timeTableDetail.map((data, index) => {
              if (data.day in obj) {
                return obj[data.day] = { time: obj[data.day].time.concat(data) };

              }
              else {
                return obj[data.day] = { time: [data] };

              }
            })
            if (Object.keys(obj).length === 0 && obj.constructor === Object) {

            }
            else {
              let { days } = this.state;
              days.map((day, index) => {
                let x
                for (x in obj) {

                  if (day.day === x) {
                    day.isSelected = true;
                  }
                }
              })
            }
            this.setState({ isSameTimeEveryday: false, timeTableObject: obj })
          }

          let { days } = this.state;
          if (timeTableDetail && timeTableDetail.length) {
            timeTableDetail.map((timeObj) => {
              if (timeObj && timeObj.day) {
                let index = timeObj.day - 1;
                days[index]['isSelected'] = true;
              }
            })
          }


          this.setState({
            days,
            batch,
            batchassistant,
            // professorDetails: res.response.professorDetails,
            // professorDetails: res.response.assistantDetails,
            studentDetails: studentList,
            timeTableDetail: res.response.timeTableDetail,
            pro,
          })
        } else {
          let { batch, batchassistant } = this.state;

          batch = { ...batch, professorDetails: res.response.professorDetails }
          batch = { ...batch, studentDetails: studentList }
          batch = { ...batch, batchDetail: res.response.batchDetail }
          batch = { ...batch, subjectDetail: res.response.subjectDetail }

          batchassistant = { ...batchassistant, assistantDetails: res.response.assistantDetails }
          batchassistant = { ...batchassistant, studentDetails: studentList }
          batchassistant = { ...batchassistant, batchDetail: res.response.batchDetail }
          batchassistant = { ...batchassistant, subjectDetail: res.response.subjectDetail }

          this.setState({ batch, batchassistant, pro })
        }
      }
    });

    // this.yearListOfStudentCopy();
  }

  titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
  }

  dateValidation(start_time, end_time) {
    if (end_time <= start_time) {
      return false;
    }
    else {
      return true;
    }
  }

  validate() {
    let { batch,batchassistant, timeTableObject, sameTimeObj } = this.state;
    let batchDetail = batch.batchDetail;
    let schedule_type = batch.schedule_type;

    var isValidForm = true;


    if (this.state.isSameTimeEveryday) {

      let start = moment(sameTimeObj.start_time, 'HH:mm a');
      let end = moment(sameTimeObj.end_time, 'HH:mm a');
      let valid = this.dateValidation(start, end);
      if (valid) {

      } else {
        this.setState({ isTimeInvalid: true });
        isValidForm = false
      }
    }
    else {
      let idx;
      let { isDiffrentTimeInvalid } = this.state;
      for (idx in timeTableObject) {
        let startTime = moment(timeTableObject[idx].time[0].start_time, 'HH:mm a');
        let endTime = moment(timeTableObject[idx].time[0].end_time, 'HH:mm a');
        let valid = this.dateValidation(startTime, endTime);

        if (valid) {

        } else {
          isDiffrentTimeInvalid[idx] = true;
          this.setState({ isDiffrentTimeInvalid });
          isValidForm = false

        }
      }
    }

    if (batchDetail.name.length === 0) {
      this.setState({ isBatchNameVisible: true });
      isValidForm = false
    }
    if (batchDetail.start_date === 0) {

      this.setState({ isStartDateVisible: true });
      isValidForm = false
    }

    var enddate = batchDetail.end_date;
    var startdate = batchDetail.start_date;
    if (moment(enddate).isBefore(startdate) || moment(enddate).isSame(startdate)) {

      this.setState({ isEndDateVisible: true });
      isValidForm = false;
    }
    let dateValid = this.dateValidation(batchDetail.start_date, batchDetail.end_date);

    if (dateValid) {

    } else {
      this.setState({ isDateInvalid: true });
      isValidForm = false
    }

    if (schedule_type.length === 0) {
      this.setState({ isScheduleTypeVisible: true });
      isValidForm = false
    }

    var count = 0;
    this.state.days.map((data, index) => {
      if (data.isSelected === true) {
        count++;

      }
    })
    if (!count) {
      this.setState({ isDayVisible: true });
      isValidForm = false
    }

    if (batch.professorDetails && batch.professorDetails.length === 0) {
      this.setState({ isProfessorVisible: true });
      isValidForm = false
    }
    // if (batchassistant.assistantDetails && batchassistant.assistantDetails.length === 0) {
    //   this.setState({ isAssistantProfessorVisible: true });
    //   isValidForm = false
    // }
    if (batch.studentDetails && batch.studentDetails.length === 0) {
      this.setState({ isStudentVisible: true });
      isValidForm = false
    }
    return isValidForm;
  }

  onSaveChange(event) {


    let { timeTableObject, sameTimeObj, batch } = this.state;
    let timeTableDetail = [];
    if (this.state.isSameTimeEveryday) {
      sameTimeObj.day.map((data, index) => {
        timeTableDetail.push(data);
      })
      let newtimetableArr = timeTableDetail;
      timeTableDetail = []
      var flags = [], length = newtimetableArr.length, i;
      for (i = 0; i < length; i++) {
        if (flags[newtimetableArr[i].day]) continue;
        flags[newtimetableArr[i].day] = true;
        timeTableDetail.push(newtimetableArr[i]);
      }
    } else {
      let idx;
      for (idx in timeTableObject) {
        timeTableObject[idx].time.map((data, index) => {
          data.sameTimeFlag = false;
          timeTableDetail.push(data);
        })
      }
    }

    var self = this;
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
      let professorId;
      if (this.state.batch.professorDetails && this.state.batch.professorDetails.length) {
        professorId = this.state.batch.professorDetails[0].professor_id;
      }
      let studentIds = [];
      if (this.state.batch.studentDetails && this.state.batch.studentDetails.length) {
        this.state.batch.studentDetails.map((student, idx) => {
          studentIds.push(student.student_id);
        })
      }
      let subID = [];
      subID.push(this.state.batch.subjectDetail.subject_id);
      let payload = {
        name: this.state.batch.batchDetail.name,
        start_date: this.state.batch.batchDetail.start_date,
        end_date: this.state.batch.batchDetail.end_date,
        subject_id: subID,
        professor_id: professorId,
        student_id: studentIds,
        time_table: timeTableDetail,
        assistance_professor_id :self.state.batchassistant.assistantDetails.length ? self.state.batchassistant.assistantDetails[0].professor_id : 0
      }

      let data = {
        payload: payload,
        institude_id: this.props.instituteId,
        class_id: this.state.pro.data.class_id,
        branch_id: this.props.branchId,
        batch_id: this.state.batch.batchDetail.batch_id,
        token: this.props.token,
      }
      this.props.updateBatchDetails(data).then(() => {

        let res = this.props.updatedBatchDetail

        if (res && res.status == 200) {
          let data = {
            payload: {
              batch_id: this.state.batch.batchDetail.batch_id,
              professor_id: professorId,
              class_id: this.state.pro.data.class_id,
              subject_id: subID[0],
              start_date: this.state.batch.batchDetail.start_date,
              end_date: this.state.batch.batchDetail.end_date,
            },
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token,
          }

          this.props.autoAssignHomeworkQuizNotes(data).then(() => {
            let res = this.props.autoAssignHwQuizNotes;
             this.setState({displayProfessorExists:false})
          })
          this.props.history.push('/app/class-manager')
          infoToste("Batch Updated Successfully");
        }
      })
    }
  }

  onChangeBatchName(event) {
    let { batch } = this.state;
    let batchDetail = batch.batchDetail;
    batchDetail = { ...batchDetail, name: event.target.value }
    batch = { ...batch, batchDetail };
    this.setState({ batch, isBatchNameVisible: false });
  }

  onChangeStartDate(date) {
    let { batch } = this.state;
    let batchDetail = batch.batchDetail;
    batchDetail = { ...batchDetail, start_date: date }
    batch = { ...batch, batchDetail };
    this.setState({ batch, isStartDateVisible: false, isDateInvalid: false });
  }

  onChangeEndDate(date) {
    let { batch } = this.state;
    let batchDetail = batch.batchDetail;
    batchDetail = { ...batchDetail, end_date: date }
    batch = { ...batch, batchDetail };
    this.setState({ batch, isEndDateVisible: false, isDateInvalid: false });
  }

  onScheduleChange(schedule, event) {
    let { batch } = this.state;
    let schedule_type = batch.schedule_type;
    schedule_type = schedule
    batch = { ...batch, schedule_type };
    this.setState({ batch, isScheduleTypeVisible: false });
  }

  onDaySelect(day, index) {
    let { batch, days, timeTableObject, disableTimeTableObject, sameTimeObj, isDiffrentTimeInvalid } = this.state;

    if (this.state.isSameTimeEveryday) {
      let timetable = {
        day: day,
        start_time: sameTimeObj.start_time,
        end_time: sameTimeObj.end_time,
        frequency: batch.schedule_type,
        subject_id: batch.subjectDetail.subject_id,
        sameTimeFlag: true
      }
      if (days[index]['isSelected']) {

        days[index]['isSelected'] = false;
        sameTimeObj.day.map((data, index) => {
          if (day === data.day) {

            sameTimeObj.day.splice(index, 1);

          }
        })
      }
      else {

        days[index]['isSelected'] = true;
        sameTimeObj.day.push(timetable)
        this.setState({ isDayVisible: false, errorFlag: false })

      }


    } else {
      let timetable = {
        day: day,
        start_time: String(moment(moment()).format("LT")),
        end_time: String(moment(moment()).format("LT")),
        frequency: batch.schedule_type,
        subject_id: batch.subjectDetail.subject_id,
        sameTimeFlag: false
      }
      let obj = {
        disabled: true
      }
      if (days[index]['isSelected']) {
        days[index]['isSelected'] = false;
        delete timeTableObject[day];
        delete isDiffrentTimeInvalid[day];

      }
      else {
        isDiffrentTimeInvalid[day] = false;
        days[index]['isSelected'] = true;
        timeTableObject[day] = { "time": [] }
        timeTableObject[day].time.push(timetable);
        this.setState({ isDayVisible: false, errorFlag: false })
      }
    } this.setState({ sameTimeObj, timeTableObject, days, isDiffrentTimeInvalid });
  }

  onChangeStartTime(index, day, time) {
   
    let { timeTableObject, isDiffrentTimeInvalid } = this.state;
    timeTableObject[day].time[index].start_time = String(moment(time).format("LT"));

    isDiffrentTimeInvalid[day] = false;
    this.setState({ timeTableObject, isDiffrentTimeInvalid });
  }

  onChangeEndTime(index, day, time) {
    
    let { timeTableObject, isDiffrentTimeInvalid } = this.state;
    timeTableObject[day].time[index].end_time = String(moment(time).format("LT"));
    isDiffrentTimeInvalid[day] = false;
    this.setState({ timeTableObject, isDiffrentTimeInvalid });
  }

  onChangeSameStartTime(time) {
    
    let { sameTimeObj } = this.state;
    sameTimeObj.day.map((data, index) => {
      data.start_time = String(moment(time).format("LT"));
    })
    sameTimeObj.start_time = String(moment(time).format("LT"));
    this.setState({ sameTimeObj, isTimeInvalid: false });
  }

  onChangeSameEndTime(time) {
   
    let { sameTimeObj } = this.state;
    sameTimeObj.day.map((data, index) => {
      data.end_time = String(moment(time).format("LT"));
    })
    sameTimeObj.end_time = String(moment(time).format("LT"));
    this.setState({ sameTimeObj, isTimeInvalid: false });
  }

  onAddTimeSlot(day) {
    let { batch, timeTableObject } = this.state;
    let newSlot = {
      day: day,
      start_time: String(moment(moment()).format("LT")),
      end_time: String(moment(moment()).format("LT")),
      frequency: batch.schedule_type,
      subject_id: batch.subjectDetail.subject_id,
      sameTimeFlag: false
    }
    let time = timeTableObject[day].time

    time.push(newSlot);
    let obj = { "time": time }
    timeTableObject = { ...timeTableObject, [day]: obj }
    this.setState({ timeTableObject, disabledTimeFlag: false });
  }

  onDeleteTimeSlot(index, day) {

    let { timeTableObject, days } = this.state;
    timeTableObject[day].time.splice(index, 1);
    if (timeTableObject[day].time.length == 0) {

      delete timeTableObject[day]
      days.forEach((item, dayindex) => {
        if (day === item.day) {
          days.splice(dayindex, 1, { day: item.day, name: item.name, letter: item.letter, isSelected: false })
        }
      })
    }
    this.setState({ timeTableObject });
  }

  handleAddFaculty(event) {

    let batch = this.state.batch;
    let { professorDetails } = batch;
    let profess = this.state.professor;
    let concatdata = {
      "firstname": this.state.professor.firstname.split(" ")[0],
      "lastname": this.state.professor.lastname,
      "professor_id": this.state.professor.professor_id
    }
    let objValue = this.isEmpty(this.state.professor.firstname.split(" ")[0]);
    if (objValue != true) {
      professorDetails = [];
      professorDetails = professorDetails.concat(concatdata);
    }

    batch = { ...batch, professorDetails, }

    this.setState({ batch, professor: {}, isProfessorVisible: false });
  }

  onChangeSelector(data) {
    
    if (data && data.length) {
      if(this.state.batchassistant.assistantDetails.length && this.state.batchassistant.assistantDetails[0].professor_id == data[0].id){
        this.setState({displayAssistantProfessorExists:true})
      }
      else{
      let temp = {
        firstname: data[0].label,
        lastname: data[0].lastname,
        professor_id: data[0].id
      }
      this.setState({ professor: temp }, () => {
        let batch = this.state.batch;
        let { professorDetails } = batch;
        let profess = this.state.professor;
        let concatdata = {
          "firstname": this.state.professor.firstname.split(" ")[0],
          "lastname": this.state.professor.lastname,
          "professor_id": this.state.professor.professor_id
        }
        let objValue = this.isEmpty(this.state.professor.firstname.split(" ")[0]);
        if (objValue != true) {
          professorDetails = [];
          professorDetails = professorDetails.concat(concatdata);
        }

        batch = { ...batch, professorDetails }
        this.setState({ batch, professor: {}, isProfessorVisible: false ,displayAssistantProfessorExists:false},()=>{
          setTimeout(() => this.refs.professor.getInstance().clear(), 800);
        });
        
      });
    }
    }
  }

  onAssistantChangeSelector(data) {
    if (data && data.length) {
    if(this.state.batch.professorDetails.length && this.state.batch.professorDetails[0].professor_id == data[0].id){
      this.setState({displayProfessorExists:true})
    }
    else{
    
      let temp = {
        firstname: data[0].label,
        lastname: data[0].lastname,
        professor_id: data[0].id
      }
      this.setState({ assistantprofessor: temp,displayProfessorExists:false }, () => {
        let batchassistant = this.state.batchassistant;
        let { assistantDetails } = batchassistant;
        let profess = this.state.assistantprofessor;
        let concatdata = {
          "firstname": this.state.assistantprofessor.firstname.split(" ")[0],
          "lastname": this.state.assistantprofessor.lastname,
          "professor_id": this.state.assistantprofessor.professor_id
        }
        let objValue = this.isEmpty(this.state.assistantprofessor.firstname.split(" ")[0]);
        if (objValue != true) {
          assistantDetails = [];
          assistantDetails = assistantDetails.concat(concatdata);
        }

        batchassistant = { ...batchassistant, assistantDetails }
        this.setState({batchassistant, assistantprofessor: {}, isAssistantProfessorVisible: false },()=>{
          setTimeout(() => this.refs.asstprofessor.getInstance().clear(), 800);
        });
        
      });
    }
  }
  }

  onSerachProfessor(query) {
    this.setState({ isLoading: true });
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: { 'name': query }
    };
    this.props.searchProfessorsDetails(data).then(() => {
      let res = this.props.serachProfessorDetails;

      var arr = [];
      if (res && res.status === 200) {
        res.data.response.map((data, index) => {
          if (data.designation != 'INSTITUTE') {
            let temp = { id: data.professor_id, label: data.firstname + " " + data.lastname, lastname: data.lastname };
            arr.push(temp);
          }
        })
      }
      this.setState({ isLoading: false, option1: arr });
    })
  }

  onGetAllProfessor() {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    };
    this.props.getAllProfessor(data).then(() => {
      let res = this.props.professorList;
      let arr = [];
      if (res && res.status === 200) {
        res.data.response.map((data, index) => {
          if (data.designation != 'INSTITUTE') {
            let temp = { id: data.professor_id, label: data.firstname + " " + data.lastname, lastname: data.lastname };
            arr.push(temp);
          }
        })

      }
      this.setState({ isLoading: false, option1: arr });

    })
  }

  isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }

  handleAddStudent() {
    let batch = this.state.batch;
    let { studentDetails } = batch;
    let newStudentInfo = this.state.newStudent;
    let studentData = {
      "firstname": this.state.newStudent.firstname.split(" ")[0],
      "lastname": this.state.newStudent.lastname,
      "student_id": this.state.newStudent.student_id
    }
    let objValue = this.isEmpty(this.state.newStudent)

    if (objValue != true) {
      studentDetails = studentDetails.concat(studentData);
    }
    batch = { ...batch, studentDetails }
    this.setState({ batch, newStudent: {}, isStudentVisible: false });
    
  }

  onChangeStudentSelector(data) {
    let batch = this.state.batch;
    if(data && data.length>0){
    data.forEach((student,index)=>{
      let temp = {
        student_id: student.value,
        firstname: student.label,
        lastname: student.lastname,
      }
      // this.setState({ newStudent: temp })
        
        let { studentDetails } = batch;
        let studentData = {
          "firstname": temp.firstname.split(" ")[0],
          "lastname": temp.lastname,
          "student_id": temp.student_id
        }
        // let objValue = this.isEmpty(this.state.newStudent)

        // if (objValue != true) {
          studentDetails = studentDetails.concat(studentData);
        // }
        batch = { ...batch, studentDetails }
  })
  this.setState({ batch, newStudent: {}, isStudentVisible: false },()=>{
    // setTimeout(() => this.refs.student.getInstance().clear(), 1000);
  });
}
else{
  this.setState({isStudentVisible:true})
}
  }

  onSerachStudent(query) {
    this.setState({ isLoading: true });
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: { 'name': query }
    };
    this.props.serachStudentsDetails(data).then(() => {
      let res = this.props.serachStudentDetails;
      var arr = [];
      if (res && res.status === 200) {
        res.data.response.map((data, index) => {
          let temp = { id: data.student_id, label: data.firstname + " " + data.lastname, lastname: data.lastname };
          arr.push(temp);
        })
      }
      this.setState({ isLoading: false, option: arr });
    })
  }

  onGetAllStudent() {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    };
    this.props.getAllStudent(data).then(() => {
      let res = this.props.studentList;
      var arr = [];
      if (res && res.status === 200) {
        res.data.response.map((data, index) => {
          let temp = { value: data.student_id, label: data.firstname + " " + data.lastname, lastname:data.lastname };
          arr.push(temp);
        })
      }
      this.setState({ isLoading: false, option: arr });
    })
  }

  DeleteProfessor(professor) {
    let batch = this.state.batch;
    let professorDetails = batch.professorDetails;
    professorDetails.splice(professor, 1);
    batch = { ...batch, professorDetails };
    this.setState({ batch });
  }

  DeleteAssistantProfessor(professor) {
    let batchassistant = this.state.batchassistant;
    let assistantDetails = batchassistant.assistantDetails;
    assistantDetails.splice(professor, 1);
    batchassistant = { ...batchassistant, assistantDetails };
    this.setState({ batchassistant });
  }

  DeleteStudent(student) {
    let batch = this.state.batch;
    let studentDetails = batch.studentDetails;
    studentDetails.splice(student, 1);
    batch = { ...batch, studentDetails };
    this.setState({ batch });
  }



  onTimeChange() {
    if (this.state.isSameTimeEveryday) {
      let { sameTimeObj } = this.state;
      let obj = {};
      let timeTableDetail = [];
      sameTimeObj.day.map((data, index) => {
        timeTableDetail.push(data);
      })
      let newtimetableArr = timeTableDetail;
      timeTableDetail = []
      var flags = [], l = newtimetableArr.length, i;
      for (i = 0; i < l; i++) {
        if (flags[newtimetableArr[i].day]) continue;
        flags[newtimetableArr[i].day] = true;
        newtimetableArr.sameTimeFlag = true;
        timeTableDetail.push(newtimetableArr[i]);
      }

      timeTableDetail.map((data, index) => {
        if (data.day in obj) {
          obj[data.day] = { time: obj[data.day].time.concat(data) };
        }
        else {
          obj[data.day] = { time: [data] };
        }
      })
      this.setState({ timeTableObject: obj })


    } else {
      let { timeTableObject, batch } = this.state;
      let timeTableDetail = [];
      let x;
      for (x in timeTableObject) {
        timeTableObject[x].time.map((data, index) => {
          data.sameTimeFlag = true;
          timeTableDetail.push(data);
        })
      }

      let sametimeObj = {
        day: [],
        start_time: "",
        end_time: moment().add("hours", 1).format('hh:mm A')
      }

      timeTableDetail.map((day, index) => {
        sametimeObj.day.push(day);
        sametimeObj.start_time = day.start_time;
        sametimeObj.end_time = day.start_time;
      })
      this.setState({ sameTimeObj: sametimeObj })
    }

    let { isSameTimeEveryday } = this.state;
    isSameTimeEveryday = !this.state.isSameTimeEveryday;
    this.setState({ isSameTimeEveryday });
  }

  onModalClose() {
    $('.modal-overlay').fadeOut('fast', function () {
      $(this).remove();
    });
    $(".custome-modal").fadeOut('fast');
  }

  addStudentCopy(studentCopy) {
    let data = {
      class_id: studentCopy.studentCopy.selectedClassId,
      subject_id: studentCopy.studentCopy.selectedSubjectId,
      batch_id: studentCopy.studentCopy.selectedBatchId,
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.addStudentCopy(data).then(() => {
      let res = this.props.newStudentCopy;
      let batch = this.state.batch;
      let { studentDetails } = batch;
      if (res && res.status === 200) {
        res.response.map((data, index) => {
          data = {
            firstname: data.firstname,
            lastname: data.lastname,
            roll_no: data.roll_no,
            student_id: data.student_id,
            is_verified: false
          }

          studentDetails = studentDetails.concat(data)
          batch = { ...batch, studentDetails }
          this.setState({ batch ,isStudentVisible: false});
        })
      }
    })
    $("#cpyanotherBatch .close").click();
  }

  backMainDirectory(event) {
    this.props.history.push('/app/class-manager')
  }

  uploadCsv(selectedFile, id) {
    const formData = new FormData();
    formData.append("filename", selectedFile);
    formData.append("finance_template_id", id)
    let data = {
      payload: formData,
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.uploadCsvFile(data).then(() => {
      let res = this.props.uploadedCsv;
      let batch = this.state.batch;
      let { studentDetails } = batch;
      if (res && res.status === 200) {
        let studentList = [];
        studentList = res.response
        studentList.map((data, index) => {
          let student = {
            student_id: data.student_id,
            firstname: data.firstname,
            lastname: data.lastname,
            is_verified: false,
            roll_no: data.roll_no,
          }
          if (student.student_id !== undefined || student.firstname !== undefined || student.lastname !== undefined) {
            studentDetails = studentDetails.concat(student)
          }
          else {
            errorToste("Either Mobile Number or Email Already Exist. Please Check")

          }
          // studentDetails = studentDetails.concat(student)
          batch = { ...batch, studentDetails }
          this.setState({ batch,isStudentVisible: false });
        })
      }
      else if (res && res.status == 500) {
        errorToste(res.message)
      }
      else {
        errorToste("Something Went Wrong")
      }
    })
    $("#csvupload .close").click();
  }



  renderSchedule() {
    if (!this.state.scheduleArr) return false
    return this.state.scheduleArr.map((schedule, index) => {
      return (
        <li key={"key" + index}>
          <a onClick={this.onScheduleChange.bind(this, schedule)} className="dd-option">{schedule}</a>
        </li>
      )
    })
  }

  renderButtonList() {
    return this.state.days.map((day, index) => {
      let selected = day.isSelected ? 'st-selected' : '';
      return (
        <button className={selected} key={"day" + index} onClick={this.onDaySelect.bind(this, day.day, index)} >{day.letter}</button>
      )
    })
  }

  timeShow(day) {
    if (this.state.timeTableObject) {

      if (!this.state.timeTableObject[day].time) return false
      return this.state.timeTableObject[day].time.map((weekday, index) => {
        return (
          <div key={"weekday" + index} >
            <div className="row">
              <div className="col-md-5 divider-block text--left">
                <div className="form-group cust-fld">
                  <label>Start Time</label>
                  <DatePicker
                    className="form-control fld--time"
                    selected={moment(moment(weekday.start_time, ["h:mm A"]))}
                    onChange={this.onChangeStartTime.bind(this, index, day)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    dateFormat="LT"
                    timeCaption="Time"

                  />
                 

                </div>
              </div>
              <div className="col-md-5 divider-block text--left">
                <div className="form-group cust-fld">
                  <label>End Time</label>
                  <DatePicker
                    className="form-control fld--time"
                    selected={moment(moment(weekday.end_time, ["h:mm A"]))}
                    onChange={this.onChangeEndTime.bind(this, index, day)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="LT"
                    timeCaption="Time"
                    
                  />
                  
                 
                </div>
              </div>
              {/* <div className="col-md-1" style={{marginTop:"7%"}} onClick={this.onAddTimeSlot.bind(this,day)}><img src="/images/plus.png" alt="logo" style={{ height: "30px", width: "30px"   }} /></div> */}
              <button className="col-md-1 btn " style={{ marginTop: "7%", background: "white", border: "none" }} onClick={this.onDeleteTimeSlot.bind(this, index, day)} ><img src="/images/delete.png" alt="logo" style={{ height: "20px", width: "20px" }} /></button>
            </div>
            {this.state.isDiffrentTimeInvalid[day] ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "normal" }}>Please Enter Valid Time</label> : <br />}
          </div>
        )
      })
    }
  }
  // }
  renderweekdayfield() {

    let { sameTimeObj } = this.state;
    if (this.state.isSameTimeEveryday) {
      let sameTimeDayArr = [];
      sameTimeDayArr.push(this.state.sameTimeObj.day)
      if (sameTimeDayArr.length > 0) {
        return (
          <div>
            <div className="row">
              <div className="col-md-5 divider-block text--left">
                <div className="form-group cust-fld">
                  <label>Start Time</label>
                  <DatePicker
                    className="form-control fld--time"
                    selected={moment(moment(sameTimeObj.start_time, ["h:mm A"]))}
                    onChange={this.onChangeSameStartTime.bind(this)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="LT"
                    timeCaption="Time"
                  />
                 
                </div>
              </div>
              <div className="col-md-5 divider-block text--left">
                <div className="form-group cust-fld">
                  <label>End Time</label>
                  <DatePicker
                    className="form-control fld--time"
                    selected={moment(moment(sameTimeObj.end_time, ["h:mm A"]))}
                    onChange={this.onChangeSameEndTime.bind(this)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="LT"
                    timeCaption="Time"
                  />
                 
                </div>
              </div>
            </div>
            {this.state.isTimeInvalid ? <label className="help-block" style={{ color: "red", fontWeight: "normal", fontSize: "13px" }}>End Time Should Be Greater Than Start Time</label> : <br />}
          </div>
        )
      } else {
        return (
          <div></div>
        )
      }
    } else {
      return this.state.days.map((weekday, index) => {
        if (weekday.isSelected === true)
          return (
            <div className=" weekdays--day" key={"weekday" + index} >
              <div className="row" style={{ marginBottom: "5%" }}>
                <span className="col-md-4 c-heading-sm coloured" style={{ textTransform: "initial", fontSize: "12px", fontWeight: "700px" }}>{this.state.days[weekday.day - 1].name}</span>
                <div className="col-md-2" onClick={this.onAddTimeSlot.bind(this, weekday.day)}><img src="/images/plus.png" alt="logo" style={{ height: "20px", width: "20px" }} /></div>
              </div>
              {this.timeShow(weekday.day)}
            </div>
          )
      })
    }
  }

  renderProfessorList() {
    if (!this.state.batch.professorDetails) return false
    return this.state.batch.professorDetails.map((professor, index) => {
      return (
        <li key={"professor" + index}>
          <div className="card__elem">
            {professor.firstname + "   " + professor.lastname}
            <div className="card__elem__setting">
              <button onClick={this.DeleteProfessor.bind(this, professor)} ><i className="icon cg-rubbish-bin-delete-button"></i></button>
            </div>
          </div>
        </li>
      )
    })
  }
  renderAssistantProfessorList() {
    if (!this.state.batchassistant.assistantDetails) return false
    return this.state.batchassistant.assistantDetails.map((professor, index) => {
      return (
        <li key={"professor" + index}>
          <div className="card__elem">
            {professor.firstname + "   " + professor.lastname}
            <div className="card__elem__setting">
              <button onClick={this.DeleteAssistantProfessor.bind(this, professor)} ><i className="icon cg-rubbish-bin-delete-button"></i></button>
            </div>
          </div>
        </li>
      )
    })
  }
  renderProfessorCard() {
    if (!this.state.batch.professorDetails) return false
    if (this.state.batch.professorDetails && this.state.batch.professorDetails.length) {
      return (
        <div className="c-card__items h-small">
          <ul>
            {this.renderProfessorList()}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <div className="c-card__img">
            <img src="/images/card-img-4.png" alt="" />
          </div>
          <div className="c-card__info">No Faculty added yet</div>
        </div>
      )
    }
  }
  renderAssistantProfessorCard(){
    if (!this.state.batchassistant.assistantDetails) return false
    if (this.state.batchassistant.assistantDetails && this.state.batchassistant.assistantDetails.length) {
      return (
        <div className="c-card__items h-small">
          <ul>
            {this.renderAssistantProfessorList()}
          </ul>
        </div>
      )
    } else {
      return (
        <div>
          <div className="c-card__img">
            <img src="/images/card-img-4.png" alt="" />
          </div>
          <div className="c-card__info">No Faculty added yet</div>
        </div>
      )
    }
  }
  renderStudentList() {
    if (!this.state.batch.studentDetails) return false
    return (
      this.state.batch.studentDetails.map((student, index) => {
        return (
          <li key={"student" + index}>
            <div className="card__elem">
              {student.firstname + "   " + student.lastname}
              <div className="card__elem__setting">

                <button><i className="icon cg-rubbish-bin-delete-button" onClick={this.DeleteStudent.bind(this, index)}></i></button>
              </div>
            </div>
          </li>
        )
      })
    )
  }

  renderStudentCard() {
    if (this.state.batch.studentDetails && this.state.batch.studentDetails.length) {
      return (
        <div className="c-card__items h-small">
          <Scrollbars >
            <ul>
              {this.renderStudentList()}
            </ul>
          </Scrollbars >
        </div>
      )
    } else {
      return (
        <div>
          <div className="c-card__img">
            <img src="/images/card-img-5.png" alt="" />
          </div>
          <div className="c-card__info">No Students added yet</div>
        </div>
      )
    }
  }

  renderSelectSameTimeButton() {
    let count = 0;
    this.state.days.map((data, index) => {
      if (data.isSelected === true) {
        count++;
      }
    })
    if (count) {
      return (
        <div className="form-group cust-fld">
          {/* <label>Days of Week</label> */}
          <label htmlFor="check-one" className="custome-field field-checkbox">
            <input type="checkbox" name="check-one" id="check-one" onChange={this.onTimeChange.bind(this)} checked={this.state.isSameTimeEveryday} /><i></i>
            <span>Same Timings every day</span>

          </label>
        </div>
      )
    }
  }

  render() {
    
    return (
      <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a onClick={this.backMainDirectory.bind(this)} className="linkbtn hover-pointer">Back To Class Manager</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Batch Details</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.backMainDirectory.bind(this)}  >Back</button>
              <button className="c-btn prime" onClick={this.onSaveChange}>Save changes</button>
            </div>
          </div>
          <div className="cust-m-info color-red">Once the batch end date is passed, all students will be removed from the batch. You can still see all details of past batches in the archives section.</div>
        </div>

        <div className="c-container__data no-round">

          <div className="c-inlineForm">
            <div className="inline--flexbox">
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Class Name</label>
                  <input type="text" className="form-control" value={this.state.batch.batchDetail && this.state.batch.batchDetail.class_name ? this.state.batch.batchDetail.class_name : ''} placeholder="Enter Class Name" readOnly="readonly" />
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Subject Name</label>
                  <input type="text" className="form-control" value={this.state.batch.subjectDetail && this.state.batch.subjectDetail.subject_name ? this.state.batch.subjectDetail.subject_name : ''} placeholder="Enter Subject Name" readOnly="readonly" />
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Batch Name</label>
                  <input type="text" className="form-control" value={this.state.batch.batchDetail && this.state.batch.batchDetail.name ? this.state.batch.batchDetail.name : ''} onChange={this.onChangeBatchName.bind(this)} placeholder="Enter Batch Name" />
                  {this.state.isBatchNameVisible ? <label className="help-block" style={{ color: "red" }}>Enter Batch Name</label> : <br />}
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>Start Date</label>
                  <DatePicker
                    className="form-control fld--date"
                    selected={this.state.batch.batchDetail && this.state.batch.batchDetail.start_date ? moment(this.state.batch.batchDetail.start_date) : moment()}
                    onChange={this.onChangeStartDate.bind(this)}
                  />
                  {/* <input type="text" className="form-control fld--date" value={this.state.batch.batchDetail.start_date || ''} onChange={this.onChangeStartDate.bind(this)} placeholder="Enter Start Date" /> */}
                  {this.state.isStartDateVisible ? <label className="help-block" style={{ color: "red" }}>Enter Start Date</label> : <br />}
                </div>
              </div>
              <div className="inline--flex">
                <div className="form-group cust-fld">
                  <label>End Date</label>
                  <DatePicker
                    className="form-control fld--date "
                    selected={this.state.batch.batchDetail && this.state.batch.batchDetail.end_date ? moment(this.state.batch.batchDetail.end_date) : moment()}
                    onChange={this.onChangeEndDate.bind(this)}
                  />
                  {/* <input type="text" className="form-control fld--date" value={this.state.batch.batchDetail.end_date || ''} onChange={this.onChangeEndDate.bind(this)} placeholder="Enter End Date" /> */}
                  {this.state.isEndDateVisible ? <label className="help-block" style={{ color: "red" }}>End Date Should Be Greater Than Start Date</label> : <br />}
                  {this.state.isDateInvalid ? <label className="help-block" style={{ color: "red" }}>End Date Should Be Greater Than Start Date</label> : <br />}
                </div>
              </div>
            </div>
          </div>

          <div className="card-container" >

            <div className="c-card" >
              <Scrollbars >
                <div className="c-card__title" >
                  <span className="c-heading-sm card--title">
                    Schedule
  								</span>
                </div>

                <div className="c-card__form margin0-bottom">
                  <div className="form-group cust-fld">
                    <label>Schedule Type</label>
                    <div className="form-group cust-fld">
                      <button className="form-control" type="text" style={{ textAlign: "left" }}>
                        {this.titleCase(this.state.batch.schedule_type)}
                      </button>
                      {this.state.isScheduleTypeVisible ? <label className="help-block" style={{ color: "red" }}>Select Schedule Type</label> : <br />}

                      {/* <ul className="dropdown-menu" aria-labelledby="dLabel" style={{ marginTop: "-21px" }}>
                        {this.renderSchedule()}
                      </ul> */}

                    </div>
                  </div>
                  <div className="form-group cust-fld">
                    <label>Days of Week</label>
                    <div className="weekDays-selector clearfix">
                      {this.renderButtonList()}
                    </div>
                    {this.state.isDayVisible ? <label className="help-block" style={{ color: "red" }}>Add Atleast One Day</label> : <br />}
                    {this.state.errorFlag ? <label className="help-block" style={{ color: "red" }}>Add Atleast One Time Schedule</label> : <br />}
                  </div>
                  {this.renderSelectSameTimeButton()}

                  <div className="weekdays--fields" >
                    {this.renderweekdayfield()}
                  </div>

                </div>
              </Scrollbars >
            </div>

            <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Faculty
  									<span className="c-count filled">{this.state.batch.professorDetails && this.state.batch.professorDetails.length}</span>
                </span>
              </div>
              <div className="c-card__form">
                <div className="form-group cust-fld">
                  <label>Faculty Name</label>
                  <div className="row inline-formfld"  >
                  
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 " >
                      <AsyncTypeahead
                        id="professor"
                        ref="professor"
                        isLoading={this.state.isLoading}
                        multiple={false}
                        onSearch={(query) => { this.onSerachProfessor(query) }}
                        onFocus={this.onGetAllProfessor.bind(this)}
                        options={this.state.option1}
                        minLength={0}
                        placeholder="Choose Professor"
                        onChange={(selected) => { this.onChangeSelector(selected) }}
                        clearButton
                        
                      />
                      
                    </div>
                   
                    
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                      {/* <input type="text" className="form-control" value={this.state.newFacultyName} onChange={this.onFacultyNameChange.bind(this)} placeholder="Enter Faculty Name" /> */}
                      <button className="c-btn-large primary">Add</button>
                    </div>
                  </div>
                  {this.state.isProfessorVisible ? <label className="help-block" style={{ color: "red" }}>Please Add Professor</label> : <br />}
                  {this.state.displayAssistantProfessorExists ? <label className="help-block" style={{ color: "red" }}>Added Professor Already Exists Please Add Another Professor</label> : <br />}
                </div>
              </div>
              {this.renderProfessorCard()}
              <div className="c-card__form">
                <div className="form-group cust-fld">
                  <label>Assistant Faculty Name</label>
                  <div className="row inline-formfld"  >
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                      <AsyncTypeahead
                        id="asstprofessor"
                        ref="asstprofessor"
                        isLoading={this.state.isLoading}
                        multiple={false}
                        onSearch={(query) => { this.onSerachProfessor(query) }}
                        onFocus={this.onGetAllProfessor.bind(this)}
                        options={this.state.option1}
                        minLength={0}
                        placeholder="Choose Professor"
                        onChange={(selected) => { this.onAssistantChangeSelector(selected) }}
                        clearButton
                      />
                    </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                      {/* <input type="text" className="form-control" value={this.state.newFacultyName} onChange={this.onFacultyNameChange.bind(this)} placeholder="Enter Faculty Name" /> */}
                      <button className="c-btn-large primary">Add</button>
                    </div>
                  </div>
                  {this.state.isAssistantProfessorVisible ? <label className="help-block" style={{ color: "red" }}>Please Add Assistant Professor</label> : <br />}
                  {this.state.displayProfessorExists ? <label className="help-block" style={{ color: "red" }}>Added Professor Already Exists Please Add Another Professor</label> : <br />}
                </div>
              </div>
              {this.renderAssistantProfessorCard()}
            </div>
            
            <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Students
  									<span className="c-count filled">{this.state.batch.studentDetails && this.state.batch.studentDetails.length}</span>
                </span>
              </div>
              <div className="c-card__form">
                <div className="form-group cust-fld">
                  <label>Student Name / Phone Number</label>
                  <div className=" row inline-formfld">
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                      {/* <AsyncTypeahead
                        ref="student"
                        isLoading={this.state.isLoading}
                        multiple={false}
                        onSearch={(query) => { this.onSerachStudent(query) }}
                        onFocus={this.onGetAllStudent.bind(this)}
                        options={this.state.option}
                        minLength={0}
                        placeholder="Choose  Student"
                        onChange={(selected) => { this.onChangeStudentSelector(selected) }}
                      /> */}
                      <Select
                        // defaultValue={[colourOptions[2], colourOptions[3]]}
                        isMulti
                        name="students"
                        closeMenuOnSelect={false}
                        options={this.state.option}
                        onSearch={(query) => { this.onSerachStudent(query) }}
                        onFocus={this.onGetAllStudent.bind(this)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selected) => { this.setState({selectedValues:selected}) }}
                      />
                      </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                      <button className="c-btn-large primary" onClick={this.onChangeStudentSelector.bind(this,this.state.selectedValues)}>Add</button>
                    </div>
                    {/* <input type="text" className="form-control" value={this.state.newStudentName} onChange={this.onStudentNameChange.bind(this)} placeholder="Enter Student Name" /> */}
                  </div>
                  {this.state.isStudentVisible ? <label className="help-block" style={{ color: "red" }}>Please Add Atleast One Student</label> : <br />}


                </div>
                <div className="clearfix">
                  <button className="link--btn" data-toggle="modal" data-target="#csvupload">CSV Upload</button>
                  <button className="link--btn" data-toggle="modal" data-target="#cpyanotherBatch">Copy From Another Batch</button>
                </div>
              </div>
              {this.renderStudentCard()}
            </div>
          </div>
        </div>
        <CopyBatchModal onAddStudent={(data) => { this.addStudentCopy(data) }}
          batchId={this.state.pro}
          {...this.props} onModalClose={this.onModalClose.bind(this)} />
        <CsvUploadModal onUploadCsv={(data, id) => { this.uploadCsv(data, id) }} onModalClose={this.onModalClose.bind(this)} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  batchDetails: app.batchDetails,
  updatedBatchDetail: app.updatedBatchDetail,
  instituteId: app.institudeId,
  branchId: app.branchId,
  serachProfessorDetails: app.serachProfessorDetails,
  serachStudentDetails: app.serachStudentDetails,
  classes: app.classes,
  subjects: app.subjects,
  batches: app.batches,
  newStudentCopy: app.newStudentCopy,
  classListYearwise: app.classListYearwise,
  uploadedCsv: app.uploadedCsv,
  studentList: app.studentList,
  professorList: app.professorList,
  token: auth.token,
  userType: auth.userType,
  yearListStudentCopy: app.yearListStudentCopy,
  sendInvitation: app.sendInvitation,
  financeList: app.financeList,
  getFinanceeditData: app.getFinanceeditData,
  autoAssignHwQuizNotes: app.autoAssignHwQuizNotes,
  ProfessorAdmin : app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBatchDetail,
      updateBatchDetails,
      searchProfessorsDetails,
      serachStudentsDetails,
      addStudentCopy,
      getSubjects,
      getBatches,
      getClassesOnSelectedYear,
      uploadCsvFile,
      getAllStudent,
      getAllProfessor,
      getYearListForStudentCopy,
      invitationSend,
      getFinancelist,
      getEditFinanceData,
      autoAssignHomeworkQuizNotes,
      getIsProfessorAdmin
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(BatchDetails)
