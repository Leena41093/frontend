import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from "jquery";
import { bindActionCreators } from 'redux';
import { getEmployeeList } from '../../actions/inventoryAdminAction';
import { ToastContainer, toast } from 'react-toastify';
let table = '0';

class FacultyDirectory extends Component {
  constructor(props) {

    super(props);
    this.state = {
      EmployeeList: [],
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
            let rowData = row[6];
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
      _.onChangePage(data[6]);
    });

    var _ = this;
    $('#EmployeeList tbody').on('click', '#invite', function () {
      var data = table.api().row($(this).parents('tr')).data();

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
      companyId: this.props.companyId,
      branch_id: this.props.BranchId,
      payload: {
        "searchText": this.state.searchText,
        "record_per_page": data.length,
        "page_number": data.start / data.length + 1,
        "order_column": "created_at",
        "order_type": order_type
      }
    }

    getEmployeeList(empdata).then(res => {
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {
    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
      this.setState({ count: res.data.response.employeeDetails ? res.data.response.employeeDetails.length > 0 ? res.data.response.totalCount : 0 : 0 })
      let employeeList = res.data.response.employeeDetails;
      if (employeeList && employeeList.length > 0) {
        employeeList.map((data, index) => {
          var arr = []
          let name = data.emp_name;
          arr[0] = name;
          arr[1] = data.designation;
          arr[2] = data.DOB;
          arr[3] = data.email;
          arr[4] = data.address;
          arr[5] = data.emp_id;
          arr[6] = data;
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
      pathname: 'faculty-detail',
      state: { data: data }
    })
  }

  onEditProfessor(event) {
    var flag = true
    this.props.history.push({
      pathname: '/app/new-faculty',
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
              <span className="c-heading-lg">Employee Manager</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" onClick={this.onEditProfessor.bind(this)}  >Add New Employee</button>
            </div>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="form-group cust-fld">
                <label>Search Employee</label>
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
                    <th style={{ width: "15%" }}>Name</th>
                    <th style={{ width: "12%" }}>Designation</th>
                    <th style={{ width: "15%" }}>DOB</th>
                    <th style={{ width: "18%" }}>Email</th>
                    <th style={{ width: "15%" }}>Address</th>
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

const mapStateToProps = ({ auth }) => ({
  companyId: auth.companyId,
  BranchId: auth.AdminbranchId,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(FacultyDirectory)


