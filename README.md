# Proxy Helper Tool

A modern web application built with React, Vite, TypeScript, and Tailwind CSS for managing and testing proxy configurations.

## Features

- Parse proxy strings in the format `host:port:username:password`
- Display proxy details in separate editable input fields
- Generate cURL commands for proxy usage
- Test proxy connectivity through ipinfo.io API
- View proxy information (IP, location, ISP, etc.)
- Copy commands and results to clipboard
- Clean, modern UI with custom theme colors

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the backend server (required for proxy checking):
```bash
npm run server
```

2. In a separate terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Paste your proxy string in the format: `host:port:username:password`
   - Example: `res-ww.lightningproxies.net:9999:evnxmcecwccgpnp188201-zone-lightning:bewcsnpvbr`

2. The proxy details will be automatically parsed and displayed in separate fields

3. Copy the generated cURL command to use in your terminal

4. Click "Check Proxy" to test the proxy connection and view proxy information

## Theme Colors

- Primary: #1678FF
- Secondary: #EBF3FF
- Text: #FFFFFF (on primary background)

## Project Structure

```
├── api/
│   └── check-proxy.js        # Vercel serverless function
├── src/
│   ├── components/
│   │   ├── Layout.tsx        # Main layout with navigation
│   │   └── ProxyTool.tsx     # Proxy tool component
│   ├── pages/
│   │   └── Home.tsx          # Home page
│   ├── App.tsx               # Router configuration
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── server.js                 # Backend API server (local dev only)
├── vercel.json               # Vercel configuration
└── package.json
```

## Backend API

### Local Development

The backend server runs on `http://localhost:3001` by default and provides:

- `POST /api/check-proxy` - Checks proxy connectivity and returns proxy information
- `GET /health` - Health check endpoint

To run locally:
```bash
npm run server
```

### Vercel Deployment

The project is configured to work on Vercel with serverless functions. The API endpoint is automatically available at `/api/check-proxy` when deployed.

**Deployment Steps:**
1. Push your code to GitHub
2. Import the project on Vercel
3. Vercel will automatically detect the Vite configuration
4. The API function in `api/check-proxy.js` will be deployed as a serverless function
5. No additional configuration needed - the frontend will automatically use the correct API URL

**Note:** The `server.js` file is for local development only. On Vercel, the `api/check-proxy.js` serverless function handles the backend requests.

## License

MIT

