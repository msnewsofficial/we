import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl="https://pitcoin-app.com/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
); 