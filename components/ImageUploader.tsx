
import React from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
     <div className="w-full flex flex-col items-center gap-4">
        <h3 className="font-semibold text-lg text-slate-300">Your Image</h3>
        <label htmlFor="file-upload" className="cursor-pointer aspect-square w-full bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600 hover:border-indigo-500 transition-colors overflow-hidden">
            {previewUrl ? (
                <img src={previewUrl} alt="Uploaded preview" className="w-full h-full object-contain" />
            ) : (
                <div className="text-center text-slate-500 p-4">
                    <UploadIcon />
                    <p className="mt-2">Click to upload an image</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP</p>
                </div>
            )}
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
     </div>
  );
};

export default ImageUploader;
