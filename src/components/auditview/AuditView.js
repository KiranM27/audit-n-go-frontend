import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button"
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Cookies from 'js-cookie';
import { useHistory, Redirect } from "react-router-dom";
import { ExportCSV } from "../helperfunctions/exportCSV";
import CircularProgress from '@material-ui/core/CircularProgress';


import Chat from '../chat/Chat'
import PartView from './PartView'

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  formGroup: {
    alignItems: 'right'
  }
}));

const AuditView = props => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [fullAuditData, setFullAuditData] = React.useState([]);
  const [instData, setInstData] = React.useState([]);
  const [outletData, setOutletDta] = React.useState([]);
  const [id, setId] = React.useState(0);
  const [showNC, setShowNC] = React.useState(false);
  const theAuditThing = []

  useEffect( () => {
    if(!localStorage.checkbox){
      Cookies.set("isLoggedIn",0)
  }
    setId(props.location.state.id);
    retrieveAuditDetail();
    retrieveInstData();
    retrieveOutletData();
  },[])

  const retrieveInstData = async () => {
    try {
        const data = await axios
            .get(`/getInstitutions`)
            .then(res => {
                setInstData(res.data);
            });
    }catch(error){
      setInstData([]);
    }
  };

  const retrieveOutletData = async () => {
    try {
        const data = await axios
            .get(`/outlets/0`)
            .then(res => {
                setOutletDta(res.data);
            });
    }catch(error){
      setOutletDta([]);
    }
  };

  const handleShowNCChange = (event) => {
    setShowNC(!showNC);
  }

  const retrieveAuditDetail = async () => {
    try {
        const data = await axios
            .get(`/audits/0`)
            .then(res => {
                setFullAuditData(res.data);
            });
    }catch(error){
      setFullAuditData([]);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };



  if (fullAuditData.length != 0 && instData.length != 0 && outletData.length != 0){

    var checklist = [];
    var NC_list = [];
    var auditDetailData = [];
    var tenantName = "";
    var instName = "";
    var formType ="";
    var disablePart3 = false;
    var disablePart45 = false;

    // create checklist
    // a list that contains all the audit results
    for (var i = 0; i < fullAuditData.length; i++) {
     if (id == fullAuditData[i]["audit_id"]){

       checklist = fullAuditData[i]['checklist_results'];
       auditDetailData = fullAuditData[i];
      }
    }

    // create NC_list
    // a list that contains all the non-compliance items
    for (var i = 0; i < checklist.length; i++) {
      NC_list.push([])
      for (var j = 0; j < checklist[i].length; j++) {
        if (checklist[i][j]["status"] == "Not Complied"){
          NC_list[i].push(checklist[i][j])
        }
      }
    }


    // get tenant name and institution name
    for (var i = 0; i < outletData.length; i++) {
      if (auditDetailData["outlet_id"] == outletData[i]["outlet_id"]){
        tenantName = outletData[i]["username"];
        for (var j = 0; j < instData.length; j++){
          if (outletData[i]["institution_id"] == instData[j]["institution_id"]){
            instName = instData[j]["name"]
            break;
          }
        }
        break;
      }
    }

    // get audit form type
    if (auditDetailData['audit_type'] == "cv"){
      formType = "COVID-19 Audit Form";
      disablePart3 = true;
      disablePart45 = true;
    }else if (auditDetailData['audit_type'] == "fb"){
      formType = "Food & Beverages Audit Form";
    }else{
      formType = "Non Food & Beverages Audit Form";
      disablePart45 = true;
    }

   

    for(var i=0; i<checklist.length;i++){
      for(var j=0;j<checklist[i].length;j++){
          theAuditThing.push(checklist[i][j])
      }
    }

    for(var i=0;i<theAuditThing.length;i++){
          theAuditThing[i].tenant =  tenantName;
          theAuditThing[i].institution = instName;
          theAuditThing[i].deadline = auditDetailData['start_date'].slice(0,10);

    }


  }else{
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress />
      </div>
    )
  }
  if (showNC){
    const isLoggedIn = Cookies.get("isLoggedIn")

if (isLoggedIn == 0) {
  return (
    <Redirect to="/" />        
  )}

    return (
      <div>
          <div>
              <Container maxWidth="md" style={{paddingBottom:10}}>
                <Typography variant = "h6" align="center">{formType}</Typography>                
                <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={<Switch checked={showNC} onChange={handleShowNCChange} />}
                          label={`${showNC ? "Showing NCs only." : "Showing all."}`}
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant = "subtitle1" align="right">{tenantName}, {instName}</Typography>
                        <Typography variant = "subtitle1" align="right">Created on: {auditDetailData['start_date'].slice(0,10)}</Typography>
                        
                    </Grid>
                </Grid>
              </Container>
          </div>
          <Container maxWidth="md">
          <Grid container spacing={2} justify="center">
              <AppBar position="static" color="default">
                  <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  >
                  <Tab label="Part I" {...a11yProps(0)} />
                  <Tab label="Part II" {...a11yProps(1)} />
                  <Tab label="Part III" {...a11yProps(2)} disabled={disablePart3}/>
                  <Tab label="Part IV" {...a11yProps(3)} disabled={disablePart45}/>
                  <Tab label="Part V" {...a11yProps(4)} disabled={disablePart45}/>
                  </Tabs>
              </AppBar>
          </Grid>
          </Container>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Container maxWidth="md">
              <PartView id={id} part={0} checklist={NC_list[0]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={1} checklist={NC_list[1]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={2} checklist={NC_list[2]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={3} checklist={NC_list[3]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={4} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={4} checklist={NC_list[4]}/>
            </Container>
          </TabPanel>
        </SwipeableViews>
        <Chat />
      </div>
    )
  }else{
    return (
      <div>
          <div>
              <Container maxWidth="md" style={{paddingBottom:10}}>
                <Typography variant = "h6" align="center">{formType}</Typography>  
                <Grid container direction="row" justify="center" alignItems="center">
                  <ExportCSV csvData={theAuditThing}/>  
                </Grid>   
                <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={<Switch checked={showNC} onChange={handleShowNCChange} />}
                          label={`${showNC ? "Showing NCs only." : "Showing all."}`}
                        />
                        
                      </FormGroup>
                      
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant = "subtitle1" align="right">{tenantName}, {instName}</Typography>
                        <Typography variant = "subtitle1" align="right">Created on: {auditDetailData['start_date'].slice(0,10)}</Typography>
                        
                    </Grid>
                    
                </Grid>
              </Container>
          </div>
          <Container maxWidth="md">
          <Grid container spacing={2} justify="center">
              <AppBar position="static" color="default">
                  <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  >
                  <Tab label="Part I" {...a11yProps(0)} />
                  <Tab label="Part II" {...a11yProps(1)} />
                  <Tab label="Part III" {...a11yProps(2)} disabled={disablePart3}/>
                  <Tab label="Part IV" {...a11yProps(3)} disabled={disablePart45}/>
                  <Tab label="Part V" {...a11yProps(4)} disabled={disablePart45}/>
                  </Tabs>
              </AppBar>
          </Grid>
          </Container>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Container maxWidth="md">
              <PartView id={id} part={0} checklist={checklist[0]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={1} checklist={checklist[1]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={2} checklist={checklist[2]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={3} checklist={checklist[3]}/>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={4} dir={theme.direction}>
          <Container maxWidth="md">
            <PartView id={id} part={4} checklist={checklist[4]}/>
            </Container>
          </TabPanel>
        </SwipeableViews>
        <Chat />
      </div>
    );
  }
}

function getAuditbyID(id, allAuditData){
  for (var i = 0; i < allAuditData.length; i++) {
    if (id == allAuditData[i]['audit_id']){
      return allAuditData[i];
    }
  }
  return null;
}

export default withRouter(AuditView);
