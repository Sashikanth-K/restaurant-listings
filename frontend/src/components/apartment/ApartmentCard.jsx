import { Grid } from "@material-ui/core";
import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarIcon from "@material-ui/icons/Star";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: "100%",
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
  link: {
    textDecoration: "none",
  },
}));

const ApartmentCard = (props) => {
  const classes = useStyles();
  return (
    <Link to={`/apartments/${props.data.id}`} className={classes.link}>
      <Paper className={classes.root}>
        <Grid container direction="column">
          <Grid item>
            <Grid container justify="space-between">
              <Typography variant="h5" align="center" color="textSecondary">
                {props.data.name}
              </Typography>
              <Typography variant="h4" align="center" color="textSecondary">
                ${props.data.price}
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container justify="space-evenly">
              <Typography variant="subtitle1" color="textSecondary">
                {props.data.numberOfRooms}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {props.data.floorArea}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {props.data.name}
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container>
              <Typography variant="subtitle1" color="textSecondary">
                {props.data.description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  );
};

export default ApartmentCard;
