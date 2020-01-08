import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Viewer from '../common/pdf/viewer';
import { BASE_URL } from '../common/config';

class PdfView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      dataFromHwDetail: {}
    }
  }

  componentDidMount() {
    const recieveProp = this.props.location.state ? this.props.location.state.sendData : "";

    let { url } = this.state;
    if (recieveProp.type == 'homework') {
      this.setState({ url: `${BASE_URL}pdfviewer?instituteId=${this.props.instituteId}&branchId=${this.props.branchId}&type=${recieveProp.type}&id=${recieveProp.file.homework_file_id}&token=${this.props.token}&readonly` })
    }
    if (recieveProp.type == 'notes') {
      this.setState({ url: `${BASE_URL}pdfviewer?instituteId=${this.props.instituteId}&branchId=${this.props.branchId}&type=${recieveProp.type}&id=${recieveProp.file.notes_file_id}&token=${this.props.token}&readonly` })
    }
    if (recieveProp.type == 'drive') {
      this.setState({ url: `${BASE_URL}pdfviewer?instituteId=${this.props.instituteId}&branchId=${this.props.branchId}&type=${recieveProp.type}&my_drive_files_id=${recieveProp.file.my_drive_files_id}&token=${this.props.token}&readonly` })
    }
    if (recieveProp.type == 'studentdriveHomework') {

      this.setState({ url: `${BASE_URL}pdfviewer?instituteId=${this.props.instituteId}&branchId=${this.props.branchId}&type=${recieveProp.type}&id=${recieveProp.file.student_home_work_submission_file_id}&token=${this.props.token}&readonly` })
    }

  }



  renderFile() {
    if (this.state.url) {
      return (
        <iframe src={this.state.url} width="800" height="550"></iframe>
      )
    }
  }

  render() {
    return (
      <div className="c-container clearfix">
        {/* <div className="divider-container">
          <div className="divider-block text--left">
            <div className="c-brdcrum">
              <a onClick={this.onGotoHomeworkDetail.bind(this)} className="linkbtn hover-pointer">Back to Homework Detail</a>
            </div>
          </div>
        </div> */}
        <div className="c-container__data st--blank">
          <div className="card-container">

            {this.renderFile()}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({

  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PdfView)   