import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { auth } from "../firebase";
import {
  FaPoll,
  FaQuestion,
  FaUser,
} from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from 'react-hot-toast';
import { GoLaw } from "react-icons/go";
import { VscFeedback } from "react-icons/vsc";
import { GiHoneycomb } from "react-icons/gi";
import { PiUsersThreeBold } from "react-icons/pi";
const navItems = [
  { icon: <FaQuestion size={20} />, text: "Discussions", path: "/" },
  { icon: <PiUsersThreeBold size={20} />, text: "Community", path: "/communities" },
  { icon: <FaPoll size={20} />, text: "Polls", path: "/poll" },
  { icon: <FaUser size={20} />, text: "Profile", path: "/profile" },
  { icon: <GoLaw size={20} />, text: "Rules And Regulations", path: "/rulesAndregulations" },
  { icon: <VscFeedback size={20} />, text: "Feedback and Report ", path: "/feedbackpage " },
];

function MenuNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        toast.success("Logged out");
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        toast.error(`Error signing out: ${error.message}`);
      });
  };

  const navActiveLink = ({ isActive }) => ({
    color: isActive ? "#fff" : "#eab308",
    fontWeight: isActive ? "bold" : "normal",
    backgroundColor: isActive ? "#eab308" : "transparent",
  });

  return (
    <nav className="w-full z-10 relative h-[60px]  bg-gray-900 select-none">
      <div className="flex items-center justify-between p-2">
        {/* <img src="logo1.png" className="h-[50px] object-cover w-[150px]  "/> */}
        <Link to="/">
          {" "}
          <h1 className="logo text-3xl px-2 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent flex justify-center items-center ">BUZZ-BEE <GiHoneycomb className="text-yellow-300 ml-2 animate-pulse "/></h1>
        </Link>

        <div className="flex justify-between gap-2">
          <NavLink
            to="/poll"
            className="p-1 rounded-lg text-yellow-400   hover:text-black  hover:bg-gray-200 transition-colors"
          >
            <FaPoll size={24} />
          </NavLink>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 rounded-lg text-yellow-400  hover:text-black  hover:bg-gray-200 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <>
          <ul className="absolute top-16 left-1 right-1  mx-auto bg-gray-900 shadow-md shadow-white/20 overflow-hidden rounded-xl">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
              >
                <NavLink
                  to={item.path}
                  style={navActiveLink}
                  className="flex items-center p-3"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.text}</span>
                </NavLink>
              </li>
            ))}
            <li>
              {auth.currentUser ? (
                <button
                  onClick={handleLogout}
                  className="bg-yellow-500 my-2 mx-auto text-white px-4 py-1 rounded-full hover:bg-red-400 transition-colors flex items-center space-x-2"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login", { replace: true })}
                  className="bg-yellow-500 my-2 mx-auto text-white px-4 py-1 rounded-full hover:bg-green-400 transition-colors flex items-center space-x-2"
                >
                  <LogOut size={20} />
                  <span>Login</span>
                </button>
              )}
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}

export default MenuNavbar;
