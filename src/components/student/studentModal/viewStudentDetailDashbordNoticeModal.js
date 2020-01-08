import React, { Component } from 'react';
import moment from 'moment';

export class ViewStudentDetailDashbordNotice extends Component{
 
  constructor(props){
    super(props);
    this.state = {

    }
  }

  renderNotice(){
   
    let notice = this.props.noticeList;
    if (notice && notice.length > 0) {
        return notice.map((notice, index) => {
            return (
                <div key={"notice" + index} className="c-notice-card">
                    <h3>{moment(notice.notice_date).format("dddd DD MMM YYYY")}</h3>
                    <span>{notice.notice_text}</span>
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
                            {this.renderNotice()}
                        </div>
                    </div>
                  </div>
            </div>
        </div>
    )
  }
}