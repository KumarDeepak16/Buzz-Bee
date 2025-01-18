import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaImage,
  FaPlus,
} from "react-icons/fa";
import { db, storage, auth } from "../firebase";
import {
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
  getDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostOptionsModal from "../components/PostOptionsModal";

function CommunityView() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [selectedCommentInfo, setSelectedCommentInfo] = useState(null);
  const storedUserInfo =
    JSON.parse(sessionStorage.getItem("userInfo")) ||
    JSON.parse(localStorage.getItem("userInfo"));

  const username = storedUserInfo?.username;
  const profileImage = storedUserInfo?.profileImage;

  useEffect(() => {
    const initialExpandedState = posts.reduce((acc, post) => {
      acc[post.id] = true; // Set all posts' comments to expanded by default
      return acc;
    }, {});
    setExpandedComments(initialExpandedState);
  }, [posts]);
  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Community and posts real-time listeners
  useEffect(() => {
    let communityUnsubscribe;
    let postsUnsubscribe;

    const setupListeners = async () => {
      // Community listener
      communityUnsubscribe = onSnapshot(
        doc(db, "communities", id),
        (doc) => {
          if (doc.exists()) {
            const communityData = doc.data();
            setCommunity({ id: doc.id, ...communityData });
            if (user) {
              setIsMember(communityData.members?.includes(user.uid));
            }
          }
        },
        (error) => {
          console.error("Error fetching community:", error);
        }
      );

      // Posts listener
      const postsQuery = query(
        collection(db, "posts"),
        where("communityId", "==", id)
      );

      postsUnsubscribe = onSnapshot(
        postsQuery,
        (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
          }));
          setPosts(postsData);
        },
        (error) => {
          console.error("Error fetching posts:", error);
        }
      );
    };

    setupListeners();

    return () => {
      if (communityUnsubscribe) communityUnsubscribe();
      if (postsUnsubscribe) postsUnsubscribe();
    };
  }, [id, user]);

  const handleJoinCommunity = async () => {
    if (!user) return;
    const communityRef = doc(db, "communities", id);
    await updateDoc(communityRef, {
      members: arrayUnion(user.uid),
    });
  };

  const handleLeaveCommunity = async () => {
    if (!user) return;
    const communityRef = doc(db, "communities", id);
    await updateDoc(communityRef, {
      members: arrayRemove(user.uid),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !isMember || !newPost.trim()) return;

    try {
      let imageUrl = "";
      if (postImage) {
        const imageRef = ref(
          storage,
          `post_images/${Date.now()}_${postImage.name}`
        );
        await uploadBytes(imageRef, postImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "posts"), {
        content: newPost,
        imageUrl,
        author: username,
        authorAvatar: profileImage,
        authorId: user.uid,
        communityId: id,
        createdAt: serverTimestamp(),
        upvotes: 0,
        downvotes: 0,
        comments: [],
        views: 0,
        votedBy: {},
      });

      setNewPost("");
      setPostImage(null);
      setShowNewPost(false);
      toast.success("Post Added successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!user || !isMember || !newComment.trim()) return;

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          content: newComment,
          author: username,
          authorAvatar: profileImage,
          authorId: user.uid,
          createdAt: new Date().toISOString(),
        }),
      });

      setNewComment("");
      toast.success("Comment Added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleVote = async (postId, isUpvote) => {
    if (!user) return;

    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();

      const votedBy = postData.votedBy || {};
      const userVote = votedBy[user.uid];

      if (userVote === undefined) {
        await updateDoc(postRef, {
          [isUpvote ? "upvotes" : "downvotes"]: increment(1),
          [`votedBy.${user.uid}`]: isUpvote ? "up" : "down",
        });
        toast.success("dg");
      } else if (
        (isUpvote && userVote === "down") ||
        (!isUpvote && userVote === "up")
      ) {
        await updateDoc(postRef, {
          upvotes: increment(isUpvote ? 1 : -1),
          downvotes: increment(isUpvote ? -1 : 1),
          [`votedBy.${user.uid}`]: isUpvote ? "up" : "down",
        });
        toast.success(
          isUpvote ? "Upvote Successful!" : "Successfully Devoted!"
        );
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (!community) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 bg-gray-900 min-h-screen">
      {/* Community Header */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-sm">
        <h1 className="text-3xl font-bold text-white mb-3 text-center">
          {community?.name}
        </h1>
        <p className="text-gray-300 text-center mb-4">
          {community?.description}
        </p>

        <div className="flex justify-center">
          {user ? (
            <button
              onClick={isMember ? handleLeaveCommunity : handleJoinCommunity}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isMember
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              }`}
            >
              {isMember ? "Leave Community" : "Join Community"}
            </button>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Section */}
      {isMember && (
        <div className="mb-6">
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-gray-800/50 backdrop-blur-sm text-gray-200 p-4 rounded-xl hover:bg-gray-800 transition-all duration-300 text-left flex items-center gap-4 w-full"
          >
            <span className="text-gray-400">Start a new chat...</span>
            <FaPlus className="text-gray-400" />
          </button>

          {showNewPost && (
            <div className="mt-4 bg-gray-800 rounded-xl shadow-sm p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3  text-white bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                />
                <div className="flex justify-between items-center">
                  <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 transition-colors">
                    <FaImage className="inline mr-2" />
                    <span>Add Image</span>
                    <input
                      type="file"
                      onChange={(e) => setPostImage(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 rounded-xl shadow-sm">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={post.authorAvatar || "default-avatar.png"}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-white">{post.author}</p>
                  <p className="text-sm text-gray-500">
                    {post.createdAt?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-200 mb-4">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="rounded-lg mb-4 max-h-96 w-full object-cover"
                />
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote(post.id, true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    post.votedBy?.[user?.uid] === "up"
                      ? "bg-indigo-600/20"
                      : "bg-gray-700/50 hover:bg-gray-700"
                  } transition-colors`}
                >
                  <FaArrowUp
                    className={
                      post.votedBy?.[user?.uid] === "up"
                        ? "text-indigo-400"
                        : "text-gray-400"
                    }
                  />
                  <span className="text-white font-medium">
                    {post.upvotes || 0}
                  </span>
                </button>

                <button
                  onClick={() => handleVote(post.id, false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    post.votedBy?.[user?.uid] === "down"
                      ? "bg-red-600/20"
                      : "bg-gray-700/50 hover:bg-gray-700"
                  } transition-colors`}
                >
                  <FaArrowDown
                    className={
                      post.votedBy?.[user?.uid] === "down"
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  />
                  <span className="text-white font-medium">
                    {post.downvotes || 0}
                  </span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  <FaComment className="text-gray-400" />
                  <span className="text-white font-medium">
                    {post.comments?.length || 0}
                  </span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {expandedComments[post.id] && (
              <div className="border-t border-gray-700 p-4">
                {/* Comments List */}
                <div className="space-y-4 mb-4">
                  {post.comments?.map((comment, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-gray-700 pl-4 relative"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={comment.authorAvatar || "default-avatar.png"}
                          alt={comment.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium text-sm text-white">
                          {comment.author}
                        </span>
                        {/* Add options button for the comment author */}
                        {comment.authorId === user?.uid && (
                          <button
                            onClick={() =>
                              setSelectedCommentInfo({
                                postId: post.id,
                                commentIndex: index,
                              })
                            }
                            className="ml-auto text-gray-400 hover:text-white"
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-gray-300">{comment.content}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {/* Add modal rendering */}
                  {selectedCommentInfo && (
                    <PostOptionsModal
                      post={posts.find(
                        (p) => p.id === selectedCommentInfo.postId
                      )}
                      commentIndex={selectedCommentInfo.commentIndex}
                      onClose={() => setSelectedCommentInfo(null)}
                      updatePostState={() => {
                        // This method will help to refresh the posts
                        // Since we're using onSnapshot, it should automatically update
                      }}
                    />
                  )}
                </div>

                {/* New Comment Input */}
                {isMember && (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 p-3  text-white bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows="3"
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComment.trim()}
                        className={`px-6 py-2 rounded-full transition-colors ${
                          newComment.trim()
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-600 cursor-not-allowed text-gray-300"
                        }`}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityView;
