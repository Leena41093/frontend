import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export class ViewStudentModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  renderStudentList() {
    let studentList = this.props.studentList;
    
    if (studentList && studentList.length > 0) {
      return studentList.map((student, index) => {
        return (
          <tr key={"student" + index}>
            <td>{student.roll_no}</td>
            <td><span className="c-name">{student.firstname + " " + student.lastname}</span></td>
          </tr>
        )
      })
    }
  }

  render() {
    return (
      <div className="modal fade custom-modal-sm" id="viewStudents" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><i className="icon cg-times"></i></button>
              <h4 className="c-heading-sm card--title">Students</h4>
            </div>
            <div className="modal-body">
              <div className="student-Listing c-table" style={{overflow:"auto",height:"300px"}}>
              
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "40%" }}>Roll No.</th>
                      <th style={{ width: "60%" }}>Name</th>
                    </tr>
                  </thead>
                 <tbody>
                    {this.renderStudentList()}
                 </tbody>
                </table>
                
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
