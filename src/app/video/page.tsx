"use client";

import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState, useRef } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const endpoints = ["endpoint 1", "endpoint 2", "endpoint 3"];

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import VideoPlayer from "./videoplayer";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const VideoStream = () => {
  const [selected_endpoint, setSelected_endpoint] = useState(endpoints[0]);
  const vurl = "http://localhost:3005/video";

  const handleChange = (event: SelectChangeEvent) => {
    setSelected_endpoint(event.target.value as string);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        {/* <CssBaseline /> */}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container>
            <Grid xs={12} md={4}>
              <h1>Select Endpoint</h1>

              <Box sx={{ minWidth: 120, padding: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Endpoint</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selected_endpoint}
                    label="Age"
                    onChange={handleChange}
                  >
                    {endpoints.map((endpoint) => (
                      <MenuItem key={endpoint} value={endpoint}>
                        {endpoint}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid xs={12} md={8}>
            <Box sx={{ minWidth: 120, padding: 2 }}>
              <h1>Video Stream</h1>
              <p>People Count: </p>
              <VideoPlayer videoUrl={vurl} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default function Video() {
  return (
    <>
      <h1>PRIVINET DASHBOARD</h1>
      <hr />
      <VideoStream></VideoStream>
    </>
  );
}
