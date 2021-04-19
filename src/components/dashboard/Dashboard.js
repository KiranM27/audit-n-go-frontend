import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { CssBaseline, Typography, Paper, Grid, Container } from '@material-ui/core'
import RecentAudits from './RecentAudits'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IndivTenantChart from './IndivTenantChart';
import TenantRadialChart from './TenantRadialChart';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { useHistory, Redirect } from "react-router-dom";
import { ResponsiveContainer } from 'recharts';
import CalendarView from './CalendarView';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    container: {
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
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
    }
    
}))

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

const Dashboard = props => {
    const classes = useStyles();
    const themeTab = useTheme();
    const [value, setValue] = React.useState(1);
    const [pieSelection, setPieSelection] = React.useState("KKH");

    const { history } = props

    const handleMobileMenuClick = (pageURL) => {
        history.push(pageURL);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const handleChangeIndex = (index) => {
        setValue(index);
    };

    if(!localStorage.checkbox){
        Cookies.set("isLoggedIn",0)
    } 

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    const isLoggedIn = Cookies.get("isLoggedIn")

if (isLoggedIn == 0) {
  return (
    <Redirect to="/" />        
  )}

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <main className={classes.content}>
                <Container maxWidth="md">
                <div style={{paddingTop:10, paddingBottom:30}}>
                    <Grid container spacing={2}>
                        <Grid container justify="left" item xs={6} sm={6}>
                            <Grid>
                                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                                    Welcome, { props.loggedInUser.username }
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} justify="flex-end" item xs={6} sm={6}>
                                <Button 
                                    style = {{textTransform: "none"}}
                                    variant="contained" 
                                    color="secondary"
                                    onClick={(e) => history.push({
                                        pathname: '/auditInitialise'
                                    })}
                                    >
                                    Create new audit
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
                                <Tab label="Recent" {...a11yProps(0)} />
                                <Tab label="Charts" {...a11yProps(1)} />
                                <Tab label="Calendar" {...a11yProps(2)} />
                            </Tabs>
                        </AppBar>
                    </Grid>
                    </Container>
                    <SwipeableViews
                        axis={themeTab.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0} dir={themeTab.direction}>
                            <Container maxWidth="md">
                                {/* <Paper className="classes.paper" style={{padding:10}}> */}
                                    <RecentAudits/>
                                {/* </Paper> */}
                            </Container>
                        </TabPanel>
                        
                        <TabPanel value={value} index={1} dir={themeTab.direction} >
                            <Container maxWidth="md">
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid>
                                        <Typography variant="h6" align="center" style={{textDecoration: "underline"}}>NCs by Institutions</Typography>
                                        <Typography variant="body2" align="center" style={{fontStyle: "italic"}}>Click on the pie to see the detailed breakdown.</Typography>
                                        <IndivTenantChart setPieSelection = { setPieSelection }/>
                                    </Grid>
                                    <Grid>
                                        <Typography variant="h6" align="center" style={{textDecoration: "underline"}}>{pieSelection}</Typography>
                                        <Typography variant="body2" align="center" style={{fontStyle: "italic"}}>Detailed breakdown by all tenants in {pieSelection}</Typography>
                                        <TenantRadialChart pieSelection = { pieSelection }/>
                                    </Grid>
                                    
                                </Grid>
                            </Container>
                        </TabPanel>
                        <TabPanel value={value} index={2} dir={themeTab.direction}>
                            <Container maxWidth="md" height="100%">
                                <CalendarView/>
                            </Container>
                        </TabPanel>
                    </SwipeableViews>
            </main>
        </div>
    )
}

const mapStateToProps = function(state) {
    console.log("state is ", state)
    return {
        loggedInUser: state.loggedInUser
    }
}
export default withRouter(connect(mapStateToProps)(Dashboard));