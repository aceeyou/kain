import Landing from "./OnBoarding";

function Home() {
  const user: boolean = false;
  return (
    <div style={{ width: "100vw", height: "100svh" }}>
      {user ? <h1>Home</h1> : <Landing />}
    </div>
  );
}

export default Home;
