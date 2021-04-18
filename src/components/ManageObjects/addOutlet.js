import React,  {useState, useEffect, useLayoutEffect} from 'react'
import { useHistory, Redirect } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, Link,useLocation } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';

export default function AddOutlet(){

    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [institution_name,setInstitutionName] = useState('')
    const history = useHistory()
    

function onSubmit(){

    let temp_password = Math.random().toString(36).substring(10);
    console.log("random ", temp_password);

    axios.post('/outlet', {username:username,email:email,password:temp_password,institution_name:institution_name})
    .then(
      (res) => {
        if(res.status!==201){
          alert('Outlet not added! Please try again!')
        }
    })

    }





    return (
        <div>
          <h2 class="form-title">Create new outlet</h2>
          <form>
          <TextField required id="standard-required" label="Name" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} />
          <p></p>
          <TextField required id="standard-required" label="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <p></p>
          <TextField required id="standard-required" label="Institution Name" placeholder="Institution Name" value={institution_name} onChange={(e) => setInstitutionName(e.target.value)}/>
          </form>
        
          <Link to={"/dashboard"}>
          <Button variant="contained" color="primary" onClick={onSubmit} style={{textTransform:"none"}}>
              Create outlet
          </Button>
          </Link>
        </div>
    )
    }
