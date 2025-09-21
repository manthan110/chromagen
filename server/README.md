# ChromaGen Backend (Colormind Integration)

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The backend will run on http://localhost:5000

## API Endpoint

### POST `/api/generate-palette`
- **Body:**
  ```json
  {
    "input": [[44,43,44],[90,83,82],"N","N","N"],
    "model": "default"
  }
  ```
- **Returns:**
  - The color palette response from Colormind API.

If no input is provided, a default palette will be generated.
