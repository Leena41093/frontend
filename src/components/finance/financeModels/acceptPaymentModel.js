import React ,{Component} from 'react';

export class AcceptPaymentModel extends Component{
   constructor(props) {
      super(props);
      this.state ={

      }
   }
   
   render(){
      return(
         <div className="modal fade" id="acceptpayment" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
							<h4 className="c-heading-sm card--title">Accept Payment</h4>
						</div>
						<div className="modal-body">
							<span className="cust-m-info">Select & check invoice details.</span>
							<div className="divider-container addBatch-container type02">

								<div className="divider-block">

									<div className="form-group cust-fld">
											<label>Select Invoice</label>
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

									<div className="form-group static-fld">
											<label>Invoice Name</label>
											<span className="info-type">11th Standard - 2nd Installment</span>
									</div>

									<div className="form-group static-fld">
											<label>Amount</label>
											<span className="info-type">₹ 20,000 /-</span>
									</div>

									<div className="form-group static-fld">
											<label>Issued On</label>
											<span className="info-type">1 Jan 2019</span>
									</div>

									<button className="link--btn">View Invoice</button>
								</div>
							
								<div className="divider-block">
										<div className="form-group cust-fld">
												<label>Amount Paid</label>
												<input type="text" className="form-control" placeholder="Amount" />
										</div>

										<div className="form-group cust-fld">
											<label>Payment Method</label>
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

										<div className="form-group cust-fld">
												<label>Payment Date</label>
												<input type="text" className="form-control fld--date" placeholder="Amount" />
										</div>

										<div className="form-group cust-fld">
												<label>Attachment(Optional)</label>
												<input type="file" className="form-control" placeholder="file" />
										</div>
								</div>

							</div>
						</div>
						<div className="modal-footer">
							<div className="clearfix text--right">
								<button className="c-btn grayshade" data-dismiss="modal">Cancel</button>
								<button className="c-btn primary">Accept Payment</button>
							</div>
						</div>
					</div>
				</div>
		</div>
      )
   }
}