import React, { useState, useCallback } from "react"
import "./App.css"
import UploadScreen from "./components/UploadScreen"
import NamesScreen from "./components/NamesScreen"
import AssignmentScreen from "./components/AssignmentScreen"
import {
  AppState,
  ReceiptAnalysisResult,
  Person,
  ItemAssignments,
} from "./types/receipt"

function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: "upload",
    receiptData: null,
    people: [],
    itemAssignments: [],
    isLoading: false,
    error: null,
  })

  const handleReceiptProcessed = useCallback(
    (receiptData: ReceiptAnalysisResult) => {
      setState((prev) => ({
        ...prev,
        receiptData,
        isLoading: false,
        error: null,
      }))
    },
    [],
  )

  const handleReceiptError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
      currentScreen: "upload",
      receiptData: null,
      itemAssignments: [],
      // Keep people array to preserve entered names
    }))
  }, [])

  const handleNamesSubmitted = useCallback((people: Person[]) => {
    setState((prev) => ({
      ...prev,
      people,
      currentScreen: "assignments",
    }))
  }, [])

  const handleItemAssignmentsUpdated = useCallback(
    (itemAssignments: ItemAssignments[]) => {
      setState((prev) => ({
        ...prev,
        itemAssignments,
      }))
    },
    [],
  )

  const handleBackToUpload = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: "upload",
      receiptData: null,
      itemAssignments: [],
      error: null,
      // Keep people array to preserve entered names
    }))
  }, [])

  const handleSetLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading,
    }))
  }, [])

  const handleUploadStarted = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: "names",
      isLoading: true,
      error: null,
    }))
  }, [])

  return (
    <div className="App">
      {state.currentScreen === "upload" && (
        <UploadScreen
          onReceiptProcessed={handleReceiptProcessed}
          onError={handleReceiptError}
          onSetLoading={handleSetLoading}
          onUploadStarted={handleUploadStarted}
          isLoading={state.isLoading}
          error={state.error}
        />
      )}

      {state.currentScreen === "names" && (
        <NamesScreen
          onNamesSubmitted={handleNamesSubmitted}
          onBack={handleBackToUpload}
          receiptData={state.receiptData}
          isLoading={state.isLoading}
          existingPeople={state.people}
        />
      )}

      {state.currentScreen === "assignments" && (
        <AssignmentScreen
          receiptData={state.receiptData!}
          people={state.people}
          itemAssignments={state.itemAssignments}
          onItemAssignmentsUpdated={handleItemAssignmentsUpdated}
          onBack={handleBackToUpload}
        />
      )}
    </div>
  )
}

export default App
