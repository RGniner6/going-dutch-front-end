import axios from "axios"
import { ReceiptProcessingResponse } from "../types/receipt"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000"

// Mock data for testing
const mockReceiptData: ReceiptProcessingResponse = {
  success: true,
  data: {
    items: [
      {
        name: "Chai",
        quantity: 1,
        price: 8,
      },
      {
        name: "Chuski Chai",
        quantity: 3,
        price: 12,
      },
      {
        name: "Lemonade",
        quantity: 2,
        price: 10,
      },
      {
        name: "Achari Plum Soya",
        quantity: 1,
        price: 28,
      },
      {
        name: "Kashmiri Paneer",
        quantity: 1,
        price: 30,
      },
      {
        name: "Vegan Butter Chicken",
        quantity: 1,
        price: 32,
      },
      {
        name: "Malai Kofta",
        quantity: 1,
        price: 28,
      },
      {
        name: "Naan Basket regular",
        quantity: 1,
        price: 18,
      },
      {
        name: "Lamb Masala",
        quantity: 1,
        price: 33,
      },
      {
        name: "Prawn Curry",
        quantity: 1,
        price: 36,
      },
      {
        name: "Herbs & Spice Naan Basket",
        quantity: 1,
        price: 23,
      },
      {
        name: "Tandoori Chicken",
        quantity: 1,
        price: 32,
      },
      {
        name: "Naan Garlic and Chives",
        quantity: 1,
        price: 7,
      },
      {
        name: "Naan chilli naan",
        quantity: 1,
        price: 9,
      },
      {
        name: "Custom Amount Fire ball",
        quantity: 6,
        price: 72,
      },
    ],
    additionalCosts: [
      {
        name: "Surcharge",
        amount: 6.58,
        additionalCost: true,
      },
      {
        name: "Tax Included in Items",
        amount: 31.45,
        additionalCost: false,
      },
    ],
    totalPrice: 384.58,
    currency: "AUD",
    currencySymbol: "$",
  },
}

// Stub function that simulates API call with 5-second delay
const stubProcessReceipt = async (
  imageFile: File,
): Promise<ReceiptProcessingResponse> => {
  console.log("Using stub function - simulating API call...")

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // Return mock data
  return mockReceiptData
}

// Real API function
const processReceipt = async (
  imageFile: File,
): Promise<ReceiptProcessingResponse> => {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await axios.post(
    `${API_BASE_URL}/api/receipt/process`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  return response.data
}

export const receiptApi = {
  // Change this to stubProcessReceipt to use mock data, or realProcessReceipt for real API
  processReceipt: stubProcessReceipt,
}
