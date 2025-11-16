import { useEffect, useState } from 'react';

export default function Header({ title, onToggleSidebar }) {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const formatted = now.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            setCurrentDate(formatted.charAt(0).toUpperCase() + formatted.slice(1));
        };

        updateDate();
        const interval = setInterval(updateDate, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    className="btn btn-secondary sidebar-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Abrir menú"
                >
                    ☰
                </button>
                <h2>{title}</h2>
            </div>
            <div className="header-actions">
                <span>{currentDate}</span>
            </div>
        </header>
    );
}
