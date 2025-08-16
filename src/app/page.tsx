"use client";

import { useState, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import ReportView from '@/components/ReportView';
import ExampleGallery from '@/components/ExampleGallery';
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
    if (!analysis?.score) return 'text-slate-500';
    if (analysis.score >= 80) return 'text-emerald-400';
    if (analysis.score >= 50) return 'text-amber-400';
    return 'text-red-400';
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
          
          {!analysis && !loading && <ExampleGallery onSelectExample={handleSelectExample} />}

          {loading && (
            <div className="text-center mt-12">
               <div role="status" className="flex justify-center items-center">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
              <p className="text-lg text-slate-400 mt-4">Analyzing your design, this may take a moment...</p>
            </div>
          )}

          {error && (
            <div className="mt-10 bg-red-900/20 border border-red-500/30 p-6 rounded-xl text-center">
              <AlertTriangle className="mx-auto text-red-400" size={40} />
              <h2 className="text-xl font-bold mt-4 text-red-400">Analysis Failed</h2>
              <p className="text-red-400/80 mt-2">{error}</p>
            </div>
          )}

          {analysis && <ReportView analysis={analysis} scoreColor={scoreColor} />}
        </div>
      </main>
    </div>
  );
}