import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CsvUploadModal } from '../common/csvUploadModal';
import { AddStudentBatchModel } from '../common/addStudentBatchModal';
import { getStudentDetail } from '../../actions/index';
import { AddPayment } from '../common/addPaymentModel';
import {
  getClasses, getSubjects, getBatches, addStudentBatches,
  updateStudentDetails, deleteStudentBatch, createStudentPaymentSchedule,
  createStudentPaymentDetail, updateStudentPaymentDetail, createStudentPaymentList,
  createStudentPayment, deleteStudentPaymentDetail, getFinancelist, getEditFinanceData,
  deleteStudentProfessor, getIsProfessorAdmin
} from '../../actions/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { validateFormField } from '../../helpers/validate';
import { successToste, errorToste } from '../../constant/util';
import { Scrollbars } from 'react-custom-scrollbars';
import { DeleteModal } from '../common/deleteModal';

class StudentDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      student_id: null,
      Student: {
        studentDetail: {},
        batchDetails: [],
        activity: {}
      },
      studentType: false,
      activity: { homeworkDone: null, quizDone: null, totalQuiz: null, totalHomework: null },
      editable: false,
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isFirstNameVisible: false,
      isPhoneNumberVisible: false,
      isEmailVisible: false,
      isCollegeVisible: false,
      isDobVisible: false,
      isGardianName: false,
      isGardianPhone: false,
      isEmailValidationVisible: false,
      financeArray: [],
      installmentArray: [],
      editableRow: {
        editable: false,
        index: ''
      },
      installmentInfo: [],
      templateInfo: {},
      installmentIndex: 1,
      installArrayAdd: [],
      addedData: {},
      Id: '',
      installMapObjArray: [],
      studentPaymentlistArray: [],
      studentPaymentList: [],
      unPaidInstallments: [],
      paymentDetailsList: [],
      isSavepayentClick: false,
      finance_name: 'Select Finance Name',
      paidFee: '',
      unpaidFee: '',
      deleteObj: null,
      index: 0,
      obj: {},
      id: 0,
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
            else {
              var pro = this.props ? this.props.location.state.branchId : ""
              if (pro != nextProps.branchId) {
                this.setState({ branchId: nextProps.branchId }, () => {
                  this.props.history.push('/app/student-directory')
                });
              }
            }
          })
        })
      }
    }
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId }, () => {
      const pro = this.props.location.state.data ? this.props.location.state.data : null;
      let data = {
        'institude_id': this.props.instituteId,
        'branch_id': this.props.branchId,
        'student_id': pro.student_id,
        token: this.props.token,
      }
      this.props.getStudentDetail(data).then(() => {
        let res = this.props.studentDetail;

        if (res && res.status == 200) {
          this.setState({ Student: res.data.response, student_id: pro.student_id, studentType: pro.state == "ALUMNI" ? true : false });
        }
      });
      //this.listOfPaymentAdd();
      this.financeList();
      this.listOfStudentPayment();

    })
  }

  financeList() {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getFinancelist(data).then(() => {
      let res = this.props.financeList;
      if (res && res.status == 200) {
        this.setState({ financeArray: res.response })
      }
    })
  }

  listOfStudentPayment() {
    const pro = this.props.location.state.data ? this.props.location.state.data : null;
    let data = {
      payload: {
        student_id: pro.student_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.createStudentPaymentList(data).then(() => {
      let res = this.props.studentPaymentList;
      if (res && res.status == 200) {
        this.setState({
          studentPaymentList: res.response,
          paymentDetailsList: res.response.paymentDetailsList,
          unPaidInstallments: res.response.unPaidInstallments,


        }, () => {
          let amt = 0;
          let unpaidamt = 0;
          if (this.state.paymentDetailsList && this.state.paymentDetailsList.length > 0) {
            this.state.paymentDetailsList.map((paid, index) => {

              amt = Number(amt) + Number(paid.paidAmount);
            })
          }

          if (this.state.unPaidInstallments && this.state.unPaidInstallments.length > 0) {
            this.state.unPaidInstallments.map((unpaid, index) => {

              unpaidamt = Number(unpaidamt) + Number(unpaid.amount);

            })
          }

          this.setState({ paidFee: amt, unpaidFee: unpaidamt });
        })
      }
    });

  }

  listOfPaymentAdd() {
    const pro = this.props.location.state.data ? this.props.location.state.data : null;
    let data = {
      payload:
        { student_id: pro.student_id },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }

    this.props.createStudentPaymentDetail(data).then(() => {
      let res = this.props.studentPaymentDetailAdd;
      if (res && res.status == 200) {

      }
    })
  }

  validate() {
    let studentDetail = this.state.Student.studentDetail;
    var isValidForm = true;
    var regx = /^[a-zA-Z ]+$/;
    if (studentDetail.firstname.length == 0 || !studentDetail.firstname.match(regx)) {
      this.setState({ isFirstNameVisible: true });
      isValidForm = false
    }
    if (studentDetail.mobile.length == 0 || studentDetail.mobile.length != 10) {
      this.setState({ isPhoneNumberVisible: true });
      isValidForm = false
    }
    if (studentDetail.email.length == 0 || !validateFormField("email", studentDetail.email)) {
      this.setState({ isEmailVisible: true });
      isValidForm = false
    }
    if (!studentDetail.college) {
      this.setState({ isCollegeVisible: true });
      isValidForm = false
    }
    if (!studentDetail.DOB) {
      this.setState({ isDobVisible: true });
      isValidForm = false
    }
    if (!studentDetail.guradian_name) {
      this.setState({ isGardianName: true });
      isValidForm = false
    }
    if (!studentDetail.guradian_phone || studentDetail.guradian_phone.length != 10) {
      this.setState({ isGardianPhone: true });
      isValidForm = false
    }
    return isValidForm;
  }

  onPersonalDetailChange(propertyName, event) {
    if (propertyName == "firstname") {
      this.setState({ isFirstNameVisible: false })
    }
    if (propertyName == "mobile") {
      this.setState({ isPhoneNumberVisible: false })
    }
    if (propertyName == "college") {
      this.setState({ isCollegeVisible: false })
    }
    if (propertyName == "DOB") {
      this.setState({ isDobVisible: false })
    }
    if (propertyName == "email") {
      this.setState({ isEmailVisible: false })
    }
    if (propertyName == "guradian_name") {
      this.setState({ isGardianName: false })
    }
    if (propertyName == "guradian_phone") {
      this.setState({ isGardianPhone: false })
    }

    let Student = this.state.Student;
    let studentDetail = Student.studentDetail;
    studentDetail = { ...studentDetail, [propertyName]: event.target.value };
    Student = { ...Student, studentDetail };
    this.setState({ Student });
  }

  OnChangeEditable(event) {
    let editable = !this.state.editable
    this.setState({ editable });
  }

  handleChange(date) {

    let Student = this.state.Student;
    let studentDetail = Student.studentDetail;
    studentDetail = { ...studentDetail, DOB: date };
    Student = { ...Student, studentDetail };
    this.setState({ Student });
  }

  onStudentBatchAdd(payload) {

    let batch_student = { "batch_student": payload };

    let data = {
      "payload": batch_student,
      'institude_id': this.props.instituteId,
      'branch_id': this.props.branchId,
      'student_id': this.state.student_id,
      token: this.props.token,
    }
    this.props.addStudentBatches(data).then(() => {
      let data = {
        'institude_id': this.props.instituteId,
        'branch_id': this.props.branchId,
        'student_id': this.state.student_id,
        token: this.props.token,
      }
      if (this.props.studentBatch) {
        successToste("Batch Added Successfully")
      }
      this.props.getStudentDetail(data).then(() => {
        let res = this.props.studentDetail;
        if (res && res.status == 200) {
          this.setState({ Student: res.data.response });
        }
      });
    })
    $("#addBatch .close").click();
  }



  backButton(event) {
    this.props.history.push('/app/student-directory')
  }

  // onDeleteStudent() {
  //   let data = {
  //     payload: {
  //       types: "Student",
  //       id: this.state.student_id
  //     },
  //     institude_id: this.props.instituteId,
  //     branch_id: this.props.branchId,
  //     token: this.props.token,
  //   }
  //   this.props.deleteStudentProfessor(data).then(() => {
  //     let res = this.props.studentProfessorDelete;
  //   })
  // }

  onSelectFinance(finance) {
    let { finance_name } = this.state;
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      finance_template_id: finance.finance_template_id
    }
    this.props.getEditFinanceData(data).then(() => {
      let res = this.props.getFinanceeditData;
      if (res && res.status == 200) {
        this.setState({
          templateInfo: res.response.templateInfo,
          installmentInfo: res.response.installmentInfo,
          finance_name: finance.name,
          finance_template_id: finance.finance_template_id
        })
      }
    })
    // this.listOfPaymentAdd();
  }

  editStudentPayment(index, obj, id) {
    let { editableRow } = this.state;
    editableRow.index = index;
    editableRow.editable = true;
    this.setState({ editableRow })
  }

  changeDate(index, date) {
    let { unPaidInstallments } = this.state;
    if (date == null) {

      unPaidInstallments[index] = { ...unPaidInstallments[index], payment_date: moment() };
    }
    else {
      let isAfterError = false;
      let isBeforeError = false;
      unPaidInstallments.map((data, i) => {

        if (i == index) {

        } else if (i < index) {
          if ((date).isBefore(moment(data.payment_date))) {
            isBeforeError = true;
          }
        } else {
          if ((date).isAfter(moment(data.payment_date))) {
            isAfterError = true;
          }
        }
      })
      if (isAfterError) {
        errorToste("Date Should be Smaller Than Upcoming Installment Date")
      } else if (isBeforeError) {
        errorToste("Date Should be Greater Than Previous Installment Date")
      } else {
        unPaidInstallments[index] = { ...unPaidInstallments[index], payment_date: date };
      }
    }
    this.setState({ unPaidInstallments })
  }

  onDeleteModel(key, index, obj, id) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, index, obj, id });
  }

  onDeleteEntry(flag) {
    let { obj, index, id } = this.state;
    if (flag == 'financestudent') {
      this.deleteStudentPayment(index, id);
      $("#quizSubmit .close").click();
    }
    if (flag == 'deletestudent') {
      this.onDeleteStudent();
      $("#quizSubmit .close").click();
    }
    if (flag == 'dltBatchStudent') {

      this.onDeleteBatch(id);
      $("#quizSubmit .close").click();
    }
  }

  onDeleteBatch(id, event) {
    let batch_student = {
      batch_student: [{ "batch_id": id }]
    };
    let data = {
      'institude_id': this.props.instituteId,
      'branch_id': this.props.branchId,
      'student_id': this.state.student_id,
      "payload": batch_student,
      token: this.props.token,
    }
    this.props.deleteStudentBatch(data).then(() => {
      let res = this.props.deleteStudBatch;
      if (res && res.status == 200) {
        let data = {
          'institude_id': this.props.instituteId,
          'branch_id': this.props.branchId,
          'student_id': this.state.student_id,
          token: this.props.token
        }
        this.props.getStudentDetail(data).then(() => {
          let res = this.props.studentDetail;
          if (res && res.status == 200) {
            this.setState({ Student: res.data.response });
          }
        });
        successToste("Batch Deleted Successfully")
      }
      else if (res && res.status == 500) {
        errorToste("Something Went Wrong")
      }
    })
  }

  onDeleteStudent() {
    let data = {
      payload: {
        types: "Student",
        id: this.state.student_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.deleteStudentProfessor(data).then(() => {
      let res = this.props.studentProfessorDelete;
      if (res && res.status == 200) {
        this.props.history.push('/app/student-directory');
        successToste("Student Deleted Successfully")
      }
      else if (res && res.status == 500) {
        errorToste("Something Went Wrong")
      }
    })
  }

  deleteStudentPayment(index, id) {
    let { installmentArray, unPaidInstallments } = this.state;
    let obj = installmentArray[index];
    let data = {
      student_finance_schedule_id: id,
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.deleteStudentPaymentDetail(data).then(() => {
      let res = this.props.studentPaymentDetailDelete;
      if (res && res.status == 200) {
        this.listOfStudentPayment();
      }
    })
  }

  updateStudentPayment(index, id) {
    const pro = this.props.location.state.data ? this.props.location.state.data : null;
    let { unPaidInstallments } = this.state;
    let obj = unPaidInstallments[index];

    let data = {
      payload: {
        student_finance_schedule_id: id,
        payment_date: obj.payment_date,
        installment_no: obj.installment_no,
        amount: obj.amount,
        total_amount: obj.total_amount,
        student_id: pro.student_id,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.updateStudentPaymentDetail(data).then(() => {
      let res = this.props.studentPaymentDetailUpdate;
      let { editableRow } = this.state;
      editableRow.index = index
      editableRow.editable = false
      this.setState({ editableRow })
    })
  }



  onStudentPaymentAdd(newPayment) {

    let { unPaidInstallments, paymentDetailsList } = this.state;
    const pro = this.props.location.state.data ? this.props.location.state.data : null;
    let data = {
      payload: {
        payment_date: newPayment.payment_date,
        amount: newPayment.amount,
        student_finance_schedule_id: unPaidInstallments ? unPaidInstallments[0].student_finance_schedule_id : "",
        student_id: pro.student_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.createStudentPayment(data).then(() => {
      let res = this.props.studentPaymentAdd;
      if (res && res.status == 200) {


        if (Number(newPayment.amount) < Number(unPaidInstallments[0].amount)) {
          let remainingAmt = unPaidInstallments[0].amount - newPayment.amount
          let amt = unPaidInstallments[1].amount;
          unPaidInstallments[1].amount = parseInt(amt) + parseInt(remainingAmt);
          unPaidInstallments[1].amount = unPaidInstallments[1].amount.toString()
          this.setState({ unPaidInstallments })


          let data = {
            payload: {
              student_finance_schedule_id: unPaidInstallments[1].student_finance_schedule_id,
              payment_date: unPaidInstallments[1].payment_date,
              installment_no: unPaidInstallments[1].installment_no,
              amount: unPaidInstallments[1].amount,
              total_amount: unPaidInstallments[1].total_amount,
              student_id: pro.student_id,
            },
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token
          }

          this.props.updateStudentPaymentDetail(data).then(() => {
            let res = this.props.studentPaymentDetailUpdate
          })
        }
        else if (Number(newPayment.amount) > Number(unPaidInstallments[0].amount)) {

          let remainingAmount = newPayment.amount - unPaidInstallments[0].amount
          let removedIndexArray = []

          for (let i = 1; i < unPaidInstallments.length; i++) {
            if (remainingAmount > unPaidInstallments[i].amount) {
              remainingAmount = remainingAmount - unPaidInstallments[i].amount;
              //  paymentDetailsList.push(unPaidInstallments[i]);
              // removedIndexArray.push(i)
              // unPaidInstallments.splice(i, 1)
              unPaidInstallments[i].amount = 0;
              let data = {
                payload: {
                  student_finance_schedule_id: unPaidInstallments[i].student_finance_schedule_id,
                  payment_date: unPaidInstallments[i].payment_date,
                  installment_no: unPaidInstallments[i].installment_no,
                  amount: unPaidInstallments[i].amount,
                  total_amount: unPaidInstallments[i].total_amount,
                  student_id: pro.student_id,
                },
                institude_id: this.props.instituteId,
                branch_id: this.props.branchId,
                token: this.props.token
              }

              this.props.updateStudentPaymentDetail(data).then(() => {
                let res = this.props.studentPaymentDetailUpdate

              })
            }
            else {
              unPaidInstallments[i].amount = unPaidInstallments[i].amount - remainingAmount;
              let data = {
                payload: {
                  student_finance_schedule_id: unPaidInstallments[i].student_finance_schedule_id,
                  payment_date: unPaidInstallments[i].payment_date,
                  installment_no: unPaidInstallments[i].installment_no,
                  amount: unPaidInstallments[i].amount,
                  total_amount: unPaidInstallments[i].total_amount,
                  student_id: pro.student_id,
                },
                institude_id: this.props.instituteId,
                branch_id: this.props.branchId,
                token: this.props.token
              }

              this.props.updateStudentPaymentDetail(data).then(() => {
                let res = this.props.studentPaymentDetailUpdate

              })

              break;
            }
          }



          this.setState({ unPaidInstallments, paymentDetailsList })

        }

        this.listOfStudentPayment();



      }
    })

    $("#addPayment .close").click();

  }

  onSavePayment() {
    let { unPaidInstallments, installmentInfo, templateInfo, installmentIndex } = this.state;
    const pro = this.props.location.state.data ? this.props.location.state.data : null;
    let remainingAmount = templateInfo.total_amount - templateInfo.advance_amount
    let installArray = [];
    let len = installmentInfo.length
    for (let i = 0; i < len; i++) {
      let obj = installmentInfo[i];
      let instObj = {
        "payment_date": obj.payment_date,
        "amount": obj.amount,
        "installment_no": i + 1,
        "total_amount": remainingAmount
      }
      installArray.push(instObj)
    }
    let data = {
      payload: {
        paymentSchedule: installArray,
        student_id: pro.student_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }

    this.props.createStudentPaymentSchedule(data).then(() => {
      let res = this.props.studentPaymentScheduleAdd;
      if (res && res.status == 200) {

        let data = {
          payload:
            { student_id: pro.student_id },
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,

        }
        this.props.createStudentPaymentDetail(data).then(() => {
          let res = this.props.studentPaymentDetailAdd;
          if (res && res.status == 200) {
            let newArr = res.response;
            let onlyUnPaidAray = [];
            newArr.map((data, index) => {
              if (data.status == "UNPAID") {
                onlyUnPaidAray.push(data)
              }
            })
            this.setState({ unPaidInstallments: onlyUnPaidAray, isSavepayentClick: true });
            this.listOfStudentPayment();
          }
        })
      }
    })
  }

  getData(rows) {

    this.setState({ addedData: rows })
  }

  renderFinanceInfo() {

    let { paymentDetailsList, unPaidInstallments, paidFee, unpaidFee } = this.state;


    return (
      <div>
        <div className="divider-container">
          <div className="divider-block text--left">
            <div className="form-group static-fld">
              <label>Total Fees</label>
              <span className="info-type">{Number(this.state.paidFee) + Number(this.state.unpaidFee)}</span>
            </div>
          </div>

        </div>
        <div className="divider-container">
          <div className="divider-block text--left">
            <div className="form-group static-fld">
              <label>Enrollment Date</label>
              <span className="info-type st-alert">{paymentDetailsList && paymentDetailsList[0] ? moment(paymentDetailsList[0].studentPaidPaymentDate).format("MM-DD-YYYY") : "Not Added Yet"}</span>
            </div>
          </div>
          <div className="divider-block text--left">
            <div className="form-group static-fld">
              <label>Fees Paid</label>
              <span className="info-type st-alert">{this.state.paidFee ? this.state.paidFee : "Not Added Yet"}</span>
            </div>
          </div>
        </div>

        <div className="divider-container">
          <div className="divider-block text--left">
            <div className="form-group static-fld">
              <label>Due Date</label>
              <span className="info-type st-alert">{unPaidInstallments && unPaidInstallments[0] ? moment(unPaidInstallments[0].payment_date).format("MM-DD-YYYY") : "No Due Date"}</span>
            </div>
          </div>
          <div className="divider-block text--left">
            <div className="form-group static-fld">
              <label>Due</label>
              <span className="info-type st-alert">{unPaidInstallments && unPaidInstallments[0] ? unPaidInstallments[0].amount : "No Due"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  viewReport() {
    let self = this;
    this.props.history.push({
      pathname: "/app/student-report",
      state: { data: self.state.student_id }
    })
  }

  renderFinanceList() {
    if (this.state.financeArray && this.state.financeArray.length > 0) {
      return this.state.financeArray.map((finance, index) => {
        return (
          <li key={"key" + index}>
            <a onClick={this.onSelectFinance.bind(this, finance)} className="dd-option">{finance.name}</a>
          </li>
        )
      })
    }
  }

  renderTableRow() {
    let { installmentInfo } = this.state;
    if (installmentInfo && installmentInfo.length > 0) {

      return (
        <tbody>
          {
            installmentInfo.map((rows, index) => {
              return (
                <li key={"key" + index} style={{ width: "280px" }}>
                  <tr >
                    <td ><span style={{ color: "#3D3F61" }}>{moment(rows.payment_date).format("MM-DD-YYYY")}  </span></td>&nbsp;&nbsp;&nbsp;
                    <td ><span style={{ color: "#3D3F61", marginLeft: "60px" }}>{rows.amount}</span></td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                  </tr>
                </li>
              )
            })
          }
        </tbody>
      )

    }
  }

  renderStudnetPaymentList() {
    let { paymentDetailsList } = this.state;
    if (paymentDetailsList && paymentDetailsList.length > 0) {
      return (
        <tbody>{
          paymentDetailsList.map((obj, index) => {
            return (
              <li key={"key" + index} style={{ width: "280px" }}>
                <tr>
                  <td ><span style={{ color: "#3D3F61" }}>{moment(obj.studentPaidPaymentDate).format("MM-DD-YYYY")}  </span></td>&nbsp;&nbsp;&nbsp;
                  <td ><span style={{ color: "#3D3F61", marginLeft: "15px" }}>{obj.paidAmount}</span></td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <td><span style={{ color: "#3D3F61", marginLeft: "15px" }}>{obj.student_firstName}</span></td>
                </tr>
              </li>
            )
          })
        }
        </tbody>

      )
    }
  }

  renderStudnetUnpaidList() {
    let { unPaidInstallments } = this.state;

    if (unPaidInstallments && unPaidInstallments.length > 0) {

      unPaidInstallments.map((obj, index) => {
        if (obj.amount == 0) {
          unPaidInstallments.splice(index, 1)
        }
      })

      return (
        <tbody>
          {
            unPaidInstallments.map((obj, index) => {
              if (this.state.editableRow.index == index && this.state.editableRow.editable) {
                return (
                  <li key={"key" + index} style={{ width: "280px" }}>
                    <tr>
                      <td >< DatePicker style={{ width: "200%" }} onChange={this.changeDate.bind(this, index)} className="form-control fld--date" selected={obj.payment_date ? moment(obj.payment_date) : moment()} /> </td>
                      {/* <td ><input value={obj.amount} onChange={this.changeInput.bind(this,"amount",index)} style={{ width: "120%" }} type="number" className="form-control" placeholder="Amount" /> </td>&nbsp;&nbsp; */}
                      <td><span style={{ color: "#3D3F61" }} onClick={this.updateStudentPayment.bind(this, index, obj.student_finance_schedule_id)}><img src="/images/icon_edit.png" alt="logo" style={{ height: "15px", width: "15px", marginLeft: "50px" }} /></span></td>
                    </tr>
                  </li>
                )
              }
              else {
                return (

                  <li key={"key" + index} style={{ width: "280px" }}>
                    <tr>
                      <td ><span style={{ color: "#3D3F61" }}>{moment(obj.payment_date).format("MM-DD-YYYY")}  </span></td>&nbsp;&nbsp;&nbsp;
                      <td ><span style={{ color: "#3D3F61", marginLeft: "15px" }}>{obj.amount}</span></td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <td>
                        <div className="card__elem__setting">
                          <button onClick={this.editStudentPayment.bind(this, index, obj, obj.student_finance_schedule_id)} className="act-edit"></button>
                          <button data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "financestudent", index, obj, obj.student_finance_schedule_id)} className="act-delete"></button>
                        </div>
                      </td>
                    </tr>
                  </li>
                )
              }
            })
          }
        </tbody>
      )
      this.setState({ unPaidInstallments })
    }
  }

  renderBatchClass(index) {
    return this.state.Student.batchDetails[index].timeTable.map((ClassDetail, idx) => {
      return (
        <li key={"classdetail" + idx} >
          <a>
            <span>{ClassDetail.subject_name}</span>
            <span>{this.state.day[ClassDetail.day]} {ClassDetail.start_time}{" to "}{ClassDetail.end_time}</span>
          </a>
          {/* <div className="card__elem__setting">
           
            <button data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "dltBatchStudent", 0, 0, ClassDetail.batch_id)} className="act-delete"></button>
          </div> */}
        </li>
      )
    })
  }

  renderBatch() {
    if (!this.state.Student.batchDetails) return false
    return this.state.Student.batchDetails.map((batch, index) => {

      if (batch.timeTable.length == 0) return false
      return (
        <div key={"batch" + index} className="c-batchList">

          <span className="c-batchList__title">{batch.className}<img src="/images/Arrow.png" alt="logo" style={{ height: "10px", width: "20px" }} />{batch.batchName}
            <div className="card__elem__setting1">
              <button style={{ marginRight: "-220px", marginTop: "-7px" }} data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "dltBatchStudent", 0, 0, batch.timeTable[0].batch_id)} className="act-delete pull-right"></button>
            </div>
          </span>

          <div className="c-batchList__list">
            <ul>
              {this.renderBatchClass(index)}
            </ul>
          </div>
        </div>
      )
    })
  }

  renderPersonDetailCard() {
    if (this.state.editable) {
      return (
        <div className="clearfix">
          <div className="c-card__form">
            <div className="form-group cust-fld">
              <label>Name</label>
              <input type="text" className="form-control" value={this.state.Student.studentDetail.firstname} onChange={this.onPersonalDetailChange.bind(this, "firstname")} placeholder="Full Name Goes Here" />
              {this.state.isFirstNameVisible ? <label className="help-block" style={{ color: "red" }}>Please enter valid name</label> : <br />}
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>Phone</label>
                  <input type="number" value={this.state.Student.studentDetail.mobile} className="form-control" onChange={this.onPersonalDetailChange.bind(this, "mobile")} placeholder="Phone" />
                  {this.state.isPhoneNumberVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Phone Number</label> : <br />}
                </div>
                <div className="form-group cust-fld">
                  <label>Email</label>
                  <input type="email" value={this.state.Student.studentDetail.email} className="form-control" onChange={this.onPersonalDetailChange.bind(this, "email")} placeholder="Email" />
                  {this.state.isEmailVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Email</label> : <br />}
                </div>
              </div>
              <div className="divider-block text--left">
                <div className="c-user-pic">
                  <span className="fld-title">Avatar</span>
                  <div className="user--img"><img src={this.state.Student.profilePicture ? this.state.Student.profilePicture : "/images/avatars/Avatar_default.jpg"} alt="Avatar" /></div>
                  <button className="link--btn">Change Avatar</button>
                </div>
              </div>
            </div>
            <div className="form-group cust-fld">
              <label>College</label>
              <input type="text" value={this.state.Student.studentDetail.college} className="form-control" onChange={this.onPersonalDetailChange.bind(this, 'college')} placeholder="College" />
              {this.state.isCollegeVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter College Name</label> : <br />}
            </div>
            <div className="form-group cust-fld">
              <label>Date of Birth</label>
              <DatePicker className="form-control fld--date" selected={this.state.Student.studentDetail.DOB ? moment(this.state.Student.studentDetail.DOB) : moment()} onChange={this.handleChange.bind(this)} />
              {this.state.isDobVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Date of Birth</label> : <br />}
            </div>
            <div className="form-group cust-fld">
              <label>Guardian Name</label>
              <input type="text" value={this.state.Student.studentDetail.guradian_name} className="form-control" onChange={this.onPersonalDetailChange.bind(this, "guradian_name")} placeholder="Gurdian Name" />
              {this.state.isGardianName ? <label className="help-block" style={{ color: "red" }}>Please Enter Guradian Name</label> : <br />}
            </div>
            <div className="form-group cust-fld">
              <label>Guardian Phone</label>
              <input type="number" className="form-control" value={this.state.Student.studentDetail.guradian_phone} onChange={this.onPersonalDetailChange.bind(this, 'guradian_phone')} placeholder="Gurdian Phone" />
              {this.state.isGardianPhone ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Guradian Phone Number </label> : <br />}
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="c-card__form">
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group static-fld">
                  <label>Name</label>
                  <span className="info-type">{this.state.Student ? this.state.Student.studentDetail.firstname != "" && this.state.Student.studentDetail.lastname != "" ? this.state.Student.studentDetail.firstname + " " + this.state.Student.studentDetail.lastname : "Not Added Yet" : "Not Added Yet"}</span>
                </div>
                <div className="form-group static-fld">
                  <label>Phone</label>
                  <span className="info-type">{this.state.Student ? this.state.Student.studentDetail.mobile != "" ? this.state.Student.studentDetail.mobile : "Not Added Yet" : "Not Added Yet"}</span>
                </div>
              </div>
              <div className="divider-block text--left">
                <div className="c-user-pic">
                  <div className="user--img"><img src={this.state.Student.profilePicture ? this.state.Student.profilePicture : "/images/avatars/Avatar_default.jpg"} alt="Avatar" /></div>
                </div>
              </div>
            </div>
            <div className="form-group static-fld">
              <label>Email</label>
              <span className="info-type">{this.state.Student ? this.state.Student.studentDetail.email != "" ? this.state.Student.studentDetail.email : "Not Added Yet" : "Not Added Yet"}</span>
            </div>
            <div className="form-group static-fld">
              <label>College</label>
              <span className="info-type st-disabled">{this.state.Student ? (this.state.Student.studentDetail.college != null) && (this.state.Student.studentDetail.college != "") ? this.state.Student.studentDetail.college : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>Date of Birth</label>
              <span className="info-type st-disabled">{this.state.Student ? (this.state.Student.studentDetail.DOB != null) && (this.state.Student.studentDetail.DOB != "") ? moment(this.state.Student.studentDetail.DOB).format("MM-DD-YYYY") : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>Guardian Name</label>
              <span className="info-type st-disabled">{this.state.Student ? (this.state.Student.studentDetail.guradian_name != null) && (this.state.Student.studentDetail.guradian_name != "") ? this.state.Student.studentDetail.guradian_name : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
            <div className="form-group static-fld">
              <label>Guardian Phone</label>
              <span className="info-type st-disabled">{this.state.Student ? (this.state.Student.studentDetail.guradian_phone != null) && (this.state.Student.studentDetail.guradian_phone != "") ? this.state.Student.studentDetail.guradian_phone : "Not Added Yet." : "Not Added Yet."}</span>
            </div>
          </div>
          <div className="c-card__btnCont">
            {/* <button className="c-btn primary btn-custom" onClick={this.OnChangeEditable.bind(this)} style={{ width: "100%", height: "40px" }}>Edit Personal Details</button> */}
          </div>
        </div>
      )
    }
  }

  renderBatchDetailCard() {
    if (this.state.Student.batchDetails && this.state.Student.batchDetails.length == 0) {
      return (
        <div style={{ height: "380px" }}>
          <div className="c-card__img">
            <img src="/images/card-img-3.png" alt="logo" />
          </div>
          <div className="c-card__info">No batches added yet.</div>
        </div>
      )
    } else {
      return (
        <div className="c-card__items" >
          <Scrollbars >
            {this.renderBatch()}
          </Scrollbars >
        </div>
      )
    }
  }



  render() {
    let { studentPaymentList, paymentDetailsList, unPaidInstallments } = this.state;


    return (
      <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a className="linkbtn hover-pointer" onClick={this.backButton.bind(this)} >Back to Student Directory</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Student Details</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.backButton.bind(this)}>Back</button>
              <button className="c-btn prime" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "deletestudent", 0, 0, 0)}>Delete</button>
              <button className="c-btn btn prime" style={{ color: "#FFFFFF" }} onClick={this.viewReport.bind(this)}>View Student Report</button>
              {/* {(this.state.Student && this.state.Student.batchDetails.length == 0) ? <button className="c-btn btn prime" style={{ color: "#FFFFFF" }} onClick={this.viewReport.bind(this)} disabled >View Student Report</button> : <button className="c-btn btn prime" style={{ color: "#FFFFFF" }} onClick={this.viewReport.bind(this)}>View Student Report</button>} */}
            </div>
          </div>
        </div>

        <div className="c-container__data">

          <div className="card-container">

            <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  PERSONAL DETAILS
                </span>
              </div>
              {this.renderPersonDetailCard()}

            </div>

            <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  Batches
                <span className="c-count filled">{this.state.Student && this.state.Student.batchDetails.length ? this.state.Student.batchDetails.length : 0}</span>
                </span>
              </div>
              {this.renderBatchDetailCard()}

              <div className="c-card__btnCont">
                <button className="c-btn-large primary" data-toggle="modal" data-target="#addBatch">+ Add Batches</button>
              </div>
              <AddStudentBatchModel onAddStudentBatch={(data) => { this.onStudentBatchAdd(data) }} {...this.props} />
            </div>

            <div className="c-card" >
              <div className="c-card__title">
                <div className="clearfix margin25-bottom">
                  <div className="form-group cust-fld">
                    <label>Finance</label>
                    <div className="dropdown">
                      <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                        {this.state.finance_name}
                      </button>
                      <ul style={{ height: "100px", overflow: "auto", marginTop: "-1px" }} className="dropdown-menu" aria-labelledby="dLabel">
                        {this.renderFinanceList()}
                      </ul>

                    </div>
                  </div>
                </div>
                {/* <span className="c-heading-sm card--title">
                  Activity
                </span> */}
              </div>
              <div className="clearfix" style={{ marginTop: "-20px" }}>
                <div className="c-card__title">

                  <span className="c-heading-sm card--title">
                    FEES
									</span>
                </div>

                <div className="c-card__form c-card__items" style={{ height: "214px", overflow: "auto" }}>
                  {this.renderFinanceInfo()}
                  {this.state.paymentDetailsList && this.state.paymentDetailsList.length > 0 ?
                    <div className="clearfix">
                      <div className="form-group static-fld">
                        <label>Previous Payments</label>
                        <div className="c-paymentsHist">

                          <ul style={{ overflow: "auto", height: "200px" }}>

                            {this.renderStudnetPaymentList()}

                          </ul>

                        </div>
                      </div>
                    </div> : ""}

                  {this.state.unPaidInstallments && this.state.unPaidInstallments.length > 0 ?
                    <div className="clearfix">
                      <div className="form-group static-fld">
                        <label>Unpaid Payments</label>
                        <div className="c-paymentsHist">

                          <ul style={{ overflow: "auto", height: "200px" }}>
                            {this.renderStudnetUnpaidList()}

                          </ul>

                        </div>
                      </div>
                    </div> : ""}

                  {(!this.state.isSavepayentClick) && this.state.installmentInfo && this.state.installmentInfo.length > 0 ?
                    <div>
                      <div className="clearfix">
                        <div className="form-group static-fld">
                          {/* <label>Unpaid Payments</label> */}
                          <div className="c-paymentsHist">
                            <ul>
                              {this.renderTableRow()}

                            </ul>
                          </div>
                        </div>
                      </div>


                      <button className="c-btn prime" onClick={this.onSavePayment.bind(this)}>Save changes</button>
                    </div> : ""}

                </div>
              </div>

              <div className="c-card__btnCont">

                {unPaidInstallments && unPaidInstallments.length > 0 ? <button className="c-btn-large primary" onClick={this.getData.bind(this, unPaidInstallments[0])} data-toggle="modal" data-target="#addPayment">+ Add Payments</button> : ""}
              </div>
            </div>
          </div>
        </div>

        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
        <AddPayment getdata={this.state.addedData} unpaidArray={this.state.unPaidInstallments} onaddPayment={(data) => { this.onStudentPaymentAdd(data) }} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  studentDetail: app.studentDetail,
  classes: app.classes,
  subjects: app.subjects,
  batches: app.batches,
  studentBatch: app.studentBatch,
  updateStudentDetail: app.updateStudentDetail,
  deleteStudBatch: app.deleteStudBatch,
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  studentPaymentScheduleAdd: app.studentPaymentScheduleAdd,
  studentPaymentDetailAdd: app.studentPaymentDetailAdd,
  studentPaymentDetailUpdate: app.studentPaymentDetailUpdate,
  studentPaymentDetailDelete: app.studentPaymentDetailDelete,
  studentPaymentAdd: app.studentPaymentAdd,
  studentPaymentList: app.studentPaymentList,
  financeList: app.financeList,
  getFinanceeditData: app.getFinanceeditData,
  studentProfessorDelete: app.studentProfessorDelete,
  ProfessorAdmin: app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getClasses,
      getSubjects,
      getStudentDetail,
      getBatches,
      addStudentBatches,
      updateStudentDetails,
      deleteStudentBatch,
      createStudentPaymentSchedule,
      createStudentPaymentDetail,
      updateStudentPaymentDetail,
      createStudentPaymentList,
      createStudentPayment,
      deleteStudentPaymentDetail,
      getFinancelist,
      getEditFinanceData,
      deleteStudentProfessor,
      getIsProfessorAdmin
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail)