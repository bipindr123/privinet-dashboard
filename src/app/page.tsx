"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

import { MarkerWithInfowindow } from "./mymarker";

import { useEffect, useState, useRef } from "react";

import { Rectangle } from "./rectangle";

// import DataPoints from "./sensors";

const fetchDataPoints = async () => {

  const response = await fetch("http://localhost:3005/allsensors");
  const data = await response.json();
  return data;
};

const laAirportLocation = { lat: 33.941, lng: -118.403 };

export const rectangleBounds ={
north: 33.9521,
south: 33.9315,
west: -118.4322,
east: -118.3862
}



const App = () => {
  const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY || "";
  const MapId = process.env.NEXT_PUBLIC_APP_MAP_ID || "";
  const [DataPoints, setDataPoints] = useState([]);
  const [curtime, setTime] = useState(Date.now());

  useEffect(() => {

    const fetchtimerId = setInterval(() => {
      fetchDataPoints().then((data) => {
        setDataPoints(data);
      });
    }, 1000);


      const timerId = setInterval(() => {
        setTime(Date.now());
      }, 1000);
  
      return () => {
      clearInterval(fetchtimerId);
        clearInterval(timerId);
      };

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
          <Markers points={DataPoints} curtime = {curtime} />
          <Rectangle
          bounds={rectangleBounds}
          strokeColor={'#0c4cb3'}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={'#3b82f6'}
          fillOpacity={0.2}
        />
        </Map>
      </APIProvider>
    </div>
  );
};

export type Point = {
  name: string;
  _id: string;
  locations?: [
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

const Markers = ({points, curtime}) => {
  if (!points.length) {
    return null;
  }
  return (
    <>
      {points.map((point: Point) => (
        <MarkerWithInfowindow key={point._id} point={point} curtime={curtime} />
      ))}
    </>
  );
};

export default function Home() {
  return (
    <main>
      <h1>PRIVINET DASHBOARD</h1>
      <App></App>
    </main>
  );
}
