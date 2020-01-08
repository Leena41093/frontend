import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

export class SelectQuizModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cls: {},
      subject: {},
      folderList: [],
      isSubjectSelected: false,
      quizList: [],
      selectedFolder: "folder",
      selected: null,
      selectedQuiz: null,
      pro: {},
      selectedFolderData: {}
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      cls: props.cls,
      subject: props.subject,
      folderList: props.folderList,
      pro: props.pro
    });
  }

  onSelectSuject() {
    this.setState({ isSubjectSelected: true });
  }

  getQuizList(folder) {
    this.setState({ selectedFolderData: folder });
    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        subject_folder_id: folder.subject_folder_id
      }
    };
    this.props.getFolderQuizList(apiData).then(() => {
      let res = this.props.DriveQuizList;
      if (res && res.status == 200) {
        this.setState({ quizList: res.data.response, selectedFolder: "quiz" });
      }
    });
  }

  selectFolder(quiz, index) {
    this.setState({ selected: index, selectedQuiz: quiz }, () => {
      this.state.selectedQuiz;
    });
  }

  selectQuiz() {
    this.props.onSelectQuiz(this.state.selectedQuiz, this.state.pro);
  }

  renderFolderList() {
    let { folderList } = this.state;
    if (folderList && folderList.length > 0) {
      return folderList.map((folder, index) => {
        return (
          <button
            key={"foldernm" + index}
            onClick={this.getQuizList.bind(this, folder)}
            className="unit__btn"
          >
            <i />
            {folder.folder_name}
          </button>
        );
      });
    }
  }

  renderBodyFolder() {
    let { folderList } = this.state;
    if (folderList && folderList.length > 0) {
      return folderList.map((folder, index) => {
        return (
          <button
            key={"folder" + index}
            onClick={this.getQuizList.bind(this, folder)}
            className="folder_unit folder"
          >
            <div className="unit__body">
              <i />
              <span className="unit__header">{folder.folder_name}</span>
            </div>
          </button>
        );
      });
    }
  }

  renderQuizFolder() {
    let { quizList } = this.state;
    if (quizList && quizList.length > 0) {
      return quizList.map((folder, index) => {
        let selec =
          Number(this.state.selected) == index
            ? { background: "#F2F2F5" }
            : { background: "" };
        return (
          <button
            key={"folder" + index}
            style={selec}
            onClick={this.selectFolder.bind(this, folder, index)}
            className="folder_unit file"
          >
            <div className="unit__body dropdown">
              <i />
              <span className="unit__header">{folder.quiz_title}</span>
            </div>
          </button>
        );
      });
    }
  }

  renderBody() {
    if (this.state.selectedFolder == "folder") {
      return <div>{this.renderBodyFolder()}</div>;
    } else {
      return <div>{this.renderQuizFolder()}</div>;
    }
  }

  render() {
    return (
      <div
        className="modal fade custom-modal-lg"
        id="studentDrive"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="icon cg-times" />
              </button>
              <h4 className="c-heading-sm card--title">Submit Quiz</h4>
            </div>
            <div className="modal-body nopad">
              <div className="divider-container drive--section">
                <div className="divider-block text--left d_section_1">
                  <div className="search__sect" />
                  <div className="drive__sect">
                    <div className="clearfix d_sect_parent">
                      <div className="panel panel-default d_sect_child">
                        <div className="panel-heading" role="tab">
                          <a
                            className="panel-title"
                            role="button"
                            data-toggle="collapse"
                            href="#drive_child_1"
                          >
                            <i />
                            {this.state.cls.class_name}
                          </a>
                        </div>
                        <div
                          id="drive_child_1"
                          className="panel-collapse collapse"
                          role="tabpanel"
                        >
                          <div className="panel-body">
                            <div className="clearfix d_sect_parent sect_firstChild">
                              <div className="panel panel-default d_sect_child">
                                <div className="panel-heading" role="tab">
                                  <a
                                    className="panel-title"
                                    onClick={this.onSelectSuject.bind(this)}
                                    role="button"
                                    data-toggle="collapse"
                                    href="#drive_child_1_c1"
                                  >
                                    <i />
                                    {this.state.subject.subject_name}
                                  </a>
                                </div>
                                <div
                                  id="drive_child_1_c1"
                                  className="panel-collapse collapse"
                                  role="tabpanel"
                                >
                                  <div className="panel-body">
                                    <div className="sect__unitlist">
                                      {this.renderFolderList()}
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
                          <span className="c-heading-lg">
                            {this.state.cls.class_name}
                            {this.state.isSubjectSelected == true
                              ? " > " + this.state.subject.subject_name
                              : ""}
                            {this.state.selectedFolderData &&
                            this.state.selectedFolderData.folder_name
                              ? " > " +
                                this.state.selectedFolderData.folder_name
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="drive_dataSect__body">
                      <div style={{ overflow: "auto", height: "400px" }}>
                        <div className="drive_folderSect">
                          {this.state.isSubjectSelected
                            ? this.renderBody()
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal">
                  Cancel
                </button>
                <button
                  className="c-btn primary"
                  onClick={this.selectQuiz.bind(this)}
                >
                  Select Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
