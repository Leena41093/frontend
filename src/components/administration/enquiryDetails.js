import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { getEnquiryList, deleteEnquiry, addEnquiry, updateEnquiryStatus, updateEnquiry, getClasses,getIsProfessorAdmin } from '../../actions/index';
import { AddEnquiryModal } from '../common/addEnquiryModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import $ from "jquery";
import { successToste,errorToste } from '../../constant/util';
import { DeleteModal } from '../common/deleteModal';
let table = '0';

class EnquiryDetails extends Component {

  constructor(props) {

    super(props);
    this.state = {
      enquiry_id: null,
      enquiryDetail: [],
      status_type: ['select', 'Added', 'Called', 'Cancelled'],
      editable: false,
      enquiry: {},
      editedRows: {},
      count: 0,
      isEnquiryAdd:false,
       deleteId: null,
      // obj:{},
      branchId:0,
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps){
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
          if(this.state.branchId != nextProps.branchId){
            this.setState({branchId:nextProps.branchId},()=>{
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
    this.setState({instituteId:this.props.instituteId})
    this.initDataTable();
  }

  initDataTable() {
    table = $("#enquiryDetail")
      .dataTable({
        "ajax": (data, callback, setting) => {
          this.getEnquiryData(data, callback, setting);
          callback({
            recordsTotal: this.state.count,
            recordsFiltered: this.state.count,
            data: []
          });
        },
        serverSide: true,

        "columnDefs": [{
          "targets": -1,
          "data": null,
          "defaultContent": `<button class="link--btn" id="edit" data-toggle="modal" data-target="#addnewEnquiryPage">Edit</button>
                            <button id='delete' data-toggle="modal" data-target="#quizSubmit" class="link--btn">Delete</button>`
        }, {
          "targets": 4,
          "render": (data, type, row) => {
            
            let style = this.getStyleForStatus(row[4]);
            let className = String(this.getCssForStatus(row[4]));
            var enquiryId = row[6].enquiry_id;
            var dropDown = this.renderDropdown;
            
            if (this.state.editedRows[enquiryId]) {
              var rowhtml = `<select id="statusDropdown" onChange={this.onEditStatus.bind(this, enquiry, isRowEdited)} >
                               <option>select status</option>
                               <option value="Added">Added</option>
                               <option value="Called">Called</option>
                               <option value="Cancelled">Cancelled</option>
                             </select>`;

            } else {
              var rowhtml = `<span style="${style}" class="${className}" id="status"  >${row[4]}</span>`;

            }
            return rowhtml;
          }

        },{orderable:false,targets:[2,3,4,5,6]},
        {
          targets:[0],
          className:'c-bold'
        }],
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
    $('#enquiryDetail tbody').on('click', '#delete', function () {
      var data = table.api().row($(this).parents('tr')).data();
      let id = data[6].enquiry_id 
     
      _.onDeleteModal(id,"enquiry");
    });
    $('#enquiryDetail tbody').on('click', '#edit', function () {
      var data = table.api().row($(this).parents('tr')).data();
      _.onEditEnquiry(data[6], true);
    });

    $('#enquiryDetail tbody').on('click', '#status', function () {
      var data = table.api().row($(this).parents('tr')).data();
      var enquiryId = data[6].enquiry_id;
      _.handleEdit(enquiryId)
    });
    $('#enquiryDetail tbody').on('change', '#statusDropdown', function () {
      var value = $('#statusDropdown').val();
      var data = table.api().row($(this).parents('tr')).data();
      var enquiryId = data[6].enquiry_id;
      _.onEditStatus(value, data[6], enquiryId)
    });
  }

  onDeleteModal(id,key){
    
    let {deleteId}= this.state;
    this.setState({deleteId:id,key})
  }

  onDeleteEntry(flag){
    
    let {deleteId} = this.state;
    if(flag == flag){
      this.onDeleteEnquiry(deleteId);
      $("#quizSubmit .close").click();
    }
  }

  
  getEnquiryData(data, callback, setting) {
    
    let order_column
    if (data.order[0].column == 0) {
      order_column = "firstname"
    }
    else if (data.order[0].column == 1) {
      order_column = "mobile"
    }
    else if (data.order[0].column == 2) {
      order_column = "email"
    }

    let order_type;
    if (data.order[0].dir == "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }

    let apiData = {
      payload: {
        record_per_page: data.length,
        page_number: data.start / data.length + 1,
        order_column: order_column,
        order_type: order_type
      },
      instituteId: this.props.instituteId,
      branchId: this.props.branchId,
      token: this.props.token,
    }
    getEnquiryList(apiData).then(res => {
      
      this.handleResponse(res, callback);
    })
  }

  handleResponse(res, callback) {
    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
      this.setState({ count:res.data.response.enquiryDetail ? res.data.response.enquiryDetail.length > 0 ? res.data.response.totalCount : 0 : 0 })
      let enquiryList = res.data.response.enquiryDetail;
      if (enquiryList && enquiryList.length > 0) {

        enquiryList.map((data, index) => {
         
          let style = this.getStyleForStatus(data.status);
          let className = String(this.getCssForStatus(data.status));
          
          var arr = [];
          let name = data.firstname + " " + data.lastname;
          arr[0] = name;
          arr[1] = data.mobile;
          arr[2] = data.email;
          arr[3] = data.class_name;
          arr[4] = data.status;
          arr[5] = moment(data.created_at).fromNow();
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
    else if(res && res.data.status == 500){
      this.setState({count:0})
    }
  }

  onDeleteEnquiry(id) {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      enquiry_id: id,
      token:this.props.token
    }
    this.props.deleteEnquiry(data).then(() => {
      let deleteEnquiry = this.props.deleteEnquiryResponse;
      if (deleteEnquiry && deleteEnquiry.status === 200) {
        
        successToste(" Enquiry Deleted Successfully")
        table.fnDraw();
      }
    })
  }

  onEnquiryAdd(enquiry) {
   
    let { enquiryDetail } = this.state;
    let firstname = enquiry.enquiry.firstname.split(' ');
    let name = firstname[0];
    let surname = firstname[firstname.length - 1];
    let statusFlag = enquiry.enquiry.status;
   
    if (statusFlag && statusFlag.length > 0) {
      statusFlag = enquiry.enquiry.status
    } else {
      statusFlag = "Added"
    }
    let data = {
      payload: {
        firstname: name,
        lastname: surname,
        class_id: enquiry.enquiry.class_id?enquiry.enquiry.class_id:"",
        note: enquiry.enquiry.note,
        mobile: Number(enquiry.enquiry.mobile),
        email: enquiry.enquiry.email,
        status: statusFlag,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      enquiry_id: enquiry.enquiry.enquiry_id,
      token:this.props.token,
    }

    if (enquiry && enquiry.enquiry.enquiry_id) {
     
      this.props.updateEnquiry(data).then(() => {
        let updatedenquiry = this.props.updatedEnquiryResponse;
        if (updatedenquiry && updatedenquiry.status === 200) {
          
          
          let { editable } = !this.state.editable;
          this.setState({ editable });
        }
        table.fnDraw();
        successToste("Enquiry Updated Successfully")
      })
    }
    else {
      this.setState({isEnquiryAdd:true})
      this.props.addEnquiry(data).then(() => {
        let res = this.props.newEnquiry;
        
        table.fnDraw();
        if (res && res.status == 200) {
          toast.info("Enquiry Added Successfully", {
            position: toast.POSITION.TOP_CENTER
          });
        }
        else if(res && res.status == 500) {
          errorToste("Mobile Number Already Exist Hence Enquiry Not Submitted");
        }
        else{
          errorToste("Something Went Wrong");
        }
      })
    }
    $("#addnewEnquiryPage .close").click();
  }

  onEditStatus(value, enquiry, isRowEdited) {
    
    let { editable } = this.state;
    editable = !this.state.editable;
    this.setState({ editable });
    let data = {
      payload: {
        status: value,
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      enquiry_id: enquiry.enquiry_id,
      token:this.props.token,
    }
    this.props.updateEnquiryStatus(data).then(() => {
     
      let { editedRows } = this.state;
      editedRows = { [isRowEdited]: false };
      this.setState({ editedRows }, () => { table.fnDraw(); });
    })
  }

  handleEdit(enquiryId) {
    let { editedRows } = this.state;
    editedRows = { [enquiryId]: true };
    this.setState({ editedRows }, () => {
      
      table.fnDraw();
    });
  }

  handleEdit1(isRowEdited) {
   
    let { editedRows } = this.state;
    editedRows = { [isRowEdited]: true };
    this.setState({ editedRows }, () => {
      
      table.fnDraw();
    });
  }

  getCssForStatus(status) {
    let css = 'c-state st-edit';
    switch (status) {
      case 'Added': {
        css = " st-edit c-state"
        break;
      }
      case 'Called': {
        css = "c-state st-edit"
        break;
      }
      case 'Cancelled': {
        css = "c-state  st-edit st-disabled"
        break;
      }
    }
    return css;
  }

  getStyleForStatus(status) {
    let css = " float: left; color: #7577A2 ";
    switch (status) {
      case 'Added': {
        css = "float: left; color: #15BA27 "
        break;
      }
      case 'Called': {
        css = "float: left; color: #7577A2 "
        break;
      }
      case 'Cancelled': {
        css = "float: left; color: #B9BAC9 "
        break;
      }
    }
    return css;
  }

  renderStatus(enquiry, index, isRowEdited) {
    if (this.state.editedRows[isRowEdited]) {
      return (
        <select onChange={this.onEditStatus.bind(this, enquiry, isRowEdited)} value={this.state.status_type.status}>
          {this.renderDropdown()}
        </select>
      )
    }
    else {
      return (
        <span style={this.getStyleForStatus(enquiry.status)} className={this.getCssForStatus(enquiry.status)} onClick={this.handleEdit.bind(this, isRowEdited)} >{enquiry.status}</span>
      )
    }
  }

  renderDropdown() {
    return this.state.status_type.map((status, index) => {
      return (
        <option value={status} key={"key" + index}>{status}</option>
      )
    })
  }

  onEditEnquiry(enquiry, flag) {
    if (flag != false) {
      enquiry.isEdit = true
    }
    this.setState({ enquiry })
  }

  

  render() {
    return (
      <div className="c-container clearfix" style={{ marginBottom: "300px" }}>
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Administration</span>
              <span className="c-heading-lg">Complaints</span>
            </div>
            {/* <div className="divider-block text--right">
              <button className="c-btn prime" data-toggle="modal" data-target="#addnewEnquiryPage"
                onClick={this.onEditEnquiry.bind(this, false, false)}>Add New Enquiry</button>
            </div> */}
          </div>
        </div>

        <div className="c-container__data">
          <div className="card-container for--table">
            <div className="c-table">
              <table id="enquiryDetail" className="table data--table">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>Name</th>
                    <th style={{ width: "13%" }} className="nosort">Phone</th>
                    <th style={{ width: "18%" }} className="nosort">Email</th>
                    <th style={{ width: "14%" }}>Desired Class</th>
                    <th style={{ width: "12%" }}>Status</th>
                    <th style={{ width: "13%" }}>Enquiry Time</th>
                    <th style={{ width: "12%" }} className="nosort">Action</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
        <AddEnquiryModal onAddEnquiry={(data) => { this.onEnquiryAdd(data) }}  enquiry={this.state.enquiry} classes={this.props.classes} {...this.props} from="Page"/>
        <DeleteModal flag={this.state.deleteId} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />     
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  enquiryDetail: app.enquiryDetail,
  deleteEnquiryResponse: app.deleteEnquiryResponse,
  newEnquiry: app.newEnquiry,
  branchId: app.branchId,
  instituteId: app.institudeId,
  updatedEnquiryResponse: app.updatedEnquiryResponse,
  updateEnquiryStatus: app.updateEnquiryStatus,
  enquiry_id: app.enquiry_id,
  classes: app.classes,
  token: auth.token,
  ProfessorAdmin:app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getEnquiryList, deleteEnquiry, addEnquiry, updateEnquiryStatus, updateEnquiry, getClasses,
      getIsProfessorAdmin
    },
    dispatch
  )


export default connect(mapStateToProps, mapDispatchToProps)(EnquiryDetails)
