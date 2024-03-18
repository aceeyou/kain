import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { PiPauseLight } from "react-icons/pi";
import { Link } from "react-router-dom";

function Landing() {
  const [next, setNext] = useState(false);
  return (
    <div className="landing-page">
      {next ? (
        <div className="landing-page__two">
          <div className="onboarding__top">
            <PiPauseLight size={25} />
            <h2>First and foremost...</h2>
          </div>
          <div className="onboarding__left">
            <h1>Do you have an account?</h1>
            <p>
              by creating an account, you give yourself the luxury of accessing
              your curated recipes across all your devices.
            </p>
          </div>
          <div className="onboarding__right">
            <Link to="/signup">
              <div className="btn__signup">
                <p>Sign up</p>
              </div>
            </Link>
            <Link to="/signup">
              <div className="btn__login">
                <p>Log in</p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="landing-page__one">
          <h1>
            Curate your recipes with <span className="landing__logo">kain</span>{" "}
            app
          </h1>
          <div
            role="button"
            className="get-started-btn"
            onClick={() => setNext(true)}
          >
            <p>Get Started!</p>
            <span>
              <FaArrowRightLong className="btn-icon" color="white" size={25} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
