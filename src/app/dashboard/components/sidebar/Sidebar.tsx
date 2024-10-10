"use client";

import { useContext, useState, useEffect } from "react";
import {
  FaTasks,
  FaCalendarAlt,
  FaBell,
  FaUserCircle,
  FaCog,
  FaPlus,
  FaMoon,
  FaSun,
  FaCommentAlt,
  FaComment,
  FaTrophy,
  FaStar,
  FaChartPie,
  FaEllipsisH,
} from "react-icons/fa";
import {
  PanelRightClose,
  MessageCircle,
  LayoutDashboard,
  Book,
  Calendar,
  Bot,
  BarChart3,
  Star,
  Trophy,
  Moon,
  LogOut,
} from "lucide-react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import TabButton from "./TabButton";
import { Button, Divider, Spinner, Tooltip } from "@nextui-org/react";
import { ThemeContext } from "../../../contexts/ThemeContext"; // Adjust this import to your context's location
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import { useProfile } from "@/app/contexts/ProfileContext";
import Image from "next/image";
import { Switch } from "@nextui-org/react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logOut } = useAuth();
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const { profilePic, username } = useProfile();
  const router = useRouter();

  const handleTabClick = (tabName: string) => {
    setLoadingTab(tabName);
    router.push(`/dashboard/${tabName.toLowerCase()}`);
    setTimeout(() => setLoadingTab(null), 3000); // Clear loading state after 3 seconds
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleNewChat = () => {
    console.log("New AI chat opened");
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen((prevState) => !prevState);
  };
  /* 
  
 */
  function CloseSidebarButton() {
    return (
      <Tooltip content="Close Sidebar" color="foreground" placement="bottom">
        <Button
          isIconOnly
          onClick={handleCloseSidebar}
          className="bg-primary-100 text-primary-500 p-0 w-min"
        >
          <PanelRightClose />
        </Button>
      </Tooltip>
    );
  }

  function AIChatButton() {
    return (
      <Tooltip content="Send Feedback" color="foreground" placement="top">
        <Button
          isIconOnly
          className="bg-[#BABABA]/10 text-[#BABABA]"
          aria-label="Send Feedback"
        >
          {loadingTab === "feedback" ? (
            <Spinner color="current" />
          ) : (
            <MessageCircle />
          )}
        </Button>
      </Tooltip>
    );
  }

  /* const AVAILABLE_CORE_SIDEBAR_LINKS = [
    {
      icon: <Book />,
      label: "Task Manager",
      onClick: handleTabClick("task-manager"),
      isLoading: loadingTab === "task-manager",
    },
    {
      icon: <Calendar />,
      label: "Calendar",
      onClick: handleTabClick("Calendar"),
      isLoading: loadingTab === "calendar",
    },
  ]; */

  return (
    <>
      {/* Sidebar for larger screens */}
      <motion.div
        className={`sidebar-container ${
          isSidebarOpen ? "open" : "closed"
        } hidden md:flex`} // Hide on mobile devices
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={{
          open: { width: "250px", opacity: 100, transition: { duration: 0.3 } },
          closed: { width: "0px", opacity: 0, transition: { duration: 0.3 } },
        }}
      >
        <motion.div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-64 flex flex-col items-center justify-between min-h-full shadow-lg">
          {/* Top Buttons */}
          <div className="flex w-full justify-between p-2">
            <CloseSidebarButton />
            <AIChatButton />
          </div>

          {/* Branding */}
          {/*   <div className="py-4 text-2xl font-bold text-cyan-700 dark:text-primary-brand-600 flex items-center justify-center">
            <FaTasks className="text-cyan-700 dark:text-primary-brand-600 mr-2 " />
            TaskJourney
          </div> */}

          {/* Profile Picture and Welcome Message */}

          {/* Sidebar Content */}
          <div className="flex flex-col w-full p-2 gap-2">
            <TabButton
              icon={<Book />}
              label="Task Manager"
              onClick={() => handleTabClick("task-manager")}
              isLoading={loadingTab === "task-manager"}
            />
            <TabButton
              icon={<Calendar />}
              label="Calendar"
              onClick={() => handleTabClick("Calendar")}
              isLoading={loadingTab === "calendar"}
            />
            {/*      TODO: Remember to add the AI functionality here */}
            <TabButton
              icon={<Bot />}
              label="AI Assistance"
              onClick={() => handleTabClick("Calendar")}
              isLoading={loadingTab === "calendar"}
            />
            <TabButton
              icon={<BarChart3 />}
              label="Statistics "
              onClick={() => handleTabClick("Statistics")}
              isLoading={loadingTab === "statistics"}
            />
            <TabButton
              icon={<Star />}
              label="Achievements"
              onClick={() => handleTabClick("achievements")}
              isLoading={loadingTab === "achievements"}
            />
            <TabButton
              icon={<Trophy />}  
              label="Leaderboards"
              onClick={() => handleTabClick("achievements")}
              isLoading={loadingTab === "achievements"}
            />
            <div className="p-2 w-full text-[#BABABA] flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Moon />
                <span className="block text-sm">Dark Mode</span>
              </div>
              <Switch
                color="success"
                className="text-[#BABABA]"
                onValueChange={toggleTheme}
              ></Switch>
            </div>
            <div onClick={logOut} className="text-sm font-medium text-[#BABABA] flex items-center gap-2 p-2 mt-2 cursor-pointer w-full">
                <LogOut/>
                Logout
            </div>
          </div>

          {/* User Information and profile display*/}
       
          <div className="flex flex-col mr-auto w-full p-4 mb-6">
         
            <div className="flex gap-4">
                
              {profilePic ? (
                <Image
                    className="object-cover w-12 h-12 rounded-full"
                  src={profilePic}
                  alt="User Image"
                  width={32}
                  height={32}
                  unoptimized
                ></Image>
              ) : (
                <FaUserCircle />
              )}
              <div className="flex flex-col">
              <span className="font-medium text-[#1e1e1e]">{username ?? "User"}</span>
              <Link href="/dashboard/settings" className="font-medium mt-1 text-[#BABABA] text-sm">Go to settings</Link>
              </div>

            </div>
           
          </div>
        </motion.div>

        {/*  <Tooltip content="Settings" color="foreground" placement="top">
                <Button
                  isIconOnly
                  className="bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  onClick={() => handleTabClick("settings")}
                  aria-label="Settings"
                >
                  {loadingTab === "settings" ? (
                    <Spinner color="current" />
                  ) : (
                    <FaCog className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  )}
                </Button>
              </Tooltip> */}
        {/*  <Tooltip
                content="Notifications"
                color="foreground"
                placement="top"
              >
                <Button
                  isIconOnly
                  className="ml-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  onClick={() => handleTabClick("notifications")}
                  aria-label="Notifications"
                >
                  {loadingTab === "notifications" ? (
                    <Spinner color="current" />
                  ) : (
                    <FaBell className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  )}
                </Button>
              </Tooltip> */}
        {/*  <Tooltip
                content="Toggle Theme"
                color="foreground"
                placement="top"
              >
                <Button
                  isIconOnly
                  className="ml-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? (
                    <FaSun className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  ) : (
                    <FaMoon className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  )}
                </Button>
              </Tooltip>
            </div>
            <div className="flex justify-center">
              <Tooltip
                content="Achievements"
                color="foreground"
                placement="top"
              >
                <Button
                  isIconOnly
                  className="mr-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  onClick={() => handleTabClick("achievements")}
                  aria-label="Achievements"
                >
                  {loadingTab === "achievements" ? (
                    <Spinner color="current" />
                  ) : (
                    <FaStar className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  )}
                </Button>
              </Tooltip>
              <Tooltip
                content="Leaderboards"
                color="foreground"
                placement="top"
              >
                <Button
                  isIconOnly
                  className="bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  onClick={() => handleTabClick("leaderboards")}
                  aria-label="Leaderboards"
                >
                  {loadingTab === "leaderboards" ? (
                    <Spinner color="current" />
                  ) : (
                    <FaTrophy className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="Statistics" color="foreground" placement="top">
                <Button
                  isIconOnly
                  className="ml-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  onClick={() => handleTabClick("statistics")}
                  aria-label="Statistics"
                >
                  {loadingTab === "statistics" ? (
                    <Spinner color="current" />
                  ) : (
                    <FaChartPie className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="More" color="foreground" placement="top">
                <Button
                  isIconOnly
                  className="ml-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  onClick={() => handleTabClick("more")}
                  aria-label="More"
                >
                  {loadingTab === "more" ? (
                    <Spinner color="current" />
                  ) : (
                    <FaEllipsisH className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                  )}
                </Button>
              </Tooltip> */}
      </motion.div>

      {/* Sidebar for mobile devices */}
      <motion.div
        className={`fixed inset-0 z-50 md:hidden ${
          isMobileSidebarOpen ? "flex" : "hidden"
        }`} // Show on mobile devices only
        initial="closed"
        animate={isMobileSidebarOpen ? "open" : "closed"}
        variants={{
          open: {
            width: "100%",
            height: "100%",
            opacity: 1,
            transition: { duration: 0.3 },
          },
          closed: {
            width: "0%",
            height: "0%",
            opacity: 0,
            transition: { duration: 0.3 },
          },
        }}
      >
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col items-center justify-between w-full h-full shadow-lg">
          {/* Top Buttons */}
          <div className="flex w-full justify-between p-2">
            <Tooltip
              content="Close Sidebar"
              color="foreground"
              placement="bottom"
            >
              <Button
                isIconOnly
                className="bg-primary-brand-200 dark:bg-gray-700"
                onClick={handleMobileSidebarToggle}
                aria-label="Close Sidebar"
              >
                <TbLayoutSidebarLeftCollapse className="text-cyan-700 dark:text-primary-brand-600 text-3xl" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Get AI Assistance"
              color="foreground"
              placement="bottom"
            >
              <Button
                isIconOnly
                className="bg-primary-brand-200 dark:bg-gray-700"
                onClick={() => handleTabClick("ai-assistance")}
                aria-label="Get AI Assistance"
              >
                <FaComment className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
              </Button>
            </Tooltip>
          </div>

          {/* Branding */}
          <div className="py-4 text-2xl font-bold text-cyan-700 dark:text-primary-brand-600 flex items-center justify-center">
            <FaTasks className="text-cyan-700 dark:text-primary-brand-600 mr-2" />
            TaskJourney
          </div>

          {/* Profile Picture and Welcome Message */}
          <div className="flex flex-col items-center mt-4">
            <div className="flex items-center">
              {profilePic ? (
                <Image
                  src={profilePic}
                  alt="Profile"
                  className="w-20 h-20 mr-3 border rounded-full object-cover" // Adjust size here
                  width={80}
                  height={80}
                  unoptimized // Disable optimization for this image
                />
              ) : (
                <FaUserCircle className="text-cyan-700 dark:text-primary-brand-600 text-4xl mr-2" />
              )}
              <span className="text-xl font-semibold">{username}</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Welcome back, {username}!
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col space-y-4 mt-4">
            <TabButton
              icon={
                <FaTasks className="text-cyan-700 dark:text-primary-brand-600" />
              }
              label="Task Manager"
              onClick={() => handleTabClick("task-manager")}
              isLoading={loadingTab === "task-manager"}
            />
            <TabButton
              icon={
                <FaCalendarAlt className="text-cyan-700 dark:text-primary-brand-600" />
              }
              label="Calendar"
              onClick={() => handleTabClick("calendar")}
              isLoading={loadingTab === "calendar"}
            />
            {/* Add more TabButton components for additional tabs */}
          </div>

          {/* Settings, Notifications, and Theme Toggle Icons */}
          <div className="flex mt-auto mb-5 justify-center">
            <Tooltip content="Send Feedback" color="foreground" placement="top">
              <Button
                isIconOnly
                className="mr-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                aria-label="Send Feedback"
              >
                {loadingTab === "feedback" ? (
                  <Spinner color="current" />
                ) : (
                  <FaCommentAlt className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                )}
              </Button>
            </Tooltip>
            <Tooltip content="Settings" color="foreground" placement="top">
              <Button
                isIconOnly
                className="bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                onClick={() => handleTabClick("settings")}
                aria-label="Settings"
              >
                {loadingTab === "settings" ? (
                  <Spinner color="current" />
                ) : (
                  <FaCog className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                )}
              </Button>
            </Tooltip>
            <Tooltip content="Notifications" color="foreground" placement="top">
              <Button
                isIconOnly
                className="ml-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                onClick={() => handleTabClick("notifications")}
                aria-label="Notifications"
              >
                {loadingTab === "notifications" ? (
                  <Spinner color="current" />
                ) : (
                  <FaBell className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                )}
              </Button>
            </Tooltip>
            <Tooltip content="Toggle Theme" color="foreground" placement="top">
              <Button
                isIconOnly
                className="ml-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <FaSun className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                ) : (
                  <FaMoon className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
                )}
              </Button>
            </Tooltip>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar Toggle Button */}
      <div
        className="fixed bottom-4 right-4 md:hidden"
        style={{ zIndex: 1000 }}
      >
        <Tooltip content="Open Sidebar" color="foreground" placement="left">
          <Button
            isIconOnly
            className="bg-primary-brand-200 dark:bg-gray-700"
            onClick={handleMobileSidebarToggle}
            aria-label="Open Sidebar"
          >
            <FaPlus className="text-cyan-700 dark:text-primary-brand-600 text-xl" />
          </Button>
        </Tooltip>
      </div>
      <div className="fixed top-2 left-2 hidden md:flex">
        {/*                 <Tooltip content="Close Sidebar" color="foreground" placement="bottom">
                    <Button isIconOnly className="bg-primary-brand-200 dark:bg-gray-700" onClick={handleCloseSidebar} aria-label="Close Sidebar">
                        <TbLayoutSidebarLeftCollapse className="text-cyan-700 dark:text-primary-brand-600 text-3xl" />
                    </Button>
                </Tooltip> */}
      </div>
    </>
  );
};

export default Sidebar;
