import React, { Component } from "react";
import { moment } from "fullcalendar";
import DatePicker from "react-datepicker";
import $ from "jquery";

export class AddExpenceModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenceObject: {
        to_payment: "",
        description: "",
        amount: "",
        pay_type: ""
      },
      attachment_url: "",
      recurring_date: "",
      total_recurring_no: 1,
      payment_method: "Payment Method",
      payment_date: moment(),
      paymentTypeArr: ["CASH", "CHEQUE", "BANK_TRANSFER"],
      recurring: false,
      isFromPaymentVisible: false,
      isAttachmentVisible: false,
      isDescriptionVisible: false,
      isPaymentDateVisible: false,
      isAmountVisible: false,
      isPaymentMethodVisible: false,
      changeRecurrColor: false
    };
  }

  changeInput(property, event) {
    if (property == "to_payment") {
      this.setState({ isFromPaymentVisible: false });
    }
    if (property == "description") {
      this.setState({ isDescriptionVisible: false });
    }
    if (property == "amount") {
      this.setState({ isAmountVisible: false });
    }
    let { expenceObject } = this.state;
    expenceObject = { ...expenceObject, [property]: event.target.value };
    this.setState({ expenceObject });
  }

  changePaymentType(obj) {
    this.setState({ payment_method: obj, isPaymentMethodVisible: false });
  }

  changePaymentDate(date) {
    this.setState({ payment_date: date, isPaymentDateVisible: false });
  }

  selectAll(value) {
    let checkbox = document.getElementById("check-all1");
    if (checkbox.checked == true) {
      this.setState(
        {
          recurring: true,
          recurrFlag: true,
          recurring_date: moment(),
          changeRecurrColor: true
        },
        () => {}
      );
    } else {
      this.setState({
        recurring: false,
        recurrFlag: false,
        recurring_date: "",
        changeRecurrColor: false
      });
    }
  }

  changeRecurringDate(date) {
    this.setState({ recurring_date: date });
  }

  changeNumberOfInstallment(event) {
    this.setState({ total_recurring_no: event.target.value });
  }

  getFile(event) {
    this.setState({
      attachment_url: URL.createObjectURL(event.target.files[0]),
      isAttachmentVisible: false
    });
  }

  validate() {
    var isValidForm = true;
    let { expenceObject } = this.state;

    if (expenceObject.to_payment.length == 0) {
      this.setState({ isFromPaymentVisible: true });
      isValidForm = false;
    }
    if (expenceObject.description.length == 0) {
      this.setState({ isDescriptionVisible: true });
      isValidForm = false;
    }
    if (expenceObject.amount.length == 0) {
      this.setState({ isAmountVisible: true });
      isValidForm = false;
    }

    if (this.state.payment_method == "Payment Method") {
      this.setState({ isPaymentMethodVisible: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  expenceAdd() {
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
      let sendObject = {
        payment_date: this.state.payment_date,
        to_payment: this.state.expenceObject.to_payment,
        description: this.state.expenceObject.description,
        amount: this.state.expenceObject.amount,
        payment_method: this.state.payment_method,
        attachment_url: this.state.attachment_url,
        recurring_date: this.state.recurring_date,
        total_recurring_no: this.state.total_recurring_no,
        recurring: this.state.recurring,
        pay_type: "EXPENSE"
      };
      this.props.addExpense(sendObject);
      $("#previewInvoice .close").click();
    }
  }

  renderPaymentType() {
    return this.state.paymentTypeArr.map((obj, index) => {
      return (
        <li>
          <a
            className="dd-option"
            onClick={this.changePaymentType.bind(this, obj)}
          >
            {obj}
          </a>
        </li>
      );
    });
  }

  render() {
    return (
      <div
        className="modal fade"
        id="previewInvoice"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="icon cg-times" />
              </button>
              <h4 className="c-heading-sm card--title">Add Expences</h4>
            </div>
            <div className="modal-body">
              <span className="cust-m-info">Enter the Expense Details.</span>
              <div className="divider-container addBatch-container type02">
                <div className="divider-block">
                  <div className="form-group cust-fld">
                    <label>
                      To <sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="To"
                      value={this.state.expenceObject.to_payment}
                      onChange={this.changeInput.bind(this, "to_payment")}
                    />
                    {this.state.isFromPaymentVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please Enter Name{" "}
                      </label>
                    ) : (
                      <br />
                    )}
                  </div>

                  <div className="form-group cust-fld">
                    <label>
                      Description <sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      value={this.state.expenceObject.description}
                      onChange={this.changeInput.bind(this, "description")}
                    />
                    {this.state.isDescriptionVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please Enter Description{" "}
                      </label>
                    ) : (
                      <br />
                    )}
                  </div>

                  <div className="form-group cust-fld">
                    <label>
                      Payment Date <sup>*</sup>
                    </label>

                    <DatePicker
                      className="form-control"
                      placeholder="start_date"
                      selected={
                        this.state.payment_date
                          ? moment(this.state.payment_date)
                          : moment()
                      }
                      onChange={this.changePaymentDate.bind(this)}
                    />
                    {this.state.isPaymentDateVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please enter Payment Date{" "}
                      </label>
                    ) : (
                      <br />
                    )}
                  </div>
                  <div
                    className="form-group cust-fld"
                    style={{ borderBottom: "2px solid #F2F2F5" }}
                  />
                  <div className="form-group cust-fld">
                    <label
                      htmlFor="check-all1"
                      className="custome-field field-checkbox"
                    >
                      {" "}
                      {this.state.changeRecurrColor == true ? (
                        <span style={{ color: "#990000" }}>Recurring</span>
                      ) : (
                        <span>Recurring</span>
                      )}
                      <input
                        type="checkbox"
                        onClick={this.selectAll.bind(this)}
                        name="check-one1"
                        id="check-all1"
                        value={true}
                        checked={this.state.recurring == true ? true : false}
                      />
                      <i />
                    </label>
                  </div>
                  {this.state.recurrFlag == true ? (
                    <div>
                      <div className="form-group cust-fld pull-left">
                        <label htmlFor="applyInstallment">
                          No. of Installment (including the 1st)
                        </label>
                        <input
                          className="form-control"
                          id="applyInstallments"
                          style={{ marginTop: "4px", width: "205px" }}
                          value={this.state.total_recurring_no}
                          onChange={this.changeNumberOfInstallment.bind(this)}
                          min="1"
                          type="number"
                        />
                        {/* {this.state.noInstallmentError == true? <label style={{color:"red"}}>Number of Installments may not be zero</label> :""} */}
                      </div>
                      {/* <div
                        className="form-group cust-fld pull-right"
                        style={{ width: "122px" }}
                      >
                        <label>Recurring Date</label>

                        <DatePicker
                          className="form-control"
                          placeholder="start_date"
                          selected={
                            this.state.recurring_date
                              ? moment(this.state.recurring_date)
                              : moment()
                          }
                          onChange={this.changeRecurringDate.bind(this)}
                        />
                      </div> */}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="divider-block">
                  <div className="form-group cust-fld">
                    <label>
                      Amount Paid <sup>*</sup>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Amount"
                      value={this.state.expenceObject.amount}
                      onChange={this.changeInput.bind(this, "amount")}
                    />
                    {this.state.isAmountVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please Enter Paid Amount{" "}
                      </label>
                    ) : (
                      <br />
                    )}
                  </div>

                  <div className="form-group cust-fld">
                    <label>
                      Payment Method <sup>*</sup>
                    </label>
                    <div className="dropdown">
                      <button
                        id="dLabel"
                        type="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {this.state.payment_method}
                      </button>
                      {this.state.isPaymentMethodVisible ? (
                        <label className="help-block" style={{ color: "red" }}>
                          Please Enter Payment Method{" "}
                        </label>
                      ) : (
                        <br />
                      )}
                      <ul
                        style={{ marginTop: "-21px" }}
                        className="dropdown-menu"
                        aria-labelledby="dLabel"
                      >
                        {this.renderPaymentType()}
                      </ul>
                    </div>
                  </div>

                  <div className="form-group cust-fld">
                    <label>Attachment(Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      placeholder="file"
                      onChange={this.getFile.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal">
                  Cancel
                </button>
                <button
                  className="c-btn primary"
                  onClick={this.expenceAdd.bind(this)}
                >
                  Add Expences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
