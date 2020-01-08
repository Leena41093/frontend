import React,{Component} from 'react'
import $ from 'jquery';
let table = '0';
class AllStudentsFinanceDirectory extends Component{
   constructor(props){
      super(props);
      this.state={

      }
   }

   componentDidMount(){
      this.initDataTable();
   }

   initDataTable() {
		table = $("#allStudentFinance")
		  .dataTable({
			 "ajax": (data, callback, setting) => {
				this.getStudentFinance(data, callback, setting);
				callback({
				  recordsTotal: this.state.count,
				  recordsFiltered: this.state.count,
				  data: []
				});
			 },
			 "columnDefs": [{
				"targets": 0,
				"data": null,
				"defaultContent": `<button class="link--btn" id="view">View Profile</button>`,
				// targets:[6],
				"render":(data,type,row)=>{
				  
				  let rowhtml;
				  let checkboxdata = row[1];
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
    
    getStudentFinance(data, callback, setting) {
		let order_column
		if (data.order[0].column == 0) {
			order_column = "studentid"
		 }
		else if (data.order[0].column == 1) {
		  order_column = "studentname"
		}
		else if (data.order[0].column == 2) {
		  order_column = "class"
		}
		else if (data.order[0].column == 3) {
		  order_column = "feestatus"
		}
		else if (data.order[0].column == 4) {
		  order_column = "totalbalance"
		}
		else if (data.order[0].column == 5) {
		  order_column = "action"
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
  
		// getProfessorsList(apiData).then(res =>{
		// this.handleResponse(res, callback);
		// });
		
	 }

    goToCreateNewInvoice(){
       this.props.history.push(
      {
         pathname:"/app/create-new-invoices",
         state:{data:"fromAllStudDirFlag"}
   })
   }
   render(){
      return(
         <div className="c-container dark clearfix">
            <div className="clearfix">
					<div className="divider-container">
						<div className="divider-block text--left">
							<span className="c-heading-lg margin10-bottom">All Students Financials</span>
						</div>
						<div className="divider-block text--right">
							<button className="c-btn">Send Reminder to All Defaulters</button>
							<button className="c-btn colorYellow" onClick={this.goToCreateNewInvoice.bind(this)}>Create Invoice</button>
						</div>
					</div>
				</div>
            <div className="clearfix">
            <div className="c-inlineForm">
								<div className="inline--flexbox">
									<div className="inline--flex">
										<div className="form-group cust-fld">
											<label>Search Student</label>
											<input type="text" className="form-control" placeholder="Studet Name / ID" />
										</div>
									</div>
									<div className="inline--flex">
										<div className="form-group cust-fld">
											<label>Fee Status</label>
											<div className="dropdown">
												<button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													Dropdown
												</button>
												<ul className="dropdown-menu" aria-labelledby="dLabel">
													<li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
													<li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
													<li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
												</ul>
											</div>
										</div>
									</div>
									<div className="inline--flex">
										<div className="form-group cust-fld">
											<label>classNamees</label>
											<div className="dropdown">
												<button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													Dropdown
												</button>
												<ul className="dropdown-menu" aria-labelledby="dLabel">
													<li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
													<li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
													<li><a href="javascript:void(0);" className="dd-option">Option 1</a></li>
												</ul>
											</div>
										</div>
									</div>
									<div className="inline--flex"></div>
								</div>
						</div>
                  <div className="c-inlineForm c-repoCard noTopRadius pad0-top">
							<div className="row">
								<div className="col-md-12">
										<div className="c-table">
												<table className="table data--table" id="allStudentFinance">
														<thead>
																<tr>
																		<th style={{width:"15%"}}>Student ID</th>
																		<th style={{width:"20%"}}>Student Name</th>
																		<th style={{width:"20%"}}>className</th>
																		<th style={{width:"15%"}}>Fee Status</th>
																		<th style={{width:"15%"}}>Total Balance</th>
																		<th style={{width:"15%"}} className="nosort">Action</th>
																</tr>
														</thead>
												</table>
										</div>
								</div>
							</div>
						</div>
            </div>
         </div>
      )
   }
}

export default AllStudentsFinanceDirectory