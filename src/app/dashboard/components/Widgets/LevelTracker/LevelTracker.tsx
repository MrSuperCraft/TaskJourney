import React from 'react';
import { Card, CardBody, CardHeader, Avatar, Tooltip } from '@nextui-org/react';
import { FaBolt } from 'react-icons/fa';
import { Level } from '../../../types';
import levelsData from '../LevelTracker/levelData.json';

interface LevelTrackerProps {
    currentExp: number;
    level: number;
}

const LevelTracker: React.FC<LevelTrackerProps> = ({ currentExp, level }) => {
    const levelData = levelsData.levels.find((lvl: Level) => lvl.level === level) as Level;

    if (!levelData) {
        console.error(`Level data for level ${level} not found.`);
        return null;
    }

    let colorClass = levelData.color; // Default color class
    console.log(`Level ${level} color class:`, colorClass); // Log the initial color class

    const progress = (currentExp / levelData.expForNextLevel) * 100;

    const formatNumber = (num: number) => {
        // 1,000 = 1K, 1,000,000 = 1M, 1,000,000,000 = 1B
        if (num >= 1000 && num < 1000000) {
            return `${(num / 1000).toFixed(1)}K`;
        } else if (num >= 1000000 && num < 1000000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000000000) {
            return `${(num / 1000000000).toFixed(1)}B`;
        } else {
            return num.toString();
        }
    }

    return (
        <Card className="transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="flex items-center space-x-4">
                <Avatar
                    className={`bg-slate-50 dark:bg-slate-800 outline outline-4 outline-yellow-300 dark:outline-yellow-500 rounded-full ${colorClass}`}
                    size="lg"
                    showFallback
                    fallback={<FaBolt className="w-8 h-8 text-yellow-300 dark:text-yellow-500" />}
                >
                    {levelData.level}
                </Avatar>
                <div className="ml-3">
                    <h5 className="text-lg font-semibold">Level {levelData.level}</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatNumber(currentExp)}/{formatNumber(levelData.expForNextLevel)} EXP
                    </p>
                    <p className='text-sm text-center italic'>
                        &quot;{levelData.description}&quot; <br />
                    </p>
                </div>
            </CardHeader>
            <CardBody className="flex flex-row justify-between items-center">
                <span>Level {levelData.level}</span>
                <Tooltip content={`Progress: ${progress.toFixed(2)}%`} color="foreground" placement="bottom">
                    <div className="w-[90%] h-5 rounded-full relative overflow-hidden ">
                        <div
                            className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500 z-1000`}
                            style={{ width: `${progress}%`, backgroundSize: '400%', backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFF 50%, rgba(255,255,255,0) 100%)' }}
                        />
                    </div>
                </Tooltip>
                <span>Level {levelData.level + 1}</span>
            </CardBody>
        </Card>
    );
};

export default LevelTracker;

