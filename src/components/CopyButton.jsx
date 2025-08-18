"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <button onClick={handleCopy} className="copy-button">
      {isCopied ? <Check size={16} className="icon-check" /> : <Copy size={16} />}
    </button>
  );
};

export default CopyButton;
