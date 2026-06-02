import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleErr = (e) => {
      console.error("ErrorBoundary capturou erro:", e);
      setError(e.message || "Erro desconhecido");
    };
    const handleRej = (e) => {
      console.error("ErrorBoundary capturou rejeição:", e);
      setError("Rejeição de Promessa: " + (e.reason ? e.reason.message || e.reason : "desconhecida"));
    };
    window.addEventListener('error', handleErr);
    window.addEventListener('unhandledrejection', handleRej);
    return () => {
      window.removeEventListener('error', handleErr);
      window.removeEventListener('unhandledrejection', handleRej);
    };
  }, []);

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        background: '#ff3333',
        color: '#fff',
        padding: '16px',
        fontFamily: 'monospace',
        zIndex: 99999,
        fontSize: '0.9rem',
        borderBottom: '3px solid #770000',
        textAlign: 'left',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
      }}>
        <strong>[ERRO DE EXECUÇÃO DETECTADO]:</strong> {error}
        <button 
          onClick={() => setError(null)} 
          style={{ 
            float: 'right', 
            background: '#fff', 
            color: '#770000', 
            border: 'none', 
            padding: '4px 10px', 
            cursor: 'pointer', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          FECHAR
        </button>
      </div>
    );
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
