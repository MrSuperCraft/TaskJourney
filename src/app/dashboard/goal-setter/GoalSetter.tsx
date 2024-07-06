import React, { useState, useEffect } from 'react';
import { db } from '@/app/firebase';
import { getDocs, setDoc, doc, collection, addDoc, deleteDoc } from "firebase/firestore";

import TopMenu from './TopMenu';
import BottomRow from './BottomRow';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import useUserData from '@/app/hooks/useUserData';
import { Goal } from '../types';

const GoalSetter: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
    const [activeStage, setActiveStage] = useState(0);
    const [activeTab, setActiveTab] = useState(0); // State for active tab index

    const { user } = useUserData();

    useEffect(() => {
        const fetchGoals = async () => {
            if (!user) return;

            const goalsRef = collection(db, `users/${user.uid}/goals`);
            const snapshot = await getDocs(goalsRef);
            const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
            setGoals(goalsData);
        };

        fetchGoals();
    }, [user]);

    const startNewGoal = () => {
        setCurrentGoal({
            name: '',
            description: '',
            category: '',
            tags: [],
            stages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            archived: false
        });
        setActiveStage(0);
        setActiveTab(1);
    };

    const saveGoal = async (goal: Goal) => {
        if (!user) return;

        const goalsRef = collection(db, `users/${user.uid}/goals`);
        if (goal.id) {
            await setDoc(doc(goalsRef, goal.id), { ...goal, updatedAt: new Date().toISOString() });
        } else {
            await addDoc(goalsRef, { ...goal, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }

        // Fetch goals again to update the list
        const snapshot = await getDocs(goalsRef);
        const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
        setGoals(goalsData);
        setActiveTab(0); // Return to goals list after saving
    };

    const editGoal = (goal: Goal) => {
        setCurrentGoal(goal);
        setActiveTab(1); // Switch to the GoalForm tab
    };

    const archiveGoal = async (goal: Goal) => {
        if (!user) return;

        const goalsRef = collection(db, `users/${user.uid}/goals`);
        await setDoc(doc(goalsRef, goal.id), { ...goal, archived: true, updatedAt: new Date().toISOString() });

        // Fetch goals again to update the list
        const snapshot = await getDocs(goalsRef);
        const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
        setGoals(goalsData);
    };

    const deleteGoal = async (goal: Goal) => {
        if (!user) return;

        const goalsRef = collection(db, `users/${user.uid}/goals`);
        await deleteDoc(doc(goalsRef, goal.id));

        // Fetch goals again to update the list
        const snapshot = await getDocs(goalsRef);
        const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
        setGoals(goalsData);
    };

    return (
        <div className='bg-gray-100 dark:bg-black rounded-lg'>
            <TopMenu goals={goals} onCreateNewGoal={startNewGoal} setActiveTab={setActiveTab} activeTab={activeTab} />
            {activeTab === 0 && <GoalList goals={goals.filter(goal => !goal.archived)} onEdit={editGoal} onCreate={setActiveTab} onArchive={archiveGoal} onDelete={deleteGoal} />}
            {activeTab === 1 && <GoalForm goal={currentGoal} activeStage={activeStage} setActiveStage={setActiveStage} onSave={saveGoal} />}
            {activeTab === 2 && < GoalList goals={goals.filter(goal => goal.archived)} onEdit={editGoal} onCreate={setActiveTab} onArchive={archiveGoal} onDelete={deleteGoal} />}
        </div>
    );
};

export default GoalSetter;
