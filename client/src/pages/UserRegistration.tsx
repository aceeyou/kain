import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./styles/UserRegistration.css";
import Logo from "../components/Logo";

import InputField from "../components/InputField";
import { LuChefHat } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";
import { PiEye, PiEyeClosed } from "react-icons/pi";

// RADIX
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Link as RLink,
  Section,
  Flex,
  IconButton,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

interface FormTypes {
  [key: string]: string;
  fullname: string;
  email: string;
  username: string;
  password: string;
  confirmpw: string;
}

function UserRegistration() {
  const [reveal, setReveal] = useState({ password: false, confirmpw: false });
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [registrationError, setRegistrationError] = useState({
    field: "",
    message: "",
  });
  const [userForm, setUserForm] = useState<FormTypes>({
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
      errorMessage: "Name must be atleast 5 characters",
      type: "text",
      required: true,
      pattern: "/^[a-zA-Z]{5,}$/",
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
      pattern: "^[a-zA-Z0-9]{6,20}$",
      title: "Username",
    },
    {
      id: 4,
      name: "password",
      label: "Password",
      errorMessage:
        "Password should be at least 8 characters and must contain at least 1 lowercase letter, 1 uppercase letter, a number, and a special characrer",
      type: "password",
      required: true,
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

  const handleKeyUpPW = (e: any) => {
    const { value } = e.target;
    if (
      !/[A-Z]/.test(value) ||
      !/[a-z]/.test(value) ||
      !/[0-9]/.test(value) ||
      !/[!@#$%^*()<>?]/.test(value) ||
      value.length < 8
    ) {
      setIsPasswordValid(false);
      return;
    }
    setIsPasswordValid(true);
    return;
  };

  const handleKeyUpEmail = (e) => {
    const { value } = e.target;
    if (
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g.test(value)
    ) {
      setIsEmailValid(true);
      return;
    }
    setIsEmailValid(false);
    return;
  };

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
        console.log("then res register", res);
        console.log("client user registered");
        setUserForm({
          fullname: "",
          email: "",
          username: "",
          password: "",
          confirmpw: "",
        });
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.data.field);
        console.log(err.response.data.message);
        setRegistrationError({
          field: err.response.data.field,
          message: err.response.data.message,
        });
      });
  }
  return (
    <Container size="1">
      <Box className="registration__container">
        <Box>
          <Logo
            size="9"
            align="center"
            style={{}}
            className="registration__logo"
          />
        </Box>
        <Section>
          <Box>
            <Heading
              as="h2"
              style={{ fontFamily: "Outfit" }}
              className="registration__subheading"
            >
              Create Account
            </Heading>
            <Text as="p" className="registration__description">
              The kain app is designed to store your delicious recipes and share
              them with other chefs. Create an account to start sharing your
              recipes.
            </Text>
          </Box>
          <Box>
            <Form.Root
              onSubmit={(e) => {
                e.preventDefault();
                console.log("hi");
              }}
            >
              {!!inputs &&
                inputs.map((input, index) => (
                  <Form.Field name={input.name} key={index}>
                    <Flex
                      direction="column"
                      className="registration__input-group"
                    >
                      <Form.Control asChild>
                        <input
                          type={reveal[input.name] ? "text" : input.type}
                          name={input.name}
                          required={input?.required}
                          pattern={input.pattern}
                          value={userForm[input.name]}
                          onKeyUp={(e: any) => {
                            if (input.name === "password") {
                              handleKeyUpPW(e);
                            }
                            if (input.name === "email") {
                              handleKeyUpEmail(e);
                            }
                          }}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              [input.name]: e.target.value,
                            })
                          }
                          className="registration__input"
                        />
                      </Form.Control>
                      {input.name === "password" ||
                      input.name === "confirmpw" ? (
                        <IconButton
                          type="button"
                          className="registration__reveal-btn"
                          onClick={() =>
                            setReveal({
                              ...reveal,
                              [input.name]: !reveal[input.name],
                            })
                          }
                        >
                          {reveal[input.name] ? <PiEye /> : <PiEyeClosed />}
                        </IconButton>
                      ) : (
                        ""
                      )}
                      <Form.Label
                        className={`registration__input-label ${
                          userForm[input.name].length > 0 && "input__hasValue"
                        } ${!isPasswordValid && "label__password-invalid"}`}
                      >
                        {input.title}
                      </Form.Label>
                    </Flex>
                    <Box style={{ marginBlock: "0.1rem .6rem" }}>
                      {input.name === "password" &&
                        !isPasswordValid &&
                        userForm.password.length > 0 && (
                          <Text className="registration__err-msg-pw">
                            Password should be at least 8 characters and must
                            contain at least 1 lowercase letter, 1 uppercase
                            letter, a number, and a special characrer
                          </Text>
                        )}
                      {input.name === "email" &&
                        !isEmailValid &&
                        userForm.email.length > 0 && (
                          <Text className="registration__err-msg-pw">
                            Provide a valid email address
                          </Text>
                        )}

                      {input.name === registrationError.field && (
                        <Text className="registration__input-message">
                          {registrationError.message}
                        </Text>
                      )}
                      <Form.Message
                        match="patternMismatch"
                        className="registration__input-message"
                      >
                        {input.errorMessage}
                      </Form.Message>
                      <Form.Message
                        match="valueMissing"
                        className="registration__input-message"
                      >
                        Please enter a valid {input.title}.
                      </Form.Message>
                    </Box>
                  </Form.Field>
                ))}
              <Form.Submit asChild>
                <button
                  className="registration__submit-btn"
                  onClick={handleOnSubmit}
                >
                  Create Account
                </button>
              </Form.Submit>
              <Box className="registration__login-btn-ctn">
                <RLink href="/login" className="registration__login-btn">
                  Login Instead
                </RLink>
              </Box>
            </Form.Root>
          </Box>
        </Section>
      </Box>
    </Container>
  );
}

export default UserRegistration;
