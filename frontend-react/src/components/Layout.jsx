import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { AlertContainer } from './Alert';

export default function Layout({ activeMenu, title, children, alerts, onRemoveAlert }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((s) => !s);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="main-content" onClick={() => { if (sidebarOpen) closeSidebar(); }}>
                <Header title={title} onToggleSidebar={toggleSidebar} />
                <div className="content">
                    {children}
                </div>
            </div>
            {alerts && alerts.length > 0 && (
                <AlertContainer alerts={alerts} onRemove={onRemoveAlert} />
            )}
            {/* Backdrop for mobile when sidebar is open */}
            <div className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar} />
        </div>
    );
}
