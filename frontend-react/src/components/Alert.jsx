import { useState, useCallback } from 'react';

export default function Alert({ message, type = 'info', onClose }) {
    return (
        <div className={`alert alert-${type}`}>
            <span>{message}</span>
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
    );
}

export function AlertContainer({ alerts, onRemove }) {
    return (
        <div className="alert-container">
            {alerts.map((alert) => (
                <Alert 
                    key={alert.id} 
                    message={alert.message}
                    type={alert.type}
                    onClose={() => onRemove(alert.id)}
                />
            ))}
        </div>
    );
}

export function useAlert() {
    const [alerts, setAlerts] = useState([]);

    const showAlert = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeAlert(id);
            }, duration);
        }

        return id;
    }, []);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    return { alerts, showAlert, removeAlert };
}
