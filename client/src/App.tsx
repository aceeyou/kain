import "./App.css";
import { useSelector } from "react-redux";
import { selectUser } from "./reducers/userSlice";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const user = useSelector(selectUser);
  return <div>{user ? <Home /> : <Login />}</div>;
}

export default App;
