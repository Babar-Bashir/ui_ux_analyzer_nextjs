"use client";

import { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import ReportView from '@/components/ReportView';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  }, []);

  const handleSelectExample = async (src: string) => {
    setImagePreview(src);
    setAnalysis(null);
    setError(null);
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File([blob], src.split('/').pop()!, { type: blob.type });
      setImage(file);
    } catch (err) {
      console.error('Error loading example image:', err);
      setError('Failed to load the example image.');
    }
  };

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
    if (!analysis?.score) return ''; // No specific color class if no score
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
            onDrop={onDrop}
            imagePreview={imagePreview}
            handleAnalyze={handleAnalyze}
            loading={loading}
            image={image}
          />
          
          {!analysis && !loading && (
            // You can add a placeholder or instructions here if needed
            <div className="text-center mt-12 text-lg text-gray-600">
              Upload an image to get started with your design audit!
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
