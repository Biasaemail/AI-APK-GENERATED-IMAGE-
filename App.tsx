
import React, { useState, useCallback } from 'react';
import { AppMode } from './types';
import { generateImage, editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import ImageDisplay from './components/ImageDisplay';
import ImageUploader from './components/ImageUploader';
import ModeSelector from './components/ModeSelector';

interface UploadedImage {
  data: string;
  mimeType: string;
  previewUrl: string;
}

const Header: React.FC = () => (
  <header className="text-center mb-8">
    <h1 className="text-4xl font-bold text-white tracking-tight sm:text-5xl">AI Image Studio</h1>
    <p className="text-slate-400 mt-2">Create and edit images with Gemini (Nano Banana)</p>
  </header>
);

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    try {
      const imageData = await fileToBase64(file);
      setUploadedImage(imageData);
    } catch (e) {
      setError('Failed to process image file. Please try another one.');
      console.error(e);
    }
  }, []);
  
  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setError(null);
    setGeneratedImageUrl(null);
    setUploadedImage(null);
    setPrompt('');
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    if (mode === AppMode.EDIT && !uploadedImage) {
      setError('Please upload an image to edit.');
      return;
    }

    setIsLoading(true);
    setError(null);
    // Keep previous generated image visible while loading new one
    // setGeneratedImageUrl(null);

    try {
      let resultUrl: string;
      if (mode === AppMode.GENERATE) {
        resultUrl = await generateImage(prompt);
      } else if (uploadedImage) { 
        resultUrl = await editImage(prompt, { data: uploadedImage.data, mimeType: uploadedImage.mimeType });
      } else {
         throw new Error("Something went wrong. No image available for editing.");
      }
      setGeneratedImageUrl(resultUrl);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center antialiased">
      <div className="w-full max-w-5xl">
        <Header />

        <main className="bg-slate-800/50 p-6 rounded-xl shadow-lg ring-1 ring-white/10 flex flex-col gap-6">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />

          <div className={`grid gap-8 ${mode === AppMode.EDIT ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
             {mode === AppMode.EDIT && (
               <ImageUploader onImageUpload={handleImageUpload} previewUrl={uploadedImage?.previewUrl || null} />
             )}
            <div className={`${mode === AppMode.GENERATE ? 'max-w-lg mx-auto w-full' : 'w-full'}`}>
                <ImageDisplay 
                  imageUrl={generatedImageUrl}
                  title={mode === AppMode.EDIT ? 'Edited Image' : 'Generated Image'}
                />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === AppMode.EDIT ? "Describe the changes you want to make..." : "Describe the image you want to create..."}
              className="w-full p-3 bg-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center h-12"
            >
              {isLoading ? <Spinner /> : (mode === AppMode.GENERATE ? 'Generate Image' : 'Edit Image')}
            </button>
          </div>

          {error && <Alert message={error} type="error" />}
        </main>
      </div>
    </div>
  );
}

export default App;
