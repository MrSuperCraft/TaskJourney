import type { NextPage } from "next";
import { memo, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Avatar, Tooltip, Button } from '@nextui-org/react';
import { Level } from '../../../types';
import levelsData from '../LevelTracker/levelData.json';
import { FaBolt } from "react-icons/fa";
import { db } from '@/app/firebase';
import useUserData from "@/app/hooks/useUserData";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export type LevelTrackerType = {
    showRectangleDiv?: boolean;
};

interface LevelTrackerProps {
    currentExp: number;
    level: number;
}

const LevelTracker: NextPage<LevelTrackerType & LevelTrackerProps> = memo(
    ({
        showRectangleDiv,
        currentExp,
        level,
    }) => {
        const { userData } = useUserData();
        const uid = userData?.uid;

        // State for local experience and current level
        const [localExp, setLocalExp] = useState(currentExp);
        const [currentLevel, setCurrentLevel] = useState(level);
        const [isUpdating, setIsUpdating] = useState(false);
        const [disableLevelUp, setDisableLevelUp] = useState(false); // State to manage button disabled state

        // Function to handle level up logic
        const handleLevelUp = async () => {
            const levelData = levelsData.levels.find((lvl: Level) => lvl.level === currentLevel) as Level;

            if (!levelData) {
                console.error(`Level data for level ${currentLevel} not found.`);
                return;
            }

            // Find levels that can be leveled up to based on current exp
            const levelsToLevelUp = levelsData.levels.filter(lvl => lvl.level > currentLevel && localExp >= lvl.expForNextLevel);

            if (levelsToLevelUp.length === 0) {
                setDisableLevelUp(true); // Disable button if no levels to level up to
                return; // No levels to level up to
            } else {
                setDisableLevelUp(false); // Enable button if levels to level up to
            }

            // Calculate total exp reduction needed to reach the next level
            let totalExpReduction = levelsToLevelUp.reduce((total, lvl) => total + lvl.expForNextLevel, 0);

            // Ensure totalExpReduction doesn't exceed localExp to prevent negative exp
            if (totalExpReduction > localExp) {
                totalExpReduction = localExp;
            }

            // Calculate new level
            const newLevel = currentLevel + levelsToLevelUp.length;

            try {
                // Set flag to indicate update in progress
                setIsUpdating(true);

                // Perform Firestore transaction to update level and exp
                const userRef = doc(db, `users/${uid}/statistics/stats`);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    await updateDoc(userRef, {
                        level: newLevel,
                        exp: localExp - totalExpReduction,
                    });

                    // Update localExp immediately after Firestore update
                    setLocalExp(prevExp => prevExp - totalExpReduction);
                    setCurrentLevel(newLevel); // Update currentLevel after successful level up
                }
            } catch (error) {
                console.error('Error updating level and exp:', error);
            } finally {
                // Reset update flag
                setIsUpdating(false);
            }
        };

        // Function to handle manual level up button click
        const handleLevelUpClick = () => {
            if (!isUpdating) {
                handleLevelUp();
            }
        };

        // Update localExp and currentLevel when props change
        useEffect(() => {
            setLocalExp(currentExp);
            setCurrentLevel(level);
        }, [currentExp, level]);

        // Find level data for currentLevel
        const levelData = levelsData.levels.find((lvl: Level) => lvl.level === currentLevel) as Level;

        if (!levelData) {
            console.error(`Level data for level ${currentLevel} not found.`);
            return null;
        }

        // Calculate progress percentage and color based on level data
        const progress = (localExp / levelData.expForNextLevel) * 100;
        const color = levelData.color;

        // Format large numbers with units (K, M, B, etc.)
        const formatNumber = (num: number): string => {
            const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N'];
            let unitIndex = -1;
            while (num >= 1000 && ++unitIndex < units.length) {
                num /= 1000;
            }
            return unitIndex === -1 ? num.toString() : `${num.toFixed(1)}${units[unitIndex]}`;
        };

        return (
            <Card className="transition-shadow duration-300 hover:shadow-lg p-2 max-w-sm">
                <CardHeader className="flex items-center space-x-3">
                    <Avatar
                        className={`bg-slate-50 dark:bg-slate-800 outline outline-4 outline-yellow-300 dark:outline-yellow-500 rounded-full ${levelData.color}`}
                        size="md"
                        showFallback
                        fallback={<FaBolt className="w-8 h-8 text-yellow-300 dark:text-yellow-500" />}
                    >
                        {levelData.level}
                    </Avatar>
                    <div>
                        <h5 className="text-base font-semibold">Level {levelData.level}</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatNumber(localExp)}/{formatNumber(levelData.expForNextLevel)} EXP
                        </p>
                        <p className="text-xs italic">
                            &quot;{levelData.description}&quot;
                        </p>
                    </div>
                </CardHeader>
                <CardBody className="flex flex-col items-center justify-start gap-2 p-1">
                    {showRectangleDiv && (
                        <div className="w-full h-full absolute top-0 right-0 bottom-0 left-0 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-11xl bg-gray-100 max-w-full" />
                    )}
                    <div className="w-full flex items-center justify-between text-3xs mq450:flex-wrap">
                        <div className="font-medium">
                            lvl. {currentLevel}
                        </div>
                        <div className="h-[12px] flex-1 relative shadow-inner rounded-full bg-gray-200 box-border border-[1px] border-solid border-gray-400 overflow-hidden mx-2">
                            <Tooltip content={`Progress: ${progress.toFixed(2)}%`} color="foreground" placement="bottom">
                                <div
                                    className="h-full transition-all duration-500 rounded-full"
                                    style={{
                                        width: `${progress}%`,
                                        backgroundSize: '400%',
                                        backgroundImage: `${color}`,
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div className="font-medium">
                            lvl. {currentLevel + 1}
                        </div>
                    </div>
                    <Button
                        onClick={handleLevelUpClick}
                        disabled={disableLevelUp || isUpdating} // Disable button based on state
                        className="mt-2"
                    >
                        Level Up
                    </Button>
                </CardBody>
            </Card>
        );
    }
);

LevelTracker.displayName = "LevelTracker";

export default LevelTracker;
