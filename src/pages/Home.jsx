import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaComments, 
  FaEye, 
  FaArrowUp, 
  FaFire, 
  FaPlus,
  FaClock, 
  FaEllipsisH,
} from 'react-icons/fa';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  startAfter,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import ThreadOptionsModal from '../components/ThreadOptionsModal';

function Home() {
  const [threads, setThreads] = useState([]);
  const [filter, setFilter] = useState('recent');
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const user = auth?.currentUser?.uid;

  const filterOptions = [
    { value: 'recent', label: 'Recent', icon: <FaClock /> },
    { value: 'trending', label: 'Trending', icon: <FaFire /> },
    { value: 'mostAnswered', label: 'Popular', icon: <FaComments /> },
    { value: 'mostVoted', label: 'Top Rated', icon: <FaArrowUp /> },
  ];

  // Real-time threads listener
  useEffect(() => {
    let unsubscribe;

    const setupRealtimeListener = () => {
      setError(null);
      let q;

      try {
        switch (filter) {
          case 'mostAnswered':
            q = query(collection(db, "threads"), orderBy("replyCount", "desc"), limit(20));
            break;
          case 'mostVoted':
            q = query(collection(db, "threads"), orderBy("votes", "desc"), limit(20));
            break;
          case 'trending':
            q = query(collection(db, "threads"), orderBy("trendingScore", "desc"), limit(20));
            break;
          default:
            q = query(collection(db, "threads"), orderBy("createdAt", "desc"), limit(20));
        }

        setLoading(true);
        
        unsubscribe = onSnapshot(q, 
          (querySnapshot) => {
            const threadsData = [];
            let lastDoc = null;

            querySnapshot.forEach((doc) => {
              threadsData.push({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                lastRepliedAt: doc.data().lastRepliedAt?.toDate()
              });
              lastDoc = doc;
            });

            setThreads(threadsData);
            setLastVisible(lastDoc);
            setHasMore(querySnapshot.docs.length === 20);
            setLoading(false);
            // console.log('Connected to Firestore');
          },
          (error) => {
            console.error("Error fetching threads:", error);
            setError(error.message);
            setLoading(false);
            console.log('Error connecting to Firestore:', error.message);
          }
        );
      } catch (error) {
        console.error("Error setting up listener:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    setupRealtimeListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [filter]);

  // Load more threads
  const loadMoreThreads = async () => {
    if (!lastVisible || loadingMore || !hasMore) return;

    setLoadingMore(true);
    let q;

    try {
      switch (filter) {
        case 'mostAnswered':
          q = query(collection(db, "threads"), orderBy("replyCount", "desc"), startAfter(lastVisible), limit(20));
          break;
        case 'mostVoted':
          q = query(collection(db, "threads"), orderBy("votes", "desc"), startAfter(lastVisible), limit(20));
          break;
        case 'trending':
          q = query(collection(db, "threads"), orderBy("trendingScore", "desc"), startAfter(lastVisible), limit(20));
          break;
        default:
          q = query(collection(db, "threads"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(20));
      }

      const querySnapshot = await getDocs(q);
      const newThreads = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        newThreads.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          lastRepliedAt: doc.data().lastRepliedAt?.toDate()
        });
        lastDoc = doc;
      });

      setThreads(prevThreads => [...prevThreads, ...newThreads]);
      setLastVisible(lastDoc);
      setHasMore(querySnapshot.docs.length === 20);
    } catch (error) {
      console.error("Error loading more threads:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Update thread trending score
  const updateTrendingScore = async (threadId) => {
    try {
      const threadRef = doc(db, "threads", threadId);
      await updateDoc(threadRef, {
        views: increment(1),
        trendingScore: increment(2),
        lastViewedAt: new Date()
      });
      // alert("Updated thread trending score");
    } catch (error) {
      console.error("Error updating trending score:", error);
    }
  };

  return (
    <div className="min-h-screen text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-2 lg:py-0">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex lg:justify-between justify-center items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold text-yellow-400 heading tracking-widest">
              Discussions
            </h1>
            { user &&  <Link
              to='/create-thread'
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-500 text-white p-2 rounded-xl hover:opacity-90 transition-all duration-300"
            >
              <FaPlus className="hover:rotate-90 transition-transform duration-300" />
              <span className='text-sm'>New Thread</span>
            </Link>}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all duration-300
                  ${filter === option.value 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-500 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'}
                `}
              >
                {option.icon}
               <span className={`${filter === option.value ? 'md:block' : 'hidden md:block'}`}> {option.label} </span>
              </button>
            ))}
          </div>
        </div>

        {/* Threads Grid */}
        {loading ? (
          <div className="h-[70vh] flex justify-center items-center ">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              {threads.map((thread) => (
                <article 
                  key={thread.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 hover:bg-gray-800/70 transition-all duration-300 border border-gray-700/50"
                >
                  {/* Thread Header */}
                      
                  <div className="flex justify-between items-start mb-4">
                      {/* Thread Content */}
                    <div className="flex items-center gap-3 select-none">
                      <img 
                        src={thread.authorAvatar || 'default-avatar.png'} 
                        alt={thread.author}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-500/50"
                      />
                      <div>
                        <h3 className="font-medium text-gray-200">
                          {thread.author}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {thread.createdAt?.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {thread.authorId === user && (
                      <button
                        onClick={() => setSelectedThread(thread)}
                        className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                      >
                        <FaEllipsisH className="text-gray-400" />
                      </button>
                    )}
                  </div>
                  <Link 
                        to={`/thread/${thread.id}`} 
                        className="block group"
                        onClick={() => updateTrendingScore(thread.id)}
                      >
                    <h2 className="text-xl font-semibold mb-2 text-yellow-300 group-hover:text-yellow-400 transition-colors">
                      {thread.title}
                    </h2>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {thread.description}
                    </p>
                    
                    {thread.imageUrl && (
                      <img 
                        src={thread.imageUrl} 
                        alt="Thread" 
                        className="w-full h-48 object-cover rounded-lg mb-4 select-none"
                        loading="lazy"
                      />
                    )}
                  </Link>

                  {/* Thread Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 select-none">
                    <div className="flex items-center gap-2">
                      <FaComments className="text-yellow-400" />
                      {thread.replyCount || 0}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEye className="text-yellow-400" />
                      {thread.views || 0}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaArrowUp className="text-yellow-400" />
                      {thread.votes || 0}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMoreThreads}
                  disabled={loadingMore}
                  className={`
                    px-6 py-2 rounded-lg bg-yellow-600 text-white
                    ${loadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-700'}
                  `}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thread Options Modal */}
      {selectedThread && (
        <ThreadOptionsModal
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
        />
      )}
    </div>
  );
}

export default Home;



