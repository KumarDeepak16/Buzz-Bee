import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LogOut, Search, Bell, User } from "lucide-react";
import toast from 'react-hot-toast';
import { FaPoll, FaUsers } from "react-icons/fa";
import { auth, db } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { GiHoneycomb } from "react-icons/gi";
function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allThreads, setAllThreads] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchProfileData();
    }
    fetchAllThreads();
    fetchAllCommunities();
  }, [auth.currentUser]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      filterResults();
      setShowResults(true);
    } else {
      setFilteredThreads([]);
      setFilteredCommunities([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const fetchProfileData = async () => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setProfileData(querySnapshot.docs[0].data());
    }
  };

  const fetchAllThreads = async () => {
    const querySnapshot = await getDocs(collection(db, "threads"));
    setAllThreads(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const fetchAllCommunities = async () => {
    const querySnapshot = await getDocs(collection(db, "communities"));
    setAllCommunities(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const filterResults = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const threads = allThreads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(lowerSearchTerm) ||
        (thread.description &&
          thread.description.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredThreads(threads);

    const communities = allCommunities.filter(
      (community) =>
        community.name.toLowerCase().includes(lowerSearchTerm) ||
        (community.description &&
          community.description.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredCommunities(communities);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        toast.success("Logged out");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Error signing out: ", error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="bg-gray-900 p-2 h-full select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center  space-x-4">
          <Link to="/">
            <h1 className="logo text-4xl px-4  bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent flex justify-center items-center ">BUZZ-BEE <GiHoneycomb className="text-yellow-300 ml-2 animate-pulse"/></h1>
          </Link>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 w-96"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            {showResults && (
              <div className="absolute mt-2 w-full bg-gray-800 rounded-md shadow-lg h-auto max-h-64 overflow-y-auto scrollbar scrollbar-blue z-50">
                {filteredThreads.length > 0 ||
                filteredCommunities.length > 0 ? (
                  <>
                    {filteredThreads.map((thread) => (
                      <Link
                        key={thread.id}
                        to={`/thread/${thread.id}`}
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        onClick={() => {
                          setShowResults(false);
                          setSearchTerm("");
                        }}
                      >
                        {thread.title}
                      </Link>
                    ))}
                    {filteredCommunities.map((community) => (
                      <Link
                        key={community.id}
                        to={`/communities/${community.id}`}
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        onClick={() => {
                          setShowResults(false);
                          setSearchTerm("");
                        }}
                      >
                        {community.name}
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="block px-4 py-2 text-sm text-gray-200">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <NavLink
            to="/poll"
            className="text-gray-300 hover:text-yellow-400 transition duration-300"
          >
            <FaPoll size={24} />
          </NavLink>
          <NavLink
            to="/communities"
            className="text-gray-300 hover:text-yellow-400 transition duration-300"
          >
            <FaUsers size={24} />
          </NavLink>
          {/* <NavLink
            to="/notifications"
            className="text-gray-300 hover:text-yellow-400 transition duration-300"
          >
            <Bell size={24} />
          </NavLink> */}

          {auth.currentUser ? (
            <div className="relative z-50">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition duration-300"
              >
                <img
                  src={
                    profileData?.profileImage ||
                    "https://cdn-icons-png.freepik.com/512/7922/7922155.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <span className="text-2xl">
                  {profileData?.username || "User"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg">
                  <Link
                    onClick={toggleDropdown}
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-700 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
