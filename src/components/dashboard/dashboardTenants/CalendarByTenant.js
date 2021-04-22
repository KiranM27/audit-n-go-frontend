import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Calendar, Badge } from "antd";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  CssBaseline,
  Typography,
  Paper,
  Grid,
  Container,
} from "@material-ui/core";
import PropTypes from "prop-types";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@material-ui/core/Box";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";

const {
  sortFullAuditData,
  getOutletAndInstitute,
  processAuditData,
} = require("../../helperfunctions/AuditDataClean.js");

const useStyles = makeStyles((theme) => ({
  calendarCard: {
    width: 300,
    border: 1,
    borderRadius: 2,
  },
  events: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function onPanelChange(value, mode) {
  console.log(value, mode);
}

const monthStr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CalendarView = (props) => {
  const { history } = props;
  const classes = useStyles();
  const [auditData, setAuditData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [instData, setInstData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const data = await axios.get(`https://www.audit-n-go-backend.technopanther.com/audits/0`).then((res) => {
        console.log(res.data);
        setAuditData(processAuditData(res.data));
      });
      const outletData = await axios.get(`https://www.audit-n-go-backend.technopanther.com/outlets/0`).then((res) => {
        setOutletData(res.data);
      });
      const instituionData = await axios.get(`https://www.audit-n-go-backend.technopanther.com/getInstitutions`).then((res) => {
        setInstData(res.data);
      });
    } catch (error) {
      setAuditData([]);
      setOutletData([]);
      setInstData([]);
    }
  };

  useEffect(() => {
    if (selectedAudit != null) {
      history.push({
        pathname: "/auditDetail/" + selectedAudit,
      });
    }
  });

  const handleClickOpen = (props) => {
    setOpen(true);
    setSelectedDay(props.date());
    setSelectedMonth(props.month());
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const onSelect = (props) => {
    console.log(props.month());
  };

  function handleCellRender(value) {
    const displayBadge = getCalData(value);
    // console.log(value);
    return <Badge status={displayBadge} offset={[4, 0]} />;
  }

  function getCalData(value) {
    const month = value.month();
    const day = value.date();
    if (deadlineDataforCal[month][day - 1].length == 0) {
      return "";
    } else {
      return "success";
    }
  }

  if (auditData.length != 0 && instData.length != 0 && outletData.length != 0) {
    var current_user_id = JSON.parse(Cookies.get("loggedInUser")).userId;

    var deadlineDataforCal = [];
    for (var i = 0; i < 12; i++) {
      deadlineDataforCal.push([]);
      for (var j = 0; j < 31; j++) {
        deadlineDataforCal[i].push([]);
      }
    }

    var auditDataByTenant = auditData.filter(
      (child) => child.outlet_id == current_user_id
    );
    console.log(auditDataByTenant);

    for (var i = 0; i < auditDataByTenant.length; i++) {
      var deadline = auditDataByTenant[i].deadline.split(" ");
      let month_digit =
        "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(deadline[0]) / 3;
      var month = month_digit;
      var day = parseInt(deadline[1]) - 1;
      deadlineDataforCal[month][day] = "success";
    }
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12}>
        <Paper className={classes.paper}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Calendar
              fullscreen={false}
              dateCellRender={handleCellRender}
              onSelect={handleClickOpen}
              onPanelChange={onPanelChange}
            />
            <SimpleDialog
              open={open}
              onClose={handleClose}
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              auditData={auditData}
              instData={instData}
              outletData={outletData}
              setSelectedAudit={setSelectedAudit}
            />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

function SimpleDialog(props) {
  const classes = useStyles();
  const {
    onClose,
    open,
    selectedDay,
    selectedMonth,
    auditData,
    instData,
    outletData,
    setSelectedAudit,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth="sm"
      TransitionComponent={Transition}
    >
      <DialogTitle id="simple-dialog-title">
        {monthStr[selectedMonth]} {selectedDay}
      </DialogTitle>
      <Container minWidth="400">
        <RenderDialogList
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          auditData={auditData}
          instData={instData}
          outletData={outletData}
          setSelectedAudit={setSelectedAudit}
        />
      </Container>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function RenderDialogList(props) {
  const handleItemClick = (e) => {
    setSelectedAudit(e);
    console.log("Set");
  };

  const {
    selectedMonth,
    selectedDay,
    auditData,
    instData,
    outletData,
    setSelectedAudit,
  } = props;
  // console.log(auditData);
  var auditFiltered = [];
  for (var i = 0; i < auditData.length; i++) {
    var deadline = auditData[i].deadline.split(" ");
    let month_digit =
      "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(deadline[0]) / 3;
    var month = month_digit;
    var day = parseInt(deadline[1]);
    console.log(month, day);
    console.log(selectedMonth, selectedDay);
    console.log(auditData[i]);
    console.log("----");

    if (month == selectedMonth && day == selectedDay) {
      auditFiltered.push(auditData[i]);
    }
    // console.log(auditFiltered)
  }

  if (auditFiltered.length == 0) {
    return (
      <Typography
        variant="subtitle1"
        align="center"
        style={{ paddingBottom: 25 }}
      >
        No audit retification due on this day.
      </Typography>
    );
  } else {
    return (
      <List component="nav">
        {auditFiltered.map((item) => (
          <ListItem
            button
            divider={true}
            onClick={() => handleItemClick(item.id)}
          >
            <ListItemIcon>
              <ErrorOutlineIcon />
            </ListItemIcon>
            <Typography component="div">
              <Grid container direction="row">
                <Box fontWeight="fontWeightMedium" m={1}>
                  {
                    getOutletAndInstitute(
                      item.outlet_id,
                      instData,
                      outletData
                    )[0]
                  }
                  ,{" "}
                  {
                    getOutletAndInstitute(
                      item.outlet_id,
                      instData,
                      outletData
                    )[1]
                  }
                </Box>
                <Box fontWeight="fontWeightLight" fontStyle="normal" m={1}>
                  {item.type} Form
                </Box>
                <Box fontStyle="italic" m={1}>
                  {item.type == "COVID-19"
                    ? item.score + " NCs"
                    : "Score: " + item.score}
                </Box>
              </Grid>
            </Typography>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withRouter(CalendarView);
