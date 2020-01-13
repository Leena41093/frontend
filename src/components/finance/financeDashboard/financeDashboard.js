import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Highcharts from "highcharts";
import dataModule from "highcharts/modules/data";
import { AddExpenceModel } from "../financeModels/addExpencesModel";
import { AddIncomeModel } from "../financeModels/addIncomeModel";
import {
  createInstituteIncome,
  createInstituteExpence,
  uploadInvoicePrint,
  getIncomeExpenseDetails,
  getIncomeExpenceList
} from "../../../actions/financeAction";
import {
  addIncome,
  getFinanceList,
  addExpences
} from "../../../actions/inventoryAdminAction";
import { successToste, errorToste } from "../../../constant/util";
import moment from "moment";
import $ from "jquery";
let table = "0";
dataModule(Highcharts);
class FinanceDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barGraphData: {},
      income_details_id: ""
    };
  }
  componentDidMount() {
    this.getIncomeExpenseData();
    this.renderPieGraph();
    this.initDataTable();
  }

  getIncomeExpenseData() {
    let self = this;
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    };
    this.props.getIncomeExpenseDetails(data).then(() => {
      let resIncomeandExpense = this.props.incomeExpenseDetailsDatas;
      if (resIncomeandExpense && resIncomeandExpense.data.status == 200) {
        self.setState(
          { barGraphData: resIncomeandExpense.data.response },
          () => {
            self.renderIncomeExpenceGraph();
          }
        );
      }
    });
  }

  initDataTable() {
    table = $("#Finance").dataTable({
      ajax: (data, callback, setting) => {
        this.getFinance(data, callback, setting);
        callback({
          recordsTotal: this.state.count,
          recordsFiltered: this.state.count,
          data: []
        });
      },
      columnDefs: [
        {
          targets: 0,
          data: null,
          // defaultContent: `<button class="link--btn" id="view">View Profile</button>`,
          render: (data, type, row) => {
            let rowhtml;

            let rowData = row[5];
            //let title = this.getConditionForButton(rowData);

            return (rowhtml = `<label ><i class="fa fa-file-text" id="receipt" style="cursor:pointer;color:#3D3F61" aria-hidden="true"></i>   &nbsp  <i class="fa fa-trash" id="deleteRecord" style="cursor:pointer ;color:#3D3F61" aria-hidden="true"></i></label>`);
          }
        },
        { orderable: false, targets: [2, 3, 4, 5] },
        {
          targets: [0],
          className: "c-bold"
        }
      ],
      serverSide: true,
      responsive: true,
      bFilter: false,
      dom: "frtlip",
      bjQueryUI: true,
      bPaginate: true,
      pagingType: "full_numbers"
    });

    $(".dataTables_length").css("clear", "none");
    $(".dataTables_length").css("margin-right", "2%");
    $(".dataTables_length").css("margin-top", "4px");
    // $(".dataTables_length").css('margin-left', '20%');

    $(".dataTables_info").css("clear", "none");
    $(".dataTables_info").css("padding", "0");
    $(".dataTables_info").css("margin-top", "5px");
    // $(".dataTables_info").css('margin-right', '200%');

    var _ = this;
    $("#Finance tbody").on("click", "#deleteRecord", function() {
      var data = table
        .api()
        .row($(this).parents("tr"))
        .data();
      _.deleteIncomeExpenseData(data[5]);
    });
    // $("#Finance tbody").on("click", "#edit", function() {
    //   var data = table
    //     .api()
    //     .row($(this).parents("tr"))
    //     .data();
    //   _.goToIncomeExpenseModel(data[5]);
    // });
  }

  deleteIncomeExpenseData(data) {
    let apiData = {
      payload: {
        pay_type: data.pay_type,
        id:
          data && data.fin_expense_information_id
            ? data.fin_expense_information_id
            : data.fin_income_information_id
      },
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token
    };

    this.props.deleteIncomeExpenseData(apiData).then(() => {
      let res = this.props.deleteIncomeExpense;
      if (res && res.data.status == 200) {
        successToste("Record Deleted Successfully");
        table.fnDraw();
      } else if (res && res.data.status == 500) {
        errorToste(res.data.message);
      } else {
        errorToste("Something went wrong");
      }
    });
  }

  getFinance(data, callback, setting) {
    let order_column;
    if (data.order[0].column == 0) {
      order_column = "";
    } else if (data.order[0].column == 1) {
      order_column = "date";
    } else if (data.order[0].column == 2) {
      order_column = "description";
    } else if (data.order[0].column == 3) {
      order_column = "type";
    } else if (data.order[0].column == 4) {
      order_column = "toform";
    } else if (data.order[0].column == 5) {
      order_column = "amount";
    } else if (data.order[0].column == 6) {
      order_column = "action";
    }

    let order_type;
    if (data.order[0].dir == "asc") {
      order_type = 0;
    } else {
      order_type = 1;
    }
    let apiData = {
      payload: {
        // record_per_page: 10,
        // page_number: 1,
        // order_column: order_column,
        // order_type: 1,
        // transaction_type: "",
        // to_date: "",
        // from_date: ""
        searchText: "",
        record_per_page: 10,
        page_number: 1,
        order_column: "created_at",
        order_type: 0
      },

      company_id: this.props.company_id,
      branch_id: this.props.branch_id
    };

    getFinanceList(apiData).then(res => {
      this.handleResponse(res, callback);
    });
  }

  handleResponse(res, callback) {
    if (res && res.data.status == 200 && res.data.response) {
      var columnData = [];
      console.log("institutelist:", res.data.response);
      let financeList = res.data.response.projectDetails;
      if (financeList && financeList.length > 0) {
        financeList.map((data, index) => {
          console.log("date", data.payment_date);
          var arr = [];
          // arr[0] = data.sr_no;
          arr[0] = moment(data.payment_date).format("DD MMM YYYY");
          arr[1] = data.description;
          arr[2] =
            data && data.payment_to_from != ""
              ? data.payment_to_from
              : data.payment_to_from;
          arr[3] = data.pay_type;
          arr[4] = data && data.amount != "" ? data.amount : data.amount;
          arr[5] = data;

          columnData.push(arr);
        });
      }
      callback({
        recordsTotal: this.state.count,
        recordsFiltered: this.state.count,
        data: columnData
      });
    } else if (res && res.data.status == 500) {
      this.setState({ count: 0 });
    }
  }

  createNewInvoice() {
    this.props.history.push({
      pathname: "/app/create-new-invoices",
      state: { data: "fromDashboard" }
    });
  }

  goToAllStudentFinanceDirectory() {
    this.props.history.push("/app/all-student-finance-directory");
  }

  expenceAdd(expenceModelData) {
    let data = {
      payload: {
        payment_date: expenceModelData.payment_date,
        to_payment: expenceModelData.to_payment,
        description: expenceModelData.description,
        amount: expenceModelData.amount,
        payment_method: expenceModelData.payment_method,
        attachment_url: expenceModelData.attachment_url,
        recurring_date: expenceModelData.recurring_date,
        total_recurring_no: expenceModelData.total_recurring_no,
        recurring: expenceModelData.recurring,
        pay_types: expenceModelData.pay_type
      },
      company_id: this.props.company_id,
      branch_id: this.props.branch_id
    };
    this.props.addExpences(data).then(() => {
      let res = this.props.expenceAddition;

      if (res && res.data.status == 200) {
        this.setState(
          {
            fin_expense_information_id:
              res.data.response.fin_expense_information_id
          },
          () => {
            let data = {
              payload: {
                uploadType: "expense",
                id: this.state.fin_expense_information_id
              },
              institude_id: this.props.instituteId,
              branch_id: this.props.branchId,
              token: this.props.token
            };
            this.props.uploadInvoicePrint(data).then(() => {
              let res = this.props.invoiceReceiptPrint;
            });
          }
        );
      }
    });
  }

  incomeAddition(incomeModelData) {
    let data = {
      payload: {
        from_payment: incomeModelData.from_payment,
        description: incomeModelData.description,
        amount: incomeModelData.amount,
        attachment_url: incomeModelData.attachment_url,
        pay_types: incomeModelData.pay_types,
        payment_date: incomeModelData.payment_date,
        payment_method: incomeModelData.payment_method
      },
      company_id: this.props.company_id,
      branch_id: this.props.branch_id
    };

    this.props.addIncome(data).then(() => {
      let res = this.props.incomeAdd;

      if (res && res.data.status == 200) {
        this.setState(
          {
            income_details_id: res.data.response.income_details_id
          },
          () => {
            // let data = {
            //   payload: {
            //     uploadType: "income",
            //     id: this.state.income_details_id
            //   },
            //   institude_id: this.props.instituteId,
            //   branch_id: this.props.branchId,
            //   token: this.props.token
            // };
            // this.props.uploadInvoicePrint(data).then(() => {
            //   let res = this.props.invoiceReceiptPrint;
            // });
          }
        );
      }
    });
  }

  renderPieGraph() {
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
            { name: "Received", y: 11000, color: "#15BA27" },
            { name: "Pending", y: 4000, color: "#FFBA00" }
          ]
        }
      ]
    });
  }

  renderIncomeExpenceGraph() {
    let { barGraphData } = this.state;
    Highcharts.chart({
      chart: {
        type: "column",
        renderTo: "incomeExpenceGraph"
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
          '<span style="color:{point.color}">{point.name}</span>: <b>Rs.{point.y:.2f}</b> of total<br/>'
      },

      series: [
        {
          name: "",
          colorByPoint: false,
          data: [
            {
              name: "Income",
              y: barGraphData != 0 ? barGraphData.total_income : 0,
              color: "#39CCCC"
            },
            {
              name: "Expence",
              y: barGraphData != 0 ? barGraphData.total_expense : 0,
              color: "#FF831C"
            }
          ]
        }
      ]
    });
  }

  render() {
    return (
      <div className="c-container dark clearfix">
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg margin10-bottom">
                Finance Dashboard
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="c-flexGrid margin25-bottom">
            <div className="flexGrid_sect grow-5">
              <div className="divider-container valign-top nomargin">
                <div
                  className="divider-block text--left"
                  style={{ paddingBottom: "70px" }}
                >
                  <div className="c-infoBlock">
                    <span className="c-heading">TOTAL INCOME</span>
                    <span className="c-number col-red">
                      Rs.
                      {this.state.barGraphData != {}
                        ? this.state.barGraphData.total_income
                        : 0}
                    </span>
                  </div>
                  <div className="c-infoBlock">
                    <span className="c-heading">TOTAL EXPENSES</span>
                    <span className="c-number col-orange">
                      Rs.
                      {this.state.barGraphData != {}
                        ? this.state.barGraphData.total_expense
                        : 0}
                    </span>
                  </div>
                </div>
                <div
                  className="divider-block"
                  id="incomeExpenceGraph"
                  style={{ height: "200px" }}
                />
              </div>
            </div>
            <div className="flexGrid_sect grow-5">
              <div className="divider-container valign-top nomargin">
                <div className="divider-block text--left">
                  <div className="c-infoBlock">
                    <span className="c-heading">TOTAL FEES</span>
                    <span className="c-number col-red">Rs. 120,000</span>
                  </div>
                  <div className="c-infoBlock">
                    <span className="c-heading">Received</span>
                    <span className="c-number col-green">Rs. 86,400</span>
                  </div>
                  <div className="c-infoBlock">
                    <span className="c-heading">PENDING</span>
                    <span className="c-number col-yellow">Rs. 33,600</span>
                  </div>
                </div>
                <div className="divider-block" id="pieGraph" />
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix c-searchStrip">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                <div className="stripImage">
                  <img src="../images/finances.png" />
                </div>
                <div className="stripText">Payments Details</div>
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix c-container__data">
          <div className="clearfix financeBlockHead type1">
            <div className="divider-container nomargin">
              <div className="divider-block text--left">
                <span
                  className="block-title st-colored noborder nomargin nopad"
                  style={{ color: "#00000" }}
                >
                  ACCOUNTS
                </span>
              </div>
              <div className="divider-block text--right">
                <button
                  className="c-btn prime"
                  data-toggle="modal"
                  data-target="#addIncome"
                >
                  Add Income
                </button>
                <button
                  className="c-btn prime"
                  data-toggle="modal"
                  data-target="#previewInvoice"
                >
                  Add Expence
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="clearfix financeBlockHead type2">
          <div className="divider-container nomargin">
            <div className="divider-block text--left">
              {/* <div className="form-group cust-fld childSect left margin10-top">
                  <label
                    htmlFor="check-all"
                    className="custome-field field-checkbox heightAuto"
                  >
                    <input
                      type="checkbox"
                      name="check-one"
                      id="check-all"
                      value="checkone"
                    />
                    <i /> <span>Select All</span>
                  </label>
                </div> */}

              {/* <div className="form-group cust-fld md childSect left">
                  <div className="dropdown">
                    <button
                      id="dLabel"
                      type="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Action
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dLabel">
                      <li>
                        <a href="javascript:void(0);" className="dd-option">
                          Option 1
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0);" className="dd-option">
                          Option 1
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0);" className="dd-option">
                          Option 1
                        </a>
                      </li>
                    </ul>
                  </div>
                </div> */}

              {/* <button className="c-btn prime childSect left">
                  <i className="icon cg-download" />
                  Export
                </button> */}
            </div>
            <div className="divider-block text--right">
              <div className="form-group cust-fld childSect right">
                <input
                  type="text"
                  className="form-control sm"
                  placeholder="Search..."
                />
              </div>
              {/* <div className="clearfix childSect right margin10-top">
                  <button className="link--btn">
                    <i className="icon cg-filter" />
                    Filter
                  </button>
                </div> */}
            </div>
          </div>
        </div>
        <div className="clearfix">
          <div className="c-table">
            <table id="Finance" className="table data--table">
              <thead>
                <tr>
                  {/* <th style={{ width: "15%" }}>sr. No</th> */}
                  <th style={{ width: "12%" }}>Date</th>
                  <th style={{ width: "15%" }}>Description</th>
                  <th style={{ width: "18%" }}>To/From</th>
                  <th style={{ width: "15%" }}>Type</th>
                  <th style={{ width: "13%" }}>Amount</th>
                  <th style={{ width: "13%" }}>Action</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        <AddExpenceModel
          addExpense={data => {
            this.expenceAdd(data);
          }}
          {...this.props}
        />
        <AddIncomeModel
          addIncome1={data => {
            this.incomeAddition(data);
          }}
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ finance, app, auth, inventoryAdmin }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  instituteIncome: finance.instituteIncome,
  instituteExpence: finance.instituteExpence,
  invoiceReceiptPrint: finance.invoiceReceiptPrint,
  incomeExpenseDetailsDatas: finance.incomeExpenseDetailsData,
  incomeAdd: inventoryAdmin.incomeAdd,
  company_id: app.companyId,
  branch_id: app.AdminbranchId,
  financeList: inventoryAdmin.financeList,
  expenceAddition: inventoryAdmin.expenceAddition
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createInstituteIncome,
      createInstituteExpence,
      uploadInvoicePrint,
      getIncomeExpenseDetails,
      addIncome,
      getFinanceList,
      addExpences
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinanceDashboard);
