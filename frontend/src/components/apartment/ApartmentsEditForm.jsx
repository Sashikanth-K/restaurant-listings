import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { FormControlLabel, Radio } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { RadioGroup } from "formik-material-ui";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import MessageCard from "../MessageCard";
import axios from "axios";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ApartmentEditForm(props) {
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
        <Typography component="h1" variant="h5">
          Apartment Form
        </Typography>
        <div className={classes.form}>
          <Formik
            initialValues={{
              name: props.data.name,
              description: props.data.description,
              floorArea: props.data.floorArea,
              numberOfRooms: props.data.numberOfRooms,
              price: props.data.price,
              //realtorId : "",
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .min(4, "Must be 4 characters or less")
                .required("Required"),
              description: Yup.string().required("Required"),
              floorArea: Yup.number()
                .min(0, "Must be greater than 0")
                .required("Required"),
              numberOfRooms: Yup.number()
                .integer()
                .min(0, "Must be greater than 0")
                .required("Required"),
              price: Yup.number()
                .min(0, "Must be greater than 0")
                .required("Required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setMessage(null);
                values.realtorId = userContext.userInfo.id;
                let response = await axios.patch(
                  `/apartments/${props.data.id}`,
                  values
                );

                if (response && response.data) {
                  if (response.data.id) {
                    // history.push("/apartments/" + response.data.id);
                    props.finishEdit();
                    props.setData(response.data);
                  }

                  if (response.data.message) {
                    setMessage(response.data.message);
                    setLevel("primary");
                  }
                }
                setSubmitting(false);
              } catch (error) {
                setSubmitting(false);
                if (error.response) {
                  // Request made and server responded
                  console.log(error.response.data);
                  setMessage(error.response.data.message);
                  setLevel("secondary");
                } else if (error.request) {
                  // The request was made but no response was received
                  console.log(error.request);
                  //setMessage(error.request);
                  //setLevel("secondary");
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log("Error", error.message);
                  setMessage(error.message);
                  setLevel("secondary");
                }
              }
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Field
                  key="name"
                  component={TextField}
                  name="name"
                  fullWidth
                  label="Name"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  key="floorArea"
                  component={TextField}
                  name="floorArea"
                  fullWidth
                  label="Floor Area"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  key="numberOfRooms"
                  component={TextField}
                  label="Number Of Rooms"
                  fullWidth
                  name="numberOfRooms"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  key="price"
                  component={TextField}
                  label="Price"
                  fullWidth
                  name="price"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  component={TextField}
                  label="Description"
                  fullWidth
                  multiline
                  rows={5}
                  name="description"
                  variant="outlined"
                />

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
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Container>
  );
}
