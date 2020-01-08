import React, {Component} from 'react';

class CreateNewInvoice extends Component{
   constructor(props){
      super(props);
      this.state={
			fromallstuddir : false,
			fromdashboard : false,
			fromStudentDetails:false
      }
   }

	componentWillReceiveProps(props){
		let pro = this.props.location.state? this.props.location.state.data:"";
		if(pro == "fromAllStudDirFlag"){
			this.setState({fromallstuddir:true,fromdashboard:false,fromStudentDetails:false})
		}
		else if (pro == "fromDashboard"){
			this.setState({fromdashboard:true,fromallstuddir:false,fromStudentDetails:false})
		}
		else if (pro == "fromStudentDetails"){
			this.setState({fromStudentDetails:true,fromallstuddir:false,fromdashboard:false})
		}
	}

	componentDidMount(){
		let pro = this.props.location.state? this.props.location.state.data:"";
		if(pro == "fromAllStudDirFlag"){
			this.setState({fromallstuddir:true,fromdashboard:false})
		}
		else if (pro == "fromDashboard"){
			this.setState({fromdashboard:true,fromallstuddir:false})
		}
		else if (pro == "fromStudentDetails"){
			this.setState({fromStudentDetails:true,fromallstuddir:false,fromdashboard:false})
		}
	}
   goToDashboard(){
		if(this.state.fromdashboard == true){
		this.props.history.push("/app/finance-dashboard")
		}
		else if(this.state.fromallstuddir == true){
		this.props.history.push("/app/all-student-finance-directory")
		}
		else if(this.state.fromStudentDetails == true){
			this.props.history.push("/app/student-finance-detail")
		}
   }
   
   render(){
      return(
         <div class="c-container dark clearfix">
            	<div class="clearfix">
					<div class="divider-container">
						<div class="divider-block text--left">
							<span class="c-heading-lg margin10-bottom">Create New Invoice</span>
						</div>
						<div class="divider-block text--right">
                     <button class="c-btn grayshade" onClick={this.goToDashboard.bind(this)}>Cancel</button>
							<button class="c-btn">Send Invoice</button>
						</div>
					</div>
				</div>
            <div class="clearfix">
            <div class="c-flexGrid margin25-bottom">
            <div class="flexGrid_sect grow-2">
							<span class="block-title st-colored noborder">Invoice Details</span>
							<div class="form-group cust-fld">
									<label>Name</label>
									<input type="text" class="form-control" placeholder="Name" />
							</div>
							<div class="form-group cust-fld">
									<label>Amount</label>
									<input type="text" class="form-control" placeholder="Amount" />
							</div>
							<div class="form-group cust-fld">
									<label>Due date</label>
									<input type="text" class="form-control fld--date" placeholder="Name" />
							</div>

							<div class="clearfix">
									<span class="cust-m-info margin20-top">Enter invoice denominations. (Optional)</span>
									<div class="form-group cust-fld fldLine">
											
											<div class="row">
												<div class="col-md-2"><span class="labelNumber margin10-top">1.</span></div>
												<div class="col-md-7 nopad">
														<div class="form-group cust-fld">
																<input type="text" class="form-control pad5" />
														</div>
												</div>
												<div class="col-md-3 pad5-ltrt">
														<div class="form-group cust-fld">
																<input type="text" class="form-control pad5" />
														</div>
												</div>
											</div>
										
											<div class="row">
												<div class="col-md-2"><span class="labelNumber margin10-top">2.</span></div>
												<div class="col-md-5 nopad">
														<div class="form-group cust-fld">
																<input type="text" class="form-control pad5" />
														</div>
												</div>
												<div class="col-md-3 pad5-ltrt">
														<div class="form-group cust-fld">
																<input type="text" class="form-control pad5" />
														</div>
												</div>
												<div class="col-md-2 pad0-left">
													<button class="c-actionBtn margin10-top"><i class="icon cg-android-close"></i></button>
												</div>
											</div>
									
											<div class="row">
												<div class="col-md-2"><span class="labelNumber margin10-top">3.</span></div>
												<div class="col-md-5 nopad">
														<div class="form-group cust-fld">
																<input type="text" class="form-control pad5" />
														</div>
												</div>
												<div class="col-md-3 pad5-ltrt">
														<div class="form-group cust-fld">
																<input type="text" class="form-control pad5" />
														</div>
												</div>
												<div class="col-md-2 pad0-left">
													<button class="c-actionBtn margin10-top"><i class="icon cg-android-close"></i></button>
												</div>
											</div>

											<div class="c-btnContainer margin25-bottom">
												<button class="c-btn-bordered">Add denomination</button>
											</div>

										</div>
							</div>
						</div>
                  <div class="flexGrid_sect grow-5">
								<span class="block-title st-colored noborder">Send Invoice To</span>
								<div class="row">
									<div class="col-md-6">
									
										<div class="c-searchList">
											<div class="form-group cust-fld">
													<label>Class</label>
													<input type="text" class="form-control" placeholder="Search Class" />
											</div>
											<div class="searchList-result js-scrollPlugin">
												<ul>
													<li>
														<button class="selectBtn">11th standard</button>
														<button class="removeBtn"></button>
													</li>
													<li>
														<button class="selectBtn">11th standard</button>
														<button class="removeBtn"></button>
													</li>
												</ul>
											</div>
										</div>
									
										<div class="c-searchList">
											<div class="form-group cust-fld">
													<label>Batches</label>
													<input type="text" class="form-control" placeholder="Search Batches" />
											</div>
											<div class="searchList-result js-scrollPlugin">
												<ul>
													<li>
														<button class="selectBtn">Saturday Batch - Chemistry -  11th standard</button>
														<button class="removeBtn"></button>
													</li>
													<li>
														<button class="selectBtn">Saturday Batch - Chemistry -  11th standard</button>
														<button class="removeBtn"></button>
													</li>
												</ul>
											</div>
										</div>

									</div>
									<div class="col-md-6">
										<div class="c-searchList lg">

											<div class="form-group cust-fld">
													<label>Students</label>
													<input type="text" class="form-control" placeholder="Search Student" />
											</div>
											<div class="static-fld">231 Students Selected</div>
											<div class="searchList-result js-scrollPlugin">
												<ul>
													<li>
														<button class="selectBtn">ST12345 - Tum Tantasatityanon</button>
														<button class="removeBtn"></button>
													</li>
													<li>
															<button class="selectBtn">ST12345 - Tum Tantasatityanon</button>
															<button class="removeBtn"></button>
														</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
						</div>
            </div>
            </div>
         </div>
      )
   }
}

export default CreateNewInvoice;