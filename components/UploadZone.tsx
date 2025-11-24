import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSelect = (file: File) => {
    setError(null);
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large (Max 10MB).');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative border-3 border-dashed rounded-2xl p-10 transition-all duration-300 ease-in-out cursor-pointer text-center
          ${disabled ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50' : ''}
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 bg-white shadow-sm'
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="application/pdf"
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
            <UploadCloud size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {isDragging ? 'Drop your PDF here' : 'Upload your PDF'}
            </h3>
            <p className="text-sm text-slate-500">
              Drag & drop or click to browse
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            <FileText size={12} />
            <span>Supports .pdf up to 10MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-100 animate-fade-in">
          <AlertCircle className="flex-shrink-0 inline w-4 h-4 me-3" />
          <span className="font-medium">Error:</span>
          <span className="ml-1">{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
