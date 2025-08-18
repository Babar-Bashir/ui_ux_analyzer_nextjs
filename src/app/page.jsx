"use client";

import { useState, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';
import ReportView from '../components/ReportView';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageReady = useCallback((file) => {
    setImage(file);
    setAnalysis(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setAnalysis(null);
    setError(null);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze the image. The AI model may be overloaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = useMemo(() => {
    if (!analysis?.score) return '';
    if (analysis.score >= 80) return 'score-high';
    if (analysis.score >= 50) return 'score-medium';
    return 'score-low';
  }, [analysis]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImageUploader
            onImageReady={handleImageReady}
            handleAnalyze={handleAnalyze}
            loading={loading}
            image={image}
          />
          
          {!analysis && !loading && !image && (
            <div className="text-center mt-12 text-lg text-gray-600">
              Upload an image or enter a website URL to get started!
            </div>
          )}

          {loading && (
            <div className="text-center mt-12">
               <div role="status" className="flex justify-center items-center">
                  <span className="sr-only">Loading...</span>
              </div>
              <p className="text-lg text-gray-600 mt-4">Analyzing your design, this may take a moment...</p>
            </div>
          )}

          {error && (
            <div className="mt-10 error-message">
              <AlertTriangle className="mx-auto" size={40} />
              <h2 className="text-xl font-bold mt-4">Analysis Failed</h2>
              <p className="mt-2">{error}</p>
            </div>
          )}

          {analysis && <ReportView analysis={analysis} scoreColor={scoreColor} />}
        </div>
      </main>
    </div>
  );
}