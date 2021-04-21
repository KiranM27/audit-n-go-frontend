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
  getAudits,
  sortAudits,
} = require("../../helperfunctions/AuditProcessing.js");

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
      const data = await axios.get(`https://www.audit-n-go-backend.technopanther.com/audits/0`).then((res) => {
        console.log(res.data);
        setAuditData(getAudits(res.data));
      });
      const outletData = await axios.get(`https://www.audit-n-go-backend.technopanther.com/outlets/0`).then((res) => {
        const activeOutlets = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].active == true) {
            activeOutlets.push(res.data[i]);
          }
        }
        setOutletData(activeOutlets);
      });

      const institutionData = await axios
        .get(`https://www.audit-n-go-backend.technopanther.com/getInstitutions`)
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
        >
          
        </Typography>
        <SynchronisedChart data={ncData} color="#DB324D"/>
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
        >
          
        </Typography>
        <SynchronisedChart data={fbData} color="#36558F"/>
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
        >
          
        </Typography>
        <SynchronisedChart data={nfbData} color="#F4B860"/>
      </Grid>
    </Grid>
  );
}
function genDataforCharts(auditData, instData, outletData) {
  var current_user_id = JSON.parse(Cookies.get("loggedInUser")).userId;
  var filteredAuditData = sortAudits(auditData).filter(
    (child) => child.outlet_id == current_user_id
  );

  var ncData = filteredAuditData
    .filter((child) => child.type == "COVID-19")
    .map((audit) => ({ name: audit.date, qty: audit.NC }));
  var fbData = filteredAuditData
    .filter((child) => child.type == "F&B")
    .map((audit) => ({ name: audit.date, qty: audit.score }));
  var nfbData = filteredAuditData
    .filter((child) => child.type == "Non F&B")
    .map((audit) => ({ name: audit.date, qty: audit.score }));

  return [ncData.reverse(), fbData.reverse(), nfbData.reverse()];
}
