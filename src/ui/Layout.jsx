import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNavbar from "./BottomNavbar";
import Header from "./Header";
import MenuNavbar from "./MenuNavbar";
import RightSidebar from "./RightSidebar";
// import MenuNavbar from "./Header";
function Layout() {
  return (
    <>
      <div className="hidden lg:flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden no-scrollbar">
        {/* Header */}
        <div className="h-[65px]">
          <Header />
        </div>

        {/* Content area */}
        <div className="flex justify-center w-full flex-grow bg-gray-900">
          {/* Navbar */}
          <div className="p-2 w-[20%] max-h-[calc(100vh-65px)] flex justify-end">
            <Navbar />
          </div>

          {/* Main Content (Outlet) */}
          <div className="p-2 lg:w-[65%] xl:w-[50%] max-h-[calc(100vh-65px)]  overflow-y-auto no-scrollbar">
            <Outlet />
          </div>

          {/* Right Sidebar */}
          <div className="p-2 w-[25%] lg:hidden xl:flex justify-start max-h-[calc(100vh-70px)] overflow-y-auto no-scrollbar mb-5">
            <RightSidebar />
          </div>
        </div>
      </div>

      <div className="lg:hidden relative h-[100vh] overflow-hidden bg-gray-900">
        {/* Top Navigation Bar */}
        <div className="w-full flex justify-between items-center text-xl ">
          <MenuNavbar />
        </div>

        {/* Main Content Area */}
        <div className="w-full max-h-[calc(100vh-110px)] bg-gray-900 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed right-0 bottom-0 w-full ">
          <BottomNavbar />
        </div>
      </div>
    </>
  );
}

export default Layout;
