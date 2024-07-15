import React, { useState, useEffect } from 'react';
import { Input, Button, Spacer, Textarea, Select, SelectItem, Divider, Chip } from '@nextui-org/react';
import { Goal } from '../types';
import Timeline from './Steps'; // Renamed from 'Steps' based on your import
import { FaBriefcase, FaMoneyBill, FaBook, FaHeart, FaSmile, FaQuestion, FaPlane, FaEllipsisH } from 'react-icons/fa';
import assignTagColor from '@/app/utils/AssignColor';

interface GoalFormProps {
    goal: Goal | null;
    activeStage: number;
    setActiveStage: (stage: number) => void;
    onSave: (goal: Goal) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, activeStage, setActiveStage, onSave }) => {
    const [goalData, setGoalData] = useState<Goal>({
        name: '',
        description: '',
        category: '',
        tags: [],
        stages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        archived: false
    });

    useEffect(() => {
        if (goal) {
            setGoalData(goal);
            setActiveStage(0); // Set active stage to 0 when a new goal is loaded
        } else {
            // If no goal is provided, initialize with default values
            setGoalData({
                name: '',
                description: '',
                category: '',
                tags: [],
                stages: [''], // Ensure at least one stage
                createdAt: new Date(),
                updatedAt: new Date(),
                archived: false
            });
            setActiveStage(0); // Set active stage to 0 for new goals
        }
    }, [goal, setActiveStage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGoalData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleStageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const stages = [...goalData.stages];
        stages[index] = e.target.value;
        setGoalData({ ...goalData, stages });
    };

    const handleCategoryChange = (category: string) => {
        setGoalData({ ...goalData, category });
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagsInput = e.target.value;
        const tags = tagsInput.split(',').map(tag => tag.trim());
        setGoalData({ ...goalData, tags });
    };

    const handleSave = () => {
        onSave(goalData);
        if (!goal?.id) {
            setGoalData({
                name: '',
                description: '',
                category: '',
                tags: [],
                stages: [''], // Ensure at least one stage for new goals
                createdAt: new Date(),
                updatedAt: new Date(),
                archived: false
            });
            setActiveStage(0); // Reset active stage to 0 after saving new goal
        }
    };

    const renderStageContent = () => {
        switch (activeStage) {
            case 0:
                return (
                    <>
                        <h1 className='font-bold text-2xl'>Create Your Goal</h1>
                        <Spacer y={2} />
                        <div className="space-y-4">
                            <Input
                                name="name"
                                value={goalData.name}
                                onChange={handleInputChange}
                                label="Name"
                                placeholder={`E.g "Improve my health by exercising!"`}
                            />
                            <Textarea
                                name="description"
                                value={goalData.description}
                                onChange={handleInputChange}
                                label="Goal Description"
                                placeholder={`Describe your goal here. For example, "Set myself for success by exercising regularly, with a planned out routine of 30 minutes per day"`}
                                minRows={3} // Ensure textarea can grow and accommodate multiple lines
                            />
                            <Select
                                value={goalData.category}
                                onChange={(e) => handleCategoryChange(e.target.value as string)}
                                label="Category"
                                placeholder="Select a category so your goal can be easily found"
                                className='overflow-y-auto max-h-32'
                            >
                                <SelectItem key="work" value="work" endContent={<FaBriefcase />}>
                                    Work
                                </SelectItem>
                                <SelectItem key="finance" value="finance" endContent={<FaMoneyBill />}>
                                    Finance
                                </SelectItem>
                                <SelectItem key="education" value="education" endContent={<FaBook />}>
                                    Education
                                </SelectItem>
                                <SelectItem key="health" value="health" endContent={<FaHeart />}>
                                    Health
                                </SelectItem>
                                <SelectItem key="personal" value="personal" endContent={<FaSmile />}>
                                    Personal
                                </SelectItem>
                                <SelectItem key="travel" value="travel" endContent={<FaPlane />}>
                                    Travel
                                </SelectItem>
                                <SelectItem key="misc" value="misc" endContent={<FaQuestion />}>
                                    Misc
                                </SelectItem>
                                <SelectItem key="other" value="other" endContent={<FaEllipsisH />}>
                                    Other
                                </SelectItem>
                            </Select>
                            <Input
                                name="tags"
                                value={goalData.tags.join(', ')}
                                onChange={handleTagsChange}
                                label="Tags (comma separated)"
                                placeholder="Enter tags related to your goal"
                            />
                        </div>
                    </>
                );
            case 1:
                return (
                    <div className="space-y-4">
                        <h1 className='font-bold text-2xl'>Set your stages</h1>
                        <Spacer y={2} />
                        {goalData.stages.map((stage, index) => (
                            <Textarea
                                key={index}
                                value={stage}
                                onChange={(e) => handleStageChange(e, index)}
                                label={`Stage ${index + 1}`}
                                placeholder={`Describe stage ${index + 1}`}
                                cols={50}
                                rows={3}
                                minRows={3} // Ensure textarea can grow and accommodate multiple lines
                            />
                        ))}
                        <Button onClick={() => setGoalData({ ...goalData, stages: [...goalData.stages, ''] })}>
                            Add Stage
                        </Button>
                    </div>
                );
            case 2:
                return (
                    <article className='prose prose-sm md:prose-lg lg:prose-xl dark:prose-invert prose-p:text-lg prose-h4:text-xl'>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold">Review Your Goal</h3>
                            <p><strong>Name:</strong> {goalData.name}</p>
                            <p><strong>Description:</strong> {goalData.description}</p>
                            <p><strong>Category:</strong> {goalData.category}</p>
                            {goalData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {goalData.tags.map(tag => (
                                        <Chip key={tag} className={`bg-[${assignTagColor(tag)}]`}>{tag}</Chip>
                                    ))}
                                </div>
                            )}
                            <Divider />
                            <h4 className='mt-4'><strong>Stages:</strong></h4>
                            <div className="flex flex-col space-y-2">
                                {goalData.stages.map((stage, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                        <p className="ml-2"><strong>Stage {index + 1}:</strong> {stage}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-zinc-950 shadow-md rounded-lg">
            <Timeline activeStage={activeStage} setActiveStage={setActiveStage} />
            <div className="mt-4">
                {renderStageContent()}
            </div>
            <div className="flex justify-end mt-4 space-x-4">
                {activeStage > 0 && (
                    <Button onClick={() => setActiveStage(activeStage - 1)} className="bg-primary-brand-700 dark:bg-primary-brand-600">
                        Back
                    </Button>
                )}
                {activeStage < 2 && (
                    <Button onClick={() => setActiveStage(activeStage + 1)} className="bg-primary-brand-700 dark:bg-primary-brand-600">
                        Next
                    </Button>
                )}
                {activeStage === 2 && (
                    <Button onClick={handleSave} className="bg-primary-brand-700 dark:bg-primary-brand-600">
                        Save Goal
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GoalForm;
