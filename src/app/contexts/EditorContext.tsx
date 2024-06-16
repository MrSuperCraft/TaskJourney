import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the context type
interface EditorContextType {
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
}

// Create the context
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Create a provider component
export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [description, setDescription] = useState('');

    return (
        <EditorContext.Provider value={{ description, setDescription }}>
            {children}
        </EditorContext.Provider>
    );
};

// Custom hook to consume the context
export const useDescription = () => {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error('useDescription must be used within an EditorProvider');
    }

    return context;
};


export default EditorProvider;