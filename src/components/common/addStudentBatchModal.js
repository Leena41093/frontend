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
			projects: [],
			Accessories: [],
			selectedProjectId: [],
			selectedProject: {},
			selectedAccessoriesId: [],
			selectedAccessorie: {},

		}
	}

	componentWillMount() {
		let apiData = {
			company_id: this.props.company_id,
			branch_id: this.props.branch_id,
		}
		this.props.getAccessories(apiData).then(() => {
			let res = this.props.accessories;
			if (res && res.status == 200) {
				this.setState({ Accessories: res.data.response })
			}

		})

		this.props.getProjectes(apiData).then(() => {
			let res = this.props.projectes;
			if (res && res.status == 200) {
				this.setState({ projects: res.data.response })
			}
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
		let { selectedProjectId, selectedAccessoriesId } = this.state;
		let data = {
			company_id: this.props.company_id,
			branch_id: this.props.branch_id,
			payload: {
				"projectsIds": selectedProjectId,
				"accessoryIds": selectedAccessoriesId,
				"emp_id": this.props.emp_id
			}
		}

		this.props.assignProjectAndAccessories(data).then(() => {
			let res = this.props.assignProjectAccessories;
			console.log("res", res);
			if (res && res.data.status == 200) {
				this.props.onAddStudentBatch(res);
				this.setState({
					selectedProjectId: [],
					selectedProject: {},
					selectedAccessoriesId: [],
					selectedAccessorie: {},
				})
			} else {
				errorToste('Project not Added SuccessFully')
			}
		})
	}

	selectedProject(project) {
		let { selectedProjectId, selectedProject } = this.state;
		if (selectedProject && selectedProject[project.project_id]) {
			selectedProject[project.project_id] = false
			selectedProjectId.forEach((item, index) => {
				if (project.project_id === item) {
					selectedProjectId.splice(index, 1);
				}
			})
		} else {
			selectedProjectId.push(project.project_id);
			selectedProject[project.project_id] = true
		}
		this.setState({ selectedProjectId, selectedProject })
	}

	selectedAccessories(item) {

		let { selectedAccessorie, selectedAccessoriesId } = this.state;
		if (selectedAccessorie && selectedAccessorie[item.accessory_id]) {
			selectedAccessorie[item.accessory_id] = false
			selectedAccessoriesId.forEach((value, index) => {
				if (item.accessory_id === value) {
					selectedAccessoriesId.splice(index, 1);
				}
			})
		} else {
			selectedAccessoriesId.push(item.accessory_id);
			selectedAccessorie[item.accessory_id] = true
		}
		this.setState({ selectedAccessoriesId, selectedAccessorie })
	}

	renderProjectes() {

		if (this.state.projects && this.state.projects.length > 0) {
			return this.state.projects.map((sub, index) => {

				let { selectedProject } = this.state;

				let selected = selectedProject[sub.project_id] ? "st-selected" : ""
				return (
					<li key={"sub" + index}><button onClick={this.selectedProject.bind(this, sub)} className={`listItem ${selected}`} >{sub.project_name}</button></li>
				)

			})
		}
	}

	renderAccessories() {

		if (this.state.Accessories && this.state.Accessories.length > 0) {
			return this.state.Accessories.map((sub, index) => {
				let { selectedAccessorie } = this.state;

				let selected = selectedAccessorie[sub.accessory_id] ? "st-selected" : ""
				return (
					<li key={"sub" + index}><button onClick={this.selectedAccessories.bind(this, sub)} className={`listItem ${selected}`} >{sub.accessory_name}</button></li>
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
							<h4 className="c-heading-sm card--title">Add Projectes And Accessories</h4>
						</div>
						<div className="modal-body">

							<div className="divider-container addBatch-container">

								<div className="divider-block" >
									<div className="cust-m-info">Select  multiple Projectes.</div>

									<div className="c-subListing">
										<div className="clearfix">

											<div className="subjectHeader clearfix" style={{ marginTop: "20px" }}>
												<div className="pull-left"><div className="cust-m-info nomargin">Projectes</div></div>
											</div>
											<div className="subjectBody" style={{ overflowY: "auto" }}>
												<ul>
													{this.renderProjectes()}
												</ul>
											</div>

										</div>
									</div>


								</div>

								<div className="divider-block">
									<div className="cust-m-info">Select Accessories</div>
									<div className="c-subListing">
										<div className="clearfix">

											<div className="subjectHeader clearfix" style={{ marginTop: "20px" }}>
												<div className="pull-left"><div className="cust-m-info nomargin">Accessories</div></div>
											</div>

											<div className="subjectBody" style={{ overflowY: "auto" }}>
												<ul>
													{this.renderAccessories()}
												</ul>
											</div>

										</div>
									</div>
								</div>

							</div>

						</div>
						<div className="modal-footer">
							<div className="clearfix text--right">
								<button className="c-btn grayshade" data-dismiss="modal">Cancel</button>
								<button className="c-btn primary" onClick={this.onHandleClick.bind(this)} >Add Projectes & Accessories</button>
							</div>
						</div>
					</div>
				</div>
			</div>


		)
	}
}



export default (AddStudentBatchModel)


