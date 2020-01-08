import React, { Component } from 'react';

export class CopyBatchModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentCopy: {
                selectedYear: '',
                selectedClassId: '',
                selectedSubjectId: '',
                selectedBatchId: '',
            },
            subjects: [],
            selectYear: 'Year',
            selectedClassname: 'Class Name',
            selectedSubjectname: 'Subject Name',
            selectedBatchname: 'Batch Name',
            yearlist: [],
            isClassnameSelected: false,
            isSubjectnameSelected: false,
            isBatchnameSelecetd: false,
            isYearSelected: false,
            classList: [],
            batches: [],
        }
    }

    componentDidMount() {
        let data = {
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token,
        }
        this.props.getYearListForStudentCopy(data).then(() => {
            let res = this.props.yearListStudentCopy;
            if (res && res.status == 200) {
                this.setState({ yearlist: res.response })

            }
        })
    }

    getClassesOnyear(studentCopy) {
        let data = {
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            selectedYear: studentCopy,
            token: this.props.token
        }
        this.props.getClassesOnSelectedYear(data).then(() => {

            let res = this.props.classListYearwise;
            this.setState({ classList: res })
        })
    }

    onChangeYear(years) {

        if (years == 'All') {
            this.selectedYear = ''
        }
        else {

            let { studentCopy } = this.state;
            studentCopy = { ...studentCopy, selectedYear: years }
            this.setState({ studentCopy, isYearSelected: false, selectYear: years })
            this.getClassesOnyear(years)
        }
    }

    onSelectClass(cls) {
        cls["token"] = this.props.token;
        cls.institude_id = this.props.instituteId
        this.props.getSubjects(cls).then(() => {

            let { studentCopy } = this.state;
            studentCopy = { ...studentCopy, selectedClassId: cls.class_id }
            this.setState({
                studentCopy, selectedClassname: cls.class_name, subjects: this.props.subjects,
                isClassnameSelected: false
            }, () => {

            })
        })
    }

    onSelectSubject(subject) {
        subject["token"] = this.props.token;
        this.props.getBatches(subject).then(() => {
            let { studentCopy } = this.state;
            studentCopy = { ...studentCopy, selectedSubjectId: subject.subject_id }
            this.setState({
                studentCopy, selectedSubjectname: subject.subject_name,
                isSubjectnameSelected: false, batches: this.props.batches,
            })
        })
    }

    onSelectBatch(batch) {
        let { studentCopy } = this.state;
        studentCopy = { ...studentCopy, selectedBatchId: batch.batch_id }
        this.setState({
            studentCopy, selectedBatchname: batch.name,
            isBatchnameSelecetd: false
        })
    }

    handleCancel() {
        //   this.setState({studentCopy:{},onSelectClass})
    }

    validate() {

        let isValidForm = true;
        let { studentCopy } = this.state;
        if (!studentCopy.selectedClassId) {
            this.setState({ isClassnameSelected: true })
            isValidForm = false;
        }
        if (!studentCopy.selectedSubjectId) {
            this.setState({ isSubjectnameSelected: true })
            isValidForm = false;
        }
        if (!studentCopy.selectedBatchId) {
            this.setState({ isBatchnameSelecetd: true })
            isValidForm = false;
        }
        if (!studentCopy.selectedYear) {
            this.setState({ isYearSelected: true })
            isValidForm = false;
        }
        return isValidForm;
    }

    handleAddStudentcopy() {
        const isValidForm = this.validate();
        if (!isValidForm) {
            return;
        }
        else {

            let { studentCopy } = this.state;
            this.props.onAddStudent({ studentCopy });
        }
    }

    renderYear() {
        if (this.state.yearlist && this.state.yearlist.length > 0) {
            return this.state.yearlist.map((Years, index) => {
                return (
                    <li key={"key" + index}>
                        <a onClick={this.onChangeYear.bind(this, Years.year)} className="dd-option">{Years.year} </a>
                    </li>
                )
            })
        }
    }

    renderClasses() {
        if (this.state.classList && this.state.classList.length > 0) {
            return this.state.classList.map((cls, index) => {
                return (
                    <li key={"key" + index}>
                        <a href="javascript:void(0);" onClick={this.onSelectClass.bind(this, cls)} className="dd-option">{cls.class_name}</a>
                    </li>
                )

            })
        }
    }

    renderSubjects() {
        if (this.state.subjects && this.state.subjects.length > 0) {
            return this.state.subjects.map((subjects, index) => {
                return (
                    <li key={"key" + index}>
                        <a href="javascript:void(0);" onClick={this.onSelectSubject.bind(this, subjects)} className="dd-option">{subjects.subject_name}</a>
                    </li>
                )

            })
        }
    }

    renderBatches() {
        if (this.state.batches && this.state.batches.length > 0) {
            return this.state.batches.map((batch, index) => {

                if (this.props.batchId.data && batch.batch_id != this.props.batchId.data.batch_id) {
                    return (
                        <li key={"key" + index}>
                            <a href="javascript:void(0);" onClick={this.onSelectBatch.bind(this, batch)} className="dd-option">{batch.name}</a>
                        </li>
                    )
                }
            })
        }
    }



    render() {
        return (
            <div className="modal fade custom-modal-sm" id="cpyanotherBatch" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                            <h4 className="c-heading-sm card--title">Copy from another batch</h4>
                        </div>
                        <div className="modal-body">
                            <div className="cust-m-info">All students from the selected batch will be added. You can add/delete any students in the list.</div>
                            <div className="clearfix margin25-bottom">
                                <div className="form-group cust-fld">
                                    <label>Year</label>
                                    <div className="dropdown">
                                        <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                            {this.state.selectYear}
                                        </button>
                                        <ul style={{ height: "100px", overflow: "auto", marginTop: "-22px" }} className="dropdown-menu" aria-labelledby="dLabel">
                                            {this.renderYear()}
                                        </ul>
                                        {this.state.isYearSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Year</label> : <br />}
                                    </div>
                                </div>
                                <div className="form-group cust-fld">
                                    <label>Class</label>
                                    <div className="dropdown">
                                        <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {this.state.selectedClassname}
                                        </button>
                                        <ul style={{ marginTop: "-22px", overflow: "auto", }} className="dropdown-menu" aria-labelledby="dLabel">
                                            {this.renderClasses()}
                                        </ul>
                                        {this.state.isClassnameSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Classname</label> : <br />}
                                    </div>
                                </div>

                                <div className="form-group cust-fld">
                                    <label>Subject</label>
                                    <div className="dropdown">
                                        <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {this.state.selectedSubjectname}
                                        </button>
                                        <ul style={{ marginTop: "-22px" }} className="dropdown-menu" aria-labelledby="dLabel">
                                            {this.renderSubjects()}
                                        </ul>
                                        {this.state.isSubjectnameSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Subjectname</label> : <br />}
                                    </div>
                                </div>

                                <div className="form-group cust-fld">
                                    <label>Batch</label>
                                    <div className="dropdown">
                                        <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {this.props.batches.batch_name}
                                            {this.state.selectedBatchname}
                                        </button>
                                        <ul style={{ marginTop: "-22px" }} className="dropdown-menu" aria-labelledby="dLabel">
                                            {this.renderBatches()}
                                        </ul>
                                        {this.state.isBatchnameSelecetd ? <label className="help-block" style={{ color: "red" }}>Please Select Batchname</label> : <br />}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="divider-container nomargin">
                                <div className="divider-block">
                                    <button className="c-btn-large grayshade" data-dismiss="modal" onClick={this.handleCancel.bind(this)}>Cancel</button>
                                </div>
                                <div className="divider-block">
                                    <button onClick={this.handleAddStudentcopy.bind(this)} className="c-btn-large primary">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (CopyBatchModal)
