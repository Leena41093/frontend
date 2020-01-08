import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import $ from "jquery";
import { getRestoreId, storeRestoreId, getAdminProfileData } from '../../actions/index';
import { getProfessorProfile } from '../../actions/professorActions';
class FreshChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instituteid: "",
      branchid: "",
      token: "",
      flag: true,
      professorDetail: [],
      adminDetail: []
    }
  }
  componentWillReceiveProps(nextprops) {

    if (this.state.instituteid != nextprops.instituteId) {
      if (this.props.userType != "STUDENT") {
        if (this.props.userType == "PROFESSOR") {
          if (this.state.flag) {

            let apiData = {
              institute_id: nextprops.instituteId,
              branch_id: nextprops.branchId,
              token: nextprops.token,
            }
            var self = this;
            self.props.getProfessorProfile(apiData).then(() => {
              let res = self.props.professorProfile;
              if (res && res.data.status == 200) {
                self.setState({ professorDetail: res.data.response[0], flag: false }, () => {
                  let data = {
                    institude_id: this.props.instituteId,
                    branch_id: this.props.branchId,
                    token: this.props.token
                  }
                  self.props.getRestoreId(data).then(() => {
                    let res = this.props.getRestoredId;

                    if (res && res.status == 200) {
                      self.setState({ restoreid: res.response.restore_id }, () => {

                        var restoreId = this.state.restoreid;
                        var ifConnected = window.navigator.onLine;
                        if (ifConnected) {
                          window.fcWidget.init({
                            token: "21a0037c-0651-492c-9ded-853a8519c7ea",
                            host: "https://wchat.freshchat.com",
                            externalId: self.state.professorDetail.email,
                            restoreId: restoreId ? restoreId : null
                          });
                          window.fcWidget.user.get(function (resp) {
                            var status = resp && resp.status,
                              data = resp && resp.data;
                            if (status !== 200) {
                              window.fcWidget.user.setProperties({
                                firstName: self.state.professorDetail.firstname,              // user's first name
                                lastName: self.state.professorDetail.lastname,                // user's last name
                                email: self.state.professorDetail.email,    // user's email address
                                plan: "Student",                 // user's meta property 1
                                status: "Active"               // user's meta property 2
                                // "Last Payment": "12th August"   // user's meta property 3
                              });
                              window.fcWidget.on('user:created', function (resp) {
                                var status = resp && resp.status,
                                  data = resp && resp.data;
                                if (status === 200) {
                                  if (data.restoreId) {
                                    var dataStore = {
                                      institude_id: self.props.instituteId,
                                      branch_id: self.props.branchId,
                                      token: self.props.token,
                                      payload: {
                                        "restore_id": data.restoreId
                                      }
                                    }
                                    self.props.storeRestoreId(dataStore).then(() => {
                                      let res = self.props.storeRestoredId;
                                    })
                                  }
                                }
                              });
                            }
                          });
                        }
                      })
                    }
                  })
                  //Which need to be fetched from your DB


                })

              }

            })


          }
        } else if (this.props.userType == "ADMIN") {
          if (this.state.flag) {
            let apiData = {
              institude_id: nextprops.instituteId,
              branch_id: nextprops.branchId,
              token: nextprops.token,
            }
            this.setState({ instituteid: nextprops.instituteId, branchid: nextprops.branchId, token: nextprops.token })

            var self = this;
            this.props.getAdminProfileData(apiData).then(() => {
              let res = this.props.adminProfileData;

              if (res && res.status == 200) {
                this.setState({ AdminDetail: res.response.profileDetails, flag: false }, () => {
                  if (this.state.AdminDetail) {


                    let data = {
                      institude_id: nextprops.instituteId,
                      branch_id: nextprops.branchId,
                      token: nextprops.token
                    }
                    self.props.getRestoreId(data).then(() => {
                      let res = this.props.getRestoredId;

                      if (res && res.status == 200) {
                        self.setState({ restoreid: res.response.restore_id }, () => {
                          var restoreId = this.state.restoreid;
                          var ifConnected = window.navigator.onLine;
                          if (ifConnected) {
                            window.fcWidget.init({
                              token: "21a0037c-0651-492c-9ded-853a8519c7ea",
                              host: "https://wchat.freshchat.com",
                              externalId: self.state.AdminDetail.email,
                              restoreId: restoreId ? restoreId : null
                            });
                            window.fcWidget.user.get(function (resp) {
                              var status = resp && resp.status,
                                data = resp && resp.data;
                              if (status !== 200) {
                                window.fcWidget.user.setProperties({
                                  firstName: self.state.AdminDetail.firstname,              // user's first name
                                  lastName: self.state.AdminDetail.lastname,                // user's last name
                                  email: self.state.AdminDetail.email,    // user's email address
                                  plan: "Student",                 // user's meta property 1
                                  status: "Active"               // user's meta property 2
                                  // "Last Payment": "12th August"   // user's meta property 3
                                });
                                window.fcWidget.on('user:created', function (resp) {
                                  var status = resp && resp.status,
                                    data = resp && resp.data;
                                  if (status === 200) {
                                    if (data.restoreId) {
                                      var dataStore = {
                                        institude_id: self.props.instituteId,
                                        branch_id: self.props.branchId,
                                        token: self.props.token,
                                        payload: {
                                          "restore_id": data.restoreId
                                        }
                                      }
                                      self.props.storeRestoreId(dataStore).then(() => {
                                        let res = self.props.storeRestoredId;
                                      })
                                    }
                                  }
                                });
                              }
                            });
                          }
                        })
                      }
                    })
                    //Which need to be fetched from your DB
                  }
                })
              }
            })
          }
        }

      }
    }
  }

  componentDidMount() {
    if (this.props.userType != "STUDENT") {
      if (this.props.userType == "PROFESSOR") {
        if(this.props.instituteId != null && this.props.branchId != null && this.props.instituteId != "" && this.props.branchId != ""){
        let apiData = {
          institute_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
        }
        this.setState({ instituteid: this.props.instituteId, branchid: this.props.branchId, token: this.props.token })
        var self = this;
        self.props.getProfessorProfile(apiData).then(() => {
          let res = self.props.professorProfile;

          if (res && res.data.status == 200) {
            self.setState({ professorDetail: res.data.response[0] }, () => {
              if (this.state.professorDetail) {


                let data = {
                  institude_id: this.props.instituteId,
                  branch_id: this.props.branchId,
                  token: this.props.token
                }
                self.props.getRestoreId(data).then(() => {
                  let res = this.props.getRestoredId;

                  if (res && res.status == 200) {
                    self.setState({ restoreid: res.response.restore_id }, () => {

                      var restoreId = this.state.restoreid;
                      var ifConnected = window.navigator.onLine;
                      if (ifConnected) {
                        window.fcWidget.init({
                          token: "21a0037c-0651-492c-9ded-853a8519c7ea",
                          host: "https://wchat.freshchat.com",
                          externalId: self.state.professorDetail.email,
                          restoreId: restoreId ? restoreId : null
                        });
                        window.fcWidget.user.get(function (resp) {
                          var status = resp && resp.status,
                            data = resp && resp.data;
                          if (status !== 200) {
                            window.fcWidget.user.setProperties({
                              firstName: self.state.professorDetail.firstname,              // user's first name
                              lastName: self.state.professorDetail.lastname,                // user's last name
                              email: self.state.professorDetail.email,    // user's email address
                              plan: "Student",                 // user's meta property 1
                              status: "Active"               // user's meta property 2
                              // "Last Payment": "12th August"   // user's meta property 3
                            });
                            window.fcWidget.on('user:created', function (resp) {
                              var status = resp && resp.status,
                                data = resp && resp.data;
                              if (status === 200) {
                                if (data.restoreId) {
                                  var dataStore = {
                                    institude_id: self.props.instituteId,
                                    branch_id: self.props.branchId,
                                    token: self.props.token,
                                    payload: {
                                      "restore_id": data.restoreId
                                    }
                                  }
                                  self.props.storeRestoreId(dataStore).then(() => {
                                    let res = self.props.storeRestoredId;
                                  })
                                }
                              }
                            });
                          }
                        });
                      }
                    })
                  }
                })
                //Which need to be fetched from your DB
              }

            })

          }

        })


      }
      }
      else if (this.props.userType == "ADMIN") {
        if(this.props.instituteId != null && this.props.branchId != null && this.props.instituteId != "" && this.props.branchId != ""){
        let apiData = {
          institude_id: this.props.instituteId,
          branch_id: this.props.branchId,
          token: this.props.token,
        }
        this.setState({ instituteid: this.props.instituteId, branchid: this.props.branchId, token: this.props.token })
        var self = this;
        this.props.getAdminProfileData(apiData).then(() => {
          let res = this.props.adminProfileData;
          if (res && res.status == 200) {
            this.setState({ AdminDetail: res.response.profileDetails }, () => {
              if (this.state.AdminDetail) {


                let data = {
                  institude_id: this.props.instituteId,
                  branch_id: this.props.branchId,
                  token: this.props.token
                }
                self.props.getRestoreId(data).then(() => {
                  let res = this.props.getRestoredId;

                  if (res && res.status == 200) {
                    self.setState({ restoreid: res.response.restore_id }, () => {

                      var restoreId = this.state.restoreid;
                      var ifConnected = window.navigator.onLine;
                      if (ifConnected) {
                        window.fcWidget.init({
                          token: "21a0037c-0651-492c-9ded-853a8519c7ea",
                          host: "https://wchat.freshchat.com",
                          externalId: self.state.AdminDetail.email,
                          restoreId: restoreId ? restoreId : null
                        });
                        window.fcWidget.user.get(function (resp) {
                          var status = resp && resp.status,
                            data = resp && resp.data;
                          if (status !== 200) {
                            window.fcWidget.user.setProperties({
                              firstName: self.state.AdminDetail.firstname,              // user's first name
                              lastName: self.state.AdminDetail.lastname,                // user's last name
                              email: self.state.AdminDetail.email,    // user's email address
                              plan: "Student",                 // user's meta property 1
                              status: "Active"               // user's meta property 2
                              // "Last Payment": "12th August"   // user's meta property 3
                            });
                            window.fcWidget.on('user:created', function (resp) {
                              var status = resp && resp.status,
                                data = resp && resp.data;
                              if (status === 200) {
                                if (data.restoreId) {
                                  var dataStore = {
                                    institude_id: self.props.instituteId,
                                    branch_id: self.props.branchId,
                                    token: self.props.token,
                                    payload: {
                                      "restore_id": data.restoreId
                                    }
                                  }
                                  self.props.storeRestoreId(dataStore).then(() => {
                                    let res = self.props.storeRestoredId;
                                  })
                                }
                              }
                            });
                          }
                        });
                      }
                    })
                  }
                })
                //Which need to be fetched from your DB
              }

            })

          }

        })

      }
      }
    }
  }

  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = ({ app, professor, auth }) => ({

  branchId: app.branchId,
  instituteId: app.institudeId,
  token: auth.token,
  userType: auth.userType,
  professorProfile: professor.professorProfile,
  getRestoredId: app.getRestoredId,
  storeRestoredId: app.storeRestoredId,
  adminProfileData: app.adminProfileData
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAdminProfileData,
      getProfessorProfile,
      getRestoreId,
      storeRestoreId
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(FreshChat)



