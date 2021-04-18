import React, { useCallback, useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
const { getAudits } = require('../helperfunctions/AuditProcessing.js');
const { genDataforPieChart } = require('../helperfunctions/DashboardChartFuncs.js')

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(0),
      },
    },
}));

export default function PieChartDashboard(props) {
    const classes = useStyles();
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback(
      (_, index) => {
        setActiveIndex(index);
      },
      [setActiveIndex]
    );
    const onPieClick = useCallback(
        (_, index) => {
          props.setPieSelection(data[index].name);
        }
    );
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
                    // console.log(res.data)
                    setAuditData(getAudits(res.data));
                });
            const outletData = await axios
                .get(`https://www.audit-n-go-backend.technopanther.com/outlets/0`)
                .then(res =>{
                    setOutletData(res.data);
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
        console.log(auditData)
        console.log(instData)
        console.log(outletData)

        var data = genDataforPieChart(auditData, instData, outletData);

        console.log(data);
    }else{
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <CircularProgress />
            </div>
        )
    }
    
    return (
      <PieChart width={400} height={250}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="45%"
          innerRadius="45%"
          outerRadius="75%"
        //   fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
          onClick = {onPieClick}
        >
        {data.map((entry,index) => 
        <Cell key={`cell-${index}`} fill={COLOURS[index % COLOURS.length]} />)} 
        </Pie>
      </PieChart>
    );
}

const COLOURS = ["#E63946", "#1D3557", "#58508D", "#BC5090", "#8C0E0F", "#FF6361", "#DBA858"];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
};