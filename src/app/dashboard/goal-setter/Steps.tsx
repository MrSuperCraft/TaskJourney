import React from 'react';

interface TimelineProps {
    activeStage: number;
    setActiveStage: (stage: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ activeStage, setActiveStage }) => {
    const stages = ["General Information", "Create Stages", "Review & Add"];

    return (
        <div className="flex items-center space-x-16 mb-8 relative">
            {stages.map((stage, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        {/* Stage Circle */}
                        <div
                            onClick={() => setActiveStage(index)}
                            className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer ${activeStage === index ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                                }`}
                        >
                            {index + 1}
                        </div>
                        {/* Stage Label */}
                        <span className="text-xs mt-1">{stage}</span>
                    </div>
                    {/* Connecting Line */}
                    {index < stages.length - 1 && (
                        <div
                            className={`flex-1 h-1 rounded-md ${activeStage > index ? 'bg-blue-500' : 'bg-gray-300'
                                } my-3 ml-5 mr-5`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Timeline;
