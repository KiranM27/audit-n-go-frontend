import React, { PureComponent, useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

const { getAudits } = require('../helperfunctions/AuditProcessing.js');

export default function InstitutionBarChart(props) {
  const [auditData, setAuditData] = useState([]);
  const [outletData, setOutletData] = useState([]);
  const [instData, setInstData] = useState([]);
  const themeTab = useTheme();
  const isSmallScreen = useMediaQuery(theme => themeTab.breakpoints.down("sm"));

  useEffect(() => {
    retrieveData();
  }, []); 

  const retrieveData = async () => {
    try {
        const data = await axios
            .get(`https://www.audit-n-go-backend.technopanther.com/audits/0`)
            .then(res => {
                console.log(res.data)
                setAuditData(getAudits(res.data));
            });
        const outletData = await axios
            .get(`https://www.audit-n-go-backend.technopanther.com/outlets/0`)
            .then(res =>{
              const activeOutlets=[]
              for(var i=0;i<res.data.length;i++){
                if(res.data[i].active==true){
                  activeOutlets.push(res.data[i])
                }
              }
              setOutletData(activeOutlets);
            });
            
        const institutionData = await axios
            .get(`https://www.audit-n-go-backend.technopanther.com/getInstitutions`)
            .then(res =>{
                setInstData(res.data);
            });
    }catch(error){
        setAuditData([]);
        setOutletData([]);
        setInstData([]);
    }
  };
  const chartProps = {
    width: isSmallScreen ? 400 : 800,
    height: isSmallScreen ? 200 : 300,
  };

  if (auditData.length != 0 && instData.length != 0 && outletData.length != 0){
    var data_barchart = genDataforBarChart(auditData, instData, outletData, props.pieSelection);
  }else{
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <BarChart
      {...chartProps}
      data={data_barchart}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" tick={{fontSize: 11}} interval={0}/>
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="F&B" fill="#8884d8" />
      <Bar dataKey="Non F&B" fill="#82ca9d" />
    </BarChart>
  );
}

function genDataforBarChart(auditData, instData, outletData, pieSelection){
  console.log(auditData);
  var institution_id_radial = 0;

  for (var i = 0; i < instData.length; i++){
    if (instData[i].name == pieSelection){
      institution_id_radial = instData[i].institution_id;
    }
  }

  var NCbyOutlets = auditData.map(audit => ({numberNC:audit.numberNC, outlet_id:audit.outlet_id}));
  var outlet_id_inst_id = outletData.map(outlet => ({outlet_id:outlet.outlet_id, outlet_name:outlet.username, institution_id:outlet.institution_id}));
  var outlets_radial = outlet_id_inst_id.filter(child => (child.institution_id == institution_id_radial));

  var data_barchart = [];

  for (var j = 0; j < outlets_radial.length; j++){
    var latest_fb = getLatestFBAudit(auditData, outlets_radial[j].outlet_id)
    var latest_NonFB = getLatestNonFBAudit(auditData, outlets_radial[j].outlet_id)
    console.log(latest_fb)
    var score_fb = getScore(auditData, latest_fb)/96
    var score_nfb = getScore(auditData, latest_NonFB)/37
    data_barchart.push({"name":outlets_radial[j].outlet_name, "F&B":score_fb, "Non F&B":score_nfb})
  }
  console.log(data_barchart)
  return data_barchart
}

function getLatestFBAudit(auditData, outlet_id){
  var latest_audit_id = -1
  for (var i = 0; i < auditData.length; i++){
    if (auditData[i].outlet_id == outlet_id){
      if (auditData[i].type == "F&B"){
        if (auditData[i].id > latest_audit_id){
          latest_audit_id = auditData[i].id
        }
      }
    }
  }
  return latest_audit_id
}

function getLatestNonFBAudit(auditData, outlet_id){
  var latest_audit_id = -1
  for (var i = 0; i < auditData.length; i++){
    if (auditData[i].outlet_id == outlet_id){
      if (auditData[i].type == "Non F&B"){
        if (auditData[i].id > latest_audit_id){
          latest_audit_id = auditData[i].id
        }
      }
    }
  }
  return latest_audit_id
}

function getScore(auditData, audit_id){
  console.log(auditData)
  for (var i = 0; i<auditData.length; i++){
    if (auditData[i].id == audit_id){
      return auditData[i].score
    }
  }
  return 0;
}