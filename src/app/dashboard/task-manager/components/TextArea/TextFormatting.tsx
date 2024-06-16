'use client'

import React, { useState } from 'react';

const TextFormattingControls: React.FC<{ editor: any }> = ({ editor }) => {
    const [formatting, setFormatting] = useState<string>(''); // Track current formatting option

    const applyFormatting = (format: string) => {
        editor.chain().focus().toggleMark(format).run(); // Toggle the selected text's formatting
        setFormatting(format); // Update the current formatting state
    };

    return (
        <div className="text-formatting-controls">
            <button
                onClick={() => applyFormatting('bold')}
                className={formatting === 'bold' ? 'active' : ''}
            >
                Bold
            </button>
            <button
                onClick={() => applyFormatting('italic')}
                className={formatting === 'italic' ? 'active' : ''}
            >
                Italic
            </button>
            {/* Add more buttons for other formatting options */}
        </div>
    );
};

export default TextFormattingControls;


