import React, { useCallback, useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
const { getAudits } = require("../helperfunctions/AuditProcessing.js");
const {
  genDataforPieChart,
} = require("../helperfunctions/DashboardChartFuncs.js");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(0),
    },
  },
}));

export default function PieChartDashboard(props) {
    const classes = useStyles();
    const themeTab = useTheme();
    const isSmallScreen = useMediaQuery(theme => themeTab.breakpoints.down("sm"));
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = useCallback(
      (_, index) => {
        setActiveIndex(index);
      },
      [setActiveIndex]
    );
    const chartProps = {
      width: isSmallScreen ? 400 : 400,
      height: isSmallScreen ? 200 : 250,
    };

    const pieProps = {
      cx: isSmallScreen ? "50%" : "50%",
      cy: isSmallScreen ? "50%" : "50%",
      outerRadius: isSmallScreen ? "55%" : "65%",
      innerRadius: isSmallScreen ? "35%" : "45%",
    }
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
      const data = await axios.get(`/audits/0`).then((res) => {
        // console.log(res.data)
        setAuditData(res.data);
      });
      const outletData = await axios.get(`/outlets/0`).then((res) => {
        const activeOutlets = [];
        console.log("res.data is", res.data);
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].active == true) {
            activeOutlets.push(res.data[i]);
          }
        }
        setOutletData(activeOutlets);
      });
      const instituionData = await axios.get(`/getInstitutions`).then((res) => {
        setInstData(res.data);
      });
    } catch (error) {
      setAuditData([]);
      setOutletData([]);
      setInstData([]);
    }
  };

  if (auditData.length != 0 && instData.length != 0 && outletData.length != 0) {
    var data = genDataforPieChart(getAudits(auditData), instData, outletData);
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <PieChart {...chartProps}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        {...pieProps}
        //   fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
        onClick={onPieClick}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLOURS[index % COLOURS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}

const COLOURS = [
  "#E63946",
  "#1D3557",
  "#58508D",
  "#BC5090",
  "#8C0E0F",
  "#FF6361",
  "#DBA858",
];

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
    value,
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
