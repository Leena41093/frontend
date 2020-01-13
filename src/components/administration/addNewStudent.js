
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addAccessories } from '../../actions/inventoryAdminAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';


class StudentDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Employee: {
                employeeDetail: {
                    "username": "",
                    "user_type": "",
                    "password": "",
                    "token": "",
                    "emp_name": "",
                    "email": "",
                    "designation": "",
                    "address": "",
                    "role": "",
                    "DOB": moment(),
                }
            },
            isError: {
                "accessory_type": false,
                "version_name": false,
                "memory_size": false,
                "accessory_name": false
            },
            role: ["CEO", "Manager", "Employee", "HR"],
            user_type: ["ADMIN", "EMPLOYEE"],
            designation: ["SoftwareDeveloper", "HR", "Senior softwareDeveloper", "Traine Engineer", "Tester"],
            accessoryType: ["LAPTOP", "MOBILE", "CHARGER", "CABLE", "MOUSE"],
            editable: true,
            pro: {},
            Accessories: {
                AccessoreDetail: {
                    "accessory_type": "",
                    "version_name": "",
                    "memory_size": "",
                    "accessory_name": ""
                }
            }
        }
    }

    onPersonalDetailChange(propertyName, event) {
        let { Accessories, isError } = this.state;
        isError = { ...isError, [propertyName]: false }
        Accessories.AccessoreDetail = { ...Accessories.AccessoreDetail, [propertyName]: event.target.value }
        this.setState({ isError, Accessories })
    }

    handleChangeDesignation(value, propertyName) {
        let { Accessories } = this.state;
        Accessories.AccessoreDetail = { ...Accessories.AccessoreDetail, [propertyName]: value }
        this.setState({ Accessories })
    }

    onSaveEmployee() {
        let { Accessories } = this.state;
        let data = {
            company_id: this.props.company_id,
            branch_id: this.props.branch_id,
            payload: Accessories.AccessoreDetail
        }
        this.props.addAccessories(data).then(() => {
            let res = this.props.addAccessorie;
            if(res && res.data.status == 200){
                this.props.history.push('/app/student-directory')
            }
            
        })
    }

    backButton() {
        this.props.history.push('/app/student-directory')
    }

    renderPersonalDetails() {
        let { Accessories, isError } = this.state;
        if (this.state.editable) {
            return (
                <div className="clearfix">
                    <div className="c-card__form" style={{ overflow: "auto", height: "355px" }} >
                        <div >
                            <div className="divider-container" >
                                <div className="divider-block text--left">
                                    <div className="form-group cust-fld">
                                        <label>Version Name<sup style={{ color: "red" }}>*</sup></label>
                                        <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Accessories.AccessoreDetail.version_name} onChange={this.onPersonalDetailChange.bind(this, "version_name")} placeholder="Please Enter version Name" />
                                        {isError.version_name ? <label className="help-block" style={{ color: "red" }}>Please enter valid version_name </label> : <br />}
                                    </div>
                                    <div className="form-group cust-fld">
                                        <label>Memory Size<sup style={{ color: "red" }}>*</sup></label>
                                        <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Accessories.AccessoreDetail.memory_size} onChange={this.onPersonalDetailChange.bind(this, "memory_size")} placeholder="Please Enter memory_size" />
                                        {isError.memory_size ? <label className="help-block" style={{ color: "red" }}>Please enter valid memory_size </label> : <br />}
                                    </div>
                                    <div className="form-group cust-fld">
                                        <label>Accessory Name<sup style={{ color: "red" }}>*</sup></label>
                                        <input type="text" className="form-control" style={{ width: this.state.professor || (this.state.admin && this.state.professor) ? "" : "60%" }} value={this.state.Accessories.AccessoreDetail.accessory_name} onChange={this.onPersonalDetailChange.bind(this, "accessory_name")} placeholder="Please Enter email" />
                                        {isError.accessory_name ? <label className="help-block" style={{ color: "red" }}>Please enter valid accessory_name</label> : <br />}
                                    </div>

                                    <div className="form-group cust-fld">
                                        <label>AccessoryType</label>
                                        <div class="dropdown">
                                            <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                {Accessories.AccessoreDetail.accessory_type}
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dLabel">
                                                {this.renderusertype()}
                                            </ul>
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


    renderusertype() {
        let { accessoryType } = this.state;
        return accessoryType.map((value, index) => {
            return (
                <li key={"user_type" + index}><a onClick={this.handleChangeDesignation.bind(this, value, "accessory_type")} href="javascript:void(0);" class="dd-option">{value}</a></li>
            )
        })
    }

    render() {
        return (
            <div className="c-container clearfix">
                <ToastContainer />
                <div className="clearfix">
                    <div className="c-brdcrum">
                        <a onClick={this.backButton.bind(this)} >Back to Accessories Directory</a>
                    </div>
                    <div className="divider-container">
                        <div className="divider-block text--left">
                            <span className="c-heading-lg nomargin">Accessories Details</span>
                        </div>
                    </div>
                </div>
                <div className="clearfix">
                    <div className="divider-container">
                        <div class="divider-block text--right">
                            <button class="c-btn grayshade" onClick={this.backButton.bind(this)}>Back</button>
                        </div>
                    </div>
                </div>
                <div className="c-container__data">
                    <div className="card-container">
                        <div className="c-card">
                            <div className="c-card__title">
                                <span className="c-heading-sm card--title">
                                    PERSONAL DETAILS
                </span>
                            </div>
                            {this.renderPersonalDetails()}
                            <div className="c-card__btnCont">
                                <div className="c-actiontd st-alert"><button style={{ color: "white" }} className="c-btn-large primary btn" onClick={this.onSaveEmployee.bind(this)} >&nbsp;&nbsp;ADD ACCESSORIES</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ app, auth, inventoryAdmin }) => ({
    addAccessorie: inventoryAdmin.addAccessorie,
    company_id: app.companyId,
    branch_id: app.AdminbranchId
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            addAccessories
        },
        dispatch
    )

export default connect(mapStateToProps, mapDispatchToProps)(StudentDetail)
