import React, { Component } from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import {getReportData, getIsProfessorAdmin} from '../../actions/index';

class Reports extends Component {

  constructor(props){
    super(props);
    this.state = {
      batchesCount:"",
      classesCount:"",
      commentsCount:"",
      homeworkCount:"",
      notesCount:"",
      noticesCount:"",
      professorCount:"",
      quizSubmissionCount:"",
      quizzesCount:"",
      studentCount:"",
      subjectsCount:"",
      homeworkSubmissionCount:"",
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps){
		
		let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){

    if(this.state.instituteId != nextProps.instituteId){
      this.setState({instituteId:nextProps.instituteId},()=>{
        var datas = {
          institudeId: this.props.instituteId,
          branchId: this.props.branchId,
          token: this.props.token,
        }
        this.props.getIsProfessorAdmin(datas).then(()=>{
         let res = this.props.ProfessorAdmin;
         if(res && res.data.status == 200 && res.data.response.isProfessorAdmin == false ){
         this.props.history.push("/app/dashboard");
         }
         else{
          this.getData();
         }
        })
      })
		}
		}
  }

  componentDidMount(){
    this.setState({instituteId:this.props.instituteId})
    this.getData();
  }

  getData(){
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    }
    this.props.getReportData(data).then(()=>{
      let res = this.props.reportData;
        if(res && res.status == 200){
        this.setState({batchesCount:res.response.batchesCount,classesCount:res.response.classesCount,
          commentsCount:res.response.commentsCount,homeworkCount:res.response.homeworkCount,
          notesCount:res.response.notesCount, noticesCount:res.response.noticesCount,
          professorCount:res.response.professorCount, quizSubmissionCount:res.response.quizSubmissionCount,
          quizzesCount:res.response.quizzesCount, studentCount:res.response.studentCount,
          subjectsCount:res.response.subjectsCount,
          homeworkSubmissionCount:res.response.homeworkSubmissionCount
        })
      }
    })
  }

  render() {
    return (
      <div className="c-container clearfix">
        <div className="c-card">
          <div className="c-card__title">
            <span className="c-heading-sm card--title">
              Report Details
					  </span>
          </div>

          <div className="c-container__data">
            <div className="card-container">

              <div className="c-card">
                <div className="c-card__items">
                  <div className="c-card__form">
                    <div className="form-group static-fld">
                      <label >Professor</label>
                      <span className="info-type st-alert">{this.state.professorCount ? this.state.professorCount :"None"}</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Classes</label>
                      <span className="info-type st-alert">{this.state.classesCount ? this.state.classesCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Batches</label>
                      <span className="info-type st-alert">{this.state.batchesCount ? this.state.batchesCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Homework</label>
                      <span className="info-type st-alert">{this.state.homeworkCount ? this.state.homeworkCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Notes</label>
                      <span className="info-type st-alert">{this.state.notesCount ? this.state.notesCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Homeworks Submission</label>
                      <span className="info-type st-alert">{this.state.homeworkSubmissionCount ? this.state.homeworkSubmissionCount : "None" }</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="c-card">
                <div className="c-card__items">
                  <div className="c-card__form">
                    <div className="form-group static-fld">
                      <label >Students</label>
                      <span className="info-type st-alert" style={{text:"center"}}>{this.state.studentCount ? this.state.studentCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Subjects</label>
                      <span className="info-type st-alert">{this.state.subjectsCount ? this.state.subjectsCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Notices</label>
                      <span className="info-type st-alert">{this.state.noticesCount ? this.state.noticesCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Quiz</label>
                      <span className="info-type st-alert">{this.state.quizzesCount ? this.state.quizzesCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Comments</label>
                      <span className="info-type st-alert">{this.state.commentsCount ? this.state.commentsCount : "None" }</span>
                    </div>
                    <div className="form-group static-fld">
                      <label >Quiz Submission</label>
                      <span className="info-type st-alert">{this.state.quizSubmissionCount ? this.state.quizSubmissionCount : "None" }</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth }) => ({
  reportData:app.reportData,
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  ProfessorAdmin: app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getReportData,getIsProfessorAdmin
     
    }, dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Reports)