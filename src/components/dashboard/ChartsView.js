import React, {useState, useEffect} from 'react';
import IndivTenantChart from './IndivTenantChart';
import TenantRadialChart from './TenantRadialChart';
import InstitutionBarChart from './InstitutionBarChart';
import { CssBaseline, Typography, Paper, Grid, Container, useMediaQuery } from '@material-ui/core'

export default function AllCharts(props) {
    const {pieSelection, setPieSelection} = props;
    return(
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Grid>
                <Typography variant="h6" align="center" style={{textDecoration: "underline"}}>NCs by Institutions</Typography>
                <Typography variant="body2" align="center" style={{fontStyle: "italic"}}>Click on the pie to see the detailed breakdown.</Typography>
                <IndivTenantChart setPieSelection = { setPieSelection }/>
            </Grid>
            <Grid>
                <Typography variant="h6" align="center" style={{textDecoration: "underline"}}>{pieSelection}</Typography>
                <Typography variant="body2" align="center" style={{fontStyle: "italic"}}>NCs breakdown by all tenants in {pieSelection}</Typography>
                <TenantRadialChart pieSelection = { pieSelection }/>
            </Grid>
            <Grid>
                <Typography variant="h6" align="center" style={{textDecoration: "underline"}}>{pieSelection}</Typography>
                <Typography variant="body2" align="center" style={{fontStyle: "italic"}}>Score of latest F&B and Non F&B audits in {pieSelection}</Typography>
                <InstitutionBarChart  pieSelection = { pieSelection }/>
            </Grid>
        </Grid>
    )
}