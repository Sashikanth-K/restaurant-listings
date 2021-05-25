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
  width: "84vw",
  borderRadius: "5px",
  //zIndex: "1000",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 13.04,
  lng: 77.5,
};

export default function GeoLocationList(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    //libraries,
  });

  const [selected, setSelected] = React.useState(null);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={6}
        center={center}
        options={options}
        onLoad={onMapLoad}
      >
        {props.markers.map((marker) => (
          <Marker
            key={`${marker.location.coordinates[1]}-${marker.location.coordinates[0]}`}
            position={{
              lat: marker.location.coordinates[1],
              lng: marker.location.coordinates[0],
            }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{
              lat: selected.location.coordinates[1],
              lng: selected.location.coordinates[0],
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h3>{`Name : ${selected.name}`}</h3>
              <p>{`$${selected.price}`}</p>
              <p>{`${selected.floorArea} sqft.`}</p>
              <p>{`${selected.numberOfRooms} rooms`}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
