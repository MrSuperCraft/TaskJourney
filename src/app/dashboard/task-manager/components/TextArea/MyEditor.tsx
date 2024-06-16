'use client';

import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import ReactComponent from './TextAreaNode'; // Import your custom component
import { useDescription } from '@/app/contexts/EditorContext';
import TextFormattingControls from './TextFormatting';

const MyEditor: React.FC = () => {
    const { description, setDescription } = useDescription();

    const editor = useEditor({
        extensions: [
            StarterKit,
            ReactComponent,
        ],
        content: `<react-component description="${description}"></react-component>`,
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(`<react-component description="${description}"></react-component>`);
        }
    }, [editor, description]);

    return (
        <>
            <TextFormattingControls editor={editor} />
            <EditorContent editor={editor} />
        </>
    );
};

export default MyEditor;
