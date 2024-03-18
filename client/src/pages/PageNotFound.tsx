import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100svh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      404 Page Not Found
      <Link to="/">Go back</Link>
    </div>
  );
}

export default PageNotFound;
