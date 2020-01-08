import React, { Component } from 'react';
import $ from 'jquery';

export class ViewDefaultersListModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      defaulterStudentArr: [],
      defaulterStudentCount: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ defaulterStudentArr: nextProps.defaulterStudentArr, defaulterStudentCount: nextProps.defaulterStudentCount }, () => {
      
    })
  }

  closeModel() {
		$("#viewDefaultrs").hide();
		$("#viewDefaultrs .close").click();
	}

  renderDefaulterList() {
    let { defaulterStudentArr } = this.state;
    if (defaulterStudentArr && defaulterStudentArr.length > 0) {
      return defaulterStudentArr.map((studentlist, index) => {
        return (
          <li key={"studentlist"+index}>
            <div className="studentInfoRow">
              <div className="studentInfo">
                <div className="studSection student_img">
                  <img src={studentlist.picture_url ? studentlist.picture_url : "/images/avatars/Avatar_default.jpg"} />
                </div>

                <div className="studSection student_name">
                  <span className="cust-m-info text-bold">{ (studentlist.firstname && studentlist.lastname) ? (studentlist.firstname + " " + studentlist.lastname) :""}</span>
                  {/* <span className="cust-m-info text-normal">{studentList.className1 + " > " + studentList.subjectName1}</span> */}
                </div>

                {/* <div className="studSection student_num">{studentlist.per + "%"}</div> */}
              </div>
            </div>
          </li>)
      })
    }
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm width--sm" id="viewDefaultrs" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModel.bind(this)}><i className="icon cg-times"></i></button>
             
            </div>

            <div className="modal-body" >
              <div className="c-card nopad">

                <div className="c-card__title type--2 clearfix">
                  <span className="c-heading-sm card--Subtitle pull-left">
                    DEFAULTERS
                  </span>
                  <span style={{marginLeft:"152px" ,color:"#990000",fontSize: "16px",fontWeight: "bold"}} className="sect_num_prime">{this.state.defaulterStudentCount ? this.state.defaulterStudentCount : 0}</span>

                </div>

                <div className="c-list type-3 c-card__items large">
                  <ul style={{ height: "310px", overflow: "auto" }}>
                    {this.renderDefaulterList()}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}