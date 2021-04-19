import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import NotificationCenterBody from './NotificationCenterBody'
import { connect } from 'react-redux';
import axios from 'axios';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

function NotificationCenter(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  useEffect(() => {
    axios.get(`https://www.audit-n-go-backend.technopanther.com/getNotifications/${ props.loggedInUser.userId }`)
      .then(res => {
          console.log("notifications are", res.data, res.data.length);
          props.dispatch({ type: "setNoNotifications", noNotifications: res.data.length })
      }).catch(error => { console.log(error) })
    }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  if (props.isMobile) {
    return (
      <div>
        <div className={classes.root}>
          <IconButton color="inherit" onClick={handleClick}>
            <StyledBadge badgeContent={ props.noNotifications } color="secondary">
              <NotificationsIcon/>
            </StyledBadge>
          </IconButton>
        </div>
        <Popover
          id={id}
          open={ open }
          anchorEl={ anchorEl }
          onClose={ handleClose }
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
        >
          <NotificationCenterBody 
          handleClose = { handleClose }/>
        </Popover>
      </div>
    );
  }else{
    return (
      <div>
        <div className={classes.root}>
          <Badge badgeContent={ props.noNotifications } color="secondary">
            <Button aria-describedby={id} color="inherit" onClick={handleClick} style = {{ textTransform: "None"}}>
              Notifications
            </Button>
          </Badge>
        </div>
        <Popover
          id={id}
          open={ open }
          anchorEl={ anchorEl }
          onClose={ handleClose }
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
        >
          <NotificationCenterBody 
          handleClose = { handleClose }/>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
      loggedInUser: state.loggedInUser,
      noNotifications: state.noNotifications
  }
}
export default connect(mapStateToProps)(NotificationCenter);