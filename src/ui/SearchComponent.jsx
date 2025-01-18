import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust this import based on your Firebase setup

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allThreads, setAllThreads] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);

  useEffect(() => {
    fetchAllThreads();
    fetchAllCommunities();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      filterResults();
    } else {
      setFilteredThreads([]);
      setFilteredCommunities([]);
    }
  }, [searchTerm]);

  const fetchAllThreads = async () => {
    const querySnapshot = await getDocs(collection(db, "threads"));
    setAllThreads(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchAllCommunities = async () => {
    const querySnapshot = await getDocs(collection(db, "communities"));
    setAllCommunities(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const filterResults = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const threads = allThreads.filter(thread => 
      thread.title.toLowerCase().includes(lowerSearchTerm) ||
      (thread.description && thread.description.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredThreads(threads);

    const communities = allCommunities.filter(community => 
      community.name.toLowerCase().includes(lowerSearchTerm) ||
      (community.description && community.description.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredCommunities(communities);
  };

  const renderCard = (item, type) => (
    <div key={item.id} className="bg-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
      <Link
        to={type === 'thread' ? `/thread/${item.id}` : `/communities/${item.id}`}
        className={`text-sm font-semibold line-clamp-3 ${type === 'thread' ? 'text-yellow-100' : 'text-green-300'} hover:underline`}
      >
        {type === 'thread' ? item.title : item.name}
      
      <p className="text-gray-400 mt-2 truncate">
        {item.description || 'No description available'}
      </p>
      </Link>
    </div>
  );
  

  return (
    <div className="max-w-4xl mx-auto p-4  rounded-lg bg-gray-900 h-full overflow-y-auto no-scrollbar">
      <div className="relative mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search threads and communities..."
          className="w-full px-4 py-2  bg-gray-700 text-white  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {searchTerm ? (
        <>
          {filteredThreads.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-yellow-400 heading tracking-widest mb-4">Discussions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredThreads.map((thread) => renderCard(thread, 'thread'))}
              </div>
            </div>
          )}
          {filteredCommunities.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 heading tracking-widest mb-4">Communities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommunities.map((community) => renderCard(community, 'community'))}
              </div>
            </div>
          )}
          {filteredThreads.length === 0 && filteredCommunities.length === 0 && (
            <p className="text-center text-white ">No results found for "{searchTerm}"</p>
          )}
        </>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 heading tracking-widest mb-4">Trending Discussions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allThreads.slice(0, 6).map((thread) => renderCard(thread, 'thread'))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-yellow-400 heading tracking-widest mb-4">Featured Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allCommunities.slice(0, 4).map((community) => renderCard(community, 'community'))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchComponent;