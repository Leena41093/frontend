import React, { Component } from 'react';

export class CsvUploadModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            selectedFileName: "",
            isFileSelected: false,
            files: [],
            financeArray: [],
            installmentInfo: [],
            templateInfo: {},
            finance_name: 'Select Finance Name',
            finance_template_id: '',
            isFinanceNameSelected: false
        }
    }

    componentWillMount() {
        let data = {
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token
        }
        this.props.getFinancelist(data).then(() => {
            let res = this.props.financeList;

            if (res && res.status == 200) {
                this.setState({ financeArray: res.response })
            }
        })
    }

    validate() {
        let { selectedFile } = this.state;
        let isValidForm = true;
        if (!selectedFile) {
            this.setState({ isFileSelected: true });
            isValidForm = false
        }
        // if(this.state.finance_name == 'Select Finance Name'){
        //     this.setState({ isFinanceNameSelected: true });
        //     isValidForm = false
        // }
        return isValidForm;
    }

    handleUploadButton() {
        const isValidForm = this.validate();

        if (!isValidForm) {
            return;
        }
        else {
            let { selectedFile } = this.state;
            this.props.onUploadCsv(selectedFile, this.state.finance_template_id ? this.state.finance_template_id : 0);
        }
    }

    handleChange(event) {
        this.setState({
            selectedFile: event.target.files ? event.target.files[0] : "",
            selectedFileName: event.target.files[0] ? event.target.files[0].name : "", isFileSelected: false
        })
    }

    onSelectFinance(finance) {
        let data = {
            institude_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token: this.props.token,
            finance_template_id: finance.finance_template_id
        }
        this.props.getEditFinanceData(data).then(() => {
            let res = this.props.getFinanceeditData;
            if (res && res.status == 200) {
                this.setState({
                    templateInfo: res.response.templateInfo,
                    installmentInfo: res.response.installmentInfo,
                    finance_name: finance.name,
                    finance_template_id: finance.finance_template_id
                })
            }
        })

    }

    renderFinanceList() {
        if (this.state.financeArray && this.state.financeArray.length > 0) {
            return this.state.financeArray.map((finance, index) => {
                return (
                    <li key={"key" + index}>
                        <a onClick={this.onSelectFinance.bind(this, finance)} className="dd-option">{finance.name}</a>
                    </li>
                )
            })
        }
    }


    fetchDownloadData(event) {

        var data = [['FirstName', 'LastName', 'MobileNumber'],];

        var csvContent = '';
        data.forEach(function (infoArray, index) {
            var dataString = infoArray.join(',');
            csvContent += index < data.length ? dataString + '\n' : dataString;
        });

        var download = function (content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';

            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(new Blob([content], {
                    type: mimeType
                }), fileName);
            } else if (URL && 'download' in a) {
                a.href = URL.createObjectURL(new Blob([content], {
                    type: mimeType
                }));
                a.setAttribute('download', fileName);
                document.body.appendChild(a);
                a.click();
                //document.body.removeChild(a);
            } else {
                var location;
                location.href = 'data:application/octet-stream,' + encodeURIComponent(content);
            }
        }
        download(csvContent, 'dowload.csv', 'text/csv;encoding:utf-8');
    }


    render() {
        return (
            <div className="modal fade custom-modal-sm" id="csvupload" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
                            <h4 className="c-heading-sm card--title" id="myModalLabel">CSV Upload</h4>
                        </div>
                        <div className="modal-body">
                            <div className="cust-m-info">Download the CSV template and add students to the list.</div>
                            <div className="clearfix margin25-bottom">

                                <button className="link--btn" onClick={this.fetchDownloadData}>

                                    <i className="icon cg-download"></i>Download CSV template
                          </button>

                            </div>
                            <div className="divider-container">
                                <div className="divider-block text--left">
                                    <div className="form-group cust-fld">
                                        <label>Upload Edited CSV</label>
                                        <input ref={(ref) => this.getFile = ref} accept=".csv" onChange={this.handleChange.bind(this)} type="file" style={{ display: "none" }} />
                                        <button className="c-btn-bordered" onClick={(e) => this.getFile.click()}>Select File</button>
                                        {this.state.selectedFileName ? <span className="c-upfile__name" style={{ float: "right", marginTop: "5px" }}>{this.state.selectedFileName}</span> : <span></span>}
                                        {this.state.isFileSelected ? <label className="help-block" style={{ color: "red" }}>Select File</label> : <br />}
                                    </div>

                                </div>
                            </div>
                            <div className="clearfix margin25-bottom">
                                <div className="form-group cust-fld">
                                    <label>Finance</label>
                                    <div className="dropdown">
                                        <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                                            {this.state.finance_name}
                                        </button>
                                        <ul style={{ height: "100px", overflow: "auto" }} className="dropdown-menu" aria-labelledby="dLabel">
                                            {this.renderFinanceList()}
                                        </ul>
                                        {/* {this.state.isFinanceNameSelected ? <label className="help-block" style={{ color: "red" }}>Please Select Finance Structure</label> : <br />} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="divider-container nomargin">
                                <div className="divider-block">
                                    <button className="c-btn-large grayshade" data-dismiss="modal">Cancel</button>
                                </div>
                                <div className="divider-block">
                                    <button onClick={this.handleUploadButton.bind(this)} className="c-btn-large primary">Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (CsvUploadModal)
