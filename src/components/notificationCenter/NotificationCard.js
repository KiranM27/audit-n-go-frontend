import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';

import purpleDot from '../../assets/images/purpleDot.png'
import notificationSymbol from '../../assets/images/notificationSymbol.png'

import { useHistory } from "react-router-dom";


const useStyles = makeStyles(() => ({
  inline: {
    display: 'inline',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function NotificationCard( props ) {

  const classes = useStyles();
  const history = useHistory()  

  function handleBellClick() {  
    if (props.path !=  null) {
        history.push( props.path )
        props.handleClose() 
        }
    } 

  return (
    <div> 
      <Divider />
      <ListItem alignItems="flex-start" onClick = { handleBellClick }>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src = { notificationSymbol } />
        </ListItemAvatar>
        <ListItemText
          // primary = { props.title }
          secondary={
            <div>
              <Typography
                // component="span"
                variant="body2"
                className = { classes.inline }
                color="textPrimary"
              >
                { props.title } <br/> { props.body }
              </Typography>
          </div>
          }
        />
      </ListItem>
    </div>
  );
}