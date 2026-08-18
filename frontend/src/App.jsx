import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './store/ThemeContext';
import { AuthProvider } from './store/AuthContext';
import { DonationProvider } from './store/DonationContext';
import { AppProvider } from './store/AppContext';
import { AppRoutes } from './routes/AppRoutes';
import { InteractiveBackground } from './components/common/InteractiveBackground';
import { Toaster } from 'sonner';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DonationProvider>
          <AppProvider>
            <InteractiveBackground />
            <BrowserRouter basename={import.meta.env.BASE_URL}>
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
