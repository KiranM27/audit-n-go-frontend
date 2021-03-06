import React, { useState, useEffect } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { DataGrid } from "@material-ui/data-grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {
  CssBaseline,
  Typography,
  Paper,
  Grid,
  Container,
} from "@material-ui/core";
// import { getAudits, makeData, getOutletAndInstitute, sortAudits } from '../helperfunctions/AuditProcessing'

const columns = [
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 130,
  },
  {
    field: "type",
    headerName: "Type",
    type: "string",
    width: 130,
  },
  {
    field: "tenant",
    headerName: "Tenant",
    type: "string",
    width: 150,
  },
  {
    field: "institution",
    headerName: "Institution",
    type: "string",
    width: 130,
  },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 130,
  },
  {
    field: "NC",
    headerName: "NCs",
    type: "number",
    width: 110,
  },
  {
    field: "score",
    headerName: "Score",
    type: "number",
    width: 110,
  },
];

const rows = [{ id: 1, type: "No data", numberNC: 0, score: 0 }];

const { sortFullAuditData, getOutletAndInstitute, processAuditData } = require("../helperfunctions/AuditDataClean.js");

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const RecentAudits = (props) => {
  const classes = useStyles();

  const { history } = props;
  const handleMobileMenuClick = (pageURL) => {
    history.push(pageURL);
  };

  const [auditData, setAuditData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [instData, setInstData] = useState([]);

  useEffect(() => {
    retrieveData();
  }, []);

  // setOutletAudits(rows);

  const retrieveData = async () => {
    try {
      const data = await axios.get(`https://www.audit-n-go-backend.technopanther.com/audits/0`).then((res) => {
        console.log(res.data);
        setAuditData(res.data);
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

  if (auditData.length != 0 && instData.length != 0 && outletData.length != 0) {
    var latestAudits = processAuditData(sortFullAuditData(auditData)).slice(0,5);
    var dataForRecentAuditsTable = latestAudits.map((audit) => ({
      id: audit.id,
      date: audit.date,
      type: audit.type,
      NC: audit.type == "COVID-19" ? audit.score : "N/A",
      score: audit.type == "COVID-19" ? "N/A" : audit.score,
      tenant: getOutletAndInstitute(audit.outlet_id, instData, outletData)[0],
      institution: getOutletAndInstitute(audit.outlet_id, instData, outletData)[1],
    }));
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  if (true) {
    try {
      return (
        <div style={{ width: "100%" }}>
          <DataGrid
            autoHeight={true}
            rows={dataForRecentAuditsTable}
            columns={columns}
            pageSize={10}
            onRowClick={(e) =>
              history.push({
                pathname: "/auditDetail/" + e["id"],
              })
            }
            disableSelectionOnClick={true}
            disableExtendRowFullWidth={false}
          />
        </div>
      );
    } catch (error) {
      return (
        <div style={{ width: "100%" }}>
          <DataGrid
            autoHeight={true}
            rows={rows}
            columns={columns}
            pageSize={10}
            onRowClick={(e) => console.log(e)}
            disableSelectionOnClick={true}
            disableExtendRowFullWidth={false}
          />
        </div>
      );
    }
  }
};

export default withRouter(RecentAudits);
