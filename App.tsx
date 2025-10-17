import React, { useState, useCallback, useEffect } from 'react';
import { AppMode, ImageRecord } from './types';
import { generateImage, editImage } from './services/geminiService';
import { fileToBase64, dataUrlToUploadedImage } from './utils/fileUtils';
import { generateInspirationalPrompt } from './utils/promptUtils';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import ImageDisplay from './components/ImageDisplay';
import ImageUploader from './components/ImageUploader';
import ModeSelector from './components/ModeSelector';
import ImageHistory from './components/ImageHistory';
import SparkleIcon from './components/SparkleIcon';
import CopyIcon from './components/CopyIcon';
import CheckIcon from './components/CheckIcon';
import ConfirmationModal from './components/ConfirmationModal';


interface UploadedImage {
  data: string;
  mimeType: string;
  previewUrl: string;
}

const LOCAL_STORAGE_KEY = 'ai-image-studio-history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Saves the image history to localStorage with a robust, self-pruning mechanism.
 * If saving fails due to storage limitations (QuotaExceededError), it will
 * remove the oldest item from the history and retry, continuing until the
 * save is successful or the history is empty.
 * @param history The array of ImageRecord objects to save.
 * @returns The final version of the history that was successfully saved.
 */
const saveHistoryWithAutoPruning = (history: ImageRecord[]): ImageRecord[] => {
  let historyToSave = [...history];
  let saved = false;

  while (!saved && historyToSave.length > 0) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(historyToSave));
      saved = true;
    } catch (e: any) {
      // Check for QuotaExceededError across different browsers
      if (e.name === 'QuotaExceededError' || (e.code && (e.code === 22 || e.code === 1014))) {
        console.warn("LocalStorage is full. Pruning oldest image from history to make space.");
        // Remove the oldest item (which is at the end of the array) and try again
        historyToSave.pop();
      } else {
        console.error("Failed to save history to localStorage due to an unexpected error:", e);
        // Don't get stuck in a loop for other errors
        break;
      }
    }
  }
  return historyToSave;
};


const Header: React.FC = () => (
  <header className="text-center mb-10">
    <div className="inline-flex items-center gap-3 justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.573L16.5 21.75l-.398-1.177a3.375 3.375 0 00-2.455-2.455L12.75 18l1.177-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.177a3.375 3.375 0 002.455 2.455L20.25 18l-1.177.398a3.375 3.375 0 00-2.455 2.455z" />
      </svg>
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500 tracking-tight sm:text-5xl">
        AI Image Studio
      </h1>
    </div>
    <p className="text-slate-300 mt-3 text-lg">Create and edit stunning images with the power of Gemini.</p>
  </header>
);

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInspiring, setIsInspiring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ImageRecord[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isClearConfirmVisible, setIsClearConfirmVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

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
  
  const handleCopyPrompt = () => {
      if (!prompt || isCopied) return;
      navigator.clipboard.writeText(prompt).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
          console.error('Failed to copy text: ', err);
      });
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setIsClearConfirmVisible(false);
  };

  const handleSubmit = async (promptOverride?: string) => {
    const currentPrompt = promptOverride || prompt;
    if (!currentPrompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    if (mode === AppMode.EDIT && !uploadedImage) {
      setError('Please upload an image to edit.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      let resultUrl: string;
      if (mode === AppMode.GENERATE) {
        resultUrl = await generateImage(currentPrompt);
      } else if (uploadedImage) { 
        resultUrl = await editImage(currentPrompt, { data: uploadedImage.data, mimeType: uploadedImage.mimeType });
      } else {
         throw new Error("Something went wrong. No image available for editing.");
      }
      setGeneratedImageUrl(resultUrl);
      
      const newImageRecord: ImageRecord = {
        id: `img-${Date.now()}`,
        imageUrl: resultUrl,
        prompt: currentPrompt,
        timestamp: Date.now(),
      };
      
      const updatedHistory = [newImageRecord, ...history.filter(p => p.imageUrl !== newImageRecord.imageUrl)].slice(0, MAX_HISTORY_ITEMS);
      setHistory(updatedHistory);
      
      // Defer the potentially slow localStorage write to prevent UI blocking
      setTimeout(() => {
          const finalHistory = saveHistoryWithAutoPruning(updatedHistory);
          // If pruning removed items (including potentially the new one), resync state
          if (finalHistory.length !== updatedHistory.length) {
              setHistory(finalHistory);
          }
           // Check if the newest image was immediately pruned due to its large size
          if (!finalHistory.some(record => record.id === newImageRecord.id)) {
             setError("Image generated, but couldn't save to library. Your browser storage is full, and this image is too large to fit.");
          }
      }, 10);


    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspireMe = async () => {
    if (isLoading || isInspiring) return;
    setIsInspiring(true);
    setError(null);
    try {
      const newPrompt = await generateInspirationalPrompt();
      setPrompt(newPrompt);
    } catch (e) {
      console.error("Failed to generate inspirational prompt:", e);
      setError("Could not generate a new prompt. Please try again.");
    } finally {
      setIsInspiring(false);
    }
  };

  const handleHistorySelect = useCallback((imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 flex flex-col antialiased">
      <div className="w-full max-w-5xl mx-auto">
        <Header />

        <main className="bg-black/30 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl border border-white/10 flex flex-col gap-8">
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
              <div className="text-center text-slate-500 border-2 border-dashed border-slate-600 rounded-lg py-12 md:col-span-2">
                 <p>Your generated image will appear above once created.</p>
              </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="relative w-full">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === AppMode.EDIT ? "Describe the changes you want to make..." : "Describe the image you want to create..."}
                  className="w-full p-3 pr-12 bg-slate-800/50 rounded-md placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 resize-none border border-transparent focus:border-purple-500"
                  rows={3}
                  disabled={isLoading || isInspiring}
                  aria-label="Prompt for AI image generation"
                />
                {prompt && (
                    <button
                        onClick={handleCopyPrompt}
                        className="absolute top-3 right-3 p-2 rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
                        title={isCopied ? "Copied!" : "Copy Prompt"}
                        aria-label={isCopied ? "Prompt copied to clipboard" : "Copy prompt to clipboard"}
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
              <button
                onClick={() => handleSubmit()}
                disabled={isLoading || isInspiring}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center h-12 shadow-lg hover:shadow-purple-500/30"
              >
                {isLoading ? <Spinner className="h-8 w-8" /> : (mode === AppMode.GENERATE ? 'Generate Image' : 'Edit Image')}
              </button>
              {mode === AppMode.GENERATE && (
                  <button
                      onClick={handleInspireMe}
                      disabled={isLoading || isInspiring}
                      className="w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold py-3 px-4 rounded-md hover:from-fuchsia-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 h-12 shadow-lg hover:shadow-fuchsia-500/30"
                      title="Generate a random prompt"
                  >
                      {isInspiring ? <Spinner className="h-6 w-6" /> : (
                        <>
                          <SparkleIcon />
                          <span className="hidden sm:inline">Inspire Me</span>
                        </>
                      )}
                  </button>
              )}
            </div>
          </div>

          {error && <Alert message={error} type="error" />}
        </main>
        
        <ImageHistory 
            images={history} 
            onImageSelect={handleHistorySelect} 
            onUseForEditing={handleUseForEditing} 
            onClearHistory={() => setIsClearConfirmVisible(true)}
        />
      </div>

       <ConfirmationModal
          isOpen={isClearConfirmVisible}
          onClose={() => setIsClearConfirmVisible(false)}
          onConfirm={handleClearHistory}
          title="Clear Image Library?"
          message="Are you sure you want to permanently delete all images from your library? This action cannot be undone."
          confirmButtonText="Yes, Clear All"
        />

      <footer className="text-center mt-8 text-slate-400 text-sm">
        Powered by <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400 transition-colors">Google's Gemini Model</a>
      </footer>
    </div>
  );
}

export default App;