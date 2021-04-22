import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  CssBaseline,
  Typography,
  Paper,
  Grid,
  Container,
  useMediaQuery,
} from "@material-ui/core";
import AllAuditsByTenant from "./dashboardTenants/AllAuditsByTenant";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import { useHistory, Redirect } from "react-router-dom";
import { ResponsiveContainer } from "recharts";
import CalendarView from "./dashboardTenants/CalendarByTenant";
import ControlCenter from "./ControlCenter";
import RestrictAccess from "../helperfunctions/RestrictAccess";
import AIChatbot from "../chatbot/AIChatbot";
import ChartsForTenant from "./dashboardTenants/ChartsByTenant";

const {
  getAudits,
  sortAudits,
} = require("../helperfunctions/AuditProcessing.js");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  container: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  content: {
    flexGrow: 1,
    height: "auto",
    overflow: "auto",
  },
  rootTab: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  rechartWrapper: {
    display: "flex",
    paddingBottom: 10,
    paddingTop: 6,
    textAlign: "center",
    justifyContent: "center",
  },
}));

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

const Dashboard = (props) => {
  const classes = useStyles();
  const themeTab = useTheme();
  const [value, setValue] = React.useState(1);
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const data = await axios
        .get(`https://www.audit-n-go-backend.technopanther.com/audits/0`)
        .then((res) => {
          console.log(res.data);
          setAuditData(getAudits(res.data));
        });
    } catch (error) {
      setAuditData([]);
    }
  };

  const [pieSelection, setPieSelection] = React.useState("KKH");
  const isSmallScreen = useMediaQuery((theme) =>
    themeTab.breakpoints.down("xs")
  );

  const buttonProps = {
    variant: isSmallScreen ? "contained" : "contained",
    size: isSmallScreen ? "small" : "large",
  };

  const welcomeProps = {
    variant: isSmallScreen ? "body2" : "h5",
  };

  const { history } = props;

  const handleMobileMenuClick = (pageURL) => {
    history.push(pageURL);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (!localStorage.checkbox) {
    Cookies.set("isLoggedIn", 0);
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const isLoggedIn = Cookies.get("isLoggedIn");

  if (Cookies.get("isLoggedIn") != 1) {
    return <Redirect to={"/"} />;
  }

  if (auditData.length != 0) {
    var current_user_id = JSON.parse(Cookies.get("loggedInUser")).userId;
    var filteredAuditData = sortAudits(auditData).filter(
      (child) => child.outlet_id == current_user_id
    );
    var lastAuditId = filteredAuditData[0].id;
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Container maxWidth="md">
          <div style={{ paddingTop: 0, paddingBottom: 20 }}>
            <Grid container spacing={2}>
              <Grid container justify="left" item xs={6} sm={6}>
                <Grid>
                  <Typography
                    {...welcomeProps}
                    align="left"
                    color="textPrimary"
                  >
                    Welcome, {props.loggedInUser.username}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justify="flex-end" item xs={6} sm={6}>
                <Button
                  style={{ textTransform: "none" }}
                  {...buttonProps}
                  color="secondary"
                  onClick={(e) =>
                    history.push({
                      pathname: "/auditDetail/" + lastAuditId,
                    })
                  }
                >
                  See Last Audit
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
        <Container maxWidth="md">
          <Grid container spacing={2} justify="center">
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="full width tabs example"
                centered
              >
                <Tab label="Calendar" {...a11yProps(0)} />
                <Tab label="Charts" {...a11yProps(1)} />
                <Tab label="All Your Audits" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
          </Grid>
        </Container>
        <SwipeableViews
          axis={themeTab.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={themeTab.direction}>
            <Container maxWidth="md">
              {/* <Paper className="classes.paper" style={{padding:10}}> */}
              <CalendarView />
              {/* </Paper> */}
            </Container>
          </TabPanel>

          <TabPanel value={value} index={1} dir={themeTab.direction}>
            <Container maxWidth="md">
              <ChartsForTenant />
            </Container>
          </TabPanel>
          <TabPanel value={value} index={2} dir={themeTab.direction}>
            <Container maxWidth="md" height="100%">
              <AllAuditsByTenant />
            </Container>
          </TabPanel>
        </SwipeableViews>
      </main>
    </div>
  );
};

const mapStateToProps = function(state) {
  console.log("state is ", state);
  return {
    loggedInUser: state.loggedInUser,
  };
};

export default withRouter(connect(mapStateToProps)(Dashboard));
