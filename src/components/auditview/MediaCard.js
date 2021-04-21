import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "../auditform/formstyle.css";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function MediaCard(props) {
  const classes = useStyles();

  return (
    <div style={{ padding: 5 }}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="The uploaded image can't be displayed"
            height="140"
            image={props.imageUrl}
            title="Uploaded Image"
          />
        </CardActionArea>
      </Card>
    </div>
  );
}
