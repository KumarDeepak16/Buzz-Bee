import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ThreadView from "./pages/ThreadView";
import CommunityList from "./components/CommunityList";
import CommunityView from "./pages/CommunityView";
import Layout from "./ui/Layout";
import Loader from "./ui/Loader";
import AuthForm from "./components/AuthForm";
import CreateCommunity from "./components/CreateCommunity";
import RightSidebar from "./ui/RightSidebar";
import ProfilePage from "./pages/ProfilePage";
import CreateThreadDialog from "./components/CreateThreadDialog";
import BuzzMain from "./components/BuzzMain";
import SearchComponent from "./ui/SearchComponent";
import PollComponent from "./pages/PollComponent";
import RulesAndRegulations from "./pages/RulesAndRegulations";
import FeedbackPage from "./pages/FeedbackPage";
import Admin from "./pages/Admin";
import { Toaster } from 'react-hot-toast';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      ,
      { path: "thread/:id", element: <ThreadView /> },
      { path: "create-community", element: <CreateCommunity /> },
      { path: "create-thread", element: <CreateThreadDialog /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "rulesandregulations", element: <RulesAndRegulations /> },
      { path: "feedbackpage ", element: <FeedbackPage /> },
      { path: "trends", element: <RightSidebar /> },
      { path: "poll", element: <PollComponent /> },
      { path: "communities", element: <CommunityList /> },
      { path: "communities/:id", element: <CommunityView /> },
      { path: "search", element: <SearchComponent /> },
    ],
  },
  { path: "/login", element: <AuthForm /> }, // Optional, to handle unmatched routes
  { path: "/Home", element: <BuzzMain /> }, // Optional, to handle unmatched routes
  { path: "/buzzbee/controls/admin", element: <Admin /> }
]);

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <RouterProvider router={router} />
          <Toaster />
        </>
      )}
    </>
  );
};

export default App;
