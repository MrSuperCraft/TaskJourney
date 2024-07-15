import React from 'react';
import { Chip, Button, Divider } from '@nextui-org/react';
import { Goal } from '../types';
import { FaPlus, FaPencilRuler, FaFileArchive } from 'react-icons/fa';
import assignTagColor from '@/app/utils/AssignColor';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaDeleteLeft } from 'react-icons/fa6';

interface GoalListProps {
    goals: Goal[];
    onEdit: (goal: Goal) => void;
    onCreate: (tabIndex: number) => void; // Function to handle goal creation
    onArchive: (goal: Goal) => void; // Function to handle goal archiving
    onDelete: (goal: Goal) => void; // Function to handle goal deletion
}

const GoalList: React.FC<GoalListProps> = ({ goals, onEdit, onCreate, onArchive, onDelete }) => {

    const moveToCreateTab = () => {
        onCreate(1);
    };

    if (goals.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8 mb-8">
                <p>No goals found.</p>
                <p>Start your journey by creating your first goal!</p>
                <Button onClick={moveToCreateTab} className="mt-4 mb-8" variant="solid" color='primary'>Start Creating Goals <FaPlus className='ml-1' /></Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {goals.map((goal) => (
                <div key={goal.id} className="bg-white dark:bg-zinc-950 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold">{goal.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Created: {format(new Date(goal.createdAt), 'MMMM d, yyyy')}
                        {goal.archived && (
                            <Chip className="ml-2 bg-red-500">
                                Archived
                            </Chip>
                        )}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <Button onClick={() => onEdit(goal)} className='bg-blue-700 dark:bg-cyan-700 text-white'>Edit <FaPencilRuler className='ml-1' /></Button>
                            {!goal.archived && (
                                <Button className="ml-2 bg-emerald-700 text-white dark:bg-emerald-600" onClick={() => onArchive(goal)}>
                                    Archive <FaFileArchive className='ml-1' />
                                </Button>
                            )}
                            <Button className="ml-2 bg-red-600 text-white" onClick={() => onDelete(goal)}>
                                Delete <FaDeleteLeft className='ml-1' />
                            </Button>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <article
                        className="markdown-content prose prose-blue dark:prose-invert prose-headings:font-bold prose-headings:text-xl"
                        dangerouslySetInnerHTML={{ __html: goal.description }}
                    />
                    <div className="mt-4">
                        <h4 className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Category</h4>
                        <p className="text-sm">{goal.category}</p>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Tags</h4>
                        <div className="flex space-x-2">
                            {goal.tags.map((tag, index) => (
                                <Chip key={index}
                                    style={{ backgroundColor: assignTagColor(tag) }}
                                >{tag}</Chip>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8">
                        <h4 className="text-lg font-bold mb-4">Stages</h4>
                        <Divider className="mb-4 mt-4" />
                        <ul className="divide-y divide-gray-300">
                            {goal.stages.map((stage, index) => (
                                <li key={index} className="py-4">
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full">{index + 1}</div>
                                        <h4 className="text-lg font-semibold ml-2">Stage {index + 1}</h4>
                                    </div>
                                    <article
                                        className="markdown-content prose prose-blue dark:prose-invert">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {stage}
                                        </ReactMarkdown>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default GoalList;
