import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FinanceModel } from '../common/financeModel';
import { ToastContainer, toast } from 'react-toastify';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { FinanceListPagination, addFinance, getFinancelist, updateFinance, getEditFinanceData, deleteFinance, getIsProfessorAdmin } from '../../actions/index';
import $ from "jquery";
let table = '0';

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      financeList: [],
      count: 0,
      searchText: '',
      selectedFeeStatusname: 'All',
      statusList: ['All', 'Complete', 'Remaining'],
      branchId: 0,
      financeArray:[],
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps) {
    let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){

    if(this.state.instituteId != nextProps.instituteId){
      this.setState({instituteId:nextProps.instituteId},()=>{
        var datas = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token,
        }
        this.props.getIsProfessorAdmin(datas).then(()=>{
         let res = this.props.ProfessorAdmin;
         if(res && res.data.status == 200 && res.data.response.isProfessorAdmin == false ){
         this.props.history.push("/app/dashboard");
         }
         else{
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
    this.setState({insituteId:this.props.instituteId})
    this.initializeDatatable();
  }

  initializeDatatable() {
    table = $("#financelist").dataTable({
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
        "defaultContent": `<button class="link--btn">View Profile</button>`
      }, { orderable: false, targets: [3, 4, 5, 6] },
      {
        targets: [5],
        "render": (data, type, row) => {
          let rowhtml;
          let className = this.getClassForStatus(row[5]);
          return rowhtml = `<span class="${className}" id="status"  >${row[5]}</span>`;
        }
      },
      {
        targets: [1],
        className: 'c-bold'
      }
      ],
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
    $('#financelist tbody').on('click', 'button', function () {
      var data = table.api().row($(this).parents('tr')).data();
      _.onChangeFinanceDetail(data[6]);
    })
  }

  getClassForStatus(data) {
    let css;
    switch (data) {
      case 'Complete': {
        css = "PASS-OUT"
        break;
      }

    }
    return css;
  }

  callNewDataList(data, callback, settings) {
    let order_column
    if (data.order[0].column === 0) {
      order_column = "roll_no"
    }
    else if (data.order[0].column === 1) {
      order_column = "firstName"
    }
    else if (data.order[0].column === 2) {
      order_column = "class_name"
    }
    else if (data.order[0].column === 3) {
      order_column = "mobile"
    }
    else if (data.order[0].column === 4) {
      order_column = "email"
    }
    else if (data.order[0].column === 5) {
      order_column = "fee_status"
    }

    let order_type;
    if (data.order[0].dir === "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }
    let feeStatus = this.state.selectedFeeStatusname == "All" ? "" : this.state.selectedFeeStatusname;
    const { searchText } = this.state;
    let apiData = {
      payload: {
        "searchText": searchText ? (searchText).trim() : '',
        "order_type": order_type,
        "order_column": order_column,
        "record_per_page": data.length,
        "page_number": data.start / data.length + 1,
        "fee_status": feeStatus
      },
      instituteId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token
    }
    FinanceListPagination(apiData).then(res => {
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {
    if (res && res.data.status == 200 && res.data.response) {

      var columnData = [];
      this.setState({ count: res.data.response.total_count })
      let FinanceList = res.data.response.financeList;

      if (FinanceList && FinanceList.length > 0) {
        FinanceList.map((data, index) => {

          var arr = [];
          let name = data.firstName + " " + data.lastName;
          arr[0] = data.roll_no;
          arr[1] = name;
          arr[2] = data.class_name;
          arr[3] = data.mobile;
          arr[4] = data.email;
          arr[5] = data.fee_status;
          arr[6] = data
          columnData.push(arr);
        })
      }
      callback({
        recordsTotal: this.state.count,
        recordsFiltered: this.state.count,
        data: columnData
      });
    }
    else if(res && res.data.status == 500){
      this.setState({count:0})
    }
  }

  goToFinanceList(){
    
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getFinancelist(data).then(() => {
      let res = this.props.financeList;
      if (res && res.status == 200) {
        this.setState({ financeArray: res.response },()=>{
          
          document.getElementById('goToFinanceList').click();
        })
      }
      else if(res && res.status == 500){
        document.getElementById('goToFinanceList').click();
      }
    })
  }

  onChangeFinanceDetail(data) {
    this.props.history.push({
      pathname: 'finance-detail',
      state: { data: data, branchId: this.props.branchId }
    })
  }

  serachStudent(event) {
    this.setState({ searchText: event.target.value }, () => {
      table.fnDraw();
    });
  }

  onChangeFeeStatus(finance) {
    if (finance == "All") {
      this.setState({ selectedFeeStatusname: "All" }, () => { table.fnDraw(); })
    } else {
      this.setState({ selectedFeeStatusname: finance }, () => {
        table.fnDraw();
      })
    }
  }

  renderFeeStatus() {
    return this.state.statusList.map((finance, index) => {
      return (
        <li key={"finance" + index}><a className="dd-option" onClick={this.onChangeFeeStatus.bind(this, finance)}>{finance}</a></li>
      )
    })
  }

  render() {
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Administration</span>
              <span className="c-heading-lg">Finance</span>
            </div>

            <div className="divider-block text--right">
            <button className="c-btn prime" onClick={this.goToFinanceList.bind(this)}>Add New Finance</button>
              <button className="c-btn prime" id="goToFinanceList" data-toggle="modal" data-target="#finance" hidden>Add New Finance</button>
            </div>
          </div>
        </div>

        <div className="clearfix row">

          <div className="col-md-4">
            <div className="form-group cust-fld">
              <label>Search Student</label>
              <input type="search" className="form-control" value={this.state.searchText} onChange={this.serachStudent.bind(this)} placeholder="Enter Student Name" />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group cust-fld">
              <label>Fee Status</label>
              <div className="dropdown">
                <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.selectedFeeStatusname}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dLabel">
                  {this.renderFeeStatus()}
                </ul>
              </div>
            </div>
          </div>
        </div>

       
        <div className="card-container for--table">
          <div className="c-table">
            <table id="financelist" className="table data--table">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>ID</th>
                  <th style={{ width: "20%" }}>Name</th>
                  <th style={{ width: "12%" }}>Class</th>
                  <th style={{ width: "13%" }} className="nosort">Phone</th>
                  <th style={{ width: "20%" }} className="nosort">Email</th>
                  <th style={{ width: "13%" }}>Fee Status</th>
                  <th style={{ width: "12%" }} className="nosort">Action</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
        </div>


        {/* </div> */}
        <FinanceModel
           financeArr = {this.state.financeArray}
          {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  financeAdd: app.financeAdd,
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  financeList: app.financeList,
  financeUpdate: app.financeUpdate,
  getFinanceeditData: app.getFinanceeditData,
  financeDelete: app.financeDelete,
  ProfessorAdmin : app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addFinance,
      getFinancelist,
      updateFinance,
      getEditFinanceData,
      deleteFinance,
      FinanceListPagination,
      getIsProfessorAdmin
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Finance)