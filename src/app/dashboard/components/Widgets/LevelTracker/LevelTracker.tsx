import type { NextPage } from "next";
import { memo } from "react";
import { Card, CardBody, CardHeader, Avatar, Tooltip } from '@nextui-org/react';
import { Level } from '../../../types';
import levelsData from '../LevelTracker/levelData.json';
import { FaBolt } from "react-icons/fa";

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
        const levelData = levelsData.levels.find((lvl: Level) => lvl.level === level) as Level;

        if (!levelData) {
            console.error(`Level data for level ${level} not found.`);
            return null;
        }

        const progress = (currentExp / levelData.expForNextLevel) * 100;
        const color = levelData.color;
        console.log(color);

        const formatNumber = (num: number): string => {
            const units = ['K', 'M', 'B'];
            let unitIndex = -1;
            while (num >= 1000 && ++unitIndex < units.length) {
                num /= 1000;
            }
            return unitIndex === -1 ? num.toString() : `${num.toFixed(1)}${units[unitIndex]}`;
        };

        return (
            <Card className={`transition-shadow duration-300 hover:shadow-lg p-2 max-w-sm`}>
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
                            {formatNumber(currentExp)}/{formatNumber(levelData.expForNextLevel)} EXP
                        </p>
                        <p className='text-xs italic'>
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
                            lvl. {levelData.level}
                        </div>
                        <div className="h-[12px] flex-1 relative shadow-inner rounded-full bg-gray-200 box-border border-[1px] border-solid border-gray-400 overflow-hidden mx-2">
                            <Tooltip content={`Progress: ${progress.toFixed(2)}%`} color="foreground" placement="bottom">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full`}
                                    style={{
                                        width: `${progress}%`, backgroundSize: '400%', backgroundImage: `${color}`,
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div className="font-medium">
                            lvl. {levelData.level + 1}
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }
);

LevelTracker.displayName = "LevelTracker";


export default LevelTracker;
