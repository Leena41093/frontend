import React, { Component } from 'react';
import $ from 'jquery';

export class DeleteModalView extends Component{
 
  constructor(props){
    super(props);
    this.state={
    flag:null,
    }
  }

  componentWillReceiveProps(props){
    this.setState({flag:props.flag});
  }

  render(){
    return(
        <div className="modal fade custom-modal-sm width--sm" id="quizSubmit1" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
            </div>
            <div className="modal-body">
              <div className="cust-m-info">Do you really want to delete?</div>
            </div>
            <div className="modal-footer">
              <div className="clearfix text--right">
                <button className="c-btn grayshade" data-dismiss="modal">No</button>
                <button className="c-btn primary" onClick={()=>{this.props.onDeleteView(this.state.flag)}}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}