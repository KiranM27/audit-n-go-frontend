import 'date-fns';
import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';
import { useParams } from "react-router";
import { connect } from 'react-redux';
import axios from 'axios';
import {  Typography  } from '@material-ui/core';
import { authAxios } from "../helperfunctions/authAxios"
import Cookies from 'js-cookie';
import {  Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccordionsRenderer from './AccordionsRenderer'
import metaData from "./AuditFormMetaData"
import './formstyle.css'

function GetParams() {
    let { iid, oid, at } = useParams();
    return [iid, oid, at]
  }

function AuditForm(props) {
    const params = GetParams()
    const [items, setItems] = useState([]) // Has the items of the Checklist 
    const needScore = params[2] == 'cv' ? false : true;

    useEffect( () => {
        if(!localStorage.checkbox){
            Cookies.set("isLoggedIn",0)
        }
        axios.get(`/checklistItems/${params[2]}`)
        .then(res => {
            var resData = res.data;
            // Adds in Status, Images, SNo to each of the items
            resData.map(item => {
                item["status"] = 'Status TBD'
                item["images"] = []
                item["SNo"] = 0
                item["score"] = 0
            })
            setItems(resData)
            props.dispatch({ type: "setAuditFormData", auditFormData: resData })
        })
    }, [])

    useEffect(() => { // Prepares and dispatches the auditData that is used in the global variable
        var auditData = []
        for (var i = 0; i < metaData[params[2]].partsNo; i ++ ) {
            auditData.push([])
        }

        items.map(item => 
            auditData[item.part - 1].push(item) 
        )

        for (var i = 0; i < auditData.length; i ++) {
            var count = 1
            for (var j = 0; j < auditData[i].length; j ++ ) {
                auditData[i][j]["SNo"] = count
                count += 1
            }
        }
        props.dispatch({ type: "setAuditFormData", auditFormData: auditData })
    }, [items])

    return (
        <div class="center-noflex" style = {{ maxWidth: "80%", margin: "auto"}}> 
        <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                // pauseOnHover
            />
        <div style = {{ paddingBottom: 5 }}>
            <Typography variant="h6" align="center" color="textPrimary" gutterBottom style={{paddingBottom: 0}}>
                Please fill in the Audit Form below to proceed
            </Typography>
        </div>
        <AccordionsRenderer params = { params }/>
        <RenderButton params = { params }  deadline = { props.deadline } auditFormData = { props.auditFormData } 
        props = { props }/>
        </div>

    )
}

function RenderButton(props) {
    // Can edit the function later if we shouldn't allow for incomplete submit   \
    const history = useHistory() 
    let auditData = {}
    function computedAuditData () {
        if(props.auditFormData[0][0]!=null){
            auditData = {   
                "outlet_id": props.params[1],
                "deadline": props.deadline,
                "audit_type": props.params[2],
                "checklist_results": JSON.stringify(props.auditFormData),
            }
        }
        else {
            alert("An errot ocurred ! Please try again later. ")
        }
    }

    function computeNCs() {
        let NCcount = 0
        console.log(props)
        console.log(props.noNotifications)
        for (let i = 0; i < props.auditFormData.length; i ++) {
            for (let j = 0; j < props.auditFormData[i].length; j++) {
                if (props.auditFormData[i][j].status == "Not Complied") {
                    NCcount += 1
                }
            }
        }
        return(NCcount)
    }
    
    function auditSubmitOnClick() {
        computedAuditData()
        let NCcount = computeNCs()
        let notificationBody = ''
        if (NCcount === 0) {
            notificationBody = `You have 0 non compliances. Great Job !`
        } else {
            notificationBody = `Please resolve your ${ NCcount } non complaince(s) by ${ props.deadline }`
        }
        axios.post("/audit", auditData
        ).then((response) => {

            const createdAuditId = response.data.audit_id;

            toast.success(' Audit Created !', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            toast.info('Redirecting to Dashboard', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            
            axios.post("/chatInit", {
                "audit_id": createdAuditId
            }).then((response) => {
                console.log("Chat doc created")
            }).catch((error) => {
                console.log(error);
            })
            
            axios.post("/notification", {
                "outlet_id": props.params[1],
                "title": 'New Audit !',
                "body": notificationBody,
                "path": '/dashboard'
            }).then((response) => {
                console.log("Notification sent !")
            }).catch((error) => {
                console.log(error);
            })
            const noNotifications = props.props.noNotifications + 1;
            if (parseInt(props.props.loggedInUser.userId) == parseInt(props.params[1])) {
                props.props.dispatch({ type: "setNoNotifications", noNotifications: noNotifications })
            }
            setTimeout(function(){ history.push("/dashboard") }, 3000);
        })
        .catch((err) => {
            console.log(err)
        })
    }
    const isLoggedIn = Cookies.get("isLoggedIn")
    
    if (isLoggedIn == 0) {
      return (
        <Redirect to="/" />        
      )}
    if (props.deadline == null || props.deadline == '') {
        return(
        <div style = {{ paddingTop : 15, paddingBottom: 20}}>
            <Button variant="contained" color="secondary"
            // onClick = { auditSubmitOnClick }
            >
                Please select the deadline 
            </Button>
        </div>
        )
    }
    else {
        return(
        <div style = {{ paddingTop : 15, paddingBottom: 20}}>
            <Button variant="contained" color="primary" style = {{ textTransform: "None" }}
            onClick = { auditSubmitOnClick }
            >
                Submit
            </Button>
            
            
        </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        auditFormData: state.auditFormData,
        deadline: state.deadline,
        noNotifications: state.noNotifications,
        loggedInUser: state.loggedInUser
    }
}
connect(mapStateToProps)(RenderButton);
export default connect(mapStateToProps)(AuditForm);