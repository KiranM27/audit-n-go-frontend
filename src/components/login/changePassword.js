import React, { Component,useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link,useLocation } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import "./style.css";

var CryptoJS = require("crypto-js");

export default class ChangePassword extends Component {
    constructor(props) {
        super(props)

        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            token: '',
            email:'',
            password: '',
        }
    }

    onChangeValue = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
 
    
    changePasswordSubmit = () => {
        const { token ,email, password } = this.state
        if (token !== "" && this.props.forgotPasswordEmail !== '') {
            localStorage.token = token
            localStorage.password = CryptoJS.AES.encrypt(password, 'ElementsOfSoftwareConstruction').toString()
            localStorage.email = CryptoJS.AES.encrypt(email, 'ElementsOfSoftwareConstruction').toString()
        }
        // here call the API to signup/login
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value }
        , () => {
            // console.log(this.state.password)
        })
        
    }

    // onChangeUserToken(e) {
    //     this.setState({ token: e.target.value }
    //     , () => {
    //         // console.log(this.state.email)
    //     })
    // }

    onChangeEmail(e) {
        this.setState({ email: e.target.value }
        , () => {
            // console.log(this.state.email)
        })
    }

    componentDidMount() {
        if (localStorage.token !== "" && localStorage.email !== "" ) {
            this.setState({
                token: localStorage.token,
                email: CryptoJS.AES.decrypt(localStorage.email, 'ElementsOfSoftwareConstruction').toString(CryptoJS.enc.Utf8),
                password: CryptoJS.AES.decrypt(localStorage.password, 'ElementsOfSoftwareConstruction').toString(CryptoJS.enc.Utf8)
            })
        }
    }
 

    onSubmit(e) {
        e.preventDefault()
        const { token, email, password } = this.state

        if (token !== "" && this.props.forgotPasswordEmail !== '') {
            localStorage.token = token
            localStorage.email =  CryptoJS.AES.encrypt(email, 'ElementsOfSoftwareConstruction').toString()
            localStorage.password =  CryptoJS.AES.encrypt(password, 'ElementsOfSoftwareConstruction').toString()
        }
      
        const searchParams = new URLSearchParams(this.props.match.params).get("token")

        const userObject = {
            "token":searchParams?searchParams:"FALSE",
            "email":  CryptoJS.AES.decrypt(localStorage.email, 'ElementsOfSoftwareConstruction').toString(CryptoJS.enc.Utf8) ,
            "password": this.state.password,
            "headers": { 'Content-Type': 'application/json' }
        };



        axios.put('api/changePassword/', userObject)
            .then((res) => {
                if(res.status==201){
                    this.props.history.push('/dashboard');
                }else if(res.status==401){
                alert("LOGIN WRONGGG!!!");
                }
                // console.log(res.data)
            }).catch((error) => {
                // console.log(error)
            });

         this.setState({ token: '', email:'',password: '' })
    }

    getAuthHeader(req){
        // console.log("function starts",req)
        const head = {
            headers: { 'Content-Type': 'application/json'
        }}
    }
        
    render() {
        return (
            <div class="body" styles={{alignItems:"center"}}>
                 <div class="form-structor">
                     <div class="signup">
                     <h2 class="form-title">Enter new password</h2>
                <div class="form-holder">
                    <input type="password" class="input" placeholder="Password" value={this.state.password} onChange={this.onChangePassword}/>
                </div>
                <Link to={"/"}>
                    <button class="submit-btn-v1" onClick={this.onSubmit}>Change Password</button>
                </Link>
            </div>
            </div>
        </div>
            
        )
    }
}