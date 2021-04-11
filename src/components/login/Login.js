import React,  {useState, useEffect, useLayoutEffect} from 'react'
import { useHistory, Redirect } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';

import './style.css' 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var CryptoJS = require("crypto-js");

function Login(props) {

    const [showLogin, setShowLogin] = useState(true)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [isChecked,setIsChecked] = useState(false)
    const history = useHistory()
    const [showNullError,setShowNullError] = useState(false)
    const [showError,setShowError] = useState(false)
    const [messageFromServer,setMessageFromServer] =  useState('')

    const sendEmail = async (e) => {
        e.preventDefault();
        if (email === '') {
          toast.error('Email field cannot be Null !', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
          
        } else {
          try {
            const response = await axios.post(
              'https://audit-n-go-backend.herokuapp.com/forgotPassword',
              {
                email,
              },
            );
            if (response.status == 200) {
                setShowError(false)
                setShowNullError(false)
                setMessageFromServer('recovery email sent')
                toast.success('Email has been sent ! Check your inbox', {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  });
            }else{
              toast.error('Wrong email ! Please Try Again', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            }
          } catch (error) {
            toast.error('Something went Worng. Please try again later', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              });
          }
         }
      };


    useEffect(() => {
        if (localStorage.username && localStorage.checkbox) {
            setEmail(CryptoJS.AES.decrypt(localStorage.username, 'ElementsOfSoftwareConstruction').toString(CryptoJS.enc.Utf8))
            setPassword(CryptoJS.AES.decrypt(localStorage.password, 'ElementsOfSoftwareConstruction').toString(CryptoJS.enc.Utf8))
            setIsChecked(localStorage.checkbox)
        }
        if(!localStorage.checkbox){
            Cookies.set("isLoggedIn",0)
        }
      },[]);

     const onChangeCheckbox = event => {
        setIsChecked(
            event.target.checked
        )
        localStorage.checkbox = isChecked
    }

     function onSubmit(e) {
         e.preventDefault()
        if (isChecked && email !== "") {
            localStorage.username = CryptoJS.AES.encrypt(email, 'ElementsOfSoftwareConstruction').toString()
            localStorage.password = CryptoJS.AES.encrypt(password, 'ElementsOfSoftwareConstruction').toString()
            localStorage.checkbox = isChecked
        }
        const userObject = {
            email: email,
            password: password,
            headers: { 'Content-Type': 'application/json' }
        };
        axios.post('https://audit-n-go-backend.herokuapp.com/login', userObject)
            .then(
              (res) => {
                if(res.status!==200){
                  alert('HELLO')
                }
                else if(res.status==200){
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    getAuthHeader(res.data)
                    if (getAuthHeader(res.data) != null){
                        if(res.data.refreshToken!=null){
                        setTimeout( () =>{
                            refreshAccess(res.data);
                        }, 1200000);}
                    }
                    const loggedInUserData = {
                      userId: res.data.userId,
                      isAdmin: res.data.isAdmin,
                      username: res.data.username
                    }

                    Cookies.set('isLoggedIn', 1 , { expires: 2 })
                    Cookies.set('loggedInUser', loggedInUserData , { expires: 2 })
                    props.dispatch({ type: "setLoggedInUser", loggedInUser: loggedInUserData })
                    history.push('/dashboard');
                } else {
                  toast.error('Please Try Again !', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                }
            }).catch((error) => {
              toast.error('Wrong Credentials ! Please Try Again.', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            });
          

        setEmail('')
        setPassword('')
    }
  

   function getAuthHeader(req){
        const head = {
            headers: { 'Content-Type': 'application/json',
            "Authorization" : `Bearer ${req.accessToken}`
        }}
        const responsehello = axios.get('https://audit-n-go-backend.herokuapp.com/auth', 
            head,
          )
          .then(function (response) {
            return response.data;
          })
          .catch((err) => {
              console.log(err)
          })
          return responsehello
    }

    async function refreshAccess(req){
        const refreshToken = {token:req.refreshToken}

        axios.post('https://audit-n-go-backend.herokuapp.com/tokens', refreshToken
      )
      .then(function (response) {
        axios.post('https://audit-n-go-backend.herokuapp.com/tokens', refreshToken).then(function (responseAgain){
            return responseAgain.data.accessToken;
        })
        
      })
}

localStorage.email = localStorage.username
const isLoggedIn = Cookies.get("isLoggedIn")
if (isLoggedIn == 1) {
  return (
    <Redirect to="/dashboard" />        
  )
  }

    return (
        
        <div class="body" styles={{alignItems:"center"}}>
            <div class="form-structor">
                <div class={`signup ${showLogin ? "" : "slide-up"}`}>
                    <h2 class="form-title" id="signup" onClick={() => setShowLogin(!showLogin)}><span>or</span>Login</h2>
                    <div class="form-holder">
                        <input type="email" class="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" class="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="form-group">
                    <div className="custom-control custom-checkbox">
                    <p></p>
                        <input type="checkbox" className="custom-control-input" id="customCheck1" checked={isChecked} name="lsRememberMe" onChange={onChangeCheckbox}  />
                        <label className="custom-control-label" htmlFor="customCheck1" style={{color:"white"}}>Remember me</label>
                    </div>
                </div>
                    <button class="submit-btn-v1" onClick={onSubmit}>Log In</button>
                    </div>
                <div class={`login ${showLogin ? "slide-up" : ""}`}> 
                    <div class={`center-v1 ${showLogin ? "" : "slide-up"}`}>
                        <h2 class="form-title" id="login" onClick={() => setShowLogin(!showLogin)}><span>or</span>Forgot Password</h2>
                        <div class="form-holder">
                            <input type="email" class="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div> 
                        <button class="submit-btn-v1" onClick={sendEmail}>Send Mail</button>
                    </div>
                </div>
            </div>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              />
        </div>
    )
  }

const mapStateToProps = function(state) {
  return {
      loggedInUser: state.loggedInUser
  }
}
export default connect(mapStateToProps)(Login);

