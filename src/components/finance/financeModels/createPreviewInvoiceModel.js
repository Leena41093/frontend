import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import { createFinanceClassTemplate } from "../../../actions/financeAction";
import $ from "jquery";
import { successToste, errorToste } from "../../../constant/util";
import { parse } from "url";
export class CreatePreviewInvoiceModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classData: {},
      installmentArray: [],
      denomination: [],
      renderbreakdownflag: false,
      otherFeeTotal: "",
      dateErrorFlag:false,
      afterEndDateFlag:false,
      beforeStartDate:false,
      noInstallmentError:false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ classData: nextProps.selectedClassData }, () => {
      console.log("54556",this.state.classData)
      this.getInstallmentsList();
    });
  }
  componentDidMount() {
    this.setState({ classData: this.props.selectedClassData }, () => {});
  }

  changeFeeamount(event) {
    let { classData } = this.state;
    classData.total_fee_amount = event.target.value;
    this.setState({ classData },()=>{
      this.getInstallmentsList();
    });
  }

  changeClassStartDate(date) {
    let{classData} = this.state
    let start_date = moment(date,"dd/mm/yyyy")
    let end_dates = moment(classData.end_date,"dd/mm/yyyy")
    classData.start_date = date;
    if(start_date.isAfter(end_dates)){
      this.setState({classData, afterEndDateFlag:true, dateErrorFlag:false})
    }
    else if(start_date.isSame( end_dates)){
      this.setState({classData, dateErrorFlag:true,afterEndDateFlag:false})
    }
    
    else{
      this.setState({classData,dateErrorFlag:false,afterEndDateFlag:false})
    }
    
  }

  changeClassFeesInstallment(event){
    let { classData } = this.state;
    let eventvalue = event.target.value;
    classData.no_of_installments = event.target.value;
    if(eventvalue>0){
      classData.end_date = moment(classData.start_date).add(eventvalue-1, "month");
    }
    this.setState({classData,noInstallmentError:false},()=>{  
      this.getInstallmentsList()
    })
    
  }

  changeClassEndDate(date) {
    let { classData } = this.state;
    let start_dates = moment(classData.start_date,"dd/mm/yyyy")
    let end_dates = moment(date,"dd/mm/yyyy")
    classData.end_date = date;
    if(end_dates.isBefore(start_dates)){
      this.setState({classData, beforeStartDate:true,dateErrorFlag:false})
    }
    else if(start_dates.isSame( end_dates) || end_dates.isSame(start_dates)){
      this.setState({classData, dateErrorFlag:true, beforeStartDate:false})
    }
    else{
      this.setState({classData,dateErrorFlag:false,beforeStartDate:false})
    }
  }
  onChangeInstallmentAmount(index, event) {
    let { installmentArray, classData } = this.state;
    let fee_amount = event.target.value;
    let mainAmount = classData.total_fee_amount;
    installmentArray[index].installment_amount = parseInt(fee_amount);
    let totalAmount = 0;
    let remainingAmount = 0;
    installmentArray.forEach((installment, idx) => {
      if (idx <= index) {
        totalAmount = parseInt(totalAmount + installment.installment_amount);
      }
    });
    let arraylength = installmentArray.length;
    let min = index + 1;
    let mins = arraylength - min;
    remainingAmount = mainAmount - totalAmount;
    let eachamount = remainingAmount / mins;

    installmentArray.forEach((install, indx) => {
      if (indx > index) {
        install.installment_amount = Math.round(eachamount);
      }
    });
    this.setState({ installmentArray });
  }

  getInstallmentsList() {
    let { classData } = this.state;
    let installmentArray = [];
    for (let i = 0; i < classData.no_of_installments; i++) {
      installmentArray.push(
        //
        {
          installment_amount:  Math.round(classData.total_fee_amount / classData.no_of_installments),
          installment_date: moment(this.state.classData.start_date).add(
            "month",
            i
          ),
          installment_no: i + 1
        }
      );
    }

    this.setState({ installmentArray: installmentArray }, () => {
      this.renderNextInstallments();
    });
  }

  onCreateFinance(event) {
    let { classData, installmentArray, denomination } = this.state;
    let data = { classData, installmentArray, denomination };

    this.setState({ classData: [], installmentArray: [], denomination: [] });

    if (data.length == 0) {
      errorToste(
        "Insufficient Data(Can Not Add Batch Without Class,Subject And Batch.)"
      );
    } else {
      this.props.onSaveFinanceTemplate(data);
    }
  }

  addDenominationValue(index, type, event) {
    let { denomination } = this.state;
    if (type == "type") {
      denomination[index] = {
        ...denomination[index],
        type: event.target.value
      };
    } else if (type == "percent") {
      let lenghtDenomination = denomination.length - 1;

      denomination[index] = {
        ...denomination[index],
        percent: parseInt(event.target.value)
      };
      if (denomination[index].percent > 0) {
        let totalPercent = [];
        for (let i = 0; i < lenghtDenomination; i++) {
          totalPercent.push(denomination[i].percent);
        }
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        let countPercent = totalPercent.reduce(reducer);
        denomination[lenghtDenomination] = {
          ...denomination[denomination.length - 1],
          percent: 100 - countPercent
        };
      }
    }
    this.setState({ denomination });
  }

  addDenomination() {
    let { denomination } = this.state;
    denomination.unshift({ type: "", percent: 0 });
    this.setState({ denomination });
  }

  addBreakdown() {
    let { denomination } = this.state;
    denomination.push({ type: "General Fee", percent: 100 });
    this.setState({ denomination, renderbreakdownflag: true });
  }

  removeType(index) {
    let { denomination } = this.state;

    denomination.splice(index, 1);
    this.setState({ denomination }, () => {
      if (this.state.denomination.length == 1) {
        denomination.map((obj, index) => {
          denomination[index] = {
            ...denomination[index],
            type: obj.type,
            percent: 100
          };
          this.setState({ denomination });
        });
      }

      if (this.state.denomination.length > 1) {
        var otherFeeTotal = 0;
        denomination.forEach((obj, index) => {
          if (obj.type != "General Fee") {
            otherFeeTotal = parseInt(otherFeeTotal + obj.percent);

            denomination[denomination.length - 1] = {
              ...denomination[denomination.length - 1],
              type: "General Fee",
              percent: 100 - otherFeeTotal
            };
          }
          this.setState({ denomination });
        });
      }

      if (this.state.denomination.length == 0) {
        this.setState({ renderbreakdownflag: false });
      }
    });
  }

  renderBreakdown() {
    let { denomination } = this.state;
    if (denomination && denomination.length > 0) {
      return denomination.map((contents, index) => {
        return (
          <div className="row">
            <div className="col-md-2">
              <span className="labelNumber margin10-top">{index + 1}.</span>
            </div>
            <div className="col-md-5 nopad">
              <div className="form-group cust-fld">
                {contents.type == "General Fee" ? (
                  <input
                    type="text"
                    className="form-control pad5"
                    min="1"
                    max="100"
                    value={contents.type}
                    onChange={this.addDenominationValue.bind(
                      this,
                      index,
                      "type"
                    )}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control pad5"
                    value={contents.type}
                    min="1"
                    max="100"
                    onChange={this.addDenominationValue.bind(
                      this,
                      index,
                      "type"
                    )}
                  />
                )}
              </div>
            </div>
            <div className="col-md-3 pad5-ltrt">
              <div className="form-group cust-fld">
                {contents.type == "General Fee" ? (
                  <input
                    type="number"
                    className="form-control pad5"
                    min="1"
                    max="100"
                    style={{ width: "50px" }}
                    value={parseInt(contents.percent)}
                    disabled
                  />
                ) : (
                  <input
                    type="number"
                    className="form-control pad5"
                    style={{ width: "50px" }}
                    value={parseInt(contents.percent)}
                    min="1"
                    max="100"
                    onChange={this.addDenominationValue.bind(
                      this,
                      index,
                      "percent"
                    )}
                  />
                )}
              </div>
            </div>
            {contents.type != "General Fee" ? (
              <div className="col-md-2 pad0-left" style={{ marginTop: "15px" }}>
                <button
                  className="c-actionBtn margin10-top"
                  onClick={this.removeType.bind(this, index)}
                >
                  <i className="icon cg-android-close" />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      });
    }
  }

  

  renderNextInstallments() {
    let { installmentArray } = this.state;
    return installmentArray.map((installment, index) => {
      return (
        <div className="row" key={"installment"+index}>
          <div className="col-md-2">
            <span className="labelNumber margin10-top">
              {installment.installment_no}.
            </span>
          </div>
          <div className="col-md-4 nopad">
            <div className="form-group cust-fld">
              <input
                type="number"
                className="form-control"
                min="0"
                value={installment.installment_amount}
                onChange={this.onChangeInstallmentAmount.bind(this, index)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group cust-fld">
              <DatePicker
                className="form-control"
                placeholder="end_date"
                selected={
                  installment.installment_date
                    ? installment.installment_date
                    : moment()
                }
                onChange={this.changeClassStartDate.bind(this, index)}
              />
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div
        className="modal fade custom-modal-lg"
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
              <h4 className="c-heading-sm card--title">PREVIEW INVOICES</h4>
            </div>
            <div className="modal-body">
              <div className="divider-container addBatch-container type02">
                <div className="divider-block">
                  <div className="cust-m-info">
                    Information for the template
                  </div>

                  <div className="form-group cust-fld">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.classData.class_name}
                    />
                  </div>

                  <div className="form-group cust-fld">
                    <label>Fee Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.classData.total_fee_amount}
                      onChange={this.changeFeeamount.bind(this)}
                    />
                  </div>

                  <div className="form-group cust-fld">
                    <label>Duration</label>

                    <div className="row">
                      <div className="col-sm-6 form-group cust-fld">
                        <DatePicker
                          className="form-control"
                          placeholder="start_date"
                          selected={this.state.classData ? moment(this.state.classData.start_date): moment()}
                          onChange={this.changeClassStartDate.bind(this)}
                        />
                      </div>
                      <div className="col-sm-6 form-group cust-fld">
                        <DatePicker
                          className="form-control"
                          placeholder="end_date"
                          selected={this.state.classData ? moment(this.state.classData.end_date) : moment()}
                          onChange={this.changeClassEndDate.bind(this)}
                        />
                      </div>
                    </div>
                    {this.state.dateErrorFlag == true? <label style={{color:"red"}}>Start date and end date may not be same</label> :""}
                    {this.state.afterEndDateFlag == true? <label style={{color:"red"}}>Start date is may not after or equal to end date</label> :""}
                    {this.state.beforeStartDate == true? <label style={{color:"red"}}>End date is may not before or equal to start date</label> :""}
                  </div>

                  <div className="form-group cust-fld">
                    <label>Number of Installment</label>
                    <input
                      className="form-control"
                      id="applyInstallments"
                      style={{ marginTop: "4px" }}
                      defaultValue="1"
                      value={this.state.classData ? this.state.classData.no_of_installments : 1}
                      onChange={this.changeClassFeesInstallment.bind(this)}
                      min="0"
                      max="12"
                      type="number"
                    />
                    {this.state.noInstallmentError == true? <label style={{color:"red"}}>Number of Installments may not be zero</label> :""}
                  </div>

                  <div className="totalNumber">
                    Total Invoices : {this.state.classData? this.state.classData.no_of_installments : 1}
                  </div>
                </div>

                <div className="divider-block">
                  <div className="cust-m-info">
                    Preview the invoice amount & date of issue.
                  </div>
                  <div
                    className="c-batchSelect"
                    style={{
                      height: "400px",
                      overflowX: "none",
                      overflowY: "auto"
                    }}
                  >
                    <div className="form-group cust-fld fldLine">
                      {this.renderNextInstallments()}
                    </div>

                    {/* {this.state.classData.noOfInstallment>1 ?<div className="form-group cust-fld fldLine"> */}
                    {/* <label>Next Installments</label> */}

                    {/* </div>:""} */}
                  </div>
                </div>

                <div className="divider-block">
                  <div className="cust-m-info">
                    Enter invoice breakdown. (Optional)
                  </div>
                  {this.state.renderbreakdownflag == false ? (
                    <div className="c-btnContainer margin25-bottom">
                      <button
                        className="c-btn-bordered lg"
                        onClick={this.addBreakdown.bind(this)}
                      >
                        Enter Breakdown
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="cust-m-info">
                    This will be displayed on the invoice. If you don’t enter
                    any breakdown, default ‘Fees’ will be shown on the invoice.
                  </div>

                  {this.state.renderbreakdownflag == true ? (
                    <div className="form-group cust-fld fldLine">
                      {this.renderBreakdown()}
                      <div className="c-btnContainer margin25-bottom">
                        <button
                          className="c-btn-bordered"
                          onClick={this.addDenomination.bind(this)}
                        >
                          Add denomination
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
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
                  onClick={this.onCreateFinance.bind(this)}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
