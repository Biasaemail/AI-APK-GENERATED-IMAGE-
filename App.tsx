import React, { useState, useCallback } from 'react';
import { AppMode } from './types';
import { generateImage, editImage } from './services/geminiService';
import { fileToBase64, dataUrlToUploadedImage } from './utils/fileUtils';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import ImageDisplay from './components/ImageDisplay';
import ImageUploader from './components/ImageUploader';
import ModeSelector from './components/ModeSelector';
import ImageHistory from './components/ImageHistory';

interface UploadedImage {
  data: string;
  mimeType: string;
  previewUrl: string;
}

const Header: React.FC = () => (
  <header className="text-center mb-10">
    <div className="inline-flex items-center gap-3 justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455L12.75 18l1.177-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.177a3.375 3.375 0 002.455 2.455L20.25 18l-1.177.398a3.375 3.375 0 00-2.455 2.455z" />
      </svg>
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-tight sm:text-5xl">
        AI Image Studio
      </h1>
    </div>
    <p className="text-slate-400 mt-3 text-lg">Create and edit stunning images with the power of Gemini.</p>
  </header>
);

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

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
    setGeneratedImageUrl(null); // Bug fix: Clear generated image on mode change
    if(newMode === AppMode.GENERATE) {
        setUploadedImage(null);
    }
  };

  const handleUseForEditing = useCallback((imageUrl: string) => {
    try {
      const imageData = dataUrlToUploadedImage(imageUrl);
      setUploadedImage(imageData);
      setMode(AppMode.EDIT);
      setGeneratedImageUrl(null);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch(e: any) {
      setError(e.message || 'Failed to use image for editing.');
      console.error(e);
    }
  }, []);
  
  const handleClearUpload = useCallback(() => {
    setUploadedImage(null);
  }, []);

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
      setHistory(prev => [resultUrl, ...prev].slice(0, 8)); // Add to history, limit to 8
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col antialiased">
      <div className="w-full max-w-5xl mx-auto">
        <Header />

        <main className="bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-2xl ring-1 ring-white/10 flex flex-col gap-8">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
          
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {mode === AppMode.EDIT ? (
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                previewUrl={uploadedImage?.previewUrl || null}
                onClear={handleClearUpload}
              />
            ) : <div />}
             
            <ImageDisplay 
              imageUrl={generatedImageUrl}
              title={mode === AppMode.EDIT ? 'Edited Image' : 'Generated Image'}
              isLoading={isLoading}
              mode={mode}
              onUseForEditing={handleUseForEditing}
            />
          </div>
          
          { mode === AppMode.GENERATE && !generatedImageUrl && !isLoading && (
              <div className="text-center text-slate-400 border-2 border-dashed border-slate-700 rounded-lg py-12">
                 <p>Your generated image will appear above once created.</p>
              </div>
          )}

          <div className="flex flex-col gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === AppMode.EDIT ? "Describe the changes you want to make..." : "Describe the image you want to create..."}
              className="w-full p-3 bg-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-none"
              rows={3}
              disabled={isLoading}
              aria-label="Prompt for AI image generation"
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
        
        <ImageHistory images={history} onImageSelect={handleHistorySelect} onUseForEditing={handleUseForEditing} />
      </div>
       <footer className="text-center mt-8 text-slate-500 text-sm">
        Powered by Sofwan
      </footer>
    </div>
  );
}

export default App;