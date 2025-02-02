import React, { createContext, useState, ReactNode, useContext } from 'react';
import { ContextMenuFilters } from '@superset-ui/core';

interface ContextType {
    idState: string[];
    updateidOrSlug: (ID: string) => void;
    removeLastIdOrSlug: () => void; // Add method to remove the last ID
}


// Create the context
const IDContext = createContext<ContextType | undefined>(undefined);

const IDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [idState, setIdState] = useState<string[]>([]);
    console.log(idState);
    const updateidOrSlug = (ID: string) => {
        console.log(ID);
        setIdState(prevState => [...prevState, ID]);
    };

    const removeLastIdOrSlug = () => {
        setIdState(prevState => prevState.slice(0, -1)); // Remove the last element
    };

    return (
        <IDContext.Provider value={{ idState, updateidOrSlug, removeLastIdOrSlug}}>
            {children}
        </IDContext.Provider>
    );
};

const useID = () => {
    const context = useContext(IDContext);
    if (!context) {
        throw new Error("useID must be used within an IDProvider");
    }
    return context;
};

export { IDProvider, useID };