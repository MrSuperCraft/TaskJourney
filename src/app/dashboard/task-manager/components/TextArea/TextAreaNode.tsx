import { Textarea } from '@nextui-org/react'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { useDescription } from '@/app/contexts/EditorContext'


const Component: React.FC = () => {

    const { description, setDescription } = useDescription();
    const handleChange = (e: any) => {
        setDescription(e.target.value);
    }

    return (
        <NodeViewWrapper className="react-component">
            <Textarea placeholder='Describe your task. Add detail and clear information for the best experience ^-^'
                className='mt-4'
                isRequired
                required
                size='lg'
                label="Description"
                value={description} // Bind value to the description prop
                onChange={handleChange} // Use handleChange for onChange event
                classNames={
                    {
                        label: "font-bold text-md",
                        description: "text-md"
                    }
                } />
        </NodeViewWrapper>
    )
}

export default Node.create({
    name: 'reactComponent',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            placeholder: {
                default: 'Type something',
            },
            label: {
                default: 'Description',
            },
            required: {
                default: true
            },
            isRequired: {
                default: true
            },
            className: {
                default: "max-w-3xl bg-black"
            }

        }
    },

    parseHTML() {
        return [
            {
                tag: 'react-component',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['react-component', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },
})
