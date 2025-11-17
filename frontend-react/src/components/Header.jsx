import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Header({ title, onToggleSidebar }) {
    const [currentDate, setCurrentDate] = useState('');
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span>{currentDate}</span>
                {usuario && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>
                            {usuario.nombre} {usuario.apellido} ({usuario.rol})
                        </span>
                        <Button variant="secondary" size="small" onClick={handleLogout}>
                            🚪 Salir
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
