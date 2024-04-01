"use client";

import Image from "next/image";

import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMarkerRef,
} from "@vis.gl/react-google-maps";

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

type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: Point[] };
const Markers = ({ points }: Props) => {
  return (
    <>
      {points.map((point) => (
        <AdvancedMarker position={point} key={point.key}>
          <span style={{ fontSize: "0.8rem" }}>🟢</span>
        </AdvancedMarker>
      ))}
    </>
  );
};

export default function Home() {
  return (
    <main>
      <h1>Privinet Dashboard</h1>
      <App></App>
    </main>
  );
}
