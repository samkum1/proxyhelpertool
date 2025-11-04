# Proxy IP Checker

A modern React application that allows users to check their IP information through a proxy server using ipinfo.io.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 Secure proxy configuration
- 📋 One-click cURL command generation and copying
- 🌐 Real-time IP information retrieval
- ⚡ Fast serverless API with Vercel
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Vercel Serverless Functions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Deployment

1. Deploy to Vercel:
   ```bash
   npx vercel
   ```

2. The app will be automatically deployed with serverless functions

## Usage

1. Enter your proxy server details:
   - Host (e.g., 65.195.110.27)
   - Port (e.g., 50100)
   - Username
   - Password

2. Click "Check IP" to retrieve your IP information through the proxy

3. Copy the generated cURL command for manual use

## API Endpoints

- `POST /api/check-ip` - Check IP information through proxy

## Project Structure

```
├── api/
│   └── check-ip.js          # Vercel serverless function
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── vercel.json              # Vercel configuration
└── package.json             # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
