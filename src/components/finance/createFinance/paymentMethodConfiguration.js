import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  getInstituteBankDetails,
  createInstituteBankDetails
} from "../../../actions/financeAction";

class PaymentMethodConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankDetails: {
        bankName: "",
        branchName: "",
        accountNo: "",
        ifscCode: ""
      },
      isBanknameVisible: false,
      isBranchnameVisible: false,
      isAccountNoVisible: false,
      isIfscCodeVisible: false,
      instituteName: "",

      fin_bank_details_id: ""
      // bankView: "true"
    };
  }

  componentDidMount() {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    };
    this.props.getInstituteBankDetails(apiData).then(() => {
      let res = this.props.getBankDetailOfInstitute;

      if (res && res.data.status == 200) {
        if (res && res.data.response.length > 0) {
          this.setState(
            {
              bankName: res.data.response[0].bank_name,
              branchName: res.data.response[0].branch_name,
              accountNo: res.data.response[0].bank_acc_no,
              ifscCode: res.data.response[0].ifsc_code,
              fin_bank_details_id: res.data.response[0].fin_bank_details_id
            },
          );
        }
      }
    });
  }

  validate() {
    var isValidForm = true;
    let { bankDetails } = this.state;
    if (bankDetails.bankName.length == 0) {
      this.setState({ isBanknameVisible: true });
      isValidForm = false;
    }
    if (bankDetails.branchName.length == 0) {
      this.setState({ isBranchnameVisible: true });
      isValidForm = false;
    }
    if (bankDetails.accountNo.length == 0) {
      this.setState({ isAccountNoVisible: true });
      isValidForm = false;
    }
    if (bankDetails.ifscCode.length == 0) {
      this.setState({ isIfscCodeVisible: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  goToNext() {
    if (this.state.fin_bank_details_id == "") {
      const isValidForm = this.validate();
      if (!isValidForm) {
        return;
      } else {
        let apiData = {
          payload: {
            bank_name: this.state.bankDetails.bankName,
            branch_name: this.state.bankDetails.branchName,
            bank_acc_no: this.state.bankDetails.bankName,
            ifsc_code: this.state.bankDetails.ifscCode
          },
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token
        };

        this.props.createInstituteBankDetails(apiData).then(() => {
          let res = this.props.createInstituteBankDetail;

          if (res && res.data.status == 200) {
            this.props.history.push({ pathname: "/app/finance-dashboard" });
          }
        });
      }
    } else {
      this.props.history.push({ pathname: "/app/finance-dashboard" });
    }
  }

  changeInput(propertyname, event) {
    if (propertyname == "bankName") {
      this.setState({ isBanknameVisible: false });
    }
    if (propertyname == "branchName") {
      this.setState({ isBranchnameVisible: false });
    }
    if (propertyname == "accountNo") {
      this.setState({ isAccountNoVisible: false });
    }
    if (propertyname == "ifscCode") {
      this.setState({ isIfscCodeVisible: false });
    }

    let { bankDetails } = this.state;
    bankDetails = { ...bankDetails, [propertyname]: event.target.value };
    this.setState({ bankDetails });
  }

  gotoPreviousPage() {
    this.props.history.push({ pathname: "/app/finance-information" });
  }

  renderCreatedBankDetails() {
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              Bank Name <sup>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Bank Name"
              value={this.state.bankName}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              Branch Name <sup>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Branch Name"
              value={this.state.branchName}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              Bank Account No. <sup>*</sup>
            </label>
            <input
              className="form-control"
              placeholder="Bank Account No"
              value={this.state.accountNo}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              IFSC Code <sup>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Bank IFSC code"
              value={this.state.ifscCode}
            />
          </div>
        </div>
      </div>
    );
  }

  renderNewBankDetails() {
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              Bank Name <sup>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Bank Name"
              value={this.state.bankDetails.bankName}
              onChange={this.changeInput.bind(this, "bankName")}
            />
            {this.state.isBanknameVisible ? (
              <label className="help-block" style={{ color: "red" }}>
                Please enter bank name{" "}
              </label>
            ) : (
              <br />
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              Branch Name <sup>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Branch Name"
              value={this.state.bankDetails.branchName}
              onChange={this.changeInput.bind(this, "branchName")}
            />
            {this.state.isBranchnameVisible ? (
              <label className="help-block" style={{ color: "red" }}>
                Please enter branch name{" "}
              </label>
            ) : (
              <br />
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              Bank Account No.
              <sup>*</sup>
            </label>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="Bank Account No"
              value={this.state.bankDetails.accountNo}
              onChange={this.changeInput.bind(this, "accountNo")}
            />
            {this.state.isAccountNoVisible ? (
              <label className="help-block" style={{ color: "red" }}>
                Please enter account no{" "}
              </label>
            ) : (
              <br />
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group cust-fld">
            <label>
              IFSC Code <sup>*</sup>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Bank IFSC code"
              value={this.state.bankDetails.ifscCode}
              onChange={this.changeInput.bind(this, "ifscCode")}
            />
            {this.state.isIfscCodeVisible ? (
              <label className="help-block" style={{ color: "red" }}>
                Please enter IFSC code{" "}
              </label>
            ) : (
              <br />
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="c-container dark clearfix">
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

            <div className="divider-block text--center st-active">
              <div className="lineContainer">
                <div className="circle" />
                <div className="line" />
              </div>
              <div className="titleContainer">CREATE FEE TEMLPATES</div>
            </div>

            <div className="divider-block text--center st-active">
              <div className="lineContainer">
                <div className="circle" />
                <div className="line" />
              </div>
              <div className="titleContainer">ENTER FINANCIAL INFORMATION</div>
            </div>

            <div className="divider-block text--center st-active">
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
              <div className="row">
                <div className="col-md-12">
                  <span className="c-heading-sm lg text-lowercase coloured card--title">
                    Configure Payment Methods
                  </span>

                  <div className="clearfix">
                    <div
                      className="panel-group c-panelAccord"
                      id="record1"
                      role="tablist"
                      aria-multiselectable="true"
                    >
                      <div className="panel panel-default">
                        <div
                          className="panel-heading"
                          role="tab"
                          id="headingThree"
                        >
                          <a
                            className="panel-title clearfix collapsed"
                            role="button"
                            data-toggle="collapse"
                            data-parent="#record1"
                            href="#collapseRecord1"
                            aria-expanded="false"
                            aria-controls="collapseThree"
                          >
                            <span className="mainTitle noCheck st-active">
                              Bank Transfer *
                            </span>
                          </a>
                        </div>
                        {this.state.fin_bank_details_id == "" ? (
                          <div
                            id="collapseRecord1"
                            className="panel-collapse collapse"
                            role="tabpanel"
                            aria-labelledby="headingThree"
                            aria-expanded="false"
                          >
                            <div className="panel-body">
                              {this.renderNewBankDetails()}
                            </div>
                          </div>
                        ) : (
                          <div
                            id="collapseRecord1"
                            className="panel-collapse collapse in"
                            role="tabpanel"
                            aria-labelledby="headingThree"
                            aria-expanded="true"
                          >
                            <div className="panel-body">
                              {this.renderCreatedBankDetails()}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="panel panel-default">
                        <div
                          className="panel-heading"
                          role="tab"
                          id="headingThree"
                        >
                          <a
                            className="panel-title clearfix collapsed"
                            role="button"
                            data-toggle="collapse"
                            data-parent="#record1"
                            href="#collapseRecord2"
                            aria-expanded="false"
                            aria-controls="collapseThree"
                          >
                            <span className="mainTitle noCheck">
                              UPI / BHIM
                            </span>
                          </a>
                        </div>
                        <div
                          id="collapseRecord2"
                          className="panel-collapse collapse"
                          role="tabpanel"
                          aria-labelledby="headingThree"
                        >
                          <div className="panel-body">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="form-group cust-fld">
                                  <label>Bank Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Bank Name"
                                  />
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="form-group cust-fld">
                                  <label>Branch Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Branch Name"
                                  />
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="form-group cust-fld">
                                  <label>Bank Account No.</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Bank Account No"
                                  />
                                </div>
                              </div>

                              <div className="col-md-4">
                                <div className="form-group cust-fld">
                                  <label>IFSC Code</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Bank IFSC code"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-right">
                  <button
                    className="c-btn grayshade md"
                    onClick={this.gotoPreviousPage.bind(this)}
                  >
                    Previous
                  </button>
                  <button
                    className="c-btn md"
                    onClick={this.goToNext.bind(this)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ finance, app, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  getBankDetailOfInstitute: finance.getBankDetailOfInstitute,
  createInstituteBankDetail: finance.createInstituteBankDetail
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getInstituteBankDetails,
      createInstituteBankDetails
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentMethodConfiguration);
