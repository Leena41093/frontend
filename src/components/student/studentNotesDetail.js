import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStudentNoteDetail, downloadStudentNotesFile, getCommentList, 
  addComment, commentLikeDislike,deleteComment } from '../../actions/studentAction';
import fileDownload from 'js-file-download';
import $ from 'jquery';
import { DeleteModal } from '../common/deleteModal';
import { ToastContainer, toast } from 'react-toastify';
import { errorToste, } from '../../constant/util';
import Viewer from '../common/pdf/viewer';
import moment from 'moment';

class StudentNotesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      pdfData: null,
      pro: {},
      commentCount: 0,
      commentData: [],
      text: '',
      textReply: '',
      commentObj:
      {
        comment_id: "",
        flag: false,

      },
      instituteId:0,
      
    }

  }

  componentWillReceiveProps(nextProps){
		var pro = this.props  ? this.props.location.state.instituteId : ""
		if(pro != nextProps.instituteId){
      this.setState({instituteId:nextProps.instituteId},()=>{
        this.props.history.push('/app/studentnotes-directory')
      });
    }
	}

  componentDidMount() {
    this.getStudentNoteDetails();
    this.getListOfComment();
  }

  backToAllNotes() {
    const pro1 = this.props.location.state ? this.props.location.state.data1 :"";
    this.props.history.push({ pathname: 'studentnotes-directory',state:{data:pro1} })
  }

  getStudentNoteDetails() {
    const pro = this.props.location.state ? this.props.location.state.data :"";
    const pro1 = this.props.location.state ? this.props.location.state.data1 :"";
   
    let apiData = {
      payload: {
        notes_id: pro.notes_id,
        batch_notes_id: pro.batch_notes_id,
      },
      token: this.props.token,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
    }
    this.props.getStudentNoteDetail(apiData).then(() => {
      let res = this.props.studentNotesDetails;
     
      if (res && res.data.status === 200) {
        this.setState({ fileList: res.data.response, pro }, () => {
          this.downLoadData(this.state.fileList[0]);
        })
      }else if(res && res.data.status == 500){
      errorToste(res.data.message)
      }

    })
  }

  onSelectFile(file) {
    this.downLoadData(file);
  }

  downLoadData(file) {
    let { pro } = this.state;
    let apiData = {
      payload: {
        notes_file_id: file ? file.notes_file_id :""
      },
      token: this.props.token,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
    }
    this.props.downloadStudentNotesFile(apiData).then(() => {
      let res = this.props.notesData;
      
      if (res && res.data.status == 200) {
       this.setState({pdfData:res.data.response})
      }else if (res && res.data.status == 500){
        errorToste('Something Went Wrong')
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

  convertDataURIToBinary(raw) {
    var raw = atob(raw);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  getListOfComment() {
    const pro = this.props.location.state.data;
    let apiData = {
      payload: {
        page_id: pro.batch_notes_id,
        types : "NOTES"
      },
      token: this.props.token,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
    }
    this.props.getCommentList(apiData).then(() => {
      let res = this.props.commentList;
 
      if (res && res.status == 200) {
        let len;
        if (res.data.response.commentData && res.data.response.commentData.length > 0) {
           len = res.data.response.commentData.length;
          res.data.response.commentData.map((comment, index) => {
            len = len + comment.reply.length

          })
        }
          this.setState({ commentData: res.data.response.commentData, commentCount: res.data.response.commentData ? len : 0 });
        
      }
    })
  }

  onAddComment(parent_id, txt) {
    const pro = this.props.location.state.data;
    let data = {
      payload: {
        "page_id": pro.batch_notes_id,
        "text": txt,
        "parent_id": parent_id,
        "types" : "NOTES"
      },
      token: this.props.token,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
    }

    this.props.addComment(data).then(() => {
      let res = this.props.commentAdd;
      if (res && res.status == 200) {
        this.getListOfComment();
        this.setState({ text: "", textReply: "" })
      }
    })
  }

  onGetAction(key, id) {
    let data = {
      payload: {
        comment_id: id,
        action: key,
      },
      token: this.props.token,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId,
    }
    this.props.commentLikeDislike(data).then(() => {
      let res = this.props.isCommentlike;
      if (res && res.status == 200) {
        this.getListOfComment();
      }
    })
  }

  onChangeText(event) {
    this.setState({ text: event.target.value });
  }

  onChangeTextReply(event) {
    this.setState({ textReply: event.target.value });
  }

  getReplyButton(id, flagVal) {
    let { commentObj } = this.state;
    commentObj = { ...commentObj, comment_id: id, flag: flagVal }
    this.setState({ commentObj })

  }

  onCommentDelete(key,id){
		let {deleteObj} = this.state;
    this.setState({deleteObj:key,id})
	}

	onDeleteEntry(flag) {
    let {index,id} = this.state;
    if(flag == 'comment'){
      this.onDeleteComment(id);
      $("#quizSubmit .close").click();
    }
    if(flag == 'replycomment'){
			this.onDeleteComment(id);
      $("#quizSubmit .close").click();
		}
  }

	onDeleteComment(id){
		
   let data = {
		 payload:{
			comment_id:id
		 },
		 institute_id: this.props.instituteId,
		 branch_id: this.props.branchId,
		 token: this.props.token
	 }
	 this.props.deleteComment(data).then(()=>{
		 let res = this.props.commentDelete;
		 
		 if(res && res.data.status == 200){
       
			this.getListOfComment();
		 }
	 })
	}

  renderPDF() {
    let { pdfData } = this.state;
    if (pdfData) {
      return (
        <div style={{ width: "100%" }}>
          {/* // return <Viewer url={this.convertDataURIToBinary(pdfData)} readonly={true} /> */}
          <iframe src={pdfData+"#toolbar=0"} style={{ width: "100%", height: "550px" }} frameBorder="0"></iframe>
        </div>
      )
    } else {
      return false;
    }
  }

  renderFileList() {
    let { fileList } = this.state;
    if (fileList && fileList.length > 0) {
      return fileList.map((file, index) => {
        return (
          <a key={"file" + index} className="linkbtn" onClick={this.onSelectFile.bind(this, file)} ><i className="icon cg-pdf"></i>{file.file_name}</a>
        )
      })
    }
  }

  renderCommentlist() {
    let { commentData } = this.state;
    if (commentData && commentData.length > 0) {
      
      return commentData.map((comment, index) => {
        let likeClass = comment.selfLike == "like" ? 'likeBtn st-active' : 'likeBtn';
        let dislikeClass = comment.selfDislike == "dislike" ? 'likeBtn st-active' : 'likeBtn';
        return (
          <div key={`comment${index}`} className="sub_commentField main_commentField">
            <div className="clearfix">
              <div className="sub_commentField__profimg">
                <img src={comment.picture_url} alt="" />
              </div>
              <div className="sub_commentField__title  clearfix">
                <h4 className="Field__name">{comment.firstName + " " + comment.lastName}</h4>
                <span className="Field__time">{moment(comment.time).format("DD MMM YYYY hh:mm a")}</span>
              </div>
              <div className="sub_commentField__title clearfix">
                <span className="Field__time">{comment.text}</span>
              </div>

              <div className="sub_commentField__votes clearfix">
                <ul>
                  <li>
                    <button className={likeClass}  onClick={this.onGetAction.bind(this, "like", comment.comment_id)}>
                      <i className="icon cg-arrow-up"></i>
                      Upvote <span>{comment.upvoteCount}</span>
                    </button>
                  </li>
                  <li>
                    <button className={dislikeClass}onClick={this.onGetAction.bind(this, "dislike", comment.comment_id)}>
                      <i className="icon cg-arrow-down"></i>
                      Downvote <span>{comment.downvoteCount}</span>
                    </button>
                  </li>
                  <li>
                    <button className="replyBtn" onClick={this.getReplyButton.bind(this, comment.comment_id, true)}>Reply</button>
                  </li>
                  {comment.selfComment == true ? 
                  <li>
									<button className="replyBtn" data-toggle="modal" data-target="#quizSubmit" onClick={this.onCommentDelete.bind(this,"comment", comment.comment_id)}>Delete</button>
									</li> :""}
                </ul>
              </div>

              {this.state.commentObj.comment_id == comment.comment_id &&
                this.state.commentObj.flag == true
                ? <div className="sub_commentField__replyfld clearfix">
                  <textarea name="scenario" style={{ color: "#3D3F61" }} value={this.state.textReply} onChange={this.onChangeTextReply.bind(this)} placeholder="Write comment here."></textarea>
                  <button className="subReplyBtn" onClick={this.onAddComment.bind(this, comment.comment_id, this.state.textReply)}>Reply</button>
                </div> : ""}
            </div>
            {this.renderReplyList(comment)}
          </div>
        )
      })
    }
  }

  renderReplyList(comment) {
    if (comment.reply && comment.reply.length > 0) {
      return comment.reply.map((commentReply, index) => {
        let likeClass = commentReply.selfLike == "like" ? 'likeBtn st-active ' : 'likeBtn ';
				let dislikeClass = commentReply.selfDislike == "dislike" ? 'likeBtn st-active' : 'likeBtn ';
        return (
          <div key={`reply${index}`} className="sub_commentField">

            <div className="clearfix">
              <div className="sub_commentField__profimg">
                <img src={commentReply.picture_url} alt="" />
              </div>

              <div className="sub_commentField__title  clearfix">
                <h4 className="Field__name">{commentReply.firstName + " " + commentReply.lastName}</h4>
                <span className="Field__time">{moment(commentReply.time).format("DD MMM YYYY hh:mm a")}</span>
              </div>

              <div className="sub_commentField__title clearfix">
                <span className="Field__time">{commentReply.text}</span>
              </div>

              <div className="sub_commentField__votes clearfix">
                <ul>
                  <li>
                    <button className={likeClass} onClick={this.onGetAction.bind(this, "like", commentReply.comment_id)}>
                      <i className="icon cg-arrow-up"></i>
                      Upvote <span>{commentReply.replyupvoteCount}</span>
                    </button>
                  </li>
                  <li>
                    <button className={dislikeClass} onClick={this.onGetAction.bind(this, "dislike", commentReply.comment_id)}>
                      <i className="icon cg-arrow-down"></i>
                      Downvote <span>{commentReply.replydownvoteCount}</span>
                    </button>
                  </li>
                  {commentReply.selfComment == true ? 
                  <li>
									<button className="replyBtn" data-toggle="modal" data-target="#quizSubmit" onClick={this.onCommentDelete.bind(this,"replycomment", commentReply.comment_id)}>Delete</button>
									</li>:""}
                </ul>
              </div>
            </div>

          </div>
        )
      })
    }
  }

  render() {
    const pro = this.props.location.state.data ? this.props.location.state.data : ""
    return (
      <div className="c-container clearfix">
      <ToastContainer/>
        <div className="clearfix">
          <div className="divider-container margin0-bottom">
            <div className="divider-block text--left">
              <div className="c-brdcrum">
                <a className="linkbtn hover-pointer" onClick={this.backToAllNotes.bind(this)}>Back to All Notes</a>
              </div>
            </div>
          </div>

          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">{pro.title ? pro.title : ''}</span>
            </div>
          </div>
        </div>
        <div className="clearfix row">
          <div className="col-md-3 col-sm-12 col-xs-12">
            <div className="clearfix btn--listing">
              <div className="block-title st-colored">Files</div>
              {this.renderFileList()}
            </div>
          </div>
          <div className="col-md-9 col-sm-12 col-xs-12">
            <div className="c-container__data st--blank">
              <span className="c-heading-sm card--title margin25-bottom">note</span>
              {this.renderPDF()}
            </div>
          </div>
        </div>
        <div className="clearfix c-blogComments">
          <div className="block-title st-colored noborder">DISCUSSION ({this.state.commentCount})</div>

          <div className="commentField">
            <textarea style={{ color: "#3D3F61" }} value={this.state.text} onChange={this.onChangeText.bind(this)} placeholder="Write comment here."></textarea>
            <div className="clearfix">
              <button className="c-btn prime" onClick={this.onAddComment.bind(this, 0, this.state.text)}>Comment</button>
            </div>
          </div>
          {this.renderCommentlist()}
        </div>
        <DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, student }) => ({
  studentNotesDetails: student.studentNotesDetails,
  instituteId: app.institudeId,
  branchId: app.branchId,
  token: auth.token,
  notesData: student.notesData,
  commentList: student.commentList,
  commentAdd: student.commentAdd,
  isCommentlike: student.isCommentlike,
  commentDelete:student.commentDelete
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStudentNoteDetail,
      downloadStudentNotesFile,
      getCommentList,
      addComment,
      commentLikeDislike,
      deleteComment
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentNotesDetail)
