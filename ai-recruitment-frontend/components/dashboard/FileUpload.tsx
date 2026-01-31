"use client";

import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export default function FileUpload({
  onFileSelect,
  selectedFile,
  onRemoveFile,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === "application/pdf") {
          onFileSelect(file);
        } else {
          onError?.("Please upload a PDF file only.");
        }
      }
    },
    [onFileSelect, onError],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "application/pdf") {
          onFileSelect(file);
        } else {
          onError?.("Please upload a PDF file only.");
        }
      }
    },
    [onFileSelect, onError],
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedFile) {
    return (
      <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <button
              onClick={onRemoveFile}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all ${
        isDragOver
          ? "border-blue-400 bg-blue-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">
          <span className="text-blue-600 font-medium hover:underline">
            Click to upload
          </span>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF only (max. 5MB)</p>
      </div>
    </div>
  );
}
