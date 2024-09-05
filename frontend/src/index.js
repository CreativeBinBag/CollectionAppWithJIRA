import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { I18nextProvider } from 'react-i18next'; // Import this
import i18n from './i18n'; // Ensure this is correctly imported

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <AuthProvider>
    <I18nextProvider i18n={i18n}> {/* Wrap with I18nextProvider */}
      <App />  
    </I18nextProvider>
  </AuthProvider>
</React.StrictMode>
);
