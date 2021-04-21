import React from "react";
import ChatBot from "react-simple-chatbot";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#34cce6",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#34cce6",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a"
};

const config = {
  width: "350px",
  height: "500px",
  floating: true,
  headerTitle: "Chat with Panther, the Chatbot"
};

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

function AIChatbot(props) {
  return (
    <ThemeProvider theme={theme} className={"h1 h2 h3 h4 h5 h6"}>
      <ChatBot
        steps={[
          {
            id: "intro",
            message: `Hey ${props.loggedInUser.username}, what are you looking for ?`,
            trigger: "intro-user"
          },
          {
            id: "intro-user",
            options: [
              {
                value: "y",
                label: "Create New Audit",
                trigger: "create-audit"
              },
              { value: "n", label: "View All Audits", trigger: "view-audits" }
            ]
          },
          {
            id: "create-audit",
            message: "You can create an audit by tapping on the below button",
            trigger: "create-audit-link",
            end: false
          },
          {
            id: "view-audits",
            message: "You can view the audits by clicking on the All Audits tab of the dashboard",
            trigger: "view-audits-link",
            end: false
          },
          {
            id: "create-audit-link",
            component: <RedirectButton url = "/auditInitialise" text = "New Audit !"/>,
            asMessage: true,
            end: true
          },
          {
            id: "view-audits-link",
            component: <RedirectButton url = "/dashboard" text = "Go to Dashboard !"/>,
            asMessage: true,
            end: true
          },
        ]}
        {...config}
      />
    </ThemeProvider>
  );
}

function RedirectButton(props) {
  const history = useHistory();
  const classes = useStyles();

  function buttonOnClick() {
    history.push(props.url);
  }
  return (
    <Button
      color="primary"
      onClick={buttonOnClick}
      style={{ textTransform: "None", color: "#fff" }}
    >
      { props.text }
    </Button>
  );
}

const mapStateToProps = function(state) {
  return {
    loggedInUser: state.loggedInUser
  };
};

export default connect(mapStateToProps)(AIChatbot);
