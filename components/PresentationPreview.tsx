import React from 'react';
import { PresentationData } from '../types';
import { Monitor, FileText, ChevronRight } from 'lucide-react';

interface PresentationPreviewProps {
  data: PresentationData;
}

const PresentationPreview: React.FC<PresentationPreviewProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
            <Monitor size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{data.topic}</h2>
            <p className="text-slate-600 mt-1">{data.summary}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-indigo-600">
              <span className="bg-indigo-50 px-2 py-1 rounded-md">{data.slides.length} Slides Generated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.slides.map((slide, idx) => (
          <div 
            key={idx} 
            className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300"
          >
            {/* Slide Header (Title Bar Visual) */}
            <div className="h-2 bg-indigo-500 w-full"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slide {idx + 1}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                {slide.title}
              </h3>

              <ul className="space-y-2 mb-6">
                {slide.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start text-sm text-slate-600">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-start space-x-2">
                  <FileText size={14} className="text-slate-400 mt-0.5" />
                  <p className="text-xs text-slate-500 italic line-clamp-2">
                    Note: {slide.speakerNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentationPreview;
