"use client";

import { APIProvider, Map, useMarkerRef } from "@vis.gl/react-google-maps";

import { MarkerWithInfowindow } from "./mymarker";

import { useEffect, useState, useRef } from "react";

// import DataPoints from "./sensors";

const fetchDataPoints = async () => {
  const response = await fetch("http://localhost:3005/allsensors");
  const data = await response.json();
  return data;
};

const laAirportLocation = { lat: 33.941, lng: -118.403 };

const App = () => {
  const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY || "";
  const MapId = process.env.NEXT_PUBLIC_APP_MAP_ID || "";
  const [DataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    fetchDataPoints().then((data) => {
      setDataPoints(data);
    });
  }, []);

  return (
    <div className="dashmap">
      <APIProvider apiKey={apiKey}>
        <Map
          style={{ width: "97vw", height: "80vh", borderRadius: "10px" }}
          defaultCenter={laAirportLocation}
          defaultZoom={14}
          // disableDefaultUI={true}
          mapId={MapId}
        >
          <Markers points={DataPoints} />
        </Map>
      </APIProvider>
    </div>
  );
};

export type Point = {
  name: string;
  _id: string;
  locations: [
    {
      timestamp: number;
      lat: number;
      long: number;
    }
  ];
  last_location: {
    timestamp: number;
    lat: number;
    long: number;
  };
};

type Points = { points: Point[] };

const Markers = ({ points }: Points) => {
  return (
    <>
      {points.map((point) => (
        <MarkerWithInfowindow key={point._id} data={point} />
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
