import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faImage,
  faTimes,
  faUser,
  faClock,
  faChartBar,
  faVoteYea,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const PollComponent = () => {
  const [polls, setPolls] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: "",
    options: ["", ""],
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [guestVotes, setGuestVotes] = useState(() => {
    const saved = localStorage.getItem("guestVotes");
    return saved ? JSON.parse(saved) : {};
  });

  const storedUserInfo =
    JSON.parse(sessionStorage.getItem("userInfo")) ||
    JSON.parse(localStorage.getItem("userInfo"));

  let username = storedUserInfo?.username;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        setUser(
          userDoc.exists() ? { id: authUser.uid, ...userDoc.data() } : null
        );
      } else {
        setUser(null);
      }
    });

    fetchPolls();

    return () => unsubscribe();
  }, []);

  const fetchPolls = async () => {
    try {
      const q = query(collection(db, "polls"));
      const querySnapshot = await getDocs(q);
      const pollsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(pollsData);
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Failed to fetch polls");
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("You must be logged in to create a poll.");
      return;
    }
    setLoading(true);

    try {
      let imageUrl = "";
      if (newPoll.image) {
        const imageRef = ref(storage, `pollImages/${uuidv4()}`);
        await uploadBytes(imageRef, newPoll.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "polls"), {
        title: newPoll.title,
        options: newPoll.options.map((option) => ({ text: option, votes: 0 })),
        imageUrl,
        createdBy: auth.currentUser.uid,
        creatorName: username || "Anonymous",
        createdAt: new Date(),
        totalVotes: 0,
        votedBy: {},
        voterChoices: {}, // Track which option each user voted for
      });

      setNewPoll({ title: "", options: ["", ""], image: null });
      setImagePreview(null);
      setShowCreateForm(false);
      fetchPolls();
      toast.success("Poll created successfully!");
    } catch (err) {
      console.error("Error creating poll:", err);
      toast.error("Failed to create poll");
    }

    setLoading(false);
  };

  const handleVote = async (pollId, optionIndex) => {
    const userId = auth.currentUser?.uid || `guest-${localStorage.getItem("guestId") || uuidv4()}`;
    if (!localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", userId);
    }

    try {
      const pollRef = doc(db, "polls", pollId);
      const pollDoc = await getDoc(pollRef);
      const poll = { id: pollDoc.id, ...pollDoc.data() };

      const previousVote = poll.voterChoices?.[userId];
      
      // If user has voted before, remove their previous vote
      if (previousVote !== undefined) {
        const updatedOptions = [...poll.options];
        updatedOptions[previousVote].votes = Math.max(0, updatedOptions[previousVote].votes - 1);
        
        // Add new vote
        updatedOptions[optionIndex].votes += 1;

        await updateDoc(pollRef, {
          options: updatedOptions,
          [`voterChoices.${userId}`]: optionIndex,
        });

        toast.success("Vote updated successfully!");
      } else {
        // First time voting
        const updatedOptions = [...poll.options];
        updatedOptions[optionIndex].votes += 1;

        await updateDoc(pollRef, {
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          [`voterChoices.${userId}`]: optionIndex,
        });

        if (!auth.currentUser) {
          const updatedGuestVotes = { ...guestVotes, [pollId]: optionIndex };
          setGuestVotes(updatedGuestVotes);
          localStorage.setItem("guestVotes", JSON.stringify(updatedGuestVotes));
        }

        toast.success("Vote submitted successfully!");
      }

      fetchPolls();
    } catch (err) {
      console.error("Error handling vote:", err);
      toast.error("Failed to submit vote");
    }
  };

  const getUserVote = (poll) => {
    const userId = auth.currentUser?.uid || `guest-${localStorage.getItem("guestId")}`;
    return poll.voterChoices?.[userId];
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewPoll({ ...newPoll, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-yellow-400 heading tracking-widest"
        >
           Polls
        </motion.h1>
        
        {auth.currentUser && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-700 hover:to-yellow-700 text-black px-3 py-2 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            {showCreateForm ? "Close" : "Create Poll"}
          </motion.button>
        )}
      </div>

      {/* Create Poll Form */}
      <AnimatePresence>
        {showCreateForm && auth.currentUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
                        <form
              onSubmit={handleCreatePoll}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700/50"
            >
              <input
                className="w-full mb-4 p-3 bg-gray-700/50 text-white border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                type="text"
                placeholder="Poll Title"
                value={newPoll.title}
                onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                required
              />
              
              {newPoll.options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-4">
                  <input
                    className="flex-grow p-3 bg-gray-700/50 text-white border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll({ ...newPoll, options: newOptions });
                    }}
                    required
                  />
                  {index > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = newPoll.options.filter((_, i) => i !== index);
                        setNewPoll({ ...newPoll, options: newOptions });
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex gap-4 mb-4">
                <label className="flex-1 flex items-center justify-center bg-yellow-500 hover:bg-yellow-700 text-black py-2 px-4 rounded-lg cursor-pointer transition-colors">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  {imagePreview ? "Change Image" : "Add Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                <button
                  type="button"
                  onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-700 text-black py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Option
                </button>
              </div>

              {imagePreview && (
                <div className="relative mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewPoll({ ...newPoll, image: null });
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-full text-black transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-yellow-500 hover:bg-yellow-700 text-black py-3 rounded-lg transition-colors"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Poll"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polls Grid */}
      <div className="grid gap-6">
        {polls.map((poll) => {
          const userVote = getUserVote(poll);
          
          return (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-yellow-700/30"
            >
              {poll.imageUrl && (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={poll.imageUrl}
                    alt={poll.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                </div>
              )}
              
              <div className="p-4">
                <h2 className="text-xl font-medium  mb-4 text-white">
                  {poll.title}
                </h2>
                
                <div className="flex items-center text-sm text-gray-400 mb-6 select-none">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <span>{poll.creatorName}</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full mx-4" />
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    <span>
                      {new Date(poll.createdAt.toDate()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {poll.options.map((option, index) => {
                    const percentage = ((option.votes / (poll.totalVotes || 1)) * 100).toFixed(1);
                    const isSelected = userVote === index;
                    
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        className="relative"
                      >
                        <button
                          onClick={() => handleVote(poll.id, index)}
                          className={`w-full relative overflow-hidden ${
                            isSelected
                              ? "bg-gray-700/30"
                              : userVote !== undefined
                              ? "bg-gray-700/30"
                              : "bg-gradient-to-r from-yellow-600/50 to-yellow-600/50 hover:from-yellow-600 hover:to-yellow-600"
                          } rounded-xl transition-all duration-300`}
                        >
                          <div className="relative z-10 p-2 flex justify-between items-center">
                            <span className="text-white text-sm line-clamp-1 hover:line-clamp-none">
                              {option.text}
                              {isSelected && (
                                <span className="ml-2 text-yellow-400 select-none">
                                  (Your Vote)
                                </span>
                              )}
                            </span>
                            {userVote !== undefined && (
                              <span className="text-white font-bold select-none">
                                {percentage}%
                              </span>
                            )}
                          </div>
                          
                          {userVote !== undefined && (
                            <div
                              className={`absolute top-0 left-0 h-full ${
                                isSelected
                                  ? "bg-gradient-to-r from-orange-600 to-orange-400"
                                  : "bg-gray-600/30"
                              } transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-between text-gray-400 text-sm select-none">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faVoteYea} className="text-yellow-400" />
                    {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
                  </span>
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartBar} className="text-yellow-400" />
                    {poll.options.length} options
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
     
    </div>
  );
};

export default PollComponent;