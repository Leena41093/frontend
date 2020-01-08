import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class FinanceFeeStructureSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  gotoNextPage() {
    this.props.history.push({ pathname: "/app/create-financefee" })
  }

  render() {
    return (<div className="c-container dark clearfix">

      <div className="clearfix">
        <div className="divider-container">
          <div className="divider-block text--left">
            <span className="c-heading-lg margin10-bottom">Setup your Finances</span>
          </div>
        </div>
      </div>


      <div className="clearfix">
        <div className="divider-container c-formWizard">

          <div className="divider-block text--center st-active">
            <div className="lineContainer">
              <div className="circle"></div>
              <div className="line"></div>
            </div>
            <div className="titleContainer">SELECT FEE STRUCTURE</div>
          </div>

          <div className="divider-block text--center">
            <div className="lineContainer">
              <div className="circle"></div>
              <div className="line"></div>
            </div>
            <div className="titleContainer">CREATE FEE TEMLPATES</div>
          </div>

          <div className="divider-block text--center">
            <div className="lineContainer">
              <div className="circle"></div>
              <div className="line"></div>
            </div>
            <div className="titleContainer">ENTER FINANCIAL INFORMATION</div>
          </div>

          <div className="divider-block text--center">
            <div className="lineContainer">
              <div className="circle"></div>
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
                <div className="clearfix text-center margin25-bottom">
                  <span className="c-heading-sm lg text-lowercase coloured card--title">Fee Structure for your institute.</span>
                  {/* <span className="c-heading-sm text-lowercase">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span> */}
                </div>
              </div>
            </div>

            <div className="row margin25-bottom">
              <div className="col-md-8 col-md-offset-2">
                <div className="row c-financeContainer margin25-bottom">

                  {/* <div className="col-md-5 nopad">
                                        <div className="financeCard">
                                            <div className="image"><img src="../images/analytics.png" /></div>
                                            <div className="title">Standard</div>
                                            <div className="staticText">
                                                Create your own fee template Assign a template to student
													</div>
                                            <div className="clearfix">
                                                <button className="btnSelect" />
                                            </div>
                                        </div>
                                    </div> */}

                  {/* <div className="col-md-2 nopad">
                                        <span className="midText">OR</span>
                                    </div> */}

                  <div className="col-md-5 nopad" style={{ marginLeft: "190px" }}>
                    <div className="financeCard st-selected">
                      <div className="image"><img src="../images/calculator.png" /></div>
                      <div className="title">Advanced</div>
                      <div className="staticText">
                        Assign fees to your className
                        Automate fee structure according to className, subject & batches
                        Generate invoices directly
														</div>
                      <div className="clearfix">
                        <button className="btnSelect" />
                      </div>
                    </div>
                  </div>

                </div>
                <span className="static-text sm text-center">Contact CleverGround team if you have any questions.</span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 text-right">
                <button className="c-btn md" onClick={this.gotoNextPage.bind(this)}>Next</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(FinanceFeeStructureSelection)

