import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from "jquery";
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { getProfessorsList, invitationSend, getIsProfessorAdmin, getEmailOfFacultyDirectory } from '../../actions/index';
import { getEmployeeList,getProjectList } from '../../actions/inventoryAdminAction';
import { errorToste, successToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
let table = '0';

class ProjectDirectory extends Component {
  constructor(props) {

    super(props);
    this.state = {
      projectDetails: [],
      searchText: '',
      count: 0,
      branchId: 0,
      instituteId: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {

      if (this.state.instituteId != nextProps.instituteId) {
        this.setState({ instituteId: nextProps.instituteId }, () => {
          var datas = {
            institudeId: this.props.instituteId,
            branchId: this.props.branchId,
            token: this.props.token,
          }
          this.props.getIsProfessorAdmin(datas).then(() => {
            let res = this.props.ProfessorAdmin;
            if (res && res.data.status == 200 && res.data.response.isProfessorAdmin == false) {
              this.props.history.push("/app/dashboard");
            }
            else {
              if (this.state.branchId != nextProps.branchId) {
                this.setState({ branchId: nextProps.branchId }, () => {
                  table.fnDraw()
                });
              }
            }
          })
        })
      }
    }
  }

  componentDidMount() {
    
    this.setState({ instituteId: this.props.instituteId })
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getEmailOfFacultyDirectory(data).then(() => {

    })
    this.initDataTable();
  }

  initDataTable() {
    table = $("#EmployeeList")
      .dataTable({
        "ajax": (data, callback, setting) => {
          this.getProfessors(data, callback, setting);
          callback({
            recordsTotal: this.state.count,
            recordsFiltered: this.state.count,
            data: []
          });
        },
        "columnDefs": [{
          "targets": -1,
          "data": null,
          "defaultContent": `<button class="link--btn" id="view">View Profile</button>`,
          // targets:[6],
          "render": (data, type, row) => {

            let rowhtml;
            let rowData = row[5];
            let title = this.getConditionForButton(rowData);
            if (title) {
              return rowhtml = `<button class="link--btn" id="view">View Profile</button> 
              <button class="link--btn" id="invite" >${title}</button>`;
            } else {
              return rowhtml = `<button class="link--btn" id="view">View Profile</button>`
            }

          }
        }, { orderable: false, targets: [2, 3, 4, 5] },
        {
          targets: [0],
          className: 'c-bold'
        }],
        serverSide: true,
        responsive: true,
        bFilter: false,
        dom: 'frtlip',
        bjQueryUI: true,
        bPaginate: true,
        pagingType: "full_numbers",
      });

    $(".dataTables_length").css('clear', 'none');
    $(".dataTables_length").css('margin-right', '2%');
    $(".dataTables_length").css('margin-top', '4px');
    // $(".dataTables_length").css('margin-left', '20%');

    $(".dataTables_info").css('clear', 'none');
    $(".dataTables_info").css('padding', '0');
    $(".dataTables_info").css('margin-top', '5px');
    // $(".dataTables_info").css('margin-right', '200%');

    var _ = this;
    $('#EmployeeList tbody').on('click', '#view', function () {
      var data = table.api().row($(this).parents('tr')).data();
      _.onChangePage(data[5]);
    });

    var _ = this;
    $('#EmployeeList tbody').on('click', '#invite', function () {
      var data = table.api().row($(this).parents('tr')).data();
      _.onSendInvitation(data[6]);
    });
  }

  getProfessors(data, callback, setting) {
    let order_column
    
    let order_type;
    if (data.order[0].dir == "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }
    let empdata = {
      companyId:this.props.companyId,
      branch_id:this.props.BranchId,
      payload: {
        "searchText": this.state.searchText,
        "record_per_page": data.length,
        "page_number":  data.start / data.length + 1,
        "order_column":  "created_at",
        "order_type": order_type
      }
    }

    getProjectList(empdata).then(res => {
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {
    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
       this.setState({ count: res.data.response.projectDetails ? res.data.response.projectDetails.length > 0 ? res.data.response.totalCount : 0 : 0 })
       let projectList = res.data.response.projectDetails;
      console.log("------------->",res.data.response)
      if (projectList && projectList.length > 0) {
        console.log
        projectList.map((data, index) => {
          var arr = []
          
          arr[0] = data.project_name;
          arr[1] = data.client_name;
          arr[2] = moment(data.start_date).format("DD-MM-YYYY");
          arr[3] = moment(data.end_date).format("DD-MM-YYYY");
          arr[4] = data.team_size;
          arr[5] = data;
          columnData.push(arr);
        })
      }
      callback({
        recordsTotal: this.state.count,
        recordsFiltered: this.state.count,
        data: columnData
      });
    }
    else if (res && res.data.status == 500) {
      this.setState({ count: 0 })
    }
  }

  getConditionForButton(obj) {
    if (obj.is_invite == true && obj.is_register == false) {
      return "Invite Again";
    } else if (obj.is_invite == false && obj.is_register == false) {
      return "Invite";
    } else if (obj.is_invite == true && obj.is_register == true) {
      return false;
    }
  }

  onSendInvitation(data) {
    let payloadType;
    if (data.designation == "INSTITUTE") {
      payloadType = "Institute"
    }
    else if (data.designation == "Professor") {
      payloadType = "Professor"
    }
    let apiData = {
      payload: {
        type: payloadType,
        id: data.professor_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.invitationSend(apiData).then(() => {
      let res = this.props.sendInvitation;
      if (res && res.status == 200) {
        successToste("Invitation Send Successfully");
      }
      else if (res && res.status == 500) {
        errorToste("Something Went Wrong")
      }
    })
  }

  onChangePage(data) {
    this.props.history.push({
      pathname: '/app/project-detail',
      state: { data: data, branchId: this.props.branchId }
    })
  }

  onEditProfessor(event) {
    var flag = true
    this.props.history.push({
      pathname: '/app/new-project',
    })
  }

  serachProfessor(event) {
    this.setState({ searchText: event.target.value }, () => {
      table.fnDraw();
    });
  }

  render() {
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Administration</span>
              <span className="c-heading-lg">Project Management</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" onClick={this.onEditProfessor.bind(this)}  >Add New Project</button>
            </div>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="form-group cust-fld">
                <label>Search Project</label>
                <input type="search" className="form-control" value={this.state.searchText} onChange={this.serachProfessor.bind(this)} placeholder="Enter Employee Name" />
              </div>
            </div>
            <div className="divider-block text--right">
            </div>
          </div>
        </div>

        <div className="c-container__data">
          <div className="card-container for--table">
            <div className="c-table">
              <table id="EmployeeList" className="table data--table">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Project Name</th>
                    <th style={{ width: "12%" }}>Client Name</th>
                    <th style={{ width: "15%" }}>Start Date</th>
                    <th style={{ width: "18%" }}>End Date</th>
                    <th style={{ width: "15%" }}>Team Size</th>
                    <th style={{ width: "13%" }}>Actions</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth}) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  sendInvitation: app.sendInvitation,
  ProfessorAdmin: app.professorAdmin,
  professorEmailChecking: app.professorEmailCheck,
  companyId:app.companyId,
  BranchId:app.AdminbranchId,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      invitationSend, getIsProfessorAdmin, getEmailOfFacultyDirectory
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDirectory)

