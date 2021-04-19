import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import HelpTwoToneIcon from '@material-ui/icons/HelpTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import Grid from "@material-ui/core/Grid";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MediaCard from './MediaCard';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    rootCard: {
      maxWidth: 345,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },
    column: {
      flexBasis: '%',
      paddingRight: 10,
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    media: {
      height: 140,
    },
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

export default function SubPartView(props) {
  const classes = useStyles();

  return (
    <div className={classes.root} style = {{ paddingBottom: 5}}>
        <Accordion defaultExpanded = { false }>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
            >
            <div className={classes.column}>
                <Typography className={classes.heading}>{props.item.SNo}</Typography>
            </div>
            <div className={classes.column}>
                <StatusIconRenderer status={ props.item.status }/>
            </div>
            <div className={classes.column}>
                <Typography className={classes.secondaryHeading}>{props.item.checklist_item}</Typography>
            </div> 

        </AccordionSummary>
        <AccordionDetails className={classes.details}>
            <div className={classes.column} />
            < MediaCard imageUrl = { "https://source.unsplash.com/random" } />
        </AccordionDetails>
        <Divider />
        <AccordionActions>
            <Button size="small"> Cancel </Button>
            <Button size="small" color="primary">
                Edit
            </Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}

function StatusIconRenderer (props) {
    if (props.status === "Complied") {
        return <CheckCircleTwoToneIcon style={{ color: '#32a852' }}/>;
    } else if (props.status === "Not Complied") {
        return <CancelTwoToneIcon style={{ color: '#d11d23' }}/>
    } else {
        return <HelpTwoToneIcon style={{ color: '#93acad' }}/>
    }
}

