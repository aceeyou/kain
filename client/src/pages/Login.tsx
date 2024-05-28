import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/userSlice";
import InputField from "../components/InputField";
import Logo from "../components/Logo";
import { FC } from "react";

import "./styles/Login.css";

import CookingIllustration from "../assets/cooking.png";

import axios from "axios";

// RADIX
import { Flex, Container, Text, Button, Link as RLink } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

import { useNavigate } from "react-router-dom";

interface LoginFormType {
  [key: string]: string;
  username: string;
  password: string;
}

function Login() {
  // const user = useSelector((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [errPw, setErrPw] = useState(false);
  const [errUser, setErrUser] = useState(
    "Incorrect username or password. Try again."
  );
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
      errorMessage: "Username does not exist. Try again",
      type: "text",
      required: true,
      title: "Username",
    },
    {
      id: 4,
      name: "password",
      label: "Password",
      errorMessage: errPw,
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
    if (userForm.username == "" || userForm.password == "") return;
    e.preventDefault();

    // send to backend server
    try {
      setLoading(true);
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
        .then((res: any) => {
          if (res.status === 201) {
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
            setLoading(false);
            navigate(`/`);
          }
        });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setLoading(false);
        setErrPw(true);
        setErrUser(error?.response?.data);
        return;
      }
    }
  }
  return (
    <Container
      size="1"
      align="center"
      maxWidth="300px"
      py="9"
      id="login__container"
    >
      <Logo
        size="9"
        align="center"
        className=""
        style={{ marginBottom: "1.5rem" }}
      />
      <Flex align={"center"}>
        <img
          src={CookingIllustration}
          loading="lazy"
          width={"60%"}
          style={{
            marginTop: "10px",
            marginBottom: "2rem",
            marginInline: "auto",
          }}
          alt="Illustration of a man cooking"
        />
      </Flex>
      <Form.Root onSubmit={handleOnSubmit} method="POST">
        {/* error message */}
        {errPw && (
          <Text
            align="center"
            as="p"
            style={{
              marginBottom: "1rem",
              color: "var(--accent)",
              fontSize: ".85rem",
            }}
          >
            {errUser}
          </Text>
        )}
        {/* username */}
        {!!inputs &&
          inputs.map((input, index) => (
            <Form.Field name="username" key={index}>
              <Flex direction="column">
                <Form.Control asChild>
                  <InputField
                    key={input.id}
                    {...input}
                    value={userForm[input.name]}
                    onChange={handleInputChange}
                    handleViewPw={handleViewPw}
                    handleOnSubmit={handleOnSubmit}
                  />
                </Form.Control>
              </Flex>
            </Form.Field>
          ))}
        <RLink
          href="#"
          className="forgot-password"
          style={{
            textAlign: "end",
            display: "block",
            fontSize: ".8rem",
            marginBlock: "0 1rem",
          }}
        >
          Forgot Password?
        </RLink>

        {/* login button */}
        <Form.Submit asChild>
          <Button
            loading={loading}
            disabled={loading || userForm.password.length < 8}
            variant="solid"
            size="2"
            style={{
              width: "100%",
              paddingBlock: "1.2rem",
              backgroundColor: "var(--accent)",
            }}
          >
            <Text size="3" style={{ color: "white" }}>
              Login
            </Text>
          </Button>
        </Form.Submit>
        <RLink
          href="/register"
          style={{
            display: "block",
            fontSize: ".85rem",
            color: "var(--foreground)",
            textAlign: "center",
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          Create Account
        </RLink>
      </Form.Root>
    </Container>
  );
}

export default Login;
