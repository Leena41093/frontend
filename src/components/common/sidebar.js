import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getClasses, getSubjects, getBatches, getInstitudes, getIsProfessorAdmin } from '../../actions/index';
import { getBranches } from '../../actions/sidebarAction';
import { Scrollbars } from 'react-custom-scrollbars';
import { errorToste } from '../../constant/util';
class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentBranch: 'Select',
      branches: [],
      instituteList: [],
      currentInstitute: 'Select',
      branchesdata: [],
      isProfessorAdmin: false,
    }
  }

  componentWillMount() {

    let data = {
      token: this.props.token,
      payload: {}
    }

    this.props.getInstitudes(data).then(() => {

      let res = this.props.institudes;
      if (res && res.status == 200) {

        this.setState({ instituteList: res.response.institudeList })
        const institute = this.state.instituteList ? this.state.instituteList[0] : "";
        this.setState({ currentInstitute: institute ? institute.name : "" })
        // localStorage.setItem("instituteid",this.state.instituteList ? this.state.instituteList[0].institude_id:"")

        if (this.state.instituteList && this.state.instituteList.length > 0) {

          localStorage.setItem("instituteid", this.state.instituteList ? this.state.instituteList[0].institude_id : "")
          var mainarray = [];
          this.state.instituteList.forEach((item, index) => {
            var branches = [];

            let data = {
              instituteId: this.state.instituteList[index].institude_id,
              token: this.props.token,
            }

            this.props.getBranches(data).then(() => {

              if (this.props.branches && this.props.branches.length > 0) {
                const branch = this.props.branches[0];
                branch.token = this.props.token;
                if (index == 0) {
                  if (this.props.userType == "PROFESSOR") {
                    var datas = {
                      institudeId:branch.institude_id,
                      branchId:branch.branch_id,
                      token: branch.token,
                    }
                    // this.setState({ currentBranch: branch.name});
                    // this.getClasses(branch);
                    this.props.getIsProfessorAdmin(datas).then(() => {
                      var res = this.props.ProfessorAdmin;
                      if (res && res.data.status == 200) {
                        this.setState({ currentBranch: branch.name, isProfessorAdmin: res.data.response.isProfessorAdmin });
                        this.getClasses(branch);
                      }
                      else if (res && res.status == 500) {
                        errorToste("Data error");
                      }
                    })
                  }
                  else {
                    this.setState({ currentBranch: branch.name});
                    this.getClasses(branch);
                  }

                }
                branches.push(branch);


              }
            })
            mainarray.push(branches);
            this.setState({ branchesdata: mainarray });
          })
        }

      }

    })

  }

  getClasses(branch) {
    branch.token = this.props.token;
    this.props.getClasses(branch).then(() => {
      if (this.props.classes && this.props.classes.length > 0) {
        const cls = this.props.classes[0];
        this.getSubjects(cls);
      }
    })
  }

  getSubjects(cls) {

    cls.token = this.props.token,
      cls.institude_id = this.props.instituteId
    this.props.getSubjects(cls).then(() => {
      if (this.props.subjects && this.props.subjects.length > 0) {
        const subject = this.props.subjects[0];
        this.getBatches(subject);
      }
    })
  }

  getBatches(subject) {
    subject.token = this.props.token;
    this.props.getBatches(subject).then(() => {
      if (this.props.batches && this.props.batches.length > 0) {
        //const batch= this.props.batches[0];
      }
    })
  }

  getCurrentBranchName() {
    return this.state.currentBranch.slice(-7);
  }

  getCurrentInstituteName() {
    return this.state.currentInstitute;
  }

  handleAdminOptionClick(route) {

    switch (route) {
      case 'adminBoard': {
        //this.props.history.push('/app/homework-detail');  
        break;
      }
      case 'classManager': {
        this.props.history.push('/app/class-manager');
        break;
      }
      case 'facultyDirectory': {
        this.props.history.push('/app/faculty-directory');
        break;
      }
      case 'studentDirectory': {

        this.props.history.push('/app/student-directory');
        break;
      }
      case 'finance': {
        this.props.history.push('/app/finance-feestructureselection')
        break;
      }
      case 'enquiry': {

        this.props.history.push('/app/enquiry-detail');
        break;
      }
      case 'report': {
        this.props.history.push('/app/report');
        break;
      }
      case 'attendance': {
        this.props.history.push({
          pathname: '/app/attendance-directory'
        })
        break;
      }
    }

    this.setState({ activeRoute: route });

  }

  handleProfessorOptionClick(route) {

    switch (route) {
      case 'dashboard': {
        this.props.history.push('/app/dashboard');
        break;
      }
      case 'homework': {
        this.props.history.push('/app/homework-directory');
        break;
      }
      case 'quiz': {
        this.props.history.push('/app/quiz-directory');
        break;
      }
      case 'notes': {
        this.props.history.push('/app/notes-directory');
        break;
      }
      case 'timetable': {
        this.props.history.push('/app/professor-timetable');
        break;
      }
      case 'Drive': {
        this.props.history.push('/app/professor-drive')
        break;
      }
      case 'profattendance': {
        this.props.history.push({
          pathname: '/app/attendancebatchesdetails',
          state: { data: { professorflag: true } }
        })
        break;
      }
      case 'pastyear': {
        this.props.history.push('/app/professor-pastyear')
        break;
      }

    }

    this.setState({ activeRoute: route });
  }

  handleStudentOptionClick(route) {

    switch (route) {
      case 'dashboard': {
        this.props.history.push('/app/dashboard');
        break;
      }
      case 'homework': {
        this.props.history.push('/app/studenthomework-directory');
        break;
      }
      case 'quiz': {
        this.props.history.push('/app/studentquiz-directory');
        break;
      }
      case 'notes': {
        this.props.history.push('/app/studentnotes-directory');
        break;
      }
      case 'timetable': {
        this.props.history.push('/app/student-timetable')
        break;
      }
      case 'pastyear': {
        this.props.history.push('/app/student-pastyear')
        break;
      }
      case 'drive': {
        this.props.history.push('/app/student-drive')
        break;
      }
      case 'attendance': {
        this.props.history.push('/app/student-attendance')
        break;
      }
      case 'report':{
        this.props.history.push('/app/student-report')
        break;
      }
      case 'finance':{
        this.props.history.push('/app/student-finance-dashboard')
        break;
      }
    }

    this.setState({ activeRoute: route });
  }

  getLiCss(route) {
    let css = 'submenu--item'
    if (this.state.activeRoute == route) {
      css = 'submenu--item active';
    }
    return css;
  }

  onBranchChange(branch, route, index) {
    let currentInstitute = this.state.instituteList[index].name;
    localStorage.setItem("instituteid", this.state.instituteList[index].institude_id);
    if(this.props.userType == "PROFESSOR"){
    var datas = {
      institudeId: branch.institude_id,
      branchId: branch.branch_id,
      token: branch.token,
    }
    // this.setState({ currentBranch: branch.name});
    // this.getClasses(branch);
    this.props.getIsProfessorAdmin(datas).then(() => {
      var res = this.props.ProfessorAdmin;
      if (res && res.data.status == 200) {
        this.setState({ currentBranch: branch.name, activeRoute: route, currentInstitute: currentInstitute, isProfessorAdmin: res.data.response.isProfessorAdmin });
        this.getClasses(branch);
      }
      else if (res && res.status == 500) {
        errorToste("Data error");
      }
    })
  }
  else{
    this.setState({ currentBranch: branch.name, activeRoute: route, currentInstitute: currentInstitute });
    this.getClasses(branch);
  }
    // if (this.props.userType == 'PROFESSOR') {

    //   this.props.history.push({
    //     pathname: '/app/dashboard',
    //   })
    // }
    if (this.props.userType == 'INSTITUTE' && this.props.userType == 'ADMIN') {
      this.props.history.push({
        pathname: '/app/class-manager',
      })
    }
  }

  onInstituteChange(institute, index) {
    this.setState({ currentInstitute: institute.name, });
    let data = {
      instituteId: this.state.instituteList[index].institude_id,
      token: this.props.token,
    }
    this.props.getBranches(data).then(() => {
      if (this.props.branches && this.props.branches.length > 0) {
        const branch = this.props.branches[0];
        branch.token = this.props.token;
        this.setState({ currentBranch: branch.name });
        this.getClasses(branch);
      }
    })
  }

  renderBranchOption() {
    let { instituteList } = this.state;
    let branches = this.props.branches;
    if (instituteList && instituteList.length > 0) {
      return instituteList.map((institute, index) => {
        if (this.state.branchesdata[index] && this.state.branchesdata[index].length > 0) {
          return this.state.branchesdata[index].map((branch, i) => {
            return (
              <li key={'branch' + i} onClick={this.onBranchChange.bind(this, branch, 'dashboard', index)}>
                <a >{institute.name + " " + branch.name}</a></li>
            )
          })
        }
      })

    }
  }

  renderInstituteOption() {
    let institutes = this.props.institudes;

    if (institutes && institutes.length > 0) {
      return institutes.map((institute, index) => {
        return (
          <li key={'branch' + index} onClick={this.onInstituteChange.bind(this, institute, index)}><a >{institute.name}</a></li>
        )
      })
    }
  }

  renderTab() {
    // if (this.props.userType === "STUDENT") {
    //   return (
    //     <div>
    //       <div className="sidebar__dd dropdown">
    //         <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    //           {this.state.currentInstitute.slice(0, 5) + "..." + this.getCurrentBranchName()}
    //           <i className="icon cg-angle-down"></i>
    //         </button>
    //         <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
    //           {this.renderBranchOption()}
    //         </ul>

    //       </div>

    //       <div className="menu--accord">
    //         <div className="panel-group" id="Administrator" role="tablist">
    //           <div className="panel panel-default">
    //             <div className="panel-heading" role="tab">
    //             </div>
    //             <div id="menuDrive" className="panel-collapse collapse in" role="tabpanel">
    //               <div className="panel-body">
    //                 <ul className="sidebar--submenus">
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'drive')}>
    //                     <a className={this.getLiCss('adminBoard')}>
    //                       <i className="icon cg-line-chart"></i>Clever Drive
    //                     </a>
    //                   </li>
    //                 </ul>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="menu--accord ">
    //         <div className="panel-group" id="Student" role="tablist">
    //           <div className="panel panel-default">
    //             <div className="panel-heading" role="tab">
    //               <a role="button" className="panel-title" data-toggle="collapse" data-parent="#menuStudent" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
    //                 STUDENT <i className="icon cg-angle-down"></i>
    //               </a>
    //             </div>
    //             <div id="menuStudent" className="panel-collapse collapse in" role="tabstudentpanel">
    //               <div className="panel-body">
    //                 <ul className="sidebar--submenus">
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'dashboard')}>
    //                     <a className={this.getLiCss('dashboard')}>
    //                       <i className="icon cg-dashboard"></i>Dashboard
    //                   {/* <span className="c-count">5</span> */}
    //                     </a>
    //                   </li>
    //                   {/* <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'homework')}>
    //                     <a className={this.getLiCss('homework')}>
    //                       <i className="icon cg-glasses-with-circular-lenses"></i>Homework
    //                 </a>
    //                   </li>
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'quiz')}>
    //                     <a className={this.getLiCss('quiz')}>
    //                       <i className="icon cg-bulb"></i>Quiz
    //                 </a>
    //                   </li>
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'notes')}>
    //                     <a className={this.getLiCss('notes')}>
    //                       <i className="icon cg-notebook"></i>Notes
    //                 </a>
    //                   </li> */}
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'timetable')}>
    //                     <a className={this.getLiCss('timetable')}>
    //                       <i className="icon cg-calendar"></i>Timetable
    //                     </a>
    //                   </li>
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'pastyear')}>
    //                     <a className={this.getLiCss('pastyear')}>
    //                       <i className="icon cg-clock"></i>PastYear
    //                     </a>
    //                   </li>
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'attendance')}>
    //                     <a className={this.getLiCss('attendance')}>
    //                       <i className="icon cg-notebook"></i>Attendance
    //                     </a>
    //                   </li>
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'report')}>
    //                     <a className={this.getLiCss('report')}>
    //                       <i className="icon cg-clock"></i>Report Card
    //                     </a>
    //                   </li>
    //                   <li className="linkbtn hover-pointer" onClick={this.handleStudentOptionClick.bind(this, 'finance')}>
    //                     <a className={this.getLiCss('finance')}>
    //                       <i className="icon cg-purse"></i>Finance
    //                     </a>
    //                   </li>
    //                 </ul>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )
    // }
    if (this.props.userType == "INSTITUTE" || this.props.userType == "ADMIN") {
      return (
        <div>
          <div className="sidebar__dd dropdown">
            <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.state.currentInstitute.slice(0, 5) + "..." + this.getCurrentBranchName()}
              <i className="icon cg-angle-down"></i>
            </button>
            <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
              {this.renderBranchOption()}
            </ul>
          </div>

          <div className="menu--accord">
            <div className="panel-group" id="Administrator" role="tablist">
              <div className="panel panel-default">
                <div className="panel-heading" role="tab">
                  <a role="button" className="panel-title" data-toggle="collapse" data-parent="#Administrator" href="#menuAdministrator" aria-expanded="true" aria-controls="collapseOne">
                    Administrator <i className="icon cg-angle-down"></i>
                  </a>
                </div>
                <div id="menuAdministrator" className="panel-collapse collapse in" role="tabpanel">
                  <div className="panel-body">
                    <ul className="sidebar--submenus">
                      {/* <li onClick={this.handleAdminOptionClick.bind(this, 'adminBoard')}>
                      <a className={this.getLiCss('adminBoard')}>
                        <i className="icon cg-line-chart"></i>Admin Board
                    </a>
                    </li> */}
                      <li className="linkbtn hover-pointer" onClick={this.handleAdminOptionClick.bind(this, 'classManager')}>
                        <a className={this.getLiCss('classManager')}>
                          <i className="icon cg-calendar"></i>Class Manager
                    </a>
                      </li>
                      <li className="linkbtn hover-pointer" onClick={this.handleAdminOptionClick.bind(this, 'facultyDirectory')}>
                        <a className={this.getLiCss('facultyDirectory')}>
                          <i className="icon cg-mortarboard"></i>Faculty Manager
                        </a>
                      </li>
                      <li className="linkbtn hover-pointer" onClick={this.handleAdminOptionClick.bind(this, 'studentDirectory')} >
                        <a className={this.getLiCss('studentDirectory')}>
                          <i className="icon cg-users"></i>Student Directory
                        </a>
                      </li>
                      <li className="linkbtn hover-pointer" onClick={this.handleAdminOptionClick.bind(this, 'finance')}>
                        <a className={this.getLiCss('finance')}>
                          <i className="icon cg-purse"></i>Finance
                        </a>
                      </li>
                      <li className="linkbtn hover-pointer" onClick={this.handleAdminOptionClick.bind(this, 'attendance')}>
                        <a className={this.getLiCss('attendance')}>
                          <i className="icon cg-notebook"></i>Attendance
                        </a>
                      </li>
                      <li className="linkbtn hover-pointer" onClick={this.handleAdminOptionClick.bind(this, 'enquiry')}>
                        <a className={this.getLiCss('enquiry')}>
                          <i className="icon cg-exclamation"></i>Enquiry
                        </a>
                      </li >
                      <li className="linkbtn hover-pointer" onClick={this.handleAdminOptionClick.bind(this, 'report')}>
                        <a className={this.getLiCss('report')}>
                          <i className="icon cg-clock"></i>Reports
                        </a>
                      </li>
                     

                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (this.props.userType == "PROFESSOR") {
      if (this.state.isProfessorAdmin) {
        return (
          <div>

            <div className="sidebar__dd dropdown">
              <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.state.currentInstitute.slice(0, 5) + "..." + this.getCurrentBranchName()}
                <i className="icon cg-angle-down"></i>
              </button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                {this.renderBranchOption()}
              </ul>
            </div>

            <div className="menu--accord">
              <div className="panel-group" id="Administrator" role="tablist">
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                  </div>
                  <div id="menuDrive" className="panel-collapse collapse in" role="tabpanel">
                    <div className="panel-body">
                      <ul className="sidebar--submenus">
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'Drive')}>
                          <a className={this.getLiCss('adminBoard')}>
                            <i className="icon cg-line-chart"></i>Clever Drive
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div  className="scrollbar hover-pointer" id="style1" >
            
            <div className="menu--accord ">
              <div className="panel-group" id="Professor" role="tablist">
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <a role="button" className="panel-title" data-toggle="collapse" data-parent="#Professor" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Professor <i className="icon cg-angle-down"></i>
                    </a>
                  </div>
                  <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel">
                    <div className="panel-body">
                      <ul className="sidebar--submenus">
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'dashboard')}>
                          <a className={this.getLiCss('dashboard')}>
                            <i className="icon cg-dashboard"></i>Dashboard
                          </a>
                        </li>
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'timetable')}>
                          <a className={this.getLiCss('timetable')}>
                            <i className="icon cg-calendar"></i>Timetable
                          </a>
                        </li>
                        
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'profattendance')}>
                          <a className={this.getLiCss('profattendance')}>
                            <i className="icon cg-notebook"></i>Attendance
                          </a>
                        </li>
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'pastyear')}>
                          <a className={this.getLiCss('pastyear')}>
                            <i className="icon cg-clock"></i>PastYear
                          </a>
                        </li>

                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

           
             {/* </Scrollbars > */}
            </div>
          </div>
        )
      } else {
        return (
          <div>

            <div className="sidebar__dd dropdown">
              <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.state.currentInstitute.slice(0, 5) + "..." + this.getCurrentBranchName()}
                <i className="icon cg-angle-down"></i>
              </button>
              <ul className="dropdown-menu cust--dd" aria-labelledby="dLabel">
                {this.renderBranchOption()}
              </ul>
            </div>

            <div className="menu--accord">
              <div className="panel-group" id="Administrator" role="tablist">
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                  </div>
                  <div id="menuDrive" className="panel-collapse collapse in" role="tabpanel">
                    <div className="panel-body">
                      <ul className="sidebar--submenus">
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'Drive')}>
                          <a className={this.getLiCss('adminBoard')}>
                            <i className="icon cg-line-chart"></i>Clever Drive
                      </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="menu--accord st-opened">
              <div className="panel-group" id="Professor" role="tablist">
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <a role="button" className="panel-title" data-toggle="collapse" data-parent="#Professor" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Professor <i className="icon cg-angle-down"></i>
                    </a>
                  </div>
                  <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel">
                    <div className="panel-body">
                      <ul className="sidebar--submenus">
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'dashboard')}>
                          <a className={this.getLiCss('dashboard')}>
                            <i className="icon cg-dashboard"></i>Dashboard
                          </a>
                        </li>
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'timetable')}>
                          <a className={this.getLiCss('timetable')}>
                            <i className="icon cg-calendar"></i>Timetable
                          </a>
                        </li>
                        
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'profattendance')}>
                          <a className={this.getLiCss('profattendance')}>
                            <i className="icon cg-notebook"></i>Attendance
                          </a>
                        </li>
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'pastyear')}>
                          <a className={this.getLiCss('pastyear')}>
                            <i className="icon cg-clock"></i>PastYear
                          </a>
                        </li>

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
  }

  render() {
    return (
      <div className="c-sidebar">
        {this.renderTab()}
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, sidebar }) => ({
  instituteId: app.institudeId,
  branchId: app.branchId,
  branches: sidebar.branches,
  classes: app.classes,
  subjects: app.subjects,
  batches: app.batches,
  userType: auth.userType,
  isProfessorAdmin: auth.isProfessorAdmin,
  token: auth.token,
  userName: auth.userName,
  institudes: app.institudes,
  ProfessorAdmin: app.professorAdmin
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBranches, getClasses, getSubjects, getBatches, getInstitudes, getIsProfessorAdmin

    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)