import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNotesDetails, downloadNotesFile, deleteBatchNotes } from '../../actions/professorActions';
import Viewer from '../common/pdf/viewer';
import { DeleteModal } from '../common/deleteModal';
import $ from "jquery";
import { errorToste, successToste } from '../../constant/util';
import { ToastContainer } from 'react-toastify';
import fileDownload from 'js-file-download';


class NotesDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pdfdata: null,
      fileList: [],
      deleteObj: null,
      id: 0,
      instituteId: 0
    }
  }

  componentWillReceiveProps(nextProps) {

    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        this.props.history.push("/app/dashboard");
      }
    }
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId });
    this.getNotesDetail();
  }

  onChanageDashBoardPage() {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    this.props.history.push({
      pathname: '/app/notes-directory',
      state: { data: pro1 }
    });
  }

  getNotesDetail() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";

    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        notes_id: pro.notes_id,
        batch_notes_id: pro.batch_notes_id,

      }
    }
    this.props.getNotesDetails(apiData).then(() => {
      let res = this.props.notesDetail;

      if (res && res.data.status == 200) {
        this.setState({ fileList: res.data.response }, () => {
          if (this.state.fileList && this.state.fileList.length > 0) {
            this.downLoadData(this.state.fileList[0])
          }
        })
      } else if (res && res.data.status == 500) {
        errorToste(res.data.message)
      }
    })
  }

  downLoadData(file) {
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "notes_file_id": file.notes_file_id,
      }
    }
    this.props.downloadNotesFile(data).then(() => {
      let res = this.props.notesFiledata;

      if (res && res.data.status == 200) {
        // let Fdata = this.b64toBlob(res.data.response);
        this.setState({ pdfdata: res.data.response });
      } else if (res && res.data.status == 500) {
        errorToste('Something Went Wrong')
      }
    })
  }

  // b64toBlob(b64Data, contentType, sliceSize) {
  //   contentType = contentType || '';
  //   sliceSize = sliceSize || 512;

  //   var byteCharacters = atob(b64Data);
  //   var byteArrays = [];

  //   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     var slice = byteCharacters.slice(offset, offset + sliceSize);

  //     var byteNumbers = new Array(slice.length);
  //     for (var i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }

  //     var byteArray = new Uint8Array(byteNumbers);

  //     byteArrays.push(byteArray);
  //   }

  //   var blob = new Blob(byteArrays, { type: contentType });
  //   return blob;
  // }

  convertDataURIToBinary(raw) {
    var raw = atob(raw);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  onSelectFile(file) {
    this.downLoadData(file);
  }

  onDeleteModel(key, id) {
    let { deleteObj } = this.state;
    this.setState({ deleteObj: key, id })
  }

  onDeleteEntry(flag) {
    let { id } = this.state;
    if (flag == 'deletenotes') {
      this.onDeleteNotes(id);
      $("#quizSubmit .close").click();
    }
  }

  onDeleteNotes(id) {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    let data = {
      payload: {
        batch_notes_id: id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.deleteBatchNotes(data).then(() => {
      let res = this.props.batchNotesDelete;
      if (res && res.data.status == 200) {
        this.props.history.push({ pathname: '/app/notes-directory', state: { data: pro1 } });
        successToste("Notes Deleted Successfully")
      }
      else if (res && res.data.status == 500) {
        errorToste("Something Went Wrong")
      }
    })
  }

  renderPDF() {
    let { pdfdata } = this.state;
    if (pdfdata) {
      return (
        <iframe src={this.state.pdfdata + "#toolbar=0"} style={{ width: "100%", height: "500px" }} frameBorder="0"></iframe>
      )
    } else {
      return false;
    }
  }

  renderFileList() {
    let { fileList } = this.state;
    if (fileList && fileList.length > 0) {
      return fileList.map((file, index) => {
        return (
          <a key={"file" + index} className="linkbtn" onClick={this.onSelectFile.bind(this, file)} ><i className="icon cg-pdf"></i>{file.file_name}</a>
        )
      })
    }
  }

  render() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix ">
          <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.onChanageDashBoardPage.bind(this)}>Back to All Notes</a>
              </div>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" data-toggle="modal" data-target="#quizSubmit" onClick={this.onDeleteModel.bind(this, "deletenotes", pro.batch_notes_id)}>Delete Note</button>
            </div>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">{pro.title ? pro.title : ''}</span>
            </div>
            <div className="divider-block text--right">
              {/* <button className="c-btn prime">Save Quiz</button> */}
            </div>
          </div>
        </div>
        <div className="clearfix row">
          <div className="col-md-3 col-sm-12 col-xs-12">
            <div className="clearfix btn--listing">
              <div className="block-title st-colored">Files</div>
              {this.renderFileList()}
            </div>
          </div>
          <div className="col-md-9 col-sm-12 col-xs-12">
            <div className="c-container__data st--blank">
              <span className="c-heading-sm card--title margin25-bottom">note</span>
              {this.renderPDF()}
            </div>
          </div>
        </div>
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  notesDetail: professor.notesDetail,
  notesFiledata: professor.notesFiledata,
  token: auth.token,
  batchNotesDelete: professor.batchNotesDelete
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getNotesDetails,
      downloadNotesFile,
      deleteBatchNotes
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NotesDetail)