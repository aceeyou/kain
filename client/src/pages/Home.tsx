import { useEffect } from "react";
import Landing from "./OnBoarding";
import axios from "axios";

function Home() {
  const user: boolean = false;
  const accessToken = "";

  useEffect(() => {
    async function verifyToken() {
      await axios("/", {
        headers: {
          Authorization: `BEARER ${accessToken}`,
        },
      });
    }

    verifyToken();
  }, []);
  return (
    <div style={{ width: "100vw", height: "100svh" }}>
      {user ? <h1>Home</h1> : <Landing />}
    </div>
  );
}

export default Home;
