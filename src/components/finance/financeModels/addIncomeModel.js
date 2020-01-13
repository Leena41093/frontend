import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import $ from "jquery";

export class AddIncomeModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeObject: {
        from_payment: "",
        description: "",
        amount: "",

        pay_types: "INCOME"
      },
      payment_date: moment(),
      payment_method: "Payment Method",
      paymentTypeArr: ["CASH", "CHEQUE", "BANK_TRANSFER"],
      attachment_url: "",
      isFromPaymentVisible: false,
      // isAttachmentVisible: false,
      isDescriptionVisible: false,
      isPaymentDateVisible: false,
      isAmountVisible: false,
      isPaymentMethodVisible: false
    };
  }

  componentDidMount() {}

  changeInput(property, event) {
    if (property == "from_payment") {
      this.setState({ isFromPaymentVisible: false });
    }
    if (property == "description") {
      this.setState({ isDescriptionVisible: false });
    }
    if (property == "amount") {
      this.setState({ isAmountVisible: false });
    }

    let { incomeObject } = this.state;
    incomeObject = { ...incomeObject, [property]: event.target.value };
    this.setState({ incomeObject });
  }

  changePaymentDate(date) {
    this.setState({ payment_date: date, isPaymentDateVisible: false });
  }

  changePaymentType(obj) {
    this.setState({ payment_method: obj, isPaymentMethodVisible: false });
  }

  getFile(event) {
    this.setState({
      attachment_url: URL.createObjectURL(event.target.files[0])
    });
  }

  validate() {
    var isValidForm = true;
    let { incomeObject } = this.state;

    if (incomeObject.from_payment.length == 0) {
      this.setState({ isFromPaymentVisible: true });
      isValidForm = false;
    }
    if (incomeObject.description.length == 0) {
      this.setState({ isDescriptionVisible: true });
      isValidForm = false;
    }
    if (incomeObject.amount.length == 0) {
      this.setState({ isAmountVisible: true });
      isValidForm = false;
    }

    if (this.state.payment_method == "Payment Method") {
      this.setState({ isPaymentMethodVisible: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  saveIncome() {
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
      let sendObject = {
        from_payment: this.state.incomeObject.from_payment,
        description: this.state.incomeObject.description,
        amount: this.state.incomeObject.amount,
        attachment_url: this.state.attachment_url,
        pay_types: "INCOME",
        payment_date: this.state.payment_date,
        payment_method: this.state.payment_method
      };
      this.props.addIncome1(sendObject);
      $("#addIncome .close").click();
    }
  }

  renderPaymentType() {
    return this.state.paymentTypeArr.map((obj, index) => {
      return (
        <li>
          <a
            onClick={this.changePaymentType.bind(this, obj)}
            className="dd-option"
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
        id="addIncome"
        tabindex="-1"
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
              <h4 className="c-heading-sm card--title">Add Income</h4>
            </div>
            <div className="modal-body">
              <span className="cust-m-info">Enter the Income Details.</span>
              <div className="divider-container addBatch-container type02">
                <div className="divider-block">
                  <div className="form-group cust-fld">
                    <label>
                      From <sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="To"
                      value={this.state.incomeObject.from_payment}
                      onChange={this.changeInput.bind(this, "from_payment")}
                    />
                    {this.state.isFromPaymentVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please Enter From Name{" "}
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
                      value={this.state.incomeObject.description}
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
                      Payment Date <sup>*</sup>{" "}
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
                </div>

                <div className="divider-block">
                  <div className="form-group cust-fld">
                    <label>
                      Amount Received <sup>*</sup>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Amount"
                      value={this.state.incomeObject.amount}
                      onChange={this.changeInput.bind(this, "amount")}
                    />
                    {this.state.isAmountVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please Enter Received Amount{" "}
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
                        placeholder=""
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
                  onClick={this.saveIncome.bind(this)}
                >
                  Add Income
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
