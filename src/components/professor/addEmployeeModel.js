import React, { Component } from 'react';
import { errorToste } from '../../constant/util';
import { ToastContainer } from 'react-toastify';
import {getAllEmployee} from '../../actions/inventoryAdminAction'
import Select from 'react-select';
export class AddEmployeeModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
         options:[],
         selectedValues:[]
		}
	}
   componentWillReceiveProps(nextProps){
   
    this.getAllEmployee();

   }

	componentDidMount() {
   

	}
   getAllEmployee(){
      let data ={
         company_id: this.props.componyDetails.company_id,
         branch_id: this.props.componyDetails.branch_id
      }
		this.getAllEmployee(data).then((res)=>{
         this.setState({option:res.data.response},()=>{
            console.log(this.state.option)
         })
      })
   }



	render() {
		return (
			<div className="modal fade custom-modal-sm width--lg" id="addEmployee" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
				<ToastContainer />
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
							<h4 className="c-heading-sm card--title">Add Projectes And Accessories</h4>
						</div>
						<div className="modal-body">
                  <div className="c-card__form">
                <div className="form-group cust-fld">
                  <label>Employee Name</label>
                  <div className=" row inline-formfld">
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                      <Select
                        // defaultValue={[colourOptions[2], colourOptions[3]]}
                        isMulti
                        name="students"
                        closeMenuOnSelect={false}
                        options={this.state.option}
                        onFocus={this.getAllEmployee.bind(this)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selected) => { this.setState({selectedValues:selected}) }}
                      />
                      </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                      <button className="c-btn-large primary" >Add</button>
                    </div>
                    {/* <input type="text" className="form-control" value={this.state.newStudentName} onChange={this.onStudentNameChange.bind(this)} placeholder="Enter Student Name" /> */}
                  </div>
         


                </div>
      
              </div>

						</div>
						<div className="modal-footer">
							<div className="clearfix text--right">
								<button className="c-btn grayshade" data-dismiss="modal">Cancel</button>
								{/* <button className="c-btn primary" onClick={this.onHandleClick.bind(this)} >Add Batches</button> */}
							</div>
						</div>
					</div>
				</div>
			</div>


		)
	}
}





