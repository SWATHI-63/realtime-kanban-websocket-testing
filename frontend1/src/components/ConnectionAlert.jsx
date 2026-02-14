import { useEffect, useState } from "react";
import "./ConnectionAlert.css";

export default function ConnectionAlert({ isConnected }) {
  const [showAlert, setShowAlert] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  useEffect(() => {
    if (!isConnected && !hasShownAlert) {
      setShowAlert(true);
      setHasShownAlert(true);
    } else if (isConnected && hasShownAlert) {
      setShowAlert(false);
    }
  }, [isConnected, hasShownAlert]);

  if (!showAlert) return null;

  return (
    <div className="connection-alert">
      <div className="alert-content">
        <span className="alert-icon">⚠️</span>
        <div className="alert-text">
          <strong>Backend Server Not Running</strong>
          <p>Please start the backend server to enable real-time features.</p>
          <code>cd backend && npm start</code>
        </div>
        <button className="alert-close" onClick={() => setShowAlert(false)}>
          ×
        </button>
      </div>
    </div>
  );
}
