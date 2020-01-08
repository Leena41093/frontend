import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  getFinanceInstituteDetails,
  createFinanceInstituteDetails
} from "../../../actions/financeAction";
import { moment } from "fullcalendar";
import DatePicker from "react-datepicker";

class FinanceInforamtion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instituteDetails: {
        instituteName: "",
        address: "",
        contactNo: "",
        email: "",
        panNo: "",
        gstNo: "",
        gstValue: "",
        otherTax: "",
        SGST: "",
        IGST: "",
        footerNote: ""
      },
      logoUrl: "",
      fin_financial_information_id: "",
      isInstitutenameVisible: "",
      isContactNoVisible: "",
      isAddressVisible: "",
      isEmailVisible: "",
      isOtherTaxVisible: "",
      isFooterNoteVoisible: "",
      isPanNoVisible: "",
      invoiceDate: moment()
    };
  }

  componentDidMount() {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    };
    this.props.getFinanceInstituteDetails(apiData).then(() => {
      let res = this.props.financeInstituteDetail;

      if (res && res.data.status == 200) {
        if (res && res.data.response.length > 0) {
          this.setState({
            instituteName: res.data.response[0].institute_name,
            address: res.data.response[0].address,
            contactNo: res.data.response[0].contact_no,
            email: res.data.response[0].email,
            panNo: res.data.response[0].pan_no,
            otherTax: res.data.response[0].other_tax,
            footerNote: res.data.response[0].invoice_footer_text,
            fin_financial_information_id:
              res.data.response[0].fin_financial_information_id
          });
        }
      }
    });
  }

  gotoPreviousPage() {
    this.props.history.push({ pathname: "/app/create-financefee" });
  }

  inputChange(propertyName, event) {
    let { instituteDetails } = this.state;
    if (propertyName == "instituteName") {
      this.setState({ isInstitutenameVisible: false });
    }
    if (propertyName == "address") {
      this.setState({ isAddressVisible: false });
    }
    if (propertyName == "contactNo") {
      this.setState({ isContactNoVisible: false });
    }
    if (propertyName == "email") {
      this.setState({ isEmailVisible: false });
    }
    if (propertyName == "panNo") {
      this.setState({ isPanNoVisible: false });
    }
    if (propertyName == "otherTax") {
      this.setState({ isOtherTaxVisible: false });
    }
    if (propertyName == "footerNote") {
      this.setState({ isFooterNoteVoisible: false });
    }

    instituteDetails = {
      ...instituteDetails,
      [propertyName]: event.target.value
    };
    this.setState({ instituteDetails });
  }

  onGetLogo(event) {
    this.setState({ logoUrl: URL.createObjectURL(event.target.files[0]) });
  }

  onChangeInvoiveDate() {}

  validate() {
    var isValidForm = true;
    let { instituteDetails } = this.state;
    if (instituteDetails.instituteName.length == 0) {
      this.setState({ isInstitutenameVisible: true });
      isValidForm = false;
    }
    if (instituteDetails.address.length == 0) {
      this.setState({ isAddressVisible: true });
      isValidForm = false;
    }
    if (
      instituteDetails.contactNo.length == 0 ||
      instituteDetails.contactNo.length != 10
    ) {
      this.setState({ isContactNoVisible: true });
      isValidForm = false;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      instituteDetails.email.length == 0 ||
      !instituteDetails.email.match(mailformat)
    ) {
      this.setState({ isEmailVisible: true });
      isValidForm = false;
    }
    if (instituteDetails.panNo.length == 0) {
      this.setState({ isPanNoVisible: true });
      isValidForm = false;
    }
    if (instituteDetails.otherTax.length == 0) {
      this.setState({ isOtherTaxVisible: true });
      isValidForm = false;
    }
    if (instituteDetails.footerNote.length == 0) {
      this.setState({ isFooterNoteVoisible: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  gotoNextPage() {
    if (this.state.fin_financial_information_id == "") {
      const isValidForm = this.validate();
      if (!isValidForm) {
        return;
      } else {
        let apiData = {
          payload: {
            institute_name: this.state.instituteDetails.instituteName,
            address: this.state.instituteDetails.address,
            contact_no: this.state.instituteDetails.contactNo,
            email: this.state.instituteDetails.email,
            pan_no: this.state.instituteDetails.panNo,
            other_tax: this.state.instituteDetails.otherTax,
            logo_url: this.state.logoUrl,
            invoice_footer_text: this.state.instituteDetails.footerNote,
            gstin_no: "",
            cin_no: ""
          },
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token
        };
        this.props.createFinanceInstituteDetails(apiData).then(() => {
          let res = this.props.createFinanceInstDetail;

          if (res && res.data.status == 200) {
            this.setState(
              {
                fin_financial_information_id:
                  res.data.response.fin_financial_information_id
              },
              () => {
                let data = {
                  payload: {
                    uploadType: "logo",
                    id: this.state.fin_financial_information_id
                  }
                };
                this.props.uploadInvoicePrint(data).then(() => {
                  let res = this.props.invoiceReceiptPrint;
                  if (res && res.data.status == 200) {
                    this.props.history.push({
                      pathname: "/app/finance-paymentmethodconfig"
                    });
                  }
                });
              }
            );
          }
        });
      }
    } else {
      this.props.history.push({
        pathname: "/app/finance-paymentmethodconfig"
      });
    }
  }

  renderGetFinanceDetail() {
    return (
      <div className="row margin25-bottom">
        <div className="col-md-4">
          <span className="c-heading-sm card--title">
            STANDARD FEE TEMPLATES (7)
          </span>
          <div className="clearfix">
            <div className="form-group cust-fld">
              <label>
                Institute Name (as on invoices)
                <sup>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Institute Name"
                value={this.state.instituteName}
                readOnly
              />
            </div>
            <div className="form-group cust-fld">
              <label>
                Address
                <sup>*</sup>
              </label>
              <textarea
                className="form-control"
                placeholder="Address"
                value={this.state.address}
                readOnly
              />
            </div>
            <div className="form-group cust-fld">
              <label>
                Contact No.
                <sup>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Contact No."
                value={this.state.contactNo}
                readOnly
              />
            </div>
            <div className="form-group cust-fld">
              <label>
                Email <sup>*</sup>{" "}
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={this.state.email}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <span className="c-heading-sm card--title">TAX INFORMATION</span>
          <div className="clearfix">
            <div className="form-group cust-fld">
              <label>GST No. (If applicable)</label>
              <input
                type="text"
                className="form-control"
                placeholder="GST"
                value={this.state.gstNo}
                readOnly
              />
            </div>
            <div className="form-group cust-fld">
              <label>
                PAN <sup>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="PAN"
                value={this.state.panNo}
                readOnly
              />
            </div>

            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>GST %</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="GST"
                    readOnly
                  />
                </div>
              </div>
              <div className="divider-block text--right">
                <div className="form-group cust-fld">
                  <label>
                    Other Tax <sup>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="TAX"
                    value={this.state.otherTax}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="divider-container nomargin">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>SGST %</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="SGST"
                    value={this.state.SGST}
                    readOnly
                  />
                </div>
              </div>
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>IGST %</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="IGST"
                    value={this.state.IGST}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="c-heading-sm text-lowercase coloured">
              Tax amount(s) will be added to your invoice.
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <span className="c-heading-sm card--title">
            INFORMATION ON INVOICE
          </span>
          <div className="clearfix">
            <div className="form-group cust-fld">
              <label>
                Logo <sup>*</sup>
              </label>
              <input
                type="file"
                className="form-control"
                placeholder="jpeg / png (upto 2mb)"
              />
            </div>
            <div className="form-group cust-fld">
              <label>
                Invoice Footer Note <sup>*</sup>
              </label>
              <textarea
                className="form-control"
                placeholder="Note to be written on invoice footer"
                value={this.state.footerNote}
                readOnly
              />
            </div>
            {/* <div className="form-group cust-fld">
              <label>Invoice Due in</label>
              <input
                type="text"
                className="form-control"
                placeholder="Invoice Due in"
              />
            </div> */}
            {/* <button className="c-btn-bordered">View Sample Invoice </button> */}
          </div>
        </div>
      </div>
    );
  }

  renderCreateFinance() {
    return (
      <div className="row margin25-bottom">
        <div className="col-md-4">
          <span className="c-heading-sm card--title">
            STANDARD FEE TEMPLATES (7)
          </span>
          <div className="clearfix">
            <div className="form-group cust-fld">
              <label>
                Institute Name (as on invoices)
                <sup>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Institute Name"
                value={this.state.instituteName}
                onChange={this.inputChange.bind(this, "instituteName")}
              />
              {this.state.isInstitutenameVisible ? (
                <label className="help-block" style={{ color: "red" }}>
                  Please enter institute name{" "}
                </label>
              ) : (
                <br />
              )}
            </div>
            <div className="form-group cust-fld">
              <label>
                Address
                <sup>*</sup>
              </label>
              <textarea
                className="form-control"
                placeholder="Address"
                value={this.state.address}
                onChange={this.inputChange.bind(this, "address")}
              />
              {this.state.isAddressVisible ? (
                <label className="help-block" style={{ color: "red" }}>
                  Please enter address{" "}
                </label>
              ) : (
                <br />
              )}
            </div>
            <div className="form-group cust-fld">
              <label>
                Contact No.
                <sup>*</sup>
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="Contact No."
                value={this.state.contactNo}
                onChange={this.inputChange.bind(this, "contactNo")}
              />
              {this.state.isContactNoVisible ? (
                <label className="help-block" style={{ color: "red" }}>
                  Please enter valid contact no{" "}
                </label>
              ) : (
                <br />
              )}
            </div>
            <div className="form-group cust-fld">
              <label>
                Email <sup>*</sup>{" "}
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={this.state.email}
                onChange={this.inputChange.bind(this, "email")}
              />
              {this.state.isEmailVisible ? (
                <label className="help-block" style={{ color: "red" }}>
                  Please enter valid first name{" "}
                </label>
              ) : (
                <br />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <span className="c-heading-sm card--title">TAX INFORMATION</span>
          <div className="clearfix">
            <div className="form-group cust-fld">
              <label>GST No. (If applicable)</label>
              <input
                type="text"
                className="form-control"
                placeholder="GST"
                value={this.state.gstNo}
                onChange={this.inputChange.bind(this, "gstNo")}
              />
            </div>
            <div className="form-group cust-fld">
              <label>
                PAN <sup>*</sup>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="PAN"
                value={this.state.panNo}
                onChange={this.inputChange.bind(this, "panNo")}
              />
              {this.state.isPanNoVisible ? (
                <label className="help-block" style={{ color: "red" }}>
                  Please enter valid pan no{" "}
                </label>
              ) : (
                <br />
              )}
            </div>

            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>GST %</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="GST"
                    value={this.state.gstValue}
                    onChange={this.inputChange.bind(this, "gstValue")}
                  />
                </div>
              </div>
              <div className="divider-block text--left">
                <div
                  className="form-group cust-fld"
                  style={{ marginTop: "36px" }}
                >
                  <label>
                    Other Tax <sup>*</sup>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="TAX"
                    value={this.state.otherTax}
                    onChange={this.inputChange.bind(this, "otherTax")}
                  />
                  {this.state.isOtherTaxVisible ? (
                    <label className="help-block" style={{ color: "red" }}>
                      Please enter other tax{" "}
                    </label>
                  ) : (
                    <br />
                  )}
                </div>
              </div>
            </div>

            <div className="divider-container nomargin">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>SGST %</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="SGST"
                    value={this.state.SGST}
                    onChange={this.inputChange.bind(this, "SGST")}
                  />
                </div>
              </div>
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>IGST %</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="IGST"
                    value={this.state.IGST}
                    onChange={this.inputChange.bind(this, "IGST")}
                  />
                </div>
              </div>
            </div>

            <div className="c-heading-sm text-lowercase coloured">
              Tax amount(s) will be added to your invoice.
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <span className="c-heading-sm card--title">
            INFORMATION ON INVOICE
          </span>
          <div className="clearfix">
            <div className="form-group cust-fld">
              <label>Logo</label>
              <input
                type="file"
                className="form-control"
                placeholder="jpeg / png (upto 2mb)"
                onChange={this.onGetLogo.bind(this)}
              />
            </div>
            <div className="form-group cust-fld">
              <label>
                Invoice Footer Note <sup>*</sup>
              </label>
              <textarea
                className="form-control"
                placeholder="Note to be written on invoice footer"
                value={this.state.footerNote}
                onChange={this.inputChange.bind(this, "footerNote")}
              />
              {this.state.isFooterNoteVoisible ? (
                <label className="help-block" style={{ color: "red" }}>
                  Please enter invoice footer note{" "}
                </label>
              ) : (
                <br />
              )}
            </div>
            {/* <div className="form-group cust-fld">
              <label>Invoice Due in</label>
              
              <DatePicker
                className="form-control fld--date"
                selected={this.state.invoiceDate}
                onChange={this.onChangeInvoiveDate.bind(this)}
              />
            </div> */}
            {/* <button className="c-btn-bordered">View Sample Invoice </button> */}
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
              {this.state.fin_financial_information_id == ""
                ? this.renderCreateFinance()
                : this.renderGetFinanceDetail()}
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
                    onClick={this.gotoNextPage.bind(this)}
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

const mapStateToProps = ({ app, finance, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  financeInstituteDetail: finance.financeInstituteDetail,
  createFinanceInstDetail: finance.createFinanceInstDetail
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFinanceInstituteDetails,
      createFinanceInstituteDetails
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceInforamtion);
