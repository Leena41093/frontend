import React, { Component } from 'react';
import moment from 'moment';
import { DeleteModalView } from '../../common/deleteModalView';
import $ from 'jquery';
import infoToste from '../../../constant/util';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteNotice } from '../../../actions/professorActions';
import {refreshData} from  '../../professor/professorBatchDashboard'
import {refreshDatas} from  '../../professor/professorTimeTable'
export class ViewNotice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            deleteObj: null,
            index: 0,
            id:0,
            batchId:"",
            sentFrom:""
        }
    }

    componentDidMount(){
        this.setState({sentFrom:this.props.sentfrom});
    }

    onDeleteNotice(id,noticekey){
       let {deleteObj} = this.state;
       this.setState({deleteObj:noticekey,id})
    }
    
    onDeleteViewEntry(flags) {
        let {index,id} = this.state;
        if(flags == 'notice1'){
          this.onNoticeDelete(id);   
          $("#quizSubmit1 .close").click();
        }
    }

    onNoticeDelete(id){ 
        let data = {
          payload:{
            batch_notice_id:id
          },
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token:this.props.token,
        }
        this.props.deleteNoticeFun(data).then(()=>{
          let res = this.props.noticeDelete
          if(this.state.sentFrom == "proBatchDash"){
          this.props.refreshData();
          }
          else if(this.state.sentFrom == "proTimeTable"){
          this.props.refreshDatas();
          }
          infoToste("Notice Deleted Successfully");
        })
    }

    renderNotice() {
        let notice = this.props.noticeList;
        if (notice && notice.length > 0) {
            return notice.map((notice, index) => {
                return (
                    <div key={"notice" + index} className="c-notice-card">
                        <h3>{moment(notice.notice_date).format("dddd DD MMM YYYY")}<span ><i data-toggle="modal" data-target="#quizSubmit1" onClick={this.onDeleteNotice.bind(this,notice.batch_notice_id,"notice1")} className="icon cg-rubbish-bin-delete-button pull-right linkbtn hover-pointer" style={{color:"#3D3F61",marginRight:"35px"}}></i></span></h3>
                        <span>{notice.notice_text}</span>
                    </div>
                )
            })
        }
    }

    render() {
       
        return (
            <div className="modal fade custom-modal-sm" id="viewNotice" style={{zIndex:"5"}} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
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

                 <DeleteModalView flag={this.state.deleteObj} onDeleteView={(val) => { this.onDeleteViewEntry(val) }}   {...this.props} />
            </div>
        )
    }
}

