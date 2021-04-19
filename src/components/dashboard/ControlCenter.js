import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { CssBaseline, Typography, Paper, Grid, Container, Card } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';

const { Meta } = Card;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const CenteredGrid = props => {
  const classes = useStyles();
  const { history } = props;

    const handleCreateNewAudit = () => {
        history.push({
            pathname: '/auditInitialise'
        })
    }
    const handleViewAllAudit = () => {
        history.push({
            pathname: '/institutions'
        })
    }
    const handleCreateNewTenant = () => {
        history.push({
            pathname: '/addOutlet'
        })
    }
    const handleDeleteTenant = () => {
        history.push({
            pathname: '/deleteOutlet'
        })
    }


  return (
    <div className={classes.root}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
            <ControlCard 
                action="Create new audit" 
                handleFunc={handleCreateNewAudit} 
                imageURL="https://images.unsplash.com/photo-1554470938-85886688c6e6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2110&q=80"/>
        </Grid>
        <Grid item xs={12}  sm={6}>
            <ControlCard 
                action="View all audits" 
                handleFunc={handleViewAllAudit}
                imageURL="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"/>
        </Grid>
        <Grid item xs={12}  sm={6}>
            <ControlCard 
                action="Create a new tenant" 
                handleFunc={handleCreateNewTenant}
                imageURL="https://images.unsplash.com/photo-1590986201364-ce95ab280ca2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"/>
        </Grid>
        <Grid item xs={12}  sm={6}>
            <ControlCard 
                action="Delete a tenant" 
                handleFunc={handleDeleteTenant}
                imageURL="https://images.unsplash.com/photo-1595418130437-641018a1b248?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"/>
        </Grid>
      </Grid>
    </div>
  );
}

function ControlCard(props) {
    const classes = useStyles();
    const { action, handleFunc, imageURL } = props;

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => handleFunc() }>
        <CardMedia
          component="img"
          alt=""
          height="60"
          image={imageURL}
          title=""
        />
        <CardContent>
          <Typography gutterBottom variant="subtitle1" component="p" align="center">
              {action}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default withRouter(CenteredGrid)