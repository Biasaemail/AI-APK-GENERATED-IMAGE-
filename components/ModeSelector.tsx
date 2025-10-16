
import React from 'react';
import { AppMode } from '../types';

interface ModeSelectorProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
    const getButtonClasses = (mode: AppMode) => {
        const base = "px-6 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 text-sm";
        if (currentMode === mode) {
            return `${base} bg-indigo-600 text-white`;
        }
        return `${base} bg-slate-700 text-slate-300 hover:bg-slate-600`;
    };

    return (
        <div className="flex bg-slate-800 p-1 rounded-lg self-center">
            <button onClick={() => onModeChange(AppMode.GENERATE)} className={getButtonClasses(AppMode.GENERATE)}>
                Generate
            </button>
            <button onClick={() => onModeChange(AppMode.EDIT)} className={getButtonClasses(AppMode.EDIT)}>
                Edit
            </button>
        </div>
    );
};

export default ModeSelector;
