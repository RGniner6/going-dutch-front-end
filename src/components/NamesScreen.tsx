import React, { useState, useEffect } from 'react';
import { Person, ReceiptAnalysisResult } from '../types/receipt';
import './NamesScreen.css';

interface NamesScreenProps {
  onNamesSubmitted: (people: Person[]) => void;
  onBack: () => void;
  receiptData: ReceiptAnalysisResult | null;
  isLoading: boolean;
  existingPeople?: Person[];
}

const NamesScreen: React.FC<NamesScreenProps> = ({
  onNamesSubmitted,
  onBack,
  receiptData,
  isLoading,
  existingPeople = [],
}) => {
  const [names, setNames] = useState<string[]>(existingPeople.map(p => p.name));
  const [currentName, setCurrentName] = useState('');
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    // Check if API has finished processing
    if (receiptData && !receiptData.errorText) {
      setIsApiReady(true);
    }
  }, [receiptData]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentName.trim()) {
      setNames(prev => [...prev, currentName.trim()]);
      setCurrentName('');
    }
  };

  const handleRemoveName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleGoDutch = () => {
    if (names.length > 0) {
      const people: Person[] = names.map((name, index) => ({
        id: `person-${index}`,
        name,
      }));
      onNamesSubmitted(people);
    }
  };

  const totalAmount = receiptData?.totalPrice || 0;
  const currencySymbol = receiptData?.currencySymbol || '$';

  return (
    <div className="names-screen">
      <div className="container">
        <div className="header">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h1>Who's Splitting?</h1>
        </div>

        {receiptData && (
          <div className="receipt-summary">
            <h3>Receipt Total: {currencySymbol}{totalAmount.toFixed(2)}</h3>
            <p>{receiptData.items.length} items found</p>
          </div>
        )}

        <div className="names-section">
          <form onSubmit={handleNameSubmit} className="name-form">
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="Enter a name"
              className="name-input"
            />
            <button 
              type="submit" 
              className="add-button"
              disabled={!currentName.trim()}
            >
              Add
            </button>
          </form>

          {names.length > 0 && (
            <div className="names-list">
              <h3>People ({names.length})</h3>
              <div className="names-grid">
                {names.map((name, index) => (
                  <div key={index} className="name-tag">
                    <span>{name}</span>
                    <button 
                      onClick={() => handleRemoveName(index)}
                      className="remove-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="loading-status">
          {isLoading && !isApiReady ? (
            <div className="api-loading">
              <div className="spinner"></div>
              <p>Still processing receipt...</p>
            </div>
          ) : (
            <div className="ready-status">
              <p>✅ Receipt processed successfully!</p>
            </div>
          )}
        </div>

        <button
          onClick={handleGoDutch}
          className="go-dutch-button"
          disabled={names.length === 0 || !isApiReady}
        >
          {isLoading && !isApiReady ? (
            <>
              <div className="button-spinner"></div>
              Processing...
            </>
          ) : (
            'Go Dutch!'
          )}
        </button>

        {names.length === 0 && (
          <p className="hint">Add at least one person to continue</p>
        )}
      </div>
    </div>
  );
};

export default NamesScreen;
