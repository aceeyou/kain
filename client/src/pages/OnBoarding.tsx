import { useState } from "react";
// import { FaSpoon } from "react-icons/fa6";
import { PiPauseLight, PiForkKnifeFill } from "react-icons/pi";
import { Link } from "react-router-dom";

function OnBoarding() {
  const [next, setNext] = useState(false);
  return (
    <div className="onboarding-page">
      {/* {Main Onboarding Page} */}
      {!next ? (
        <div className="onboarding onboarding__welcome-container">
          <div className="left">
            <h1 className="h1">
              Curate your recipes with{" "}
              <span className="welcome__h1-logo h1">kain</span> app
            </h1>
          </div>
          <div className="right">
            <div
              className="welcome__get-started-btn"
              onClick={() => setNext(true)}
            >
              <span className="h4">Get Started</span>
              <PiForkKnifeFill size={23} />
            </div>
          </div>
        </div>
      ) : (
        <div className="onboarding onboarding__account-creation">
          <div className="left">
            <header className="top">
              <h3 className="account-creation__header">
                <PiPauseLight />
                <span>First and foremost</span>
              </h3>
            </header>
            <section>
              <h1 className="h1">Do you have an account?</h1>
              <p>
                by creating an account, you give yourself the luxury of
                accessing your curated recipes across all your devices.
              </p>
            </section>
          </div>
          <div className="right">
            <div className="top"></div>
            <section className="account-creation__btns">
              <Link to={"/signup"}>
                <button
                  tabIndex={-1}
                  className="account-creation__btn account-creation__signup"
                >
                  <span className="h6">Create an account</span>
                </button>
              </Link>
              <Link to={"/login"}>
                <button
                  tabIndex={-1}
                  className="account-creation__btn account-creation__login"
                >
                  <span className="h6">Log in</span>
                </button>
              </Link>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnBoarding;
