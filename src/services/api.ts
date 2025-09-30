import axios from 'axios';
import { ReceiptProcessingResponse } from '../types/receipt';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const receiptApi = {
  processReceipt: async (
    imageFile: File
  ): Promise<ReceiptProcessingResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(
      `${API_BASE_URL}/api/receipt/process`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  }
};
