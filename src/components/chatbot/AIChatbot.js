import React from "react";
import ChatBot from "react-simple-chatbot";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import './AIChatbot.css'

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
  width: "400px",
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
              { value: "n", label: "View All Audits", trigger: "view-audits" },
              {
                value: "mo",
                label: "Manage Objects",
                trigger: "manage-objects"
              }
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
            message:
              "You can view the audits by clicking on the All Audits tab of the dashboard",
            trigger: "view-audits-link",
            end: false
          },
          {
            id: "manage-objects",
            message: "Which of these actions would you like to perform ?",
            trigger: "manage-objects-options",
            end: false
          },
          {
            id: "create-audit-link",
            component: (
              <RedirectButton url="/auditInitialise" text="New Audit !" />
            ),
            asMessage: true,
            trigger: "next-steps",
            end: false
          },
          {
            id: "view-audits-link",
            component: (
              <RedirectButton url="/dashboard" text="Go to Dashboard !" />
            ),
            asMessage: true,
            trigger: "next-steps",
            end: false
          },
          {
            id: "manage-objects-options",
            options: [
              {
                value: "da",
                label: "Delete Audit",
                trigger: "delete-audit-text"
              },
              {
                value: "do",
                label: "Delete Outlet",
                trigger: "delete-outlet-text"
              },
              {
                value: "ao",
                label: "Add Outlet",
                trigger: "add-outlet-text"
              }
            ]
          },
          {
            id: "delete-audit-text",
            message:
              "You can delete an audit by opening the audit view page from the dashboard and clicking on Delete Audit",
            trigger: "delete-audit",
            end: false
          },
          {
            id: "delete-outlet-text",
            message:
              "The button below will take you to the page where you can delete outlets",
            trigger: "delete-outlet",
            end: false
          },
          {
            id: "add-outlet-text",
            message:
              "The button below will take you to the page where you can add outlets",
            trigger: "add-outlet",
            end: false
          },
          {
            id: "delete-audit",
            component: (
              <RedirectButton url="/dashboard" text="Go to Dashboard" />
            ),
            asMessage: true,
            trigger: "next-steps",
            end: false
          },
          {
            id: "delete-outlet",
            component: (
              <RedirectButton url="/deleteOutlet" text="Delete Outlet" />
            ),
            asMessage: true,
            trigger: "next-steps",
            end: false
          },
          {
            id: "add-outlet",
            component: <RedirectButton url="/addOutlet" text="Add Outlet" />,
            asMessage: true,
            trigger: "next-steps",
            end: false
          },
          {
            id: "next-steps",
            message: "Is there any thing I can help you with ?",
            trigger: "next-steps-options",
            end: false
          },
          {
            id: "next-steps-options",
            options: [
              {
                value: "y",
                label: "Yes",
                trigger: "reask-q"
              },
              { value: "n", label: "No", trigger: "end-convo" }
            ]
          },
          {
            id: "reask-q",
            message: "What can I help you with ?",
            trigger: "intro-user",
            end: false
          },
          {
            id: "end-convo",
            message: "Gald to be of help. Have a great day !",
            end: true
          }
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
      onClick={buttonOnClick}
      style={{ textTransform: "None", color: "#fff" }}
    >
      {props.text}
    </Button>
  );
}

const mapStateToProps = function(state) {
  return {
    loggedInUser: state.loggedInUser
  };
};

export default connect(mapStateToProps)(AIChatbot);
