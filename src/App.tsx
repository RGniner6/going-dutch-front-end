import React, { useState, useCallback } from 'react';
import './App.css';
import UploadScreen from './components/UploadScreen';
import NamesScreen from './components/NamesScreen';
import AssignmentScreen from './components/AssignmentScreen';
import { AppState, ReceiptAnalysisResult, Person, ItemAssignment } from './types/receipt';

function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'upload',
    receiptData: null,
    people: [],
    itemAssignments: [],
    isLoading: false,
    error: null,
  });

  const handleReceiptProcessed = useCallback((receiptData: ReceiptAnalysisResult) => {
    setState(prev => ({
      ...prev,
      receiptData,
      currentScreen: 'names',
      isLoading: false,
      error: null,
    }));
  }, []);

  const handleReceiptError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
      currentScreen: 'upload',
    }));
  }, []);

  const handleNamesSubmitted = useCallback((people: Person[]) => {
    setState(prev => ({
      ...prev,
      people,
      currentScreen: 'assignments',
    }));
  }, []);

  const handleItemAssignmentsUpdated = useCallback((itemAssignments: ItemAssignment[]) => {
    setState(prev => ({
      ...prev,
      itemAssignments,
    }));
  }, []);

  const handleBackToUpload = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentScreen: 'upload',
      receiptData: null,
      people: [],
      itemAssignments: [],
      error: null,
    }));
  }, []);

  const handleSetLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  return (
    <div className="App">
      {state.currentScreen === 'upload' && (
        <UploadScreen
          onReceiptProcessed={handleReceiptProcessed}
          onError={handleReceiptError}
          onSetLoading={handleSetLoading}
          isLoading={state.isLoading}
          error={state.error}
        />
      )}
      
      {state.currentScreen === 'names' && (
        <NamesScreen
          onNamesSubmitted={handleNamesSubmitted}
          onBack={handleBackToUpload}
          receiptData={state.receiptData}
          isLoading={state.isLoading}
        />
      )}
      
      {state.currentScreen === 'assignments' && (
        <AssignmentScreen
          receiptData={state.receiptData!}
          people={state.people}
          itemAssignments={state.itemAssignments}
          onItemAssignmentsUpdated={handleItemAssignmentsUpdated}
          onBack={handleBackToUpload}
        />
      )}
    </div>
  );
}

export default App;
