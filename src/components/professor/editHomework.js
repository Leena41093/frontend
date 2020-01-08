import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { getHomeWorkDetail, updateProfessorHomework, homeWorkFileUpload, homeWorkDriveFileUploading } from '../../actions/professorActions';
import $ from 'jquery';
import { ClipLoader } from 'react-spinners';
import { css } from 'react-emotion';
import { SelectHomeworkModel } from '../common/professorModel/selectHomeworkModel';
import { getProfessorFolderFileList } from '../../actions/professorDriveAction';
import { timingSafeEqual } from 'crypto';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;

class EditHomework extends Component {

  constructor(props) {
    super(props);
    this.onGetFile = this.onGetFile.bind(this);
    const pro = this.props.location.state.data;
    this.state = {
      homework: pro ? pro : {},
      homeWorkDetail: {},
      fileDetails: [],
      files: [],
      flags: [],
      loders: [],
      isTitleVisible: false,
      isTopicVisible: false,
      isfileSelected: false,
      driveFiles: [],
      cls: {},
      subject: {},
      folder: {},
      // fileSelection: "both",
      instituteId: 0,
      isFileSizeValid: false,
      fileSizeErrorMsg: false,
      fileUploadingStatusFlag: false,
      flagSet: false
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
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.setState({ instituteId: this.props.instituteId });
    this.getHomeworkData(pro);
  }

  getHomeworkData(homework) {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "home_work_id": homework.homework_id,
        "batch_homework_id": homework.batch_homework_id
      }
    }
    this.props.getHomeWorkDetail(apiData).then(() => {
      let res = this.props.editHomeworkData;
      if (res && res.status == 200) {
        this.setState({
          homeWorkDetail: res.data.response.batchHomeworkDetails[0],
          fileDetails: res.data.response.filesDetails,
          cls: { class_name: homework.class_name, class_id: homework.class_id },
          subject: { subject_name: homework.subject_name, subject_id: homework.subject_id },

        }, () => {

          this.setState({ folder: { folder_name: homework.folder_name, folder_id: this.state.homeWorkDetail.subject_folder_id } });
        })
      }
    })
  }

  onInputChange(property, event) {
    let { homework, isNameVisible, isTopicVisible } = this.state;
    homework = { ...homework, [property]: event.target.value }
    this.setState({ homework, isTitleVisible: false, isTopicVisible: false });
  }

  validate() {

    let isValidForm = true;
    let { isTitleVisible, isTopicVisible, isfileSelected, homework } = this.state;
    if (!homework.title) {
      this.setState({ isTitleVisible: true });
      isValidForm = false;
    }

    if (this.state.files.length == 0 && this.state.fileDetails.length == 0) {
      this.setState({ isfileSelected: true, fileSizeErrorMsg: false, fileUploadingStatusFlag: false, flagSet: false });
      isValidForm = false;
    }

    return isValidForm;
  }

  onEditHomework() {
    let flagSet = false
    if (this.validate() == true) {
      flagSet = true
    } else if (this.validate() == false) {
      flagSet = false
    }

    this.setState({ fileUploadingStatusFlag: flagSet }, () => {

      const pro = this.props.location.state ? this.props.location.state.data : "";

      const isValidForm = this.validate();

      let { fileSelection, homework, homeWorkDetail } = this.state;
      if (!isValidForm) {
        return;
      }
      else {
        let apiData = {
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
          payload: {
            "home_work_id": this.state.homework.homework_id,
            "name": this.state.homework.title,
            "topic": this.state.homework.title,
          }
        }
        this.props.updateProfessorHomework(apiData).then(() => {
          let res = this.props.updateHomework;
          let length = this.state.files.length;
          let count = 0;

          if (res && res.data.status == 200) {

            infoToste("Homework Updated Successfully");
            // if (fileSelection == "local") {

            if (this.state.files.length > 0) {
              this.state.files.map((file, index) => {

                let { loders } = this.state;
                const formData = new FormData();
                formData.append('filename', file);
                formData.append('class_id', homeWorkDetail.class_id);
                formData.append('subject_id', homeWorkDetail.subject_id);
                formData.append('batch_id', homeWorkDetail.batch_id);
                formData.append('subject_folder_id', homeWorkDetail.subject_folder_id);
                formData.append('home_work_id', homework.homework_id);
                formData.append('batch_homework_id', homework.batch_homework_id);
                formData.append('driveFlag', this.state.flags[index]);
                let apiData = {
                  institude_id: this.props.instituteId,
                  branch_id: this.props.branchId,
                  token: this.props.token,
                  payload: formData,
                }
                loders[index] = true;
                this.setState({ loders }, () => {

                  this.props.homeWorkFileUpload(apiData).then(() => {
                    count++;

                    loders[index] = false;
                    this.setState({ loders }, () => {
                      successToste("Insert Pdf Successfully");
                    });
                    if (length === count) {

                      this.props.history.push({ pathname: '/app/homework-directory', state: { data: pro } });
                    }
                  })
                })

              })
            }
            if (this.state.files.length == 0) {
              this.setState({ fileDetails: this.state.fileDetails }, () => {
                this.props.history.push({ pathname: '/app/homework-directory', state: { data: pro } });
              })
            }


          }
          else if (res && res.data.status == 500) {
            errorToste("Something Went Wrong")
          }
        })

      }
    })

  }

  onGetFile(e) {

    let { files, flags, loders, fileSelection, fileDetails } = this.state;
    var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : "";
    if (fileSize > 20) {

      this.setState({ fileSizeErrorMsg: true, isfileSelected: false, files: [], fileDetails: [] })
    } else {
      files.push(e.target.files[0]);
      flags.push("True")
      loders.push(false)
      this.setState({
        files,
        flags,
        loders,
        isfileSelected: false,
        // fileSelection: "local",
        fileDetails: [],
        fileSizeErrorMsg: false,

      });
    }
  }

  onSaveDrive(index) {
    let { flags } = this.state;
    if (this.state.flags[index] == "True") {
      flags[index] = "False";
    } else {
      flags[index] = "True";
    }
    this.setState({ flags })
  }

  onDeleteFile(index) {
    let { files, flags, driveFiles, fileSelection } = this.state;

    // if (fileSelection === "local") {
    files.splice(index, 1);
    flags.splice(index, 1);
    this.setState({ files, flags }, () => {

    });
    // }
    // if (fileSelection === "drive") {
    //   driveFiles.splice(index, 1);
    //   this.setState({ driveFiles });
    // }
  }

  onGotoDirectory() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    this.props.history.push({ pathname: 'homework-directory', state: { data: pro } });
  }

  uploadFile(files) {
    this.setState({ fileSelection: "drive", driveFiles: files, isfileSelected: false, fileDetails: [] });
  }

  renderNewUploadfile() {
    let { files } = this.state;

    let { fileSelection, driveFiles } = this.state;
    // if (fileSelection == "local") {
    return files.map((file, index) => {
      return (
        <div key={"file" + index} className="c-upfile">
          <div className="c-upfile__name" >{file ? file.name : ""}
            <ClipLoader
              className={override}
              style={{ marginRight: "5%" }}
              sizeUnit={"px"}
              size={20}
              color={'#123abc'}
              loading={this.state.loders[index]}
            />
          </div>
          <div className="c-upfile__opt">
            <label htmlFor="check-f1" className="custome-field field-checkbox">
              <input type="checkbox" name="check-one" id="check-f1" value="checkone" onChange={this.onSaveDrive.bind(this, index)} checked={this.state.flags[index] == "True" ? true : false} />
              <i></i><span>Save to Drive</span>
            </label>
            <button className="btn-delete" onClick={this.onDeleteFile.bind(this, index)} ><i className="icon cg-times"></i></button>
          </div>
        </div>
      )
    })
    // }

  }

  renderOldUploadFile() {
    let { fileDetails } = this.state;
    if (fileDetails && fileDetails.length > 0) {
      return fileDetails.map((file, index) => {
        return (
          <div key={"file" + index} className="c-upfile">
            <div className="c-upfile__name">{file ? file.file_name : ""}</div>
          </div>
        )
      })
    }
  }

  renderFileSelectionPopup() {
    let { fileSelection } = this.state;
    // if (fileSelection === "both") {
    //   return (
    //     <div className="c-file-uploader">
    //       <span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
    //       <span className="uploader__info">or</span>
    //       <button className="uploader__btn"><input type="file" accept="application/pdf" onChange={this.onGetFile} /></button>
    //     </div>
    //   )
    // }

    // if (fileSelection === "local") {
    return (
      <div className="c-file-uploader">
        <span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
        <span className="uploader__info">or</span>
        {this.state.files.length == 0 ?
          <button className="uploader__btn"><input type="file" accept="application/pdf" onChange={this.onGetFile} /></button>
          : <span style={{ color: "red", marginLeft: "60px" }}>{"Can Add Only One File"}</span>}
      </div>
    )
    // }
  }

  render() {
    let { homework } = this.state;
    return (
      <div className="c-container clearfix">
        <div className="clearfix">
          <div className="c-brdcrum">
            <a className="linkbtn hover-pointer" onClick={this.onGotoDirectory.bind(this)}>Back to All Homeworks</a>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Edit Homework</span>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>{homework.class_name} - {homework.subject_name} - {homework.batch_name}</span>
              {this.state.fileUploadingStatusFlag == true ? <span style={{ color: "red" }}> File is uploading please Wait!</span> : ""}
            </div>
            <div className="divider-block text--right">
              <button className="c-btn grayshade" onClick={this.onGotoDirectory.bind(this)}>Back</button>
              <button className="c-btn prime" onClick={this.onEditHomework.bind(this)}>Save Homework</button>
            </div>
          </div>
        </div>
        <div className="c-container__data">
          <div className="card-container type--2">
            <div className="c-card sect--1" style={{ width: "600px" }}>
              <div className="block-title st-colored noborder">HOMEWORK DETAILS</div>
              <div className="form-group cust-fld">
                <label>Homework Title <sup>*</sup></label>
                <input type="text" className="form-control" value={homework.title ? homework.title : ""} onChange={this.onInputChange.bind(this, "title")} placeholder="Enter Homework Title" />
                {this.state.isTitleVisible ? <label className="help-block" style={{ color: "red" }}>Please Enter Homework Title</label> : <br />}
              </div>

            </div>

            <div className="c-card sect--2">
              <div className="row">

                <div className="col-md-6">
                  <div className="form-group cust-fld" style={{ width: "300px" }}>
                    <label>Homework Title <sup>*</sup></label>
                    {this.renderFileSelectionPopup()}
                    {this.state.fileUploadingStatusFlag == true ? <span style={{ color: "red" }}> File is uploading please Wait!</span> : ""}
                    {this.state.isfileSelected ? <label className="help-block" style={{ color: "red" }}>Please Select File</label> : <br />}
                    {this.state.fileSizeErrorMsg == true ? <label className="help-block" style={{ color: "red" }}>Please Select File Less than 20MB.</label> : <br />}
                    {/* {this.state.isFileSizeValid == true ? <label className="help-block" style={{ color: "red" }}>Please Select File Less than 20MB.</label> : <br />} */}
                    <div className="clearfix" style={{ width: "300px" }}>
                      {this.renderNewUploadfile()}
                      {this.renderOldUploadFile()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <SelectHomeworkModel {...this.props} cls={this.state.cls} subject={this.state.subject} folder={this.state.folder} onSelectFiles={(data) => { this.uploadFile(data) }} flag={"homework"} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, professorDrive, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  editHomeworkData: professor.editHomeworkData,
  updateHomework: professor.updateHomework,
  fileUpload: professor.fileUpload,
  driveFile: professorDrive.driveFile,
  uploadingStatus: professor.uploadingStatus,
  token: auth.token,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getHomeWorkDetail,
      updateProfessorHomework,
      homeWorkFileUpload,
      getProfessorFolderFileList,
      homeWorkDriveFileUploading
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditHomework)