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

const StreamedImageComponent = () => {
  const [data, setData] = useState({});

  const fetchImages = async () => {
    const response = await fetch("http://localhost:8000/stream-images");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const boundary = response.headers.get("Content-Type").split("boundary=")[1];
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let imagesData = {};
    let buffer = "";

    async function processChunks() {
      const { done, value } = await reader.read();
      if (done) return;

      buffer += decoder.decode(value, { stream: true });

      const boundaryMarker = `--${boundary}`;
      let parts = buffer.split(boundaryMarker);

      // Process each part of the multipart data
      while (parts.length > 1) {
        const part = parts.shift();
        if (!part.includes("Content-Disposition")) continue;

        // Split headers and body
        const [headerPart, bodyPart] = part.split("\r\n\r\n");
        const headers = headerPart.split("\r\n");
        const contentDisposition = headers.find((header) =>
          header.startsWith("Content-Disposition")
        );

        if (contentDisposition.includes('name="data"')) {
          // Handle metadata (JSON)
          const metadata = JSON.parse(bodyPart.trim());
          imagesData.metadata = metadata;
        } else if (contentDisposition.includes('name="file"')) {
          // Handle image
          // const contentArrayBuffer = new TextEncoder().encode(bodyPart.trim()).buffer;
          // const contentBlob = new Blob([bodyPart], { type: 'image/png' });
          // console.log(bodyPart)
          // const contentURL = URL.createObjectURL(contentBlob);
          // if (imagesData.length > 0) {
          //   imagesData[imagesData.length - 1].imageSrc = contentURL;
          // }

          let srcValue = "data:image/png;base64," + bodyPart.trim();
          imagesData.imageSrc = srcValue;
          setData(imagesData);
        }

        buffer = parts.join(boundaryMarker); // Reassemble remaining parts
      }

      // Keep reading more chunks
      await processChunks();
    }

    await processChunks();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      {data && data.metadata && data.imageSrc && (
        <div>
          <img src={data.imageSrc} alt="Streamed Image" />
          <p>Timestamp: {data.metadata.timestamp}</p>
          <p>Count: {data.metadata.count}</p>
        </div>
      )}
    </div>
  );
};

const ImageStream = () => {
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
              <Box sx={{ minWidth: 120, padding: 2 }}>
                <h1>Select Endpoint</h1>

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Endpoint
                  </InputLabel>
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
                <h1>Streamed images</h1>
                <StreamedImageComponent />
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
      <ImageStream></ImageStream>
    </>
  );
}
