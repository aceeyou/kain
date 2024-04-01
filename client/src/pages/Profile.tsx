import { useSelector } from "react-redux";
import { selectUser } from "../reducers/userSlice";
import "./styles/Profile.css";

import { FaFilter } from "react-icons/fa";
import { IoMdAdd, IoMdHeartEmpty } from "react-icons/io";
import { IoPlayCircleOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { GoCopy } from "react-icons/go";
import { useState } from "react";

function Profile() {
  const user: any = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState(1);

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
            <li>
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
            <p>hi</p>
          </div>
        </div>
        <div className="profile__right-container">
          <div className="top">
            <div className="profile__user">
              <h1 className="profile__user-name">{user?.user.fullname}</h1>
              <p className="profile__user-username">@{user?.user.username}</p>
            </div>
            <div className="profile__edit-btn-container">
              <button>Edit Profile</button>
            </div>
          </div>
          <div className="bottom profile__metrics">
            <div className="recipes">
              <p>{user.user.recipe_count}</p>
              <span>recipes</span>
            </div>
            <div className="following">
              <p>{user.user.following_count}</p>
              <span>following</span>
            </div>
            <div className="followers">
              <p>{user.user.follower_count}</p>
              <span>followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="posts">
        <div className="post__navigation">
          <div>
            <GoCopy size={22} />
          </div>
          <div>
            <IoMdHeartEmpty size={22} />
          </div>
          <div>
            <IoPlayCircleOutline size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
