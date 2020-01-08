import React, { Component } from 'react';
import { errorToste } from '../../constant/util';
import { ToastContainer } from 'react-toastify';

export class AddStudentBatchModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			classes: [],
			subjects: [],
			classname: "Select Class",
			selectedSubjects: {},
			selectedSubjectArray: [],
			batch: {},
			batch_student: [],
			selectAll: false,
			isBatchSelected: false,
		}
	}

	componentWillMount() {
		let data = {
			"institude_id": this.props.instituteId,
			"branch_id": this.props.branchId,
			token: this.props.token
		};
		this.props.getClasses(data).then(() => {
			this.setState({ classes: this.props.classes });
		})
	}

	classDropDownChange(classe, event) {
		classe.token = this.props.token,
			classe.institude_id = this.props.instituteId;
		this.props.getSubjects(classe).then(() => {

			this.setState({ batch_student: [], classname: classe.class_name, subjects: this.props.subjects, selectedSubjectArray: [] });
		})
	}

	onSelectedSubjectChange(sub, event) {
		sub.token = this.props.token,
			this.props.getBatches(sub).then(() => {

				let newRes = [];
				this.props.batches.map((ele) => {
					if (ele.isExpired == "ACTIVE" && ele.inComplete == false) {
						newRes.push(ele)
					}
				});
				let res = newRes;


				let { selectedSubjects } = this.state;
				let { selectedSubjectArray } = this.state;
				let { batch } = this.state;
				let { batch_student } = this.state;

				if (selectedSubjects && selectedSubjects[sub.subject_id]) {
					selectedSubjects[sub.subject_id] = false;
					selectedSubjectArray.forEach((item, index) => {
						if (sub.subject_id === item.subject_id) {
							selectedSubjectArray.splice(index, 1);
						}
					})

					delete batch[sub.subject_id];


					batch_student.map((data, index) => {


						res.map((batch, index) => {

							if (data.batch_id == batch.batch_id) {

								batch_student.splice(data, 1);
							}
						})
					})
				}
				else {

					if (res.length > 0) {

						selectedSubjects[sub.subject_id] = true;
						selectedSubjectArray.push(sub);

						batch_student.push({ "batch_id": Number(res[0].batch_id) })

						batch[sub.subject_id] = this.props.batches;
					}
				}

				this.setState({ selectedSubjects, selectedSubjectArray, batch, batch_student }, () => {

					let selectedSubjectLength = selectedSubjectArray.length;
					let subjectLength = this.props.subjects.length;

					if (selectedSubjectLength == subjectLength) {
						this.setState({ selectAll: true })
					} else {
						this.setState({ selectAll: false });
					}
				});

			})

	}

	selectBranch(index, event) {
		let { batch_student } = this.state;
		batch_student[index] = { "batch_id": Number(event.target.value) };
	}

	onHandleClick(event) {
		let { batch_student } = this.state;
		let data = batch_student;

		this.setState({ batch_student: [], selectedSubjectArray: [], selectedSubjects: [], classname: "", subjects: [] })

		if (data.length == 0) {
			errorToste('Insufficient Data(Can Not Add Batch Without Class,Subject And Batch.)')
		} else {
			this.props.onAddStudentBatch(data);
		}
	}

	selectAll(event) {
		let { selectAll, subjects, selectedSubjects, selectedSubjectArray, batch, batch_student } = this.state;
		selectedSubjects = {}, selectedSubjectArray = [], batch_student = [], batch = {};
		selectAll = !selectAll;
		this.setState({ selectAll, selectedSubjects, selectedSubjectArray, batch, batch_student }, () => {
			if (selectAll) {
				selectedSubjects = {}, selectedSubjectArray = [], batch_student = [], batch = {};
				subjects.map((sub, index) => {
					let newSelectedSubjects = this.state.selectedSubjects;
					let newSelectedSubjectArray = this.state.selectedSubjectArray;
					let newBatch = this.state.batch;
					let newBatch_student = this.state.batch_student;
					sub.token = this.props.token,
						this.props.getBatches(sub).then(() => {
							let res = this.props.batches;

							let newRes = [];
							this.props.batches.map((ele) => {
								if (ele.isExpired == "ACTIVE" && ele.inComplete == false) {
									newRes.push(ele)
								}
							});
							let Res = newRes;

							if (Res.length > 0) {
								newSelectedSubjects[sub.subject_id] = true;
								newSelectedSubjectArray.push(sub);
								newBatch_student.push({ "batch_id": Number(Res[0].batch_id) })
								newBatch[sub.subject_id] = Res;
								this.setState({
									selectedSubjects: newSelectedSubjects,
									selectedSubjectArray: newSelectedSubjectArray,
									batch: newBatch,
									batch_student: newBatch_student
								})
							}
						})
				})
			}
		});

	}

	renderSubject() {
		if (this.state.subjects && this.state.subjects.length > 0) {
			return this.state.subjects.map((sub, index) => {

				let { selectedSubjects } = this.state;

				let selected = selectedSubjects[sub.subject_id] ? "st-selected" : ""
				return (
					<li key={"sub" + index}><button className={`listItem ${selected}`} onClick={this.onSelectedSubjectChange.bind(this, sub)}>{sub.subject_name}</button></li>
				)

			})
		}
	}

	renderClassDropDown() {
		if (this.state.classes && this.state.classes.length > 0) {
			return this.state.classes.map((data, index) => {
				return (
					<li key={"class" + index}><a onClick={this.classDropDownChange.bind(this, data)} className="dd-option">{data.class_name}</a></li>
				)
			})
		}
	}

	renderBatchOption(id) {

		if (this.state.batch[id]) {
			return this.state.batch[id].map((batch, index) => {

				if (batch.inComplete == false && batch.isExpired == "ACTIVE") {
					return (
						<option key={"batch" + index} value={batch.batch_id}>{batch.name}</option>
					)
				}
			})
		}

	}

	renderSelectedBatchSubject() {

		return this.state.selectedSubjectArray.map((sub, index) => {


			return (
				<div key={"subject" + index} className="form-group cust-fld">
					<label>{sub.subject_name}</label>
					<div className="dropdown-custome">
						<select style={{ color: "#3D3F61", fontSize: "14px" }} onChange={this.selectBranch.bind(this, index)}>
							{this.renderBatchOption(sub.subject_id)}
						</select>
					</div>
				</div>
			)
		})
	}

	render() {
		return (
			<div className="modal fade custom-modal-sm width--lg" id="addBatch" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
				<ToastContainer />
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
							<h4 className="c-heading-sm card--title">Add Batches</h4>
						</div>
						<div className="modal-body">

							<div className="divider-container addBatch-container">

								<div className="divider-block" >
									<div className="cust-m-info">Select class and select multiple subjects.</div>
									<div className="form-group cust-fld">
										<label>Class</label>
										<div className="dropdown">
											<button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												{this.state.classname}
											</button>
											<ul style={{ height: "100px", overflow: "auto", marginTop: "-1px" }} className="dropdown-menu" aria-labelledby="dLabel">
												{this.renderClassDropDown()}

											</ul>
										</div>
									</div>


									<div className="c-subListing">
										<div className="clearfix">

											<div className="subjectHeader clearfix" style={{ marginTop: "20px" }}>
												<div className="pull-left"><div className="cust-m-info nomargin">Subjects</div></div>
												<div className="pull-right">
													<div className="form-group nomargin">
														<label htmlFor="check-all" className="custome-field field-checkbox">
															<input type="checkbox" onClick={this.selectAll.bind(this)} name="check-one" id="check-all" value="checkone" checked={this.state.selectAll} />
															<i></i><span>Select All</span>
														</label>
													</div>
												</div>
											</div>

											<div className="subjectBody" style={{overflowY:"auto"}}>
												<ul>
													{this.renderSubject()}
												</ul>
											</div>

										</div>
									</div>


								</div>

								<div className="divider-block">
									<div className="cust-m-info">Select batch for each subject.</div>
									<div className="c-batchSelect" style={{overflowY:"auto"}}>
										{this.renderSelectedBatchSubject()}

									</div>
									{this.state.isBatchSelected ? <label className="help-block" style={{ color: "red" }}>Please enter batch</label> : <br />}
								</div>

							</div>

						</div>
						<div className="modal-footer">
							<div className="clearfix text--right">
								<button className="c-btn grayshade" data-dismiss="modal">Cancel</button>
								<button className="c-btn primary" onClick={this.onHandleClick.bind(this)} >Add Batches</button>
							</div>
						</div>
					</div>
				</div>
			</div>


		)
	}
}



export default (AddStudentBatchModel)


