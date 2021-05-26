import { Grid, Button, LinearProgress, Paper } from "@material-ui/core";
import React, { Component, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

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
import GeoLocationView from "../GeoLocationView";

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

  const [markers, setMarkers] = React.useState([
    {
      lat: props.data.location.coordinates[1],
      lng: props.data.location.coordinates[0],
    },
  ]);

  const center = {
    lat: props.data.location.coordinates[1],
    lng: props.data.location.coordinates[0],
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Grid container spacing={3}>
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

            <br />
            <br />

            <Grid item>
              <Grid container direction="column">
                <Typography variant="body1" color="textSecondary">
                  Associated Realtor --
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Name : {props.data.realtor.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Email : {props.data.realtor.email}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <br />
            <Chip
                label={"Availablity: " + (props.data.isRented ? "No" : "Yes")}
                disabled
                variant="outlined"
                size="small"
                color={!props.data.isRented ? "primary" : "secondary"}
              />
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body1" color="textSecondary">
              {props.data.description}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <GeoLocationView
          markers={[
            {
              lat: props.data.location.coordinates[1],
              lng: props.data.location.coordinates[0],
            },
          ]}
          center={center}
        />
      </Grid>
    </Grid>
  );
};

export default ApartmentDetails;
