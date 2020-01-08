import React, { Component } from 'react';
import moment from 'moment';

export class ViewStudentTimetableNotice extends Component{
 
  constructor(props){
    super(props);
    this.state = {

    }
  }

  renderRecentNotices() {
   let recentNotices = this.props.noticeList
    if (recentNotices && recentNotices.length > 0) {
      return recentNotices.map((notices, index) => {
        return (
          <div key={"notices" + index} className="c-studcard-02">
            <div className="title__1">{notices.notice_text}</div>
            <div className="clearfix">
              <div className="c-inner-bcrm dot pull-left">
                {/* <span>{notices.subject_name}</span> */}
                <span>{moment(notices.created_at).fromNow()}</span>
              </div>
              <div className="pull-right">
                <div className="prof__pic" data-toggle="tooltip" data-placement="left" title={notices.professor_name}><img src={notices.picture_url} /></div>
              </div>
            </div>
          </div>
        )
    
      })
    }
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm" id="viewNotice" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
              <div className="modal-content">
                  <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                      <h4 className="c-heading-sm card--title">Notice</h4>
                  </div>
                  <div className="modal-body">
                      <div className="student-Listing c-table" style={{overflow:"auto"}}>
                          {this.renderRecentNotices()}
                      </div>
                  </div>
                </div>
          </div>
      </div>
  )
}
}