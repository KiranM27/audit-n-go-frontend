import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    maxWidth: 300,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

function RenderCard(props){
    const classes = useStyles();
    const themeAbout = useTheme();
    const isSmallScreen = useMediaQuery(theme => themeAbout.breakpoints.down("sm"));

    return (
        <Card className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h5" variant="h5">
                {props.name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {props.hobby}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <IconButton aria-label="Insta" onClick={() => window.location.assign(props.instaURL)}>
                <InstagramIcon/>
              </IconButton>
              <IconButton aria-label="GitHub" onClick={() => window.location.assign(props.githubURL)}>
                <GitHubIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" onClick={() => window.location.assign(props.linkedinURL)}>
                <LinkedInIcon/>
              </IconButton>
            </div>
          </div>
          <CardMedia
            className={classes.cover}
            image={props.imageURL}
            title="Live from space album cover"
          />
        </Card>
    );

}

export default function MediaControlCard() {
  return (
      <div>
          <Container maxWidth="lg" align="center">
              <Typography variant="h6" align="center">
                  SUTD 50.003 ESC Singhealth Project
              </Typography>
              <Typography variant="subtitle1" align="center" style={{paddingBottom: 15}}>
                  Done by
              </Typography>
            <Grid container spacing={2} justify="center" style={{paddingBottom:15}}>
                <Grid item xs={12} lg={3}>
                    <RenderCard 
                        name="Kiran" 
                        imageURL="https://audit-n-go-bucket.s3-ap-southeast-1.amazonaws.com/Kiran+DJ.JPG" 
                        hobby="Football"
                        instaURL="https://www.instagram.com/kiran_mohan_b/"
                        githubURL="https://github.com/KiranM27"
                        linkedinURL="https://www.linkedin.com/in/kiranm27/"/>
                </Grid>
                <Grid item xs={12} lg={3}>
                    <RenderCard
                        name="Shuyi" 
                        imageURL="https://audit-n-go-bucket.s3-ap-southeast-1.amazonaws.com/IMG_9583.JPG" 
                        hobby="Basketball"
                        instaURL="https://www.instagram.com/jsy_owl"
                        githubURL="https://github.com/shuyijia"
                        linkedinURL="https://www.linkedin.com/"
                        />
                </Grid>
                <Grid item xs={12} lg={3}>
                    <RenderCard 
                        name="Anirudh" 
                        imageURL="https://audit-n-go-bucket.s3-ap-southeast-1.amazonaws.com/Anirudh_pic+(2).jpg" 
                        hobby="Chess"
                        instaURL="https://www.instagram.com/anirudh_shrinivason/"
                        githubURL="https://github.com/Anirudh181001"
                        linkedinURL="https://www.linkedin.com/in/anirudh-shrinivason"/>
                </Grid>
            </Grid>
          </Container>
      </div>
  )
}
