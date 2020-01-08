import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from "jquery";
import { bindActionCreators } from 'redux';
import {getProfessorsList,invitationSend, getIsProfessorAdmin, getEmailOfFacultyDirectory} from '../../actions/index';
import { errorToste, successToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
let table = '0';

class FacultyDirectory extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      professorList: [],
      searchText: '',
      count: 0,
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
    let data={
      institute_id:this.props.instituteId,
      branch_id:this.props.branchId,
      token:this.props.token
    }
    this.props.getEmailOfFacultyDirectory(data).then(()=>{

    })
    this.initDataTable();
  }

  initDataTable() {
    table = $("#professorList")
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
          "render":(data,type,row)=>{
            
            let rowhtml;
            let rowData = row[6];
            let title = this.getConditionForButton(rowData);
            if(title){
              return rowhtml = `<button class="link--btn" id="view">View Profile</button> 
              <button class="link--btn" id="invite" >${title}</button>`;  
            }else{
              return rowhtml =`<button class="link--btn" id="view">View Profile</button>`
            }
           
          }
        },{orderable:false,targets:[2,3,4,5]},
        {
          targets:[0],
          className:'c-bold'
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
    $('#professorList tbody').on('click', '#view', function () {
      var data = table.api().row($(this).parents('tr')).data();
      _.onChangePage(data[6]);
    });

    var _ = this;
    $('#professorList tbody').on('click', '#invite', function () {
      var data = table.api().row($(this).parents('tr')).data();
      _.onSendInvitation(data[6]);
    });
  }

  getProfessors(data, callback, setting) {
    let order_column
    if (data.order[0].column == 0) {
      order_column = "firstname"
    }
    else if (data.order[0].column == 1) {
      order_column = "designation"
    }
    else if (data.order[0].column == 2) {
      order_column = "mobile"
    }
    else if (data.order[0].column == 3) {
      order_column = "email"
    }
    else if (data.order[0].column == 4) {
      order_column = "emergency_contact"
    }

    let order_type;
    if (data.order[0].dir == "asc") {
      order_type = 0
    } else {
      order_type = 1;
    }
    let apiData={
      payload:{
        "searchText": this.state.searchText,
        "record_per_page": data.length,
        "page_number": data.start / data.length + 1,
        "order_column": order_column,
        "order_type": order_type
      } ,
      
      instituteId:this.props.instituteId,
      branchId:this.props.branchId,
      token:this.props.token,
    }

    getProfessorsList(apiData).then(res =>{
    this.handleResponse(res, callback);
    });
    
  }
  
  handleResponse(res, callback) {
    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
      this.setState({ count:res.data.response.professorDetail ? res.data.response.professorDetail.length > 0 ? res.data.response.totalCount : 0 : 0})
      let facultyList=res.data.response.professorDetail;
      if(facultyList&& facultyList.length>0){
      facultyList.map((data, index) => {
        var arr = []
        let name = data.firstname+" "+data.lastname;
        arr[0] = name;
        arr[1] = data.designation;
        arr[2] = data.mobile;
        arr[3] = data.email;
        arr[4] = data.emergency_contact;
        arr[5] = data.professor_id;
        arr[6] = data;
        columnData.push(arr);
      })
    }
      callback({ recordsTotal: this.state.count,
        recordsFiltered: this.state.count,
        data: columnData 
      });
    }
    else if(res && res.data.status == 500){
      this.setState({count:0})
    }
  }

  getConditionForButton(obj){
    if(obj.is_invite == true && obj.is_register == false){
      return "Invite Again";
    }else if(obj.is_invite == false && obj.is_register == false){
      return "Invite";
    }else if(obj.is_invite == true && obj.is_register == true){
      return false;
    }
  }

  onSendInvitation(data){
    let payloadType;
    if(data.designation == "INSTITUTE"){
      payloadType= "Institute"
    }
    else if(data.designation == "Professor"){
      payloadType = "Professor"
    }
   let apiData = {
     payload:{
      type:payloadType,
      id:data.professor_id
     },
    institude_id:this.props.instituteId,
    branch_id:this.props.branchId,
    token:this.props.token
   }
   this.props.invitationSend(apiData).then(()=>{
     let res = this.props.sendInvitation;
     if(res && res.status == 200){
      successToste("Invitation Send Successfully");
     }
     else if(res && res.status == 500){
       errorToste("Something Went Wrong")
     }
   })
  }

  onChangePage(data) {
    this.props.history.push({
      pathname: 'faculty-detail',
      state: { data: data ,branchId:this.props.branchId}
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
      <ToastContainer/>
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-sm">Administration</span>
              <span className="c-heading-lg">Faculty Manager</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" onClick={this.onEditProfessor.bind(this)}  >Add New Faculty</button>
            </div>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <div className="form-group cust-fld">
                <label>Search Faculty</label>
                <input  type="search" className="form-control" value={this.state.searchText} onChange={this.serachProfessor.bind(this)} placeholder="Enter Faculty Name" />
              </div>
            </div>
            <div className="divider-block text--right">
            </div>
          </div>
        </div>

        <div className="c-container__data">
          <div className="card-container for--table">
            <div className="c-table">
              <table id="professorList" className="table data--table">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Name</th>
                    <th style={{ width: "12%" }}>Designation</th>
                    <th style={{ width: "15%" }}>Phone</th>
                    <th style={{ width: "18%" }}>Email</th>
                    <th style={{ width: "15%" }}>Emergency Contact</th>
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

const mapStateToProps = ({ app ,auth}) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token:auth.token,
  sendInvitation:app.sendInvitation,
  ProfessorAdmin : app.professorAdmin,
  professorEmailChecking : app.professorEmailCheck
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { 
      invitationSend,getIsProfessorAdmin,getEmailOfFacultyDirectory
    }, dispatch
  )

export default connect(mapStateToProps,mapDispatchToProps)(FacultyDirectory)


