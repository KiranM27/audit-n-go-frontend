import React from 'react';

// import 'antd/dist/antd.css';

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";
import NotificationCenter from './notificationCenter/NotificationCenter'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sectionTiny: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

const Navigator = props => {
  const classes = useStyles();
  const { history } = props;
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClick = (pageURL) => {
    history.push(pageURL);
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  function logoutFinally(){
    const refreshToken = localStorage.getItem("refreshToken")
    // console.log("INSIDE LOGOUT STUFF", refreshToken)
    Cookies.set('isLoggedIn', 0 , { expires: 2 })
    axios.post("api/logout",{token:refreshToken}).then(function (response) {
        // console.log("logout stuff",response);
        props.history.push('/')
        
        })
        .catch((err) => {
            console.log(err)
        })
  
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={() => setMobileMoreAnchorEl(null)}
    >
        <MenuItem onClick={() => handleMobileMenuClick('/dashboard')}>Dashboard</MenuItem>
        <MenuItem onClick={() => handleMobileMenuClick('/institutions')}>Institutions</MenuItem>
        <NotificationCenter />
        <MenuItem onClick={() => handleMobileMenuClick('/about')}>About</MenuItem>
        <MenuItem onClick={logoutFinally}>Logout</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.sectionDesktop}>
          <Button color="inherit" onClick={() => handleMobileMenuClick('/dashboard')}>
            <Typography className={classes.title} variant="h6" noWrap style = {{ color: "white"}}>
              Audit-n-Go
            </Typography>
          </Button>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={() => handleMobileMenuClick('/dashboard')}
                color="inherit"
              >
                <ChromeReaderModeIcon />
              </IconButton>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button color="inherit" onClick={() => handleMobileMenuClick('/dashboard')}>Dashboard</Button>
            <Button color="inherit" onClick={() => handleMobileMenuClick('/institutions')}>Institutions</Button>
            <NotificationCenter />
            <Button color="inherit" onClick={() => handleMobileMenuClick('/about')}>About</Button>
            <Button color="inherit" onClick={logoutFinally}>Logout</Button>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
}

export default withRouter(Navigator);