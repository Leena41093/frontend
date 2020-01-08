import React, { Component } from 'react';
import { NewFeeStructureModal } from '../common/newFeeStructureModal';
import { EditFinanceModel } from '../common/editFinanceModel';

export class FinanceModel extends Component {

    constructor(props) {
        super(props);

        this.state = {

            financeArray: [],
            finance_name: 'Select Finance Name',
            finance_template_id: '',
            templateInfo: {},
            installmentInfo: [],

        }
    }

    componentWillReceiveProps(props) {
        this.setState({ financeArray: props.financeArr })
    }

    componentDidMount() {
    }

    onSelectFinance(finance) {
        let data = {
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token,
            finance_template_id: finance.finance_template_id
        }

        this.props.getEditFinanceData(data).then(() => {
            let res = this.props.getFinanceeditData;

            if (res && res.status == 200) {
                this.setState({
                    templateInfo: res.response.templateInfo,
                    installmentInfo: res.response.installmentInfo,
                    finance_name: finance.name,
                    finance_template_id: finance.finance_template_id,
                })
            }
        })
    }

    clearData() {
        this.setState({ finance_name: "Select Finance Name" })
    }

    renderFinanceList() {
        if (this.state.financeArray && this.state.financeArray.length > 0) {
            return this.state.financeArray.map((finance, index) => {
                return (
                    <li key={"key" + index}>
                        <a onClick={this.onSelectFinance.bind(this, finance)} className="dd-option">{finance.name}</a>
                    </li>
                )
            })
        }
    }

    render() {
        return (
            <div className="modal fade custom-modal-sm" id="finance" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                            <h4 className="c-heading-sm card--title">Finance</h4>
                        </div>
                        <div className="modal-body">
                            {/* <div className="cust-m-info">All students from the selected batch will be added. You can add/delete any students in the list.</div> */}
                            <div className="clearfix margin25-bottom">
                                <div className="form-group cust-fld">
                                    <label>Finance</label>
                                    <div className="dropdown">
                                        <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >

                                            {this.state.finance_name}
                                        </button>
                                        <ul style={{ height: "100px", overflow: "auto", marginTop: "-7%" }} className="dropdown-menu" aria-labelledby="dLabel">
                                            {this.renderFinanceList()}
                                        </ul>
                                        {this.state.isSubjectnameSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Finance Structure</label> : <br />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="divider-container nomargin">
                                <div className="divider-block">
                                    <button className="c-btn-large grayshade" data-dismiss="modal">Cancel</button>
                                </div>
                                <div className="divider-block">
                                    {this.state.finance_name == 'Select Finance Name' ?
                                        <button data-toggle="modal" data-target="#feestructuremodel" className="c-btn-large primary">Create</button> :
                                        <button data-toggle="modal" data-target="#editfeestructuremodel" onClick={this.clearData.bind(this)} className="c-btn-large primary">Update</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                < NewFeeStructureModal {...this.props} />
                <EditFinanceModel templateInfo={this.state.templateInfo} installmentInfo={this.state.installmentInfo} {...this.props} />
            </div>
        )
    }
}

export default (FinanceModel)