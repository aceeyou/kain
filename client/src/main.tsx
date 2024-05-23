import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";

// radix ui theme
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

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
import AddRecipe from "./pages/AddRecipe.tsx";

import Recipe from "./pages/Recipe.tsx";

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
    path: "/register",
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
  {
    path: "/addrecipe",
    element: <AddRecipe />,
  },
  {
    path: "/recipe/:id/:name",
    element: <Recipe />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Context.Provider value={user}> */}
      <Theme
        accentColor="var(--foreground)"
        style={{ backgroundColor: "var(--background)" }}
      >
        <RouterProvider router={router} />
      </Theme>
      {/* </Context.Provider> */}
    </Provider>
  </React.StrictMode>
);
