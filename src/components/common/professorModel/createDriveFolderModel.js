import React, { Component } from 'react';
import $ from 'jquery';
export class CreateDriveFolderModel extends Component {
  constructor(props){
    super(props);
    this.state = {
      folderName:"",
      isFolderNameEmpty:false
    }
  }

  onChangeFolderName(event){
    this.setState({folderName:event.target.value,isFolderNameEmpty:false},()=>{
    });     
  }

  validate(){
    let isValidForm = true;
    let {folderName} = this.state;
   
    if (folderName.length === 0 ) {
      this.setState({isFolderNameEmpty:true})
      isValidForm =false;
    }
    return isValidForm;
  }

  
  onClickCreateDriveFolder(){
    const isValidForm = this.validate();
    if (!isValidForm) {
      return;
    }
    else {

    $("#createDrivefolder .close").click();
    this.props.onCreateNewDriveFolder(this.state.folderName);
    this.setState({folderName:""})
    }
  }

  closeModel(){
    this.setState({folderName:''})
    $("#createDrivefolder .close").click();
    
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm" id="createDrivefolder" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">New Folder</h4>
            </div>
            <div className="modal-body">
              <div className="form-group cust-fld">
                <label>Folder Name</label>
                <input type="text" id="folderName" value={this.state.folderName} className="form-control"  onChange={this.onChangeFolderName.bind(this)} placeholder="Folder Name" />
                {this.state.isFolderNameEmpty ? <label className="help-block" style={{ color: "red" }}>Please Enter Valid Folder Name </label> : <br />}
                
              </div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" onClick={this.closeModel.bind(this)}>Cancel</button>
                <button className="c-btn primary"  onClick={this.onClickCreateDriveFolder.bind(this)} >Create Folder</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

}

export default (CreateDriveFolderModel)