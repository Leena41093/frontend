import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'bootstrap-datepicker';
import { getProfessorQuizPreview, downloadQuizFile } from '../../actions/professorActions';
import { errorToste, } from '../../constant/util';
import Viewer from '../common/pdf/viewer';
import { ToastContainer } from 'react-toastify';

class ProfessorPdfTypeResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
      result: {},
      studentAnswer: [],
      correctAnswer: [],
      quizOptions: [],
      pdfData: null,
      pro: {},
      files: {},
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
    const pro = this.props.location.state ? this.props.location.state.data : "";
    const pro1 = this.props.location.state ? this.props.location.state.dataOfTable : "";
    const batchDetail = this.props.location.state ? this.props.location.state.batchDetail : "";
    this.getQuizResultData(pro, pro1);
  }

  getQuizResultData(pro, pro1) {
    let data = {
      payload: {
        batch_quiz_id: pro.batch_quiz_id,
        student_id: pro1.id
      },
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorQuizPreview(data).then(() => {
      let res = this.props.professorQuizPreview;

      if (res && res.data.status == 200) {
        this.setState({
          result: res.data.response.quizDetails[0],
          files: res.data.response.quizFile[0],
          correctAnswer: JSON.parse("[" + res.data.response.quizDetails[0].right_answers + "]"),
          studentAnswer: JSON.parse("[" + res.data.response.quizDetails[0].student_answers + "]"),
          quizOptions: JSON.parse("[" + res.data.response.quizDetails[0].quizOptions + "]")
        }, () => {
          this.downloadQuizData();
        })
      }
    })
  }

  downloadQuizData() {
    let { files } = this.state;
    if (files && files.quiz_files_id) {
      let data = {
        payload: {
          quiz_files_id: files.quiz_files_id
        },
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
      }
      this.props.downloadQuizFile(data).then(() => {
        let res = this.props.quizFileData;
        if (res && res.data.status == 200) {
          this.setState({ pdfData: res.data.response });
        } else if (res && res.data.status == 500) {
          errorToste('Something Went Wrong')
        }
      })
    }
  }

  getClass(correctAns, studentAns, label, options) {
    if (studentAns === "0") {
      return "custome-field field-radiobtn"
    }
    else if (correctAns == studentAns) {
      if (correctAns == label) {
        return "custome-field field-radiobtn st-correctAns"
      }
    }
    else if (correctAns == label) {
      return "custome-field field-radiobtn st-correctAns"
    }
    else if (studentAns == label) {
      return "custome-field field-radiobtn st-wrongAns"
    }

    return "custome-field field-radiobtn"

  }

  gotoQuizDetail() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    const batchDetail = this.props.location.state ? this.props.location.state.batchDetail : "";
    this.props.history.push({
      pathname: '/app/quiz-detail',
      state: { data: pro, data1: batchDetail }
    });
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
    let { pdfData } = this.state;
    if (pdfData) {
      return (
        // <div style={{ width: "50%" }}>
        <iframe src={this.state.pdfData + "#toolbar=0"} style={{ width: "100%", height: "500px" }} frameBorder="0"></iframe>
        // </div>
      )
    } else {
      return false
    }
  }



  renderQuizQueAns() {
    let { correctAnswer, studentAnswer, quizOptions } = this.state;
    if (correctAnswer && correctAnswer.length > 0) {
      return correctAnswer.map((correctAns, index) => {
        return (
          <div key={"correctans" + index} className="c-queList__sect">
            <div className="c-queList__sect__num">{index + 1}</div>
            <div className="queList__body">
              <div className="divider-container">
                {0 < quizOptions[index] ?
                  <div className="divider-block text--left">

                    <label htmlFor={"queList-" + index + 1} className={this.getClass(correctAns, studentAnswer[index], 1)}>
                      <input type="radio" name={"queList-" + index} id={"queList-" + index + 1} value="checkone" checked={studentAnswer[index] == "1" ? true : false} disabled />
                      <i></i> <span>Option 1</span>
                    </label>
                  </div> : ""}
                {1 < quizOptions[index] ?
                  <div className="divider-block text--left">
                    <label htmlFor={"queList-" + index + 2} className={this.getClass(correctAns, studentAnswer[index], 2)}>
                      <input type="radio" name={"queList-" + index} id={"queList-" + index + 2} value="checkone" checked={studentAnswer[index] == "2" ? true : false} disabled />
                      <i></i> <span>Option 2</span>
                    </label>
                  </div> : ""}
              </div>
              <div className="divider-container">
                {2 < quizOptions[index] ?
                  <div className="divider-block text--left">
                    <label htmlFor={"queList-" + index + 3} className={this.getClass(correctAns, studentAnswer[index], 3)}>
                      <input type="radio" name={"queList-" + index} id={"queList-" + index + 3} value="checkone" checked={studentAnswer[index] == "3" ? true : false} disabled />
                      <i></i> <span>Option 3</span>
                    </label>
                  </div> : ""}
                {3 < quizOptions[index] ?
                  <div className="divider-block text--left">
                    <label htmlFor={"queList-" + index + 4} className={this.getClass(correctAns, studentAnswer[index], 4)}>
                      <input type="radio" name={"queList-" + index} id={"queList-" + index + 4} value="checkone" checked={studentAnswer[index] == "4" ? true : false} disabled />
                      <i></i> <span>Option 4</span>
                    </label>
                  </div> : ""}
              </div>
            </div>
          </div>
        )
      })
    }
  }

  render() {
    let { result } = this.state;
    const pro = this.props.location.state.data;

    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.gotoQuizDetail.bind(this)} >Back to Quiz Detail</a>
              </div>
            </div>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">{pro.topic ? pro.topic : ""} {result ? <span className="c-count st-green lg">{result.status}</span> : ""}</span>
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="card-container">

            {this.renderFile()}
            {/* <div className="c-pdf-viewer"></div> */}

            <div className="c-card nopad">
              <div className="c-queList" style={{ overflow: "auto", height: "500px" }}>
                {result ?
                  <div className="clearfix margin25-bottom">
                    <div className="block-title st-colored noborder">MARKS</div>
                    <div className="c-marks-block">
                      <span className="marks-detl">{(result.student_marks ? result.student_marks : 0) + "/" + (result.total_marks ? result.total_marks : 0)}</span>
                    </div>
                  </div> : ""}

                {this.renderQuizQueAns()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, professor }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  professorQuizPreview: professor.professorQuizPreview,
  quizFileData: professor.quizFileData,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getProfessorQuizPreview,
    downloadQuizFile
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorPdfTypeResult)    