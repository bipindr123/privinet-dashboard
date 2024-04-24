"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

import { MarkerWithInfowindow } from "./mymarker";

import { useEffect, useState, useRef } from "react";

import { Rectangle } from "./rectangle";

import Grid from "@mui/material/Unstable_Grid2";

import Box from "@mui/system/Box";
import { Settings } from "./settings";
import { useContext } from "react";
import { createContext } from "react";
import { list } from "postcss";

// import DataPoints from "./sensors";

const fetchDataPoints = async () => {
  const response = await fetch("http://localhost:3005/allsensors");
  const data = await response.json();
  return data;
};

const laAirportLocation = { lat: 33.941, lng: -118.403 };

export const rectangleBounds = {
  north: 33.9521,
  south: 33.9315,
  west: -118.4322,
  east: -118.3862,
};

interface AlertProps {
  alerts: string[];
  setAlerts: (alert: any) => void;
}
export const SomeContext = createContext<AlertProps>({
  alerts: [],
  setAlerts: () => {},
});

const App = () => {
  const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY || "";
  const MapId = process.env.NEXT_PUBLIC_APP_MAP_ID || "";
  const [DataPoints, setDataPoints] = useState([]);
  const [curtime, setTime] = useState(Date.now());
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchtimerId = setInterval(() => {
      fetchDataPoints().then((data) => {
        setDataPoints(data);
      });
    }, 1000);

    const timerId = setInterval(() => {
      setTime(Date.now());
      console.log(alerts);
    }, 1000);

    return () => {
      clearInterval(fetchtimerId);
      clearInterval(timerId);
    };
  }, []);

  return (
    <SomeContext.Provider value={{ alerts, setAlerts }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <Settings />
          </Grid>
          <Grid xs={9}>
            <div className="dashmap">
              <APIProvider apiKey={apiKey}>
                <Map
                  style={{
                    width: "auto",
                    height: "80vh",
                    borderRadius: "10px",
                  }}
                  defaultCenter={laAirportLocation}
                  defaultZoom={14}
                  // disableDefaultUI={true}
                  mapId={MapId}
                >
                  <Markers points={DataPoints} curtime={curtime} />
                  <Rectangle
                    bounds={rectangleBounds}
                    strokeColor={"#0c4cb3"}
                    strokeOpacity={1}
                    strokeWeight={3}
                    fillColor={"#3b82f6"}
                    fillOpacity={0.2}
                  />
                </Map>
              </APIProvider>
            </div>
          </Grid>
        </Grid>
      </Box>
    </SomeContext.Provider>
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

const Markers = ({ points, curtime }) => {
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
