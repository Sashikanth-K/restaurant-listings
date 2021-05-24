import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Formik, Form, Field } from "formik";

import { TextField } from "formik-material-ui";

import { UserContext } from "../UserProvider";
import MessageCard from "./MessageCard";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const history = useHistory();
  const [message, setMessage] = useState(null);
  const [level, setLevel] = useState("primary");

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {message ? (
          <MessageCard
            content={message}
            handleDelete={() => {
              setMessage(null);
            }}
            level={level}
          />
        ) : null}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <div className={classes.form}>
          <Formik
            initialValues={{
              email: "",
              password: "",
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
                  "Password must be minimum length 8. One uppercas, One lowercase, One digit.";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                let user = await axios.post("/auth/login", values);
                if (user && user.data) {
                  userContext.setDataInLocalStorage(user.data);
                  history.push("/");
                }
              } catch (error) {
                if (error.response) {
                  // Request made and server responded
                  console.log(error.response.data);
                  setMessage(error.response.data.message);
                  setLevel("secondary");
                } else if (error.request) {
                  // The request was made but no response was received
                  console.log(error.request);
                  setMessage(error.request);
                  setLevel("secondary");
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log("Error", error.message);
                  setMessage(error.message);
                  setLevel("secondary");
                }
              }

              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  fullWidth
                  label="Email"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  component={TextField}
                  type="password"
                  label="Password"
                  fullWidth
                  name="password"
                  variant="outlined"
                />
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
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <Grid container>
          <Grid item>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
