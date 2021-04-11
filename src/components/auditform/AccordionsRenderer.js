import React, { useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import metaData from "./AuditFormMetaData"
import { connect } from 'react-redux';
import RenderListItems from './RenderListItems'


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));  

function AccordionsRenderer(props) {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
      };
    
    let accordions = 
    <div className={classes.root}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography className={classes.heading}>Part 1</Typography>
            <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[0].partTitle}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <RenderListItems index = { 0 } />
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
            >
            <Typography className={classes.heading}>Part 2</Typography>
            <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[1].partTitle}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <RenderListItems index = { 1 } />
            </AccordionDetails>
        </Accordion>
    </div>

    if (props.params[2] === 'nf') {
        accordions = 
        <div className={classes.root}>  
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                >
                <Typography className={classes.heading}>Part 1</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[0].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 0 } />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
                >
                <Typography className={classes.heading}>Part 2</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[1].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 1 } />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
                >
                <Typography className={classes.heading}>Part 3</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[2].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 2 } />
                </AccordionDetails>
            </Accordion>
        </div>
    }
    else if (props.params[2] === 'fb') {
        accordions = 
        <div className={classes.root}>  
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                >
                <Typography className={classes.heading}>Part 1</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[0].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 0 } />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
                >
                <Typography className={classes.heading}>Part 2</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[1].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 1 } />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
                >
                <Typography className={classes.heading}>Part 3</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[2].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 2 } />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
                >
                <Typography className={classes.heading}>Part 4</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[3].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 3 } />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5bh-content"
                id="panel5bh-header"
                >
                <Typography className={classes.heading}>Part 5</Typography>
                <Typography className={classes.secondaryHeading}>{metaData[props.params[2]].partDetails[4].partTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <RenderListItems index = { 4 } />
                </AccordionDetails>
            </Accordion>
        </div>
    }

    return( accordions )
}

const mapStateToProps = function(state) {
    return {
        auditFormData: state.auditFormData,
    }
}
export default connect(mapStateToProps)(AccordionsRenderer);
