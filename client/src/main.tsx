import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import store from "./App/store";
// import users from "./pages/redux_logic/users";

import "./index.css";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import OnBoarding from "./pages/OnBoarding.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import UserRegistration from "./pages/UserRegistration.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile.tsx";

const router = createBrowserRouter([
  {
    index: true,
    path: "*",
    element: <OnBoarding />,
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <PageNotFound />,
  },
  {
    path: "/signup",
    element: <UserRegistration />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Context.Provider value={user}> */}
      <RouterProvider router={router} />
      {/* </Context.Provider> */}
    </Provider>
  </React.StrictMode>
);
