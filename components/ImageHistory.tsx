import React from 'react';
import { ImageRecord } from '../types';

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
}

const ImageHistory: React.FC<ImageHistoryProps> = ({ images, onImageSelect, onUseForEditing }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">Image Library</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((record) => (
          <div key={record.id} className="relative aspect-square rounded-lg overflow-hidden group shadow-lg">
            <img src={record.imageUrl} alt={record.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
               <button
                 onClick={() => onImageSelect(record.imageUrl)}
                 className="p-2 rounded-full bg-slate-900/70 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
                 title="View Image"
                 aria-label="View Image"
               >
                 <ViewIcon />
               </button>
               <button
                 onClick={() => onUseForEditing(record.imageUrl)}
                 className="p-2 rounded-full bg-slate-900/70 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
                 title="Use for Editing"
                 aria-label="Use for Editing"
               >
                 <EditIcon />
               </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageHistory;