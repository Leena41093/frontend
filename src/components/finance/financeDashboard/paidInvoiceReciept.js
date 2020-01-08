import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class PaidInvoiceReciept extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="c-container dark clearfix">

                <div className="clearfix">
                    <div className="divider-container">
                        <div className="divider-block text--left">
                            <span className="c-heading-lg margin10-bottom">Invoice No. 123213</span>
                        </div>
                        <div className="divider-block text--right">
                            <button className="c-btn">Download Receipt</button>
                        </div>
                    </div>
                </div>


                <div className="clearfix" id="printable">
                    <div className="row">

                        <div className="col-md-10">

                            <div className="c-invoiceContainer">

                                <div className="invoiceHeader">

                                    <div className="row margin25-bottom">
                                        <div className="col-md-5">

                                            <div className="clearfix">
                                                <div className="divider-container custom nomargin">
                                                    <div className="divider-block text--left sect-1">
                                                        <img src="../images/invoiceImage.png" alt="" />
                                                    </div>
                                                    <div className="divider-block text--left sect-2">
                                                        <div className="invoiceDtls_header">Success Institute</div>
                                                        <div className="invoiceDtls_info">
                                                            <p>1234 Main Street, Pune, Maharashtra, India - 411001</p>
                                                            <p>GSTIN : 12332423423423</p>
                                                            <p>PAN : 123123211</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="col-md-2 paidInvoiceImage">
                                            <img src="../images/paidImage.png" className="img-responsive" />
                                        </div>

                                        <div className="col-md-5">
                                            <div className="invoiceDtls_list">
                                                <ul>
                                                    <li>
                                                        <span className="key">INVOICE NO.</span>
                                                        <span className="value text-colored text-bold font-18">123232</span>
                                                    </li>
                                                    <li>
                                                        <span className="key">ISSUE DATE</span>
                                                        <span className="value">12 Oct 2019</span>
                                                    </li>
                                                    <li>
                                                        <span className="key">DUE DATE</span>
                                                        <span className="value">12 Oct 2019</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4">
                                            <span className="block-title st-colored noborder nomargin color-dark">For</span>
                                            <div className="invoiceDtls_info">
                                                <p className="text-colored text-bold">Chomkwan Wattana</p>
                                                <p>1234 Main Street, Pune, Maharashtra, India - 411001</p>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <span className="block-title st-colored noborder nomargin color-dark">Subject</span>
                                            <div className="invoiceDtls_info">
                                                <p>11th Standard - 2nd Installment</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="invoiceBody">


                                    <div className="invoiceBody_table">
                                        <table className="table">
                                            <tr>
                                                <th style={{width: "150px"}}>SR.NO.</th>
                                                <th>Description</th>
                                                <th style={{width: "150px"}} className="text-right">Amount</th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <td>Description</td>
                                                <td className="text-right">10,000</td>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <td>Description</td>
                                                <td className="text-right">10,000</td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div className="row">


                                        <div className="col-md-7">


                                            <div className="clearfix infoBox st-accepted">
                                                <span className="infoBox_title">ACCEPTED BY</span>
                                                <div className="invoiceDtls_list type-01">
                                                    <ul>
                                                        <li>
                                                            <span className="key">Name</span>
                                                            <span className="value">Nicolina Lindholm</span>
                                                        </li>
                                                        <li>
                                                            <span className="key">Method</span>
                                                            <span className="value">Bank Transfer</span>
                                                        </li>
                                                        <li>
                                                            <span className="key">Date</span>
                                                            <span className="value">15 Oct 2019</span>
                                                        </li>
                                                        <li>
                                                            <span className="key">Attachment</span>
                                                            <span className="value">
                                                                <button className="link--btn">Image</button>
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>


                                            <div className="infoBox">
                                                <span className="infoBox_title">NOTE</span>
                                                <p className="staticInfo">
                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
												</p>
                                            </div>

                                        </div>

                                        <div className="col-md-5">
                                            <div className="clearfix invoiceTotalSect">
                                                <div className="invoiceDtls_list">
                                                    <ul>
                                                        <li>
                                                            <span className="key">Subtotal</span>
                                                            <span className="value">₹ 21,000.00</span>
                                                        </li>
                                                        <li className="bordered">
                                                            <span className="key">Discount (10%)</span>
                                                            <span className="value">₹ 2,100.00</span>
                                                        </li>
                                                        <li>
                                                            <span className="key">Total before Tax</span>
                                                            <span className="value">₹ 18,900.00</span>
                                                        </li>
                                                        <li>
                                                            <span className="key">CGST (9%)</span>
                                                            <span className="value">₹ 900.00</span>
                                                        </li>
                                                        <li className="bordered">
                                                            <span className="key">SGST (9%)</span>
                                                            <span className="value">₹ 900.00</span>
                                                        </li>
                                                        <li className="finalTotal">
                                                            <span className="key">Total</span>
                                                            <span className="value">₹ 20,600.00</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="invoiceFooter">
                                                <span>Powered by </span>
                                                <img src="../images/cg-footerLogo.png" />
                                            </div>
                                        </div>


                                    </div>


                                </div>


                            </div>


                        </div>
                    </div>

                </div>

            </div>
        )
    }
}

const mapStateToProps = ({ }) => ({})
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PaidInvoiceReciept)