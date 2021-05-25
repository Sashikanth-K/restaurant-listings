import { Grid } from "@material-ui/core";
import React, { Component, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { UserContext } from "../../UserProvider";
import axios from "axios";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Pagination from "@material-ui/lab/Pagination";

import { TextField as MuTextField } from "@material-ui/core";
import ApartmentCard from "./ApartmentCard";
import Skeleton from "@material-ui/lab/Skeleton";
import GeoLocationList from "../GeoLocationList";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

function ApartmentCardSkelton() {
  return [...Array(10)].map((_, i) => {
    return (
      <div>
        <Skeleton variant="text" />
        <Skeleton variant="text" width={120} height={80} />
        <Skeleton variant="text" width={190} height={50} />
      </div>
    );
  });
}

const ApartmentList = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [restaurantList, setRestaurantList] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [floorArea, setFloorArea] = useState("");
  const [price, setPrice] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState("");

  const [isList, setIsList] = useState(true);

  const getRestaurants = async () => {
    try {
      const params = {};

      let x = floorArea ? (params["floorArea"] = floorArea) : null;
      let y = numberOfRooms ? (params["numberOfRooms"] = numberOfRooms) : null;
      let z = price ? (params["price"] = price) : null;

      setIsLoading(true);
      let data = await axios.get("/apartments", {
        params: params,
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000 * 1);

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

  const onChange = (e, page) => {
    setPage(page);
    getRestaurants({ page });
  };

  return (
    <div className={classes.root}>
      <Grid container direction="column" justify="space-between" spacing={3}>
        <Grid item>
          <Grid container justify="space-between">
            <Grid item>
              <MuTextField
                id="filled-basic"
                label="Size"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setFloorArea(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <MuTextField
                id="filled-basic"
                label="price"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <MuTextField
                id="filled-basic"
                label="# of rooms"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setNumberOfRooms(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                //disabled={isDialogOpen}
                disableElevation
                color="primary"
                onClick={() => {
                  getRestaurants();
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid
            container
            justify="space-between"
            spacing={2}
            alignItems="baseline"
          >
            <Grid item>
              <ButtonGroup
                disableElevation
                variant="outlined"
                color="default"
                size="small"
              >
                <Button
                  variant={isList ? "contained" : "outlined"}
                  onClick={(e) => {
                    setIsList(true);
                  }}
                >
                  List
                </Button>
                <Button
                  variant={!isList ? "contained" : "outlined"}
                  onClick={(e) => {
                    setIsList(false);
                  }}
                >
                  Map
                </Button>
              </ButtonGroup>
            </Grid>

            <Grid item>
              <Grid container justify="flex-end" alignItems="baseline">
                <Grid item>
                  <Typography variant="caption" display="block" gutterBottom>
                    {(page - 1) * 20 + 1} - {page * 20} of {totalResults}
                  </Typography>
                </Grid>
                <Grid item>
                  <Pagination
                    page={page}
                    count={totalPages}
                    onChange={onChange}
                    size="small"
                    boundaryCount={2}
                    shape="rounded"
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={2}
          >
            {isList ? (
              <React.Fragment>
                {isLoading ? (
                  <ApartmentCardSkelton></ApartmentCardSkelton>
                ) : (
                  <React.Fragment>
                    {restaurantList.map((item) => {
                      return (
                        <Grid item key={item.id}>
                          <ApartmentCard data={item} />
                        </Grid>
                      );
                    })}
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <GeoLocationList markers={restaurantList} />
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ApartmentList;
