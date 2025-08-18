"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Rocket, Globe, AlertTriangle, Image as ImageIcon } from 'lucide-react';

const WebsiteInput = ({ onScreenshotReady, isProcessing }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
        setError(null);
    };

    const handleGenerateScreenshot = async () => {
        if (!url) return;

        try {
            new URL(url);
        } catch (error) {
            setError('Please enter a valid URL.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setPreview(null);

        try {
            const screenshotApiUrl = `/api/screenshot?url=${encodeURIComponent(url)}`;
            const response = await fetch(screenshotApiUrl);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to capture screenshot.' }));
                throw new Error(errorData.message || 'Failed to capture screenshot.');
            }

            const imageBlob = await response.blob();
            const file = new File([imageBlob], "screenshot.jpg", { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(imageBlob);

            setPreview(previewUrl);
            onScreenshotReady(file, previewUrl);

        } catch (err) {
            console.error('Screenshot error:', err);
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="website-input-container">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter website URL (e.g., https://example.com)"
                    className="url-input"
                    disabled={isLoading || isProcessing}
                />
                <button onClick={handleGenerateScreenshot} disabled={isLoading || isProcessing || !url} className="screenshot-button">
                    {isLoading ? 'Generating...' : 'Get Screenshot'}
                </button>
            </div>

            {error && (
                <div className="mt-4 error-message-small">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {preview && !error && (
                <div className="mt-4 screenshot-preview">
                    <h3 className="text-lg font-semibold mb-2 text-center">Screenshot Preview</h3>
                    <img src={preview} alt="Website Screenshot" />
                </div>
            )}
        </div>
    );
};


const ImageUploader = ({ onImageReady, handleAnalyze, loading, image }) => {
  const [mode, setMode] = useState('upload'); // 'upload' or 'website'
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageReady(file);
    }
  }, [onImageReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
  });

  const handleScreenshotReady = (file, previewUrl) => {
    setPreview(previewUrl);
    onImageReady(file);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setPreview(null);
    onImageReady(null);
  }

  return (
    <div className="image-uploader-container glass-effect">
      <div className="flex justify-center mb-6">
        <div className="toggle-buttons">
          <button onClick={() => handleModeChange('upload')} className={mode === 'upload' ? 'active' : ''}>
            <ImageIcon size={18} />
            <span>Upload Image</span>
          </button>
          <button onClick={() => handleModeChange('website')} className={mode === 'website' ? 'active' : ''}>
            <Globe size={18} />
            <span>Website</span>
          </button>
        </div>
      </div>

      {mode === 'upload' && (
        <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'drag-active' : ''}`}>
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative image-preview">
              <img src={preview} alt="Preview" onLoad={() => { if(preview.startsWith("blob:")) URL.revokeObjectURL(preview)}} />
              <div className="absolute inset-0 image-preview-overlay"><p>Change Image</p></div>
            </div>
          ) : (
            <div className="dropzone-placeholder">
              <FileUp size={48} />
              <p>Drag & drop your design here</p>
              <p className="text-sm">or click to select a file</p>
            </div>
          )}
        </div>
      )}

      {mode === 'website' && (
        <WebsiteInput onScreenshotReady={handleScreenshotReady} isProcessing={loading} />
      )}

      <div className="mt-6 text-center">
        <button onClick={handleAnalyze} disabled={!image || loading} className="analyze-button">
          {loading ? (
            <><div className="loading-spinner"></div>Auditing...</>
          ) : (
            <><Rocket size={18} />Audit My Design</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;