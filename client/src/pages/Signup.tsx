import { LuChefHat } from "react-icons/lu";
import InputField from "../components/InputField";
import { useState } from "react";

function Signup() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm: "",
  });

  function handleInputChange(e: { target: HTMLInputElement }) {
    const { name, value }: { name: string; value: string } = e.target;
    setForm((curr) => ({ ...curr, [name]: value }));
  }

  function handleOnSubmit(e) {
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
            />
            <InputField
              name="email"
              label="Email"
              inputType="email"
              value={form.email}
              onChange={handleInputChange}
            />
            <InputField
              name="password"
              label="Password"
              inputType="password"
              value={form.password}
              onChange={handleInputChange}
            />
            <InputField
              name="confirm"
              label="Confirm Password"
              inputType="password"
              value={form.confirm}
              onChange={handleInputChange}
            />
            <button type="submit" className="signup__createaccount">
              Create Account
            </button>
          </form>
        </div>
        <div className="onboarding__right">
          <p>{form.fullname}</p>
          <p>{form.email}</p>
          <p>{form.password}</p>
          <p>{form.confirm}</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
