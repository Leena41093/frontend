import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { getInventoryComplaints,updateComplaints } from '../../actions/inventoryAdminAction';
import { errorToste, successToste } from '../../constant/util';
import { bindActionCreators } from 'redux';
import {ComplaintsModel} from '../professor/complaintsModel'
import $ from "jquery";

let table = '0';

class ComplaintsDirectory extends Component {
  constructor(props) {

    super(props);
    this.state = {
      count: 0,
      searchText: '',
      complaintsData:{}
    }
  }

  componentDidMount() {
    this.initializeDatatable();
  }

  initializeDatatable() {

    table = $("#accessoriesList").dataTable({
      "ajax": (data, callback, settings) => {
        this.callNewDataList(data, callback, settings);
        callback(
          {
            recordsTotal: this.state.count,
            recordsFiltered: this.state.count,
            data: []
          }
        );
      },
      "columnDefs": [{
        "targets": -1,
        "data": null,
        targets: [4],
        "render": (data, type, row) => {
          let rowhtml;
            return rowhtml = `<button class="link--btn" id="view">View Complaint</button>`
        }
      }, { orderable: false, targets: [4] },

     {
        targets: [1],
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
    $('#accessoriesList tbody').on('click', '#view', function () {

      var data = table.api().row($(this).parents('tr')).data();

      _.onViewComplaint(data[4]);
    });

  }

  callNewDataList(data, callback, settings) {
    

    let order_type;
    if (data.order[0].dir === "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }
    const { searchText } = this.state;
    
    let Data={
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      payload:{
      "searchText": "",
      "record_per_page":10,
      "page_number": 1,
      "order_column":"created_at",
      "order_type": 0
    }
    }
    getInventoryComplaints(Data).then(res=>{
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {

    if (res && res.data.status == 200) {
      var columnData = [];
      this.setState({ count: res.data.response.totalCount })
      let employeeList = res.data.response.employeeDetails;
      if (employeeList && employeeList.length > 0) {
        employeeList.map((data, index) => {
          var arr = [];
          arr[0] = data.emp_id;
          arr[1] = data.emp_name;
          arr[2] = data.emp_email;
          arr[3] = data.status;
          arr[4] = data;
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

  onViewComplaint(data) {
   this.setState({complaintsData:data},()=>{
      $("#complaintModel").click();
   })
  }

  onNewStudent(event) {
    var flag = true
    this.props.history.push({
      pathname: '/app/new-student',
    })
  }

  render() {
    return (
      <div>
        <div className="c-container clearfix" style={{ marginBottom: "100px" }}>
        <button className="c-btn-white" data-toggle="modal" data-target="#viewModel" id="complaintModel" hidden></button>
          <ToastContainer />
          <div className="clearfix">
            <div className="divider-container">
              <div className="divider-block text--left  test">
                <span className="c-heading-sm">Administration</span>
                <span className="c-heading-lg">Complaints Directory</span>
              </div>
              {/* <div className="divider-block text--right">
                <button className="c-btn prime" onClick={this.onNewStudent.bind(this)} >Add New Accessories</button>
              </div> */}
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                {/* <div className="form-group cust-fld">
                  <label>Search complaints</label>
                  {/* <input type="search" className="form-control" value={this.state.searchText} onChange={this.serachStudent.bind(this)} placeholder="Enter Accessories Name" /> */}
                {/* </div> */}
              </div>
              <div className="divider-block text--right">
              </div>
            </div>
          </div>

          <div className=" no-round">
           
            <div className="card-container for--table">
              <div className="c-table">
                <table id="accessoriesList" className="table data--table">
                  <thead>
                    <tr>
                    <th style={{ width: "10%" }}>Employee Id</th>
                      <th style={{ width: "11%" }}>Employee Name</th>
                      <th style={{ width: "21%" }}>Email</th>
                      <th style={{ width: "15%" }}>Status</th>
                      <th style={{ width: "13%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      <ComplaintsModel complaintsData={this.state.complaintsData}  {...this.props}/>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth,inventoryAdmin }) => ({
  company_id: app.companyId,
  branch_id: app.AdminbranchId,
  updateComplaintsdatas : inventoryAdmin.updateComplaintData
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getInventoryComplaints,
      updateComplaints
      
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintsDirectory)
