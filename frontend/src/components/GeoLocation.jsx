import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { TextField } from "@material-ui/core";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const API_KEY = "AIzaSyCk1oInC13rYJ0sfrBFKEDYMNcRlSSQfuw";

const libraries = ["places"];
const mapContainerStyle = {
  height: "80vh",
  width: "63.6vw",
  borderRadius : "5px",
  zIndex : "1000"
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
// const center = {
//   lat: 13.04,
//   lng: 77.50,
// };

export default function GeoLocation(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });
  //   const [markers, setMarkers] = React.useState([
  //     {
  //       lat: center.lat,
  //       lng: center.lng,
  //     },
  //   ]);
  const [selected, setSelected] = React.useState(null);

  const [lat, setLat] = React.useState(props.center.lat);
  const [lng, setLng] = React.useState(props.center.lng);

  const onMapClick = React.useCallback((e) => {
    let lt = e.latLng.lat();
    let lg = e.latLng.lng();
    setLat(lt);
    setLng(lg);
    props.setMarkers((current) => [
      {
        lat: lt,
        lng: lg,
        //time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    //mapRef.current.setZoom(8);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <Grid container justify="space-between">
        <Grid item>
          <Grid container>
            <Grid item>
              <TextField
                key="sldkvns43"
                value={lat}
                //id="filled-basic"
                label="Lat"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  let l = e.target.value;
                  setLat(l);
                  if (!isNaN(parseFloat(l))) {
                    props.setMarkers([
                      {
                        lat: parseFloat(l),
                        lng: props.markers[0].lng,
                      },
                    ]);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                key="sj234953"
                value={lng}
                //id="filled-basic"
                label="Lng"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  let l = e.target.value;
                  setLng(l);
                  if (!isNaN(parseFloat(l))) {
                    props.setMarkers([
                      {
                        lat: props.markers[0].lat,
                        lng: parseFloat(l),
                      },
                    ]);
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Locate
            panTo={panTo}
            setMarkers={props.setMarkers}
            setLng={setLng}
            setLat={setLat}
          />
        </Grid>
      </Grid>

      {/* <Search panTo={panTo} /> */}

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={props.center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {props.markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <p> {`Lat: ${selected.lat}, Lng : ${selected.lng}`}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Locate({ panTo, setMarkers, setLat, setLng }) {
  return (
    <Button
      //className={styles.locate}
      variant="outlined"
      color="secondary"
      //style={styles.locate}
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setMarkers([
              {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            ]);
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      Current Location
    </Button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
