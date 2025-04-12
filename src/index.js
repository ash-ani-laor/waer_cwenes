//src\index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import GodsAsking from "./components/GodsAsking/GodsAsking";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LocalizationProvider dateAdapter={AdapterLuxon}>
    <GodsAsking />
  </LocalizationProvider>
);
