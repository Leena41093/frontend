import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { profilePicUpload } from '../../actions/professorActions';
import moment from 'moment';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { successToste } from '../../constant/util';
export class ProfilePicModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            male: true,
            female: false,
            profiledata: [{ "id": 1, "name": "Avatar_5.jpg", "src": "/images/avatars/Avatar_5.jpg", "gender": "MALE", "type": "Boys" },
            { "id": 2, "name": "Avatar_9.jpg", "src": "/images/avatars/Avatar_9.jpg", "gender": "MALE", "type": "Boys" },
            { "id": 3, "name": "Avatar_12.jpg", "src": "/images/avatars/Avatar_12.jpg", "gender": "MALE", "type": "Boys" },
            { "id": 4, "name": "Avatar_17.jpg", "src": "/images/avatars/Avatar_17.jpg", "gender": "MALE", "type": "Boys" },
            { "id": 5, "name": "Avatar_19.jpg", "src": "/images/avatars/Avatar_19.jpg", "gender": "MALE", "type": "Boys" },
            { "id": 6, "name": "Avatar_21.jpg", "src": "/images/avatars/Avatar_21.jpg", "gender": "MALE", "type": "Boys" },
            { "id": 7, "name": "Avatar_1.jpg", "src": "/images/avatars/Avatar_1.jpg", "gender": "FEMALE", "type": "Girls" },
            { "id": 8, "name": "Avatar_7.jpg", "src": "/images/avatars/Avatar_7.jpg", "gender": "FEMALE", "type": "Girls" },
            { "id": 9, "name": "Avatar_8.jpg", "src": "/images/avatars/Avatar_8.jpg", "gender": "FEMALE", "type": "Girls" },
            { "id": 10, "name": "Avatar_18.jpg", "src": "/images/avatars/Avatar_18.jpg", "gender": "FEMALE", "type": "Girls" },
            { "id": 11, "name": "Avatar_20.jpg", "src": "/images/avatars/Avatar_20.jpg", "gender": "FEMALE", "type": "Girls" },
            { "id": 12, "name": "Avatar_22.jpg", "src": "/images/avatars/Avatar_22.jpg", "gender": "FEMALE", "type": "Girls" },
            { "id": 13, "name": "Avatar_3.jpg", "src": "/images/avatars/Avatar_3.jpg", "gender": "MALE", "type": "Teacher" },
            { "id": 14, "name": "Avatar_6.jpg", "src": "/images/avatars/Avatar_6.jpg", "gender": "FEMALE", "type": "Teacher" },
            { "id": 15, "name": "Avatar_10.jpg", "src": "/images/avatars/Avatar_10.jpg", "gender": "MALE", "type": "Teacher" },
            { "id": 16, "name": "Avatar_15.jpg", "src": "/images/avatars/Avatar_15.jpg", "gender": "MALE", "type": "Teacher" },
            { "id": 17, "name": "Avatar_16.jpg", "src": "/images/avatars/Avatar_16.jpg", "gender": "FEMALE", "type": "Teacher" },
            { "id": 18, "name": "Avatar_24.jpg", "src": "/images/avatars/Avatar_24.jpg", "gender": "FEMALE", "type": "Teacher" }],
            selectedImgSrc: "",
            filename: "",
            gender: ""
        }
    }
    componentWillReceiveProps(nextprops){
        if(this.props.Gender == "MALE"){
            this.setState({male:true,female:false});
        }
        else if(this.props.Gender == "FEMALE"){
            this.setState({female:true, male:false});
        }
    }
    componentDidMount(){
        if(this.props.showCancelBtn == true){
            document.getElementById("cancelBtn").removeAttribute("hidden");
        }
        
    }
    onSelectMale() {

        this.setState({ male: true, female: false })

    }

    onSelectFemale() {
        this.setState({ female: true, male: false })

    }

    selectedFile(src, index, gender, name) {
        this.setState({ selectedImgSrc: src ? src : "/images/avatars/user_avatar.png", gender: gender, filename: name }, () => {
            document.getElementById(index).className = "imageselection imageactive";
            if (gender == "MALE") {
                this.state.profiledata.forEach((img, i) => {
                    if (img.gender == "MALE") {
                        if (this.props.userType == "STUDENT") {
                            if (img.type == "Boys") {
                                if (index != i) {
                                    document.getElementById(i).className = "imageselection";
                                }
                            }
                        }
                        else if (this.props.userType == "PROFESSOR" || this.props.userType == "ADMIN") {
                            if (img.type == "Teacher") {
                                if (index != i) {
                                    document.getElementById(i).className = "imageselection";
                                }
                            }
                        }
                    }

                })
            } else if (gender == "FEMALE") {
                this.state.profiledata.forEach((img, i) => {
                    if (img.gender == "FEMALE") {
                        if (this.props.userType == "STUDENT") {
                            if (img.type == "Girls") {
                                if (index != i) {
                                    document.getElementById(i).className = "imageselection";
                                }
                            }
                        }
                        else if (this.props.userType == "PROFESSOR" || this.props.userType == "ADMIN") {
                            if (img.type == "Teacher") {
                                if (index != i) {
                                    document.getElementById(i).className = "imageselection";
                                }
                            }
                        }
                    }

                })
            }

        });
    }

    cssMale() {
        let css = 'st-active'
        let { male } = this.state;
        if (male == true) {
            return css
        }
        return;
    }

    cssFemale() {
        let css = 'st-active'
        let { female } = this.state;
        if (female == true) {
            return css
        }
        return;
    }
    renderImages() {
        if (this.state.male) {
            return this.state.profiledata.map((image, index) => {
                if (image.gender == "MALE") {
                    if (this.props.userType == "STUDENT") {
                        if (image.type == "Boys") {
                            return (

                                <div key={"MALE" + index} className="imageselection" id={index} style={{ display: "inline-block", margin: "5px", padding: "2px" }} onClick={this.selectedFile.bind(this, image.src, index, image.gender, image.name)}>
                                    <img src={image.src} width="80px" height="80px" />
                                </div>

                            )
                        }
                    }
                    else if (this.props.userType == "PROFESSOR" || this.props.userType == "ADMIN") {
                        if (image.type == "Teacher") {
                            return (

                                <div key={"MALE" + index} className="imageselection" id={index} style={{ display: "inline-block", margin: "5px", padding: "2px" }} onClick={this.selectedFile.bind(this, image.src, index, image.gender, image.name)}>
                                    <img src={image.src} width="80px" height="80px" />
                                </div>

                            )
                        }
                    }

                }
            })

        }
        else if (this.state.female) {
            return this.state.profiledata.map((image, index) => {
                if (image.gender == "FEMALE") {
                    if (this.props.userType == "STUDENT") {
                        if (image.type == "Girls") {
                            return (

                                <div key={"FEMALE" + index} className="imageselection" id={index} style={{ display: "inline-block", margin: "5px", padding: "2px" }} onClick={this.selectedFile.bind(this, image.src, index, image.gender, image.name)}>
                                    <img src={image.src} width="80px" height="80px" />
                                </div>

                            )
                        }
                    }
                    else if (this.props.userType == "PROFESSOR" || this.props.userType == "ADMIN") {
                        if (image.type == "Teacher") {
                            return (

                                <div key={"FEMALE" + index} className="imageselection" id={index} style={{ display: "inline-block", margin: "5px", padding: "2px" }} onClick={this.selectedFile.bind(this, image.src, index, image.gender, image.name)}>
                                    <img src={image.src} width="80px" height="80px" />
                                </div>

                            )
                        }
                    }
                }
            })
        }
    }
    saveProfile() {
        const selectFile = { "filename": this.state.filename, "gender": this.state.gender }
        $("#newprofilepic .close").click();
        this.props.onSelectProfile(selectFile);

    }
    render() {

        return (

            <div className="modal fade custom-modal-sm width--sm" id="newprofilepic" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <ToastContainer />
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" hidden><i className="icon cg-times" hidden></i></button>
                            <h4 className="c-heading-sm card--title">Profile Selection</h4>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-8">
                                        <div className="form-group cust-fld" style={{ width: "38%", marginTop: "0px" }}>
                                            <label>Gender</label>
                                            <div className="c-btnRadio">
                                                <button onClick={this.onSelectMale.bind(this, 'MALE')} className={this.cssMale()}>MALE</button>
                                                <button onClick={this.onSelectFemale.bind(this, 'FEMALE')} className={this.cssFemale()}>FEMALE</button>

                                                {/* {this.state.error.isQuizTypeVisible ? <label className="help-block" style={{ color: "red" }}>please select quiz type</label> : <br />} */}
                                            </div>
                                        </div>
                                        <div style={{ width: "300px", height: "300px", overflowX: "none", marginTop: "20px" }}>
                                            {this.renderImages()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <div className="clearfix text--right">
                                <button className="c-btn grayshade" id="cancelBtn" data-dismiss="modal" hidden>Cancel</button>
                                <button className="c-btn primary" onClick={this.saveProfile.bind(this)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        )
    }
}

export default (ProfilePicModal)