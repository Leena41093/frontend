import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { getAccessoriesList,deleteAccessory } from '../../actions/inventoryAdminAction';
import { errorToste, successToste } from '../../constant/util';
import { bindActionCreators } from 'redux';
import $ from "jquery";

let table = '0';

class StudentDirectory extends Component {
  constructor(props) {

    super(props);
    this.state = {
      count: 0,
      searchText: '',
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
            return rowhtml = `<button class="link--btn" id="view">Delete</button>`
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

      _.onChangeStudentDetail(data[4]);
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
      "searchText": searchText,
      "record_per_page": data.length,
      "page_number":data.start / data.length + 1,
      "order_column":"created_at",
      "order_type": order_type
    }
    }
    getAccessoriesList(Data).then(res=>{
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {

    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
      this.setState({ count: res.data.response.totalCount })
      let AccessoriesList = res.data.response.accessoryDetails;
      if (AccessoriesList && AccessoriesList.length > 0) {
        AccessoriesList.map((data, index) => {
          var arr = [];
          arr[0] = data.version_name;
          arr[1] = data.accessory_name;
          arr[2] = data.accessory_type;
          arr[3] = data.memory_size;
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

  onChangeStudentDetail(data) {
    // this.props.history.push({
    //   pathname: 'student-detail',
    //   state: { data: data, branchId: this.props.branchId }
    // })
    let apiData={
      company_id: this.props.company_id,
      branch_id: this.props.branch_id,
      accessory_id:data.accessory_id
    }
    this.props.deleteAccessory(apiData).then(()=>{
      let res = this.props.deleteaccessory;
      if(res && res.status == 200){
        successToste("Delete Accessory Successfully")
        table.fnDraw();
      }
    })
  }

  serachStudent(event) {
    this.setState({ searchText: event.target.value }, () => {
      table.fnDraw();
    });
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
          <ToastContainer />
          <div className="clearfix">
            <div className="divider-container">
              <div className="divider-block text--left  test">
                <span className="c-heading-sm">Administration</span>
                <span className="c-heading-lg">Accessories Directory</span>
              </div>
              <div className="divider-block text--right">
                <button className="c-btn prime" onClick={this.onNewStudent.bind(this)} >Add New Accessories</button>
              </div>
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <div className="form-group cust-fld">
                  <label>Search Accessories</label>
                  <input type="search" className="form-control" value={this.state.searchText} onChange={this.serachStudent.bind(this)} placeholder="Enter Accessories Name" />
                </div>
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
                      <th style={{ width: "11%" }}>version Name</th>
                      <th style={{ width: "21%" }}>Name</th>
                      <th style={{ width: "15%" }}>Type</th>
                      <th style={{ width: "10%" }}>Size</th>
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
      </div>
    )
  }
}

const mapStateToProps = ({ auth,inventoryAdmin }) => ({
  company_id: auth.companyId,
  branch_id: auth.AdminbranchId,
  deleteaccessory :inventoryAdmin.deleteaccessory
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteAccessory
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentDirectory)
