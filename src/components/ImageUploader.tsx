"use client";

import { useDropzone } from 'react-dropzone';
import { FileUp, Rocket } from 'lucide-react';

interface ImageUploaderProps {
  onDrop: (acceptedFiles: File[]) => void;
  imagePreview: string | null;
  handleAnalyze: () => void;
  loading: boolean;
  image: File | null;
}

const ImageUploader = ({ onDrop, imagePreview, handleAnalyze, loading, image }: ImageUploaderProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl shadow-2xl shadow-slate-950/50">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-indigo-500 bg-slate-800' : 'border-slate-600 hover:border-slate-500'
        }`}
      >
        <input {...getInputProps()} />
        {imagePreview ? (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="max-h-72 mx-auto rounded-lg shadow-lg" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <p className="text-white font-semibold">Change Image</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <FileUp size={48} />
            <p className="font-semibold text-slate-400">Drag & drop your design here</p>
            <p className="text-sm">or click to select a file</p>
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleAnalyze}
          disabled={!image || loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
              Auditing...
            </>
          ) : (
            <>
              <Rocket size={18} />
              Audit My Design
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
