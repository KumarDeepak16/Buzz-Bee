import React from "react";
import { NavLink } from "react-router-dom";
import { Home, PlusSquare, Layers } from "lucide-react";
import { FaPoll, FaSearch } from "react-icons/fa";
import { GoLaw } from "react-icons/go";
import { VscFeedback } from "react-icons/vsc";
import { auth } from "../firebase";
import { PiUsersThreeBold } from "react-icons/pi";
const navItems = [
  { icon: <Home size={20} />, text: "Home", path: "/" },
  { icon: <PiUsersThreeBold size={20} />, text: "Communities", path: "/communities" },
  { icon: <FaPoll size={20} />, text: "Polls", path: "/poll" },
  { icon: <FaSearch size={20} />, text: "Search", path: "/search" },
  {
    icon: <PlusSquare size={20} />,
    text: "Create Discussion",
    path: "/create-thread",
  },
  {
    icon: <PlusSquare size={20} />,
    text: "Create Community",
    path: "/create-community",
  },
  {
    icon: <GoLaw size={20} />,
    text: "Rules And Regulations",
    path: "/rulesAndregulations",
  },
  {
    icon: <VscFeedback size={20} />,
    text: "Feedback and Report ",
    path: "/feedbackpage ",
  },
];

function Navbar() {
  const user = auth.currentUser;
  return (
    <nav className="flex flex-col bg-gray-900 border border-yellow-500 rounded-lg shadow-lg w-64 p-4 select-none">
      <ul className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => {
                const hiddenClass =
                  !user &&
                  (item.path === "/create-thread" ||
                    item.path === "/create-community")
                    ? "hidden"
                    : "";
                return `flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out
      ${hiddenClass}
      ${
        isActive
          ? "bg-yellow-400 text-black"
          : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
      }`;
              }}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
