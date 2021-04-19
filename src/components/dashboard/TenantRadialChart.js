import React, { PureComponent, useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
const { getAudits } = require('../helperfunctions/AuditProcessing.js');
const { genDataforRadialChart } = require('../helperfunctions/DashboardChartFuncs.js');

export default function TenantRadialChart(props) {
    const [auditData, setAuditData] = useState([]);
    const [outletData, setOutletData] = useState([]);
    const [instData, setInstData] = useState([]);
    const themeTab = useTheme();
    const isSmallScreen = useMediaQuery(theme => themeTab.breakpoints.down("sm"));

    useEffect(() => {
        retrieveData();
    }, []); 

    const chartProps = {
      width: isSmallScreen ? 400 : 400,
      height: isSmallScreen ? 185 : 250,
      cx: isSmallScreen ? "50%" : "50%",
      cy: isSmallScreen ? "50%" : "50%",
      outerRadius: isSmallScreen ? "80%" : "75%",
    };

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
        {...chartProps}
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
