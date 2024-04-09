"use client";

import Image from "next/image";

import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMarkerRef,
  InfoWindow,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";

import {MarkerWithInfowindow} from "./mymarker";

import { Loader } from "@googlemaps/js-api-loader";

import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { useEffect, useState, useRef } from "react";

import DataPoints from "./sensors";

const App = () => {
  const [markerRef, marker] = useMarkerRef();
  const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY || "";
  const MapId = process.env.NEXT_PUBLIC_APP_MAP_ID || "";

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "100vw", height: "80vh" }}
        defaultCenter={{ lat: 33.941, lng: -118.403 }}
        defaultZoom={14}
        // gestureHandling={"greedy"}
        // disableDefaultUI={true}
        mapId={MapId}
      >
        <Markers points={DataPoints} />
        {/* <AdvancedMarker position={{ lat: 33.941, lng: -118.403 }}>
        </AdvancedMarker> */}
      </Map>
    </APIProvider>
  );
};

type Point = google.maps.LatLngLiteral & { timestamp: number } & {
  key: string;
} & {name: string};

type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infowindowShown, setInfowindowShown] = useState(false);

  const toggleInfoWindow = () =>
    setInfowindowShown(previousState => !previousState);

  const closeInfoWindow = () => setInfowindowShown(false);

  const setMarkerRefs = (marker: Marker) => {
    markerRef(marker);
  };

  return (
    <>
      {points.map((point) => (
        <MarkerWithInfowindow key={point.timestamp} data = {point}/>
      ))}
    </>
  );
};

function CustomMarker(props) {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // set the amount of time before it point turns red
  if (props.point_time < time - 1000 * 10) {
    return <span style={{ fontSize: "0.8rem" }}>🔴</span>;
  } else if (props.point_time < time - 1000 * 5) {
    return <span style={{ fontSize: "0.8rem" }}>🟡</span>;
  } else {
    return <span style={{ fontSize: "0.8rem" }}>🟢</span>;
  }
}

export default function Home() {
  return (
    <main>
      <h1>Privinet Dashboard</h1>
      <App></App>
    </main>
  );
}
