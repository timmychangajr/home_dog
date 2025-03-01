import React from "react";
import { Provider } from 'react-redux';
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./index.css";
import store from "./store";

ReactDOM.hydrateRoot(
  document,
  <Provider store={store}>
    <React.StrictMode>
      <HydratedRouter />
    </React.StrictMode>
  </Provider>
);