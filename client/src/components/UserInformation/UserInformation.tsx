// import { useRef, useState } from "react";
// import axios from "axios";
import "./UserInformation.css";
import { Link } from "react-router-dom";

// import defaultDP from "../../assets/default-dp.png";
import * as Avatar from "@radix-ui/react-avatar";
import { Container, Section, Text, Box } from "@radix-ui/themes";

interface PropTypes {
  user: {
    _id: number;
    profilePicture: string;
    fullname: string;
    username: string;
    recipe_count: number;
    follower_count: number;
  };
}

function UserInformation({ user }: PropTypes) {
  //   const fileRef = useRef<HTMLInputElement | null>(null);
  //   const [image, setImage] = useState(user?.profilePicture);

  //   const handleUpload = async (file: any) => {
  //     try {
  //       const res = await axios.post(
  //         "http://127.0.0.1:8080/uploadProfilePicture",
  //         {
  //           userId: user._id,
  //           image: file,
  //         },
  //         { withCredentials: true }
  //       );
  //       if (res) {
  //         setImage(res.data.profilePicture);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   function handleImageChange(e: any) {
  //     if (e?.target?.files.length > 0) {
  //       const file: any = e?.target?.files[0];

  //       transformFile(file);
  //     } else return;
  //   }

  //   // transform images to base64
  //   const transformFile = (file: any) => {
  //     const reader = new FileReader();

  //     if (file) {
  //       reader.readAsDataURL(file);
  //       reader.onloadend = () => {
  //         handleUpload(reader.result);
  //       };
  //     } else {
  //       setImage(defaultDP);
  //     }
  //   };

  return (
    <Container>
      <Box className="userInfo__container">
        <Box className="userInfo__left-container">
          {/* <input
            ref={fileRef}
            type="file"
            name="fileDialog"
            className="sr-only"
            style={{ display: "none" }}
            onChange={handleImageChange}
            onTouchCancel={() => setImage((current) => current)}
            accept="image/png, image/jpeg"
        /> */}
          {/* <img
                src={current}
                className="profile__display-picture"
                alt="profile picture"
                onClick={() => {
                    fileRef?.current?.click();
                }}
            /> */}
          <Avatar.Root>
            <Avatar.Image
              className="userInfo__avatar-img"
              src={`${user?.profilePicture}`}
              alt={`${user?.username} Picture`}
            />
            <Avatar.Fallback
              className="userInfo__avatar-fallback"
              delayMs={600}
            >
              {user?.fullname[0]?.toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
        </Box>
        <Section size="1" className="userInfo__right-container">
          <div className="top">
            <div className="userInfo__user">
              <h1 className="userInfo__user-name">{user?.fullname}</h1>
              <p className="userInfo__user-username">@{user?.username}</p>
              <div className="bottom userInfo__metrics">
                <p className="recipes">{user?.recipe_count} recipes</p>
                <span>•</span>
                <p className="followers">{user?.follower_count} followers</p>
              </div>
            </div>
            <Link to={"/"} className="userInfo__edit-btn-container">
              <button>Edit Profile</button>
            </Link>
          </div>
        </Section>
      </Box>
      <Section size="1" className="userInfo__bio">
        <Text as="p">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
          provident fugiat officiis vitae et cum dolore, animi amet consequatur
          beatae.
        </Text>
      </Section>
    </Container>
  );
}

export default UserInformation;
