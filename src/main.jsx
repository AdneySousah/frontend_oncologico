import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStyle } from './themes/globalStyles';
import Routes from './routes/routes';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './hooks/AuthConfig';
import CustomThemeProvider from './hooks/ThemeConfig'; // <-- Importado aqui
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* O ThemeProvider envolve tudo para o styled-components funcionar */}
      <CustomThemeProvider>
        <AuthProvider>
          <Routes />
          <ToastContainer />
          <GlobalStyle />
        </AuthProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  </StrictMode>
);