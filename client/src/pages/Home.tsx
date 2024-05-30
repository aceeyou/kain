import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Home.css";

// react icons
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";

// Radix
import {
  Container,
  Badge,
  ScrollArea,
  Button,
  Flex,
  Heading,
  Grid,
  Section,
  Box,
} from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Avatar from "@radix-ui/react-avatar";

// Components
import Logo from "../components/Logo";
import SearchBox from "../components/SearchBox/SearchBox";
import Recipe from "../components/Recipe/Recipe";

// types
type OnSubmitHandler = (e: React.FormEvent<HTMLInputElement>) => void;

interface FunctionHandlingCard {
  _id: number;
  recipe_name: string;
  recipe_owner: string;
}

// Dummy Data
const list = [
  "All",
  "Burger",
  "Pie",
  "Ice Cream",
  "Pasta",
  "Bread",
  "Shake",
  "Milktea",
  "Milkshake",
];

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [user, setUser] = useState({
    id: "",
    username: "",
    fullname: "",
    profilePicture: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // get current theme (light mode or dark mode)
    // const theme = window.matchMedia("(prefers-color-scheme: dark)");
    // console.log(theme.matches);

    // LATER CHANGE TO FETCH USER DATA AND RECIPES
    async function verifyToken() {
      await axios
        .get("http://127.0.0.1:8080/profile", {
          withCredentials: true,
        })
        .then((data: any) => {
          setUser({ ...data.data });
        })
        .catch((err) => {
          console.log(err);
          navigate("/login");
        });
    }

    async function getRecipes() {
      try {
        await axios
          .get("http://127.0.0.1:8080/recipes", { withCredentials: true })
          .then((res) => {
            console.log("recipes | home: ", res);
            setRecipes(res.data);
          });
      } catch (error: any) {
        console.log(error.message);
      }
    }

    verifyToken();
    getRecipes();
  }, [navigate]);

  const handleOnSubmit: OnSubmitHandler = (e) => {
    e.preventDefault();
    console.log("hi");
  };

  const handleClickOnCard = (recipe: FunctionHandlingCard) => {
    navigate(
      `/recipe/${recipe?._id}/${recipe?.recipe_name}
        `
    );
  };
  return (
    <Container size="1" align="center" className="home__container">
      <NavigationMenu.Root className="home__menubar">
        <Logo
          align="left"
          size="6"
          style={{ marginRight: "auto", letterSpacing: "-3px" }}
          className=""
        />
        <NavigationMenu.List className="home__ul-list-container">
          <NavigationMenu.Item className="home__li">
            <NavigationMenu.Trigger className="home__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={""}
                className="home__shopping-bag home__li-btn-link"
              >
                <Badge
                  size="1"
                  color="orange"
                  variant="solid"
                  radius="full"
                  tabIndex={-1}
                  className="home__badge"
                >
                  2
                </Badge>
                <RiShoppingBasket2Fill tabIndex={-1} size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>

          <NavigationMenu.Item className="home__li">
            <NavigationMenu.Trigger className="home__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={""}
                className="home__favorites home__li-btn-link"
              >
                <FaHeart tabIndex={-1} size={24} />
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Item className="home__li">
            <NavigationMenu.Trigger className="home__li-btn">
              <Link
                role="button"
                tabIndex={1}
                to={"/profile"}
                className="home__avatar home__li-btn-link"
              >
                <Avatar.Root>
                  <Avatar.Image
                    className="home__avatar-img"
                    src={`${user?.profilePicture}`}
                    alt={`${user?.username} Picture`}
                  />
                  <Avatar.Fallback
                    className="home__avatar-fallback"
                    delayMs={500}
                  >
                    {user?.fullname[0]?.toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Link>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      {/* Search bar */}
      <SearchBox handleOnSubmit={handleOnSubmit} />
      <ScrollArea
        className="home__scrollable"
        type="auto"
        scrollbars="horizontal"
        size="1"
        style={{ paddingBottom: "15px" }}
      >
        <Flex direction="row">
          {list.map((item, index) => (
            <Button
              className={`home__scrollable-btn-item ${
                activeCategory === item ? "home__active-category" : ""
              }`}
              variant="soft"
              key={index}
              onClick={() => setActiveCategory(item)}
            >
              {item}
            </Button>
          ))}
        </Flex>
      </ScrollArea>

      <Section py="0">
        <Heading as="h2" size="3" className="home__recipe-heading">
          Popular
        </Heading>
        <ScrollArea
          scrollbars="horizontal"
          className="home__recipe-scrollbar-container"
        >
          <Flex direction="row" gap="2" className="home__recipe-scrollbar-flex">
            {!!recipes &&
              recipes.map((recipe: any, index: number) => (
                <Recipe
                  key={index}
                  recipe={recipe}
                  handleClick={() => handleClickOnCard(recipe)}
                />
              ))}
          </Flex>
        </ScrollArea>
      </Section>

      <Section mt="0" mb="0">
        <Heading as="h2" size="2" className="home__recipe-heading">
          Recipes
        </Heading>
        <Grid gap="2" className="home__discover-recipes">
          {!!recipes &&
            recipes.map((recipe: any, index: number) => (
              <Recipe
                key={index}
                recipe={recipe}
                handleClick={() => handleClickOnCard(recipe)}
              />
            ))}
        </Grid>
      </Section>
    </Container>
  );
}

export default Home;
