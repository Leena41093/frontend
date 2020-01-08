import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfessorExpiredBatchData } from '../../actions/professorActions'

class ProfessorPastYear extends Component {

  constructor(props) {
    super(props);
    this.state = {
      professorDashboard: {},
      instituteId: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    let id = localStorage.getItem("instituteid");
    if (id == nextProps.instituteId) {
      if (this.state.instituteId != nextProps.instituteId) {
        this.props.history.push("/app/dashboard");
      }
    }
  }

  componentDidMount() {
    this.setState({ instituteId: this.props.instituteId });
    let data = {
      institude_id: this.props.instituteId,
      branch_id: this.props.branchId,
      token: this.props.token,
    }
    this.props.getProfessorExpiredBatchData(data).then(() => {
      let obj = {};
      let clsbatches = [];
      let res = this.props.professorExpiredBatch

      if (res && res.status == 200) {
        let professorDetail = res.data.response;

        if (professorDetail && professorDetail.length > 0) {
          professorDetail.map((cls, index) => {
            var dateString = cls.start_date;
            var year = dateString.substr(0, 4);
            if (obj.hasOwnProperty(cls.year)) {
              obj[cls.year].push(cls);
            } else {

              obj[cls.year] = [];
              obj[cls.year].push(cls);
            }

          })
        }
        for (const [key, value] of Object.entries(obj)) {
          clsbatches.push({ batches: value, start_date: key });
        }

        this.setState({ professorDashboard: clsbatches })
      } else {
        this.setState({ professorDashboard: [] });
      }
    })

  }

  renderProfessorbatchDashbord() {
    let batchDetail = this.state.professorDashboard;
    if (batchDetail && batchDetail.length > 0) {
      return batchDetail.map((cls, index) => {
        var dateString = cls.batches[0].start_date;
        var year = dateString.substr(0, 4);
        return (
          <div key={"key" + index} className="grid-block" >
            <div className="block-title">{year}</div>
            <div className="block-cardGrid">
              {cls.batches.map((batch, index) => {
                return (<div key={"batchkey" + index} className="cardgrid--item" >
                  <div className="cardgrid--item-header">
                    <h2 className="c-heading-sm card--title">
                      {batch.class_name}
                    </h2>
                    <h2 className="c-heading-sm card--title">
                      {batch.subject_name}
                      {batch.homeWorkSubmissionCount && batch.quizSubmissionCount > 0 ? <span className="c-count pull-right st-colored">NEW</span> : ''}
                    </h2>
                    <span>{batch.batch_name}</span>
                  </div>

                  {/* <div className="cardgrid--item-section">
                    <ul className="item-listing">
                      <li>
                        <i className="icon cg-users"></i>
                        <span>{batch.studentCount} Students</span>
                      </li>
                    </ul>
                  </div>
                  <div className="cardgrid--item-section">
                    <ul className="item-listing st-coloured">
                      <li>
                        {batch.homeWorkSubmissionCount != 0 ? <i className="icon cg-glasses-with-circular-lenses"></i> : ""}
                        {batch.homeWorkSubmissionCount != 0 ? <span>{batch.homeWorkSubmissionCount} New Homeworks Submitted</span> : ""}
                      </li>
                      <li>
                        {batch.quizSubmissionCount != 0 ? <i className="icon cg-bulb"></i> : ""}
                        {batch.quizSubmissionCount != 0 ? <span>{batch.quizSubmissionCount} New Quizes Submitted</span> : ""}
                      </li>
                    </ul>
                  </div> */}
                </div>
                )
              })
              }
            </div>
          </div>
        )
      })
    }
  }



  render() {
    return (
      <div>
        <div className="c-container clearfix">
          <div className="clearfix">
            <div className="divider-container">
              <div className="divider-block text--left">
                <span className="c-heading-sm">Professor</span>
                <span className="c-heading-lg">PastYear</span>
              </div>
            </div>
          </div>

          <div className="c-container__data st--blank">
            <div className="clearfix row">
              <div className="col-md-8 col-sm-6 col-xs-12">
                {this.renderProfessorbatchDashbord()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app, auth, professor }) => ({
  branchId: app.branchId,
  instituteId: app.institudeId,
  professorDashboard: professor.professorDashboard,
  token: auth.token,
  professorExpiredBatch: professor.professorExpiredBatchData
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    getProfessorExpiredBatchData
  },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProfessorPastYear);