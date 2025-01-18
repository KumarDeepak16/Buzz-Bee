import React from "react";
import { NavLink } from "react-router-dom";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaSearch ,FaUser,FaPlusCircle ,FaHome  } from "react-icons/fa";
import { auth } from "../firebase";
import { RiLoginBoxFill } from "react-icons/ri";
const navItems = [
  { icon: <FaHome  size={16} />, text: "Home", path: "/" },
  { icon: <PiUsersThreeBold  size={16} />, text: "Communities", path: "/communities" },
  { icon: <FaPlusCircle  size={16} />, text: "Create", path: "/create-thread" },
  { icon: <FaSearch size={16} />, text: "Search", path: "/search" },
  { icon: <FaUser  size={16} />, text: "Profile", path: "/profile" }
];

function BottomNavbar() {
  const user = auth.currentUser;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 p-2 shadow-lg flex justify-around items-center z-10 h-[50px] overflow-hidden">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>{
            const hiddenClass =
              !user &&
              (item.path === "/create-thread" ||
                item.path === "/profile")
                ? "hidden"
                : "";
            return `flex flex-col gap-[2px] items-center text-center transition-colors duration-200 ${hiddenClass}
            ${isActive ? 'text-yellow-500 scale-105' : 'text-gray-400 hover:text-yellow-500'}`
          }}
        >
          {item.icon}
          <span className="text-xs">{item.text}</span>
        </NavLink>
      ))}
          {!user && <NavLink
          to='/login'
          className={({ isActive }) =>
           `flex flex-col items-center text-center transition-colors duration-200 
            ${isActive ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`
          }
        >
          <RiLoginBoxFill   size={20} />
          <span className="text-xs">Login</span>
        </NavLink>}
    </nav>
  );
}

export default BottomNavbar;
