import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faArrowUp,
  faArrowDown,
  faReply,
  faImage,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { db, storage, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  increment,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "../ui/Loader";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ReplyOptionsModal from "../components/ReplyOptionsModal";

function ThreadView() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedReplyIndex, setSelectedReplyIndex] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const commentorId = auth?.currentUser?.uid;
  const storedUserInfo =
    JSON.parse(sessionStorage.getItem("userInfo")) ||
    JSON.parse(localStorage.getItem("userInfo"));

  let username = null;
  let profileImage = null;
  if (storedUserInfo) {
    // Assign username inside the if block
    username = storedUserInfo.username;
    profileImage = storedUserInfo.profileImage;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchThread = async () => {
      const docRef = doc(db, "threads", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setThread({ id: docSnap.id, ...docSnap.data() });
        await updateDoc(docRef, {
          views: increment(1),
        });
      }
    };
    fetchThread();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to reply.");
      return;
    }

    let imageUrl = "";
    if (replyImage) {
      const imageRef = ref(storage, `reply_images/${replyImage.name}`);
      await uploadBytes(imageRef, replyImage);
      imageUrl = await getDownloadURL(imageRef);
    }

    const newReply = {
      commentorId: commentorId,
      content: reply,
      imageUrl,
      commentor: username,
      commentorAvatar: profileImage,
      createdAt: new Date(),
      votes: 0,
    };

    const threadRef = doc(db, "threads", id);
    await updateDoc(threadRef, {
      replies: arrayUnion(newReply),
      replyCount: increment(1),
      lastRepliedAt: serverTimestamp(),
    });

    setReply("");
    setReplyImage(null);
    setShowReplyBox(false);

    const updatedDoc = await getDoc(threadRef);
    setThread({ id: updatedDoc.id, ...updatedDoc.data() });
    toast.success("Reply posted successfully!");
  };

  const handleVote = async (isUpvote, replyIndex = null) => {
    const voteId = user ? user.uid : "anonymous";
    const threadRef = doc(db, "threads", id);
    let voteRef;

    if (replyIndex === null) {
      voteRef = doc(db, "votes", `thread_${id}_${voteId}`);
    } else {
      voteRef = doc(db, "votes", `reply_${id}_${replyIndex}_${voteId}`);
    }

    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
      toast.error("You have already voted on this item.");
      return;
    }

    if (replyIndex === null) {
      await updateDoc(threadRef, {
        votes: increment(isUpvote ? 1 : -1),
      });
    } else {
      const updatedReplies = thread.replies.map((reply, index) => {
        if (index === replyIndex) {
          return { ...reply, votes: (reply.votes || 0) + (isUpvote ? 1 : -1) };
        }
        return reply;
      });

      await updateDoc(threadRef, { replies: updatedReplies });
    }

    await setDoc(voteRef, {
      userId: voteId,
      isUpvote: isUpvote,
      createdAt: serverTimestamp(),
    });

    const updatedDoc = await getDoc(threadRef);
    setThread({ id: updatedDoc.id, ...updatedDoc.data() });
    toast.success(
      isUpvote ? "Upvoted successfully!" : "Downvoted successfully!"
    );
  };

  if (!thread) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-2 mb-5 lg:mb-0">
      {!thread ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Thread Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-xl">
            <div className="p-6 space-y-4">
              {/* Thread Header */}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-white">
                  {thread.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-3 select-none">
                    <img
                      src={
                        thread.authorAvatar ||
                        "https://cdn-icons-png.flaticon.com/512/8844/8844225.png"
                      }
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-yellow-500/50"
                    />
                    <div className="space-y-1">
                      <p className="font-medium text-white">
                        {thread.author || "Unknown"}
                      </p>
                      <p className="text-gray-400 flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} />
                        {thread.createdAt?.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className="text-yellow-400"
                      />
                      <span className="text-white font-medium">
                        {thread.votes || 0}
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVote(false)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                    >
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        className="text-red-400"
                      />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Thread Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  {thread.description}
                </p>
              </div>

              {thread.imageUrl && (
                <img
                  src={thread.imageUrl}
                  alt="Thread"
                  className="w-full rounded-lg object-cover max-h-[500px] select-none"
                />
              )}
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Answers
              <span className="text-sm font-normal text-gray-400">
                ({thread.replies?.length || 0})
              </span>
            </h2>

            {/* Reply Form */}
            <AnimatePresence>
              {showReplyBox && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleReply}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write your answer..."
                      className="w-full p-4 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none min-h-[150px]"
                      required
                    />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-600/30 transition-colors">
                        <FontAwesomeIcon icon={faImage} />
                        Add Image
                        <input
                          type="file"
                          onChange={(e) => setReplyImage(e.target.files[0])}
                          className="hidden"
                        />
                      </label>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faReply} />
                          Post Answer
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setShowReplyBox(false)}
                          className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Replies List */}
            <div className="space-y-3">
              {thread.replies?.map((reply, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden ml-4 relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-400/70" />
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 select-none">
                        <img
                          src={
                            reply.commentorAvatar ||
                            "https://cdn-icons-png.flaticon.com/512/1534/1534082.png"
                          }
                          alt=""
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-500/50"
                        />
                        <div className="space-y-1">
                          <p className="font-medium text-white">
                            {reply.commentor || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {reply.createdAt?.toDate().toLocaleString()}
                          </p>
                        </div>
                      </div>
                     

                      <div className="flex items-center gap-4">
                    
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVote(true, index)}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faArrowUp}
                            className="text-yellow-400"
                          />
                          <span className="text-white font-medium">
                            {reply.votes || 0}
                          </span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVote(false, index)}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="text-red-400"
                          />
                        </motion.button>
                        {reply.commentorId === auth?.currentUser?.uid && (
                          <button
                            onClick={() => setSelectedReplyIndex(index)}
                            className="text-gray-400 hover:text-white"
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {reply.content}
                    </p>

                    {reply.imageUrl && (
                      <img
                        src={reply.imageUrl}
                        alt="Reply"
                        className="w-full rounded-lg object-cover max-h-[400px]"
                      />
                    )}
                  </div>
                  {selectedReplyIndex === index && (
                    <ReplyOptionsModal
                      thread={thread}
                      replyIndex={index}
                      onClose={() => setSelectedReplyIndex(null)}
                      updateThreadState={() => {
                        // Fetch updated thread or update local state
                        const fetchThread = async () => {
                          const docRef = doc(db, "threads", id);
                          const docSnap = await getDoc(docRef);
                          if (docSnap.exists()) {
                            setThread({ id: docSnap.id, ...docSnap.data() });
                          }
                        };
                        fetchThread();
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Answer Button or Login Message */}
            {!showReplyBox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReplyBox(true)}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faReply} />
                    Write Answer
                  </motion.button>
                ) : (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
                    <p className="text-gray-300 text-center">
                      Please log in to answer this Question.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default ThreadView;
