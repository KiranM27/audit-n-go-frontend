import React, { PureComponent, useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CssBaseline, Typography, Paper, Grid, Container } from '@material-ui/core';
const { getAudits } = require('../helperfunctions/AuditProcessing.js');
const { genDataforRadialChart } = require('../helperfunctions/DashboardChartFuncs.js');

const data = [
  {
    subject: 'Math',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Chinese',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'English',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Geography',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Physics',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'History',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

export default function TenantRadialChart(props) {
    const [auditData, setAuditData] = useState([]);
    const [outletData, setOutletData] = useState([]);
    const [instData, setInstData] = useState([]);

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
                
            const instituionData = await axios
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

    if (auditData.length != 0 && instData.length != 0 && outletData.length != 0){
        var data_radial = genDataforRadialChart(auditData, instData, outletData, props.pieSelection);
        console.log(data_radial);
    }else{
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <CircularProgress />
            </div>
        )
    }



    return (
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="75%"
        width={400}
        height={250}
        data={data_radial}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="tenant" />
        <PolarRadiusAxis />
        <Radar
          name="Mike"
          dataKey="numberNC"
          stroke="#2F0601"
          fill="#26C485"
          fillOpacity={0.5}
        />
      </RadarChart>
    );
  }
