import React from 'react';

interface EventTooltipProps {
    upcomingCount: number;
    activeCount: number;
    recentEndedCount: number;
    endedCount: number;
}

const EventTooltip: React.FC<EventTooltipProps> = ({ upcomingCount, activeCount, recentEndedCount, endedCount }) => {
    return (
        <div className="flex flex-col text-left">
            {upcomingCount > 0 && (
                <span className="px-2 py-1 rounded">
                    <span className={`w-2 h-2 rounded-full inline-block mr-1 bg-blue-500`}></span>
                    {upcomingCount}
                    <span className="ml-1">upcoming event{upcomingCount !== 1 ? 's' : ''}</span>
                </span>
            )}
            {activeCount > 0 && (
                <span className="px-2 py-1 rounded">
                    <span className={`w-2 h-2 rounded-full inline-block mr-1 bg-green-500`}></span>
                    {activeCount}
                    <span className="ml-1">active event{activeCount !== 1 ? 's' : ''}</span>
                </span>
            )}
            {recentEndedCount > 0 && (
                <span className="px-2 py-1 rounded">
                    <span className={`w-2 h-2 rounded-full inline-block mr-1 bg-orange-500`}></span>
                    {recentEndedCount}
                    <span className="ml-1">recently ended event{recentEndedCount !== 1 ? 's' : ''}</span>
                </span>
            )}
            {endedCount > 0 && (
                <span className="px-2 py-1 rounded">
                    <span className={`w-2 h-2 rounded-full inline-block mr-1 bg-red-500`}></span>
                    {endedCount}
                    <span className="ml-1">event{endedCount !== 1 ? 's' : ''} ended</span>
                </span>
            )}
        </div>
    );
};

export default EventTooltip;
