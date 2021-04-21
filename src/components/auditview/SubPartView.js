import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionActions from "@material-ui/core/AccordionActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import CheckCircleTwoToneIcon from "@material-ui/icons/CheckCircleTwoTone";
import HelpTwoToneIcon from "@material-ui/icons/HelpTwoTone";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import TrendingUpTwoToneIcon from '@material-ui/icons/TrendingUpTwoTone';
import TrendingDownTwoToneIcon from '@material-ui/icons/TrendingDownTwoTone';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MediaCard from "./MediaCard";
import { useParams } from "react-router";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  column: {
    flexBasis: "%",
    paddingRight: 10,
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  media: {
    height: 140,
  },
  appBar: {
    position: "relative",
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function GetParams() {
  let { audit_id } = useParams();
  return audit_id;
}

export default function SubPartView(props) {
  const classes = useStyles();
  const [editable, setEditable] = useState(false);
  const [actualStatus, setActualStatus] = useState(props.item.status);
  const [localStatus, setLocalStatus] = useState(props.item.status);
  const audit_id = GetParams();

  // This is to ensure that the API for updating the status in the databse is called only when the
  // user chnages the state and not when all of the components are loaded
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("actualStatus has changed ", actualStatus);
    let localChecklistResults = [...props.checklistResults];
    localChecklistResults[props.item.part - 1][props.item.SNo - 1].status = actualStatus;
    props.setChecklistResults(localChecklistResults);
    if (count != 0) {
      axios
        .post("/editstatus", {
          audit_id: audit_id,
          newStatus: actualStatus,
          part: props.item.part,
          item: props.item.checklist_item
        })
        .then((res) => {
          if (res.status == 200) {
            console.log("status updated")
          }
        });
    }
    setCount(count + 1);
  }, [actualStatus]);

  return (
    <div className={classes.root} style={{ paddingBottom: 5 }}>
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>
              {props.item.SNo}
            </Typography>
          </div>
          <div className={classes.column}>
            <StatusIconRenderer status={props.item.status} auditType = { props.auditType } item = {props.item}/>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              {props.item.checklist_item}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <div className={classes.column} />
          <ImageRenderer images={props.item.images} />
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <StatusDropdown
            editable={editable}
            actualStatus={actualStatus}
            localStatus={localStatus}
            setLocalStatus={setLocalStatus}
            audit_type={props.auditType}
            item={props.item}
          />
          <ActionsButtonsRenderer
            editable={editable}
            setEditable={setEditable}
            actualStatus={actualStatus}
            setActualStatus={setActualStatus}
            localStatus={localStatus}
            setLocalStatus={setLocalStatus}
            audit_type={props.auditType}
          />
        </AccordionActions>
      </Accordion>
    </div>
  );
}

function ImageRenderer(props) {
  const classes = useStyles();
  if (props.images.length <= 0) {
    return (
      <div className={classes.column}>
        <Typography className={classes.secondaryHeading} align="center">
          No image to be shown.
        </Typography>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex" }}>
        {props.images.map((imageUrl) => (
          <MediaCard imageUrl={imageUrl} />
        ))}
      </div>
    );
  }
}

function StatusIconRenderer(props) {
  if (props.auditType === "Covid Compliance") {
    if (props.status === "Complied") {
      return <CheckCircleTwoToneIcon style={{ color: "#32a852" }} />;
    } else if (props.status === "Not Complied") {
      return <CancelTwoToneIcon style={{ color: "#d11d23" }} />;
    } else {
      return <HelpTwoToneIcon style={{ color: "#93acad" }} />;
    }
  } else {
    if (props.item.score > 0.5) {
      return <TrendingUpTwoToneIcon style={{ color: "#32a852" }} />;
    }
    else {
      return <TrendingDownTwoToneIcon style={{ color: "#d11d23" }} />;
    }
  }
}

function StatusDropdown(props) {
  const classes = useStyles();
  const [status, setStatus] = useState(
    props.actualStatus === "Status TBD"
      ? 10
      : props.actualStatus === "Complied"
      ? 20
      : 30
  );

  const handleChange = (event) => {
    props.setLocalStatus(
      event.target.value === 10
        ? "Status TBD"
        : event.target.value === 20
        ? "Complied"
        : "Not Complied"
    );
  };

  useEffect(() => {
    setStatus(
      props.localStatus === "Status TBD"
        ? 10
        : props.localStatus === "Complied"
        ? 20
        : 30
    );
  }, [props.localStatus]);

  return (
    <div>
      <FormControl className={classes.formControl} disabled={!props.editable}>
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          onChange={handleChange}
        >
          <MenuItem value={10}> Status TBD </MenuItem>
          <MenuItem value={20}> Complied </MenuItem>
          <MenuItem value={30}> Not Complied </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function ActionsButtonsRenderer(props) {
  function handleEditButtonClick() {
    props.setEditable(!props.editable);
  }

  function handleCancelClick() {
    props.setEditable(false);
    props.setLocalStatus(props.actualStatus);
  }

  function handleSubmitClick() {
    props.setActualStatus(props.localStatus);
    props.setEditable(false);
  }

  if (!props.editable) {
    return (
      <div>
        <Button disabled style={{ textTransform: "None" }}>
          {" "}
          Submit{" "}
        </Button>
        <Button
          color="primary"
          style={{ textTransform: "None" }}
          onClick={handleEditButtonClick}
        >
          {" "}
          Edit{" "}
        </Button>
      </div>
    );
  } else {
    if (props.localStatus === props.actualStatus) {
      return (
        <div>
          <Button disabled color="secondary" style={{ textTransform: "None" }}>
            {" "}
            Submit{" "}
          </Button>
          <Button
            color="primary"
            style={{ textTransform: "None" }}
            onClick={handleEditButtonClick}
          >
            {" "}
            Cancel{" "}
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            color="secondary"
            style={{ textTransform: "None" }}
            onClick={handleSubmitClick}
          >
            {" "}
            Submit{" "}
          </Button>
          <Button
            color="primary"
            style={{ textTransform: "None" }}
            onClick={handleCancelClick}
          >
            {" "}
            Cancel{" "}
          </Button>
        </div>
      );
    }
  }
}
