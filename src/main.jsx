import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";
import './index.css';

createRoot(document.getElementById('root')).render(
  
    <AuthProvider>
      <ModalProvider>
    <App />
    </ModalProvider>
    </AuthProvider>
  ,
)
