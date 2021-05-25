import { Grid, Button, LinearProgress, Paper } from "@material-ui/core";
import React, { Component, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../../UserProvider";
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
import ApartmentDetails from "./ApartmentDetails";
import ApartmentEditForm from "./ApartmentsEditForm";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
}));

const ApartmentView = () => {
  const { apartmentId } = useParams();
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const history = useHistory();
  const [apartmentData, setApartmentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteApartment = async () => {
    try {
      let data = await axios.delete(`/apartments/${apartmentId}`);

      if (data && data.status == 204) {
        history.push("/");
      }
    } catch (error) {
      setIsDeleteDialogOpen(false);
    }
  };

  const getApartment = async () => {
    try {
      const params = {};

      if (userContext.userInfo && userContext.userInfo.role == "owner") {
        params["ownerId"] = userContext.userInfo.id;
      }
      let data = await axios.get(`/apartments/${apartmentId}`, {
        params: params,
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      });

      if (data && data.data) {
        setApartmentData(data.data);
      } else {
        setErrorMessage(data.data.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (userContext.userInfo) {
      getApartment();
    }
  }, [userContext]);

  return (
    <div className={classes.root}>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this apartment?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {apartmentData ? "Apartment Name : " + apartmentData.name : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDeleteDialogOpen(false);
            }}
            color="primary"
          >
            cancel
          </Button>
          <Button
            onClick={handleDeleteApartment}
            color="secondary"
            variant="outlined"
            autoFocus
          >
            delete
          </Button>
        </DialogActions>
      </Dialog>
      {apartmentData ? (
        <Grid container direction="column" spacing={4} alignItems="stretch">
          {userContext.userInfo && userContext.userInfo.role != "user" ? (
            <Grid item>
              <Grid container justify="flex-end" spacing={1}>
                {isEditing ? (
                  <Button
                    variant="outlined"
                    //disabled={isEditing}
                    color="primary"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Back
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    disabled={isEditing}
                    color="primary"
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                )}

                {!isEditing && (
                  <Button
                    color="secondary"
                    onClick={(e) => {
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Grid>
            </Grid>
          ) : null}

          <Grid item>
            {isEditing ? (
              <ApartmentEditForm
                data={apartmentData}
                setData={setApartmentData}
                finishEdit={(e) => {
                  setIsEditing(false);
                }}
              />
            ) : (
              <ApartmentDetails data={apartmentData} />
            )}
          </Grid>
        </Grid>
      ) : (
        <h6>Unable to retreive data currently....</h6>
      )}
    </div>
  );
};

export default ApartmentView;
