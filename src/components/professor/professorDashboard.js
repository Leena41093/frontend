import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAdminDashboardData } from "../../actions/inventoryAdminAction";
import { ToastContainer } from "react-toastify";
import Highcharts from "highcharts";
import dataModule from "highcharts/modules/data";
import "bootstrap-datepicker";
dataModule(Highcharts);

class ProfessorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeData: {}
    };
  }


  componentDidMount() {
    // this.renderIncomeExpenceGraph();
    // this.renderPieGraph();
    this.getAdminData();
  }

  getAdminData() {
    let data = {
      companyId: this.props.companyId,
      branch_id: this.props.BranchId
    };
    this.props.getAdminDashboardData(data).then(() => {
      let res = this.props.admindashboarddetailsData;
      if (res && res.data.status == 200) {
        this.setState({ employeeData: res.data.response }, () => {
          // this.renderProfessorbatchDashbord();
          this.renderComplaintsList();
          this.renderIncomeExpenceGraph();
          this.renderPieGraph();
        });
      }
    });
  }

  renderComplaintsList() {
    let { employeeData } = this.state;
    if (employeeData && employeeData.complaintsDetails) {
      let complaintArray = employeeData.complaintsDetails;
      console.log("complaintArray:", complaintArray);
      return employeeData.complaintsDetails[0].map((complaint, index) => {
        return (
          <li>
            <img
              src="./../images/avatars/user_avatar.png"
              className="user-img"
              alt=""
            />
            <span className="news__heading">
              {complaint.emp_name +
                " Complaining about " +
                complaint.complaint_text}
            </span>
            <span className="news__info" />
          </li>
        );
      });
    }
  }

  renderProfessorbatchDashbord() {
    let { employeeData } = this.state;
    if (employeeData != {}) {
      return (
        <div className="row">
          <div className="col-sm-4">
            <div className="card">
              <div className="row">
                <div className="cardgrid--item">
                  <div className="col-sm-4" style={{ paddingLeft: "0px" }}>
                    <img
                      src="./../images/employee.png"
                      width="60px"
                      height="60px"
                    />
                  </div>
                  <div className="col-sm-8">
                    <div className="cardgrid--item-header pull-right">
                      <h2 className="c-heading-sm card--title">Employees</h2>
                      <h1
                        style={{
                          fontWeight: "40px",
                          fontSize: "40px",
                          margin: "0px"
                        }}
                      >
                        {employeeData.employeeCount}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card">
              <div className="row">
                <div className="cardgrid--item">
                  <div className="col-sm-4" style={{ paddingLeft: "0px" }}>
                    <img
                      src="./../images/analytics.png"
                      width="60px"
                      height="60px"
                    />
                  </div>
                  <div className="col-sm-8">
                    <div className="cardgrid--item-header pull-right">
                      <h2 className="c-heading-sm card--title">Projects</h2>
                      <h1
                        style={{
                          fontWeight: "40px",
                          fontSize: "40px",
                          margin: "0px"
                        }}
                      >
                        {employeeData.projectCount}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card">
              <div className="row">
                <div className="cardgrid--item">
                  <div className="col-sm-4" style={{ paddingLeft: "0px" }}>
                    <img
                      src="./../images/complaints.png"
                      width="60px"
                      height="60px"
                    />
                  </div>
                  <div className="col-sm-8">
                    <div className="cardgrid--item-header pull-right">
                      <h2 className="c-heading-sm card--title">Complaints</h2>
                      <h1
                        style={{
                          fontWeight: "40px",
                          fontSize: "40px",
                          margin: "0px"
                        }}
                      >
                        {employeeData.complaintsCount}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  renderPieGraph() {
    let { employeeData } = this.state;
    // Make monochrome colors
    var pieColors = (function() {
      var colors = [],
        base = Highcharts.getOptions().colors[0],
        i;

      for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(
          Highcharts.Color(base)
            .brighten((i - 3) / 7)
            .get()
        );
      }
      return colors;
    })();

    // Build the chart
    Highcharts.chart("pieGraph", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: {
        text: ""
      },
      tooltip: {
        pointFormat: "<b>Rs.{point.y}</b> <p>({point.percentage:.1f}%)</p>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          colors: pieColors,
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b><br>Rs.{point.y}",
            distance: -50,
            filter: {
              property: "percentage",
              operator: ">",
              value: 4
            }
          }
        }
      },
      series: [
        {
          name: "Share",
          data: [
            {
              name: "Income",
              y:
                employeeData && employeeData.total_income != null
                  ? employeeData.total_income
                  : 0
            },
            {
              name: "Expense",
              y:
                employeeData && employeeData.total_expense != null
                  ? employeeData.total_expense
                  : 0
            }
          ]
        }
      ]
    });
  }

  renderIncomeExpenceGraph() {
    let { employeeData } = this.state;
    Highcharts.chart({
      chart: {
        type: "column",
        renderTo: "ResorcesGraph"
      },
      title: {
        text: ""
      },

      xAxis: {
        type: "category"
      },
      yAxis: {
        title: {
          text: ""
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.name}"
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
      },

      series: [
        {
          name: "",
          colorByPoint: false,
          data: [
            {
              name: "Assign Employees",
              y:
                employeeData && employeeData.assignEmpProjectCount > 0
                  ? employeeData.assignEmpProjectCount
                  : 0
            },
            {
              name: "Free Employees",
              y:
                employeeData && employeeData.unassignEmpProjectCount > 0
                  ? employeeData.unassignEmpProjectCount
                  : 0
            }
          ]
        }
      ]
    });
  }

  render() {
    return (
      <div>
        <button
          id="openmodal"
          data-toggle="modal"
          data-target="#newprofilepic"
          hidden
        />
        <ToastContainer />

        <div className="c-container clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">Dashboard</span>
            </div>
          </div>
          <div className="c-container__data st--blank">
            {this.renderProfessorbatchDashbord()}
          </div>
        </div>
        <div className="c-container">
          <div className="row">
            <div className="col-sm-6">
              <div className="card">
                <h2 className="c-heading-sm card--title">Resorces Data</h2>
                <div id="ResorcesGraph" style={{ height: "200px" }} />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card">
                <h2 className="c-heading-sm card--title">
                  Income Expense Data
                </h2>
                <div id="pieGraph" style={{ height: "200px" }} />
              </div>
            </div>
          </div>
        </div>
        <div className="c-container">
          <div className="row">
            <div className="col-sm-6">
              <div className="card">
                <h2 className="c-heading-sm card--title">Pending Complaints</h2>
                <div className="news--listing">
                  <ul style={{ height: "200px", overflowY: "auto" }}>
                    {console.log("call", this.state.employeeData)}
                    {this.state.employeeData && this.state.employeeData != {}
                      ? this.renderComplaintsList()
                      : ""}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  app,
  auth,
  inventoryAdmin
}) => ({  
  userType: auth.userType,
  token: auth.token, 
  admindashboarddetailsData: inventoryAdmin.adminDashboardDetail,
  companyId: app.companyId,
  BranchId: app.AdminbranchId
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAdminDashboardData
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfessorDashboard);
