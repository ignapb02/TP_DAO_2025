import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
    const { isAdmin } = useAuth();
    
    // Menú completo para admin
    const adminMenuItems = [
        { to: '/dashboard', id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { to: '/pacientes', id: 'pacientes', label: 'Pacientes', icon: '👥' },
        { to: '/medicos', id: 'medicos', label: 'Médicos', icon: '🩺' },
        { to: '/especialidades', id: 'especialidades', label: 'Especialidades', icon: '📚' },
        { to: '/reportes', id: 'reportes', label: 'Reportes', icon: '📈' },
        { to: '/turnos', id: 'turnos', label: 'Turnos', icon: '⏰' },
    ];
    
    // Menú simplificado para médicos
    const medicoMenuItems = [
        { to: '/mis-turnos', id: 'mis-turnos', label: 'Mis Turnos', icon: '📋' },
    ];
    
    const menuItems = isAdmin ? adminMenuItems : medicoMenuItems;

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h1>🏥 Turnero Médico</h1>
                <button className="close-btn" onClick={onClose} style={{ display: 'none' }} aria-label="Cerrar menú">×</button>
            </div>
            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.to}
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
