import React, { PureComponent, useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import Cookies from "js-cookie";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function SynchronisedCharts(props) {
  const themeTab = useTheme();
  const isSmallScreen = useMediaQuery((theme) =>
    themeTab.breakpoints.down("sm")
  );

  const chartProps = {
    width: isSmallScreen ? 300 : 300,
    height: isSmallScreen ? 200 : 200,
  };

  return (
    <LineChart
      {...chartProps}
      data={props.data}
      margin={{
        top: 5,
        right: 50,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" tick={{fontSize: 12}} interval={0}/>
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="qty"
        stroke={props.color}
        strokeWidth={2.3}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}