import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import { connect } from "react-redux";
import NotificationCard from "./NotificationCard";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    maxWidth: 400,
  },
  root_list: {
    width: "100%",
    // maxWidth: 350,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 16,
  },
  body: {
    fontSize: 16,
  },
}));

function NotificationCenterBody(props) {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    retrieveNotification();
  }, []);

  const retrieveNotification = () => {
    try {
<<<<<<< Updated upstream
        axios
          .get(`https://www.audit-n-go-backend.technopanther.com/getNotifications/${ props.loggedInUser.userId }`)
          .then(res => {
              console.log(res.data);
              setNotifications(res.data);
          });
    }catch(error){
=======
      axios
        .get(`/getNotifications/${props.loggedInUser.userId}`)
        .then((res) => {
          console.log(res.data);
          setNotifications(res.data);
        });
    } catch (error) {
>>>>>>> Stashed changes
      setNotifications([]);
    }
  };

  if (notifications.length === 0) {
    return (
      <div style={{ marginBottom: 0 }}>
        <Card className={classes.root}>
          <CardContent>
            <span style={{ justifyContent: "center", textAlign: "center" }}>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Notification Center
              </Typography>
            </span>
            <Divider />
            <span style={{ justifyContent: "center", textAlign: "center" }}>
              <Typography
                className={classes.body}
                color="textSecondary"
                gutterBottom
                style={{ paddingTop: 20 }}
              >
                YAY ! No new notifications
              </Typography>
            </span>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    return (
      <div style={{ marginBottom: -25 }}>
        <Card className={classes.root}>
          <CardContent>
            <span style={{ justifyContent: "center", textAlign: "center" }}>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Notification Center
              </Typography>
            </span>
            <List className={classes.root_list}>
              {notifications.map((notification) => (
                <NotificationCard
                  title={notification.title}
                  body={notification.body}
                  path={notification.path}
                  id={notification.notification_id}
                  handleClose={props.handleClose}
                />
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    loggedInUser: state.loggedInUser,
  };
};
export default connect(mapStateToProps)(NotificationCenterBody);
