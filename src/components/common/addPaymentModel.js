import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { errorToste } from '../../constant/util';
// import { ToastContainer, toast } from 'react-toastify';

export class AddPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPayment: {
        payment_date: '',
        amount: 0,
      },
      addedData: {},
      id: '',
      unpaidArr: [],
      installmentNo: '',
      isAmountVisible: false,
      isDateVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      newPayment: nextProps.getdata, unpaidArr: nextProps.unpaidArray,
      installmentNo: nextProps.getdata.installment_no
    })
  }

  changeAmount(event) {
    let { newPayment, unpaidArr } = this.state;

    if (unpaidArr.length == 1) {
      errorToste("You Cant Change Input")
    }

    let amt = 0;
    unpaidArr.map((data, index) => {
      amt = Number(amt) + Number(data.amount)
    })

    if (event.target.value > amt) {
      errorToste("Amount should be less than all total amount")
    }
    newPayment = { ...newPayment, amount: event.target.value }
    this.setState({ newPayment, isAmountVisible: false })
  }

  onDateInputChange(date) {

    let { newPayment } = this.state;
    newPayment = { ...newPayment, payment_date: date }
    this.setState({ newPayment, isDateVisible: false })
  }

  validate() {
    let { newPayment } = this.state;
    let isValidForm = true;
    if (!newPayment.amount) {
      this.setState({ isAmountVisible: true });
      isValidForm = false
    }
    if (newPayment.amount == 0) {
      this.setState({ isAmountVisible: true });
      isValidForm = false
    }
    return isValidForm
  }

  addPayment() {
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
      let { newPayment } = this.state;
      this.props.onaddPayment(newPayment)
    }
  }

  render() {
    let flag = false;
    if (this.state.unpaidArr && this.state.unpaidArr.length == 1) {
      flag = true;
    }
    return (
      <div className="modal fade custom-modal-sm" id="addPayment" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">Add Payment</h4>
            </div>
            <div className="modal-body">
              <div className="cust-m-info">Enter date and payment amount.</div>
              <div className="form-group cust-fld">
                <label>Date ({"Installment No." + " " + this.state.installmentNo})</label>

                <DatePicker className="form-control fld--date" selected={this.state.newPayment && this.state.newPayment.payment_date ? moment(this.state.newPayment.payment_date) : moment()} onChange={this.onDateInputChange.bind(this)} />
                {/* {this.state.isDateVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Date Of Payment</label> : <br />} */}
              </div>
              <div className="form-group cust-fld">
                <label>Amount</label>
                <input value={this.state.newPayment ? this.state.newPayment.amount : ""} disabled={flag} onChange={this.changeAmount.bind(this)} type="Number" min="1" className="form-control" placeholder="Amount" />

                {this.state.isAmountVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Amount</label> : <br />}
              </div>

            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal">Cancel</button>
                <button className="c-btn primary" onClick={this.addPayment.bind(this)}> Add Payment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default (AddPayment)