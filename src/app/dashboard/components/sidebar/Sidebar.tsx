"use client";

import { useContext, useState } from "react";
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
import { TbTargetArrow } from "react-icons/tb";
import { HiMiniSparkles } from "react-icons/hi2";

import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import TabButton from "./TabButton";
import { Button, Modal, Spinner, Tooltip, ModalBody, ModalContent, Divider } from "@nextui-org/react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProfile } from "@/app/contexts/ProfileContext";
import Image from "next/image";
import { auth } from "@/app/firebase";

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const { profilePic, username } = useProfile();
  const router = useRouter();

  const handleTabClick = (tabName: string) => {
    setLoadingTab(tabName);
    router.push(`/dashboard/${tabName.toLowerCase()}`);
    setTimeout(() => setLoadingTab(null), 3000); // Clear loading state after 3 seconds
  };

  /** Logouts the current user from the system.  */
  const handleLogout = () => {
    auth.signOut();
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

  const openNewsModal = () => {
    setIsNewsModalOpen(true);
  };

  return (
    <>
      {/* Sidebar for larger screens */}
      <motion.div
        className={`sidebar-container ${isSidebarOpen ? "open" : "closed"
          } hidden md:flex`} // Hide on mobile devices
        initial="open"
        key="desktop-sidebar"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={{
          open: { width: "250px", opacity: 100, transition: { duration: 0.3 } },
          closed: { width: "0px", opacity: 0, transition: { duration: 0.3 } },
        }}
      >
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white w-64 flex flex-col items-center justify-between min-h-full shadow-lg">
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
                onClick={handleCloseSidebar}
                aria-label="Close Sidebar"
              >
                <TbLayoutSidebarLeftCollapse className="text-cyan-700 dark:text-primary-brand-600 text-3xl" />
              </Button>
            </Tooltip>
            <Tooltip
              color="foreground"
              placement="bottom"
              content="What's New?">
              <Button
                isIconOnly
                className="bg-primary-brand-200 dark:bg-gray-700"
                aria-label="What's New?"
                onClick={openNewsModal}
              >
                <HiMiniSparkles className="text-cyan-700 dark:text-primary-brand-600 text-3xl" />
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
            <FaTasks className="text-cyan-700 dark:text-primary-brand-600 mr-2 " />
            TaskJourney
          </div>

          {/* Profile Picture and Welcome Message */}
          {username.length >= 12 ? (
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
          ) : (
            <div className="flex flex-col items-center mt-4">
              <div className="flex flex-col items-center">
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
                Welcome back, <br /> {username}!
              </div>
            </div>
          )}

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
              onClick={() => handleTabClick("Calendar")}
              isLoading={loadingTab === "calendar"}
            />
            <TabButton
              icon={
                <TbTargetArrow className="text-cyan-700 dark:text-primary-brand-600 text-lg" />
              }
              label="Goal Setter"
              onClick={() => handleTabClick("goal-setter")}
              isLoading={loadingTab === "goal-setter"}
            />
            <Button color="danger" onClick={handleLogout}>
              Logout
            </Button>
            {/* Add more TabButton components for additional tabs */}
          </div>

          {/* Settings, Notifications, and Theme Toggle Icons */}
          <div className="flex flex-col items-center mt-auto mb-5">
            <div className="flex justify-center mb-4">
              <Tooltip
                content="Send Feedback"
                color="foreground"
                placement="top"
              >
                <Button
                  isIconOnly
                  className="mr-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                  aria-label="Send Feedback"
                  onClick={() => handleTabClick("feedback")}
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
              <Tooltip
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
              </Tooltip>
              <Tooltip
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
              </Tooltip>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sidebar for mobile devices */}

      <motion.div
        className={`fixed inset-0 z-50 md:hidden duration-200 min-h-screen min-w-full ${!isMobileSidebarOpen ? "pointer-events-none" : ""
          }`} // Show on mobile devices only. The pointer events none is used to disable any kind of interactivity when the sidebar is hidden.
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
            <TabButton
              icon={
                <TbTargetArrow className="text-cyan-700 dark:text-primary-brand-600 text-lg" />
              }
              label="Goal Setter"
              onClick={() => handleTabClick("goal-setter")}
              isLoading={loadingTab === "goal-setter"}
            />
            <Button color="danger" onClick={handleLogout}>
              Logout
            </Button>
            {/* Add more TabButton components for additional tabs */}
          </div>

          {/* Settings, Notifications, and Theme Toggle Icons */}
          <div className="flex mt-auto mb-5 justify-center">
            <Tooltip content="Send Feedback" color="foreground" placement="top">
              <Button
                isIconOnly
                className="mr-4 bg-primary-brand-200 dark:bg-gray-700 cursor-pointer"
                aria-label="Send Feedback"
                onClick={() => handleTabClick("feedback")}
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
        <Tooltip content="Close Sidebar" color="foreground" placement="bottom">
          <Button
            isIconOnly
            className="bg-primary-brand-200 dark:bg-gray-700"
            onClick={handleCloseSidebar}
            aria-label="Close Sidebar"
          >
            <TbLayoutSidebarLeftCollapse className="text-cyan-700 dark:text-primary-brand-600 text-3xl" />
          </Button>
        </Tooltip>
      </div>

      {/* News Modal */}
      <Modal closeButton aria-labelledby="modal-title" isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} size="lg">
        <ModalContent>
          <ModalBody>

            <article className="prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl">
              <h2 className="text-2xl font-bold mb-4 pt-8 mx-auto text-center"><HiMiniSparkles className="text-cyan-700 dark:text-primary-brand-600 inline" />   Updates  & Patches <FaTrophy className="text-cyan-700 dark:text-primary-brand-600 inline" /></h2>
              <h3>v0.2.0alpha</h3>
              <ul>
                <li><b>NEW:</b> Added daily tasks to the task manager</li>
                <li>Added AI Assistant</li>
                <li>Added Calendar</li>
                <li>Added Goal Setter</li>
                <li>Fixed bugs from the previous version</li>
              </ul>
              <Divider />
              <h3>v0.1.0alpha</h3>
              <ul>
                <li>Added Task Manager</li>
                <li>Added Settings</li>

              </ul>
            </article>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;
