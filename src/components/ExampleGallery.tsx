"use client";

import Image from 'next/image';

const examples = [
  { name: 'Example 1', src: '/examples/example1.jpg' },
  { name: 'Example 2', src: '/examples/example2.jpg' },
  { name: 'Example 3', src: '/examples/example3.jpg' },
];

interface ExampleGalleryProps {
  onSelectExample: (src: string) => void;
}

const ExampleGallery = ({ onSelectExample }: ExampleGalleryProps) => {
  return (
    <div className="mt-10">
      <h2 className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Or try an example</h2>
      <div className="grid grid-cols-3 gap-4">
        {examples.map((example) => (
          <div
            key={example.name}
            className="cursor-pointer rounded-lg overflow-hidden border-2 border-slate-700 hover:border-indigo-500 transition-all transform hover:scale-105"
            onClick={() => onSelectExample(example.src)}
          >
            <Image src={example.src} alt={example.name} width={300} height={200} className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleGallery;
