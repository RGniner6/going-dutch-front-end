// Types matching the backend API structure
export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface AdditionalCost {
  name: string;
  amount: number;
  additionalCost: boolean; // Whether this cost is already included in the subtotal
}

export interface ReceiptAnalysisResult {
  items: ReceiptItem[];
  additionalCosts?: AdditionalCost[];
  totalPrice: number;
  currency: string;
  currencySymbol?: string;
  errorText?: string;
}

export interface ReceiptProcessingError {
  error: string;
  message: string;
}

export interface ReceiptProcessingResponse {
  success: boolean;
  data?: ReceiptAnalysisResult;
  error?: ReceiptProcessingError;
}

// App-specific types
export interface Person {
  id: string;
  name: string;
}

export interface ItemAssignment {
  itemId: string;
  assignedTo: string[]; // Array of person IDs
}

export interface PersonCost {
  personId: string;
  name: string;
  amount: number;
}

export interface AppState {
  currentScreen: 'upload' | 'names' | 'assignments';
  receiptData: ReceiptAnalysisResult | null;
  people: Person[];
  itemAssignments: ItemAssignment[];
  isLoading: boolean;
  error: string | null;
}
