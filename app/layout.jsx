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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="main-content">
            {children}
          </main>
          <Toaster position="top-right" toastOptions={{
              style: {
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: '#1d1d1f',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  fontFamily: "'SF Pro Text', -apple-system, sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  padding: '10px 20px'
              }
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
