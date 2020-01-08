import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'bootstrap-datepicker';
import { getStudentQuizExam, submitQuizTypeQuestion, quizStartExamStatusChange, getResumeQuizData, resumeQuestionQuiz } from '../../actions/studentAction';
import moment from 'moment';
import { successToste, infoToste, errorToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import { StopWatch } from '../../constant/stopWatch';
import $ from 'jquery';


class StudentExamQuestionTypeQuiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      QuestionList: [],
      pro: {},
      remainingQuestionCount: 0,
      quiz_answer: [],
      id: null,
      count_timer: 0,
      counterTimer: 3,
      flag: true,
      strict_mode: false,
      currentQuenum: 0,
      QuestionNumberArr: [],
      buttoncss: "c-colorBtn st-notAttempt",
      quesstyleArr: [],
      lastQueNum: 0,
      answeredCount: 0,
      queMarkReviewCount: 0,
      notAnsweredCount: 0,
      notAttemptedCount: 0,
      ansVisibleFlag: false,
      markReviewFlag: false,
      prevFlag: false,
      nextFlag: false
    }
  }

  // componentWillMount() {
  //   // this.startsync();
  // }

  // startsync() {
  //   let { count_timer } = this.state;
  //   count_timer++;
  //   const pro = this.props.location.state.data;
  //   let id = setInterval(() => { this.updateStudentAnswer(pro) }, 10000)
  //   this.setState({ id });
  // }


  componentDidMount() {
    const pro = this.props.location.state ? this.props.location.state.data : "";
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    this.getQuizExamData(pro);
    this.setState({ strict_mode: pro.strict_mode }, () => {
      if (this.state.strict_mode == true) {
        this.goInFullscreen($("#typequizfullscreen").get(0));
      }
    });


  }

  goInFullscreen(element) {
    if (element.requestFullscreen)
      element.requestFullscreen();
    else if (element.mozRequestFullScreen)
      element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen)
      element.webkitRequestFullScreen();
    else if (element.msRequestFullscreen)
      element.msRequestFullscreen();
  }

  goOutFullscreen() {

    if (document.exitFullscreen)
      document.exitFullscreen();
    else if (document.mozCancelFullScreen)
      document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
      document.webkitExitFullscreen();
    else if (document.msExitFullscreen)
      document.msExitFullscreen();
  }

  getQuizExamData(pro) {

    let apiData = {
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
      payload: {
        "quiz_type": pro.quiz_type,
        "batch_quiz_id": pro.batch_quiz_id,
        "quiz_id": pro.quiz_id
      }
    }
    if (pro.attemptStatus === "INPROGRESS") {
      this.props.getResumeQuizData(apiData).then(() => {
        let res = this.props.resumeQuizData;
        if (res && res.status === 200) {
          this.setState({ QuestionList: res.data.response.quizPreview, pro }, () => {
            let count = 0;
            let time_taken = (this.state.QuestionList[0].time_taken) / 10;
            this.updateQuetionAnsArr();
            this.state.QuestionList.map((question, index) => {
              if (question.answer === 0) {
                count++;
              }
            })
            this.setState({

              count_timer: time_taken
            });
          })
        }
      })
    } else {
      // this.statusChange(pro);
      this.props.getStudentQuizExam(apiData).then(() => {
        let res = this.props.quizData
        if (res && res.status == 200) {
          let { QuestionNumberArr, QuestionList } = this.state;
          let time = (pro.duration);

          this.setState({
            QuestionList: res.data.response,
            pro,
            remainingQuestionCount: res.data.response.length,
          }, () => {

            let statusobj1 = {
              currentQuenum: false,
              isQueAnswered: false,
              isQueUnAnswered: false,
              isQueMarkedReview: false,

            }
            let notAttemptedCount = this.state.QuestionList.length;
            let QuestionNumberArr = [];

            this.state.QuestionList.map((obj, idx) => {

              if (idx == 0) {
                var statusobj = {
                  currentQuenum: true,
                  isQueAnswered: false,
                  isQueUnAnswered: false,
                  isQueMarkedReview: false,

                }
                QuestionNumberArr.push(statusobj)
              } else {
                QuestionNumberArr.push(statusobj1)
              }


            })
            this.setState({ QuestionNumberArr: QuestionNumberArr, notAttemptedCount })
            this.updateQuetionAnsArr();
          });
        }
      })
    }
  }

  // statusChange(pro) {
  //   let data = {
  //     institute_id: this.props.instituteId,
  //     branch_id: this.props.branchId,
  //     token:this.props.token,
  //     payload: {
  //       "quiz_type": pro.quiz_type,
  //       "batch_quiz_id": pro.batch_quiz_id,
  //       "quiz_id": pro.quiz_id,
  //       "status": "INPROGRESS",
  //       "count_timer": 0,
  //     }
  //   }
  //   this.props.quizStartExamStatusChange(data);
  // }

  updateQuetionAnsArr() {
    let { QuestionList, quiz_answer, pro } = this.state;
    if (pro.attemptStatus === "INPROGRESS") {
      QuestionList.map((question, index) => {
        quiz_answer.push({
          "question_no": index + 1,
          "answer": question.answer
        })
      })
    }
    else {
      QuestionList.map((question, index) => {
        quiz_answer.push({
          "question_no": index + 1,
          "answer": 0
        })
      })
    }
    this.setState({ quiz_answer });
  }

  // updateStudentAnswer(pro) {
  //   let { count_timer } = this.state;
  //   count_timer++;
  //   this.setState({ count_timer }, () => {
  //     let apiData = {
  //       institute_id: this.props.instituteId,
  //       branch_id: this.props.branchId,
  //       token:this.props.token,
  //       payload: {
  //         "quiz_id": pro.quiz_id,
  //         "batch_quiz_id": pro.batch_quiz_id,
  //         "quiz_type": pro.quiz_type,
  //         "studentAnswers": this.state.quiz_answer,
  //         "count_timer": this.state.count_timer,
  //       }
  //     }
  //     this.props.resumeQuestionQuiz(apiData);
  //   })
  // }

  onSelecteAns(index, event) {

    let { quiz_answer, QuestionList, QuestionNumberArr } = this.state;
    let count = 0;
    if (QuestionList[index].answer != "0" && quiz_answer[index].answer != "0") {
      QuestionList[index].answer = Number(event.target.value);
      quiz_answer[index].answer = Number(event.target.value);
      QuestionNumberArr[index] = { ...QuestionNumberArr[index], isQueUnAnswered: false, isQueMarkedReview: false, isQueAnswered: false, currentQuenum: true }
    }
    else {
      QuestionList[index].answer = Number(event.target.value);
      quiz_answer[index].answer = Number(event.target.value);
    }

    this.setState({ quiz_answer, QuestionList, ansVisibleFlag: true, QuestionNumberArr }, () => {
      quiz_answer.map((quiz, index) => {

        if (quiz.answer === 0) {
          count++;
        }
        this.setState({ prevFlag: true, nextFlag: true, });


      })

    });

  }

  gotoQuizDirectory() {
    const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
    this.props.history.push({ pathname: 'studentquiz-directory', state: { data: pro1 } });
  }

  onSubmitByTimerModel() {
    $("#quizTimeout .close").click();
    this.onSubmitQuiz();
  }

  onSubmitByTimerModelOnCross() {
    $("#quizTimeout .close").click();
  }

  onSubmitByQuizSubmitModel() {
    $("#quizSubmit .close").click();
    this.onSubmitQuiz();
  }

  onSubmitQuiz() {
    let { QuestionNumberArr, quiz_answer, QuestionList } = this.state;
    QuestionNumberArr.map((data, index) => {

      if ((data.currentQuenum == true) && (data.isQueAnswered == false) && (data.isQueMarkedReview == false) && (data.isQueUnAnswered == false)) {
        QuestionList[index] = { ...QuestionList[index], answer: 0 }
        quiz_answer[index] = { ...quiz_answer[index], answer: 0 };
      }
    })
    this.setState({ QuestionList, quiz_answer }, () => {

      let { pro, id } = this.state;
      const pro1 = this.props.location.state ? this.props.location.state.data1 : "";
      clearInterval(id);
      let apiData = {
        institute_id: this.props.instituteId,
        branch_id: this.props.branchId,
        token: this.props.token,
        payload: {
          submission_date: moment(),
          time_taken: pro.duration,
          marks: 0,
          total: 0,
          quiz_marks: 0,
          batch_quiz_id: pro.batch_quiz_id,
          quiz_id: pro.quiz_id,
          quiz_answer: this.state.quiz_answer,
          "count_timer": 0,
        }
      }

      this.props.submitQuizTypeQuestion(apiData).then(() => {
        let res = this.props.quizQueTypeSubmissionResponse;

        if (res && res.data.status == 200) {
          infoToste("Quiz Question Submitted Successfully")
          this.props.history.push({
            pathname: 'studentresult_questiontype',
            state: { data: pro, data1: pro1 }
          })

        }
        else if (res && res.data.status == 500) {
          errorToste(res.data.message)
        }
      })
    })

  }

  stopMethod() {
    $("#timeout").click();
  }

  // resumeQuiz() {
  //   let { id } = this.state;
  //   clearInterval(id);
  //   this.props.history.push('studentquiz-directory');
  // }

  // renderBatchDetail() {
  //   let { pro } = this.state;
  // }

  clearAnswer() {

    let { QuestionList, QuestionNumberArr, quiz_answer, currentQuenum, notAttemptedCount, answeredCount, notAnsweredCount, queMarkReviewCount } = this.state;
    let answerC = this.state.answeredCount;
    let markReviewC = this.state.queMarkReviewCount;
    let notAnswerC = this.state.notAnsweredCount;
    quiz_answer[currentQuenum] = { ...quiz_answer[currentQuenum], answer: 0 }
    QuestionList[currentQuenum] = { ...QuestionList[currentQuenum], answer: 0 }
    // QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum] }
    if (QuestionNumberArr[currentQuenum].isQueUnAnswered == false) {
      notAnswerC = notAnswerC + 1;
      if (notAttemptedCount != 0 && QuestionNumberArr[currentQuenum].isQueMarkedReview != true && QuestionNumberArr[currentQuenum].isQueAnswered != true) {
        notAttemptedCount = notAttemptedCount - 1;
      }
    }

    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueUnAnswered: true }
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], currentQuenum: false }
    if (QuestionNumberArr[currentQuenum].isQueAnswered == true) {
      answerC = answerC - 1;
    }

    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueAnswered: false }
    if (QuestionNumberArr[currentQuenum].isQueMarkedReview == true) {
      markReviewC = markReviewC - 1;
    }

    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueMarkedReview: false }
    let count = 0;
    this.setState({ prevFlag: false, ansVisibleFlag: false, nextFlag: false, markReviewFlag: false, QuestionList, quiz_answer, QuestionNumberArr, notAnsweredCount: notAnswerC, queMarkReviewCount: markReviewC, answeredCount: answerC, notAttemptedCount }, () => {

      document.getElementById(this.state.currentQuenum).classList.add("sect__num");
    })
  }

  getPreviousQue() {
    let { currentQuenum, quiz_answer, QuestionList, QuestionNumberArr, nextFlag, prevFlag } = this.state;

    let nextQue = currentQuenum - 1;

    if (nextQue >= 0) {
      prevFlag = false;
      nextFlag = false;
      QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], currentQuenum: false }
      document.getElementById(this.state.currentQuenum).classList.remove("sect__num");
      this.setState({ currentQuenum: nextQue, prevFlag, nextFlag }, () => {


        if (QuestionNumberArr[nextQue].isQueAnswered == true || QuestionNumberArr[nextQue].isQueMarkedReview == true) {
          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: false }
          this.setState({ QuestionNumberArr, ansVisibleFlag: true }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        } else if (QuestionNumberArr[nextQue].isQueUnAnswered == true) {
          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: false }
          this.setState({ QuestionNumberArr, ansVisibleFlag: false }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        } else if (QuestionNumberArr[nextQue].isQueAnswered == false || QuestionNumberArr[nextQue].isQueMarkedReview == false || this.state.quiz_answer[nextQue].answer != 0) {

          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: true }
          quiz_answer[nextQue] = { ...quiz_answer[nextQue], answer: 0 }
          QuestionList[nextQue] = { ...QuestionList[nextQue], answer: 0 }
          this.setState({ QuestionNumberArr, quiz_answer, QuestionList, ansVisibleFlag: false }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        } else {
          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: true }
          this.setState({ QuestionNumberArr, ansVisibleFlag: false }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        }

        if (QuestionNumberArr[nextQue].isQueMarkedReview == true) {
          this.setState({ markReviewFlag: true })
        } else {
          this.setState({ markReviewFlag: false })
        }
      })
    } else {
      this.setState({ prevFlag: true });
    }
  }

  getNextQue() {
    let { currentQuenum, quiz_answer, QuestionList, QuestionNumberArr, nextFlag, prevFlag } = this.state;
    let nextQue = currentQuenum + 1;

    if (nextQue <= QuestionNumberArr.length - 1) {
      prevFlag = false;
      QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], currentQuenum: false }
      document.getElementById(this.state.currentQuenum).classList.remove("sect__num");
      this.setState({ currentQuenum: nextQue, prevFlag }, () => {

        if (QuestionNumberArr[nextQue].isQueAnswered == true || QuestionNumberArr[nextQue].isQueMarkedReview == true) {
          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: false }
          this.setState({ QuestionNumberArr, ansVisibleFlag: true }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        } else if (QuestionNumberArr[nextQue].isQueUnAnswered == true) {
          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: false }
          this.setState({ QuestionNumberArr, ansVisibleFlag: false }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        } else if (QuestionNumberArr[nextQue].isQueAnswered == false || QuestionNumberArr[nextQue].isQueMarkedReview == false || this.state.quiz_answer[nextQue].answer != 0) {

          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: true }
          quiz_answer[nextQue] = { ...quiz_answer[nextQue], answer: 0 }
          QuestionList[nextQue] = { ...QuestionList[nextQue], answer: 0 }
          this.setState({ QuestionNumberArr, quiz_answer, QuestionList, ansVisibleFlag: false }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        } else {
          QuestionNumberArr[nextQue] = { ...QuestionNumberArr[nextQue], currentQuenum: true }
          this.setState({ QuestionNumberArr, ansVisibleFlag: false }, () => {
            document.getElementById(nextQue).classList.add("sect__num");
            document.getElementById(nextQue).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          })
        }

        if (QuestionNumberArr[nextQue].isQueMarkedReview == true) {
          this.setState({ markReviewFlag: true })
        } else {
          this.setState({ markReviewFlag: false })
        }
      })
    } else {
      document.getElementById(this.state.currentQuenum).classList.add("sect__num");
      this.setState({ nextFlag: true });
    }
  }

  getMarkReviewCount() {

    let { currentQuenum, QuestionList, QuestionNumberArr, answeredCount, notAnsweredCount, notAttemptedCount, queMarkReviewCount } = this.state;
    let answerC = this.state.answeredCount;
    let markReviewC = this.state.queMarkReviewCount;
    let notAnswerC = this.state.notAnsweredCount


    if (QuestionNumberArr[currentQuenum].isQueMarkedReview == false) {
      markReviewC = markReviewC + 1;
      if (notAttemptedCount != 0 && QuestionNumberArr[currentQuenum].isQueAnswered != true && QuestionNumberArr[currentQuenum].isQueUnAnswered != true) {

        notAttemptedCount = notAttemptedCount - 1;
      }
    }

    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueMarkedReview: true }

    if (QuestionNumberArr[currentQuenum].isQueUnAnswered == true) {
      notAnswerC = notAnswerC - 1;
    }
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], currentQuenum: false };
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueUnAnswered: false };

    if (QuestionNumberArr[currentQuenum].isQueAnswered == true) {
      answerC = answerC - 1;

    }
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueAnswered: false }


    let count = 0;
    this.setState({
      prevFlag: false, nextFlag: false, markReviewFlag: true, QuestionList, QuestionNumberArr, notAnsweredCount: notAnswerC, notAttemptedCount,
      answeredCount: answerC, queMarkReviewCount: markReviewC
    }, () => {
      this.getNextQue()
    })
  }

  saveAndNext() {

    let { currentQuenum, QuestionList, QuestionNumberArr, notAttemptedCount } = this.state;
    let answerC = this.state.answeredCount;
    let markReviewC = this.state.queMarkReviewCount;
    let notAnswerC = this.state.notAnsweredCount;

    if (QuestionNumberArr[currentQuenum].isQueAnswered == false) {
      answerC = answerC + 1;
      if (notAttemptedCount != 0 && QuestionNumberArr[currentQuenum].isQueMarkedReview != true && QuestionNumberArr[currentQuenum].isQueUnAnswered != true) {
        notAttemptedCount = notAttemptedCount - 1;
      }
    }
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueAnswered: true }
    if (QuestionNumberArr[currentQuenum].isQueUnAnswered == true) {
      notAnswerC = notAnswerC - 1;
    }
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueUnAnswered: false };
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], currentQuenum: false };


    if (QuestionNumberArr[currentQuenum].isQueMarkedReview == true) {
      markReviewC = markReviewC - 1;
    }
    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], isQueMarkedReview: false }
    let count = 0;
    this.setState({ prevFlag: false, nextFlag: false, markReviewFlag: false, QuestionList, QuestionNumberArr, answeredCount: answerC, queMarkReviewCount: markReviewC, notAnsweredCount: notAnswerC, notAttemptedCount }, () => {
      this.getNextQue()
    })
  }

  getCurrentQue(index) {
    let { currentQuenum, prevFlag, nextFlag, QuestionNumberArr, quiz_answer, QuestionList, } = this.state;

    QuestionNumberArr[currentQuenum] = { ...QuestionNumberArr[currentQuenum], currentQuenum: false };

    if (QuestionNumberArr[index].isQueAnswered == true || QuestionNumberArr[index].isQueMarkedReview == true || QuestionNumberArr[index].isQueUnAnswered == true) {
      QuestionNumberArr[index] = { ...QuestionNumberArr[index], currentQuenum: false, }
      prevFlag = false;
      nextFlag = false
    } else {
      QuestionNumberArr[index] = { ...QuestionNumberArr[index], currentQuenum: true, }
      prevFlag = true;
      nextFlag = true
    }
    document.getElementById(this.state.currentQuenum).classList.remove("sect__num");
    this.setState({ QuestionNumberArr, currentQuenum: index }, () => {

      document.getElementById(this.state.currentQuenum).classList.add("sect__num");
      if (this.state.QuestionNumberArr[this.state.currentQuenum].isQueAnswered == true ||
        this.state.QuestionNumberArr[this.state.currentQuenum].isQueMarkedReview == true) {

        this.setState({ ansVisibleFlag: true })
      } else if (this.state.QuestionNumberArr[this.state.currentQuenum].isQueUnAnswered == true) {
        this.setState({ ansVisibleFlag: false })
      } else if (this.state.QuestionNumberArr[this.state.currentQuenum].isQueAnswered == false && this.state.QuestionNumberArr[this.state.currentQuenum].isQueMarkedReview == false && this.state.quiz_answer[this.state.currentQuenum].answer != 0) {
        quiz_answer[this.state.currentQuenum] = { ...quiz_answer[this.state.currentQuenum], answer: 0 }
        QuestionList[this.state.currentQuenum] = { ...QuestionList[this.state.currentQuenum], answer: 0 }

        this.setState({ ansVisibleFlag: false, quiz_answer, QuestionList })
      } else {
        this.setState({ ansVisibleFlag: false })
      }

      if (this.state.QuestionNumberArr[this.state.currentQuenum].isQueMarkedReview === true) {

        this.setState({ markReviewFlag: true })
      } else {
        this.setState({ markReviewFlag: false })
      }


      if (this.state.currentQuenum == 0) {
        prevFlag = true;
        nextFlag = false
      } else if (this.state.currentQuenum == this.state.QuestionNumberArr.length) {
        prevFlag = false
        nextFlag = true
      } else {
        prevFlag = false
        nextFlag = false
      }
      this.setState({ prevFlag, nextFlag })
      this.renderQueAns()
    })

  }

  renderQueNumber() {
    let { QuestionList, QuestionNumberArr } = this.state;

    if (QuestionNumberArr && QuestionNumberArr.length > 0) {
      return QuestionNumberArr.map((status, index) => {
        if (status.currentQuenum == true) {
          return (
            <div>
              <li key={"key" + index}><button onClick={this.getCurrentQue.bind(this, index)} id={index} className="c-colorBtn st-current sect__num">{index + 1}</button></li>
            </div>
          )
        }
        else if (status.isQueAnswered == true) {
          return (
            <div>
              <li key={"key" + index}><button onClick={this.getCurrentQue.bind(this, index)} id={index} className="c-colorBtn st-ans">{index + 1}</button></li>
            </div>
          )
        }
        else if (status.isQueUnAnswered == true) {
          return (
            <div>
              <li key={"key" + index}><button onClick={this.getCurrentQue.bind(this, index)} id={index} className="c-colorBtn st-notAns">{index + 1}</button></li>
            </div>
          )
        }
        else if (status.isQueMarkedReview == true) {
          return (
            <div>
              <li key={"key" + index}><button onClick={this.getCurrentQue.bind(this, index)} id={index} className="c-colorBtn st-review">{index + 1}</button></li>
            </div>
          )
        }
        else {
          return (
            <div>
              <li key={"key" + index}><button onClick={this.getCurrentQue.bind(this, index)} id={index} className="c-colorBtn st-notAttempt">{index + 1}</button></li>
            </div>
          )
        }
      })
    }
  }

  renderQueListColor() {
    return (
      <div>
        <li>
          <button className="c-colorBtn st-current"></button>
          <span className="queStatus">Current Question</span>
        </li>
        <li>
          <button className="c-colorBtn st-notAttempt"></button>
          <span className="queStatus">Not Attempted</span>
          <span className="queStatus_count">{this.state.notAttemptedCount}</span>
        </li>
        <li>
          <button className="c-colorBtn st-ans"></button>
          <span className="queStatus">Answered</span>
          <span className="queStatus_count">{this.state.answeredCount}</span>
        </li>
        <li>
          <button className="c-colorBtn st-notAns"></button>
          <span className="queStatus">Not Answered</span>
          <span className="queStatus_count">{this.state.notAnsweredCount}</span>
        </li>
        <li>
          <button className="c-colorBtn st-review"></button>
          <span className="queStatus">Marked for Review</span>
          <span className="queStatus_count">{this.state.queMarkReviewCount}</span>
        </li>
      </div>
    )
  }

  renderQueAns(qindex) {
    if (this.state.QuestionList && this.state.QuestionList.length > 0) {
      return this.state.QuestionList.map((question, index) => {
        if (qindex == index) {

          return (
            <div key={"question" + index} className="c-queList__sect">
              <div className="c-queList__sect__num">{question.question_no}</div>
              <div className="queList__header">
                <span className="static-ques">
                  {question.question}
                </span>
                <span>
                  {(question.image_url && question.image_name) ?
                    <div className="upload--div_img"><img style={{ height: "120px", width: "220px", marginTop: "15px", marginLeft: "-218px" }} src={question.image_url} />
                    </div> : ""}
                </span>
              </div>

              <div className="queList__body">
                <label htmlFor={"queList-" + index + 1} className="custome-field field-radiobtn">
                  <input type="radio" name={"queListName" + index} id={"queList-" + index + 1} onClick={this.onSelecteAns.bind(this, index)} checked={question.answer === 1 ? true : false} value="1" />
                  <i></i>
                  <span>{question.option1}</span>
                </label>

                <label htmlFor={"queList-" + index + 2} className="custome-field field-radiobtn">
                  <input type="radio" name={"queListName" + index} id={"queList-" + index + 2} onClick={this.onSelecteAns.bind(this, index)} checked={question.answer === 2 ? true : false} value="2" />
                  <i></i>
                  <span>{question.option2}</span>
                </label>

                {question.option3 ? <label htmlFor={"queList-" + index + 3} className="custome-field field-radiobtn">
                  <input type="radio" name={"queListName" + index} id={"queList-" + index + 3} onClick={this.onSelecteAns.bind(this, index)} checked={question.answer === 3 ? true : false} value="3" />
                  <i></i>
                  <span>{question.option3}</span>
                </label> : ""}

                {question.option4 ? <label htmlFor={"queList-" + index + 4} className="custome-field field-radiobtn">
                  <input type="radio" name={"queListName" + index} id={"queList-" + index + 4} onClick={this.onSelecteAns.bind(this, index)} checked={question.answer === 4 ? true : false} value="4" />
                  <i></i>
                  <span>{question.option4}</span>
                </label> : ""}
              </div>
            </div>
          )
        }

      })
    }
  }

  renderBottomStatus() {
    if (this.state.currentQuenum + 1 != this.state.QuestionList.length) {
      var label = 'Save & Next'
    } else {
      var label = 'Save'
    }
    return (
      <div>

        {this.state.prevFlag == true ?
          <button style={{ verticalAlign: "baseLine" }} disabled className="btn c-btn st-notAttempt" id="previousBtn" onClick={this.getPreviousQue.bind(this)}>Previous</button> :
          <button className="c-btn st-notAttempt" id="previousBtn" onClick={this.getPreviousQue.bind(this)}>Previous</button>}

        <button className=" c-btn st-notAns" onClick={this.clearAnswer.bind(this)} >Clear Answer</button>

        {this.state.ansVisibleFlag == true ?
          <button className="c-btn st-review" onClick={this.getMarkReviewCount.bind(this)} >Mark for Review</button>
          :
          <button style={{ verticalAlign: "baseLine" }} className="btn c-btn st-review" onClick={this.getMarkReviewCount.bind(this)} disabled>Mark for Review</button>}

        {this.state.ansVisibleFlag == true ?
          <button className="c-btn st-ans" onClick={this.saveAndNext.bind(this)}>{label}</button>
          :
          <button style={{ verticalAlign: "baseLine" }} className="btn c-btn st-ans" onClick={this.saveAndNext.bind(this)} disabled>{label}</button>}

        {this.state.nextFlag == true ?
          <button style={{ verticalAlign: "baseLine" }} disabled className="btn c-btn st-notAttempt" id="nextBtn" onClick={this.getNextQue.bind(this)}>Next</button>
          :
          <button className="c-btn st-notAttempt" id="nextBtn" onClick={this.getNextQue.bind(this)}>Next</button>}
      </div>
    )
  }

  renderStopWatch() {
    let { pro, QuestionList } = this.state;
    let time = 0;
    if (pro.attemptStatus === "INPROGRESS") {
      let time_taken = QuestionList[0].time_taken;
      time = (pro.duration * 60) - time_taken;
    } else {
      time = pro.duration * 60
    }

    if (pro.duration == 'Untimed') {
      return (
        <div></div>
      )
    } else {
      return (
        <div>
          {time ? <span className="marks-detl"><StopWatch date={Number(time)} stopMethod={this.stopMethod.bind(this)} /></span> : ""}
        </div>
      )
    }
  }

  goFullScreen() {
    if (this.state.flag == true) {
      this.goInFullscreen($("#typequizfullscreen").get(0));
    }
  }

  // changeFlag(flags){
  //   this.setState({flag : !flags},()=>{
  //    if(this.state.flag == true){
  //      $("#submitquiz").click();
  //    } 
  //   })
  // }


  render() {
    const pro = this.props.location.state.data;
    let flags = this.state.flag;
    var self = this
    document.onfullscreenchange = (event) => {

      self.setState({ flag: !flags }, () => {
        if (self.state.flag == true) {
          self.onSubmitByQuizSubmitModel();
        }
      })

    };
    return (
      <div className="c-container clearfix" id="typequizfullscreen">
        <ToastContainer />
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">

              <span className="c-heading-lg">{pro.topic ? pro.topic : ""}</span>
            </div>
            <div className="divider-block text--right">
              <button className="c-btn prime" data-toggle="modal" data-target="#quizSubmit" id="submitquiz">Submit Quiz</button>
              <button className="c-btn prime" id="timeout" data-toggle="modal" data-target="#quizTimeout" data-backdrop="static" data-keyboard="false" style={{ visibility: 'hidden' }} >Quiz</button>
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="c-marks-block margin25-bottom" style={{ height: "97px" }}>
                {this.renderStopWatch()}
              </div>

              <div className="clearfix margin25-bottom">
                <div className="block-title st-colored noborder">Questions</div>
                <span style={{ color: "red" }}>Click on circle to visit the question</span><br /><br />
                <div className="c-quesListingColor clearfix">
                  <ul style={{ height: "200px", overflowY: "auto", padding: "1px" }}>
                    {this.renderQueNumber()}
                  </ul>
                </div>

                <div className="clearfix margin25-bottom">
                  <div className="c-quesListingColor type-02 clearfix">
                    <ul>
                      {this.renderQueListColor()}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            <div className="col-md-9 col-sm-6 col-xs-12" >
              <div className="block-title st-colored block-title-lg noborder">
                QUESTION {(this.state.currentQuenum + 1) + "/" + this.state.QuestionList.length}
                {this.state.markReviewFlag == true ?
                  <span className="st-queStatus" >Marked For Review</span> : ""}
              </div>

              <div className="clearfix" >
                <div className="c-queList__sect nopad" style={{ overflow: "auto", height: "370px" }}>
                  {this.renderQueAns(this.state.currentQuenum)}
                </div>
              </div>
              <div className="btnContainer text-right" >
                {this.renderBottomStatus()}
              </div>
            </div>

          </div>
        </div>
        <div className="modal fade custom-modal-sm width--sm" id="quizSubmit" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                <h4 className="c-heading-sm card--title">Submit Quiz</h4>
              </div>
              <div className="modal-body">
                <div className="cust-m-info">Do you really want to submit the quiz?</div>
              </div>
              <div className="modal-footer">
                <div className="clearfix text--right">
                  {this.state.strict_mode == true ? <button className="c-btn grayshade" data-dismiss="modal" aria-label="Close" onClick={this.goFullScreen.bind(this)}>No</button> :
                    <button className="c-btn grayshade" data-dismiss="modal" aria-label="Close" >No</button>}
                  <button className="c-btn primary" onClick={this.onSubmitByQuizSubmitModel.bind(this)}>Yes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade custom-modal-sm width--sm" id="quizTimeout" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.onSubmitByTimerModelOnCross.bind(this)}><i className="icon cg-times"></i></button>
              </div>
              <div className="modal-body">
                <div className="c-timeoutModal">
                  <div className="timeout--img"></div>
                  <div className="timeout--msg">Time Over!</div>
                  <div className="timeout--time">00:00:00</div>
                  <div className="timeout--btn"><button className="c-btn prime" onClick={this.onSubmitByTimerModel.bind(this)}>Get Score</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, student }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  quizData: student.quizData,
  quizQueTypeSubmissionResponse: student.quizQueTypeSubmissionResponse,
  changeStatusExam: student.changeStatusExam,
  resumeQuizData: student.resumeQuizData,
  resumeQuestionType: student.resumeQuestionType,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getStudentQuizExam,
    submitQuizTypeQuestion,
    quizStartExamStatusChange,
    getResumeQuizData,
    resumeQuestionQuiz,
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentExamQuestionTypeQuiz)