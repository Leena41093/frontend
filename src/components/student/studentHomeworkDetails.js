import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	getStudentHomeworkDetails, submitHomeworkDate, submitHomeworkFile,
	downloadStudentHomeworkFile, getCommentList, addComment, commentLikeDislike, deleteComment
} from '../../actions/studentAction';
import { downLoadStudentHomeWorkSubmissionFile } from '../../actions/professorActions';
import moment from 'moment';
import $ from 'jquery';
import { DeleteModal } from '../common/deleteModal';
import DropzoneComponent from 'react-dropzone-component';
import { ToastContainer, toast } from 'react-toastify';
import { successToste, infoToste, errorToste } from '../../constant/util';
import fileDownload from 'js-file-download';
import 'react-dropzone-component/styles/filepicker.css';
import { PdfViewModel } from '../common/professorModel/pdfViewModel';
import 'dropzone/dist/min/dropzone.min.css';
import Viewer from '../common/pdf/viewer';
import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;  
    margin-left:10px;
`;


var componentConfig = {
	// iconFiletypes: ['.pdf'],
	showFiletypeIcon: true,
	postUrl: '/uploadHandler',
	uploadMultiple: false
};

var djsConfig = {
	autoProcessQueue: false,
	acceptedFiles: "application/pdf",
	maxFiles: 1,
}



class StudentHomeworkDeatils extends Component {
	constructor(props) {
		let dropzone = null;
		super(props);
		// this.onGetFile = this.onGetFile.bind(this);
		this.state = {
			fileList: [],
			homeWorkDetails:
			{
				batch_name: "",
				class_name: "",
				folder_name: "",
				subject_name: "",
				topic: "",
				title: "",
				start_date: moment(),
				end_date: moment(),
			},
			files: [],
			commentData: [],
			commentCount: 0,
			replyCount: 0,
			text: '',
			textReply: '',
			commentObj:
			{
				comment_id: "",
				flag: false,

			},
			studentFiles: [],
			pdfData: null,
			pdfComment: [],
			dropzones: "all",
			isfileSelected: false,
			instituteId: 0,
			deleteObj: null,
			index: 0,
			id: 0,
			sendDataToPdfViewModel: {},
			fileSizeErrorMsg: false,
			resFlag:false
		}
	}

	componentWillReceiveProps(nextProps) {
		var pro = this.props ? this.props.location.state.instituteId : ""
		if (pro != nextProps.instituteId) {
			this.setState({ instituteId: nextProps.instituteId }, () => {
				this.props.history.push('/app/studenthomework-directory')
			});
		}
	}

	componentDidMount() {
		this.getHomeworks();
		this.getListOfComment();
	}

	getHomeworks() {
		const pro = this.props ? this.props.location.state.data : "";
		const data1 = this.props ? this.props.location.state.data1 : "";

		let data = {
			payload: {
				homework_id: pro.homework_id,
				batch_homework_id: pro.batch_homework_id,
				batch_id: pro.batch_id
			},
			token: this.props.token,
			institute_id: this.props.instituteId,
			branch_id: this.props.branchId,
		}
		this.props.getStudentHomeworkDetails(data).then(() => {
			let res = this.props.studentHomeworkDetails;
			if (res.data && res.data.status === 500) {

			}
			else if (res && res.status === 200) {
				this.setState({
					homeWorkDetails: res.data.response.homeWorkDetails,
					fileList: res.data.response.homeworkFiles,
					studentFiles: res.data.response.studentSubmission,
					pdfComment: res.data.response.studentAnnotation,
					resFlag:true
				}, () => {
					this.getStudentFilesdata(this.state.studentFiles[0]);
				})
			}
		})
	}

	getListOfComment() {
		const pro = this.props.location.state.data;
		let apiData = {
			payload: {
				page_id: pro.batch_homework_id,
				types: "HOMEWORK"
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
				"page_id": pro.batch_homework_id,
				"text": txt,
				"parent_id": parent_id,
				"types": "HOMEWORK"
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

	backToDashbord() {
		this.props.history.push({
			pathname: 'dashboard'
		})
	}

	goToAllHomeworks() {
		const data1 = this.props ? this.props.location.state.data1 : "";
		this.props.history.push({ pathname: '/app/studenthomework-directory', state: { data: data1 } })
	}

	onGetFile(e) {
		if (e) {
			let { files } = this.state;
			var fileSize = e.target.files ? e.target.files[0].size / 1024 / 1024 : "";
			if (fileSize > 20) {
				this.setState({ fileSizeErrorMsg: true, isfileSelected: false })
			} else {
				files.push(e.target.files[0]);
				this.setState({ files, fileSizeErrorMsg: false, isfileSelected: false });
			}
		}
	}

	// onGetFile(file) {
	// 	this.setState({ dropzones: "none" })
	// 	let { files } = this.state;
	//   files.push(file);
	// 	this.setState({ files,isfileSelected:false });
	// }

	getReplyButton(id, flagVal) {
		let { commentObj } = this.state;
		commentObj = { ...commentObj, comment_id: id, flag: flagVal }
		this.setState({ commentObj })
	}

	getFileData(file, type) {


		let data = {
			payload: {
				homework_file_id: file.homework_file_id
			},
			institute_id: this.props.instituteId,
			branch_id: this.props.branchId,
			token: this.props.token,
		}

		this.props.downloadStudentHomeworkFile(data).then(() => {
			let res = this.props.downloadFileData;

			if (res && res.status === 200) {
				var sendData = {
					file: file,
					pdfUrl: res.data.response,
					type: type
				}

				this.setState({ sendDataToPdfViewModel: sendData })

			} else if (res && res.status == 500) {
				errorToste('Something Went Wrong')
			}
		})
	}

	getStudentFilesdata(files) {
		if (files && files.student_home_work_submission_file_id) {
			let data = {
				payload: {
					"Student_home_work_submission_file_id": files.student_home_work_submission_file_id
				},
				institude_id: this.props.instituteId,
				branch_id: this.props.branchId,
				token: this.props.token,
			}
			this.props.downLoadStudentHomeWorkSubmissionFile(data).then(() => {
				let res = this.props.studentSubmissionFile;
				if (res && res.status == 200) {
					let Fdata = this.b64toBlob(res.data.response);
					fileDownload(Fdata, files.file_name);
					//this.setState({ pdfData: res.data.response })
				}
			})
		}
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

	validate() {
		let isValidForm = true;
		if (this.state.files.length == 0) {
			this.setState({ isfileSelected: true, fileSizeErrorMsg: false });
			isValidForm = false;
		}
		return isValidForm;
	}

	onSubmitHomework() {
		let { homeWorkDetails, files } = this.state;
		const data1 = this.props ? this.props.location.state.data1 : "";
		const isValidForm = this.validate();
		if (!isValidForm) {
			return;
		}
		else {
			let apiData = {
				institute_id: this.props.instituteId,
				branch_id: this.props.branchId,
				batch_homework_id: homeWorkDetails.batch_homework_id,
				token: this.props.token,
				payload: {
					"submission_date": moment(),
				}
			}

			this.props.submitHomeworkDate(apiData).then(() => {
				let res = this.props.studentsubmitHomeworkDate;
				if (res && res.status === 200) {
					infoToste("Homework Submitted Successfully");
					files.map((file, index) => {
						const formData = new FormData();
						formData.append('filename', file);
						formData.append('class_id', homeWorkDetails.class_id);
						formData.append('home_work_id', homeWorkDetails.homework_id);
						formData.append('batch_homework_id', homeWorkDetails.batch_homework_id);
						formData.append('subject_id', homeWorkDetails.subject_id);
						formData.append('batch_id', homeWorkDetails.batch_id);
						formData.append('subject_folder_id', homeWorkDetails.subject_folder_id);
						formData.append('student_homework_submission_id', res.data.response.student_homework_submission_id);
						let data = {
							institute_id: this.props.instituteId,
							branch_id: this.props.branchId,
							token: this.props.token,
							payload: formData,

						}

						this.props.submitHomeworkFile(data).then(() => {
							let res = this.props.studenthomeworkSubmission;
							if (res && res.status == 200) {
								this.props.history.push({ pathname: 'studenthomework-directory', state: { data: data1 } })
							}
						})
					})
				}
			})
		}
	}

	onCommentDelete(key, id) {
		let { deleteObj } = this.state;
		this.setState({ deleteObj: key, id })
	}

	onDeleteEntry(flag) {
		let { index, id } = this.state;
		if (flag == 'comment') {
			this.onDeleteComment(id);
			$("#quizSubmit .close").click();
		}
		if (flag == 'replycomment') {
			this.onDeleteComment(id);
			$("#quizSubmit .close").click();
		}
	}

	onDeleteComment(id) {

		let data = {
			payload: {
				comment_id: id
			},
			institute_id: this.props.instituteId,
			branch_id: this.props.branchId,
			token: this.props.token
		}
		this.props.deleteComment(data).then(() => {
			let res = this.props.commentDelete;

			if (res && res.data.status == 200) {
				this.getListOfComment();
			}
		})
	}

	renderFiles() {
		let { fileList } = this.state;
		if (fileList && fileList.length > 0) {
			return fileList.map((files, index) => {
				return (
					<div key={"key" + index} className="hf__pdf">
						<div className="hf__pdf__header"></div>
						<div className="hf__pdf__name">
							<a data-toggle="modal" data-target="#pdfviewmodel" onClick={this.getFileData.bind(this, files, "studentHomework")}><i className="icon cg-pdf"></i> <a data-toggle="tooltip" title={files.file_name}>{files.file_name.slice(0, 15) + "..."}</a></a>
						</div>
					</div>
				)
			})
		}
	}

	renderStudentFiles() {
		let { studentFiles } = this.state;
		if (studentFiles && studentFiles.length > 0) {
			return studentFiles.map((files, index) => {
				return (
					<div key={"key" + index} className="hf__pdf">
						<div className="hf__pdf__header" style={{ height: "100px" }}></div>
						<div className="hf__pdf__name">
							<a onClick={this.getStudentFilesdata.bind(this, files)}><i className="icon cg-pdf"></i>{files.file_name}</a>
						</div>
					</div>
				)
			})
		}
	}


	onDeleteFile(index) {
		let { files, } = this.state;

		files.splice(index, 1);

		this.setState({ files, fileSizeErrorMsg: false }, () => {

		});
	}

	renderFileName() {


		if (this.state.files && this.state.files.length > 0) {
			return this.state.files.map((file, index) => {
				return (
					<div key={"file" + index} className="c-upfile">
						<div className="c-upfile__name" >{file ? file.name : ''}
							{/* <ClipLoader
								className={override}
								style={{ marginRight: "5%" }}
								sizeUnit={"px"}
								size={20}
								color={'#123abc'}

							/> */}
						</div>
						<div className="c-upfile__opt">
							{/* <label htmlFor={"check-f1" + index} className="custome-field field-checkbox">
								<input type="checkbox" name="check-one" id={"check-f1" + index} value="checkone" />
								<i></i><span>Save to Drive</span>
							</label> */}
							<button className="btn-delete" onClick={this.onDeleteFile.bind(this, index)} ><i className="icon cg-times"></i></button>
						</div>
					</div>
				)
			})
		}

	}

	renderFileSelectionPopup() {
		return (
			<div className="c-file-uploader" style={{ width: "600px" }} >
				<span className="uploader__info">Drag and Drop PDF File Here to Upload</span>
				<span className="uploader__info">or</span>
				{this.state.files.length == 0 || this.state.fileSizeErrorMsg == true ? <div>
					<button className="uploader__btn"><input type="file" accept="application/pdf" onChange={this.onGetFile.bind(this)} /></button>
					{this.state.fileSizeErrorMsg == true ? <label className="help-block text-center" style={{ color: "red" }}>Please Select File Less than 20MB.</label> : <br />}
				</div>
					: <label className="text-center" style={{ color: "red" }}>{"Can Add Only One File"}</label>}

			</div>
		)
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

										<button className={likeClass} onClick={this.onGetAction.bind(this, "like", comment.comment_id)}>
											<i className="icon cg-arrow-up"></i>
											Upvote <span>{comment.upvoteCount}</span>
										</button>
									</li>
									<li>
										<button className={dislikeClass} onClick={this.onGetAction.bind(this, "dislike", comment.comment_id)}>
											<i className="icon cg-arrow-down"></i>
											Downvote <span>{comment.downvoteCount}</span>
										</button>
									</li>
									<li>
										<button className="replyBtn" onClick={this.getReplyButton.bind(this, comment.comment_id, true)}>Reply</button>

									</li>
									{comment.selfComment == true ?
										<li>
											<button className="replyBtn" data-toggle="modal" data-target="#quizSubmit" onClick={this.onCommentDelete.bind(this, "comment", comment.comment_id)}>Delete</button>
										</li> : ""}
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
											<button className="replyBtn" data-toggle="modal" data-target="#quizSubmit" onClick={this.onCommentDelete.bind(this, "replycomment", commentReply.comment_id)}>Delete</button>
										</li> : ""}
								</ul>
							</div>
						</div>

					</div>
				)
			})
		}
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

	renderPDF() {
		let { studentFiles, pdfComment } = this.state;

		let comment = [];
		if (pdfComment.length > 0) {
			pdfComment = pdfComment.replace(/}{/gi, '}||{');
			let pdfStrArr = pdfComment.split("||");
			pdfStrArr.map((str) => {
				comment.push(JSON.parse(str))
			})
		} else {
			comment = []
		}
		if (studentFiles.length > 0) {
			return <Viewer url={this.convertDataURIToBinary(studentFiles)} onComment={(data) => this.onComment(data)} input={comment} showSidebar={false} />
		}
		else {
			return false;
		}
	}

	render() {
		let { homeWorkDetails } = this.state;
		const pro = this.props ? this.props.location.state.data : "";
		return (
			<div className="c-container clearfix">
				<ToastContainer />
				<div className="clearfix">
					<div className="c-brdcrum">
						<a className="linkbtn hover-pointer" onClick={this.backToDashbord.bind(this)}>Back to Dashboard</a>
					</div>
					<div className="divider-container">
						<div className="divider-block text--left">
							<span className="c-heading-lg">{pro.title}</span>
						</div>
						<div className="divider-block text--right">
							<button onClick={this.goToAllHomeworks.bind(this)} className="c-btn grayshade">Back</button>
							{(pro.status == "Checked" || pro.status == "Unchecked" || pro.end_date < moment().format()) ? "" : <button className="c-btn prime" onClick={this.onSubmitHomework.bind(this)}>Submit Homework</button>}
						</div>
					</div>
				</div>

				<div className="c-container__data st--blank">
					<div className="clearfix row">
						<div className="col-md-3 col-sm-6 col-xs-12">
							<div>
								{pro.status == 'Checked' ?
									<div className="clearfix margin25-bottom">

										<div className="block-title st-colored noborder">MARKS</div>
										<div className="c-marks-block">
											{pro.marks ? <span className="marks-detl">{pro.marks + (pro.homeworkTotalMarks && pro.homeworkTotalMarks != 0 ? "/" + pro.homeworkTotalMarks : "")}</span> : ""}
										</div>

									</div>
									: ""}
							</div>
							<div className="block-title st-colored noborder">GENERAL DETAILS</div>

							<div className="clearfix margin25-bottom">
								<div className="form-group static-fld">
									<label>Topic</label>
									<span className="info-type">{homeWorkDetails.topic ? homeWorkDetails.topic : ""}</span>
								</div>
								<div className="form-group static-fld">
									<label>Subject</label>
									<span className="info-type">{homeWorkDetails.subject_name ? homeWorkDetails.subject_name : ''}</span>
								</div>
								<div className="form-group static-fld">
									<label>Folder</label>
									<span className="info-type">{homeWorkDetails.folder_name ? homeWorkDetails.folder_name : ''}</span>
								</div>
								<div className="form-group static-fld">
									<label>Batch</label>
									<span className="info-type">{homeWorkDetails.batch_name ? homeWorkDetails.batch_name : ''}</span>
								</div>
								<div className="form-group static-fld">
									<label>Class</label>
									<span className="info-type">{homeWorkDetails.class_name ? homeWorkDetails.class_name : ''}</span>
								</div>
								<div className="form-group static-fld">
									<label>Date Assigned</label>
									<span className="info-type">{moment(homeWorkDetails.start_date).format(("DD MMM YYYY hh:mm a"))}</span>
								</div>
								<div className="form-group static-fld">
									<label>Due Date</label>
									<span className="info-type">{moment(homeWorkDetails.end_date).format(("DD MMM YYYY hh:mm a"))}</span>
								</div>
								<div className="clearfix c-homework-files">
									<div className="block-title st-colored noborder">
										HOMEWORK FILES
									</div>
									<div className="hf__uploaded clearfix ">
										{this.renderFiles()}
									</div>
								</div>

							</div>
						</div>


						<div className="col-md-9 col-sm-6 col-xs-12">
							{this.state.resFlag == true ?
							this.state.studentFiles != [] && this.state.studentFiles.length > 0 ?
								<div>
									{this.renderPDF()}
								</div>
								:


								<div className="form-group cust-fld" style={{ width: "300px", marginTop: "-9px" }}>
									{(moment(homeWorkDetails.end_date) > moment(new Date())) ?
										<div><label>Homework File <sup>*</sup></label>
											{this.renderFileSelectionPopup()}</div> :
										<div className="block-title st-colored noborder">
											This Homework expired on date <span >{moment(homeWorkDetails.end_date).format("DD MMM YYYY hh:mm a")}</span>
										</div>}
									{this.state.isfileSelected ? <label className="help-block" style={{ color: "red" }}>Please Select File</label> : <br />}

									<div className="clearfix" style={{ width: "300px" }}>
										{this.renderFileName()}
									</div>
								</div>
							 : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "45%", marginTop: "15%" }}>
							 <ClipLoader
								className={override}
								sizeUnit={"px"}
								size={50}
								color={'#123abc'}
				
							 /></div>}

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
						</div>
					</div>
				</div>
				<DeleteModal flag={this.state.deleteObj} onDelete={(val) => { this.onDeleteEntry(val) }}   {...this.props} />
				<PdfViewModel sendDataToPdfViewModel={this.state.sendDataToPdfViewModel} {...this.props} />
			</div>
		)
	}
}

const mapStateToProps = ({ app, auth, student, professor }) => ({
	instituteId: app.institudeId,
	branchId: app.branchId,
	studentHomeworkDetails: student.studentHomeworkDetails,
	token: auth.token,
	studentsubmitHomeworkDate: student.studentsubmitHomeworkDate,
	studenthomeworkSubmission: student.studenthomeworkSubmission,
	downloadFileData: student.downloadFileData,
	commentList: student.commentList,
	commentAdd: student.commentAdd,
	isCommentlike: student.isCommentlike,
	studentSubmissionFile: professor.studentSubmissionFile,
	commentDelete: student.commentDelete
})

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getStudentHomeworkDetails,
			submitHomeworkDate,
			submitHomeworkFile,
			downloadStudentHomeworkFile,
			getCommentList,
			addComment,
			commentLikeDislike,
			downLoadStudentHomeWorkSubmissionFile,
			deleteComment
		}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(StudentHomeworkDeatils)     