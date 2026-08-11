import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Young's Research Conference (YRC 2026) | PCCOE AIML",
  description: "Annual intra-departmental research conference portal for PCCOE AIML second-year students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <Toaster position="top-right" toastOptions={{
              style: {
                  borderRadius: '10px',
                  background: '#FFDE59',
                  color: '#0F0F0F',
                  border: '3px solid #0F0F0F',
                  boxShadow: '4px 4px 0px #0F0F0F',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '15px'
              }
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
