import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { routes } from "./utils/routes";
import { StateContextProvider } from "./utils/stateContext/stateContext";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StateContextProvider>
      <App>
        <RouterProvider router={router} />
      </App>
    </StateContextProvider>
  </React.StrictMode>
);
