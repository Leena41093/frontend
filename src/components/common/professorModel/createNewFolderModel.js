import React, { Component } from 'react';
import $ from 'jquery';
export class CreateNewFolderModel extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      folderName:"",
      isFolderNameEmpty:false,
      isFolderNameValid:false,
    }
  }
   
  validate(){
    let isValidForm = true;
    let {folderName} =this.state; 
    var regex = /^[0-9a-zA-Z ]+$/
    if (folderName.length === 0 || !folderName.match(regex)) {
      this.setState({ isFolderNameEmpty: true });
      isValidForm = false;
    }   
    return isValidForm;
  }

  onChangeFolderName(event){
    this.setState({folderName:event.target.value,isFolderNameEmpty:false},()=>{
      
    });     
  }

  onClickCreateFolder(){
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {
     document.getElementById("folderName").value=""
      $("#createfolder").hide();
     this.props.onCreateNewFolder(this.state.folderName);
     this.setState({folderName:""})
    }
  }
 
  closeModel(){
    $("#createfolder").hide();
    $("#createfolder .close").click();
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm" id="createfolder" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">New Folder</h4>
            </div>
            <div className="modal-body">
              <div className="form-group cust-fld">
                <label>Folder Name</label>
                <input type="text" id="folderName" value={this.state.FolderName} className="form-control"  onChange={this.onChangeFolderName.bind(this)} placeholder="Folder Name" />
                {this.state.isFolderNameEmpty ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Folder Name </label> : <br />}
                
              </div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" onClick={this.closeModel.bind(this)} >Cancel</button>
                <button className="c-btn primary"  onClick={this.onClickCreateFolder.bind(this)} >Create Folder</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
