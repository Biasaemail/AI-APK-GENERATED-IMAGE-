import React from 'react';
import { ImageRecord } from '../types';
import DownloadIcon from './DownloadIcon';
import TrashIcon from './TrashIcon';

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const ViewIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);


interface ImageHistoryProps {
  images: ImageRecord[];
  onImageSelect: (imageUrl: string) => void;
  onUseForEditing: (imageUrl: string) => void;
  onClearHistory: () => void;
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ images, onImageSelect, onUseForEditing, onClearHistory }) => {
  if (images.length === 0) {
    return null;
  }

  const handleDownload = (record: ImageRecord) => {
    const link = document.createElement('a');
    link.href = record.imageUrl;
    const extension = record.imageUrl.split(';')[0].split('/')[1] || 'png';
    // Create a slug from the prompt for a more descriptive filename
    const promptSlug = record.prompt.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30);
    link.download = `ai-studio-${promptSlug}-${record.id}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-200">Image Library</h2>
          <button 
            onClick={onClearHistory}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200 bg-slate-800/50 hover:bg-red-500/10 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
            title="Clear all images from library"
          >
            <TrashIcon />
            <span className="hidden sm:inline">Clear All</span>
          </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((record) => (
          <div key={record.id} className="relative aspect-square rounded-lg overflow-hidden group shadow-lg">
            <img src={record.imageUrl} alt={record.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
               <button
                 onClick={() => onImageSelect(record.imageUrl)}
                 className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
                 title="View Image"
                 aria-label="View Image"
               >
                 <ViewIcon />
               </button>
               <button
                 onClick={() => onUseForEditing(record.imageUrl)}
                 className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
                 title="Use for Editing"
                 aria-label="Use for Editing"
               >
                 <EditIcon />
               </button>
                <button
                 onClick={() => handleDownload(record)}
                 className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
                 title="Download Image"
                 aria-label="Download Image"
               >
                 <DownloadIcon />
               </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(ImageHistory);