
import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  title: string;
}

const ImageIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, title }) => {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h3 className="font-semibold text-lg text-slate-300">{title}</h3>
      <div className="aspect-square w-full bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-slate-500 p-4">
            <ImageIcon />
            <p className="mt-2">Your image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
