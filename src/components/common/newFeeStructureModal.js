import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { addFinance } from '../../actions/index';
import { ToastContainer, toast } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import $ from "jquery";
import moment from 'moment';

export class NewFeeStructureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownValue: 0,
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      selectValue: 0,
      adhocSelected: 1,
      adhocObj: {},
      installmentDatesArray: [],
      finance: {
        name: "",
        total_amount: '',
        join_date: moment(),
        advance_amount: 0,
        fee_type: "",
        number_of_installments: '',
      },
      adhocArray: [],
      adhocCounter: 0,
      payment_date: moment(),
      adhocAmount: 0,
      isNameVisible: false,
      isJoinDateVisible: false,
      isTotalamountVisible: false,
      isAdvanceAmountValid: false,
      isFeeTypeSelected: false,
      isInstallmentTotalPaid: false,
      isAdhocTotalPaid: false,
      isAdhocTotalExceeds: false,
      radioInstallment: false,
      radioAdhoc: false,
    }

  }

  renderNumber(value, event) {

    let { finance, installmentDatesArray } = this.state;
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.finance.advance_amount
    }
    if (finance.advance_amount > 0 && installmentDatesArray.length == 0) {
      installmentDatesArray.push(instObj1);
    }
    else if (this.state.finance.total_amount > 0 && installmentDatesArray.length == 0) {
      let instObj2 = {
        "payment_date": moment(),
        "amount": this.state.finance.total_amount
      }

      installmentDatesArray.push(instObj2)
    }


    finance = { ...finance, fee_type: value }
    this.setState({ finance, installmentDatesArray, dropDownValue: 1, adhocSelected: 1, isFeeTypeSelected: false, radioInstallment: true, radioAdhoc: false })
  }

  renderAdhocStructure(value, event) {


    let { adhocArray, finance, installmentDatesArray } = this.state;

    installmentDatesArray = []



    finance = { ...finance, fee_type: value }
    this.setState({ finance, adhocSelected: 0, dropDownValue: 0, adhocArray, isFeeTypeSelected: false, installmentDatesArray, radioInstallment: false, radioAdhoc: true })
  }

  onChangeNumber(number) {
    let { finance } = this.state;
    if (!this.validate()) {
      return false;
    }
    let remainingvalue = (finance.total_amount - finance.advance_amount) / number;
    let installmentDatesArray = [];
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.finance.advance_amount
    }
    let instObj2 = {
      "payment_date": moment(),
      "amount": this.state.finance.total_amount
    }
    if (this.state.finance.advance_amount > 0) {
      installmentDatesArray.push(instObj1)
    }
    else if (this.state.finance.total_amount > 0) {
      if (number > 0) {
        remainingvalue = finance.total_amount / number
      }
      else {
        installmentDatesArray.push(instObj2)
        remainingvalue = 0;
      }
    }

    var diff = finance.total_amount - finance.advance_amount;

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

  onAddAdhocStructure() {
    let { finance, adhocArray, adhocCounter } = this.state;

    adhocCounter = adhocCounter + 1;

    let remainingvalue = (finance.total_amount - finance.advance_amount) / adhocCounter;
    adhocArray = []
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.finance.advance_amount
    }
    let instObj2 = {
      "payment_date": moment(),
      "amount": this.state.finance.total_amount
    }

    if (this.state.finance.advance_amount > 0) {
      adhocArray.push(instObj1);
    }
    else if (this.state.finance.total_amount > 0) {
      if (adhocCounter > 0) {
        remainingvalue = finance.total_amount / adhocCounter

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
    let { finance, adhocArray, adhocCounter } = this.state;

    adhocCounter = adhocCounter - 1;

    if (adhocCounter > 0) {
      remainingvalue = (finance.total_amount - finance.advance_amount) / adhocCounter;
    }

    adhocArray = []
    let instObj1 = {
      "payment_date": moment(),
      "amount": this.state.finance.advance_amount
    }
    adhocArray.push(instObj1)

    for (let i = 0; i < adhocCounter; i++) {
      let instObj = {
        "payment_date": moment().add(index, "M"),
        "amount": Math.floor(remainingvalue)
      }
      adhocArray.push(instObj)
    }

    this.setState({ adhocArray, adhocCounter })
  }

  validate() {


    let isValidForm = true;
    let { finance } = this.state;
    if (!finance.name) {
      this.setState({ isNameVisible: true });
      isValidForm = false;
    }
    if (!finance.join_date) {
      this.setState({ isJoinDateVisible: true });
      isValidForm = false;
    }
    if (!finance.total_amount || finance.total_amount == 0) {
      this.setState({ isTotalamountVisible: true });
      isValidForm = false;
    }
    if (Number(finance.advance_amount) > Number(finance.total_amount)) {
      this.setState({ isAdvanceAmountValid: true });
      isValidForm = false;
    }
    if (!finance.fee_type) {
      this.setState({ isFeeTypeSelected: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  createFinance() {

    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      let i, length = this.state.selectValue;

      let { installmentDatesArray, adhocArray, finance } = this.state;


      if (this.state.radioInstallment) {
        adhocArray = [];
      }
      else if (this.state.radioAdhoc) {
        installmentDatesArray = [];
      } else {
        this.setState({ isFeeTypeSelected: true })
      }
      if (installmentDatesArray.length > 0) {
        let totalInstallmentAmount = 0;

        for (let i = 0; i < installmentDatesArray.length; i++) {
          totalInstallmentAmount = totalInstallmentAmount + Number(installmentDatesArray[i].amount)
        }


        if (this.state.radioInstallment) {
          if (finance.total_amount != totalInstallmentAmount) {
            this.setState({ isInstallmentTotalPaid: true });
            return;
          }
        }

        //  else {
        //   this.setState({ isTotalamountVisible: false });
        // }

      }
      else if (adhocArray.length > 0) { //adhoc case
        let totalAdhocAmount = 0;

        for (let i = 0; i < adhocArray.length; i++) {
          totalAdhocAmount = totalAdhocAmount + Number(adhocArray[i].amount)
        }


        if (this.state.radioAdhoc) {

          if (finance.total_amount > totalAdhocAmount) {

            this.setState({ isAdhocTotalPaid: true });
            return;
          } else if (finance.total_amount < totalAdhocAmount) {

            this.setState({ isAdhocTotalExceeds: true });
            return;
          }
        }
        // else {
        //   this.setState({ isTotalamountVisible: false });
        // }
      } else { // error
        this.setState({ isTotalamountVisible: true });
        return;
      }

      let data = {
        payload: {
          "installmentDates": (installmentDatesArray.length > 0) ? installmentDatesArray : adhocArray,
          "name": this.state.finance.name,
          "total_amount": this.state.finance.total_amount,
          "join_date": this.state.finance.join_date,
          "advance_amount": this.state.finance.advance_amount,
          "fee_type": this.state.finance.fee_type,
          "number_of_installments": (installmentDatesArray.length > 0) ? installmentDatesArray.length : adhocArray.length,
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token
      }

      this.clearData(() => {

        this.props.addFinance(data).then(() => {
          let res = this.props.financeAdd;
          
          if (res && res.status == 200) {
            successToste("Finance Template Created Successfully");
            this.props.history.push('/app/administration-finance')
          }
          else if (res && res.status == 500) {
            errorToste(res.message)
          }
        })
      });

    }
    this.setState({
      dropDownValue: 0,
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      selectValue: 0,
      adhocSelected: 1,
      adhocObj: {},
      installmentDatesArray: [],
      finance: {
        name: "",
        total_amount: '',
        join_date: moment(),
        advance_amount: 0,
        fee_type: "",
        number_of_installments: '',
      },
      adhocArray: [],
      adhocCounter: 0,
      payment_date: moment(),
      adhocAmount: 0,
      isNameVisible: false,
      isJoinDateVisible: false,
      isTotalamountVisible: false,
      isAdvanceAmountValid: false,
      isFeeTypeSelected: false,
      isInstallmentTotalPaid: false,
      isAdhocTotalPaid: false,
      isAdhocTotalExceeds: false, radioAdhoc: false, radioInstallment: false
    }, () => {

      $("#feestructuremodel .close").click();
    })

  }

  clearData(cb) {

    let finance = {
      name: "",
      total_amount: '',
      join_date: moment(),
      advance_amount: 0,
      fee_type: "",
      number_of_installments: '',
    };
    this.setState({ finance, installmentDatesArray: [], adhocArray: [] }, () => {
      cb()
    })

  }

  dataclearonCancel() {
    this.setState({
      dropDownValue: 0,
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      selectValue: 0,
      adhocSelected: 1,
      adhocObj: {},
      installmentDatesArray: [],
      finance: {
        name: "",
        total_amount: '',
        join_date: moment(),
        advance_amount: 0,
        fee_type: "",
        number_of_installments: '',
      },
      adhocArray: [],
      adhocCounter: 0,
      payment_date: moment(),
      adhocAmount: 0,
      isNameVisible: false,
      isJoinDateVisible: false,
      isTotalamountVisible: false,
      isAdvanceAmountValid: false,
      isFeeTypeSelected: false,
      isInstallmentTotalPaid: false,
      isAdhocTotalPaid: false,
      isAdhocTotalExceeds: false,
      radioInstallment: false,
      radioAdhoc: false,
    }, () => {

    })
  }

  onInputChange(property, event) {
    let { finance, installmentDatesArray, adhocArray } = this.state;
    if (property == "name") {
      this.setState({ isNameVisible: false })
    }
    if (property == "total_amount") {
      installmentDatesArray = [];
      adhocArray = [];
      finance = { ...finance, advance_amount: 0 };
      this.setState({ isTotalamountVisible: false, selectValue: 0 })
      if (this.state.finance.advance_amount == 0) {
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
      else if (finance.total_amount > 0) {

        let instObj2 = {
          "payment_date": moment(),
          "amount": finance.total_amount
        }

        installmentDatesArray.push(instObj2);
        adhocArray.push(instObj2);
      }

      this.setState({ isAdvanceAmountValid: false, selectValue: 0 })


    }
    finance = { ...finance, [property]: event.target.value };
    this.setState({ finance, installmentDatesArray, adhocArray });
  }

  onChangeJoinDate(date) {
    let { finance, payment_date } = this.state;
    finance = { ...finance, join_date: date };
    this.setState({ finance, isJoinDateVisible: false, payment_date: date });
  }

  onChangePaymentdate(date) {
   
    let showError = false;
    if (moment(date).isBefore(this.state.join_date)) {
      showError = true;
    }
    if (showError) {
      errorToste("Date Should Not be Greater Than Start Date")
    } else {
      this.setState({ payment_date: date });
    }
  }

  changeAdhocPayment(property, index, event) {
    let { adhocArray } = this.state;
    adhocArray[index] = { ...adhocArray[index], [property]: event.target.value };
    this.setState({ adhocArray });
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
    let { installmentDatesArray, payment_date } = this.state;

    if (installmentDatesArray && installmentDatesArray.length > 0) {
      return (
        <tbody>
          {
            installmentDatesArray.map((rows, index) => {

              let date = moment(payment_date).add(index, "M")
              return (
                <tr key={"rows" + index}>
                  <td style={{ width: "11%" }}>< DatePicker style={{ width: "200%" }} className="form-control fld--date" onChange={this.onChangePaymentdate.bind(this)} selected={date} /> </td>
                  <td style={{ width: "21%" }}><input value={rows.amount} style={{ width: "100%" }} min="1"  type="number" className="form-control" placeholder="Amount" /> </td>
                </tr>)
            })
          }
        </tbody>
      )
    }
  }

  renderAdhocRows() {
    let { adhocArray, payment_date } = this.state;

    let len = adhocArray.length - 1;


    if (adhocArray && adhocArray.length > 0) {
      return adhocArray.map((rows, index) => {
        let date = moment(payment_date).add(index, "M")
        return (

          <div key={"adhocObj" + index} className="row" style={{ height: '80px' }}>
            <div className="col-md-5 divider-block text--left">
              <div className="form-group cust-fld">
                <label>Date</label>
                < DatePicker className="form-control" onChange={this.onChangePaymentdate.bind(this)} selected={date} />
              </div>
            </div>
            <div className="col-md-5 divider-block text--left">
              <div className="form-group cust-fld">
                <label>Amount</label>
                <input type="number" min="1"  value={rows.amount} onChange={this.changeAdhocPayment.bind(this, "amount", index)} className="form-control" placeholder="Amount" />
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
    return (
      <div className="modal fade custom-modal-sm width--lg in" id="feestructuremodel" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <ToastContainer />
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.dataclearonCancel.bind(this)}><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">NEW FINANCE</h4>
            </div>
            <div className="modal-body">

              <div className="row" style={{width:"1100px"}}>

                <div className="col-md-6 com-sm-12" style={{  marginLeft: "3%" }}>
                  <div className="form-group cust-fld">
                    <label>Finance Name<sup>*</sup></label>
                    <input type="text" className="form-control" value={this.state.finance.name} onChange={this.onInputChange.bind(this, "name")} placeholder="Name" />
                    {this.state.isNameVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Finance Structure Name</label> : <br />}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Start Date<sup>*</sup></label>
                    <br/>
                    < DatePicker className="form-control"
                      selected={this.state.finance && this.state.finance.join_date ? moment(this.state.finance.join_date) : moment()}
                      onChange={this.onChangeJoinDate.bind(this)} />
                    {/* {this.state.isJoinDateVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Date</label> : <br />} */}
                  </div>


                  <div className="form-group cust-fld">
                    <label>Total <sup>*</sup></label>
                    <input type="Number" min="1" value={this.state.finance.total_amount} onChange={this.onInputChange.bind(this, "total_amount")} className="form-control" placeholder="Total" />
                    {this.state.isTotalamountVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Total Amount  </label> : <br />}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Advance </label>
                    <input type="Number" min="1"  value={this.state.finance.advance_amount} onChange={this.onInputChange.bind(this, "advance_amount")} className="form-control" placeholder="Advance" />
                    {this.state.isAdvanceAmountValid ? <label className="help-block" style={{ color: "red" }}>Advance Amount Can Not Be Greater Than Total Amount</label> : <br />}

                  </div>

                  <div className="form-group cust-fld">
                    <label>Fee Type <sup>*</sup></label>

                    <div className="row" >
                      <div className="col-md-6 com-sm-12"  >
                        <input style={{ height: "1.5em", width: "10%", border: "0px" }} type='radio' onClick={this.renderNumber.bind(this, "INSTALLMENT")} id='react-radio-button-group-1' name='number' value='Installment' checked={this.state.radioInstallment} />
                        <label style={{ marginLeft: "30px", marginTop: "-25px" }} htmlFor='[unique-id]'>Installment</label>
                      </div>

                      <div className="col-md-6 com-sm-12">
                        <input style={{ height: "1.5em", width: "10%", border: "0px" }} type='radio' onClick={this.renderAdhocStructure.bind(this, "ADHOC")} id='react-radio-button-group-1' name='number' value='adhoc' checked={this.state.radioAdhoc} />
                        <label style={{ marginLeft: "30px", marginTop: "-25px" }} htmlFor='[unique-id]'>Adhoc</label>
                      </div>
                      {/* {this.state.isFeeTypeSelected ? <label className="help-block" style={{ color: "red" }}>Please Enter Advance Amount </label> : <br />} */}

                    </div>



                    {(this.state.adhocSelected == 0) ? <div className="c-container__data">
                      <div className="card-container" >
                        <div className="c-card">

                          {this.renderAdhocRows()}
                        </div>
                      </div>

                      {this.state.isAdhocTotalPaid ? <label className="help-block" id="2" style={{ color: "red" }}>Your Fees Are Pending.Please Pay Remaining Fee. </label> :
                        this.state.isAdhocTotalExceeds ? <label className="help-block" style={{ color: "red" }}>Your Fees Are Exceeding the Total Amount to Be Paid. </label> : <br />}
                    </div> : ""}


                    {this.state.finance.total_amount > 0 ? <div>
                      <div>
                        {this.state.dropDownValue != 0 ? <div className="form-group cust-fld">

                          <div className="dropdown">
                            <button id="dLabel" style={{ marginTop: "10px" }} type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                              {this.state.selectValue}
                            </button>
                            <ul style={{ height: "100px", overflow: "auto", marginTop: "-1px" }} className="dropdown-menu" aria-labelledby="dLabel">
                              {this.renderDropdownValue()}
                            </ul>

                          </div>
                        </div> : ""}
                        {this.state.isInstallmentTotalPaid ? <label className="help-block" id="1" style={{ color: "red" }}>Your Fees Are Pending.Please Pay Remaining Fee. </label> : <br />}
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
                    </div> : ""}
                    {this.state.isFeeTypeSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Fee Type</label> : <br />}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal" onClick={this.dataclearonCancel.bind(this)}>Cancel</button>
                <button className="c-btn primary" onClick={this.createFinance.bind(this)} >Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default (NewFeeStructureModal)