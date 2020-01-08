import React, { Component } from 'react';
import $ from "jquery";
export class SelectHomeworkModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cls: {},
      subject: {},
      folder: {},
      files: [],
      selectedFiles: {},
      isSelected: [],
      folderSelcted: "",
      flag: "",
      subjectId: "",
      clsSubjects: [],
      folderArr: [],
      selectFolderdata:{}
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ cls: props.cls, subject: props.subject, subjectId: props.subject_id, folder: props.folder, flag: props.flag }, () => {
    });
  }

  onSelectSubject() {
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: { subject_id: this.state.subjectId },
    }
    this.props.getFolderNameList(apiData).then(() => {
      let res = this.props.folderList;

      if (res && res.status == 200) {
        this.setState({ folderArr: res.data.response });
      }
    })
  }

  onSelectFolder(folder) {
    let { isSelected, flag } = this.state;
    this.setState({selectFolderdata:folder})
    let data = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "subject_folder_id": folder.subject_folder_id,
      }
    }
    this.props.getProfessorFolderFileList(data).then(() => {
      let res = this.props.driveFile;

      if (res && res.status == 200) {

        if (flag == "notes") {

          this.setState({ files: res.data.response.notesFiles }, () => {
            if (this.state.files && this.state.files.length > 0) {
              this.state.files.map((file, index) => {
                isSelected[index] = false
              })
              this.setState({ isSelected });
            }
          });
        } else {

          this.setState({ files: res.data.response.homeWorkFiles }, () => {
            if (this.state.files && this.state.files.length > 0) {
              this.state.files.map((file, index) => {
                isSelected[index] = false
              })
              this.setState({ isSelected });
            }
          });
        }

      }
    })
  }

  onSelectFile(file, index) {
    let { selectedFiles, isSelected, flag } = this.state;
    if (flag == "notes") {
      this.setState({ selectedFiles: file, isSelected })
    } else {
      this.setState({ selectedFiles: file, isSelected });
    }
    
  }

  onGetFile() {
    let { selectedFiles } = this.state;
    $("#homeworkDrivePopUp .close").click();
    this.props.onSelectFiles(selectedFiles);
    
  }

  renderHomeworkFile() {
    let { files, isSelected, flag } = this.state;
    if (files && files.length > 0) {

      return files.map((file, index) => {
        if (flag == "notes") {
          let select = this.state.selectedFiles.notes_file_id == file.notes_file_id ? { background: "#F2F2F5" } : { background: "" };
          return (
            <div key={"homeworkfile" + index} style={select} onClick={this.onSelectFile.bind(this, file, index)} className="folder_unit file">
              <div className="unit__body dropdown">
                <i></i>
                <span className="unit__header">{file.file_name}</span>
                <div className="unit__info">
                </div>
              </div>
            </div>
          )
        } else {
          let select = this.state.selectedFiles.homework_file_id == file.homework_file_id ? { background: "#F2F2F5" } : { background: "" };
          return (
            <div key={"homeworkfile" + index} style={select} onClick={this.onSelectFile.bind(this, file, index)} className="folder_unit file">
              <div className="unit__body dropdown">
                <i></i>
                <span className="unit__header">{file.file_name}</span>
                <div className="unit__info">
                </div>
              </div>
            </div>
          )
        }

      })
    }
  }

  renderFolders() {
    if (this.state.folderArr && this.state.folderArr.length > 0) {
      return this.state.folderArr.map((folder, index) => {
        return (
          // <li key={"key" + index}>
          <button onClick={this.onSelectFolder.bind(this, folder)} className="unit__btn"><i></i>{folder.folder_name}</button>
          // </li>
        )
      })
    }
  }

  render() {
    return (
      <div className="modal fade custom-modal-lg" id="homeworkDrivePopUp" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">{`Select ${this.state.flag}`}</h4>
            </div>
            <div className="modal-body nopad">
              <div className="divider-container drive--section">
                <div className="divider-block text--left d_section_1">
                  <div className="search__sect">
                   
                  </div>
                  <div className="drive__sect">
                    <div className="clearfix d_sect_parent">
                      <div className="panel panel-default d_sect_child">
                        <div className="panel-heading" role="tab">
                          <a className="panel-title" role="button" data-toggle="collapse" href="#drive_child_1">
                            <i></i>{this.state.cls && this.state.cls.class_name ? this.state.cls.class_name : ""}
                          </a>
                        </div>
                        <div id="drive_child_1" className="panel-collapse collapse" role="tabpanel">
                          <div className="panel-body">
                            <div className="clearfix d_sect_parent sect_firstChild">
                              <div className="panel panel-default d_sect_child">
                                <div className="panel-heading" role="tab">
                                  <a className="panel-title" onClick={this.onSelectSubject.bind(this)} role="button" data-toggle="collapse" href="#drive_child_1_c1">
                                    <i></i>{this.state.subject && this.state.subject.subject_name ? this.state.subject.subject_name : ""}
                                  </a>
                                </div>
                                <div id="drive_child_1_c1" className="panel-collapse collapse" role="tabpanel">
                                  <div className="panel-body">
                                    <div className="sect__unitlist">
                                      {this.renderFolders()}
                                      {/* <button className="unit__btn" onClick={this.onSelectFolder.bind(this)} ><i></i>{this.state.folder && this.state.folder.folder_name ? this.state.folder.folder_name : ""}</button> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="divider-block text--left d_section_2">
                  <div className="drive_dataSect">
                    <div className="drive_dataSect__head">
                      <div className="divider-container">
                        <div className="divider-block text--left">
                          <span className="c-heading-lg">{this.state.cls.class_name}{this.state.subject && this.state.subject.subject_name ? " > "+this.state.subject.subject_name : ""}{this.state.selectFolderdata && this.state.selectFolderdata.folder_name ? " > "+this.state.selectFolderdata.folder_name : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="drive_dataSect__body">
                      <div style={{ overflow: "auto", height: "400px" }}>
                        <div className="drive_folderSect">
                          {this.renderHomeworkFile()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal">Cancel</button>
                <button className="c-btn primary" onClick={this.onGetFile.bind(this)} >Select File</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
