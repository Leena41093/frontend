import React, { Component } from 'react';
import moment from 'moment';

export class ViewStudentSubmissionlist extends Component{
 
  constructor(props){
    super(props);
    this.state = {

    }
  }

  renderSubmission(){
    let recentSubmission  = this.props.submissionList;
    if (recentSubmission && recentSubmission.length > 0) {
      return recentSubmission.map((submission, index) => {
        return (
          <li key={"submission" + index} style={{marginLeft:"10px"}}>
            <img src={submission.picture_url} className="user-img" alt="" style={{height:"20px",width:"20px"}}/>
            <span className="news__heading">{submission.firstname + " " + submission.lastname + " submitted "+submission.type+ " " + submission.topic}</span>
            <span className="news__info">{moment(submission.submitTime).fromNow()}</span>
          </li>
        )
      
      })
    }
  }

  render() {
    return (
        <div className="modal fade custom-modal-md" id="viewSubmission" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                        <h4 className="c-heading-sm card--title">Recent Submissions</h4>
                    </div>
                    <div className="news--listing" >
                  <ul style={{overflow:"auto",height:"500px"}}>
                    {this.renderSubmission()}
                  </ul>
                </div>
                  </div>
            </div>
        </div>
    )
  }
}