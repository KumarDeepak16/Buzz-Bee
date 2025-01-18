import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faStar, faQuestionCircle, faChevronRight, faEye, faReply, faPoll, faUsers, faRocket, faCrown } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Loader from './Loader';

const SidebarSection = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-800 rounded-lg border border-yellow-600 shadow-lg overflow-hidden select-none">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-yellow-400 text-gray-100 transition duration-300 hover:from-yellow-500 hover:to-yellow-500"
      >
        <div className="flex items-center text-black">
          <FontAwesomeIcon icon={icon} className="mr-3" />
          <h2 className="text-lg font-semibold ">{title}</h2>
        </div>
        <FontAwesomeIcon 
          icon={faChevronRight} 
          className={`transition-transform duration-300 ${isOpen ? 'transform rotate-90' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-800">
          {children}
        </div>
      )}
    </div>
  );
};

const ThreadLink = ({ thread }) => (
  <Link 
    to={`/thread/${thread.id}`} 
    className="block p-2 hover:bg-gray-700 rounded transition-colors duration-200"
  >
    <h3 className="text-sm font-medium text-gray-300 truncate">{thread.title}</h3>
    <div className="flex items-center text-xs text-gray-400 mt-1">
      <span className="mr-2 flex items-center">
        <FontAwesomeIcon icon={faEye} className="mr-1" />
        {thread.views}
      </span>
      <span className="flex items-center">
        <FontAwesomeIcon icon={faReply} className="mr-1" />
        {thread.replies?.length || 0}
      </span>
    </div>
  </Link>
);

const FeatureSlider = () => {
  const features = [
    { icon: faUsers, title: "Diverse Community", description: "Connect with people from all walks of life" },
    { icon: faRocket, title: "Trending Topics", description: "Stay updated with the hottest conversations" },
    { icon: faCrown, title: "Animated Profile Pictures", description: "Bring your profile to life with dynamic, eye-catching animations." },
    { icon: faQuestionCircle, title: "Anonymous Questioning", description: "Ask questions without revealing your identity to encourage open dialogue." },
    { icon: faPoll, title: "Polls", description: "Engage the community by creating polls to gather opinions and insights." },
  ];
  

  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg border border-yellow-600 shadow-lg overflow-hidden mb-6 select-none">
      <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-400">
        <h2 className="text-lg font-semibold text-black">BUZZ Features</h2>
      </div>
      <div className="p-4 h-32">
        <div className="flex items-center mb-2">
          <FontAwesomeIcon icon={features[currentFeature].icon} className="text-3xl text-yellow-400 mr-3" />
          <h3 className="text-lg font-medium text-gray-200">{features[currentFeature].title}</h3>
        </div>
        <p className="text-gray-400">{features[currentFeature].description}</p>
      </div>
      <div className="flex justify-center p-2">
        {features.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${
              index === currentFeature ? 'bg-yellow-400' : 'bg-gray-600'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const RightSidebar = () => {
  const [trendingThreads, setTrendingThreads] = useState([]);
  const [popularThreads, setPopularThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingQuery = query(collection(db, "threads"), orderBy("views", "desc"), limit(5));
        const trendingSnapshot = await getDocs(trendingQuery);
        setTrendingThreads(trendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const popularQuery = query(collection(db, "threads"), orderBy("votes", "desc"), limit(5));
        const popularSnapshot = await getDocs(popularQuery);
        setPopularThreads(popularSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (loading) {
  //   return <Loader />;
  // }

  if (error) {
    return <div className="p-4 text-center text-red-400 bg-gray-800 border border-red-600 rounded-lg font-bold uppercase">{error}</div>;
  }

  return (
    <div className="w-full lg:w-80 space-y-2 rounded-lg  ">
      <FeatureSlider />

      <SidebarSection title="Trending Discussions" icon={faFire}>
        <div className="space-y-2">
          {trendingThreads.map(thread => (
            <ThreadLink key={thread.id} thread={thread} />
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Popular Discussions" icon={faStar}>
        <div className="space-y-2">
          {popularThreads.map(thread => (
            <ThreadLink key={thread.id} thread={thread} />
          ))}
        </div>
      </SidebarSection>

     
    </div>
  );
};

export default RightSidebar;