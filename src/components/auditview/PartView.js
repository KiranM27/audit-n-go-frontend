import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import HelpTwoToneIcon from '@material-ui/icons/HelpTwoTone';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import Grid from "@material-ui/core/Grid";
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';

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

function makeData(id, item, image, status){
    return {id, item, image, status};
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
  

export default function Part(props){
    const classes = useStyles();
    var dataForAccordion = [];
    const [id, setId] = useState(null)
    const [part, setPart] = useState(null)
    const [editStatus, setEditStatus] = useState(false);
    const [editStatusArr, setEditStatusArr] = useState([]);
    const [statusArr, setStatusArr] = useState([]);
    const [originalStatusArr, setOriginalStatusArr] = useState([])
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleDropDownChange = (event, idx) => {
      var a = [10,20,30]
      var b = ["Status TBD", "Complied", "Not Complied"]
      for (var i = 0; i< b.length; i++){
        if (event.target.value === a[i]){
          let localStatusArr = [...statusArr];
          localStatusArr[idx] = b[i];
          setStatusArr(localStatusArr)
        }
      }
    };

    const handleSubmitButton = (itemDescription, idx) => {
      var newStatus = statusArr[idx]
      
      axios.post('https://www.audit-n-go-backend.technopanther.com/editstatus',{audit_id:id,newStatus:newStatus,part:part,item:itemDescription})
      .then(
        (res) => {
          if(res.status==200){
            alert('Status has been updated successfully!')
          }
        })

      setOriginalStatusArr(statusArr)
      setEditStatus(!editStatus);
      editStatusArr[idx] = !editStatusArr[idx];
      
    }

    useEffect(() => {console.log(statusArr)}, [statusArr]);
    useEffect(() => {console.log(originalStatusArr)}, [originalStatusArr]);

    const handleEditButtonClick = (props) =>{
      setStatusArr(originalStatusArr);
      setEditStatus(!editStatus);
      editStatusArr[props] = !editStatusArr[props];
    }

    useEffect(() => {
      var arr = new Array(props.checklist.length).fill(false);
      setEditStatusArr(arr);
      var arr2 = [];
      for (var i = 0; i < props.checklist.length; i++) {
        arr2.push(props.checklist[i]["status"]);
      }
      setStatusArr(arr2);
      setOriginalStatusArr(arr2)
      setId(props.id)
      setPart(props.part)
    }, [])

    console.log("props is ", props)
    for (var i = 0; i < props.checklist.length; i++) {
      var entry = makeData(
        i+1, 
        props.checklist[i]["checklist_item"],
        props.checklist[i]["images"],
        props.checklist[i]["status"])
      dataForAccordion.push(entry)
    }

    if (dataForAccordion.length == 0){
      return(
        <Typography component="div" align="center">
          <Box fontStyle="italic" m={1}>
            No non-compliance found.
          </Box>
        </Typography>
      )
    }else if (editStatusArr.length != 0 && statusArr.length != 0){
      // console.log(editStatusArr);
      // console.log(dataForAccordion);
      // console.log(statusArr);
    }else{
      return(
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress />
        </div>
      )
    }

    return (
        <React.Fragment>
            {dataForAccordion.map((data) => (
                <div className={classes.root} style={{paddingBottom: 10}}>
                <Accordion defaultExpanded={false}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                    >
                    <div className={classes.column}>
                        <Typography className={classes.heading}>{data.id}</Typography>
                    </div>
                    <div className={classes.column}>
                        <StatusIcon status={originalStatusArr[data.id-1]}/>
                    </div>
                    <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>{data.item}</Typography>
                    </div>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                    <div className={classes.column} />
                    <div>
                    <RenderImage imageArray={data.image}/>
                    </div>
                    </AccordionDetails>
                    <Divider />
                    <AccordionActions>
                      <RenderNormalStatusBar 
                        data={data} 
                        originalStatusArr={originalStatusArr}
                        editStatusArr={editStatusArr}
                        setEditStatusArr={setEditStatusArr}
                        statusArr={statusArr}
                        setStatusArr={setStatusArr}
                        handleEditButtonClick={handleEditButtonClick}
                        selectedStatus={selectedStatus}
                        handleDropDownChange={handleDropDownChange}
                        handleSubmitButton={handleSubmitButton}/>
                    </AccordionActions>
                </Accordion>
                </div>
            ))}
        </React.Fragment>
    )
}

function RenderImage(props){
  var classes = useStyles();
  if (props.imageArray.length == 0){
    return (
      <div className={classes.column}>
        <Typography className={classes.secondaryHeading} align="center">No image to be shown.</Typography>
      </div>
    )
  }else{
    return (
      <div className={classes.column}>
          <MediaCard imageURL={props.imageArray[0]}/>
      </div>
    )
  }
}

const download = (props) => {
  var element = document.createElement("a");
  var file = new Blob(
    [
      props.imageURL
    ],
    { type: "image/png" }
  );
  element.href = URL.createObjectURL(file);
  element.download = "image.png";
  element.click();
};

function MediaCard(props) {
  console.log(props.imageURL)
  console.log("props: ",props)
    const classes = useStyles();
    return (
      <Card className={classes.rootCard}>
        <CardActionArea onClick={() => console.log("Clicked")}>  
          <CardMedia
            className={classes.media}
            image={props.imageURL}
            
            title="Contemplative Reptile"
          />
        </CardActionArea>
        <CardActions>
        <a
        href={props.imageURL}
      >
      View
    </a>

        </CardActions>
      </Card>
    );
}

function StatusIcon(props){
  const classes = useStyles();

  if (props.status === "Complied"){
      return (
          <CheckCircleTwoToneIcon style={{ color: '#32a852' }}/>
      )
  }
  else if (props.status === "Status TBD"){
      return (
          <HelpTwoToneIcon style={{ color: '#93acad' }}/>
      )
  }else{
      return (
          <CancelTwoToneIcon style={{ color: '#d11d23' }}/>
      )
  }
}

function RenderNormalStatusBar(props){
  const classes = useStyles();
  const { 
    data, 
    originalStatusArr,
    editStatusArr, 
    setEditStatusArr,
    statusArr, 
    setStatusArr,
    handleEditButtonClick, 
    selectedStatus, 
    handleDropDownChange,
    handleSubmitButton } = props;

  const defaultDisplayValue = props => {
    var a = [10,20,30]
    var b = ["Status TBD", "Complied", "Not Complied"]
    for (var i = 0; i< b.length; i++){
      if (props === b[i]){
        return a[i];
      }
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6} align="left">
        {/* <Typography style={{paddingLeft:17}}>{data.status}</Typography> */}
        <FormControl className={classes.formControl} disabled={!editStatusArr[data.id-1]}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={defaultDisplayValue(statusArr[data.id - 1])}
            onChange={(e) => handleDropDownChange(e, data.id-1)}
          >
            <MenuItem value={10}>Status TBD</MenuItem>
            <MenuItem value={20}>Complied</MenuItem>
            <MenuItem value={30}>Not Complied</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={6} md={6} align="right">
        <Button disabled={!editStatusArr[data.id-1]} style = {{ textTransform: "None"}}
        onClick={() => handleSubmitButton(data.item, data.id-1)}>Submit</Button>
        <Button size="small" color="primary" style = {{ textTransform: "None"}}
        onClick={() => handleEditButtonClick(data.id-1)}>
          {`${editStatusArr[data.id-1] ? "CANCEL" : "EDIT"}`}
        </Button>
      </Grid>
    </Grid>
  )
}
