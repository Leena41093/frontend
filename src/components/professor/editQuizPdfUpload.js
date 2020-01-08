import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEditQuizUploadTypeQuestion, updateUploadTypeQuize, downloadQuizFile } from '../../actions/professorActions';
import Viewer from '../common/pdf/viewer';

import { ToastContainer, toast } from 'react-toastify';
import { errorToste, successToste } from '../../constant/util';
import fileDownload from 'js-file-download';

class EditQuizPdfUpload extends Component {
  constructor(props) {
    super(props);
    this.onGetFile = this.onGetFile.bind(this);
    this.state = {
      file: null,
      pro: {},
      questionArr: [],
      quizAnswerDetails: {},
      quizFileDetail: {},
      validateOnInvalidNumber: {},
      instituteId: 0,
      pro1: {}
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
    const pro = this.props.location.state.data ? this.props.location.state.data : "";
    const pro1 = this.props.location.state ? this.props.location.state.pro1 : '';
    this.setState({ pro, instituteId: this.props.instituteId, pro1 });
    this.getQuizData(pro);
  }

  getQuizData(pro) {

    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: { quiz_id: pro.quiz_id },
    }
    this.props.getEditQuizUploadTypeQuestion(apiData).then(() => {
      let res = this.props.uploadtypeQuizData;
      if (res && res.status == 200) {
        if (res.data.response && res.data.response.quizAnswerDetails) {
          this.setState({
            quizAnswerDetails: res.data.response.quizAnswerDetails[0],
            quizFileDetail: res.data.response.quizFileDetail[0],
          }, () => {

            let apiData = {
              institude_id: this.props.instituteId,
              branch_id: this.props.branchId,
              token: this.props.token,
              payload: {
                "quiz_files_id": this.state.quizFileDetail.quiz_files_id,
              }
            }
            this.props.downloadQuizFile(apiData).then(() => {
              let res = this.props.quizFileData;

              if (res && res.data.status == 200) {
                this.setState({ file: res.data.response }, () => {
                })
              } else if (res && res.data.status == 500) {
                errorToste("Something Went Wrong")
              }
            })

            let { quizAnswerDetails, questionArr } = this.state;
            let no_of_option = JSON.parse("[" + quizAnswerDetails.no_of_options + "]");
            let answer = JSON.parse("[" + quizAnswerDetails.answer + "]");
            let marks = JSON.parse("[" + quizAnswerDetails.marks + "]");
            no_of_option.map((option, index) => {
              questionArr.push({
                ans: String(answer[index]),
                option: String(option),
              })
            })
            this.setState({ questionArr, marks });
          })
        }
      }
    })
  }

  onGetFile(e) {
    this.setState({ file: e.target.files[0] });
  }

  addQuestion() {
    let { questionArr, marks } = this.state;
    questionArr.push({
      ans: "1",
      option: "4"
    })
    marks.push(marks[0])
    this.setState({ questionArr, marks }, () => {
      document.getElementById('addbtn').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
  }

  numberOfOption(index, event) {
    let { questionArr, validateOnInvalidNumber } = this.state;
    if (event.target.value < 2 || event.target.value > 4) {
      validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: true }
    }
    if (event.target.value >= 2 && event.target.value <= 4) {
      validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: false }
      questionArr[index] = { ...questionArr[index], ans: 1 }
    }
    questionArr[index] = { ...questionArr[index], option: event.target.value }
    this.setState({ questionArr }, () => {

    });
  }

  handleOptionButton(index, event) {
    let { questionArr } = this.state;
    questionArr[index] = { ...questionArr[index], ans: event.target.value }
    this.setState({ questionArr });
  }

  onSaveQuiz() {
    let { pro, questionArr, quizAnswerDetails } = this.state;
    const pro1 = this.props.location.state ? this.props.location.state.pro1 : '';
    let payload = {
      "no_of_questions": "",
      "answer": "",
      "question_no": "",
      "no_of_options": "",
      "quiz_files_id": "",
      "marks": "",
    }
    let ans = [];
    let option = [];
    let qnumber = [];
    questionArr.map((question, index) => {
      ans.push(question.ans);
      option.push(question.option);
      qnumber.push(index + 1);
    })
    payload.answer = String(ans);
    payload.no_of_options = String(option);
    payload.question_no = String(qnumber);
    payload.no_of_questions = questionArr.length;
    payload.marks = String(this.state.marks);
    payload.quiz_files_id = quizAnswerDetails.quiz_files_id;
    payload.quiz_id = pro.quiz_id;
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      // quiz_id: pro.quiz_id,
      payload: payload,
    }

    this.props.updateUploadTypeQuize(data).then(() => {
      let res = this.props.UploadtypeQuizEdit;
      if (res && res.status == 200) {
        if (pro1.fromDrive == true) {
          this.props.history.push('/app/professor-drive')
        }
        else {
          this.props.history.push({
            pathname: '/app/quiz-directory',
            state: { data: pro1 }
          });
        }
        successToste("Quiz Edited Successfully");
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

  //   var blob = new Blob(byteArrays, {type: contentType});
  //   return blob;
  // }

  // b64toBinary(b64Data, contentType, sliceSize) {
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

  //   return byteArrays;
  // }


  onDeleteQution(index) {
    let { questionArr, marks } = this.state;
    questionArr.splice(index, 1);
    marks.splice(index, 1)
    this.setState({ questionArr, marks });
  }

  onGotoDrive() {
    this.props.history.push('/app/professor-drive')
  }

  onGotoDirectory() {
    const pro1 = this.props.location.state ? this.props.location.state.pro1 : '';
    this.props.history.push({
      pathname: `quiz-directory`,
      state: { data: pro1 }
    })
  }

  // convertDataURIToBinary(raw) {
  //   var raw = atob(raw);
  //   var rawLength = raw.length;
  //   var array = new Uint8Array(new ArrayBuffer(rawLength));
  //   for (var i = 0; i < rawLength; i++) {
  //     array[i] = raw.charCodeAt(i);
  //   }
  //   return array;
  // }

  renderFile() {
    let { file } = this.state;
    if (file) {
      return (
        // <div style={{ width: "50%" }}>
        <iframe src={this.state.file + "#toolbar=0"} style={{ width: "100%", height: "520px" }} frameBorder="0"></iframe>

        // </div>
      )
    } else {
      return false
    }

  }

  renderOption(index) {
    let { questionArr } = this.state;
    let length = Number(questionArr[index].option)
    switch (length) {
      case 2: {
        return (
          <div className="queList__body">
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 1} className="custome-field field-radiobtn">
                  <input type="radio" name={index} onClick={this.handleOptionButton.bind(this, index)} id={"quetion" + index + 1} value="1" checked={questionArr[index].ans == "1" ? true : false} />
                  <i></i> <span>Option 1</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 2} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 2} onClick={this.handleOptionButton.bind(this, index)} value="2" checked={questionArr[index].ans == "2" ? true : false} />
                  <i></i> <span>Option 2</span>
                </label>
              </div>
            </div>
          </div>
        )
        break;
      }
      case 3: {
        return (
          <div className="queList__body">
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 3} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 3} onClick={this.handleOptionButton.bind(this, index)} value="1" checked={questionArr[index].ans == "1" ? true : false} />
                  <i></i> <span>Option 1</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 4} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 4} onClick={this.handleOptionButton.bind(this, index)} value="2" checked={questionArr[index].ans == "2" ? true : false} />
                  <i></i> <span>Option 2</span>
                </label>
              </div>
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 5} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 5} onClick={this.handleOptionButton.bind(this, index)} value="3" checked={questionArr[index].ans == "3" ? true : false} />
                  <i></i> <span>Option 3</span>
                </label>
              </div>
            </div>
          </div>
        )
        break;
      }
      case 4: {
        return (
          <div className="queList__body">
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 6} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 6} onClick={this.handleOptionButton.bind(this, index)} value="1" checked={questionArr[index].ans == "1" ? true : false} />
                  <i></i> <span>Option 1</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 7} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 7} onClick={this.handleOptionButton.bind(this, index)} value="2" checked={questionArr[index].ans == "2" ? true : false} />
                  <i></i> <span>Option 2</span>
                </label>
              </div>
            </div>
            <div className="divider-container">
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 8} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 8} onClick={this.handleOptionButton.bind(this, index)} value="3" checked={questionArr[index].ans == "3" ? true : false} />
                  <i></i> <span>Option 3</span>
                </label>
              </div>
              <div className="divider-block text--left">
                <label htmlFor={"quetion" + index + 9} className="custome-field field-radiobtn">
                  <input type="radio" name={index} id={"quetion" + index + 9} onClick={this.handleOptionButton.bind(this, index)} value="4" checked={questionArr[index].ans == "4" ? true : false} />
                  <i></i> <span>Option 4</span>
                </label>
              </div>
            </div>
          </div>
        )
        break;
      }
    }
  }

  renderQutionList() {
    let { questionArr } = this.state;
    return questionArr.map((question, index) => {
      return (
        <div key={"question" + index} className="c-queList__sect">
          <div className="c-queList__sect__num">{index + 1}</div>
          <div className="queList__header">
            <div className="form-group cust-fld">
              <i className=" icon cg-times linkbtn hover-pointer" style={{ marginLeft: "95%" }} onClick={this.onDeleteQution.bind(this, index)}></i>
              <label>Options</label>
              <input type="number" className="form-control" min="1" max="4" value={question.option} onChange={this.numberOfOption.bind(this, index)} placeholder="Option" />
              {(this.state.validateOnInvalidNumber[index] && this.state.validateOnInvalidNumber[index].isNoValide) ? <label className="help-block" style={{ color: "red" }}>Above Number For Option Is Not Valid</label> : <br />}
            </div>
          </div>
          {this.renderOption(index)}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              {this.state.pro1.fromDrive != true ? <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.onGotoDirectory.bind(this)}>Back to All Quizzes</a>
              </div> : <div className="c-brdcrum">
                  <a className="linkbtn hover-pointer" onClick={this.onGotoDrive.bind(this)}>Back to Drive</a>
                </div>}

            </div>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">{this.state.pro.data ? this.state.pro.data.quiz_title : ""}</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" onClick={this.onSaveQuiz.bind(this)}>Save Quiz</button>
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="card-container">
            {this.renderFile()}
            <div className="c-card nopad" style={{ overflow: "auto", height: "545px" }}>
              <div className="c-queList">
                <div className="c-queList__sect" id="questionlist">
                  {this.renderQutionList()}
                </div>
                <div className="clearfix text-center" id="addbtn"><button className="c-btn prime" onClick={this.addQuestion.bind(this)}  >Add New Question</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  uploadtypeQuizData: professor.uploadtypeQuizData,
  UploadtypeQuizEdit: professor.UploadtypeQuizEdit,
  quizFileData: professor.quizFileData,
  token: auth.token,
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getEditQuizUploadTypeQuestion,
      updateUploadTypeQuize,
      downloadQuizFile,
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditQuizPdfUpload) 