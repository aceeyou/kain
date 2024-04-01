import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/userSlice";
import InputField from "../components/InputField";

import axios from "axios";

import { useNavigate } from "react-router-dom";

interface LoginFormType {
  [key: string]: string;
  username: string;
  password: string;
}

function Login() {
  // const user = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [userForm, setUserForm] = useState<LoginFormType>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const inputs = [
    {
      id: 3,
      name: "username",
      label: "Username",
      errorMessage: "Username must be atleast 4 characters long",
      type: "text",
      required: true,
      pattern: "{3,20}",
      title: "Username",
    },
    {
      id: 4,
      name: "password",
      label: "Password",
      errorMessage: "Password is not correct",
      type: "password",
      required: true,
      pattern: "{8,}",
      title: "Password",
    },
  ];

  function handleInputChange(e: { target: HTMLInputElement }): any {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  async function handleOnSubmit(e: any) {
    e.preventDefault();

    // send to backend server
    await axios
      .post("http://127.0.0.1:8080/login", {
        username: userForm.username,
        password: userForm.password,
      })
      .then((res) => {
        console.log("login res: ", res);
        dispatch(
          login({
            fullname: res.data.fullname,
            user: res.data,
          })
        );
        setUserForm({
          username: "",
          password: "",
        });
        navigate(`/profile`);
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="login-page">
      <section className="login__container">
        <form
          method="POST"
          className="loginForm"
          onSubmit={handleOnSubmit}
          name="loginForm"
        >
          <h1 className="h1 login__logo">kain</h1>
          {inputs.map((input) => (
            <InputField
              key={input.id}
              {...input}
              value={userForm[input.name]}
              onChange={handleInputChange}
            />
          ))}
          <button className="login__submit-btn">Log in</button>
        </form>
      </section>
    </div>
  );
}

export default Login;
