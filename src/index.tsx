import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { loadableReady } from "@loadable/component";

loadableReady(() => {
  const root = document.getElementById("root");
  if (root)
    ReactDOM.hydrate(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
      root
    );
});
