import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from "jquery";
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { getProjectList } from '../../actions/inventoryAdminAction';
import { ToastContainer, toast } from 'react-toastify';
var dt = require('datatables.net')
let table = '0';

class ProjectDirectory extends Component {
  constructor(props) {

    super(props);
    this.state = {
      projectDetails: [],
      searchText: '',
      count: 0,
    }
  }

  componentDidMount() {
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
            return rowhtml = `<button class="link--btn" id="view">View Profile</button>`
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
      if (projectList && projectList.length > 0) {
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

const mapStateToProps = ({  auth}) => ({
  token: auth.token,
  companyId:auth.companyId,
  BranchId:auth.AdminbranchId,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDirectory)


