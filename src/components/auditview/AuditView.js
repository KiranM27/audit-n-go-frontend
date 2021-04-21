import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Cookies from "js-cookie";
import { useHistory, Redirect } from "react-router-dom";
import { ExportCSV } from "../helperfunctions/exportCSV";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chat from "../chat/Chat";
import PartView from "./PartView";
import { Modal } from "antd";

function GetParams() {
  let { audit_id } = useParams();
  return audit_id;
}

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
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}));

export default function AuditView() {
  const audit_id = GetParams();
  const [auditType, setAuditType] = useState("");
  const [checklistResults, setChecklistResults] = useState([]);
  const [NCs, setNCs] = useState([]);
  const [institutionName, setInstitutionName] = useState("");
  const [outletName, setOutletName] = useState("");
  const [auditInfo, setAuditInfo] = useState("");
  const [disableParts, setDisableParts] = useState([]);
  const [checklistRenderData, setChecklistrenderData] = useState([]);
  const csvExport = []
  // NC Toggle
  const [showNC, setShowNC] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory()

  // Tab stuff
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const showModal = () => {
    setIsModalVisible(true);
    console.log("modal visibile", isModalVisible)
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Toggle showNC function
  const handleShowNCChange = (event) => {
    if (!showNC === false) {
      setChecklistrenderData(checklistResults);
    } else {
      setChecklistrenderData(NCs);
    }
    setShowNC(!showNC);
  };

  useEffect(() => {
    if(!localStorage.checkbox){
      Cookies.set("isLoggedIn",0)
  }
    axios
      .get("/getAuditViewDetails/" + audit_id)
      .then((response) => {
        setChecklistResults(response.data.auditInfo.checklist_results);
        setChecklistrenderData(response.data.auditInfo.checklist_results);
        setAuditType(
          response.data.auditInfo.audit_type === "cv"
            ? "Covid Compliance"
            : response.data.auditInfo.audit_type === "fb"
            ? "Retail F&B"
            : "Non F&B"
        );
        setDisableParts(
          response.data.auditInfo.audit_type === "cv"
            ? [true, true, true]
            : response.data.auditInfo.audit_type === "fb"
            ? [false, false, false]
            : [false, true, true]
        );
        setInstitutionName(response.data.institutionName);
        setOutletName(response.data.outletName);
        setAuditInfo(response.data.auditInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log("Computing NCs")
    setNCs(computeNCList(checklistResults));
  }, [checklistResults])

  function computeNCList(checklistResults) {
    let localNCList = [];
    for (let i = 0; i < checklistResults.length; i++) {
      localNCList.push([]);
      for (let j = 0; j < checklistResults[i].length; j++) {
        if (auditType === "Covid Compliance") {
          if (checklistResults[i][j].status === "Not Complied") {
            localNCList[i].push(checklistResults[i][j]);
          }
        }
        else {
          if (checklistResults[i][j].score < 0.5) {
            localNCList[i].push(checklistResults[i][j]);
          }
        }
      }
    }
    console.log("The list of NCs are ", localNCList);
    return localNCList;
  }

  for(var i=0; i<checklistResults.length;i++){
    for(var j=0;j<checklistResults[i].length;j++){
      csvExport.push(checklistResults[i][j])
    }
  }
  for(var i=0;i<csvExport.length;i++){
    csvExport[i].tenant =  outletName;
    csvExport[i].institution = institutionName;
}

function deleteAudit(){
  axios.put('/audit', {audit_id:audit_id})
.then(
  (res) => {
    setIsModalVisible(false)
    alert('Audit has been deleted!')
    history.push("/dashboard")
    if(res.status!==201){
      alert('Audit not deleted! Please try again!')
    }
})

}

  try {
    const isLoggedIn = Cookies.get("isLoggedIn")

if (isLoggedIn == 0) {
  return (
    <Redirect to="/" />        
  )}
    return (
      <div>
        <div>
          <Container maxWidth="md" style={{ paddingBottom: 10 }}>
            <Typography variant="h6" align="center">
              {auditType}
            </Typography>
            <Grid container direction="row" justify="center" alignItems="center">
                  <ExportCSV csvData={csvExport}/>  
                  <Button variant="contained" color="secondary" onClick={showModal} style={{textTransform:"none"}}>
                      Delete Audit
                    </Button>
                </Grid>   
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={showNC} onChange={handleShowNCChange} />
                    }
                    label={`${showNC ? "Showing NCs only" : "Showing all"}`}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="subtitle1" align="right">
                  {outletName}, {institutionName}
                </Typography>
                <Typography variant="subtitle1" align="right">
                  Created on: {auditInfo["start_date"].slice(0, 10)}
                </Typography>
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
                <Tab
                  label="Part III"
                  {...a11yProps(2)}
                  disabled={disableParts[0]}
                />
                <Tab
                  label="Part IV"
                  {...a11yProps(3)}
                  disabled={disableParts[1]}
                />
                <Tab
                  label="Part V"
                  {...a11yProps(4)}
                  disabled={disableParts[2]}
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Container>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Container maxWidth="md">
              <PartView id={0} part={0} checklist={checklistRenderData[0]} 
              checklistResults = { checklistResults } setChecklistResults = { setChecklistResults }
              auditType = { auditType } />
            </Container>
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <Container maxWidth="md">
              <PartView id={0} part={1} checklist={checklistRenderData[1]} 
              checklistResults = { checklistResults } setChecklistResults = { setChecklistResults }
              auditType = { auditType } />
            </Container>
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <Container maxWidth="md">
              <PartView id={0} part={2} checklist={checklistRenderData[2]} 
              checklistResults = { checklistResults } setChecklistResults = { setChecklistResults }
              auditType = { auditType } />
            </Container>
          </TabPanel>

          <TabPanel value={value} index={3} dir={theme.direction}>
            <Container maxWidth="md">
              <PartView id={0} part={3} checklist={checklistRenderData[3]} 
              checklistResults = { checklistResults } setChecklistResults = { setChecklistResults }
              auditType = { auditType } />
            </Container>
          </TabPanel>

          <TabPanel value={value} index={4} dir={theme.direction}>
            <Container maxWidth="md">
              <PartView id={0} part={4} checklist={checklistRenderData[4]} 
              checklistResults = { checklistResults } setChecklistResults = { setChecklistResults }
              auditType = { auditType } />
            </Container>
          </TabPanel>
        </SwipeableViews>
        <Chat audit_id={audit_id} />
        <Modal title="Upload Non compliance Image" visible={isModalVisible} onOk={deleteAudit} onCancel={handleCancel}>
            <div 
            class = "center-noflex" 
              >
                Are you sure that you wish to delete this audit?
            </div>
        </Modal>
      </div>
    );
  } catch (e) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
}
