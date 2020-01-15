import React, { Component } from 'react';
import $ from "jquery";
import { css } from 'react-emotion';
import { successToste } from '../../constant/util';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

export class ComplaintsModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complaintData:{}
    }
  }

  componentWillReceiveProps(nextprops) {
  
   this.setState({complaintData:nextprops.complaintsData})
  }

  closeModel() {
  
    $("#complaintModel .close").click();
  }

  updateComplaint(){
    let data = {
      company_id : this.props.company_id,
      branch_id : this.props.branch_id,
      complaint_id: this.state.complaintData.complaint_id,
      payload:{
        "complaint_text": this.props.complaint_text,
	      "status": "SOLVED"
      }
    }
    this.props.updateComplaints(data).then(()=>{
      let res = this.props.updateComplaintsdatas;
      if(res && res.data.status == 200){
        successToste("Complaint is Resolved")
      }
    })
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm width--sm" id="viewModel" tabIndex="-1" role="dialog" aria-labelledby="mymo">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModel.bind(this)}><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">{this.state.complaintData.emp_name}</h4>
            </div>
            <div style={{ height: "320px" ,overflowY:"auto"}} className="modal-body">
              <div className="form-group cust-fld">
                {/* <div className="c-container__data st--blank"> */}
                <div className="card-container">
                  <label style={{fontSize:"14px"}}>{this.state.complaintData.complaint_text}</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
               <button className="c-btn prime pull-right" onClick={this.updateComplaint.bind(this)}>Solved</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// const mapStateToProps = ({app, auth }) => ({
//   branchId: app.branchId,
//   instituteId: app.institudeId,
//   token: auth.token,
// });

// const mapDispatchToProps = dispatch =>
//   bindActionCreators({

//   }, dispatch)

// export default connect(mapStateToProps, mapDispatchToProps)(PdfView)   