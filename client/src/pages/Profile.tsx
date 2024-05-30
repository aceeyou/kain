import "./styles/Profile.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import defaultDP from "../assets/default-dp.png";
import { PiSlidersHorizontalBold } from "react-icons/pi";
import { IoPlayCircleOutline } from "react-icons/io5";

import {
  Box,
  Button,
  Flex,
  Skeleton,
  SegmentedControl,
} from "@radix-ui/themes";

import LoadingProfileHeader from "../components/LoadingComponents/LoadingProfileHeader/LoadingProfileHeader";
import Container from "../components/ui/Container";
import PageNavigation from "../components/PageNavigation/PageNavigation";
import UserInformation from "../components/UserInformation/UserInformation";
import RecipeProfile from "../components/RecipeProfile/RecipeProfile";

interface RecipePropType {
  _id: number;
  recipe_name: string;
  image: string;
  cooking_time: number;
  cooking_unit: string;
}

interface FunctionHandlingCard {
  _id: number;
  recipe_name: string;
}

const menuList = ["Recipes", "Minced"];

function Profile() {
  const navigate = useNavigate();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Recipes");
  const [user, setUser] = useState({
    _id: 0,
    fullname: "",
    username: "",
    profilePicture: defaultDP,
    bio: "",
    recipe_count: 0,
    following_count: 0,
    follower_count: 0,
  });
  const [recipesOfUser, setRecipesOfUser] = useState([]);

  useEffect(() => {
    fetchPostedRecipes(user._id);
  }, [navigate, user._id]);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setUserDataLoading(true);
    try {
      await axios
        .get("http://127.0.0.1:8080/profile", { withCredentials: true })
        .then((data: any) => {
          fetchPostedRecipes(data.data._id);
          setUser({ ...data.data });
          setUserDataLoading(false);
        });
    } catch (error: any) {
      console.log("Profile page | fetchProfile: ", error?.message);
    }
  }

  async function fetchPostedRecipes(id: number) {
    setRecipesLoading(true);
    try {
      await axios
        .get("http://127.0.0.1:8080/recipes/" + id, {
          withCredentials: true,
        })
        .then((data) => {
          setRecipesOfUser(data.data);
          setRecipesLoading(false);
        });
    } catch (error: any) {
      console.log("Profile page | fetchRecipes: ", error?.message);
    }
  }

  // function handleChangeActiveTab(tab: string) {
  //   setActiveTab(tab);
  // }

  const handleClickOnCard = (recipe: FunctionHandlingCard) => {
    navigate(
      `/recipe/${recipe?._id}/${recipe?.recipe_name}
        `
    );
  };

  return (
    <Container className="container__profile-page">
      <PageNavigation />
      {userDataLoading ? (
        <LoadingProfileHeader />
      ) : (
        <UserInformation user={user} />
      )}

      <Flex
        direction="row"
        justify="between"
        className="posts__navigation-container"
      >
        <SegmentedControl.Root
          defaultValue={menuList[0]}
          radius="none"
          className="posts__navigation"
        >
          {!!menuList &&
            menuList.map((menu, index: number) => (
              <SegmentedControl.Item
                key={index}
                value={menu}
                onClick={() => setActiveTab(menu)}
                onKeyDown={(key) => key.key === "Enter" && setActiveTab(menu)}
                tabIndex={1}
                className={`posts__nav-item ${activeTab === menu && "active"}`}
              >
                {menu}
                {menu === "Minced" && (
                  <IoPlayCircleOutline
                    size={14}
                    className={`minced-play-icon ${
                      activeTab === "Minced" && "active"
                    }`}
                  />
                )}
              </SegmentedControl.Item>
            ))}
        </SegmentedControl.Root>
        <Button tabIndex={1} style={{ cursor: "pointer" }}>
          <PiSlidersHorizontalBold size={20} className="filter__icon" />
        </Button>
      </Flex>
      {activeTab === "Recipes" && !recipesLoading ? (
        <Box className="posts__recipes">
          {!!recipesOfUser &&
            recipesOfUser.map((recipe: RecipePropType, index: number) => (
              <RecipeProfile
                key={index}
                recipe={recipe}
                handleClick={() => handleClickOnCard(recipe)}
              />
            ))}
        </Box>
      ) : (
        <Box className="posts__recipes">
          <Skeleton height="180px" />
          <Skeleton height="180px" />
          <Skeleton height="180px" />
        </Box>
      )}
      {/* <Loading /> */}
    </Container>
  );
}

export default Profile;
