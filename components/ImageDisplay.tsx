import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { AppMode } from '../types';
import DownloadIcon from './DownloadIcon';

interface ImageDisplayProps {
  imageUrl: string | null;
  title: string;
  isLoading: boolean;
  mode: AppMode;
  onUseForEditing?: (imageUrl: string) => void;
}

const loadingMessages = [
  "Conjuring your masterpiece...",
  "Connecting to the quantum realm...",
  "Painting with cosmic pixels...",
  "Awakening the AI's creativity...",
  "Reticulating splines...",
  "Warming up the neural networks...",
  "Translating imagination into reality...",
];

const ImageIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, title, isLoading, mode, onUseForEditing }) => {
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      setCurrentLoadingMessage(loadingMessages[0]); // Reset to first message
      interval = window.setInterval(() => {
        setCurrentLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const extension = imageUrl.split(';')[0].split('/')[1] || 'png';
    link.download = `ai-image-studio-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h3 className="font-semibold text-lg text-slate-300">{title}</h3>
      <div className="aspect-square w-full bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed border-white/10 overflow-hidden relative group">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-slate-500 p-4">
            <ImageIcon />
            <p className="mt-2">Your image will appear here</p>
          </div>
        )}
        
        {isLoading && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg transition-opacity duration-300 p-4">
                <Spinner className="h-8 w-8" />
                <p className="text-slate-300 mt-4 text-center">
                  {currentLoadingMessage}
                </p>
            </div>
        )}

        {imageUrl && !isLoading && (
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button 
                    onClick={handleDownload} 
                    className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
                    title="Download Image"
                    aria-label="Download Image"
                 >
                    <DownloadIcon />
                </button>
                 {mode === AppMode.GENERATE && onUseForEditing && (
                     <button 
                        onClick={() => onUseForEditing(imageUrl)}
                        className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
                        title="Use for Editing"
                        aria-label="Use for Editing"
                    >
                         <EditIcon />
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;