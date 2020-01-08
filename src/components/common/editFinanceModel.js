import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import $ from "jquery";
import { ToastContainer } from 'react-toastify';
import { successToste, errorToste } from '../../constant/util';
import { DeleteModal } from '../common/deleteModal';
export class EditFinanceModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateInfo: {},
      installmentInfo: [],
      adhocInfo: [],
      dropDownValue: 0,
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      selectValue: 0,
      adhocSelected: 1,
      installmentDatesArray: [],
      adhocArray: [],
      adhocCounter: 1,
      isNameVisible: false,
      isJoinDateVisible: false,
      isTotalamountVisible: false,
      isAdvanceAmountValid: false,
      isFeeTypeSelected: false,
      payment_date: moment(),
      deleteObj: null,
      isInstallmentTotalPaid: false,
      isAdhocTotalPaid: false,
      isAdhocTotalExceeds: false,
      radioInstallment: false,
      radioAdhoc: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ templateInfo: nextProps.templateInfo })

    if (nextProps && nextProps.templateInfo.fee_type == "INSTALLMENT") {
      this.setState({
        installmentDatesArray: nextProps.installmentInfo,
        dropDownValue: nextProps.templateInfo.number_of_installments,
        radioInstallment: true
      })
    } else if (nextProps && nextProps.templateInfo.fee_type == "ADHOC") {
      this.setState({ adhocArray: nextProps.installmentInfo, adhocSelected: 0, radioAdhoc: true })
    }
  }

  onChangeJoinDate(date) {
    let { templateInfo } = this.state;
    templateInfo = { ...templateInfo, join_date: date };
    this.setState({ templateInfo, payment_date: date });
  }

  onChangeInput(property, event) {
    let { templateInfo } = this.state;
    // let name = templateInfo.name;
    templateInfo = { ...templateInfo, [property]: event.target.value };
    this.setState({ templateInfo });
  }

  renderNumber(value, event) {
    let { templateInfo, installmentDatesArray } = this.state;
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.templateInfo.advance_amount
    }

    if (templateInfo.advance_amount > 0 && installmentDatesArray.length == 0) {
      installmentDatesArray.push(instObj1);
    }
    else if (this.state.templateInfo.total_amount > 0 && installmentDatesArray.length == 0) {
      let instObj2 = {
        "payment_date": moment(),
        "amount": this.state.templateInfo.total_amount
      }

      installmentDatesArray.push(instObj2)
    }
    templateInfo = { ...templateInfo, fee_type: value }
    this.setState({ templateInfo, dropDownValue: 1, adhocSelected: 1, selectValue: 1, radioInstallment: true, radioAdhoc: false })
  }

  onChangeNumber(number) {
    let { templateInfo } = this.state;
    if (!this.validate()) {
      return false;
    }
    let remainingvalue = (templateInfo.total_amount - templateInfo.advance_amount) / number;

    let installmentDatesArray = [];
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.templateInfo.advance_amount
    }
    let instObj2 = {
      "payment_date": moment(),
      "amount": this.state.templateInfo.total_amount
    }
    if (this.state.templateInfo.advance_amount > 0) {
      installmentDatesArray.push(instObj1)
    }
    else if (this.state.templateInfo.total_amount > 0) {
      if (number > 0) {
        remainingvalue = templateInfo.total_amount / number;
      }
      else {
        installmentDatesArray.push(instObj2)
        remainingvalue = 0;
      }
    }

    var diff = templateInfo.total_amount - templateInfo.advance_amount;


    if (diff < number && diff > 0) {
      let instObj3 = {
        "payment_date": moment(),
        "amount": diff
      }

      installmentDatesArray.push(instObj3);
      number = 1;
    }
    else if (remainingvalue == 0) {
      number = 0;
    } else {

      for (let i = 1; i <= number; i++) {
        let instObj = {
          "payment_date": moment().add(i, "M"),
          "amount": Math.floor(remainingvalue)
        }
        installmentDatesArray.push(instObj);

      }
    }
    this.setState({ installmentDatesArray, selectValue: parseInt(number), isInstallmentTotalPaid: false })
  }

  renderAdhocStructure(value, event) {
    let { adhocArray, templateInfo } = this.state;

    if (adhocArray.length == 0) {
      let adhocObj = {
        date: moment(),
        amount: templateInfo.advance_amount
      }

      let adhocObj1 = {
        date: moment(),
        amount: templateInfo.total_amount
      }

      if (templateInfo.advance_amount > 0) {
        adhocArray.push(adhocObj)
      } else if (templateInfo.total_amount > 0) {
        adhocArray.push(adhocObj1)
      }
    }

    templateInfo = { ...templateInfo, fee_type: value }
    this.setState({ templateInfo, adhocSelected: 0, dropDownValue: 0, adhocArray, radioInstallment: false, radioAdhoc: true })
  }

  onAddAdhocStructure() {
    let { templateInfo, adhocArray, adhocCounter } = this.state;
    adhocCounter = adhocCounter + 1;

    let remainingvalue = (templateInfo.total_amount - templateInfo.advance_amount) / adhocCounter;
    adhocArray = [];
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.templateInfo.advance_amount
    }
    let instObj2 = {
      "payment_date": moment(),
      "amount": this.state.templateInfo.total_amount
    }
    if (this.state.templateInfo.advance_amount > 0) {
      adhocArray.push(instObj1);
    }
    else if (this.state.templateInfo.total_amount > 0) {
      if (adhocCounter > 0) {
        remainingvalue = templateInfo.total_amount / adhocCounter;

      }
      else {
        adhocArray.push(instObj2)
        remainingvalue = 0;
      }
    }


    for (let i = 1; i <= adhocCounter; i++) {
      let instObj = {
        "payment_date": moment().add(i, "M"),
        "amount": Math.floor(remainingvalue)
      }
      adhocArray.push(instObj)
    }
    this.setState({ adhocArray, adhocCounter, isAdhocTotalPaid: false, isAdhocTotalExceeds: false })
  }

  deleteAdhocStructure(index) {
    let remainingvalue = 0
    let { templateInfo, adhocArray, adhocCounter } = this.state;
    adhocCounter = adhocCounter - 1;

    if (adhocCounter > 0) {
      remainingvalue = (templateInfo.total_amount - templateInfo.advance_amount) / adhocCounter;
    }

    adhocArray = []
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.templateInfo.advance_amount
    }
    adhocArray.push(instObj1)

    for (let i = 0; i < adhocCounter; i++) {
      let instObj = {
        "payment_date": moment().add(index, "M"),
        "amount": Math.floor(remainingvalue)
      }
      adhocArray.push(instObj)
    }
    this.setState({ adhocArray, adhocCounter });

  }

  validate() {

    let isValidForm = true;
    let { templateInfo } = this.state;
    if (!templateInfo.name) {
      this.setState({ isNameVisible: true });
      isValidForm = false;
    }
    if (!templateInfo.join_date) {
      this.setState({ isJoinDateVisible: true });
      isValidForm = false;
    }
    if (!templateInfo.total_amount || templateInfo.total_amount == 0) {
      this.setState({ isTotalamountVisible: true });
      isValidForm = false;
    }
    if (Number(templateInfo.advance_amount) > Number(templateInfo.total_amount)) {
      this.setState({ isAdvanceAmountValid: true });
      isValidForm = false;
    }
    if (!templateInfo.fee_type) {
      this.setState({ isFeeTypeSelected: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  onInputChange(property, event) {
    let { installmentDatesArray, adhocArray, templateInfo } = this.state;
    if (property == "name") {
      this.setState({ isNameVisible: false })
    }
    if (property == "total_amount") {
      installmentDatesArray = [];
      adhocArray = [];
      templateInfo = { ...templateInfo, advance_amount: 0, number_of_installments: 0 }
      this.setState({ isTotalamountVisible: false, selectValue: 0 });

      if (templateInfo.advance_amount == 0) {
        let instObj2 = {
          "payment_date": moment(),
          "amount": event.target.value
        }

        installmentDatesArray.push(instObj2);
        adhocArray.push(instObj2);
      }
    }
    if (property == "advance_amount") {
      let instObj1 = {
        "payment_date": moment(),
        "amount": event.target.value
      }
      installmentDatesArray = []
      adhocArray = [];
      if (event.target.value > 0) {

        installmentDatesArray.push(instObj1);
        adhocArray.push(instObj1);
      }

      else if (templateInfo.total_amount > 0) {

        let instObj2 = {
          "payment_date": moment(),
          "amount": templateInfo.total_amount
        }

        installmentDatesArray.push(instObj2);
        adhocArray.push(instObj2);
      }

      templateInfo = { ...templateInfo, number_of_installments: 0 }
      this.setState({ isAdvanceAmountValid: false, selectValue: 0 })
    }

    templateInfo = { ...templateInfo, [property]: event.target.value };
    this.setState({ templateInfo, adhocArray, installmentDatesArray }
    );
  }

  changeAdhocPayment(property, index, event) {
    let { adhocArray } = this.state;
    adhocArray[index] = { ...adhocArray[index], [property]: event.target.value };
    this.setState({ adhocArray });
  }

  editFinance() {
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      let { templateInfo, installmentDatesArray, adhocArray } = this.state;

      if (templateInfo.fee_type == 'INSTALLMENT') {
        if (this.state.radioInstallment) {
          adhocArray = [];
        }
        else if (this.state.radioAdhoc) {
          installmentDatesArray = [];
        } else {
          this.setState({ isFeeTypeSelected: true })
        }
        adhocArray = []
        if (installmentDatesArray.length > 0) {
          let totalInstallmentAmount = 0;

          for (let i = 0; i < installmentDatesArray.length; i++) {
            totalInstallmentAmount = totalInstallmentAmount + Number(installmentDatesArray[i].amount)
          }

          if (this.state.radioInstallment) {
            if (templateInfo.total_amount != totalInstallmentAmount) {
              this.setState({ isInstallmentTotalPaid: true });
              return;
            }
          }

        }

      } else if (templateInfo.fee_type == 'ADHOC') {
        installmentDatesArray = [];
        if (adhocArray.length > 0) {
          let totalAdhocAmount = 0;

          for (let i = 0; i < adhocArray.length; i++) {
            totalAdhocAmount = totalAdhocAmount + Number(adhocArray[i].amount)
          }

          if (this.state.radioAdhoc) {
            if (templateInfo.total_amount != totalAdhocAmount) {
              this.setState({ isAdhocTotalPaid: true });
              return;
            } else if (templateInfo.total_amount < totalAdhocAmount) {
              this.setState({ isAdhocTotalExceeds: true });
              return;
            }
          }
        }
      }
      let data = {
        payload: {
          "installmentDates": (installmentDatesArray.length > 0) ? installmentDatesArray : adhocArray,
          "name": templateInfo.name,
          "total_amount": templateInfo.total_amount,
          "join_date": templateInfo.join_date,
          "advance_amount": templateInfo.advance_amount,
          "fee_type": templateInfo.fee_type,
          "number_of_installments": (installmentDatesArray.length > 0) ? installmentDatesArray.length : adhocArray.length,
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        finance_template_id: templateInfo.finance_template_id
      }

      this.props.updateFinance(data).then(() => {
        let res = this.props.financeUpdate;

        if (res && res.status == 200) {
          successToste("Finance Template Updated Successfully");
        }
        else if (res && res.status == 500) {
          errorToste(res.message)
        }
      })

    }
    this.setState({
      templateInfo: {},
      installmentInfo: [],
      adhocInfo: [],
      dropDownValue: 0,
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      selectValue: 0,
      adhocSelected: 1,
      installmentDatesArray: [],
      adhocArray: [],
      adhocCounter: 1,
      isNameVisible: false,
      isJoinDateVisible: false,
      isTotalamountVisible: false,
      isAdvanceAmountValid: false,
      isFeeTypeSelected: false,
      payment_date: moment(),
      deleteObj: null,
      isInstallmentTotalPaid: false,
      isAdhocTotalPaid: false,
      isAdhocTotalExceeds: false,
      radioInstallment: false,
      radioAdhoc: false,
    }, () => {
      $("#editfeestructuremodel .close").click();
    })

  }

  dataclearonCancel() {
    this.setState({
      templateInfo: {},
      installmentInfo: [],
      adhocInfo: [],
      dropDownValue: 0,
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      selectValue: 0,
      adhocSelected: 1,
      installmentDatesArray: [],
      adhocArray: [],
      adhocCounter: 1,
      isNameVisible: false,
      isJoinDateVisible: false,
      isTotalamountVisible: false,
      isAdvanceAmountValid: false,
      isFeeTypeSelected: false,
      payment_date: moment(),
      deleteObj: null,
      isInstallmentTotalPaid: false,
      isAdhocTotalPaid: false,
      isAdhocTotalExceeds: false,
      radioInstallment: false,
      radioAdhoc: false,
    })
  }

  onDeleteEntry(flag) {
    if (flag == 'finance') {
      this.deleteFinance();
      $("#quizSubmit .close").click();
    }
  }

  onDeleteModel(key) {
    this.setState({ deleteObj: key });
  }

  deleteFinance() {
    let { templateInfo } = this.state;
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      finance_template_id: templateInfo.finance_template_id
    }
    this.props.deleteFinance(data).then(() => {
      let res = this.props.financeDelete;
      if (res && res.status == 200) {
        successToste("Finance Template Deleted Successfully");
      }
    })
    $("#editfeestructuremodel .close").click();
  }

  onChangePaymentdate(index, date) {
    let { adhocArray } = this.state;
    let showError = false;
    if (moment(date).isBefore(this.state.templateInfo.join_date)) {
      showError = true;
    }
    if (showError) {
      errorToste("Date Should Not be Greater Than Start Date")
    } else {
      adhocArray[index] = { ...adhocArray[index], payment_date: date }
      this.setState({ payment_date: date, adhocArray });
    }
  }


  renderDropdownValue() {
    if (this.state.numbers && this.state.numbers.length > 0) {
      return this.state.numbers.map((number, index) => {
        return (
          <li key={"number" + index}>
            <a onClick={this.onChangeNumber.bind(this, number)} className="dd-option">{number} </a>
          </li>
        )
      })
    }
  }

  renderTableRow() {
    let { installmentDatesArray } = this.state;
    if (installmentDatesArray && installmentDatesArray.length > 0) {
      return (
        <tbody>
          {
            installmentDatesArray.map((rows, index) => {

              return (
                <tr key={"rows" + index}>
                  <td style={{ width: "11%" }}>< DatePicker style={{ width: "200%" }} onChange={this.onChangePaymentdate.bind(this, index)} className="form-control fld--date" selected={moment(rows.payment_date)} /> </td>
                  <td style={{ width: "21%" }}><input min="1" value={rows.amount} style={{ width: "100%" }} type="number" className="form-control" placeholder="Amount" /> </td>
                </tr>)
            })
          }
        </tbody>
      )
    }
  }

  renderAdhocRows() {
    let { adhocArray } = this.state;
    let len = adhocArray.length - 1;
    if (adhocArray && adhocArray.length > 0) {
      return adhocArray.map((rows, index) => {
        let date = moment(rows.payment_date);
        return (
          <div key={"adhocObj" + index} className="row" style={{ height: '80px' }}>
            <div className="col-md-5 divider-block text--left">
              <div className="form-group cust-fld">
                <label>Date</label>
                < DatePicker className="form-control fld--date" onChange={this.onChangePaymentdate.bind(this, index)} selected={date} />
              </div>
            </div>
            <div className="col-md-5 divider-block text--left">
              <div className="form-group cust-fld">
                <label>Amount</label>
                <input type="number" min="1" value={rows.amount} onChange={this.changeAdhocPayment.bind(this, "amount", index)} className="form-control" placeholder="Amount" />
              </div>
            </div>
            <div className="col-md-2">
              {(len === index) ?
                <div className="col-md-1" onClick={this.onAddAdhocStructure.bind(this)}><img src="/images/plus.png" alt="logo" style={{ height: "20px", width: "20px" }} />
                </div>
                : <div className="col-md-1" ></div>}
              <div className="col-md-1" style={{ marginTop: "50%", marginLeft: "-50%" }} onClick={this.deleteAdhocStructure.bind(this, index)}><img src="/images/delete.png" alt="logo" style={{ height: "20px", marginLeft: "2px", width: "20px" }} /></div>
            </div>
          </div>
        )
      })
    }
  }


  render() {
    let { templateInfo } = this.state;
    return (
      <div className="modal fade custom-modal-sm width--lg" id="editfeestructuremodel" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <ToastContainer />
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.dataclearonCancel.bind(this)}><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">NEW FINANCE</h4>
            </div>
            <div className="modal-body">

              <div className="row">

                <div className="col-md-6 com-sm-12" style={{ width: "80%", marginLeft: "3%" }}>
                  <div className="form-group cust-fld">
                    <label>Name<sup>*</sup></label>

                    <input type="text" className="form-control" value={templateInfo ? templateInfo.name : ""} onChange={this.onInputChange.bind(this, "name")} placeholder="Name" />
                    {this.state.isNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Finance Structure Name</label> : <br />}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Start Date<sup>*</sup></label>
                    <br />
                    < DatePicker className="form-control"
                      selected={templateInfo && templateInfo.join_date ? moment(templateInfo.join_date) : moment()}
                      onChange={this.onChangeJoinDate.bind(this)}
                    />
                    {/* {this.state.isJoinDateVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Date</label> : <br />} */}
                  </div>


                  <div className="form-group cust-fld">
                    <label>Total <sup>*</sup></label>
                    <input type="Number" className="form-control" value={templateInfo ? templateInfo.total_amount : ""} onChange={this.onInputChange.bind(this, "total_amount")} placeholder="Total" />
                    {this.state.isTotalamountVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Total Amount  </label> : <br />}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Advance <sup>*</sup></label>
                    <input type="Number" min="1" className="form-control" value={templateInfo ? templateInfo.advance_amount : ""} onChange={this.onInputChange.bind(this, "advance_amount")} placeholder="Advance" />
                    {this.state.isAdvanceAmountValid ? <label className="help-block" style={{ color: "red" }}>Advance Amount Can Not Be Greater Than Total Amount</label> : <br />}

                  </div>

                  <div className="form-group cust-fld">
                    <label>Fee Type <sup>*</sup></label>

                    <div className="row" >
                      <div className="col-md-6 com-sm-12"  >
                        <input style={{ height: "1.5em", width: "10%", border: "0px" }} type='radio' onClick={this.renderNumber.bind(this, "INSTALLMENT")} id='react-radio-button-group-1' name='number' value='installment' checked={this.state.radioInstallment} />
                        <label style={{ marginLeft: "30px", marginTop: "-25px" }} htmlFor='[unique-id]'>Installment</label>
                      </div>

                      <div className="col-md-6 com-sm-12">
                        <input style={{ height: "1.5em", width: "10%", border: "0px" }} type='radio' onClick={this.renderAdhocStructure.bind(this, "ADHOC")} id='react-radio-button-group-1' name='number' value='adhoc' checked={this.state.radioAdhoc} />
                        <label style={{ marginLeft: "30px", marginTop: "-25px" }} htmlFor='[unique-id]'>Adhoc</label>
                      </div>
                    </div>


                    {(this.state.adhocSelected == 0) ? <div className="c-container__data">
                      <div className="card-container" >
                        <div className="c-card">
                          {this.renderAdhocRows()}
                        </div>
                      </div>
                      {this.state.isAdhocTotalPaid ? <label className="help-block" style={{ color: "red" }}>Your fees are pending.Please pay Remaining fee. </label> :
                        this.state.isAdhocTotalExceeds ? <label className="help-block" style={{ color: "red" }}>Your fees are exceeding total amount to be paid. </label> : <br />}
                    </div> : ""}

                    <div>
                      {(this.state.dropDownValue && this.state.dropDownValue != 0) ? <div className="form-group cust-fld">

                        <div className="dropdown">
                          <button id="dLabel" style={{ marginTop: "10px" }} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                            {this.state.selectValue ? this.state.selectValue : this.state.templateInfo.number_of_installments}
                          </button>
                          <ul style={{ height: "100px", overflow: "auto", marginTop: "-1px" }} className="dropdown-menu" aria-labelledby="dLabel">
                            {this.renderDropdownValue()}
                          </ul>
                        </div>
                      </div> : ""}
                      {this.state.isInstallmentTotalPaid ? <label className="help-block" style={{ color: "red" }}>Your fees are pending.Please pay Remaining fee. </label> : <br />}
                    </div>

                    {(this.state.dropDownValue && this.state.dropDownValue != 0) ? <div>
                      <div className="card-container for--table">
                        <div className="c-table">
                          <table id="studentList" style={{ width: "100%" }} className="table table-bordered">
                            <thead>
                              <tr>
                                <th style={{ width: "50%" }}>Date</th>
                                <th style={{ width: "50%" }}>Amount</th>
                              </tr>
                            </thead>

                            {this.renderTableRow()}

                          </table>
                        </div>
                      </div>
                    </div> : ""}
                  </div>
                  {this.state.isFeeTypeSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Fee Type</label> : <br />}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal" onClick={this.dataclearonCancel.bind(this)}>Cancel</button>
                <button className="c-btn primary" onClick={this.editFinance.bind(this)} >Save</button>
                <button className="c-btn primary" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "finance")}  >Delete</button>
              </div>
            </div>
          </div>
        </div>
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }} onClassDelete={(data) => { this.onClassDelete(data) }}   {...this.props} />
      </div>
    )
  }

}

export default (EditFinanceModel)