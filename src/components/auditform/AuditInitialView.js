import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  CssBaseline,
  Typography,
  Paper,
  Grid,
  Container,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import RestrictAccess from "../helperfunctions/RestrictAccess";
import AIChatbot from "../chatbot/AIChatbot";

function AuditInitialView(props) {
  RestrictAccess("/dashboardTenant");

  const [status, setStatus] = useState(0);

  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState(0);

  const [allOutlets, setAlloutlets] = useState([]);
  const [outletOptions, setOutletOptions] = useState([
    "Test Item 1",
    "Test Item 2",
  ]);
  const [selectedOutlet, setSelectedOutlet] = useState(0);

  const [selectedAuditType, setSelectedAuditType] = useState("");

  // useEffect for random is done so that componentDidMount can be simulated
  useEffect(() => {
    if (!localStorage.checkbox) {
      Cookies.set("isLoggedIn", 0);
    }
    axios.get(`https://www.audit-n-go-backend.technopanther.com/getInstitutions`).then((res) => {
      var insts = res.data;
      insts = getInstitutions(insts, "name", "institution_id");
      setInstitutionOptions(insts);
    });

    axios.get(`https://www.audit-n-go-backend.technopanther.com/outlets/0`).then((res) => {
      const outs = [];
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].active == true && res.data[i].admin==false) {
          outs.push(res.data[i]);
        }
      }
      console.log("outs is ", outs)
      var outletList = getOutlets(outs, "username", "outlet_id");
      setAlloutlets(outletList);
    });
  }, []);

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
    setOutletOptions(allOutlets[selectedInstitution]);
  }, [selectedInstitution]);

  if (institutionOptions.length == 0 && allOutlets.length == 0) {
    return (
      <Typography variant="h5" align="center">
        Loading...
      </Typography>
    );
  }
  const isLoggedIn = Cookies.get("isLoggedIn");

  return (
    <div>
      <AIChatbot />
      <CssBaseline />
      <main>
        <Container maxWidth="sm">
          <Typography
            variant="h6"
            align="center"
            color="textPrimary"
            gutterBottom
            style={{ paddingBottom: 0 }}
          >
            Create a new audit.
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textPrimary"
            gutterBottom
            style={{ paddingBottom: 20 }}
          >
            Select the institution and tenant to begin a new audit.
          </Typography>
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
            <Grid style={{ paddingBottom: 10 }}>
              <RenderOutletSelect
                status={status}
                outletOptions={outletOptions}
                setSelectedOutlet={setSelectedOutlet}
                setStatus={setStatus}
              />
            </Grid>
            <Grid style={{ paddingBottom: 10 }}>
              <RenderAuditTypeSelect
                status={status}
                setStatus={setStatus}
                selectedAuditType={selectedAuditType}
                setSelectedAuditType={setSelectedAuditType}
              />
            </Grid>
            <Grid container justify="center" style={{ paddingBottom: 10 }}>
              <RenderDatePicker status={status} dispatch={props.dispatch} />
            </Grid>
            <Grid container justify="center">
              <RenderButton
                status={status}
                selectedInstitution={selectedInstitution}
                selectedOutlet={selectedOutlet}
                selectedAuditType={selectedAuditType}
              />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

function RenderOutletSelect(props) {
  if (props.status === 1 || props.status === 2 || props.status === 3) {
    return (
      <Autocomplete
        id="combo-box-outlet"
        options={props.outletOptions}
        getOptionLabel={(option) => option.name}
        style={{ width: 300 }}
        onChange={(e, v) => {
          if (v != null) {
            props.setSelectedOutlet(v.value);
            props.setStatus(2);
          } else {
            props.setStatus(1);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Tenant" variant="outlined" />
        )}
      />
    );
  } else {
    return null;
  }
}

function RenderAuditTypeSelect(props) {
  const auditTypeOptions = [
    { name: "COVID Compliance", value: "cv" },
    { name: "Retail F&B", value: "fb" },
    { name: "Retail non-F&B", value: "nf" },
  ];

  if (props.status === 2 || props.status == 3) {
    return (
      <Autocomplete
        id="combo-box-audittype"
        options={auditTypeOptions}
        getOptionLabel={(option) => option.name}
        style={{ width: 300 }}
        onChange={(e, v) => {
          props.setSelectedAuditType(v.value);
          props.setStatus(3);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Audit type" variant="outlined" />
        )}
      />
    );
  } else {
    return null;
  }
}

function RenderDatePicker(props) {
  const [deadline, setDeadline] = useState(new Date());

  function handleDeadlineChange(date) {
    setDeadline(date);
    props.dispatch({ type: "setDeadline", deadline: date });
  }

  if (props.status === 3) {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Please select the Deadline"
          value={deadline}
          autoOk={true}
          onChange={handleDeadlineChange}
          KeyboardButtonProps={{ "aria-label": "change date" }}
        />
      </MuiPickersUtilsProvider>
    );
  } else {
    return null;
  }
}

function RenderButton(props) {
  const history = useHistory();

  const onClick = () => {
    const path = `/auditForm/${props.selectedInstitution}/${props.selectedOutlet}/${props.selectedAuditType}`;
    history.push(path);
  };
  if (
    props.status === 3 &&
    props.selectedInstitution != 0 &&
    props.selectedOutlet != 0 &&
    props.selectedAuditType != ""
  ) {
    return (
      <div>
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            style={{ textTransform: "None" }}
            onClick={onClick}
          >
            Begin Audit
          </Button>
        </ButtonGroup>
      </div>
    );
  } else {
    return (
      <div>
        <ButtonGroup>
          <Button
            variant="contained"
            color="secondary"
            style={{ textTransform: "None" }}
          >
            Please fill up all fields
          </Button>
        </ButtonGroup>
      </div>
    );
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

const mapStateToProps = function (state) {
  return {
    deadline: state.deadline,
  };
};
export default connect(mapStateToProps)(AuditInitialView);
