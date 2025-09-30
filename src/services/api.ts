import axios from "axios";
import { ReceiptProcessingResponse } from "../types/receipt";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Mock data for testing
const mockReceiptData: ReceiptProcessingResponse = {
  success: true,
  data: {
    items: [
      {
        name: "CAUSA DE POLLO",
        quantity: 1,
        price: 8.95,
      },
      {
        name: "CEVICHE DE CAMARONES",
        quantity: 1,
        price: 16.95,
      },
      {
        name: "LIMONADA",
        quantity: 1,
        price: 4,
      },
      {
        name: "PESCADO AL AJILLO",
        quantity: 1,
        price: 15.95,
      },
    ],
    additionalCosts: [
      {
        name: "Total Taxes",
        amount: 3.67,
        additionalCost: true,
      },
    ],
    totalPrice: 49.52,
    currency: "USD",
    currencySymbol: "$",
  },
};

// Stub function that simulates API call with 5-second delay
const stubProcessReceipt = async (
  imageFile: File,
): Promise<ReceiptProcessingResponse> => {
  console.log("Using stub function - simulating API call...");

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Return mock data
  return mockReceiptData;
};

// Real API function
const processReceipt = async (
  imageFile: File,
): Promise<ReceiptProcessingResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(
    `${API_BASE_URL}/api/receipt/process`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const receiptApi = {
  // Change this to stubProcessReceipt to use mock data, or realProcessReceipt for real API
  processReceipt: stubProcessReceipt,
};
