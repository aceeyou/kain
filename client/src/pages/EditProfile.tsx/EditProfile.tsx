import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Section,
  Switch,
  Text,
  TextArea,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import * as Dialog from "@radix-ui/react-dialog";
import * as Label from "@radix-ui/react-label";
// import * as Switch from "@radix-ui/react-switch";
import axios from "axios";
import "./EditProfile.css";
import Container from "../../components/Container";
import Navigation from "../../components/Navigation/Navigation";
import defaultDP from "../../assets/default-dp.png";

import { TbRadioactiveFilled } from "react-icons/tb";
import { FaChevronDown } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";

const allergens = ["Eggs", "Scallops", "Shrimp"];

function EditProfile() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState(false);
  const [rawUserData, setRawUserData] = useState({});
  const [editedData, setEditedData] = useState({});
  const [loadRawUserData, setLoadRawUserData] = useState(true);
  const [image, setImage] = useState(rawUserData?.profilePicture || defaultDP);

  useEffect(() => {
    fetchProfile();

    return () => {
      setRawUserData({});
    };
  }, []);

  console.log(darkMode);

  async function fetchProfile() {
    setLoadRawUserData(true);
    try {
      await axios
        .get("http://127.0.0.1:8080/profile", { withCredentials: true })
        .then((data: any) => {
          console.log(data.data);
          setRawUserData({ ...data.data });
          setEditedData({ ...data.data });
          setImage(data.data.profilePicture);
          setLoadRawUserData(false);
        });
    } catch (error: any) {
      console.log("Edit profile page | fetchProfile: ", error?.message);
    }

    // console.log(user);
  }

  function handleChangeEditedData(name: string, newData: string) {
    setEditedData({ ...editedData, [name]: newData });
  }
  const clickFileInput = () => fileRef?.current?.click();
  return (
    <Container>
      <Navigation title="Edit Profile" />
      <Flex
        role="button"
        tabIndex={1}
        onClick={clickFileInput}
        onKeyDown={(k) => k.key === "Enter" && clickFileInput()}
        as="div"
        direction="column"
        align="center"
        justify="center"
        width="100px"
        ml="auto"
        mr="auto"
      >
        <input
          ref={fileRef}
          type="file"
          name="newProfileImage"
          id="newProfileImage"
          onTouchCancel={() => setImage((current: any) => current)}
          className="sr-only"
        />
        <Avatar size="7" radius="full" src={`${image}`} fallback={"A"} />
        <Text mt="3" size="2">
          Edit Picture
        </Text>
      </Flex>
      <Box className="edit__form-container">
        <Form.Root>
          <Section className="edit__section">
            <FormField
              inputType="text"
              name="fullname"
              label="Name"
              message="Please provide your name"
              value={editedData?.fullname}
              onChange={handleChangeEditedData}
            />
            <FormField
              inputType="text"
              name="username"
              label="Username"
              message="Please provide your username"
              value={editedData?.username}
              onChange={handleChangeEditedData}
            />
            <Form.Field name="bio" className="edit__form-field">
              <Form.Label className="edit__form-label">Bio</Form.Label>
              <Form.Control asChild>
                <TextArea
                  name="bio"
                  placeholder="Say something about yourself..."
                  resize="none"
                  size="3"
                  className="edit__form-textarea"
                />
              </Form.Control>
            </Form.Field>
          </Section>

          <Section className="edit__section">
            <Heading
              as="h2"
              size="4"
              mb="3"
              style={{ fontWeight: "500", fontSize: "1rem" }}
            >
              General
            </Heading>
            <Flex direction="row" justify="between" mb="2">
              <Label.Root>Dark Mode </Label.Root>

              <Switch
                onCheckedChange={() => setDarkMode((curr) => !curr)}
                checked={darkMode}
                className="darkmode-switch"
              />
            </Flex>
            <Dialog.Root>
              <Label.Root htmlFor="allergies">Allergies</Label.Root>
              <Dialog.Trigger asChild>
                <Flex
                  className="allergy-select__container"
                  as="div"
                  align="center"
                  gap="2"
                  direction="row"
                  mt="1"
                >
                  <TbRadioactiveFilled />
                  <Text
                    className="allergy__text"
                    as="p"
                    truncate
                    trim="end"
                    wrap="wrap"
                    style={{ marginRight: "auto" }}
                  >
                    {allergens.map((allergy, index) => (
                      <Text>
                        {allergy}
                        {index + 1 < allergens.length && ", "}
                      </Text>
                    ))}
                  </Text>
                  <FaChevronDown />
                </Flex>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog__overlay" />
                <Dialog.Content className="dialog__content">
                  <Dialog.Title>
                    <Flex align="center" className="dialog__title-ctn">
                      <TbRadioactiveFilled size={22} />
                      <Heading as="h1">Allergies</Heading>
                    </Flex>
                  </Dialog.Title>
                  <Dialog.Description className="dialog__description">
                    <Text>
                      Select the allergens that isn't good to you. An icon will
                      be shown if a recipe contains these allergens.
                    </Text>
                  </Dialog.Description>

                  {/* <Flex align="center" className="dialog__allergy-input"> */}
                  <Box className="fieldset">
                    <label htmlFor="allergyInput" className="sr-only">
                      Search for allergens
                    </label>
                    <input
                      type="text"
                      placeholder="Add your allergen"
                      id="allergyInput"
                    />
                    <Button
                      className="add-allergy-btn"
                      size="4"
                      variant="solid"
                    >
                      <IoMdAdd />
                    </Button>
                  </Box>
                  {/* </Flex> */}

                  <Box className="dialog__existing-allergies">
                    <Text as="p" className="existing-allergy-title">
                      Existing Allegies
                    </Text>
                    <Flex
                      gap="2"
                      direction="row"
                      wrap="wrap"
                      className="flex-allergies"
                    >
                      {allergens.map((allergy) => (
                        <Text className="allergy" as="p" key={allergy}>
                          {allergy}
                        </Text>
                      ))}
                    </Flex>
                  </Box>
                  <Flex justify="end" className="dialog__buttons">
                    <Dialog.Close asChild>
                      <Button size="4" variant="outline">
                        Close
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <Button variant="solid" className="allergies-save-btn">
                        Save
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </Section>
          <Section className="edit__section">
            <Heading
              as="h2"
              size="4"
              mb="3"
              style={{ fontWeight: "500", fontSize: "1rem" }}
            >
              Account
            </Heading>
            <Flex direction="row" justify="between" mb="2">
              <Label.Root>Private Account </Label.Root>

              <Switch
                onCheckedChange={() => setDarkMode((curr) => !curr)}
                checked={darkMode}
                className="darkmode-switch"
              />
            </Flex>
            <Button className="logout-btn">Log out</Button>
          </Section>
        </Form.Root>
      </Box>
    </Container>
  );
}

interface FieldProps {
  name: string;
  label: string;
  message: string;
  inputType: string;
  value: string;
  onChange: (name: string, newData: string) => void;
}
const FormField = ({
  name,
  label,
  message,
  inputType,
  value,
  onChange,
}: FieldProps) => {
  return (
    <Form.Field name={name} className="edit__form-field">
      <Form.Label className="edit__form-label">{label}</Form.Label>
      <Form.Control asChild>
        <input
          className="edit__form-input"
          type={inputType}
          name={name}
          id={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
        />
      </Form.Control>
      <Form.Message className="edit__form-err-msg" match="valueMissing">
        {message}
      </Form.Message>
    </Form.Field>
  );
};

export default EditProfile;
