import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  handleProfessorOptionClick(route) {

    switch (route) {
      case 'facultyDirectory': {
        this.props.history.push('/app/employee-directory');
        break;
      }
      case 'complaints': {
        this.props.history.push('/app/complaints');
        break;
      }
      case 'studentDirectory': {
        this.props.history.push('/app/accessory-directory');
        break;
      }
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

      case 'projects': {
        this.props.history.push('/app/projects-directory');
        break;
      }
      case 'timetable': {
        this.props.history.push('/app/professor-timetable');
        break;
      }
      case 'finance': {
        this.props.history.push('/app/finance-dashboard')
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


  getLiCss(route) {
    let css = 'submenu--item'
    if (this.state.activeRoute == route) {
      css = 'submenu--item active';
    }
    return css;
  }

  renderTab() {
    if (this.props.userType == "ADMIN") {
        return (
          <div>
            <div className="menu--accord st-opened">
              <div className="panel-group" id="Professor" role="tablist">
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab">
                    <a role="button" className="panel-title" data-toggle="collapse" data-parent="#Professor" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Admin <i className="icon cg-angle-down"></i>
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
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'facultyDirectory')}>
                          <a className={this.getLiCss('timetable')}>
                            <i className="icon cg-user"></i>Employee Management
                          </a>
                        </li>
                        
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'studentDirectory')}>
                          <a className={this.getLiCss('profattendance')}>
                            <i className="icon cg-notebook"></i>Accessories
                          </a>
                        </li>
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'projects')}>
                          <a className={this.getLiCss('projects')}>
                            <i className="icon cg-line-chart"></i>Projects
                          </a>
                        </li>
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, "finance")}>
                          <a className={this.getLiCss('finance')}>
                            <i className="icon cg-purse"></i>Finance
                          </a>
                        </li>
                        <li className="linkbtn hover-pointer" onClick={this.handleProfessorOptionClick.bind(this, 'complaints')}>
                          <a className={this.getLiCss('complaints')}>
                            <i className="icon cg-notebook"></i>Complaints
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

  render() {
    return (
      <div className="c-sidebar">
        {this.renderTab()}
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, sidebar }) => ({
  userType: auth.inventoryUserType,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)