import React, { useRef, useState } from 'react';
import { receiptApi } from '../services/api';
import { ReceiptAnalysisResult } from '../types/receipt';
import './UploadScreen.css';

interface UploadScreenProps {
  onReceiptProcessed: (receiptData: ReceiptAnalysisResult) => void;
  onError: (error: string) => void;
  onSetLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

const UploadScreen: React.FC<UploadScreenProps> = ({
  onReceiptProcessed,
  onError,
  onSetLoading,
  isLoading,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    onSetLoading(true);
    try {
      const response = await receiptApi.processReceipt(selectedFile);
      
      if (response.success && response.data) {
        if (response.data.errorText) {
          // API processed but couldn't read the receipt
          onError(response.data.errorText);
        } else {
          // Successfully processed receipt
          onReceiptProcessed(response.data);
        }
      } else {
        // API error
        onError(response.error?.message || 'Failed to process receipt');
      }
    } catch (err) {
      onError('Network error. Please check your connection and try again.');
    }
  };

  const handleRetry = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-screen">
      <div className="container">
        <h1>Going Dutch</h1>
        <p className="subtitle">Upload a receipt to split the bill</p>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={handleRetry} className="retry-button">
              Try Different Photo
            </button>
          </div>
        )}

        {!selectedFile ? (
          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="upload-label">
              <div className="upload-icon">📷</div>
              <p>Tap to select receipt photo</p>
              <p className="upload-hint">Supports JPEG, PNG, WebP, GIF, BMP, TIFF</p>
            </label>
          </div>
        ) : (
          <div className="preview-area">
            <div className="image-preview">
              <img src={previewUrl!} alt="Receipt preview" />
            </div>
            <div className="preview-actions">
              <button onClick={handleRetry} className="change-button">
                Change Photo
              </button>
              <button 
                onClick={handleUpload} 
                className="upload-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Process Receipt'}
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Processing receipt... This may take a moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadScreen;
