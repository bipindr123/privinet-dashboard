import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { SomeContext } from "./page";
import { useContext } from "react";

export const Settings = () => {
  const { alerts, setAlerts } = useContext(SomeContext);
  console.log(alerts);
  return (
    <>
      <h1>Alerts</h1>
      <Box height="80%" display="flex" alignItems="top" p={2}>
        <Stack sx={{ width: "100%" }} spacing={1}>
          {alerts.map((alert: string, idx: number) => (
            <Alert
              key={idx}
              variant="outlined"
              severity="info"
              onClose={() => {
                alerts.splice(idx, 1);
              }}
            >
              {alert}
            </Alert>
          ))}
        </Stack>
      </Box>
    </>
  );
};
