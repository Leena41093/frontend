import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { quizFileUpload, addQuizWithPDFAnswer } from '../../actions/professorActions';
import { successToste, errorToste, infoToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import Viewer from '../common/pdf/viewer';

class ProfessorQuizUploadPdf extends Component {
  constructor(props) {
    super(props);
    this.onGetFile = this.onGetFile.bind(this);
    this.state = {
      file: null,
      pro: {},
      questionArr: [],
      error: {
        isPdfAdd: false,
        isQuestionAdd: false,
        isOptionEnter: [],
        isSelectAns: [],
        fileData: null,
      },
      validateOnInvalidNumber: {},
      batchDeatail: {},
      instituteId: 0,
      fileSizeErrorMsg: false,
      isFileSizeValid: false
    }
  }

  componentWillReceiveProps(nextProps) {

    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        // localStorage.removeItem("instituteid")
        // this.setState({instituteId:nextProps.instituteId},()=>{
        // const pro = this.props.location.state?this.props.location.state.data:"";
        // this.getClassesOfStudent();
        // table.fnDraw()
        this.props.history.push("/app/dashboard");
        // });
      }

    }
  }

  componentDidMount() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    const pro1 = this.props.location.state ? this.props.location.state.data : "";

    const batchDeatail = this.props.location.state ? this.props.location.state.pro1 : "";

    this.setState({ pro, batchDeatail: batchDeatail, instituteId: this.props.instituteId });
  }

  validate() {

    let { error, questionArr } = this.state;
    let isValidForm = true;

    if (questionArr.length == 0) {
      error = { ...error, isQuestionAdd: true };
      isValidForm = false;
    }

    if (!this.state.file) {
      error = { ...error, isPdfAdd: true, fileSizeErrorMsg: false };
      isValidForm = false;
    }

    questionArr.map((question, index) => {
      if (question.ans === "") {
        error.isSelectAns[index] = true;
        isValidForm = false;
      }
      else if (question.option === "") {
        error.isOptionEnter[index] = true;
        isValidForm = false;
      }

    })

    this.setState({ error }, () => {

    });
    return isValidForm;
  }

  onGetFile(e) {
    let { error } = this.state;
    var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : "";
    if (fileSize > 20) {
      this.setState({ fileSizeErrorMsg: true })
    } else {
      error = { ...error, isPdfAdd: false };
      this.setState({ file: e.target.files[0], error, fileSizeErrorMsg: false, isFileSizeValid: false });
      let that = this;
      var reader = new FileReader();
      reader.onload = function () {
        var arrayBuffer = this.result,
          array = new Uint8Array(arrayBuffer),
          binaryString = that.handleCodePoints(array);
        that.setState({ fileData: binaryString });

      }
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  handleCodePoints(array) {
    var CHUNK_SIZE = 0x8000;
    var index = 0;
    var length = array.length;
    var result = '';
    var slice;
    while (index < length) {
      slice = array.slice(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return result;
  }

  addQuestion() {
    let { questionArr, error } = this.state;
    questionArr.push({
      ans: "1",
      option: 4
    })
    error = { ...error, isQuestionAdd: false }
    error.isSelectAns.push(false);
    error.isOptionEnter.push(false);
    this.setState({ questionArr, error }, () => {
      document.getElementById('addbtn').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
  }

  numberOfOption(index, event) {
    let { questionArr, error, validateOnInvalidNumber } = this.state;
    if (event.target.value < 2 || event.target.value > 4) {
      validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: true }
    }
    if (event.target.value == 2) {
      validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: false }
      if (questionArr[index].ans == 3 || questionArr[index].ans == 4) {
        questionArr[index].ans = 1;
        error.isSelectAns[index] = false;
      }
    }

    if (event.target.value == 3) {
      validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: false }
      if (questionArr[index].ans == 4) {
        questionArr[index].ans = 1;
        error.isSelectAns[index] = false;
      }
    }

    if (event.target.value == 4) {
      validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: false }
    }

    error.isOptionEnter[index] = false;
    this.setState({ questionArr, error });

    questionArr[index] = { ...questionArr[index], option: event.target.value }
  }

  handleOptionButton(index, event) {
    let { questionArr, error } = this.state;
    questionArr[index] = { ...questionArr[index], ans: event.target.value }
    error.isSelectAns[index] = false;
    this.setState({ questionArr, error });
  }

  onSaveQuiz() {
    const isValidForm = this.validate();

    if (!isValidForm) {
      return;
    }
    else {
      const pro1 = this.props.location.state ? this.props.location.state.data : "";
      let { pro, questionArr } = this.state;
      let payload = {
        "no_of_questions": "",
        "answer": "",
        "question_no": "",
        "no_of_options": ""
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

      const formData = new FormData();
      formData.append("filename", this.state.file);
      formData.append('class_id', pro.class_id);
      formData.append('subject_id', pro.subject_id);
      formData.append('quiz_id', pro.quiz_id);
      formData.append('subject_folder_id', pro.subject_folder_id);

      let apiData = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: formData
      }
      this.props.quizFileUpload(apiData).then(() => {
        let res = this.props.quizFileUploaded;

        if (res && res.status == 200) {
          payload.quiz_id = pro.quiz_id;
          payload.quiz_file_id = res.data.response.quiz_files_id
          let data = {
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token,
            payload: payload,
          }
          this.props.addQuizWithPDFAnswer(data).then(() => {
            let res = this.props.quizPdfAnswer;
            if (res && res.status == 200) {
              infoToste("PDF Quiz Created Successfully");
              if (this.state.batchDeatail.fromdrive != true) {
                this.props.history.push({
                  pathname: `assign-newquiz`,
                  state: { data: pro1.data, data1: this.state.batchDeatail }
                })
              } else {
                this.props.history.push('/app/professor-drive');
              }
            }
          })
        }
      })
    }
  }

  onDeleteQution(index) {

    let { questionArr } = this.state;
    questionArr.splice(index, 1);
    this.setState({ questionArr });
  }

  onGotoDrive() {
    this.props.history.push("/app/professor-drive")
  }

  onGotoDirectory() {
    const batchDeatail = this.props.location.state ? this.props.location.state.pro1 : "";
    this.props.history.push({
      pathname: `quiz-directory`,
      state: { data: batchDeatail }
    })
  }

  convertDataURIToBinary(raw) {
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  renderFile() {
    let { error, fileData } = this.state;
    if (fileData) {
      return (
        <div style={{ width: "50%" }}>
          <Viewer url={this.convertDataURIToBinary(fileData)} />
        </div>
      )
    } else {
      return (
        <div className="c-card nopad">
          <div className="c-uploadBox">
            <div className="upload--div">
              <div className="upload--div_img"><img src="/images/icon_outbox.png" /></div>
              <div className="upload--div_text">
                Drag and Drop PDF File Here to Upload Or
              <a className="btn--up"><input type="file" accept="application/pdf" onChange={this.onGetFile} />Select File</a>
                {error.isPdfAdd ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Upload File</label> : <br />}
                {this.state.fileSizeErrorMsg == true ? <label className="help-block" style={{ color: "red" }}>Please Select File Less than 20MB.</label> : <br />}
                {/* {this.state.isFileSizeValid == true ? <label className="help-block" style={{ color: "red" }}>Please Select File Less than 20MB.</label> : <br />} */}
              </div>
            </div>
          </div>
        </div>
      )
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
    let { questionArr, error } = this.state;
    return questionArr.map((question, index) => {
      return (
        <div key={"question" + index} className="c-queList__sect" >
          <div className="c-queList__sect__num">{index + 1}</div>
          <div className="queList__header">
            <div className="form-group cust-fld">
              <i className=" icon cg-times linkbtn hover-pointer" style={{ marginLeft: "95%" }} onClick={this.onDeleteQution.bind(this, index)}></i>
              <label>Options</label>
              <input type="number" className="form-control" min="2" max="4" onChange={this.numberOfOption.bind(this, index)} placeholder="Option" />
            </div>
            {error.isOptionEnter[index] ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Enter Number Of Option</label> : <br />}
            {(this.state.validateOnInvalidNumber[index] && this.state.validateOnInvalidNumber[index].isNoValide) ? <label className="help-block" style={{ color: "red" }}>Above Number For Option Is Not Valid</label> : <br />}
          </div>
          {this.renderOption(index)}
          {error.isSelectAns[index] ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Select Correct Answer</label> : <br />}
        </div>
      )
    })
  }

  render() {
    let { error } = this.state;
    return (
      <div className="c-container clearfix">
        <div className="clearfix">
          <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              {this.state.batchDeatail.fromdrive != true ? <div className="c-brdcrum">
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
            <div className="c-card nopad" style={{ overflow: "auto", height: "600px" }}>
              <div className="c-queList" >
                <div className="c-queList__sect" >
                  {this.renderQutionList()}
                </div>
                <div id="addbtn" className="clearfix text-center"><button className="c-btn prime" onClick={this.addQuestion.bind(this)} >Add New Question</button></div>
                {error.isQuestionAdd ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Add Question</label> : <br />}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({
  quizFileUploaded: professor.quizFileUploaded,
  branchId: app.branchId,
  instituteId: app.institudeId,
  quizPdfAnswer: professor.quizPdfAnswer,
  newQuizQuestion: professor.newQuizQuestion,
  token: auth.token,
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      quizFileUpload,
      addQuizWithPDFAnswer,
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorQuizUploadPdf) 