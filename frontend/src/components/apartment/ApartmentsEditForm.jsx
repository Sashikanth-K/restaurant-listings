import React, { useContext, useEffect, useState } from "react";
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
import { TextField, Select } from "formik-material-ui";

import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserProvider";
import MessageCard from "../MessageCard";
import GeoLocation from "../GeoLocation";
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
}));

export default function ApartmentEditForm(props) {
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const history = useHistory();
  const [message, setMessage] = useState(null);
  const [level, setLevel] = useState("primary");

  const [userList, setUserList] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

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

  const getRealtorUsers = async () => {
    try {
      const params = {
        role: "realtor",
        limit: 10000,
      };

      //setIsLoading(true);
      let data = await axios.get("/users", {
        params: params,
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      });

      //setIsLoading(false);
      if (data && data.data && data.data.results) {
        setUserList(data.data.results);
        setTotalResults(data.data.totalResults);
        setPage(data.data.page);
        setTotalPages(data.data.totalPages);
      } else {
        //setErrorMessage(data.data.message);
        setUserList([]);
      }
    } catch (error) {
      // setIsLoading(false);
      // setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getRealtorUsers();
  }, []);

  return (
    <Container component="main" maxWidth="md">
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
              isRented: props.data.isRented,
              realtorId: props.data.realtorId,
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
                //values.realtorId = userContext.userInfo.id;
                values.lng = markers[0].lng;
                values.lat = markers[0].lat;
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
                <FormControl className={classes.formControl}>
                  <InputLabel
                    shrink
                    id="demo-simple-select-placeholder-label-label"
                  >
                    {" "}
                    Rented status
                  </InputLabel>
                  <Field
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    fullWidth
                    component={Select}
                    variant="outlined"
                    name="isRented"
                    // inputProps={{
                    //   id: "age-simple",
                    // }}
                  >
                    <MenuItem value={true}>Rented</MenuItem>
                    <MenuItem value={false}>Not Rented</MenuItem>
                  </Field>
                </FormControl>

                {userContext &&
                userContext.userInfo &&
                userContext.userInfo.role == "admin" ? (
                  <FormControl className={classes.formControl}>
                    <InputLabel shrink id="demo-simple-select-placeholde">
                      {" "}
                      Associated Realtor
                    </InputLabel>
                    <Field
                      labelId="demo-simple-select-placeholde"
                      id="demo-simple-select-placeholde"
                      fullWidth
                      component={Select}
                      variant="outlined"
                      name="realtorId"
                      // inputProps={{
                      //   id: "age-simple",
                      // }}
                    >
                      {userList.map((item) => {
                        return <MenuItem value={item.id}>{item.name}</MenuItem>;
                      })}
                    </Field>
                  </FormControl>
                ) : null}

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
                <br />
                <GeoLocation
                  markers={markers}
                  setMarkers={setMarkers}
                  center={center}
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
