import React, { useState, useEffect, Key } from "react";
import TaskTable from "./Table/TaskTable";
import Task from "../types";
import useUserData from "../../../hooks/useUserData";
import { Button } from "@nextui-org/react";
import AddTaskButton from "./AddTaskButton";
import TaskCreationBox from "./TaskCreationBox";
import {
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDescription } from "@/app/contexts/EditorContext";
import { Tabs, Tab } from "@nextui-org/react";
import { FaCheckSquare, FaThumbtack } from "react-icons/fa";

type AvailableTasksTables = "active-tasks" | "completed-tasks";

const TaskManager: React.FC = () => {
  const { userData } = useUserData();
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedTasksTable, setSelectedTasksTable] =
    useState<Key>("active-tasks");
  const [showTaskCreationBox, setShowTaskCreationBox] = useState(false);
  const { description, setDescription } = useDescription();

  useEffect(() => {
    if (userData) {
      const fetchedTasks: Task[] = userData.tasks ?? [];
      setActiveTasks(fetchedTasks.filter((task) => !task.complete));
      setDailyTasks(
        fetchedTasks.filter(
          (task) => task.title.toLowerCase().includes("daily") && !task.complete
        )
      );
      setCompletedTasks(fetchedTasks.filter((task) => task.complete));
    }
  }, [userData]);

  const addTask = async (newTask: Task) => {
    try {
      if (userData?.uid) {
        const taskRef = await addDoc(
          collection(db, `users/${userData.uid}/tasks`),
          newTask
        );

        // Update local state based on task type
        if (!newTask.complete) {
          setActiveTasks((prev) => [...prev, { ...newTask, id: taskRef.id }]);
        } else {
          setCompletedTasks((prev) => [
            ...prev,
            { ...newTask, id: taskRef.id },
          ]);
        }

        // Show success toast
        toast.success("Task successfully added!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to add the task. Try again soon.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        throw new Error("User not authenticated");
      }
    } catch (error) {
      // Show error toast
      toast.error(`Failed to add task: ${(error as Error).message}`);
      console.error(`Failed to add task:`, error);
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      if (userData?.uid) {
        const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
        await deleteDoc(taskDoc);

        // Update local state based on task type
        setActiveTasks((prev) => prev.filter((task) => task.id !== taskId));
        setDailyTasks((prev) => prev.filter((task) => task.id !== taskId));
        setCompletedTasks((prev) => prev.filter((task) => task.id !== taskId));

        // Show success toast
        toast.success("Task successfully removed!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to remove the task. Try again soon.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        throw new Error("User not authenticated");
      }
    } catch (error) {
      // Show error toast
      toast.error(`Failed to remove task: ${(error as Error).message}`);
      console.error(`Failed to delete task with ID: ${taskId}`, error);
    }
  };

  const setTaskAsCompleted = async (taskId: string) => {
    try {
      if (userData?.uid) {
        const taskDoc = doc(db, `users/${userData.uid}/tasks/${taskId}`);
        await updateDoc(taskDoc, {
          complete: true,
          completedAt: new Date().toDateString(),
        });

        // Update local state based on task type
        setActiveTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, complete: true } : task
          )
        );
        setDailyTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, complete: true } : task
          )
        );
        setCompletedTasks((prev) => [
          ...prev,
          {
            ...(activeTasks.find((task) => task.id === taskId) as Task),
            complete: true,
          },
        ]);

        // Show success toast
        toast.success("Task marked as completed!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to complete the task. Try again soon.", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        throw new Error("User not authenticated");
      }
    } catch (error) {
      // Show error toast
      toast.error(`Failed to complete task: ${(error as Error).message}`);
      console.error(`Failed to complete task with ID: ${taskId}`, error);
    }
  };

  return (
    <div className="p-8 px-0 min-h-screen">
      <ToastContainer />
      <div className="w-[90%] mx-auto sm:w-full">
        <Tabs
          selectedKey={selectedTasksTable as string}
          onSelectionChange={setSelectedTasksTable}
          className="w-full mx-auto sm:w-[90%]"
        >
          <Tab
            key="active-tasks"
            title={
              <span className="dark:text-white flex justify-center text-sm">
                Active Tasks <FaThumbtack className="mt-1 ml-2" />
              </span>
            }
          >
            <AddTaskButton
              onClick={() => {
                setShowTaskCreationBox(true);
                setDescription("");
              }}
            />

            {showTaskCreationBox && (
              <TaskCreationBox
                onClose={() => setShowTaskCreationBox(false)}
                onTaskAdd={addTask}
              />
            )}

            <TaskTable
              tableType="active"
              tasks={activeTasks}
              title="Your Tasks"
              onTaskRemove={removeTask}
              onUpdateTasks={setActiveTasks}
              onCompleteTask={setTaskAsCompleted}
            />

            <TaskTable
              tableType="daily"
              tasks={dailyTasks}
              title="Daily Tasks"
              onTaskRemove={removeTask}
              onUpdateTasks={setDailyTasks}
              onCompleteTask={setTaskAsCompleted}
            />
          </Tab>
          <Tab
            key="completed-tasks"
            title={
              <span className="dark:text-white flex justify-center text-sm">
                Completed Tasks <FaCheckSquare className="mt-1 ml-2" />
              </span>
            }
          >
            <TaskTable
              tableType="completed"
              tasks={completedTasks}
              title="Completed Tasks"
              onTaskRemove={removeTask}
              onUpdateTasks={setCompletedTasks}
              onCompleteTask={setTaskAsCompleted}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskManager;
