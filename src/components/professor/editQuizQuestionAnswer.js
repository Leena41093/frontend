import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { successToste, errorToste } from '../../constant/util';
import { ToastContainer, toast } from 'react-toastify';
import { getQuizQuesionAnswerList, editQuizQuestion, addProfQuizImage, deleteProfQuizImage } from '../../actions/professorActions';

class EditQuizQuestionAnswer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions_answer: {},
			errors: {},
			error: {
				isQuestionVisible: false,
				isOption1Visible: false,
				isOption2Visible: false,
				isOption3Visible: false,
				isOption4Visible: false,
				isNoOfOptionVisible: false,
			},
			data: '',
			questionArray: [],
			isAnswerVisible: false,
			isQuestionNoVisible: false,
			validateOnInvalidNumber: {},
			imageAddBtn: true,
			instituteId: 0,
			pro: {},
			isQuestionAdd: false
		}
	}


	componentWillReceiveProps(nextProps) {

		let id = localStorage.getItem("instituteid");
		if (id == nextProps.instituteId) {
			if (this.state.instituteId != nextProps.instituteId) {
				this.props.history.push("/app/dashboard");
			}
		}
	}

	componentDidMount() {
		const pro = this.props.location.state ? this.props.location.state.pro1 : "";
		const pro1 = this.props.location.state ? this.props.location.state.data : "";
		this.setState({ instituteId: this.props.instituteId, pro });
		let data = {
			institude_id: this.props.instituteId,
			branch_id: this.props.branchId,
			token: this.props.token,
			payload: { quiz_id: pro1.quiz_id },
		}
		this.props.getQuizQuesionAnswerList(data).then(() => {
			let res = this.props.questionAnswerList;
			if (res && res.data.status == 200) {
				this.setState({ questionArray: res.data.response });
			}
		})
	}

	onInputChange(key, index, errorProperty, event) {

		let { questionArray } = this.state;
		let { errors } = this.state;
		questionArray[index][key] = event.target.value
		errors[index] = { ...errors[index], [errorProperty]: false }
		this.setState({ questionArray })
	}

	handleButton(index, value, event) {
		let { questionArray } = this.state;
		questionArray[index]["answer"] = value
		this.setState({ questionArray })
	}

	validate() {
		var errors = {};

		let { questionArray } = this.state;

		let isValidForm = true;
		if (questionArray.length == 0) {
			this.setState({ isQuestionAdd: true })
			isValidForm = false;
		}

		questionArray.map((queArray, index) => {
			errors[index] = {};
			if (!queArray.question) {
				errors[index] = { ...errors[index], isQuestionVisible: true };
				isValidForm = false;
			}
			if (!queArray.option1 && queArray.no_of_options >= 1) {
				errors[index] = { ...errors[index], isOption1Visible: true };
				isValidForm = false;
			}
			if (!queArray.option2 && queArray.no_of_options >= 2) {
				errors[index] = { ...errors[index], isOption2Visible: true };
				isValidForm = false;
			}
			if (!queArray.option3 && queArray.no_of_options >= 3) {
				errors[index] = { ...errors[index], isOption3Visible: true };
				isValidForm = false;
			}
			if (!queArray.option4 && queArray.no_of_options >= 4) {
				errors[index] = { ...errors[index], isOption4Visible: true };
				isValidForm = false;
			}
			if (!queArray.no_of_options) {
				errors[index] = { ...errors[index], isNoOfOptionVisible: true };
				isValidForm = false;
			}
			this.setState({ errors })
		})
		return isValidForm;
	}


	onSaveQuiz() {
		const isValidForm = this.validate();
		const pro = this.props.location.state ? this.props.location.state.pro1 : "";
		if (!isValidForm) {
			return;
		}
		else {
			const pro1 = this.props.location.state ? this.props.location.state.data : "";
			let { questionArray } = this.state;

			let data = {
				payload: { questions_answer: questionArray, quiz_id: pro1.quiz_id },
				institude_id: this.props.instituteId,
				branch_id: this.props.branchId,
				token: this.props.token,

			}
			this.props.editQuizQuestion(data).then(() => {
				let res = this.props.editedQuestionAnswer;
				if (res && res.status == 200) {
					if (this.state.pro.fromDrive !== true) {
						this.props.history.push({ pathname: '/app/quiz-directory', state: { data: pro } });
					}
					else {
						this.props.history.push('/app/professor-drive')
					}
					successToste("Quiz Edited Successfully");
				}
			})
		}
	}

	onGotoDrive() {
		this.props.history.push('/app/professor-drive')
	}

	backToQuizDirectory(event) {
		const pro = this.props.location.state ? this.props.location.state.pro1 : "";
		this.props.history.push({ pathname: 'quiz-directory', state: { data: pro } })
	}

	onDeleteQuizQuestion(index, questionNo, question) {
		let { questionArray } = this.state;
		const pro1 = this.props.location.state ? this.props.location.state.data : "";


		let data = {
			payload: {
				quiz_id: pro1.quiz_id,
				question_no: questionNo,
				isEdit: true
			},
			institude_id: this.props.instituteId,
			branch_id: this.props.branchId,
			token: this.props.token,
		}

		this.props.deleteProfQuizImage(data).then(() => {
			let res = this.props.profQueTypeQuizImageDelete

		})
		questionArray.splice(index, 1)
		questionArray.map((obj, index) => {
			obj.question_no = index + 1;
		});
		this.setState({ questionArray })
	}

	onDeleteQuizQuestionImage(index, questionNo, event) {
		let { questionArray } = this.state;
		questionArray[index] = { ...questionArray[index], image_url: "", }
		this.setState({ questionArray })
		const pro = this.props.location.state.data;
		let data = {
			payload: {
				quiz_id: pro.quiz_id,
				question_no: questionNo,
				isEdit: true
			},
			institude_id: this.props.instituteId,
			branch_id: this.props.branchId,
			token: this.props.token,
		}

		this.props.deleteProfQuizImage(data).then(() => {
			let res = this.props.profQueTypeQuizImageDelete


			if (res && res.status == 200) {

			}
		})
	}

	numberOfOption(index, errorProperty, event) {

		let { questionArray, errors, validateOnInvalidNumber } = this.state;
		if (event.target.value < 2 || event.target.value > 4) {
			validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: true }
		}
		if (event.target.value == 2) {
			validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: false }

			if (questionArray[index].answer == 3 || questionArray[index].answer == 4) {
				errors[index] = { ...errors[index], answer: false }
				questionArray[index] = { ...questionArray[index], answer: 1 }
			}
			questionArray[index] = { ...questionArray[index], option3: null, option4: null }

		}

		if (event.target.value == 3) {
			validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: false }
			errors[index] = { ...errors[index], option3: false }
			errors[index] = { ...errors[index], option4: true }


			questionArray[index] = { ...questionArray[index], option4: "" }
			delete questionArray[index].option4

			if (questionArray[index].answer == 4) {
				errors[index] = { ...errors[index], answer: false }
				questionArray[index] = { ...questionArray[index], answer: 1 }
			}
			questionArray[index] = { ...questionArray[index], option4: null }

		}

		if (event.target.value == 4) {
			validateOnInvalidNumber[index] = { ...validateOnInvalidNumber[index], isNoValide: false }
			if (questionArray[index].no_of_options == 2) {
				errors[index] = { ...errors[index], option3: false }
				errors[index] = { ...errors[index], option4: false }
				questionArray[index] = { ...questionArray[index], option3: "" }
				questionArray[index] = { ...questionArray[index], option4: "" }

			}
			if (questionArray[index].no_of_options == 3) {
				errors[index] = { ...errors[index], option4: false }
				questionArray[index] = { ...questionArray[index], option4: "" }
			}


		}
		errors[index] = { ...errors[index], [errorProperty]: false };

		questionArray[index] = { ...questionArray[index], no_of_options: event.target.value }
		this.setState({ questionArray, errors, validateOnInvalidNumber }, () => {

		})
	}

	addNewQuestion() {
		let { errorObject } = this.state;
		let { questionArray } = this.state;
		let questionObject = {
			question: '',
			// option1: '',
			// option2: '',
			// option3: '',
			// option4: '',
			no_of_options: "4",
			question_no: questionArray.length + 1,
			answer: 1,
			image_url: "",
			image_name: ""
		}
		questionArray = questionArray.concat(questionObject);
		this.setState({ questionArray, isQuestionAdd: false }, () => {
			document.getElementById('addbtn').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })

		})
	}

	getImage(index, questionNo, question, event) {

		let { questionArray } = this.state;

		questionArray[index] = { ...questionArray[index], image_url: URL.createObjectURL(event.target.files[0]) }
		this.setState({ questionArray, imageAddBtn: false })
		const pro1 = this.props.location.state ? this.props.location.state.data : "";
		const formData = new FormData();
		formData.append("filename", event.target.files[0]);
		formData.append('quiz_id', pro1.quiz_id);
		formData.append('question_no', questionNo);
		formData.append('question', question);

		let data = {
			payload: formData,
			institude_id: this.props.instituteId,
			branch_id: this.props.branchId,
			token: this.props.token,
		}

		this.props.addProfQuizImage(data).then(() => {
			let res = this.props.profQueTypeQuizImage;

			if (res && res.data.status == 200) {
				questionArray[index] = { ...questionArray[index], image_url: res.data.response.image_url, image_name: res.data.response.image_name }
				this.setState({ questionArray })
			}
		})
		document.getElementById(index).value = "";
	}

	getImageBtn(index) {
		document.getElementById(index).click()
	}

	renderOption(index, question) {
		let { questionArray } = this.state;
		let length = Number(questionArray[index].no_of_options)
		switch (length) {
			case 2: {
				return (
					<div style={{ marginLeft: "40px" }} className="queList__body" >
						<div className="divider-container">
							<div className="divider-block text--left">

								<div className="ques__option">
									<label htmlFor={"question" + index + 1} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 1)} type="radio" name={index} id={"question" + index + 1} value="1" checked={questionArray[index].answer == "1" ? true : false} />


										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option1} onChange={this.onInputChange.bind(this, "option1", index, "isOption1Visible")} className="form-control" placeholder="Option 1" />
										{(this.state.errors[index] && this.state.errors[index].isOption1Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 1</label> : <br />}
									</div>
								</div>
							</div>
							<div className="divider-block text--left">
								<div className="ques__option">
									<label htmlFor={"question" + index + 2} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 2)} type="radio" name={index} id={"question" + index + 2} value="2" checked={questionArray[index].answer == "2" ? true : false} />

										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option2} onChange={this.onInputChange.bind(this, "option2", index, "isOption2Visible")} className="form-control" placeholder="Option 2" />
										{(this.state.errors[index] && this.state.errors[index].isOption2Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 2</label> : <br />}
									</div>
								</div>
							</div>
						</div>
					</div>
				)
				break;
			}
			case 3: {
				return (
					<div style={{ marginLeft: "40px" }} className="queList__body" >
						<div className="divider-container">
							<div className="divider-block text--left">

								<div className="ques__option">
									<label htmlFor={"question" + index + 1} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 1)} type="radio" name={index} id={"question" + index + 1} value="1" checked={questionArray[index].answer == "1" ? true : false} />


										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option1} onChange={this.onInputChange.bind(this, "option1", index, "isOption1Visible")} className="form-control" placeholder="Option 1" />
										{(this.state.errors[index] && this.state.errors[index].isOption1Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 1</label> : <br />}
									</div>
								</div>
							</div>
							<div className="divider-block text--left">
								<div className="ques__option">
									<label htmlFor={"question" + index + 2} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 2)} type="radio" name={index} id={"question" + index + 2} value="2" checked={questionArray[index].answer == "2" ? true : false} />

										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option2} onChange={this.onInputChange.bind(this, "option2", index, "isOption2Visible")} className="form-control" placeholder="Option 2" />
										{(this.state.errors[index] && this.state.errors[index].isOption2Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 2</label> : <br />}
									</div>
								</div>
							</div>
						</div>
						<div className="divider-container">
							<div className="divider-block text--left">
								<div className="ques__option">
									<label htmlFor={"question" + index + 3} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 3)} type="radio" name={index} id={"question" + index + 3} value="3" checked={questionArray[index].answer == "3" ? true : false} />

										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option3} onChange={this.onInputChange.bind(this, "option3", index, "isOption3Visible")} className="form-control" placeholder="Option 3" />
										{(this.state.errors[index] && this.state.errors[index].isOption3Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 3</label> : <br />}
									</div>
								</div>
							</div>
						</div>
					</div>

				)
				break;
			}
			case 4: {
				return (
					<div style={{ marginLeft: "40px" }} className="queList__body" >
						<div className="divider-container">
							<div className="divider-block text--left">

								<div className="ques__option">
									<label htmlFor={"question" + index + 1} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 1)} type="radio" name={index} id={"question" + index + 1} value="1" checked={questionArray[index].answer == "1" ? true : false} />


										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option1} onChange={this.onInputChange.bind(this, "option1", index, "isOption1Visible")} className="form-control" placeholder="Option 1" />
										{(this.state.errors[index] && this.state.errors[index].isOption1Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 1</label> : <br />}
									</div>
								</div>
							</div>
							<div className="divider-block text--left">
								<div className="ques__option">
									<label htmlFor={"question" + index + 2} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 2)} type="radio" name={index} id={"question" + index + 2} value="2" checked={questionArray[index].answer == "2" ? true : false} />

										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option2} onChange={this.onInputChange.bind(this, "option2", index, "isOption2Visible")} className="form-control" placeholder="Option 2" />
										{(this.state.errors[index] && this.state.errors[index].isOption2Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 2</label> : <br />}
									</div>
								</div>
							</div>
						</div>
						<div className="divider-container">
							<div className="divider-block text--left">
								<div className="ques__option">
									<label htmlFor={"question" + index + 3} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 3)} type="radio" name={index} id={"question" + index + 3} value="3" checked={questionArray[index].answer == "3" ? true : false} />

										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option3} onChange={this.onInputChange.bind(this, "option3", index, "isOption3Visible")} className="form-control" placeholder="Option 3" />
										{(this.state.errors[index] && this.state.errors[index].isOption3Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 3</label> : <br />}
									</div>
								</div>
							</div>
							<div className="divider-block text--left">
								<div className="ques__option">
									<label htmlFor={"question" + index + 4} className="custome-field field-radiobtn">
										<input onClick={this.handleButton.bind(this, index, 4)} type="radio" name={index} id={"question" + index + 4} value="4" checked={questionArray[index].answer == "4" ? true : false} />

										<i></i>
									</label>
									<div className="form-group cust-fld">
										<input type="text" value={questionArray[index].option4} onChange={this.onInputChange.bind(this, "option4", index, "isOption4Visible")} className="form-control" placeholder="Option 4" />
										{(this.state.errors[index] && this.state.errors[index].isOption4Visible) ? <label className="help-block" style={{ color: "red" }}>Enter Option 4</label> : <br />}
									</div>
								</div>
							</div>
						</div>

					</div>
				)
				break;
			}
		}
	}

	renderQuestionList() {
		let { questionArray } = this.state;
		return questionArray.map((question, index) => {

			return (
				<div key={"key" + index} className="addQues-container">
					<div className="c-queList__sect">
						<div className="c-queList__sect__num">{question.question_no}</div>
						<button onClick={this.onDeleteQuizQuestion.bind(this, index, question.question_no)} className="col-md-1" style={{ marginLeft: "30%" }} type="button" className="close" data-dismiss="modal" aria-label="Close"><img src="/images/delete.png" alt="logo" style={{ height: "20px", width: "20px", color: "red", opacity: '0.8' }} /></button>
						<div style={{ marginLeft: '40px' }} className="queList__header">
							<div className="divider-container nomargin">
								<div className="divider-block ques__cont">
									<div className="form-group cust-fld">
										<label>Question</label>
										<textarea className="form-control" value={question.question} onChange={this.onInputChange.bind(this, "question", index, "isQuestionVisible")} placeholder="Type Question Here"></textarea>
										{(this.state.errors[index] && this.state.errors[index].isQuestionVisible) ? <label className="help-block" style={{ color: "red" }}>Enter Question</label> : <br />}
									</div>
									<div>
										{question.image_url ?
											<div>
												<div >
													<button onClick={this.onDeleteQuizQuestionImage.bind(this, index, question.question_no)} className="col-md-1 " style={{ marginLeft: "30%", marginBottom: "-32px", border: "none", backgroundColor: "#EDF0F4" }}  ><img src="/images/delete.png" alt="logo" style={{ height: "20px", width: "20px" }} /></button>
												</div>
												<div>
													<img style={{ height: "150px", width: "200px" }} src={question.image_url} />
												</div>

											</div>
											: ""}
										{question.question ?
											<div>
												<input id={index}
													type="file" accept="image/x-png,image/gif,image/jpeg"
													onChange={this.getImage.bind(this, index, question.question_no, question.question)} style={{ display: "none" }} />
												{question.image_url ? "" :
													<button className="c-btn prime" style={{ border: "none", color: "white", backgroundColor: "#990000", height: "38px", width: "105px", fontSize: "13px" }} onClick={this.getImageBtn.bind(this, index)}>Add Image</button>}
											</div> :
											<div>
												<input id={index}
													type="file" accept="image/x-png,image/gif,image/jpeg"
													onChange={this.getImage.bind(this, index, question.question_no, question.question)} style={{ display: "none" }} />
												{question.image_url ? "" :
													<button className="btn c-btn prime" style={{ border: "none", color: "white", backgroundColor: "#990000", height: "38px", width: "105px", fontSize: "13px" }} onClick={this.getImageBtn.bind(this, index)} disabled>Add Image</button>}
											</div>}
									</div>

								</div>
								<div className="divider-block option__cont">
									<div className="form-group cust-fld" >
										<label>Options</label>
										<input type="number" value={question.no_of_options} onChange={this.numberOfOption.bind(this, index, "isNoOfOptionVisible")} className="form-control" min="1" max="4" placeholder="Option" />
										{(this.state.errors[index] && this.state.errors[index].isNoOfOptionVisible) ? <label className="help-block" style={{ color: "red" }}>Enter No of Option</label> : <br />}
										{(this.state.validateOnInvalidNumber[index] && this.state.validateOnInvalidNumber[index].isNoValide) ? <label className="help-block" style={{ color: "red" }}>Above Number For Option Is Not Valid</label> : <br />}
									</div>

								</div>
							</div>
						</div>

						{this.renderOption(index, question)}
					</div>
				</div>
			)
		})
	}

	render() {
		const pro1 = this.props.location.state.data ? this.props.location.state.data : "";
		return (
			<div className="c-container clearfix">
				<ToastContainer />
				<div className="clearfix">
					<div className="divider-container margin0-bottom">
						<div className="divider-block text--left">
							{this.state.pro.fromDrive != true ? <div className="c-brdcrum">
								<a className="linkbtn hover-pointer" onClick={this.backToQuizDirectory.bind(this)}>Back to All Quizzes</a>
							</div> : <div className="c-brdcrum">
									<a className="linkbtn hover-pointer" onClick={this.onGotoDrive.bind(this)}>Back to Drive</a>
								</div>}
						</div>
					</div>

					<div className="divider-container">
						<div className="divider-block text--left">
							<span className="c-heading-lg">{pro1.quiz_title ? pro1.quiz_title : ''}</span>
						</div>
						<div className="divider-block text--right">
							<button onClick={this.onSaveQuiz.bind(this)} className="c-btn prime">Save Quiz</button>
						</div>
					</div>
				</div>

				{this.renderQuestionList()}

				<div className="modal-footer">
					<div className="clearfix text--right" id="addbtn">
						<button onClick={this.addNewQuestion.bind(this)} className="c-btn primary">Add Question</button>
						{this.state.isQuestionAdd ? <label className="help-block" style={{ color: "red", fontSize: "13px", fontWeight: "350" }}>Please Add Question</label> : <br />}
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ app, professor, auth }) => ({
	branchId: app.branchId,
	instituteId: app.institudeId,
	quiz_id: professor.quiz_id,
	questionAnswerList: professor.questionAnswerList,
	editedQuestionAnswer: professor.editedQuestionAnswer,
	token: auth.token,
	profQueTypeQuizImage: professor.profQueTypeQuizImage,
	profQueTypeQuizImageDelete: professor.profQueTypeQuizImageDelete
})

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			getQuizQuesionAnswerList,
			editQuizQuestion,
			addProfQuizImage,
			deleteProfQuizImage
		}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditQuizQuestionAnswer)