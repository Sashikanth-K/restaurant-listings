import { Grid } from "@material-ui/core";
import React, { Component, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { UserContext } from "../../UserProvider";
import axios from "axios";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import ApartmentCard from "./ApartmentCard";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const ApartmentList = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [restaurantList, setRestaurantList] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRestaurants = async () => {
    try {
      const params = {};

      params["sortBy"] = "averageRating:desc";
      params["limit"] = 50;

      if (userContext.userInfo && userContext.userInfo.role == "owner") {
        params["ownerId"] = userContext.userInfo.id;
      }
      let data = await axios.get("/apartments", {
        params: params,
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      });

      if (data && data.data && data.data.results) {
        setRestaurantList(data.data.results);
        setTotalResults(data.data.totalResults);
        setPage(data.data.page);
        setTotalPages(data.data.totalPages);
      } else {
        setErrorMessage(data.data.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (userContext.userInfo) {
      getRestaurants();
    }
  }, [userContext]);

  return (
    <div className={classes.root}>
      <Grid container direction="column" justify="space-between" spacing={3}>
        <Grid item>
          <Grid container justify="space-between" spacing={2}>
            <Grid item>Size</Grid>
            <Grid item>Price</Grid>
            <Grid item>Number of rooms</Grid>
            <Grid item>search</Grid>
          </Grid>
        </Grid>
        {restaurantList.map((item) => {
          return (
            <Grid item key={item.id}>
              <ApartmentCard data={item} />
            </Grid>
          );
        })}
        {restaurantList.map((item) => {
          return (
            <Grid item key={item.id}>
              <ApartmentCard data={item} />
            </Grid>
          );
        })}
        {restaurantList.map((item) => {
          return (
            <Grid item key={item.id}>
              <ApartmentCard data={item} />
            </Grid>
          );
        })}
        {restaurantList.map((item) => {
          return (
            <Grid item key={item.id}>
              <ApartmentCard data={item} />
            </Grid>
          );
        })}
        {restaurantList.map((item) => {
          return (
            <Grid item key={item.id}>
              <ApartmentCard data={item} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default ApartmentList;
