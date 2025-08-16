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
    <div className="image-uploader-container glass-effect">
      <div
        {...getRootProps()}
        className={`dropzone-area ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        {imagePreview ? (
          <div className="relative image-preview">
            <img src={imagePreview} alt="Preview" />
            <div className="absolute inset-0 image-preview-overlay">
              <p>Change Image</p>
            </div>
          </div>
        ) : (
          <div className="dropzone-placeholder">
            <FileUp size={48} />
            <p>Drag & drop your design here</p>
            <p className="text-sm">or click to select a file</p>
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleAnalyze}
          disabled={!image || loading}
          className="analyze-button"
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
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
