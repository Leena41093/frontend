import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStudentClassesData,getStudentExpiredBatchData } from '../../actions/studentAction';


class StudentPastYear extends Component{
  
  constructor(props){
    super(props);
    this.state={
      expiredBatch:[],
      clsbatches: [],
      currentBatchTab:0,
      classData:[],
      class_id:"",
      instituteId:0
    }
  }

  componentWillReceiveProps(nextProps){
		
		let id  = localStorage.getItem("instituteid");
		if(id == nextProps.instituteId){
    if(this.state.instituteId != nextProps.instituteId){
			// localStorage.removeItem("instituteid")
      // this.setState({instituteId:nextProps.instituteId},()=>{
				// const pro = this.props.location.state?this.props.location.state.data:"";
				// this.getClassesOfStudent();
				// table.fnDraw()
				this.props.history.push("/app/dashboard");
      // });
		}
	
		}
  }

  componentDidMount(){
    this.setState({instituteId:this.props.instituteId});
    let datas = {
      token: this.props.token,
      institute_id: this.props.instituteId,
      branch_id: this.props.branchId
    }

    this.props.getStudentClassesData(datas).then(() => {
      let res = this.props.studentclassdata;
      if (res && res.data.status == 200) {
        this.setState({ classData: res.data.response, class_id: res.data.response[0].class_id },()=>{
          let data = {
            institute_id: this.props.instituteId,
            branch_id: this.props.branchId,
            token:this.props.token,
            payload:{
              class_id:this.state.class_id
            }
          }
          
          this.props.getStudentExpiredBatchData(data).then(()=>{
            let obj = {};
            let { clsbatches } = this.state;
             let res = this.props.studentExpiredBatchInfo;
            
             if(res && res.data.status == 200){
             this.setState({expiredBatch:res.data.response},()=>{
               
               if(this.state.expiredBatch && this.state.expiredBatch.length > 0){
                 this.state.expiredBatch.map((cls,index)=>{
                   
                   var dateString = cls.start_date;
                   var year = dateString.substr(0,4);
                   if (obj.hasOwnProperty(cls.year)) {
                     obj[cls.year].push(cls);
                   } else {
                     obj[cls.year] = [];
                     obj[cls.year].push(cls);
                   }
                 })
                 for (const [key, value] of Object.entries(obj)) {
                   
                   clsbatches.push({ batches: value });
                 }
                 this.setState({clsbatches});
               }
             })
           }
           })
        });
      }
    }) 
  }

  renderClassTabList(){
    let { clsbatches } = this.state;
    
    if (clsbatches && clsbatches.length > 0) {

      return clsbatches.map((studentClass, index) => {
        
        var dateString = studentClass.batches[0].start_date;
        var year = dateString.substr(0,4);
        
        let active = (index === 0) ? "active" : "";
        return (
          <li key={"stud" + index} role="presentation" className={active} >
            <a href={"#tab_" + index} aria-controls={"#tab_" + index} role="tab" data-toggle="tab">{year}</a>
          </li>
        )
      })
    }
  }

  renderBatches(batches) {
    if (batches && batches.length > 0) {
      return batches.map((batch, index) => {
       
        return (
          <div key={"batch" + index} className="block-cardGrid">
            <div className="cardgrid--item">
              <div className="cardgrid--item-header">
              <h2 className="c-heading-sm card--title">
               {batch.class_name}
              </h2>
                <h2 className="c-heading-sm card--title">
                  {batch.subject_name}
                  
                </h2>
                <span>{batch.batch_name}</span>
              </div>
              
            </div>
          </div>
        )
      })
    }
  }

  renderClassTab(){
    let { clsbatches } = this.state;
    let tabClassName = 0 
    if (clsbatches && clsbatches.length > 0) {

      return clsbatches.map((studentClass, index) => {
        tabClassName = this.state.currentBatchTab == index ? "tab-pane active" : "tab-pane";
        
        return (
          <div key={"cls" + index} role="tabpanel" className={tabClassName} id={"tab_" + index}>
            <div className="grid-block">
              {this.renderBatches(studentClass.batches)}
            </div>
            </div>
          )
      })
    }
  }

  render(){
    return (
      <div className="c-container clearfix">
        <div className="clearfix">
          <div className="divider-container">
            <div className="divider-block text--left">
              <span className="c-heading-lg">PastYear</span>
            </div>
          </div>
        </div>
        <div className="c-container__data st--blank">
          <div className="clearfix row">
            <div className="col-md-9 col-sm-6 col-xs-12">
              <div className="drive_dataSect__tabs  tabs--sm clearfix">
                <ul className="nav nav-tabs margin25-bottom" role="tablist">
                  {this.renderClassTabList()}
                </ul>
                <div className="tab-content">
                  {this.renderClassTab()}
                </div>
              </div>
            </div>
           
          </div>
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth,student  }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  dashboardData: student.dashboardData,
  token: auth.token,
  studentclassdata: student.studentclassesdata,
  studentExpiredBatchInfo: student.studentExpiredBatchInfo
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getStudentClassesData,getStudentExpiredBatchData
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(StudentPastYear);