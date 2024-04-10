import React, { useState, useEffect } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { text } from "stream/consumers";

import { Point } from "./page";

export const MarkerWithInfowindow = (props) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [curtime, setTime] = useState(Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{
          lat: props.data.last_location.lat,
          lng: props.data.last_location.long,
        }}
        title={"Sensor information"}
      >
        <CustomMarker data={props.data} curtime={curtime}></CustomMarker>
      </AdvancedMarker>

      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <div>
            <p>Name: {props.data.name}</p>
            <p>
              Last seen:{" "}
              {Math.round(
                (curtime - props.data.last_location.timestamp) / 1000
              )}{" "}
              Seconds ago
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const CustomMarker = (props) => {
  // set the amount of time before it point turns red
  if (props.data.last_location.timestamp < props.curtime - 1000 * 10) {
    return <span style={{ fontSize: "0.8rem" }}>🔴</span>;
  } else if (props.data.timestamp < props.curtime - 1000 * 5) {
    return <span style={{ fontSize: "0.8rem" }}>🟡</span>;
  } else {
    return <span style={{ fontSize: "0.8rem" }}>🟢</span>;
  }
};
