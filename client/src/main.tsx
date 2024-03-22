import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import OnBoarding from "./pages/OnBoarding.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import UserRegistration from "./pages/UserRegistration.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/landing",
    element: <OnBoarding />,
  },
  {
    path: "/signup",
    element: <UserRegistration />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
