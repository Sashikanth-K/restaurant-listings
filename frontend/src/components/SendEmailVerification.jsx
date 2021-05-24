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

export default function SendEmailVerification() {
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
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Send Email Verification
        </Typography>
        <div className={classes.form}>
          <Formik
            initialValues={{
              email: "",
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

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                let response = await axios.get(
                  "/auth/send-verification-email?email=" + values.email
                );
                if (response && response.data) {
                  if (response.data.message) {
                    setMessage(response.data.message);
                    setLevel("primary");
                  }
                }
                setSubmitting(false);
              } catch (error) {
                if (error.response) {
                  // Request made and server responded
                  console.log(error.response.data);
                  setMessage(error.response.data.message);
                  setLevel("secondary");
                } else if (error.request) {
                  // The request was made but no response was received
                  console.log(error.request);
                  setLevel("secondary");
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log("Error", error.message);
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
                  Send
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
