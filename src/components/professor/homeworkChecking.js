import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStudentHomeWorkChecking, homeWorkSubmission, downLoadHomeWorkFile, downLoadStudentHomeWorkSubmissionFile, saveHomeworkAnnotation } from '../../actions/professorActions';
import $ from 'jquery';
import 'bootstrap-datepicker';
import Viewer from '../common/pdf/viewer';
import { successToste, errorToste, infoToste } from '../../constant/util';
import fileDownload from 'js-file-download';
import { ToastContainer, toast } from 'react-toastify';

class HomeWorkChecking extends Component {

  constructor(props) {
    super(props);
    this.state = {
      studentPdfList: [],
      professorPdfList: [],
      totalMarks: 0,
      obtainMarks: 0,
      marks: 0,
      pro: {},
      pdfData: null,
      status1: "",
      pdfCommentArr: [],
      pdfComment: [],
      isClean: false,
      disabledFinishChecking: false,
      finishCheckingFlag: true,
      resetFlag: true,
      instituteId:0
    }
  }
  componentWillReceiveProps(nextprops) {
    let id  = localStorage.getItem("instituteid");
		if(id == nextprops.instituteId){
    if(this.state.instituteId != nextprops.instituteId){
			// localStorage.removeItem("instituteid")
      // this.setState({instituteId:nextProps.instituteId},()=>{
				// const pro = this.props.location.state?this.props.location.state.data:"";
				// this.getClassesOfStudent();
				// table.fnDraw()
				this.props.history.push("/app/dashboard");
      // });
		}
	
    }
    // if (nextprops.homeworkAnnotation == null) {
     // this.setState({ marks: 0, obtainMarks: 0 })
      // if(nextprops.homeworkAnnotation.data.response.length==0){
      //   this.setState({marks:0,obtainMarks:0})
      // }
    // }
  }

  componentDidMount() {
    this.setState({instituteId:this.props.instituteId})
    if ($(".c-calculator").length) {
      var displayBox = document.getElementById("display"), hasEvaluated = !1; function clickNumbers(i) { "0" === displayBox.innerHTML || !0 === hasEvaluated && !isNaN(displayBox.innerHTML) ? displayBox.innerHTML = i : displayBox.innerHTML += i, hasEvaluated = !1 } function evaluate() { displayBox.innerHTML = displayBox.innerHTML.replace(",", ""), displayBox.innerHTML = displayBox.innerHTML.replace("×", "*"), displayBox.innerHTML = displayBox.innerHTML.replace("÷", "/"), -1 !== displayBox.innerHTML.indexOf("/0") && ($("button").prop("disabled", !1), $(".clear").attr("disabled", !1), displayBox.innerHTML = "Division by 0 is undefined!"); var evaluate = eval(displayBox.innerHTML); -1 !== evaluate.toString().indexOf(".") && (evaluate = evaluate.toFixed(5)), checkLength(evaluate), displayBox.innerHTML = evaluate } function checkLength(i) { i.toString().length > 7 && i.toString().length < 14 || i.toString().length > 16 && (i = "Infinity", $("button").prop("disabled", !0), $(".clear").attr("disabled", !1)) } function trimIfNecessary() { var i = displayBox.innerHTML.length; i > 7 && i < 14 || i > 14 && (displayBox.innerHTML = "Infinity", $("button").prop("disabled", !0), $(".clear").attr("disabled", !1)) } $("#plus_minus").click(function () { eval(displayBox.innerHTML) > 0 ? displayBox.innerHTML = "-" + displayBox.innerHTML : displayBox.innerHTML = displayBox.innerHTML.replace("-", "") }), $("#clear").click(function () { displayBox.innerHTML = "0", $("button").prop("disabled", !1) }), $("#one").click(function () { checkLength(displayBox.innerHTML), clickNumbers(1) }), $("#two").click(function () { checkLength(displayBox.innerHTML), clickNumbers(2) }), $("#three").click(function () { checkLength(displayBox.innerHTML), clickNumbers(3) }), $("#four").click(function () { checkLength(displayBox.innerHTML), clickNumbers(4) }), $("#five").click(function () { checkLength(displayBox.innerHTML), clickNumbers(5) }), $("#six").click(function () { checkLength(displayBox.innerHTML), clickNumbers(6) }), $("#seven").click(function () { checkLength(displayBox.innerHTML), clickNumbers(7) }), $("#eight").click(function () { checkLength(displayBox.innerHTML), clickNumbers(8) }), $("#nine").click(function () { checkLength(displayBox.innerHTML), clickNumbers(9) }), $("#zero").click(function () { checkLength(displayBox.innerHTML), clickNumbers(0) }), $("#decimal").click(function () { (-1 === displayBox.innerHTML.indexOf(".") || -1 !== displayBox.innerHTML.indexOf(".") && -1 !== displayBox.innerHTML.indexOf("+") || -1 !== displayBox.innerHTML.indexOf(".") && -1 !== displayBox.innerHTML.indexOf("-") || -1 !== displayBox.innerHTML.indexOf(".") && -1 !== displayBox.innerHTML.indexOf("×") || -1 !== displayBox.innerHTML.indexOf(".") && -1 !== displayBox.innerHTML.indexOf("÷")) && clickNumbers(".") }), $("#add").click(function () { evaluate(), checkLength(displayBox.innerHTML), displayBox.innerHTML += "+" }), $("#subtract").click(function () { evaluate(), checkLength(displayBox.innerHTML), displayBox.innerHTML += "-" }), $("#multiply").click(function () { evaluate(), checkLength(displayBox.innerHTML), displayBox.innerHTML += "×" }), $("#divide").click(function () { evaluate(), checkLength(displayBox.innerHTML), displayBox.innerHTML += "÷" }), $("#square").click(function () { var i = Number(displayBox.innerHTML); checkLength(i *= i), displayBox.innerHTML = i }), $("#sqrt").click(function () { var i = parseFloat(displayBox.innerHTML); i = Math.sqrt(i), displayBox.innerHTML = Number(i.toFixed(5)) }), $("#equals").click(function () { evaluate(), hasEvaluated = !0 });

    }

    const pro = this.props.location.state ? this.props.location.state.data : null;
    if (pro != null) {

      let apiData = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: {
          "student_id": pro.student_id,
          "batch_homework_id": pro.batch_homework_id,
          "student_homework_submission_id": pro.studentHomeworkSubmission_id,
          "home_work_id": pro.homework_id,
        }
      }
      this.props.getStudentHomeWorkChecking(apiData).then(() => {

        let res = this.props.studentChecking;
        if (res && res.status == 200) {


          this.setState({
            studentPdfList: res.data.response ? res.data.response.StudentFiles : "",
            professorPdfList: res.data.response ? res.data.response.QuestionFiles : "",
            pro,
            totalMarks: pro.total_marks,
            finishCheckingFlag: pro.total_marks == 0 ? false : true,
            status1: pro.status,
            obtainMarks: pro.marks_obtained && pro.marks_obtained != "-" ? pro.marks_obtained : 0,
          }, () => {
            this.getFileData(this.state.studentPdfList ? this.state.studentPdfList[0] : "")
          });
        }
      })
    }
    else {
      return (
        <div><h1 className="text-center">Data Not Found Please Go Back And Try Again</h1></div>
      )
    }
  }

  getFileData(file) {

    if (file && file.student_home_work_submission_file_id) {
      let data = {
        institude_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: { "Student_home_work_submission_file_id": file.student_home_work_submission_file_id },
      }
      this.props.downLoadStudentHomeWorkSubmissionFile(data).then(() => {
        let res = this.props.studentSubmissionFile;
        if (res && res.status == 200) {

          let Fdata = this.b64toBlob(res.data.response.pdfData);
          // fileDownload(Fdata, file.file_name);
          this.setState({ pdfData: res.data.response.pdfData, pdfComment: res.data.response.annotationData })

        }
      })
    }
  }

  getProfessorFileData(file) {

    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        homework_file_id: file.homework_file_id,
      }
    }

    this.props.downLoadHomeWorkFile(data).then(() => {
      let res = this.props.downloadFileData;
     
      if (res && res.status == 200) {

        // fileDownload(new Blob([res.data]), file.file_name);
        
      }
    })
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  finishChecking() {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    var arr2 = [];
    var disply = 0;
    var marks = 0;
    if(this.state.marks && this.state.marks.length > 0){
    this.state.marks.forEach((item, index) => {
      if ((index + 2) % 2 == 0) {

      }
      else {
        arr2.push(item);
      }
    })
    disply = arr2.reduce(reducer);
    marks = disply;
  }
    if (this.state.totalMarks == 0) {

      this.setState({ obtainMarks: disply },()=>{
        const pro = this.state.pro
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "homework_file_id": this.state.professorPdfList[0] ? this.state.professorPdfList[0].homework_file_id : "",
        "total_marks": this.state.obtainMarks,
        "student_homework_submission_id": this.state.pro.studentHomeworkSubmission_id,
      }
    }

    if (this.state.studentPdfList[0]) {
      this.addComments(apiData, () => {
        this.props.homeWorkSubmission(apiData).then(() => {
          let res = this.props.homeworkSubmission;

          if (res && res.status == 200) {
            successToste("Checking Completed Successfully");
            this.props.history.push({
              pathname: '/app/homework-detail',
              state: { data: pro , pros:this.props.location.state ? this.props.location.state.pros : ''}
            });
          }
        })
      })
    }
      })
      $("#quizSubmit .close").click();
    }
    else {

      if (Number(marks) <= this.state.totalMarks) {

        this.setState({ obtainMarks: disply, finishCheckingFlag: false, resetFlag: false },()=>{
          const pro = this.state.pro
    let apiData = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "homework_file_id": this.state.professorPdfList[0] ? this.state.professorPdfList[0].homework_file_id : "",
        "total_marks": this.state.obtainMarks,
        "student_homework_submission_id": this.state.pro.studentHomeworkSubmission_id,
      }
    }

    if (this.state.studentPdfList[0]) {
      this.addComments(apiData, () => {
        this.props.homeWorkSubmission(apiData).then(() => {
          let res = this.props.homeworkSubmission;

          if (res && res.status == 200) {
            successToste("Checking Completed Successfully");
            this.props.history.push({
              pathname: '/app/homework-detail',
              state: { data: pro , pros:this.props.location.state ? this.props.location.state.pros : ''}
            });
          }
        })
      })
    }
    });
      $("#quizSubmit .close").click();
      } else {
        $("#quizSubmit .close").click();
        let msg = "Obtain Marks Can Not Be Greater Than Total Marks : " + this.state.totalMarks;
        errorToste(msg);
      }
    }

    
  }

  addComments(apiData, cb) {

    let pro = this.state.pro;
    let json_file = [];
    this.state.pdfCommentArr.map(com => {
      let json = {
        "id": com.id,
        "comment": {
          "emoji": com.comment.emoji,
          "text": com.comment.text
        },
        "content": {
          "text": com.content.text
        },
        "position": {
          "pageNumber": com.position.pageNumber,
          "boundingRect": {
            "height": com.position.boundingRect.height,
            "width": com.position.boundingRect.width,
            "x1": com.position.boundingRect.x1,
            "x2": com.position.boundingRect.x2,
            "y1": com.position.boundingRect.y1,
            "y2": com.position.boundingRect.y2
          },
          "rects": [{
            "height": com.position.rects[0].height,
            "width": com.position.rects[0].width,
            "x1": com.position.rects[0].x1,
            "x2": com.position.rects[0].x2,
            "y1": com.position.rects[0].y1,
            "y2": com.position.rects[0].y2
          }]
        }
      }
      json_file.push(json)
    });

    let data = {
      "class_id": pro.class_id,
      "subject_id": pro.subject_id,
      "batch_id": pro.batch_id,
      "home_work_id": pro.homework_id,
      "batch_homework_id": pro.batch_homework_id,
      "student_home_work_submission_file_id": this.state.studentPdfList[0].student_home_work_submission_file_id,
      "json_file": json_file
    }
    let finalData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: data
    }


    this.props.saveHomeworkAnnotation(finalData)
      .then(() => {

        let res = this.props.homeworkAnnotation;
        if (res && res.status == 200) {
          //annotation does not added yet
          cb()
        } else {

        }
      });


  }

  renderQuestionFileList() {
    let { professorPdfList } = this.state;
    if (professorPdfList && professorPdfList.length > 0) {
      return professorPdfList.map((file, index) => {
        return (
          <a key={"file" + index} className="linkbtn" onClick={this.getProfessorFileData.bind(this, file)} ><i className="icon cg-pdf" ></i>{file.file_name}</a>
        )
      })
    }
  }

  renderFileList() {
    // const pro = this.props.location.state.data ? this.props.location.state.data : null;
    let { studentPdfList } = this.state;
    if (studentPdfList && studentPdfList.length > 0) {
      return studentPdfList.map((file, index) => {
        return (
          <a key={"file" + index} className="linkbtn " onClick={this.getFileData.bind(this, file)} ><i className="icon cg-pdf " >{file.file_name}
          </i></a>
          // <div className="container">

          //   <i className="icon cg-pdf" ></i><a style={{color:"#990000",fontSize:"13px",fontWeight:"700"}} href="#demo" className="" data-toggle="collapse">{pro.firstname.slice(0,5)+"..."+pro.roll_no}</a>
          //   <div id="demo" className="collapse" style={{color:"#990000",fontSize:"13px"}}>
          //     {pro.firstname+" "+pro.lastname+" "+pro.title+" "+pro.roll_no}
          //  </div> 
          // </div>
        )
      })
    }
  }


  renderPDF() {
    let { pdfData } = this.state;
    // var pdfData = atob(
    //   'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
    //   'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
    //   'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
    //   'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
    //   'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
    //   'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
    //   'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
    //   'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
    //   'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
    //   'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
    //   'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
    //   'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
    //   'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');

    // var input = [{
    //   "id": "8447711896437291",
    //   "pageNumber": 1,
    //   "comment": {
    //     "emoji": "",
    //     "text": "helllooo"
    //   },
    //   "content": {
    //     "text": "World"
    //   },
    //   "position": {
    //     "boundingRect": {
    //       "height": 333.3333333333333,
    //       "width": 333.3333333333333,
    //       "x1": 139.65753173828125,
    //       "x2": 202.6611328125,
    //       "y1": 228,
    //       "y2": 251
    //     },
    //     "rects": [{
    //       "height": 333.3333333333333,
    //       "width": 333.3333333333333,
    //       "x1": 139.65753173828125,
    //       "x2": 202.6611328125,
    //       "y1": 228,
    //       "y2": 251
    //     }]
    //   }
    // }]
    let { pdfComment } = this.state
    let comment = [];
    if (pdfComment.length > 0) {
      pdfComment = pdfComment.replace(/}{/gi, '}||{');
      pdfComment = pdfComment.replace(/},{/gi, '}||{');
      let pdfStrArr = pdfComment.split("||");

      pdfStrArr.map((str) => {
        comment.push(JSON.parse(str))
      })
    } else {
      comment = []
    }

    if (pdfData) {

      return <Viewer
        url={this.convertDataURIToBinary(pdfData)}
        onComment={(data) => this.onComment(data)}
        input={comment}
        showSidebar={this.state.status1 == "checked" ? false : true}
        showTip={this.state.status1 != "checked"}
        renderMarker={this.state.status1 == "checked" ? false : true}
        renderMarkerForWeb={this.state.status1 == "checked" ? false : true}
        chnageMarksWeb={(marks) => { this.chnageMarksWeb(marks) }}
        resetFlag={this.state.resetFlag}
      />
    }
    else {
      return false;
    }
  }
  chnageMarksWeb(marks) {

  }
  onComment(data) {

    let score = [];
    data.map((marks, index) => {
      if (!isNaN(Number(marks.comment.text))) {
        score.push("+");
        score.push(Number(marks.comment.text));

      } else {

      }
    })
    this.setState({ marks: score, pdfCommentArr: data });
  }


  convertDataURIToBinary(raw) {
    var raw = atob(raw);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  // onChangePage() {
  //   const pro = this.props.location.state ? this.props.location.state.pros : '';
  //   this.props.history.push({
  //     pathname: '/app/homework-directory',
  //     state:{data:pro}
  //   })
  // }

  addMarks() {

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    var arr2 = [];
    var disply = 0;
    let marks = 0;
    if(this.state.marks && this.state.marks.length > 0){
    this.state.marks.forEach((item, index) => {
      if ((index + 2) % 2 == 0) {

      }
      else {
        arr2.push(item);
      }
    })
     disply = arr2.reduce(reducer);
     marks = disply;
  }
    if (this.state.totalMarks == 0) {

      this.setState({ obtainMarks: disply })
      $("#quizSubmit .close").click();
    }
    else {

      if (Number(marks) <= this.state.totalMarks) {

        this.setState({ obtainMarks: disply, finishCheckingFlag: false, resetFlag: false });
        $("#quizSubmit .close").click();
      } else {
        $("#quizSubmit .close").click();
        let msg = "Obtain Marks Can Not Be Greater Than Total Marks : " + this.state.totalMarks;
        errorToste(msg);
      }
    }


  }

  deleteMarks() {
    this.setState({ pdfComment: [], pdfCommentArr: [], obtainMarks: 0, isClean: true });
  }

  render() {
    return (
      <div className="c-container clearfix">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a onClick={() => { this.props.history.push({ pathname: '/app/homework-detail', state: { data: this.state.pro , pros:this.props.location.state ? this.props.location.state.pros : ''} }) }} href="javascript:void(0)">Back to Homework Detail</a>
              </div>
            </div>
          </div>
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">{this.state.pro.roll_no || this.state.pro.firstname || this.state.pro.lastname ? this.state.pro.roll_no + " " + this.state.pro.firstname + " " + this.state.pro.lastname : ""}</span>
            </div>
            <div className="divider-block text--right">
              {/* <button className="c-btn grayshade">Save & Close</button> */}
              {this.state.status1 == "checked" ?
                <button className="c-btn grayshade" onClick={() => { this.props.history.push({ pathname: '/app/homework-detail', state: { data: this.state.pro , pros:this.props.location.state ? this.props.location.state.pros : ''} }) }}>Back</button>
                :
                <div>
                  <button className="c-btn grayshade" onClick={() => { this.props.history.push({ pathname: '/app/homework-detail', state: { data: this.state.pro , pros:this.props.location.state ? this.props.location.state.pros : ''} }) }}>Back</button>
                  <button className={this.state.finishCheckingFlag ? "c-btn grayshade" : "c-btn prime btn"} style={{ color: "white" }} onClick={this.finishChecking.bind(this)} disabled={this.state.finishCheckingFlag}>Finish Checking</button>
                </div>
              }
            </div>
          </div>
        </div>

        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-3 col-sm-12 col-xs-12">
              <div className="block-title st-colored noborder">ACTIONS</div>
              <div className="clearfix margin25-bottom">
                <div className="clearfix">
                  <div className="c-calculator clearfix">
                    <div className="form-group static-fld">
                      <label>Total Marks</label>
                      <div >
                      {this.state.totalMarks == 0 ?  <span className="totalMarksIfZero">{this.state.obtainMarks}</span> :
                      <div className="c-totalMarks">
                        <span>{this.state.obtainMarks}</span>
                        <span>{this.state.totalMarks}</span>
                      </div>
                      }
                      </div>
                    </div>

                    {this.state.status1 != "checked" ?
                      <div>
                        <div className="displayBox">
                          <p className="displayText" id="display">{this.state.marks}</p>
                        </div>
                        <div className="numberPad clearfix">
                         
                          <div className="num--row">
                            
                            <button data-toggle="modal" data-target="#quizSubmit" className="eb-btn pull-right">=</button>
                          </div>
                        </div>
                      </div>
                      : <div></div>}

                  </div>
                </div>
              </div>
              <div className="clearfix btn--listing">
                <div className="block-title st-colored">QUESTION FILES</div>
                {this.renderQuestionFileList()}
                <br />
                <div className="block-title st-colored">ANSWER FILES</div>
                {this.renderFileList()}
              </div>

            </div>
            <div className="col-md-9 col-sm-12 col-xs-12">
              <div className="block-title st-colored noborder">HOMEWORK</div>
              <div className="c-container__data">

                {this.renderPDF()}

              </div>
            </div>
          </div>
        </div>
        <div className="modal fade custom-modal-sm width--sm" id="quizSubmit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                <h4 className="c-heading-sm card--title">Check Homework</h4>
              </div>
              <div className="modal-body">
                <div className="cust-m-info">Do you really want to Confirm Marks?</div>
              </div>
              <div className="modal-footer">
                <div className="clearfix text--right">
                  <button className="c-btn grayshade" data-dismiss="modal">No</button>
                  <button className="c-btn primary" onClick={this.addMarks.bind(this)}>Yes</button>
                </div>
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
  studentChecking: professor.studentChecking,
  homeworkSubmission: professor.homeworkSubmission,
  downloadFileData: professor.downloadFileData,
  studentSubmissionFile: professor.studentSubmissionFile,
  token: auth.token,
  homeworkAnnotation: professor.saveAnnotation
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getStudentHomeWorkChecking,
    homeWorkSubmission,
    downLoadHomeWorkFile,
    downLoadStudentHomeWorkSubmissionFile,
    saveHomeworkAnnotation
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkChecking)