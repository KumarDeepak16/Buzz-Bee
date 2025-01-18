import React, { useEffect, useState } from 'react';
import {  FaHashtag, FaUsers, FaComment, FaPoll } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import Loader from '../ui/Loader';

const ProfilePage = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [threads, setThreads] = useState([]);
  const [communities, setCommunities] = useState([]);
  // const [comments, setComments] = useState([]);
  const [polls, setPolls] = useState([]);
  const user = auth?.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch user details
      const userQuery = query(collection(db, "users"), where("userId", "==", user));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        setUserDetail(userSnapshot.docs[0].data());
      }

      // Fetch user threads
      const threadsQuery = query(collection(db, "threads"), where("authorId", "==", user));
      const threadsSnapshot = await getDocs(threadsQuery);
      setThreads(threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch user communities
      const communitiesQuery = query(collection(db, "communities"), where("members", "array-contains", user));
      const communitiesSnapshot = await getDocs(communitiesQuery);
      setCommunities(communitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    //   const userComments = [];
    //   threads.forEach(thread => {
    //   if (thread.replies && Array.isArray(thread.replies)) {
    //     thread.replies.forEach(reply => {
    //       if (reply.commentorId === user) {
    //         userComments.push({
    //           threadId: thread.id,
    //           ...reply
    //         });
    //       }
    //     });
    //   }
    // });
    // setComments(userComments);

      // Fetch user polls
      const pollsQuery = query(collection(db, "polls"), where("createdBy", "==", user));
      const pollsSnapshot = await getDocs(pollsQuery);
      setPolls(pollsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!userDetail) {
    return <Loader/>;
  }

  return (
    <div className="min-h-screen text-white ">
      <div className="mx-auto rounded-lg  shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-200 rounded-full ">
            <img
                  src={userDetail?.profileImage ||
                    "https://cdn-icons-png.freepik.com/512/7922/7922155.png"
                  }
                  alt="Profile"
                  className="h-36 w-36 rounded-full border object-cover"
                />
            </div>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-100">@{userDetail.username || "Anonymous User"}</h1>
            <p className="text-yellow-500">{userDetail.email}</p>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <Stat label="Threads" value={threads.length} />
            <Stat label="Communities" value={communities.length} />
            {/* <Stat label="Comments" value={comments.length} /> */}
            <Stat label="Polls" value={polls.length} />
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">Bio</h2>
            <p className="text-sm">{userDetail.bio || "No bio available."}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">Recent Threads</h2>
            <div className="space-y-3">
              {threads.slice(0, 3).map((thread) => (
                <ActivityItem 
                  key={thread.id}
                  icon={<FaHashtag />}
                  action="Posted"
                  topic={thread.title}
                  time={thread.createdAt ? new Date(thread.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                  link={`/thread/${thread.id}`}
                />
              ))}
            </div>
          </div>
          {/* <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">Recent Comments</h2>
            <div className="space-y-3">
              {comments.slice(0, 3).map((comment) => (
                <ActivityItem 
                  key={comment.id}
                  icon={<FaComment />}
                  action="Commented on"
                  topic={comment.content.slice(0, 50)}
                  time={comment.createdAt ? new Date(comment.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                  link={`/thread/${comment.threadId}`}
                />
              ))}
            </div>
          </div> */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-2">Recent Polls</h2>
            <div className="space-y-3">
              {polls.slice(0, 3).map((poll) => (
                <ActivityItem 
                  key={poll.id}
                  icon={<FaPoll />}
                  action="Created"
                  topic={poll.title}
                  time={poll.createdAt ? new Date(poll.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                  link={``}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100 mb-2">Communities Joined</h2>
            <div className="space-y-3">
              {communities.slice(0, 3).map((community) => (
                <ActivityItem 
                  key={community.id}
                  icon={<FaUsers />}
                  action="Joined"
                  topic={community.name}
                  time="Recently"
                  link={`/communities/${community.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="text-center">
    <span className="block text-xl font-bold text-gray-100">{value}</span>
    <span className="text-sm text-gray-300">{label}</span>
  </div>
);

const ActivityItem = ({ icon, action, topic, time, link }) => (
  <Link to={link} className="flex items-center space-x-3 bg-gray-600 p-3 rounded-md hover:bg-gray-700 cursor-pointer" >
    <div className="text-yellow-500">{icon}</div>
    <div className="flex-grow">
      <p className="text-sm text-yellow-300">
        <span className="text-gray-100">{action}</span> {topic}
      </p>
      <p className="text-xs text-gray-50">{time}</p>
    </div>
  </Link>
);

export default ProfilePage;
