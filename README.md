# Going Dutch Frontend

A mobile-first React TypeScript app for splitting restaurant bills by uploading
receipt photos.

## Features

- **Screen 1**: Upload receipt image and process with backend API
- **Screen 2**: Enter names of people splitting the bill (while API processes)
- **Screen 3**: Assign items to people and see cost breakdown

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:** Create a `.env` file in the root directory:

   ```
   REACT_APP_API_URL=http://localhost:3000
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Make sure the backend is running:** The app expects the going-dutch backend
   API to be running on `http://localhost:3000`

## Usage

1. **Upload Receipt**: Take or select a photo of your receipt
2. **Add Names**: While the API processes the receipt, add names of people
   splitting the bill
3. **Assign Items**: Once processing is complete, assign each item to one or
   more people
4. **View Breakdown**: See how much each person owes, including any unclaimed
   amounts

## Mobile Optimized

The app is designed primarily for mobile browsers with:

- Touch-friendly buttons and inputs
- Responsive design that works on small screens
- Large, easy-to-tap interface elements
- Mobile-first CSS approach

## API Integration

The app integrates with the going-dutch backend API:

- repo hosted [here](https://github.com/RGniner6/going-dutch-backend)
- `POST /api/receipt/process` - Processes receipt images
- Returns itemized list, total price, currency, and additional costs
- Handles both successful processing and error cases
