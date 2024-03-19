import logo from "../assets/logo.png";

import { LuChefHat } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";

import InputField from "../components/InputField";
import { useRef, useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirm: "",
  });
  const matchPassw = form.password;

  function handleInputChange(e: { target: HTMLInputElement }) {
    const { name, value }: { name: string; value: string } = e.target;
    setForm((curr) => ({ ...curr, [name]: value }));
  }

  function handleOnSubmit(e: any) {
    e.preventDefault();

    console.log(form);
  }
  return (
    <div className="landing-page signup_page">
      <div className="landing-page__two signuppage__email">
        <div className="onboarding__top">
          <LuChefHat size={25} />
          <h2>Create an Account</h2>
        </div>
        <div className="onboarding__left">
          <h2>Sign up using using email...</h2>

          <form onSubmit={handleOnSubmit}>
            <InputField
              name="fullname"
              label="Full Name"
              inputType="text"
              value={form.fullname}
              onChange={handleInputChange}
              pattern="^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$"
              error_msg={"Name should have more than 3 characters"}
            />
            <InputField
              name="email"
              label="Email"
              inputType="email"
              value={form.email}
              onChange={handleInputChange}
              pattern={"/^[w-.]+@([w-]+.)+[w-]{2,4}$/g"}
              error_msg={"Invalid email address"}
            />
            <InputField
              name="username"
              label="Username"
              inputType="text"
              value={form.username}
              onChange={handleInputChange}
              pattern={"^[A-Za-z0-9]{4,16}"}
              error_msg={"Username must be at least 4 characters long"}
            />
            <InputField
              name="password"
              label="Password"
              inputType="password"
              value={form.password}
              pattern={`^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^*?])[a-zA-Z0-9!@#$%^*?]{8,20}$`}
              onChange={handleInputChange}
              error_msg={
                "Password should have at least 1 of each: a lowercase and an uppercase letter, a number, and any of these special character (?~!@#$%)."
              }
            />
            <InputField
              name="confirm"
              label="Confirm Password"
              inputType="password"
              value={form.confirm}
              pattern={form.password}
              onChange={handleInputChange}
              error_msg={"Passwords does not match"}
            />
            {form.confirm !== form.password && (
              <p className="signup_error-pw-not-matching">
                Passwords are not matching
              </p>
            )}

            <button type="submit" className="signup__createaccount">
              Create Account
            </button>
          </form>
        </div>
        <div className="onboarding__right signup_page__right">
          <div>
            <img src={logo} alt="kain logo" />
          </div>
          <div className="google-signin">
            <FaGoogle size={25} />
            <span>Sign up with Google</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
