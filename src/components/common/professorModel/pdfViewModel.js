import React, { Component } from 'react';
import { BASE_URL } from '../../common/config';
import $ from "jquery";
import { css } from 'react-emotion';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

export class PdfViewModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfUrl: null,
      dataFromHwDetail: {},
      file: {}
    }
  }

  componentWillReceiveProps(props) {
    this.setState({pdfUrl:null,dataFromHwDetail:{},file:{}},()=>{
      const recieveProp = props.sendDataToPdfViewModel
      let self = this;
      this.setState({ dataFromHwDetail: recieveProp.file });
  
      if (recieveProp.type == 'homework') {
        self.setState({ pdfUrl: recieveProp.pdfUrl+"#toolbar=0"  })
      }
      if (recieveProp.type == 'notes') {
        self.setState({ pdfUrl: recieveProp.pdfUrl+"#toolbar=0" })
      }
      if (recieveProp.type == 'drive') {
        self.setState({ pdfUrl: recieveProp.pdfUrl+"#toolbar=0" })
      }
      if (recieveProp.type == 'studentdriveHomework') {
        self.setState({ pdfUrl: recieveProp.pdfUrl+"#toolbar=0" })
      }
      if (recieveProp.type == 'studentHomework') {
        self.setState({ pdfUrl: recieveProp.pdfUrl+"#toolbar=0" })
      }
    })
  }

  closeModel() {
    this.setState({ pdfUrl: null, file_name: "" })
    $("#pdfviewmodel .close").click();
  }

  renderFile() {
    if (this.state.pdfUrl) {
      return (
      
        <iframe src={this.state.pdfUrl} style={{ width: "100%", height: "550px" }} frameBorder="0"></iframe>
        // <iframe src="https://s3-ap-south-1.amazonaws.com/dev-cleverground/52/51/65/121/1-s2.0-S0308814616314601-mmc1.pdf#toolbar=0" style={{ width: "100%", height: "550px" }} frameBorder="0"></iframe>
      )
    }
  }

  render() {
    return (
      <div className="modal fade custom-modal-lg" id="pdfviewmodel" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModel.bind(this)}><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">{this.state.dataFromHwDetail && this.state.dataFromHwDetail.file_name ? this.state.dataFromHwDetail.file_name : ""}</h4>
            </div>
            <div style={{ height: "650px" }} className="modal-body">
              <div className="form-group cust-fld">
                {/* <div className="c-container__data st--blank"> */}
                <div className="card-container">
                  {this.renderFile()}
                </div>
              </div>
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