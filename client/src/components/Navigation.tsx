import React from "react";
import "../pages/styles/AddRecipe.css";

function Navigation({
  leftElement,
  handleLeftElement,
  title,
  rightElement,
  handleRightElement,
}) {
  return (
    <header style={NavigationStyling.header}>
      <div
        style={NavigationStyling.divItem}
        onClick={handleLeftElement}
        tabIndex={1}
      >
        {leftElement}
      </div>
      <div>{title}</div>
      <div
        tabIndex={1}
        style={NavigationStyling.divItemThird}
        onClick={handleRightElement}
      >
        {rightElement}
      </div>
    </header>
  );
}

const NavigationStyling = {
  header: {
    padding: "60px 15px 0px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divItem: {
    cursor: "pointer",
  },
  divItemThird: {
    padding: "2px 5px",
    backgroundColor: "var(--accept)",
    borderRadius: "var(--rounded)",
    fontSize: "0.875rem",
    color: "var(--white)",
  },
};

export default Navigation;
