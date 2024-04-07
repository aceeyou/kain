import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState({ id: "", username: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // LATER CHANGE TO FETCH USER DATA AND RECIPES
    async function verifyToken() {
      await axios("http://127.0.0.1:8080/profile", {
        withCredentials: true,
      })
        .then((data: any) => {
          setUser({ ...data.data });
        })
        .catch((err) => {
          console.log(err);
          navigate("/login");
        });
    }

    verifyToken();
  }, [navigate]);
  return (
    <div style={{ width: "100vw", height: "100svh" }}>
      <h1>home</h1>
      <p>Welcome back, {user?.username}</p>
      <Link to="/profile">Profile</Link>
    </div>
  );
}

export default Home;
