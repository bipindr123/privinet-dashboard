import React, { useState, useEffect } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { text } from "stream/consumers";

import { Point, alertsContext, rectangleBounds } from "./page";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useContext } from "react";

const isOutofBounds = (lat: number, long: number) => {
  if (lat > rectangleBounds.north || lat < rectangleBounds.south) {
    return true;
  }
  if (long > rectangleBounds.east || long < rectangleBounds.west) {
    return true;
  }
  return false;
};

export const MarkerWithInfowindow = ({ point, curtime }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isInsideBounds, setIsInsideBounds] = useState(true);
  const [openAlert, setOpenAlert] = React.useState(false);
  const { alerts, setAlerts } = useContext(alertsContext);

  console.log(point);

  if (
    isOutofBounds(point.last_location.lat, point.last_location.long) &&
    isInsideBounds
  ) {
    setIsInsideBounds(false);
    // setOpenAlert(true);

    setAlerts([...alerts, point.name + " is out of bounds"]);
  }

  if (
    !isOutofBounds(point.last_location.lat, point.last_location.long) &&
    !isInsideBounds
  ) {
    setIsInsideBounds(true);
    setAlerts([...alerts, point.name + " is inside of bounds"]);
  }

  function formatTime() {
    const lastSeen = Math.round(
      (curtime - point.last_location.timestamp) / 1000
    );
    const minutes = Math.floor(lastSeen / 60);
    const hours = Math.floor(minutes / 60);
    const seconds = lastSeen % 60;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ${seconds} seconds ago`;
    return `${seconds} seconds ago`;
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <>
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {isInsideBounds
            ? point.name + " is back in bounds"
            : point.name + " is out of bounds"}
        </Alert>
      </Snackbar>

      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{
          lat: point.last_location.lat,
          lng: point.last_location.long,
        }}
        title={"Sensor information"}
      >
        <CustomMarker
          point={point}
          curtime={curtime}
          isInsideBounds={isInsideBounds}
        ></CustomMarker>
      </AdvancedMarker>

      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div>
            <p>Name: {point.name}</p>
            <p>Last seen: {formatTime()}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const CustomMarker = ({ point, curtime, isInsideBounds }) => {
  // set the amount of time before it point turns red
  if (isInsideBounds === false) {
    return <span style={{ fontSize: "0.8rem" }}>❌</span>;
  }

  const lastSeen = Math.round((curtime - point.last_location.timestamp) / 1000);
  const seconds = lastSeen;

  if (seconds > 10) {
    return <span style={{ fontSize: "0.8rem" }}>🔴</span>;
  } else if (seconds > 5) {
    return <span style={{ fontSize: "0.8rem" }}>🟡</span>;
  } else {
    return <span style={{ fontSize: "0.8rem" }}>🟢</span>;
  }
};
