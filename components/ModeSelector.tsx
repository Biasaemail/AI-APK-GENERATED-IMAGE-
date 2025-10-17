
import React from 'react';
import { AppMode } from '../types';

interface ModeSelectorProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const GenerateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-1.17a3 3 0 01-1.415 1.221l-1.09.654A3 3 0 019.236 15H9v1.25a1.25 1.25 0 11-2.5 0V15H6a2 2 0 110-4h1.236A3 3 0 019.09 9.779l1.09-.654A3 3 0 0111.585 7H10a3 3 0 01-2.236-5z" clipRule="evenodd" />
    </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
    const getButtonClasses = (mode: AppMode) => {
        const base = "px-5 py-2 rounded-md font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 text-sm flex items-center gap-2";
        if (currentMode === mode) {
            return `${base} bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg`;
        }
        return `${base} bg-white/5 text-slate-300 hover:bg-white/10`;
    };

    return (
        <div className="flex bg-black/30 p-1 rounded-lg self-center border border-white/10">
            <button onClick={() => onModeChange(AppMode.GENERATE)} className={getButtonClasses(AppMode.GENERATE)}>
                <GenerateIcon /> Generate
            </button>
            <button onClick={() => onModeChange(AppMode.EDIT)} className={getButtonClasses(AppMode.EDIT)}>
                <EditIcon /> Edit
            </button>
        </div>
    );
};

export default ModeSelector;