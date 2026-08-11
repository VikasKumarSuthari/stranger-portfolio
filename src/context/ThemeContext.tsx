import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
    isUpsideDown: boolean;
    toggleUpsideDown: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

import { pushToDataLayer } from '../utils/analytics';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isUpsideDown, setIsUpsideDown] = useState(false);

    const toggleUpsideDown = () => {
        setIsUpsideDown(prev => {
            const newState = !prev;
            pushToDataLayer('theme_toggle', {
                theme_state: newState ? 'upside_down' : 'right_side_up'
            });
            return newState;
        });
    };

    useEffect(() => {
        if (isUpsideDown) {
            document.body.classList.add('upside-down-active');
        } else {
            document.body.classList.remove('upside-down-active');
        }
    }, [isUpsideDown]);

    return (
        <ThemeContext.Provider value={{ isUpsideDown, toggleUpsideDown }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
