import axios from "axios";
import "./EditProfile.css";
import defaultDP from "../../assets/default-dp.png";

import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Section,
  Spinner,
  Switch,
  Text,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import * as Label from "@radix-ui/react-label";

import Container from "../../components/Container";
import Navigation from "../../components/Navigation/Navigation";
import FormField from "../../components/Forms/FormField/FormField";
import AllergyDialog from "../../components/AllergyDialog/AllergyDialog";

interface UserDataProps {
  _id: number;
  fullname: string;
  username: string;
  bio: string;
}

function EditProfile() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [darkMode, setDarkMode] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allergens, setAllergens] = useState(["Eggs", "Scallops", "Shrimp"]);
  const [allergyInput, setAllergyInput] = useState("");
  const [rawUserData, setRawUserData] = useState({ profilePicture: "" });
  const [editedData, setEditedData] = useState<UserDataProps>({
    _id: 0,
    fullname: "",
    username: "",
    bio: "",
  });
  const [loadRawUserData, setLoadRawUserData] = useState(true);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [image, setImage] = useState(rawUserData?.profilePicture || defaultDP);

  useEffect(() => {
    fetchProfile();

    return () => {
      setRawUserData({ profilePicture: "" });
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
      return;
    }
  }

  function handleChangeEditedData(name: string, newData: string) {
    setEditedData({ ...editedData, [name]: newData });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAllergyInput(e.target.value);
  }

  function handleAddAllergen() {
    setAllergens((curr) => [...curr, allergyInput]);
    setAllergyInput("");
  }

  function handleUpdateAllergies() {
    alert("updating allergies...");
    handleCloseDialog();
  }

  function handleCloseDialog() {
    setAllergyInput("");
  }

  const clickFileInput = () => fileRef?.current?.click();

  const handleUploadProfilePicture = async (file: any) => {
    setIsUploadingPicture(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8080/uploadProfilePicture",
        {
          userId: editedData._id,
          image: file,
        },
        { withCredentials: true }
      );
      if (res) {
        setImage(res.data.profilePicture);
        setIsUploadingPicture(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleImageChange(e: any) {
    if (e?.target?.files.length > 0) {
      const file: any = e?.target?.files[0];

      transformFile(file);
    } else return;
  }

  // transform images to base64
  const transformFile = (file: any) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        handleUploadProfilePicture(reader.result);
        // console.log(reader.result);
      };
    } else {
      setImage(defaultDP);
    }
  };

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
          onChange={handleImageChange}
          onTouchCancel={() => setImage((current: any) => current)}
          className="sr-only"
        />
        {isUploadingPicture ? (
          <Box className="avatar__isLoading-container">
            <Avatar
              size="7"
              radius="full"
              src={`${image}`}
              fallback={"A"}
              className="avatar__isLoading-picture"
              style={{ backgroundColor: "white" }}
            />
            <Spinner size="3" className="avatar__spinner" />
          </Box>
        ) : (
          <Avatar
            size="7"
            radius="full"
            src={`${image}`}
            fallback={"A"}
            style={{
              backgroundColor: "white",
              border: "1px solid var(--text)",
            }}
          />
        )}
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
            <FormField
              as="textarea"
              inputType="text"
              name="bio"
              label="Bio"
              placeholder="Say something about yourself..."
              value={editedData?.bio}
              onChange={handleChangeEditedData}
            />
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
              <Label.Root className="label__root">Dark Mode </Label.Root>

              <Switch
                onCheckedChange={() => setDarkMode((curr) => !curr)}
                checked={darkMode}
                className="darkmode-switch"
              />
            </Flex>

            {/* Dialog Screen */}
            <AllergyDialog
              allergens={allergens}
              value={allergyInput}
              handleInputChange={handleInputChange}
              handleAddAllergen={handleAddAllergen}
              handleUpdateAllergies={handleUpdateAllergies}
              handleCloseDialog={handleCloseDialog}
            />
            {/* Dialog End */}
          </Section>

          {/* Account Section */}
          <Section className="edit__section">
            <Heading
              as="h2"
              size="4"
              mb="3"
              style={{ fontWeight: "500", fontSize: "1rem" }}
            >
              Account
            </Heading>
            <Flex tabIndex={1} direction="row" justify="between" mb="2">
              <Label.Root className="label__root">Private Account</Label.Root>

              <Switch
                onCheckedChange={() => setPrivateAccount((curr) => !curr)}
                checked={privateAccount}
                className="darkmode-switch"
              />
            </Flex>
            <Button tabIndex={1} className="logout-btn">
              Log out
            </Button>
          </Section>
        </Form.Root>
      </Box>
    </Container>
  );
}

export default EditProfile;
