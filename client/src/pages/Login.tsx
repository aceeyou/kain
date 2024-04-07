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
  const [errPw, setErrPw] = useState("");
  const [viewPw, setViewPw] = useState("password");
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
      title: "Username",
    },
    {
      id: 4,
      name: "password",
      label: "Password",
      errorMessage: "Password is not correct",
      type: viewPw,
      required: true,
      title: "Password",
    },
  ];

  function handleViewPw(e: any) {
    e.preventDefault();
    viewPw === "password" ? setViewPw("text") : setViewPw("password");
  }

  function handleInputChange(e: { target: HTMLInputElement }): any {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  async function handleOnSubmit(e: any) {
    e.preventDefault();

    // send to backend server
    await axios
      .post(
        "http://127.0.0.1:8080/login",
        {
          username: userForm.username,
          password: userForm.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("login res: ", res);
        if (res.data === "Incorrect password. Try again") {
          setErrPw("Incorrect password. Try again.");
        } else {
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
          navigate(`/`);
        }
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
              handleViewPw={handleViewPw}
            />
          ))}
          {errPw && <p className="login__err-msg">{errPw}</p>}
          <button className="login__submit-btn">Log in</button>
        </form>
      </section>
    </div>
  );
}

export default Login;
