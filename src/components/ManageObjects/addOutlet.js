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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
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

export default function AddOutlet() {
  RestrictAccess("/dashboard");
  const [status, setStatus] = useState(0);
  const [random, setRandom] = useState(0);
  const [viewAll, setviewAll] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [institution_name, setInstitutionName] = useState("");
  const history = useHistory();
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
    axios.get(`https://www.audit-n-go-backend.technopanther.com/getInstitutions`).then((res) => {
      var insts = res.data;
      insts = getInstitutions(insts, "name", "institution_id");
      setInstitutionOptions(insts);
    });

    axios.get(`https://www.audit-n-go-backend.technopanther.com/outlets/0`).then((res) => {
      const outs = [];
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].active == true) {
          outs.push(res.data[i]);
        }
      }

      var outletList = getOutlets(outs, "username", "outlet_id");
      setAlloutlets(outletList);
    });
  }, [random]);

  const onInstitutionSelect = (e, v) => {
    if (v != null) {
      setSelectedInstitution(v.value);
      setStatus(0);
      setStatus(1);
    } else {
      setStatus(0);
    }
  };

  async function onSubmit() {
    let temp_password = Math.random().toString(36).substring(10);
    console.log("random ", temp_password);

    axios
      .post("https://www.audit-n-go-backend.technopanther.com/outlet", {
        username: username,
        email: email,
        password: temp_password,
        institution_id: selectedInstitution,
      })
      .then((res) => {
        alert("An email has been sent to you containing login instructions!")
        if (res.status !== 201) {
          alert("Outlet not added! Please try again!");
        }
      });

      await axios
      .post("https://www.audit-n-go-backend.technopanther.com/sendOutletMail", {
        email: email
      })
      .then((res) => {
        console.log("Mail is sending hahaha")
        if (res.status !== 200) {
          alert("Mail not sent! Something went wrong!");
        }
      });

      history.push('/dashboard')
  }

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
          <div styles={{ align: "left" }}>
            <Typography
              variant="h5"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Add outlets by institutions
            </Typography>
            <p></p>

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

                  <div style={{ paddingBottom: 20 }}>
                    <RenderOutletSelect
                      status={status}
                      setUsername={setUsername}
                      onSubmit={onSubmit}
                      setEmail={setEmail}
                      username={username}
                      email={email}
                    ></RenderOutletSelect>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Container>
        <Container maxWidth="md">
          <RenderTable
            status={status}
            viewAll={viewAll}
            selectedInstitution={selectedInstitution}
            selectedOutlet={selectedOutlet}
          />
        </Container>
      </main>
    </div>
  );
}

function RenderOutletSelect(props) {
  if (props.status === 1 || props.status === 2) {
    return (
      <div styles={{ align: "center" }}>
        <Grid container spacing={2} justify="center">
          <Grid style={{ paddingBottom: 10 }}>
            <p></p>
            <p></p>
            <h3 class="form-title">Create new outlet</h3>
            <form>
              <TextField
                style={{ width: 300 }}
                required
                id="outlined-basic"
                label="Name"
                variant="outlined"
                placeholder="Name"
                value={props.username}
                onChange={(e) => props.setUsername(e.target.value)}
              />
              <p></p>
              <TextField
                style={{ width: 300 }}
                required
                id="outlined-basic"
                variant="outlined"
                label="Email"
                placeholder="Email"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
              />
            </form>
            <p></p>

              <Button
                variant="contained"
                color="primary"
                onClick={props.onSubmit}
                style={{ textTransform: "none" }}
              >
                Create outlet
              </Button>
          </Grid>
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
