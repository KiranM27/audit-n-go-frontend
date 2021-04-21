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

export default function AddInstitution(){

    const [name,setName] = useState('')
    const history = useHistory()
    

function onSubmit(){

    axios.post('/createInstitution', {name:name})
    .then(
      (res) => {
        if(res.status!==201){
          alert('Institution not added! Please try again!')
        }
    })

    }





    return (
        <div>
                <h2 class="form-title">Create new Institution</h2>
                <form>
                <TextField required id="standard-required" label="Name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <p></p>
                </form>
            
        <Link to={"/dashboard"}>
        <Button variant="contained" color="primary" onClick={onSubmit} style={{textTransform:"none"}}>
            Create Institution
        </Button>
        </Link>
        </div>
    
        
    )
    }
