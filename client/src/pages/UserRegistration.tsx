import { LuChefHat } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";

import InputField from "../components/InputField";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserRegistration() {
  const [userForm, setUserForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmpw: "",
  });
  const navigate = useNavigate();

  const inputs = [
    {
      id: 1,
      name: "fullname",
      label: "Full Name",
      errorMessage: "Name must be atleast 3 characters",
      type: "text",
      required: true,
      pattern: "^[a-zA-Z/s]",
      title: "Full Name",
    },
    {
      id: 2,
      name: "email",
      label: "Email",
      errorMessage: "It should be a valid email address",
      type: "email",
      required: true,
      title: "Email address",
    },
    {
      id: 3,
      name: "username",
      label: "Username",
      errorMessage: "Username must be atleast 4 characters long",
      type: "text",
      required: true,
      pattern: "^[a-zA-Z0-9]{3,20}",
      title: "Username",
    },
    {
      id: 4,
      name: "password",
      label: "Password",
      errorMessage:
        "Password should be at least 8 characters and contain at least 1 lower and uppercase letter, and 1 special characrer [?!@#$%^*()]",
      type: "password",
      required: true,
      pattern:
        "^(?=.*[0-9](?=.*[a-zA-Z])(?=.*[?!@#$%^*()])[a-zA-Z0-9??!@#$%^*()]{8,20}",
      title: "Password",
    },
    {
      id: 5,
      name: "confirmpw",
      label: "Confirm Password",
      errorMessage: "Password does not match",
      type: "password",
      required: true,
      pattern: userForm.password,
      title: "Confirm Password",
    },
  ];

  function handleInputChange(e: { target: HTMLInputElement }): any {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  async function handleOnSubmit(e: any) {
    e.preventDefault();

    // send to backend server

    await axios
      .post("http://127.0.0.1:8080/register", {
        fullname: userForm.fullname,
        email: userForm.email,
        username: userForm.username,
        password: userForm.password,
      })
      .then((res) => {
        console.log(res.statusText);
        setUserForm({
          fullname: "",
          email: "",
          username: "",
          password: "",
          confirmpw: "",
        });
        navigate("/");
      })
      .catch((err) => console.log(err));
    // navigate("/");
  }
  return (
    <div className="onboarding-page">
      <div className="onboarding onboarding__user-registration-container">
        <div className="left">
          <div className="top">
            <h3 className="user-registration__header">
              <LuChefHat />
              <span>Create an Account</span>
            </h3>
          </div>
          <section>
            <h1 className="h3">Sign up using email...</h1>
            <form
              method="POST"
              className="registrationForm"
              onSubmit={handleOnSubmit}
              name="registrationForm"
            >
              {inputs.map((input) => (
                <InputField
                  key={input.id}
                  {...input}
                  value={userForm[input.name]}
                  onChange={handleInputChange}
                />
              ))}
              <button className="registrationForm__submit-btn">
                Create Account
              </button>
            </form>
          </section>
        </div>
        <div className="right">
          <div className="top"></div>
          <section>
            <span className="divider">----------- or ------------</span>
            <div className="register-with-google-btn">
              <FaGoogle size={23} />
              <span className="h6">Sign up with Google</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;
