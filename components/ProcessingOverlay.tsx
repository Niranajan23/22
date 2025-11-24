
import React from 'react';
import { Loader2, CheckCircle2, FileSearch, Sparkles, Layout } from 'lucide-react';
import { AppStatus } from '../types';

interface ProcessingOverlayProps {
  status: AppStatus;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ status }) => {
  if (status === AppStatus.IDLE || status === AppStatus.SUCCESS || status === AppStatus.ERROR) return null;

  const getStatusContent = () => {
    switch (status) {
      case AppStatus.EXTRACTING:
        return {
          icon: <FileSearch className="w-12 h-12 text-blue-500 animate-pulse" />,
          title: "Reading Document",
          desc: "Preparing your PDF for analysis..."
        };
      case AppStatus.ANALYZING:
        return {
          icon: <Sparkles className="w-12 h-12 text-purple-500 animate-spin-slow" />,
          title: "AI Analysis",
          desc: "Gemini is reading your PDF and designing slides..."
        };
      case AppStatus.GENERATING_PPT:
        return {
          icon: <Layout className="w-12 h-12 text-indigo-500 animate-bounce" />,
          title: "Building PPT",
          desc: "Assembling slides and formatting..."
        };
      default:
        return { icon: null, title: "", desc: "" };
    }
  };

  const content = getStatusContent();

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-50 rounded-full">
            {content.icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{content.title}</h3>
        <p className="text-slate-500 mb-6">{content.desc}</p>
        
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-indigo-600 h-2 rounded-full animate-progress-indeterminate"></div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
