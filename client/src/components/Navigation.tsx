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
    <>
      <header>
        <div onClick={handleLeftElement}>{leftElement}</div>
        <div>{title}</div>
        <div onClick={handleRightElement}>{rightElement}</div>
      </header>
    </>
  );
}

export default Navigation;
