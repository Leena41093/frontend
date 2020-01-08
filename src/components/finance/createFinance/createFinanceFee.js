import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import $ from "jquery";
import { successToste, errorToste } from "../../../constant/util";
import { CreatePreviewInvoiceModel } from "../financeModels/createPreviewInvoiceModel";
import {
  getFinanceClassData,
  createFinanceClassTemplate,
  getFinanceTemplateData
} from "../../../actions/financeAction";
import { ToastContainer } from "react-toastify";
class CreateFinanceFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: moment(),
      end_date: moment(),
      classes: [],
      selectedClassData: {},
      dateErrorFlag: false,
      afterEndDateFlag: false,
      beforeStartDate: false
    };
  }

  componentDidMount() {
    this.getClassesData();
  }

  gotoNextPage() {
    this.props.history.push({ pathname: "/app/finance-information" });
  }

  gotoFeeSelectPage() {
    this.props.history.push({ pathname: "/app/finance-feestructureselection" });
  }

  setSelectedClass(ClassData) {
    this.setState({ selectedClassData: ClassData }, () => {
      let data = {
        payload:{
          class_id:ClassData.class_id
        },
        institude_id:this.props.instituteId,
        branch_id:this.props.branchId,
        token: this.props.token
      }

      this.props.getFinanceTemplateData(data).then(()=>{
        let resOfFinanceTemplate = this.props.financeTemplateDatas;
        if(resOfFinanceTemplate && resOfFinanceTemplate.data.status == 200){
          console.log("sldfjsldfj",resOfFinanceTemplate);
        }
      })
      $("#selectedClass").click();
    });
  }

  applyIstallmentsToAll = () => {
    let { classes } = this.state;
    let valOfInstallment = $("#applyInstallments").val();
    console.log("-=-=-=>",valOfInstallment);
    if (valOfInstallment > 0) {
      classes.forEach((installment, index) => {
        installment.no_of_installments = valOfInstallment;
      });
      this.setState({ classes });
    }
    if (valOfInstallment <= 0) {
      errorToste(
        "Number Of Installments Should be Greater Than 0 or Not Empty"
      );
    }
  };

  applyDatesToAll = () => {
    let { classes, start_date, end_date } = this.state;
    classes.forEach((date, index) => {
      date.start_date = start_date;
      date.end_date = end_date;
    });
    this.setState({ classes });
  };

  changeFeeamount(index, event) {
    let { classes } = this.state;
    classes[index].total_fee_amount = event.target.value;
    this.setState({ classes });
  }

  changeStartDate(date) {
    let { end_date } = this.state;
    let start_date = moment(date, "dd/mm/yyyy");
    let end_dates = moment(end_date, "dd/mm/yyyy");
    if (start_date.isAfter(end_dates)) {
      this.setState({
        end_date: date,
        afterEndDateFlag: true,
        dateErrorFlag: false
      });
    } else if (start_date.isSame(end_dates)) {
      this.setState({
        start_date: date,
        dateErrorFlag: true,
        afterEndDateFlag: false
      });
    } else {
      this.setState({
        start_date: date,
        dateErrorFlag: false,
        afterEndDateFlag: false
      });
    }
  }

  changeClassStartDate(index, date) {
    let { classes } = this.state;
    classes[index] = { ...classes[index], start_date: date };
    this.setState({ classes });
  }

  changeClassFeesInstallment(index, event) {
    let { classes } = this.state;
    let eventvalue = event.target.value;
    if (classes && classes.length > 0) {
      classes[index].no_of_installments = eventvalue;
      if(eventvalue > 0){
      classes[index].end_date = moment(classes[index].start_date).add(
        eventvalue-1,
        "month"
      );
      }
      this.setState({ classes });
    }
  }

  changeClassEndDate(index, date) {
    let { classes } = this.state;
    classes[index] = { ...classes[index], end_date: date };
    this.setState({ classes });
  }

  changeEndDate(date) {
    let { start_date } = this.state;
    let start_dates = moment(start_date, "dd/mm/yyyy");
    let end_dates = moment(date, "dd/mm/yyyy");
    if (end_dates.isBefore(start_dates)) {
      this.setState({
        end_date: date,
        beforeStartDate: true,
        dateErrorFlag: false
      });
    } else if (start_dates.isSame(end_dates) || end_dates.isSame(start_dates)) {
      this.setState({
        end_date: date,
        dateErrorFlag: true,
        beforeStartDate: false
      });
    } else {
      this.setState({
        end_date: date,
        dateErrorFlag: false,
        beforeStartDate: false
      });
    }
  }

  onSaveFinanceTemplateAdd(data) {
    let classData = data.classData;
    let installmentArray = data.installmentArray;
    let denomination = data.denomination;
    let datas = {
      payload: {
        class_id: classData.class_id,
        fee_template_name: classData.class_name,
        no_of_installments: classData.no_of_installments,
        start_date: moment(classData.start_date),
        end_date: moment(classData.end_date),
        total_fee_amount: classData.total_fee_amount,
        installments: installmentArray,
        denominations: denomination
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    };

    this.props.createFinanceClassTemplate(datas).then(() => {
      let createFinanceRes = this.props.financeClassTemplateData;
      if (createFinanceRes && createFinanceRes.data.status == 200) {
        successToste("Finance Data Saved Successfully");
      }
    });
  }

  renderInstallmentType() {}

  getClassesData() {
    let self = this;
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    };
    this.props.getFinanceClassData(data).then(() => {
      let resOfClasses = this.props.classesData;
      if (resOfClasses && resOfClasses.data.status == 200) {
        console.log(resOfClasses);
        self.setState({ classes: resOfClasses.data.response },()=>{
          console.log("test",this.state.classes)
        });
      }
    });
  }

  onChangeInstallments(e) {
    let { start_date, end_date } = this.state;
    let eventvalue = e.target.value;
    end_date = moment(start_date).add(eventvalue, "month");
    this.setState({ end_date });
  }

  renderTabelRow() {
    let { classes } = this.state;
    if (classes && classes.length > 0) {
      return classes.map((Class, index) => {
        return (
          <tr>
            <td>
              <span className="clearfix text-bold">{Class.class_name}</span>
            </td>
            <td>
              <div className="form-group cust-fld">
                <input
                  className="form-control"
                  style={{ marginTop: "4px" }}
                  value={Class.no_of_installments? Class.no_of_installments : 1}
                  onChange={this.changeClassFeesInstallment.bind(this, index)}
                  min="0"
                  max="12"
                  type="number"
                />
              </div>
            </td>
            <td>
              <div className="row">
                <div className="col-sm-6 form-group cust-fld">
                  <DatePicker
                    className="form-control"
                    placeholder="start_date"
                    selected={Class.start_date !== "" ? moment(Class.start_date) : moment()}
                    onChange={this.changeClassStartDate.bind(this, index)}
                  />
                </div>
                <div className="col-sm-6 form-group cust-fld">
                  <DatePicker
                    className="form-control"
                    placeholder="end_date"
                    selected={Class.end_date !== "" ? moment(Class.end_date) : moment()}
                    onChange={this.changeClassEndDate.bind(this, index)}
                  />
                </div>
              </div>
            </td>
            <td>
              <div className="form-group cust-fld feeAmount">
                <input
                  type="text"
                  className="form-control borderColored"
                  value = {Class.total_fee_amount}
                  onChange={this.changeFeeamount.bind(this, index)}
                />
              </div>
            </td>
            <td>
              <button
                className="link--btn"
                onClick={this.setSelectedClass.bind(this, Class)}
              >
                Preview Invoices
              </button>
            </td>
          </tr>
        );
      });
    }
  }

  render() {
    return (
      <div className="c-container dark clearfix">
        <ToastContainer />
        <button
          id="selectedClass"
          data-toggle="modal"
          data-target="#previewInvoice"
          hidden
        />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg margin10-bottom">
                Setup your Finances
              </span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime">Save as Draft</button>
            </div>
          </div>
        </div>

        <div className="clearfix">
          <div className="divider-container c-formWizard">
            <div className="divider-block text--center st-active">
              <div className="lineContainer">
                <div className="circle" />
                <div className="line" />
              </div>
              <div className="titleContainer">SELECT FEE STRUCTURE</div>
            </div>

            <div className="divider-block text--center  st-active">
              <div className="lineContainer">
                <div className="circle" />
                <div className="line" />
              </div>
              <div className="titleContainer">CREATE FEE TEMLPATES</div>
            </div>

            <div className="divider-block text--center">
              <div className="lineContainer">
                <div className="circle" />
                <div className="line" />
              </div>
              <div className="titleContainer">ENTER FINANCIAL INFORMATION</div>
            </div>

            <div className="divider-block text--center">
              <div className="lineContainer">
                <div className="circle" />
              </div>
              <div className="titleContainer">CONFIGURE PAYMENT METHODS</div>
            </div>
          </div>
        </div>

        <div className="clearfix">
          <div className="c-container__data for-finance">
            <div className="container-fluid">
              <div className="row margin25-bottom">
                <div className="col-md-5">
                  <div className="form-group cust-fld">
                    <label className="text-bold">
                      Select Fee Calculation Method
                    </label>
                    <div
                      className="btn-group btnGroup-cust"
                      data-toggle="buttons"
                    >
                      <label className="btn c-btn active">
                        <input
                          type="radio"
                          name="options"
                          id="option1"
                          checked
                          readOnly
                        />{" "}
                        class-wise
                      </label>
                      {/* <label className="btn c-btn">
                                                <input type="radio" name="options" id="option2" /> Subject-wise
                                                </label>
                                            <label className="btn c-btn">
                                                <input type="radio" name="options" id="option3" /> Batch-wise
                                            </label> */}
                    </div>
                  </div>
                </div>

                <div className="col-md-3" style={{ marginLeft: "-100px" }}>
                  <div className="form-group cust-fld">
                    <div className="clearfix">
                      <label className="text-bold pull-left">
                        No. of Installment
                      </label>
                      <button
                        className="link--btn pull-right"
                        onClick={this.applyIstallmentsToAll}
                      >
                        Apply to all
                      </button>
                      <ul className="dropdown-menu" aria-labelledby="dLabel">
                        {this.renderInstallmentType()}
                        {/* <li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
                                                <li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
                                                <li><a href="javascript:void(0);" className="dd-option">Option 1</a></li> */}
                      </ul>
                    </div>
                    <div>
                      <input
                        className="form-control"
                        id="applyInstallments"
                        style={{ marginTop: "4px" }}
                        defaultValue="1"
                        min="1"
                        max="12"
                        type="number"
                        onChange={this.onChangeInstallments.bind(this)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group cust-fld">
                    <div className="clearfix">
                      <label className="text-bold pull-left">
                        Installment Date
                      </label>
                      <button
                        className="link--btn pull-right"
                        onClick={this.applyDatesToAll}
                      >
                        Apply to all
                      </button>
                    </div>

                    <div>
                      <div className="datepicker  divider-block text--left">
                        <DatePicker
                          className="form-control"
                          placeholder="start_date"
                          selected={
                            this.state.start_date
                              ? moment(this.state.start_date)
                              : moment()
                          }
                          onChange={this.changeStartDate.bind(this)}
                        />
                      </div>
                      <div
                        className="datepicker divider-block text--right"
                        style={{ marginRight: "-118px", marginTop: "-52px" }}
                      >
                        <DatePicker
                          className="form-control"
                          placeholder="end_date"
                          selected={
                            this.state.end_date
                              ? moment(this.state.end_date)
                              : moment()
                          }
                          onChange={this.changeEndDate.bind(this)}
                        />
                      </div>
                    </div>
                    {this.state.dateErrorFlag == true ? (
                      <label style={{ color: "red" }}>
                        Start date and end date may not be same
                      </label>
                    ) : (
                      ""
                    )}
                    {this.state.afterEndDateFlag == true ? (
                      <label style={{ color: "red" }}>
                        Start date is may not after or equal to end date
                      </label>
                    ) : (
                      ""
                    )}
                    {this.state.beforeStartDate == true ? (
                      <label style={{ color: "red" }}>
                        End date is may not before or equal to start date
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              <div className="row margin25-bottom">
                <div className="col-md-12">
                  <div className="clearfix margin15-bottom">
                    <span className="c-heading-sm lg text-lowercase coloured card--title pull-left margin5-bottom">
                      Add fee to each class
                    </span>
                    <span className="c-notifyLabel step-2 pull-right">
                      (4/4 classes Filled)
                    </span>
                  </div>

                  <div className="clearfix financeTableSection">
                    <table className="table margin0-bottom">
                      <tr>
                        <th style={{ width: "18%" }}>class Name</th>
                        <th style={{ width: "19%" }}>No. of Installment</th>
                        <th style={{ width: "30%" }}>Duration</th>
                        <th style={{ width: "20%" }}>Fee Amount</th>
                        <th style={{ width: "13%" }} />
                      </tr>
                      {this.renderTabelRow()}
                    </table>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-right">
                  <button
                    className="c-btn grayshade md"
                    onClick={this.gotoFeeSelectPage.bind(this)}
                  >
                    Previous
                  </button>
                  <button
                    className="c-btn md"
                    onClick={this.gotoNextPage.bind(this)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CreatePreviewInvoiceModel
          onSaveFinanceTemplate={data => {
            this.onSaveFinanceTemplateAdd(data);
          }}
          selectedClassData={this.state.selectedClassData}
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ finance, app, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  classesData: finance.classesData,
  financeClassTemplateData: finance.createFinanceClassTemplateData,
  financeTemplateDatas : finance.financeTemplateData
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFinanceClassData,
      createFinanceClassTemplate,
      getFinanceTemplateData
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateFinanceFee);
