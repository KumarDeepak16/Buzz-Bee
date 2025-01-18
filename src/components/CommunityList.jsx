import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db,auth  } from "../firebase";

const borderColors = [
  "border-indigo-400",
  "border-purple-400",
  "border-pink-400",
  "border-red-400",
  "border-orange-400",
  "border-yellow-400",
  "border-green-400",
  "border-teal-400",
];

function getRandomBorderColor() {
  return borderColors[Math.floor(Math.random() * borderColors.length)];
}

function CommunityList() {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = auth.currentUser;
  useEffect(() => {
    const fetchCommunities = async () => {
      const q = query(collection(db, "communities"), orderBy("createdAt", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      setCommunities(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 ">
      <div className="max-w-7xl mx-auto space-y-4 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
          <h1 className="text-3xl heading  font-bold text-yellow-400 pt-4 md:pt-0 tracking-widest">Communities</h1>
          { user && <Link
            to="/create-community"
            className="bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition duration-300 ease-in-out flex items-center justify-center transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Community
          </Link>}
        </div>

        <div className="bg-gray-900 rounded-3xl  px-4 transition duration-300 ease-in-out">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search communities..."
                className="w-full p-3 pl-12 bg-gray-700 text-white rounded-2xl focus:ring-2 outline-none focus:ring-yellow-500 transition-all duration-300"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredCommunities.map((community) => {
              const borderColor = getRandomBorderColor();
              return (
                <div
                  key={community.id}
                  className={`bg-gray-700 rounded-2xl p-6 transition-all duration-300 border-l-4 ${borderColor} cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/30`}
                >
                <Link
                to={`/communities/${community.id}`}>
                  <h2 className="text-xl font-semibold mb-2 text-white">{community.name}</h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">{community.description}</p>
                  <div className="flex items-center text-yellow-300 text-sm">
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    <span>{community.members.length || 0} members</span>
                  </div>
                </Link>
                </div>
              );
            })}
          </div>

          {filteredCommunities.length === 0 && (
            <p className="text-center text-gray-400 mt-8">No communities found. Why not create one?</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityList;