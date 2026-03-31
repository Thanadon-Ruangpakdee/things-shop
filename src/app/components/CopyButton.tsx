"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`p-2 rounded-lg border transition-all active:scale-90 ${
        copied 
          ? "bg-green-50 border-green-200 text-green-600" 
          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm"
      }`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}