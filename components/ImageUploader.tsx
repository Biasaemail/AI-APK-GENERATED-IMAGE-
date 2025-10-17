
import React, { useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
  onClear: () => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ClearIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const borderClasses = isDragging 
    ? "border-purple-500" 
    : "border-white/10 group-hover:border-purple-500";

  return (
     <div className="w-full flex flex-col items-center gap-4">
        <h3 className="font-semibold text-lg text-slate-300">Your Image</h3>
        <div className="relative w-full group">
            <label 
                htmlFor="file-upload" 
                className={`cursor-pointer aspect-square w-full bg-black/20 rounded-lg flex items-center justify-center border-2 border-dashed ${borderClasses} transition-colors duration-200 overflow-hidden`}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDrop={handleDrop}
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Uploaded preview" className="w-full h-full object-contain" />
                ) : (
                    <div className="text-center text-slate-500 p-4">
                        <UploadIcon />
                        <p className="mt-2 font-semibold text-slate-400">Click or drag to upload</p>
                        <p className="text-xs mt-1">PNG, JPG, WEBP</p>
                    </div>
                )}
            </label>
            {previewUrl && (
                <button 
                    onClick={onClear}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-colors"
                    title="Remove image"
                    aria-label="Remove image"
                >
                    <ClearIcon />
                </button>
            )}
        </div>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
     </div>
  );
};

export default ImageUploader;