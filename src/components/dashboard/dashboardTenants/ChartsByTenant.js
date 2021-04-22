import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  CssBaseline,
  Typography,
  Paper,
  Grid,
  Container,
  useMediaQuery,
} from "@material-ui/core";
import SynchronisedChart from "./SynchronisedCharts";
import { makeStyles, useTheme } from "@material-ui/core/styles";
const {
  sortFullAuditData,
  getOutletAndInstitute,
  processAuditData,
} = require("../../helperfunctions/AuditDataClean.js");

export default function ChartsForTenant(props) {
  const [auditData, setAuditData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [instData, setInstData] = useState([]);
  const themeTab = useTheme();
  const isSmallScreen = useMediaQuery((theme) =>
    themeTab.breakpoints.down("sm")
  );

  useEffect(() => {
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const data = await axios.get(`/audits/0`).then((res) => {
        console.log(res.data);
        setAuditData(processAuditData(sortFullAuditData(res.data)));
      });
      const outletData = await axios.get(`/outlets/0`).then((res) => {
        const activeOutlets = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].active == true) {
            activeOutlets.push(res.data[i]);
          }
        }
        setOutletData(activeOutlets);
      });

      const institutionData = await axios
        .get(`/getInstitutions`)
        .then((res) => {
          setInstData(res.data);
        });
    } catch (error) {
      setAuditData([]);
      setOutletData([]);
      setInstData([]);
    }
  };
  const chartProps = {
    width: isSmallScreen ? 400 : 800,
    height: isSmallScreen ? 200 : 300,
  };

  if (auditData.length != 0 && instData.length != 0 && outletData.length != 0) {
    var data_barchart = genDataforCharts(auditData, instData, outletData);
    var ncData = data_barchart[0];
    var fbData = data_barchart[1];
    var nfbData = data_barchart[2];
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid>
        <Typography
          variant="subtitle2"
          align="center"
          style={{ textDecoration: "underline" }}
        >
          Non-Compliances
        </Typography>
        <Typography
          variant="body2"
          align="center"
          style={{ fontStyle: "italic" }}
        ></Typography>
        <SynchronisedChart data={ncData} color="#DB324D" dataKey="NCs"/>
      </Grid>
      <Grid>
        <Typography
          variant="subtitle2"
          align="center"
          style={{ textDecoration: "underline" }}
        >
          F&B Score
        </Typography>
        <Typography
          variant="body2"
          align="center"
          style={{ fontStyle: "italic" }}
        ></Typography>
        <SynchronisedChart data={fbData} color="#36558F" dataKey="Score"/>
      </Grid>
      <Grid>
        <Typography
          variant="subtitle2"
          align="center"
          style={{ textDecoration: "underline" }}
        >
          Non F&B Score
        </Typography>
        <Typography
          variant="body2"
          align="center"
          style={{ fontStyle: "italic" }}
        ></Typography>
        <SynchronisedChart data={nfbData} color="#F4B860" dataKey="Score"/>
      </Grid>
    </Grid>
  );
}
function genDataforCharts(auditData, instData, outletData) {
  var current_user_id = JSON.parse(Cookies.get("loggedInUser")).userId;
  var filteredAuditData = auditData.filter(
    (child) => child.outlet_id == current_user_id
  );

  var ncData = filteredAuditData
    .filter((child) => child.type == "COVID-19")
    .map((audit) => ({
      name: swapDayMonth(audit.date.slice(0, 6)),
      NCs: audit.score,
    }));
  var fbData = filteredAuditData
    .filter((child) => child.type == "F&B")
    .map((audit) => ({
      name: swapDayMonth(audit.date.slice(0, 6)),
      Score: audit.score,
    }));
  var nfbData = filteredAuditData
    .filter((child) => child.type == "Non F&B")
    .map((audit) => ({
      name: swapDayMonth(audit.date.slice(0, 6)),
      Score: audit.score,
    }));

  return [
    ncData.slice(0, getEndLength(ncData)).reverse(),
    fbData.slice(0, getEndLength(fbData)).reverse(),
    nfbData.slice(0, getEndLength(nfbData)).reverse(),
  ];
}

function getEndLength(arr) {
  return Math.min(arr.length, 5);
}

function swapDayMonth(str) {
  return str
    .split(" ")
    .reverse()
    .join(" ");
}
