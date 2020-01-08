import React ,{Component} from 'react';
import {StudentPaymentModel} from '../financeModels/studentPaymentModel';
import Highcharts from 'highcharts';
import dataModule from "highcharts/modules/data";
import $ from 'jquery';
class StudentFinanceDashboard extends Component{
   constructor(props){
      super(props);
      this.state={

      }
   }

   componentDidMount(){
      this.renderGraph();
   }

   goToCreateNewInvoice(){
      this.props.history.push({
         pathname:"/app/create-new-invoices",
         state:{data:"fromStudentDetails"}
      })
   }
   
   renderGraph(){
      var colors = Highcharts.getOptions().colors,
      categories = [
          'Chrome',
          'Firefox',
          'Internet Explorer'
          
      ],
      data = [
          {
             
              color:"#15BA27",
              drilldown: {
                  name: 'Chrome',
                  categories: [
                      'Chrome v65.0'
                     
                  ],
                  data: [
                      2.1,
                      
                  ]
              }
          },
          {
             
              color: "#FFCC01",
              drilldown: {
                  name: 'Firefox',
                  categories: [
                      'Firefox v58.0',
                      
                  ],
                  data: [
                      1.02,
                      
                  ]
              }
          },
          {
             
              color: "grey",
              drilldown: {
                  name: 'Internet Explorer',
                  categories: [
                      'Internet Explorer v11.0'
                  ],
                  data: [
                      6.2
                  ]
              }
          }
      ],
      browserData = [],
      versionsData = [],
      i,
      j,
      dataLen = data.length,
      drillDataLen,
      brightness;
  
  
  // Build the data arrays
  for (i = 0; i < dataLen; i += 1) {
  
      // add browser data
      browserData.push({
          name: categories[i],
     
         
      });
  
      // add version data
      drillDataLen = data[i].drilldown.data.length;
      for (j = 0; j < drillDataLen; j += 1) {
          brightness = 0.2 - (j / drillDataLen) / 5;
          versionsData.push({
              name: data[i].drilldown.categories[j],
              y: data[i].drilldown.data[j],
              color: Highcharts.Color(data[i].color).brighten(brightness).get()
          });
      }
  }
  
  // Create the chart
  Highcharts.chart('graphs', {
      chart: {
          type: 'pie'
      },
      title: {
          text: ''
      },
      
      plotOptions: {
          pie: {
              shadow: false,
              center: ['30%', '30%']
          }
      },
      tooltip: {
          valueSuffix: '%'
      },
      series: [{
          name: 'Browsers',
          data: browserData,
          size: '200%',
          dataLabels: {
              formatter: function () {
                  return this.y > 5 ? this.point.name : null;
              },
              color: '#ffffff',
              distance: 0
          }
      }, {
          name: 'Versions',
          data: versionsData,
          size: '100%',
          innerSize: '70%',
          dataLabels: {
              formatter: function () {
                  // display only if larger than 1
                  return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                      this.y + '%' : null;
              }
          },
          id: 'versions'
      }],
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 400
              },
              chartOptions: {
                  series: [{
                  }, {
                      id: 'versions',
                      dataLabels: {
                          enabled: false
                      }
                  }]
              }
          }]
      }
  });
   }

   render(){
      return(
         <div className="c-container dark clearfix">
            <div className="clearfix">
					<div className="divider-container">
						<div className="divider-block text--left">
							<span className="c-heading-lg margin10-bottom">Abbie Luna’s Financial Details</span>
						</div>
						{/* <div className="divider-block text--right">
							<button className="c-btn">Send Invoice</button>
						</div> */}
					</div>
				</div>
            <div className="clearfix">
            <div className="row">


<div className="col-md-3">

   <div className="c-repoCard">
      <div className="divider-container stud-nameCard">
         <div className="divider-block nameCard__pic">
            <img src="../images/avatars/Avatar_1.jpg" alt="" />
         </div>
         <div className="divider-block nameCard__info">
            <span className="studName">Abbie Luna</span>
            <button className="link--btn">View Profile</button>
         </div>
      </div>
   </div>

   <div className="c-repoCard">
      <div className="block-title st-colored noborder nomargin color-dark">VIEW REPORTS OF</div>
      <div className="c-repoDropdown dropdown">
            <button id="dLabel" type="button" data-toggle="dropdown" className="dropdown_btn">
               First Year Engineering
               <i className="icon cg-angle-down"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dLabel">
               <li><a className="listItem">List Item</a></li>
               <li><a className="listItem">List Item</a></li>
               <li><a className="listItem">List Item</a></li>
            </ul>
         </div>
   </div>


   <div className="clearfix">
         <div className="panel-group c-panelAccord type-1" id="record1" role="tablist" aria-multiselectable="true">

               <div className="panel panel-default margin15-bottom">
                  <div className="panel-heading" role="tab" id="headingThree">
                        <a className="panel-title clearfix collapsed" role="button" data-toggle="collapse" data-parent="#record1" href="#collapseRecord1" aria-expanded="false" aria-controls="collapseThree">
                           <span className="mainTitle noCheck st-active">11TH STANDARD</span>
                        </a>
                  </div>
                  <div id="collapseRecord1" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                     <div className="panel-body">

                           <div className="form-group static-fld">
                              <label>Total Fees</label>
                              <span className="info-type">₹ 60,000 /-</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>Fee Template</label>
                              <span className="info-type">11th Standard</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>Duration</label>
                              <span className="info-type">1 Jan 2019 - 31 June 2019</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>Installment Type</label>
                              <span className="info-type">Monthly</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>No. of Installments</label>
                              <span className="info-type">6</span>
                           </div>

                     </div>
                  </div>
               </div>
               <div className="panel panel-default">
                  <div className="panel-heading" role="tab" id="headingThree">
                        <a className="panel-title clearfix collapsed" role="button" data-toggle="collapse" data-parent="#record1" href="#collapseRecord2" aria-expanded="false" aria-controls="collapseThree">
                           <span className="mainTitle noCheck st-active">12TH STANDARD</span>
                        </a>
                  </div>
                  <div id="collapseRecord2" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                     <div className="panel-body">

                           <div className="form-group static-fld">
                              <label>Total Fees</label>
                              <span className="info-type">₹ 60,000 /-</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>Fee Template</label>
                              <span className="info-type">11th Standard</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>Duration</label>
                              <span className="info-type">1 Jan 2019 - 31 June 2019</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>Installment Type</label>
                              <span className="info-type">Monthly</span>
                           </div>

                           <div className="form-group static-fld">
                              <label>No. of Installments</label>
                              <span className="info-type">6</span>
                           </div>

                     </div>
                  </div>
               </div>

            </div>
   </div>

</div>

<div className="col-md-9">

   <div className="c-repoCard">
      <div className="row">
         <div className="col-md-6">
            <div className="block-title st-colored noborder nomargin color-dark">Fee Status</div>
            <div className="divider-container nomargin">
               <div className="divider-block text--left" id="graphs"></div>
               <div className="divider-block text--left">
                     <div className="block-title st-colored noborder nomargin color-dark">Total: Rs. 50,000/-</div>
                     <div className="colCode">
                           <ul>
                              <li className="col-green">
                                 <div className="color"></div>
                                 <span>Paid: Rs. 15,000/-</span>
                              </li>
                              <li className="col-yellow">
                                 <div className="color"></div>
                                 <span>Pending: Rs. 10,000/-</span>
                              </li>
                              <li className="col-gray">
                                 <div className="color"></div>
                                 <span>Upcoming: Rs. 25,000/-</span>
                              </li>
                           </ul>
                     </div>

               </div>
            </div>
         </div>

         <div className="col-md-6">
               <div className="block-title st-colored noborder nomargin color-dark">Actions</div>
               <div className="block-title-sm noborder">
                  <span className="text-colored">3 Pending Invoices</span>
                    since 20 June 2019
               </div>
               <div className="divider-container nomargin">
                     <div className="divider-block text--left">
                        <button className="c-btn-large primary"  data-toggle="modal" data-target="#studentPayment">Pay Now</button>
                     </div>
               </div>
               
         </div>

      </div>
   </div>

   <div className="clearfix">
         <div className="panel-group c-panelAccord type-1" id="record3" role="tablist" aria-multiselectable="true">

            <div className="panel panel-default margin15-bottom">
               <div className="panel-heading" role="tab" id="headingThree">
                     <a className="panel-title clearfix collapsed" role="button" data-toggle="collapse" data-parent="#record3" href="#collapseRecord3" aria-expanded="false" aria-controls="collapseThree">
                        <span className="mainTitle noCheck st-active">PENDING INVOICES</span>
                     </a>
               </div>
               <div id="collapseRecord3" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                  <div className="panel-body nopad">

                        <div className="c-table">
                              <table className="table data--table">
                                    <thead>
                                          <tr>
                                                <th style={{width:"10%"}}>Inv. No</th>
                                                <th style={{width:"25%"}}>Invoice Name</th>
                                                <th style={{width:"15%"}}>Amount</th>
                                                <th style={{width:"15%"}}>Issued On</th>
                                                <th style={{width:"15%"}}>Status</th>
                                                <th style={{width:"20%"}} className="nosort">Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          <tr>
                                                <td><span className="c-name">4659</span></td>
                                                <td>From 11th Standard Fee template</td>
                                                <td>20,000 /-</td>
                                                <td>1 July 2019</td>
                                                <td><span className="statusTag">Pending</span></td>
                                                <td>
                                                   <button className="link--btn"><i className="icon cg-file-text"></i></button>
                                                   <button className="link--btn" title="Send Reminder" data-toggle="tooltip" data-placement="top" title="Tooltip on left"><i className="icon cg-alarm-clock"></i></button>
                                                   <button className="c-btn sm margin0-bottom">Pay Now</button>
                                                </td>
                                          </tr>
                                          <tr>
                                                <td><span className="c-name">4659</span></td>
                                                <td>From 11th Standard Fee template</td>
                                                <td>20,000 /-</td>
                                                <td>1 July 2019</td>
                                                <td><span className="statusTag colOrange">Partial</span></td>
                                                <td>
                                                   <button className="link--btn"><i className="icon cg-file-text"></i></button>
                                                   <button className="link--btn" title="Send Reminder" data-toggle="tooltip" data-placement="top" title="Tooltip on left"><i className="icon cg-alarm-clock"></i></button>
                                                   <button className="c-btn sm margin0-bottom">Pay Now</button>
                                                </td>
                                          </tr>
                                    </tbody>
                              </table>
                        </div>
                  </div>
               </div>
            </div>

         </div>

         <div className="panel-group c-panelAccord type-1" id="record4" role="tablist" aria-multiselectable="true">

               <div className="panel panel-default margin15-bottom">
                  <div className="panel-heading" role="tab" id="headingThree">
                        <a className="panel-title clearfix collapsed" role="button" data-toggle="collapse" data-parent="#record4" href="#collapseRecord4" aria-expanded="false" aria-controls="collapseThree">
                           <span className="mainTitle noCheck st-active">PAID INVOICES</span>
                        </a>
                  </div>
                  <div id="collapseRecord4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                     <div className="panel-body nopad">

                           <div className="c-table">
                                 <table className="table data--table">
                                       <thead>
                                             <tr>
                                                   <th style={{width:"10%"}}>Inv. No</th>
                                                   <th style={{width:"25%"}}>Invoice Name</th>
                                                   <th style={{width:"15%"}}>Amount</th>
                                                   <th style={{width:"15%"}}>Issued On</th>
                                                   <th style={{width:"15%"}}>Status</th>
                                                   <th style={{width:"10%"}} className="nosort">Invoice</th>
                                                   <th style={{width:"10%"}} className="nosort">Receipt</th>
                                             </tr>
                                       </thead>
                                       <tbody>
                                             <tr>
                                                   <td><span className="c-name">4659</span></td>
                                                   <td>From 11th Standard Fee template</td>
                                                   <td>20,000 /-</td>
                                                   <td>1 July 2019</td>
                                                   <td><span className="statusTag colGreen">New</span></td>
                                                   <td>
                                                      <button className="link--btn"><i className="icon cg-file-text"></i></button>
                                                   </td>
                                                   <td>
                                                      <button className="link--btn"><i className="icon cg-file-o"></i></button>
                                                      <button className="link--btn"><i className="icon cg-file-o"></i></button>
                                                   </td>
                                             </tr>
                                             <tr>
                                                   <td><span className="c-name">4659</span></td>
                                                   <td>From 11th Standard Fee template</td>
                                                   <td>20,000 /-</td>
                                                   <td>1 July 2019</td>
                                                   <td><span className="statusTag colGreen">New</span></td>
                                                   <td>
                                                      <button className="link--btn"><i className="icon cg-file-text"></i></button>
                                                   </td>
                                                   <td>
                                                      <button className="link--btn"><i className="icon cg-file-o"></i></button>
                                                      <button className="link--btn"><i className="icon cg-file-o"></i></button>
                                                   </td>
                                             </tr>
                                       </tbody>
                                 </table>
                           </div>
                     </div>
                  </div>
               </div>

         </div>

         <div className="panel-group c-panelAccord type-1" id="record5" role="tablist" aria-multiselectable="true">

            <div className="panel panel-default margin15-bottom">
               <div className="panel-heading" role="tab" id="headingThree">
                     <a className="panel-title clearfix collapsed" role="button" data-toggle="collapse" data-parent="#record5" href="#collapseRecord5" aria-expanded="false" aria-controls="collapseThree">
                        <span className="mainTitle noCheck st-active">UPCOMING INVOICES</span>
                     </a>
               </div>
               <div id="collapseRecord5" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                  <div className="panel-body nopad">
                        <div className="c-table">
                              <table className="table data--table">
                                    <thead>
                                          <tr>
                                                <th style={{width:"10%"}}>Inv. No</th>
                                                <th style={{width:"25%"}}>Invoice Name</th>
                                                <th style={{width:"15%"}}>Amount</th>
                                                <th style={{width:"15%"}}>Date of Issued</th>
                                                <th style={{width:"10%"}} className="nosort">Action</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          <tr>
                                                <td><span className="c-name">4659</span></td>
                                                <td>From 11th Standard Fee template</td>
                                                <td>20,000 /-</td>
                                                <td>1 July 2019</td>
                                                <td>
                                                   <button className="link--btn">Edit</button>
                                                </td>
                                          </tr>
                                          <tr>
                                                <td><span className="c-name">4659</span></td>
                                                <td>From 11th Standard Fee template</td>
                                                <td>20,000 /-</td>
                                                <td>1 July 2019</td>
                                                <td>
                                                   <button className="link--btn">Edit</button>
                                                </td>
                                          </tr>
                                    </tbody>
                              </table>
                        </div>
                  </div>
               </div>
            </div>
      </div>
      

   </div>

</div>

</div>
            </div>
            <StudentPaymentModel data={this.props}/>
         </div>
      )
   }
}
export default StudentFinanceDashboard