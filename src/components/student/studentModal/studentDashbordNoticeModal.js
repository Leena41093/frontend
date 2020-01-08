import React, { Component } from 'react';
import moment from 'moment';
export class StudentDashbordNotice extends Component {

  constructor(props) {
    super(props);
    this.state = {
    
    }
  }

  renderNotice(notice){
    if(notice && notice.length>0){
     return notice.map((notice,index)=>{
        return(
          <div key={"notices"+index} className="c-studcard-02">
          <div className="title__1">{notice.notice_text}</div>
          <div className="clearfix">
            <div className="c-inner-bcrm dot pull-left">
              <span>{notice.subject_name}</span>
              <span>{moment(notice.notice_date).fromNow()}</span>
            </div>
            <div className="pull-right">
              <div className="prof__pic" data-toggle="tooltip" data-placement="left" title={notice.professor_name}><img src={notice.picture_url} /></div>
            </div>
          </div>
        </div>
        )
      })
    }
  }

  renderNotesBoard(){
    let studentNotices = this.props.noticeList
    if (studentNotices && studentNotices.length > 0) {
      // return studentBatch.map((notice, index) => {
         return (
         <div>
            {this.renderNotice(studentNotices)}
          </div>
        )
      // })
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
              <div className="student-Listing c-table" style={{ overflow: "auto" }}>
                {this.renderNotesBoard()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}