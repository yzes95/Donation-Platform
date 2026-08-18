import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './store/ThemeContext';
import { AuthProvider } from './store/AuthContext';
import { DonationProvider } from './store/DonationContext';
import { AppProvider } from './store/AppContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'sonner';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DonationProvider>
          <AppProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster position="top-center" richColors closeButton />
            </BrowserRouter>
          </AppProvider>
        </DonationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
