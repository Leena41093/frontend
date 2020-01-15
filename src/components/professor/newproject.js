import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import { successToste, errorToste, infoToste } from "../../constant/util";
import { addProjectData } from "../../actions/inventoryAdminAction";
class NewProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {
        projectDetail: {
          project_name: "",
          client_name: "",
          start_date: moment(),
          end_date: moment(),
          no_employee: ""
        },
        employeeDetails: []
      },
      editable: true,
      isProjectNameVisible: false,
      isPhoneNumberVisible: false,
      isEmailVisible: false,
      isCollegeVisible: false,
      isDOBVisible: false,
      isECNVisible: false,
      isECVisible: false,
      isNewProfessor: false,
      isRoleSelected: false,
      isEmergencyContactVisible: false,
      startDate: moment(),
      isClientNameVisible: false,
      invitationRes: false,
      disableAddBatchButton: true,
      isGenderSelected: false,
     
    };
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId });
  }

  validate() {
    let projectDetail = this.state.project.projectDetail;
    var isValidForm = true;
    var regx = /^[a-zA-Z ]+$/;
    if (
      projectDetail.project_name.length == 0 ||
      !projectDetail.project_name.match(regx)
    ) {
      this.setState({ isProjectNameVisible: true });
      isValidForm = false;
    }
    if (
      projectDetail.client_name.length == 0 ||
      !projectDetail.client_name.match(regx)
    ) {
      this.setState({ isClientNameVisible: true });
      isValidForm = false;
    }
    return isValidForm;
  }

  onPersonalDetailChange(propertyName, event) {
    if (propertyName == "project_name") {
      this.setState({ isProjectNameVisible: false });
    }
    if (propertyName == "client_name") {
      this.setState({ isClientNameVisible: false });
    }
    let project = this.state.project;
    let projectDetail = project.projectDetail;
    projectDetail = { ...projectDetail, [propertyName]: event.target.value };
    project = { ...project, projectDetail };
    this.setState({ project });
  }

  onSaveChanges() {
    let self = this;
    let { project } = this.state;
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    } else {
      let data = {
        payload: {
          project_name: project.projectDetail.project_name,
          client_name: project.projectDetail.client_name,
          start_date: project.projectDetail.start_date,
          end_date: project.projectDetail.end_date,
          team_size: 0,
          empData: []
        },
        company_id: this.props.company_id,
        branch_id: this.props.branch_id
      };

      this.props.addProjectData(data).then(() => {
        let res = this.props.addprojectdata;

        if (res) {
          successToste("project created Sucessfully");
          this.props.history.push("/app/projects-directory");
        }
      });
    }
  }

  backButton() {
    this.props.history.push("/app/projects-directory");
  }

  handleChange(type, date) {
    let project = this.state.project;
    let projectDetail = project.projectDetail;
    if (type == "start_date") {
      projectDetail = { ...projectDetail, start_date: moment(date) };
    } else if (type == "end_date") {
      projectDetail = { ...projectDetail, end_date: moment(date) };
    }
    project = { ...project, projectDetail };
    this.setState({ project });
  }

  renderPersonalDetails() {
    if (this.state.editable) {
      return (
        <div className="clearfix">
          <div
            className="c-card__form"
            style={{ overflow: "auto", height: "355px" }}
          >
            <div>
              <div className="divider-container">
                <div className="divider-block text--left">
                  <div className="form-group cust-fld">
                    <label>
                      Project Name
                      <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.project.projectDetail.project_name}
                      onChange={this.onPersonalDetailChange.bind(
                        this,
                        "project_name"
                      )}
                      placeholder="Please Enter First Name"
                    />
                    {this.state.isProjectNameVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please enter valid project name{" "}
                      </label>
                    ) : (
                      <br />
                    )}
                  </div>
                  <div className="form-group cust-fld">
                    <label>
                      Client Name
                      <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.project.projectDetail.client_name}
                      onChange={this.onPersonalDetailChange.bind(
                        this,
                        "client_name"
                      )}
                      placeholder="Please Enter Last Name"
                    />
                    {this.state.isClientNameVisible ? (
                      <label className="help-block" style={{ color: "red" }}>
                        Please enter valid client name{" "}
                      </label>
                    ) : (
                      <br />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group cust-fld">
                <label>Start Date</label>
                <DatePicker
                  className="form-control"
                  selected={
                    this.state.project.projectDetail.start_date
                      ? moment(this.state.project.projectDetail.start_date)
                      : moment()
                  }
                  onChange={this.handleChange.bind(this, "start_date")}
                />
              </div>
              <div className="form-group cust-fld">
                <label>End Date</label>
                <DatePicker
                  className="form-control"
                  selected={
                    this.state.project.projectDetail.end_date
                      ? moment(this.state.project.projectDetail.end_date)
                      : moment()
                  }
                  onChange={this.handleChange.bind(this, "end_date")}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="c-brdcrum">
            <a onClick={this.backButton.bind(this)}>
              Back to Project Directory
            </a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg nomargin">Add New Project</span>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="divider-container">
            
            <div class="divider-block text--right">
              <button
                class="c-btn grayshade"
                onClick={this.backButton.bind(this)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <div className="c-container__data">
          <div className="card-container">
            <div className="c-card">
              <div className="c-card__title">
                <span className="c-heading-sm card--title">
                  PROJECT DETAILS
                </span>
              </div>
              {this.renderPersonalDetails()}
              <div className="c-card__btnCont">
                <div className="c-actiontd st-alert">
                  <button
                    style={{ color: "white" }}
                    className="c-btn-large primary btn"
                    onClick={this.onSaveChanges.bind(this)}
                  >
                    Add Project
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

const mapStateToProps = ({ app, auth, inventoryAdmin }) => ({
  addprojectdata: inventoryAdmin.addprojectdata,
  company_id: app.companyId,
  branch_id: app.AdminbranchId
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addProjectData
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewProjectDetail);
