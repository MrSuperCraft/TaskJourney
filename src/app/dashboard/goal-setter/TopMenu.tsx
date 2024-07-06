import React from 'react';
import { FaTasks, FaPlusCircle, FaArchive } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import { Goal } from '../types';

interface TopMenuProps {
    goals: Goal[]; // Replace with actual Goal type
    onCreateNewGoal: () => void; // Function to handle creating a new goal
    setActiveTab: (tabIndex: number) => void; // Function to set active tab index
    activeTab: number; // Active tab index
}

const TopMenu: React.FC<TopMenuProps> = ({ goals, onCreateNewGoal, setActiveTab, activeTab }) => {
    const handleCreateNewGoal = () => {
        onCreateNewGoal();
        setActiveTab(1); // Set active tab to create goal tab (index 1)
    };

    const activeGoalsCount = goals.filter((goal) => !goal.archived).length;
    const archivedGoalsCount = goals.filter((goal) => goal.archived).length;

    return (
        <div className="flex justify-center items-center bg-gray-300 dark:bg-gray-800 p-4 rounded-lg dark:rounded-lg">
            <div className="flex items-center space-x-4">
                <Button onClick={() => setActiveTab(0)} className={activeTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-400'}>
                    Active Goals <FaTasks className="ml-2" /> {activeGoalsCount}
                </Button>
                <Button onClick={handleCreateNewGoal} className={activeTab === 1 ? 'bg-green-500 text-white' : 'bg-gray-400'}>
                    Create Goal <FaPlusCircle className="ml-2" />
                </Button>
                <Button onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-400'}>
                    Archived Goals <FaArchive className="ml-2" /> {archivedGoalsCount}
                </Button>
            </div>
        </div>
    );
};

export default TopMenu;
