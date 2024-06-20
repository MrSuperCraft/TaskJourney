import React, { useState } from 'react';

interface SubtaskEditorProps {
    onSubtaskChange: (subtasks: string[]) => void;
}

const SubTaskEditor: React.FC<SubtaskEditorProps> = ({ onSubtaskChange }) => {
    const [subtasks, setSubtasks] = useState<string[]>([]);

    const handleAddSubtask = () => {
        setSubtasks([...subtasks, '']);
    };

    const handleChange = (index: number, value: string) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = value;
        setSubtasks(newSubtasks);
        onSubtaskChange(newSubtasks);
    };

    return (
        <div className="subtask-editor-container">
            {subtasks.map((subtask, index) => (
                <input
                    key={index}
                    type="text"
                    value={subtask}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder={`Subtask ${index + 1}`}
                    className="subtask-input"
                />
            ))}
            <button onClick={handleAddSubtask} className="add-subtask-button">
                Add Subtask
            </button>
        </div>
    );
};

export default SubTaskEditor;
