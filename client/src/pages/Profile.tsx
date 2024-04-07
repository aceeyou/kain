import { useSelector } from "react-redux";
import { selectUser } from "../reducers/userSlice";
import "./styles/Profile.css";

import { FaFilter } from "react-icons/fa";
import { IoMdAdd, IoMdHeartEmpty } from "react-icons/io";
import { IoPlayCircleOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { GoCopy } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import defaultDP from "../assets/default-dp.png";

// axios.defaults.withCredentials = true;

function Profile() {
  // const user: any = useSelector(selectUser);
  const fileRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState({
    _id: "",
    fullname: "",
    username: "",
    profilePicture: defaultDP,
    recipe_count: 0,
    following_count: 0,
    follower_count: 0,
  });
  const [image, setImage] = useState(user?.profilePicture);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    await axios
      .get("http://127.0.0.1:8080/profile", { withCredentials: true })
      .then((data: any) => {
        setUser({ ...data.data });
        setImage(data.data.profilePicture);
      });

    // console.log(user);
  }

  function handleChangeActiveTab(tab: string) {
    setActiveTab(tab);
  }

  function handleImageChange(e: Event | null) {
    if (e?.target?.files.length > 0) {
      let file = e?.target?.files[0];

      transformFile(file);
    } else return;
  }

  const handleUpload = async (file) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8080/uploadProfilePicture",
        {
          userId: user._id,
          image: file,
        }
      );
      if (res) {
        setImage(res.data.profilePicture);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // transform images to base64
  const transformFile = (file) => {
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
    <div className="container__profile-page">
      <header>
        <div className="nav__logo-container">
          <h1 className="h2 nav__logo">kain</h1>
        </div>
        <nav>
          <ul>
            <li>
              <FaFilter />
            </li>
            <li onClick={() => navigate("/addrecipe")}>
              <IoMdAdd size={20} />
            </li>
            <li>
              <CiMenuKebab size={16} />
            </li>
          </ul>
        </nav>
      </header>
      <div className="profile__container">
        <div className="profile__left-container">
          <div>
            <input
              ref={fileRef}
              type="file"
              name="fileDialog"
              className="sr-only"
              style={{ display: "none" }}
              onChange={handleImageChange}
              onTouchCancel={() => setImage(file)}
              accept="image/png, image/jpeg"
            />
            <img
              src={image}
              className="profile__display-picture"
              alt="profile picture"
              onClick={() => {
                fileRef.current.click();
              }}
            />
          </div>
        </div>
        <div className="profile__right-container">
          <div className="top">
            <div className="profile__user">
              <h1 className="profile__user-name">{user?.fullname}</h1>
              <p className="profile__user-username">@{user?.username}</p>
            </div>
            <div className="profile__edit-btn-container">
              <button>Edit Profile</button>
            </div>
          </div>
          <div className="bottom profile__metrics">
            <div className="recipes">
              <p>{user?.recipe_count}</p>
              <span>recipes</span>
            </div>
            <div className="following">
              <p>{user?.following_count}</p>
              <span>following</span>
            </div>
            <div className="followers">
              <p>{user?.follower_count}</p>
              <span>followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="posts">
        <div className="post__navigation">
          <div
            style={{
              borderBottom: activeTab === "posts" ? "1px solid black" : "none",
            }}
            onClick={() => handleChangeActiveTab("posts")}
          >
            <GoCopy size={22} />
          </div>
          <div
            style={{
              borderBottom: activeTab === "saved" ? "1px solid black" : "none",
            }}
            onClick={() => handleChangeActiveTab("saved")}
          >
            <IoMdHeartEmpty size={22} />
          </div>
          <div
            style={{
              borderBottom: activeTab === "minced" ? "1px solid black" : "none",
            }}
            onClick={() => handleChangeActiveTab("minced")}
          >
            <IoPlayCircleOutline size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
