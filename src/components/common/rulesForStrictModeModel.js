import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { profilePicUpload } from '../../actions/professorActions';
import moment from 'moment';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { successToste } from '../../constant/util';
export class RulesForStrictModeModel extends Component {

    constructor(props) {
        super(props);
        this.state = {
          
        }
    }
   
    
    render() {

        return (

            <div className="modal fade custom-modal-sm width--sm" id="rulesduringexam" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <ToastContainer />
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" hidden><i className="icon cg-times" hidden></i></button>
                            <h4 className="c-heading-sm card--title">Instructions During Exam</h4>
                            <h5 style={{fontWeight: "bold",color:"red"}}>*Please Read Instructions Carefully</h5>
                        </div>
                        <div className="modal-body">                         
                                       <p style={{fontWeight: "bold"}}><b>1.</b> Do not resize(minimize) the browser during the test.</p>
                                       <p style={{fontWeight: "bold"}}><b>2.</b> Do not click or press escape button or try to close exam, it will directly submit your exam.</p>
                                       <p style={{fontWeight: "bold"}}><b>3.</b> Click the "Submit" button to submit your exam. Do not press "Enter" on the keyboard to submit the exam.</p>
                                       <p style={{fontWeight: "bold"}}><b>4.</b>  After starting the exam you will going to a fullscreen mode. If you try to get out from the full screen mode, the quiz will directly be submitted.</p>
                        </div>
                        <div className="modal-footer">
                            <div className="clearfix text--right">
                                <button className="c-btn grayshade" id="cancelBtn" data-dismiss="modal">Cancel</button>
                                <button className="c-btn primary" onClick={this.props.onStartTest()}>Start Test</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        )
    }
}

export default (RulesForStrictModeModel)