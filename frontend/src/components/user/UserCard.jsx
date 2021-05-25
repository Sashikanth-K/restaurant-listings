import { Grid } from "@material-ui/core";
import React, { Component, useState, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarIcon from "@material-ui/icons/Star";
import { UserContext } from "../../UserProvider";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Chip from "@material-ui/core/Chip";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import userEvent from "@testing-library/user-event";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
  link: {
    textDecoration: "none",
  },
  dail: {
    width: "100vh",
  },
}));

const UserCard = (props) => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteUser = async () => {
    try {
      let data = await axios.delete(`/users/${props.data.id}`);

      props.getUsers();
    } catch (error) {
      props.getUsers();
    }
  };

  return (
    <Paper className={classes.root} elevation={1}>
      <Dialog
        //className={classes.dial}
        open={isDialogOpen}
        maxWidth="xl"
        onClose={() => {
          setIsDialogOpen(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill the form to Update user details
          </DialogContentText>

          <Formik
            initialValues={{
              email: props.data.email,
              password: props.data.password,
              name: props.data.name,
              role: props.data.role,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }

              if (!values.password) {
                errors.password = "Required";
              } else if (
                !(
                  values.password.match(/[a-z]/g) &&
                  values.password.match(/[A-Z]/g) &&
                  values.password.match(/[0-9]/g) &&
                  values.password.match(/[^a-zA-Z\d]/g) &&
                  values.password.length >= 8
                )
              ) {
                errors.password =
                  "Password must be minimum length 8. One uppercase, One lowercase, One digit.";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              let user = await axios.patch("/users/" + props.data.id, values);
              //   if (user && user.data) {
              //     //userContext.setDataInLocalStorage(user.data);
              //     //history.push("/");
              //     getUsers();
              //   }
              setIsDialogOpen(false);
              props.getUsers();
              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Field
                  component={TextField}
                  name="name"
                  //type="name"
                  fullWidth
                  label="Name"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  key="2344214"
                  component={TextField}
                  name="email"
                  disabled={true}
                  type="email"
                  fullWidth
                  label="Email"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  key="293852"
                  component={TextField}
                  type="password"
                  label="Password"
                  fullWidth
                  name="password"
                  variant="outlined"
                />
                <br />
                <br />
                <Field component={RadioGroup} name="role" key="3465342">
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    component="p"
                  >
                    Register as :
                  </Typography>
                  <FormControlLabel
                    value="admin"
                    control={<Radio disabled={isSubmitting} />}
                    label="Admin"
                    disabled={isSubmitting}
                  />
                  <FormControlLabel
                    value="realtor"
                    control={<Radio disabled={isSubmitting} />}
                    label="Realtor"
                    disabled={isSubmitting}
                  />
                  <FormControlLabel
                    value="user"
                    control={<Radio disabled={isSubmitting} />}
                    label="User"
                    disabled={isSubmitting}
                  />
                </Field>

                <br />
                {isSubmitting && <LinearProgress />}
                <br />
                <br />

                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                  fullWidth
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
            }}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete User?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.data ? "User Name : " + props.data.name : null}
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
            onClick={handleDeleteUser}
            color="secondary"
            variant="outlined"
            autoFocus
          >
            delete
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={0} justify="space-between" alignItems="center">
        <Grid item xs={10}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h6" color="textSecondary">
                {props.data.name}
              </Typography>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-between"
                spacing={1}
              >
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    {props.data.email}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    <Chip
                      label={"role : " + props.data.role}
                      disabled
                      size="small"
                    />
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container justify="space-between">
                    <Typography variant="subtitle1" color="textSecondary">
                      <Chip
                        label={"Email verified: " + props.data.isEmailVerified}
                        disabled
                        variant="outlined"
                        size="small"
                        color={
                          props.data.isEmailVerified ? "primary" : "secondary"
                        }
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {userContext.userInfo.role == "admin" ? (
          <Grid item>
            <Grid container direction="column">
              <Button
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                color="secondary"
                onClick={(e) => {
                  setIsDeleteDialogOpen(true);
                }}
              >
                delete
              </Button>
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Paper>
  );
};

export default UserCard;
