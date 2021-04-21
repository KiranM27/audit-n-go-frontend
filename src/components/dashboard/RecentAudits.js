import React, {useState, useEffect} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CssBaseline, Typography, Paper, Grid, Container } from '@material-ui/core'
// import { getAudits, makeData, getOutletAndInstitute, sortAudits } from '../helperfunctions/AuditProcessing'

const columns = [
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 130,
  },
  {
    field: 'tenant',
    headerName: 'Tenant',
    type: 'string',
    width: 150,
  },
  {
    field: 'institution',
    headerName: 'Institution',
    type: 'string',
    width: 130,
  },
  {
    field: 'date',
    headerName: 'Date',
    type: 'date',
    width: 130,
  },
  {
    field: 'NC',
    headerName: 'NCs',
    type: 'number',
    width: 110,
  },
  {
    field: 'score',
    headerName: 'Score',
    type: 'number',
    width: 110,
  },
];

const rows = [
  { id: 1, type: 'No data', numberNC:0, score:0 },
];

const { getAudits, makeData, getOutletAndInstitute, sortAudits } = require('../helperfunctions/AuditProcessing.js')

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const RecentAudits = props => {
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
          const data = await axios
              .get(`/audits/0`)
              .then(res => {
                  console.log(res.data)
                  setAuditData(getAudits(res.data));
              });
          const outletData = await axios
              .get(`/outlets/0`)
              .then(res =>{
                setOutletData(res.data);
              });
          const instituionData = await axios
              .get(`/getInstitutions`)
              .then(res =>{
                setInstData(res.data);
              });
      }catch(error){
          setAuditData([]);
          setOutletData([]);
          setInstData([]);
      }
  };

  if (auditData.length != 0 && instData.length != 0 && outletData.length != 0){

    var latestAudits = sortAudits(auditData).slice(0,5);
    var dataForTable = [];

    console.log(instData)
    console.log(outletData)

    for (var i = 0; i < latestAudits.length; i++){
      console.log(latestAudits[i]["outlet_id"])
      
      var OutletandInstitute = getOutletAndInstitute(latestAudits[i]["outlet_id"], instData, outletData);
      var tenantName = OutletandInstitute[0];
      var instName = OutletandInstitute[1];

      // id, date, tenant, institution, NC, score
      var id = latestAudits[i]["id"];
      var date = latestAudits[i]["date"];
      var no_NC = latestAudits[i]["NC"];
      var score = latestAudits[i]["score"]
      
      var table_row = makeData(id, date, tenantName, instName, no_NC, score);
      dataForTable.push(table_row);
    }
    
    console.log(dataForTable);

  }else{
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress />
      </div>
    )
  }

  if (true){
    try {
      return (
          <div style={{ width: '100%' }}>
              <DataGrid 
                  autoHeight={true} 
                  rows={dataForTable} 
                  columns={columns} 
                  pageSize={10} 
                  onRowClick={(e) => history.push({
                      pathname: '/auditDetail/' + e['id']
                  })}
                  disableSelectionOnClick={true}
                  disableExtendRowFullWidth={false}/>
          </div>
      );
      }catch(error){
          return (
              <div style={{ width: '100%' }}>
                  <DataGrid 
                      autoHeight={true} 
                      rows={rows} 
                      columns={columns} 
                      pageSize={10} 
                      onRowClick={(e) => console.log(e)}
                      disableSelectionOnClick={true}
                      disableExtendRowFullWidth={false}/>
              </div>
          );
      }
  }
}

export default withRouter(RecentAudits)