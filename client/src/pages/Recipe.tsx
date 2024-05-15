import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import axios from "axios";

import { FaArrowLeftLong, FaChevronDown } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  PiCookingPot,
  PiKnifeDuotone,
  PiDotsThreeCircle,
} from "react-icons/pi";
import { RiEdit2Line } from "react-icons/ri";

import "./styles/Recipe.css";
import { useEffect, useState } from "react";

//  TYPESCRIPT
interface ResultTypes {
  image: string;
  data: [image: string];
}

interface RecipeTypes {
  recipe_name?: string | "";
  image?: string | "";
  preparation_time?: number | 0;
  preparation_unit?: string | "";
  cooking_time?: number | 0;
  cooking_unit?: string | "";
  description?: string | "";
  servings?: number | 0;
}

interface IngredientTypes {
  ingredient?: string[];
}

function Recipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<RecipeTypes>({});
  const [ingredients, setIngredients] = useState<IngredientTypes>([]);
  const [steps, setSteps] = useState([]);
  const [ticked, setTicked] = useState([]);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  useEffect(() => {
    fetchRecipeData();
  }, [id, navigate]);

  async function fetchRecipeData() {
    const result: ResultTypes = await axios.get(
      `http://127.0.0.1:8080/recipe/${id}`,
      {
        withCredentials: true,
      }
    );
    if (result) setRecipe({ ...result.data[0] });
  }

  async function fetchIngredients() {
    const result = await axios.get(
      `http://127.0.0.1:8080/recipe/ingredients/${id}`,
      { withCredentials: true }
    );
    if (result) setIngredients([...result?.data]);
  }

  async function fetchSteps() {
    const result = await axios.get(`http://127.0.0.1:8080/recipe/steps/${id}`, {
      withCredentials: true,
    });
    if (result) setSteps([...result?.data]);
  }

  const handleLeftElement = () => {
    navigate(-1);
  };

  const handleRightElement = () => {
    setIsMenuOpened((cur) => !cur);
  };
  return (
    <div className="page--container">
      <div className="recipe__page">
        <Navigation
          leftElement={<FaArrowLeftLong />}
          handleLeftElement={handleLeftElement}
          title="Recipe"
          rightElement={<PiDotsThreeCircle size={22} />}
          handleRightElement={handleRightElement}
        />

        {isMenuOpened && (
          <div className="post_menu">
            <ul>
              <li tabIndex={1}>
                <RiEdit2Line /> Edit Recipe
              </li>
              <li tabIndex={1}>
                <FaRegTrashAlt /> Delete
              </li>
            </ul>
          </div>
        )}

        <h1 className="recipe__recipe-name">{recipe?.recipe_name}</h1>
        <div className="recipe__prepared-by">
          <p className="recipe__prepared-by-username">by @username</p>
        </div>
        <div className="recipe__image-container">
          <img
            src={recipe?.image}
            alt="background image"
            className="recipe__background-image"
            loading="lazy"
          />
          <img
            className="recipe__recipe-image"
            src={recipe?.image}
            alt={recipe?.recipe_name}
            loading="lazy"
          />
        </div>

        <div className="recipe__prepcook-time-container">
          <p className="recipe__prep">
            <PiKnifeDuotone />{" "}
            <span className="recipe__prep-time">
              {recipe?.preparation_time}
              {recipe?.preparation_unit}
            </span>
          </p>
          <p className="recipe__cook">
            <PiCookingPot />{" "}
            <span className="recipe__cook-time">
              {recipe?.cooking_time}
              {recipe?.cooking_unit}
            </span>
          </p>
        </div>
        <div className="recipe__description">
          {/* <h2>Description</h2> */}
          <p className="recipe__description-content">{recipe?.description}</p>
        </div>

        {/* Ingredients Section */}
        <div className="recipe__ingredients-container">
          <div className="ingredients-container__top">
            <div className="ingredients-container__left">
              <h2 className="ingredients-container__title">Ingredients</h2>
              <p className="ingredients-container__servings">{`(${recipe?.servings} servings)`}</p>
            </div>
            <div
              className="ingredients-container__right"
              tabIndex={1}
              role="button"
              onClick={() => {
                setIngredientsExpanded((cur) => !cur);
                if (!ingredientsExpanded && !!ingredients) {
                  fetchIngredients();
                }
              }}
              style={{
                transform: `${
                  ingredientsExpanded ? "rotate(-180deg)" : "rotate(0deg)"
                }`,
                transition: "150ms",
              }}
            >
              <FaChevronDown />
            </div>
          </div>
          {ingredientsExpanded && (
            <div
              className="ingredients__content"
              style={{
                height: `${ingredientsExpanded ? "100%" : "0"}`,
                transition: "200ms",
              }}
            >
              {!!ingredients &&
                ingredients?.map((ingredient, index: number) => (
                  <div key={index} className="ingredients__ingredient">
                    <div className="ingredients__name-group">
                      <input
                        type="checkbox"
                        name="ingredient"
                        value={ingredient?.ingredient}
                        className="ingredients__checkbox"
                        checked={ticked.includes(index)}
                        onChange={(e) => {
                          let temp = [...ticked];
                          if (e.target.checked) {
                            temp.push(index);
                          } else {
                            temp = ticked.filter(
                              (element) => element !== index
                            );
                          }
                          setTicked([...temp]);
                        }}
                      />
                      <p key={index} className="ingrdients__ingredient-name">
                        {ingredient?.ingredient}
                      </p>
                    </div>
                    <div className="ingredients__measurement-group">
                      <p className="ingredients__quantity">
                        {ingredient?.quantity} {ingredient?.unit}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Steps Sections */}
        <div className="recipe__steps-container">
          <div className="steps-container__top">
            <div className="steps-container__left">
              <h2 className="steps-container__title">Cooking Directions</h2>
            </div>
            <div
              className="steps-container__right"
              tabIndex={1}
              role="button"
              onClick={() => {
                setStepsExpanded((cur) => !cur);
                if (!stepsExpanded && !!steps) {
                  fetchSteps();
                }
              }}
              style={{
                transform: `${
                  stepsExpanded ? "rotate(-180deg)" : "rotate(0deg)"
                }`,
                transition: "150ms",
              }}
            >
              <FaChevronDown />
            </div>
          </div>
          {stepsExpanded && (
            <div className="steps__content">
              {!!steps &&
                steps.map((step, index: number) => (
                  <div key={index} className="steps__steps">
                    <div className="step__order-container">
                      <span className="step__order-number">{index + 1}</span>
                    </div>
                    <p key={index} className="step__step-content">
                      {step?.step}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* <div className="recommendations">
        <h2>Recomendations</h2>
      </div> */}
    </div>
  );
}

export default Recipe;
