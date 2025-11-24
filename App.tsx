
import React, { useState } from 'react';
import { AppStatus, PresentationData, ProcessingError } from './types';
import { fileToBase64 } from './services/pdfService';
import { generatePresentationContent } from './services/geminiService';
import { generatePptFile } from './services/pptService';
import UploadZone from './components/UploadZone';
import PresentationPreview from './components/PresentationPreview';
import ProcessingOverlay from './components/ProcessingOverlay';
import { Sparkles, Download, RefreshCw, AlertTriangle, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<PresentationData | null>(null);
  const [error, setError] = useState<ProcessingError | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      setStatus(AppStatus.EXTRACTING); // Represents "Reading File"

      // Step 1: Convert File to Base64 for Gemini
      const base64Data = await fileToBase64(file);
      
      setStatus(AppStatus.ANALYZING);

      // Step 2: Analyze with Gemini (Native PDF Support)
      const presentationData = await generatePresentationContent(base64Data);
      setData(presentationData);
      
      setStatus(AppStatus.SUCCESS);

    } catch (err: any) {
      console.error(err);
      setError({
        message: "Failed to process document",
        details: err.message || "An unexpected error occurred."
      });
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!data) return;
    try {
      generatePptFile(data);
    } catch (err) {
      console.error(err);
      setError({ message: "Failed to generate PPT file." });
    }
  };

  const resetApp = () => {
    setStatus(AppStatus.IDLE);
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              SlideGenius
            </span>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-sm text-slate-500 font-medium hidden sm:block">Powered by Gemini 2.5</span>
             {status === AppStatus.SUCCESS && (
               <button 
                onClick={resetApp}
                className="text-sm text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
               >
                 <RefreshCw size={14} />
                 <span>New File</span>
               </button>
             )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProcessingOverlay status={status} />

        {/* Header Section */}
        {status === AppStatus.IDLE && (
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Turn your PDFs into <br />
              <span className="text-indigo-600">Presentations instantly</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Upload any PDF document. Our AI analyzes the content, extracts key points, 
              and generates a professional PowerPoint ready for you to download.
            </p>
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-col items-center justify-center w-full">
          
          {/* State: IDLE or ERROR */}
          {(status === AppStatus.IDLE || status === AppStatus.ERROR) && (
            <div className="w-full">
              <UploadZone 
                onFileSelect={handleFileSelect} 
                disabled={status === AppStatus.EXTRACTING} 
              />
              
              {status === AppStatus.ERROR && error && (
                <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-fade-in">
                  <AlertTriangle className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-900 font-semibold">Processing Error</h4>
                    <p className="text-red-700 mt-1">{error.message}</p>
                    {error.details && <p className="text-red-600 text-sm mt-1 opacity-80">{error.details}</p>}
                    <button 
                      onClick={resetApp}
                      className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-800"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* State: SUCCESS (Preview) */}
          {status === AppStatus.SUCCESS && data && (
            <div className="w-full animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-indigo-900 p-6 rounded-2xl text-white shadow-xl">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                        <FileText size={24} className="text-white" />
                    </div>
                    Presentation Ready
                  </h2>
                  <p className="text-indigo-200 mt-1 ml-12">Review the slides below or download the PPTX file.</p>
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 md:mt-0 bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-3 rounded-lg font-bold flex items-center shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                >
                  <Download className="mr-2" size={20} />
                  Download .PPTX
                </button>
              </div>

              <PresentationPreview data={data} />
              
              <div className="h-20"></div> {/* Spacer */}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
           <p>© {new Date().getFullYear()} SlideGenius AI. Powered by Gemini Flash 2.5.</p>
         </div>
      </footer>
      
      {/* Global CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeIn 0.7s ease-out forwards;
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-indeterminate {
          animation: progress 1.5s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
