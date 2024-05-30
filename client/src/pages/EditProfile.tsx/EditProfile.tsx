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
import * as ToastRadix from "@radix-ui/react-toast";

import Container from "../../components/ui/Container";
import Navigation from "../../components/Navigation/Navigation";
import FormField from "../../components/Forms/FormField/FormField";
import AllergyDialog from "../../components/AllergyDialog/AllergyDialog";
import Toast from "../../components/Toast/Toast";

interface UserDataProps {
  _id: number;
  fullname: string;
  username: string;
  bio: string;
  profilePicture: string;
  private: number;
}

type AllergyListType = string[];

function EditProfile() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [allergens, setAllergens] = useState<AllergyListType>([""]);
  const [allergyInput, setAllergyInput] = useState("");
  const [editedData, setEditedData] = useState<UserDataProps>({
    _id: 0,
    fullname: "",
    username: "",
    profilePicture: "",
    bio: "",
    private: 0,
  });
  const [image, setImage] = useState(editedData?.profilePicture || defaultDP);
  const [usernameQeury, setUsernameQuery] = useState(editedData.username);

  // State Trackers
  const [usernameIsTaken, setUsernameIsTaken] = useState(false);
  const [usernameToastOpen, setUsernameToastOpen] = useState(usernameIsTaken);
  const [hasChanges, setHasChanges] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [loadRawUserData, setLoadRawUserData] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [allergyUpdated, setAllergyUpdated] = useState(false);

  useEffect(() => {
    fetchProfile();

    return () => {
      setEditedData({
        _id: 0,
        fullname: "",
        username: "",
        profilePicture: "",
        bio: "",
        private: 0,
      });
    };
  }, []);

  // THIS USEEFFECT HOOK TRACKS THE CHANGES IN THE USERNAME INPUT AND CHECKS IF THE CANDIDATE USERNAME IS ALREADY IN USE BY ANOTHER USER
  useEffect(() => {
    if (usernameQeury === editedData.username) return;
    const usernameCheck = setTimeout(checkUsernameAvailability, 300);

    async function checkUsernameAvailability() {
      try {
        await axios
          .post(
            "http://127.0.0.1:8080/usernamechecker",
            { username: usernameQeury },
            { withCredentials: true }
          )
          .then((res) => {
            if (res.data) {
              setUsernameIsTaken(true);
              console.log(res);
              return;
            }
            return setUsernameIsTaken(false);
          });
      } catch (error) {
        setUsernameIsTaken(false);
        console.log(error);
      }
    }

    return () => clearTimeout(usernameCheck);
  }, [usernameQeury, editedData.username]);

  useEffect(() => {
    setHasChanges(true);
  }, [editedData]);

  async function fetchProfile() {
    setLoadRawUserData(true);
    try {
      await axios
        .get("http://127.0.0.1:8080/profile", { withCredentials: true })
        .then((data: any) => {
          setUsernameQuery(data.data.username);
          setPrivateAccount(Boolean(data.data.private));
          setImage(data.data.profilePicture);
          setEditedData({ ...data.data });
          setAllergens([...data.data.allergies]);
          setLoadRawUserData(false);
        });
    } catch (error: any) {
      setLoadRawUserData(false);

      console.log("Edit profile page | fetchProfile: ", error?.message);
      return;
    }
  }

  async function updateUserProfile() {
    if (!hasChanges) return;
    setIsUpdatingProfile(true);
    try {
      await axios
        .post(
          "http://127.0.0.1:8080/profile/update-profile",
          {
            fullname: editedData.fullname,
            username: usernameQeury,
            bio: editedData.bio,
            acc_private: privateAccount ? 1 : 0,
          },
          { withCredentials: true }
        )
        .then(() => {
          setIsUpdatingProfile(false);
          fetchProfile();
        });
    } catch (error: any) {
      setIsUpdatingProfile(false);
      setUsernameToastOpen(true);
      if (error.response.data.status === "taken") setUsernameIsTaken(true);
    }
  }

  // HANDLES THE CHANGE EVENT OF THE INPUTS NAME, USERNAME, AND BIO
  function handleChangeEditedData(name: string, newData: string) {
    if (name === "username") {
      setUsernameQuery(newData);
      return;
    }
    setEditedData({ ...editedData, [name]: newData });
    setHasChanges(true);
  }
  // END

  // HANDLES THE ALLERGY SECTION OF THE PROFILE PAGE
  // THESE ARE THE FUNCTION FOR OPENNING THE DIALOG OF THE ALLERGY TO UPDATING THE LIST AND MIRRORING THE LIST TO THE DATABASE
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAllergyInput(e.target.value);
  }

  function handleAddAllergen(list: string[]) {
    setAllergens([...list]);
    setAllergyInput("");
    setHasChanges(true);
  }

  function handleUpdateAllergies(
    list: string[],
    added: string[],
    removed: string[]
  ) {
    setAllergens([...list]);
    handleCloseDialog();

    // update allergies to db
    if (removed.length > 0) handleUploadRemovedAllergy(removed);
    if (added.length > 0) handleUploadAddedAllergy(added);
  }

  const handleCloseDialog = () => {
    setAllergyInput("");
  };

  async function handleUploadAddedAllergy(list: string[]) {
    try {
      await axios
        .post(
          "http://127.0.0.1:8080/add-allergies",
          { allergies: list },
          { withCredentials: true }
        )
        .then((res: any) => {
          if (res.status === 201) setAllergyUpdated(true);
        });
    } catch (error: any) {
      console.log("handle upload added allergy: ", error);
      if (error.status === 409) setAllergyUpdated(true);
    }
  }

  async function handleUploadRemovedAllergy(list: string[]) {
    try {
      await axios
        .post(
          "http://127.0.0.1:8080/remove-allergies",
          { allergies: list },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 201) setAllergyUpdated(true);
        });
    } catch (error) {
      console.log("handle upload removed allergy: ", error);
    }
  }
  // END

  // HANDLES THE EVENT OF CHANGING THE PROFILE PICTURE
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

  const handleImageChange = (e: any) => {
    if (e?.target?.files.length > 0) {
      const file: any = e?.target?.files[0];

      transformFile(file);
    } else return;
  };

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
  // END

  return (
    <ToastRadix.Provider swipeDirection="right">
      <ToastRadix.Viewport className="ToastViewport" />
      {loadRawUserData}
      <Container>
        {/* Display toast when a username is already taken by another user */}
        <Toast
          open={usernameToastOpen}
          onOpenChange={setUsernameToastOpen}
          message="Username is already taken"
        />
        {/* Display toast when the user's allergy list is successfully updated */}
        <Toast
          open={allergyUpdated}
          onOpenChange={setAllergyUpdated}
          message="Allergy list updated"
        />

        {/* content */}
        <Navigation
          title="Edit Profile"
          handleRightButton={updateUserProfile}
          isLoading={isUpdatingProfile}
        />
        <Flex
          role="button"
          tabIndex={0}
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
            title="Open file selector panel"
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
              loading="lazy"
              alt="User's profile picture"
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
                value={usernameQeury}
                onChange={handleChangeEditedData}
                isTaken={usernameIsTaken}
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
                  title="dark mode switch"
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
                setAllergyInput={setAllergyInput}
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
              <Flex direction="row" justify="between" mb="2">
                <Label.Root className="label__root">Private Account</Label.Root>

                <Switch
                  onCheckedChange={() => setPrivateAccount((curr) => !curr)}
                  checked={privateAccount}
                  className="darkmode-switch"
                  title="private account switcher"
                />
              </Flex>
              <Button
                tabIndex={0}
                className="logout-btn"
                title="log out button"
              >
                Log out
              </Button>
            </Section>
          </Form.Root>
        </Box>
      </Container>
    </ToastRadix.Provider>
  );
}

export default EditProfile;
