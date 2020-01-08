import React, { Component } from 'react';
import moment from 'moment';

export class ViewStudentAllActivities extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  renderCommentActivities() {
    let commentActivitylist = this.props.activityList;
    if (commentActivitylist && commentActivitylist.length > 0) {
      return commentActivitylist.map((comment, index) => {
        return (
          <li key={"key"+index}>
            <div className="user_img"><img src={comment.picture_url} alt="" /></div>
            <div className="msg__info">{comment.commenttedUserName} commented on "{comment.homeworkTitle ? comment.homeworkTitle : comment.notesTitle}":<strong>{comment.commentText}</strong></div>
            <div className="msg__time">{moment(comment.commentTime).fromNow()}</div>
          </li>
        )
      })
    }
  }

  render() {
    return (
      // <div className="container">
      <div className="modal fade custom-modal-sm width--lg" id="viewActivity" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">Activity</h4>
            </div>
            <div className="stud_activities">
              
              <ul style={{height:"200px",overflow:"auto",marginLeft:"20px",marginRight:"20px",padding:"10px"}}>
                {this.renderCommentActivities()}

              </ul>
            </div>
          </div>
        </div>
      </div>
      // </div>
    )
  }
}