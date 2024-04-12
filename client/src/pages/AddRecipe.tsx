import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useSelector } from "react-redux";
import { selectUser } from "../reducers/userSlice";
import axios from "axios";
import "./styles/AddRecipe.css";

import { FaArrowLeftLong } from "react-icons/fa6";
import { RiImageAddFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";

function AddRecipe() {
  const navigate = useNavigate();
  const uploadImageRef = useRef();
  const user = useSelector(selectUser);
  const [ingredientsPanel, setIngredientsPanel] = useState(false);
  const [instructionsPanel, setInstructionsPanel] = useState(false);

  const [recipeName, setRecipeName] = useState("");
  const [recipeImage, setImage] = useState();
  const [prepTime, setPrepTime] = useState({ time: 0, unit: "" });
  const [cookTime, setCookTime] = useState({ time: 0, unit: "" });
  const [servings, setServings] = useState<number>();
  const [description, setDescription] = useState("");
  const [ingredientList, setIngredientList] = useState([
    { ingredient: "", quantity: "", unit: "" },
    { ingredient: "", quantity: "", unit: "" },
  ]);
  const [cookingDirections, setCookingDirections] = useState([
    "The quick brown fox jumps over the lazy dog",
  ]);

  function handleAddRecipe() {
    const res = axios.post(
      "http://127.0.0.1:8080/addrecipe",
      {
        recipeName,
        image: recipeImage,
        prepTime,
        cookTime,
        servings,
        description,
        ingredients: ingredientList,
        instructions: cookingDirections,
        // userId: user.user,
      },
      { withCredentials: true }
    );

    if (!!res) navigate("/profile");
  }

  const handleLeftElement = () => {
    navigate("/profile");
  };
  const handleUploadImageRef = (e) => {
    e.preventDefault();
    uploadImageRef.current.click();
  };

  function handleImageChange(e: any) {
    e.preventDefault();
    try {
      if (e?.target?.files.length > 0) {
        let file = e?.target?.files[0];

        transformFile(file);
      } else {
        console.log("empty");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // transform images to base64
  const transformFile = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
        // handleUpload(reader.result);
      };
    } else {
      console.log("empty");
      setImage();
    }
  };

  const handleMoveStep = (where: string, index: number) => {
    let bubble = cookingDirections[index];
    let steps = [...cookingDirections];

    if (where === "up") {
      steps[index] = steps[index - 1];
      steps[index - 1] = bubble;
    }

    if (where === "down") {
      steps[index] = steps[index + 1];
      steps[index + 1] = bubble;
    }
    setCookingDirections([...steps]);
    return;
  };

  return (
    <div className="container__add-recipe">
      <Navigation
        leftElement={<FaArrowLeftLong />}
        handleLeftElement={handleLeftElement}
        title="Add Recipe"
        rightElement={"save"}
        handleRightElement={handleAddRecipe}
      />
      <main>
        <form>
          <div>
            <label htmlFor="recipeName">Recipe Name</label>
            <input
              type="text"
              name="recipeName"
              id="recipeName"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
            />
          </div>
          <div
            className="recipe__image-upload-btn"
            style={{ backgroundImage: `url(${recipeImage})` }}
          >
            <>
              <label htmlFor="recipeImage" className="sr-only">
                Upload recipe image
              </label>
              <input
                ref={uploadImageRef}
                type="file"
                name="recipeImage"
                id="recipeImage"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <RiImageAddFill size={60} />
              <button onClick={handleUploadImageRef}>Upload Image</button>
            </>
          </div>
          {/* time */}
          <div className="cooking-time-input-container">
            <div>
              <label htmlFor="preparationTime">Preparation Time</label>
              <div>
                <input
                  type="number"
                  min="0"
                  name="preparationTime"
                  id="preparationtime"
                  value={prepTime.time}
                  onChange={(e) => {
                    setPrepTime({
                      ...prepTime,
                      time: Number(e.target.value),
                    });
                  }}
                />
                <select
                  name="preparationTimeUnit"
                  id="preparationTimeUnit"
                  value={prepTime.unit}
                  onChange={(e) =>
                    setPrepTime({ ...prepTime, unit: e.target.value })
                  }
                >
                  <option value="sec">sec</option>
                  <option value="min">min</option>
                  <option value="hr">hr</option>
                  <option value="day">day</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="cookingTime">Cooking Time</label>
              <div>
                <input
                  type="number"
                  min="0"
                  name="cookingTime"
                  id="cookingtime"
                  value={cookTime.time}
                  onChange={(e) => {
                    setCookTime({
                      ...cookTime,
                      time: Number(e.target.value),
                    });
                  }}
                />
                <select
                  name="cookingTimeUnit"
                  id="cookingTimeUnit"
                  value={cookTime.unit}
                  onChange={(e) =>
                    setCookTime({ ...prepTime, unit: e.target.value })
                  }
                >
                  <option value="sec">sec</option>
                  <option value="min">min</option>
                  <option value="hr">hr</option>
                  <option value="day">day</option>
                </select>
              </div>
            </div>
          </div>

          <div className="servings-grp">
            <label>Servings</label>
            <input
              type="number"
              name="servings"
              id="servings"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
          </div>

          {/* description */}
          <div className="description-container">
            <label htmlFor="description">Description</label>
            <textarea
              autoComplete="false"
              autoCorrect="false"
              name="description"
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* expandable || Ingredients */}
          <div className="ingredients-section-container">
            <div className="ingredients__header">
              <div>
                <label htmlFor="ingredients">Ingredient</label>
              </div>
              <div
                style={{
                  transform: `${
                    ingredientsPanel ? "rotate(-180deg)" : "rotate(0deg)"
                  }`,
                  transition: "150ms",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setIngredientsPanel((curr) => !curr);
                }}
              >
                <FaChevronDown />
              </div>
            </div>
            {/* content */}
            {ingredientsPanel && (
              <div className={"expandable__content"}>
                <ul>
                  <li>
                    <div className="sr-only"></div>
                    <p>Quantity</p>
                    <p>Unit</p>
                  </li>
                  {!!ingredientList &&
                    ingredientList.map((ingredient, index) => (
                      <li key={index}>
                        <input
                          type="text"
                          name="ingredient"
                          placeholder={`Ingredient ${index + 1}`}
                          value={ingredient.ingredient}
                          onChange={(e) => {
                            const temp = [...ingredientList];
                            temp[index] = {
                              ...temp[index],
                              ingredient: e.target.value,
                            };
                            setIngredientList([...temp]);
                          }}
                        />
                        <input
                          type="text"
                          name="quantity"
                          id=""
                          value={ingredient.quantity}
                          onChange={(e) => {
                            let temp = [...ingredientList];
                            temp[index] = {
                              ...temp[index],
                              quantity: e.target.value,
                            };
                            setIngredientList([...temp]);
                          }}
                        />
                        <input
                          type="text"
                          name="unit"
                          id=""
                          value={ingredient.unit}
                          onChange={(e) => {
                            let temp = [...ingredientList];
                            temp[index] = {
                              ...temp[index],
                              unit: e.target.value,
                            };
                            setIngredientList([...temp]);
                          }}
                        />
                      </li>
                    ))}
                </ul>
                <div
                  className="ingredient__add-btn"
                  onClick={() => {
                    if (
                      ingredientList[ingredientList.length - 1].ingredient !==
                      ""
                    ) {
                      setIngredientList((cur) => [
                        ...cur,
                        { ingredient: "", quantity: "", unit: "" },
                      ]);
                    }
                  }}
                >
                  <IoMdAdd size={22} />
                  <span>Add another ingredient</span>
                </div>
                {/* {ingredientList[ingredientList.length - 1].ingredient ===
                  "" && (
                  <div>
                    <p>
                      Fill-out the empty ingredient field before adding another
                      ingredient
                    </p>
                  </div>
                )} */}
              </div>
            )}
          </div>

          {/* expandable instructions */}
          <div className="ingredients-section-container instructions">
            <div className="ingredients__header">
              <div>
                <label htmlFor="ingredients">Cooking Directions</label>
              </div>
              <div
                style={{
                  transform: `${
                    instructionsPanel ? "rotate(-180deg)" : "rotate(0deg)"
                  }`,
                  transition: "150ms",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setInstructionsPanel((curr) => !curr);
                }}
              >
                <FaChevronDown />
              </div>
            </div>
            {/* content */}
            {instructionsPanel && (
              <div className={`expandable__content instruction__section`}>
                <ul>
                  {!!cookingDirections &&
                    cookingDirections.map((instruction, index) => (
                      <li key={index}>
                        <div className="instruction__controls">
                          <span>{index + 1}</span>
                          <div className="instruction__controls-btns">
                            {index !== 0 && (
                              <div onClick={() => handleMoveStep("up", index)}>
                                ⬆️
                              </div>
                            )}
                            {index !== cookingDirections.length && (
                              <div
                                onClick={() => handleMoveStep("down", index)}
                              >
                                ⬇️
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="instruction__content">
                          <textarea
                            name="instruction"
                            cols={100}
                            rows={4}
                            placeholder={`Instruction ${index + 1}`}
                            value={instruction}
                            onChange={(e) => {
                              const temp = [...cookingDirections];
                              temp[index] = e.target.value;
                              setCookingDirections([...temp]);
                            }}
                          >
                            {instruction}
                          </textarea>
                        </div>
                      </li>
                    ))}
                </ul>
                <div
                  className="ingredient__add-btn"
                  onClick={() => {
                    if (
                      cookingDirections[cookingDirections.length - 1] !== ""
                    ) {
                      setCookingDirections((cur) => [...cur, ""]);
                    }
                  }}
                >
                  <IoMdAdd size={22} />
                  <span>Add another step</span>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddRecipe;
