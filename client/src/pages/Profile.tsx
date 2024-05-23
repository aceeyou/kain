import "./styles/Profile.css";

import { FaFilter } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoPlayCircleOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { GoCopy } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import defaultDP from "../assets/default-dp.png";
import PageNavigation from "../components/PageNavigation/PageNavigation";
import UserInformation from "../components/UserInformation/UserInformation";
import { Box, Container } from "@radix-ui/themes";
import * as Menubar from "@radix-ui/react-menubar";
import Recipe from "../components/Recipe/Recipe";

// axios.defaults.withCredentials = true;

const menuList = ["Recipes", "Minced"];

function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Recipes");
  const [user, setUser] = useState({
    _id: 0,
    fullname: "",
    username: "",
    profilePicture: defaultDP,
    recipe_count: 0,
    following_count: 0,
    follower_count: 0,
  });
  const [image, setImage] = useState(user?.profilePicture || defaultDP);
  const [recipesOfUser, setRecipesOfUser] = useState([]);

  useEffect(() => {
    fetchPostedRecipes(user._id);
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    await axios
      .get("http://127.0.0.1:8080/profile", { withCredentials: true })
      .then((data: any) => {
        fetchPostedRecipes(data.data._id);
        setUser({ ...data.data });
        setImage(data.data.profilePicture);
      });

    // console.log(user);
  }

  async function fetchPostedRecipes(id: number) {
    await axios
      .get("http://127.0.0.1:8080/recipes/" + id, {
        withCredentials: true,
      })
      .then((data) => {
        setRecipesOfUser(data.data);
      });
    // if (recipes) console.log(recipes);
  }

  function handleChangeActiveTab(tab: string) {
    setActiveTab(tab);
  }

  const handleUpload = async (file: any) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8080/uploadProfilePicture",
        {
          userId: user._id,
          image: file,
        },
        { withCredentials: true }
      );
      if (res) {
        setImage(res.data.profilePicture);
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
        handleUpload(reader.result);
      };
    } else {
      setImage(defaultDP);
    }
  };

  return (
    <Container className="container__profile-page">
      <PageNavigation />
      <UserInformation user={user} />

      <Menubar.Root className="posts__navigation">
        {!!menuList &&
          menuList.map((menu) => (
            <Menubar.Menu key={menu}>
              <Menubar.Trigger
                onClick={() => setActiveTab(menu)}
                tabIndex={1}
                className={`posts__nav-item ${activeTab === menu && "active"}`}
              >
                {menu}
              </Menubar.Trigger>
            </Menubar.Menu>
          ))}
      </Menubar.Root>
      {activeTab === "Recipes" && (
        <Box className="posts__recipes">
          {!!recipesOfUser &&
            recipesOfUser.map((recipe, index) => (
              <Recipe
                key={index}
                recipe={recipe}
                owner={true}
                handleOnClick={() => {
                  navigate(
                    `/recipe/${recipe?._id}/${recipe?.recipe_name}
                      `
                  );
                }}
              />
            ))}
        </Box>
      )}
    </Container>
  );
}

export default Profile;
