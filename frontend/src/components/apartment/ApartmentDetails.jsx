import { Grid, Button, LinearProgress, Paper } from "@material-ui/core";
import React, { Component, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useHistory,
} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import StarIcon from "@material-ui/icons/Star";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
}));

const ApartmentDetails = (props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      //   justify="space-between"
      //   alignItems="center"
      spacing={3}
    >
      <Grid item>
        <Grid container  spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h5" color="textSecondary">
              Name : {props.data.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Floor Area : {props.data.floorArea}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Number of Rooms : {props.data.numberOfRooms}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Price : {props.data.price}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {new Date(props.data.createdAt).toDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="textSecondary">
              {props.data.description}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
          Map
      </Grid>
    </Grid>
  );
};

export default ApartmentDetails;
