import React,  {useState, useEffect, useLayoutEffect} from 'react'
import { useHistory, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 

const title = {
    pageTitle: 'Forgot Password Screen',
  };

  function ForgotPassword(props) {
    const [email,setEmail] = useState('')
    const [showNullError,setShowNullError] = useState(false)
    const [showError,setShowError] = useState(false)
    const [messageFromServer,setMessageFromServer] =  useState('')
    const history = useHistory()

    const sendEmail = async (e) => {
        e.preventDefault();
        if (email === '') {
            setShowError(false)
                setShowNullError(true)
                setMessageFromServer('')
                return;
          
        } else {
          try {
            const response = await axios.post(
              'https://www.audit-n-go-backend.technopanther.com/forgotPassword',
              {
                email,
              },
            );
            if (response.status == 200) {
                setShowError(false)
                setShowNullError(false)
                setMessageFromServer('recovery email sent')
            }
          } catch (error) {
            console.log(error);
          }
         }
      };

      return (
        <div>
        <div >
          <form className="profile-form" onSubmit={sendEmail}>
            <TextField
              id="email"
              label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
            <Button variant="contained"
              color="primary"
              // className={classes.button}
              endIcon={<Icon>send</Icon>}
              onClick={sendEmail}
              style = {{ textTransform : "None"}}
            >Send Password Reset Email</Button>
          </form>
          {showNullError && (
            <Typography variant="subtitle1" align="center">The email address cannot be empty.</Typography>
          )}
          {showError && (
            <div>
              <p>
                That email address isn&apos;t recognized. Please try again 
              </p>
            </div>
          )}
          {messageFromServer === 'recovery email sent' && (
            toast.success('Password recovery email has been sent! Please check your inbox', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              })
          )}

          <div style={{alignItems:"center",display:"block"}}>
           <Button variant="contained" color="secondary" onClick={ () => { history.push('/dashboard') } } 
              style = {{ textTransform : "None"}}  >Go Home</Button>
          </div>
          </div>
                  
         
        </div>
      );
    }

const mapStateToProps = function(state) {
  return {
      forgotPasswordEmail: state.forgotPasswordEmail
  }
}
export default connect(mapStateToProps)(ForgotPassword)