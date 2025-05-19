import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import ProfileModal from '../Components/ProfileModel'
import Logo from '../assets/Logo/logoIcon.ico';

const handleLogout = () => {
  localStorage.removeItem("authToken");
  window.location.href="/";
}

const Header = () => {
  const location = useLocation();
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      const storedUsername = localStorage.getItem("username");
      const storedProfilePicture = localStorage.getItem("profile_picture");

      if (storedUsername) setUsername(storedUsername);

      if (storedProfilePicture && storedProfilePicture !== "null" && storedProfilePicture !== "undefined") {
        const fullPath = storedProfilePicture.startsWith("http")
          ? storedProfilePicture
          : `http://localhost:8081/uploads/${storedProfilePicture}`;
        setProfilePicture(fullPath);
      }
    };

    loadProfile();
    window.addEventListener("profilePictureUpdated", loadProfile);
    return () => window.removeEventListener("profilePictureUpdated", loadProfile);
  }, []);

  return (
    <>
      <div className='flex justify-between items-center h-14 bg-gradient-to-tr from-green-400 to-white p-3 shadow'>
        <img src={Logo} alt="Logo" className='w-[180px] h-[180px]' />
        <ul className='flex gap-5 items-center'>
          <li className={location.pathname === "/home" ? "font-bold" : "hover:underline"}>
            <Link to="/home">Home</Link>
          </li>
          <li className={location.pathname === "/blog" ? "font-bold" : "hover:underline"}>
            <Link to="/blog">Create Post</Link>
          </li>
          <li className={location.pathname === "/myBlog" ? "font-bold" : "hover:underline"}>
            <Link to="/myBlog">My Blog</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="hover:font-bold">Logout</button>
          </li>
          <li>
            <button onClick={() => setIsModalOpen(true)}>
              <div className="flex items-center gap-2">
                {profilePicture ? (
                  <img src={profilePicture} className="w-9 h-9 rounded-full object-cover" alt="Profile" />
                ) : (
                  <CgProfile className="h-9 w-9" />
                )}
                {username && <span className="text-sm">{username}</span>}
              </div>
            </button>
          </li>
        </ul>
      </div>

      {isModalOpen && (
        <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
