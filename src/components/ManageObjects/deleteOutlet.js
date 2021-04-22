import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  CssBaseline,
  Typography,
  Paper,
  Grid,
  Container,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TableAuditView from "../institutionview/TableAuditView";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import { Link, withRouter } from "react-router-dom";
import RestrictAccess from "../helperfunctions/RestrictAccess";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  container: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  selectSearchStyle: {
    justifyContent: "center",
    textAlign: "center",
  },
}));

export default function DeleteOutlet() {
  RestrictAccess("/dashboard");
  const [status, setStatus] = useState(0);
  const [random, setRandom] = useState(0);
  const [viewAll, setviewAll] = useState(false);
  const classes = useStyles();
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(0);
  const [allOutlets, setAlloutlets] = useState([]);
  const [outletOptions, setOutletOptions] = useState([
    "Test Item 1",
    "Test Item 2",
  ]);
  const [selectedOutlet, setSelectedOutlet] = useState(0);

  // useEffect for random is done so that componentDidMount can be simulated

  useEffect(() => {
    axios.get(`/getInstitutions`).then((res) => {
      var insts = res.data;
      insts = getInstitutions(insts, "name", "institution_id");
      setInstitutionOptions(insts);
    });

    axios.get(`/outlets/0`).then((res) => {
      const outs = []
      for(var i=0;i<res.data.length;i++){
          if(res.data[i].active==true){
            
              outs.push(res.data[i])
          }
      }
      console.log("outs is ",outs)
      var outletList = getOutlets(outs, "username", "outlet_id");
      setAlloutlets(outletList);
    });
  }, [random]);

  function onSubmit() {
    console.log("outlet_id is", selectedOutlet);

    axios.put("/outlet", { outlet_id: selectedOutlet }).then((res) => {
      if (res.status !== 201) {
        alert("Outlet not deleted! Please try again!");
      }else{
        alert("Outlet Deleted Successfully!")
      }
    });
  }

  const onInstitutionSelect = (e, v) => {
    if (v != null) {
      setSelectedInstitution(v.value);
      setStatus(0);
      setStatus(1);
    } else {
      setStatus(0);
    }
  };

  useEffect(() => {
    // setOutletOptions()
    setOutletOptions(allOutlets[selectedInstitution]);
  }, [selectedInstitution]);

  const isLoggedIn = Cookies.get("isLoggedIn");

  if (isLoggedIn == 0) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <CssBaseline />
      <main>
        <Container maxWidth="sm">
          <Typography
            variant="h6"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Delete outlets
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Select institution and outlet
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid style={{ paddingBottom: 10 }}>
                <Autocomplete
                  id="combo-box-institution"
                  options={institutionOptions}
                  getOptionLabel={(option) => option.name}
                  style={{ width: 300 }}
                  onChange={onInstitutionSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Institution"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid>
                <div style={{ paddingBottom: 20 }}>
                  <RenderOutletSelect
                    status={status}
                    outletOptions={outletOptions}
                    setSelectedOutlet={setSelectedOutlet}
                    setStatus={setStatus}
                    setviewAll={setviewAll}
                    onSubmit={onSubmit}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </Container>
      </main>
    </div>
  );
}

function RenderOutletSelect(props) {
  if (props.status === 1 || props.status === 2) {
    return (
      <div>
        <Autocomplete
          id="combo-box-outlet"
          options={props.outletOptions}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          onChange={(e, v) => {
            if (v != null) {
              props.setviewAll(false);
              props.setSelectedOutlet(v.value);
              props.setStatus(2);
            } else {
              props.setviewAll(false);
              props.setStatus(1);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Tenant" variant="outlined" />
          )}
        />
        <p></p>
        <Grid item>
          <Link to={"/dashboard"}>
            <Button
              variant="contained"
              color="secondary"
              onClick={props.onSubmit}
              style={{ textTransform: "None" }}
            >
              Delete outlet
            </Button>
          </Link>
        </Grid>
      </div>
    );
  } else {
    return null;
  }
}

function RenderTable(props) {
  if (props.viewAll === true) {
    return <TableAuditView selectedOutlet={0} />;
  } else if (
    props.status == 2 &&
    props.selectedInstitution != 0 &&
    props.selectedOutlet != 0
  ) {
    return <TableAuditView selectedOutlet={props.selectedOutlet} />;
  } else {
    return null;
  }
}

function getInstitutions(input, field1, field2) {
  var output = [];
  for (var i = 0; i < input.length; ++i) {
    var dict = {};
    dict["name"] = input[i][field1];
    dict["value"] = input[i][field2];
    output.push(dict);
  }
  return output;
}

function getOutlets(input, field1, field2) {
  var output = {};
  for (var i = 0; i < 20; i++) {
    output[i] = [];
  }
  for (var j = 0; j < input.length; ++j) {
    var dict = {};
    dict["name"] = input[j][field1];
    dict["value"] = input[j][field2];
    output[input[j].institution_id].push(dict);
  }
  return output;
}
