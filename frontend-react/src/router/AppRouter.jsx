import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";
import { useAlert, AlertContainer } from "../components/Alert";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PacientesPage from "../pages/PacientesPage";
import PacienteDetallePage from "../pages/PacienteDetallePage";
import MedicosPage from "../pages/MedicosPage";
import TurnosPage from "../pages/TurnosPage";
import EspecialidadesPage from "../pages/EspecialidadesPage";
import CalendarioPage from "../pages/CalendarioPage";
import MisTurnosPage from "../pages/MisTurnosPage";
import NotFound from "../pages/NotFound";
import EstadoTurnosMasivo from "../pages/EstadoTurnosMasivo";

// Componente para rutas protegidas
function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    
    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/mis-turnos" replace />;
    }
    
    return children;
}

function AppRouterContent() {
    const location = useLocation();
    const { alerts, showAlert, removeAlert } = useAlert();
    const { isAuthenticated, isAdmin, isMedico, loading } = useAuth();
    
    // Redirigir login si está autenticado
    if (location.pathname === '/login' && isAuthenticated) {
        return <Navigate to={isAdmin ? '/dashboard' : '/mis-turnos'} replace />;
    }
    
    // Determinar página activa desde la ruta
    const getActiveMenu = () => {
        if (location.pathname === '/') return 'dashboard';
        if (location.pathname === '/mis-turnos') return 'mis-turnos';
        return location.pathname.split('/')[1];
    };

    // Títulos de páginas
    const pageTitles = {
        dashboard: 'Dashboard',
        pacientes: 'Gestión de Pacientes',
        medicos: 'Gestión de Médicos',
        especialidades: 'Gestión de Especialidades',
        calendario: 'Calendario',
        turnos: 'Gestión de Turnos',
        'mis-turnos': 'Mis Turnos',
    };

    const title = pageTitles[getActiveMenu()] || 'Página no encontrada';

    // Pasar showAlert a través de window para acceso global
    window.showAlert = showAlert;

    // Página de login sin Layout
    if (location.pathname === '/login') {
        return <LoginPage />;
    }

    return (
        <Layout 
            activeMenu={getActiveMenu()} 
            title={title}
            alerts={alerts}
            onRemoveAlert={removeAlert}
        >
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute requireAdmin>
                        <Dashboard showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute requireAdmin>
                        <Dashboard showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/pacientes" element={
                    <ProtectedRoute requireAdmin>
                        <PacientesPage showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/pacientes/:id" element={
                    <ProtectedRoute requireAdmin>
                        <PacienteDetallePage showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/medicos" element={
                    <ProtectedRoute requireAdmin>
                        <MedicosPage showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/turnos" element={
                    <ProtectedRoute requireAdmin>
                        <TurnosPage showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/especialidades" element={
                    <ProtectedRoute requireAdmin>
                        <EspecialidadesPage showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/calendario" element={
                    <ProtectedRoute requireAdmin>
                        <CalendarioPage showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/mis-turnos" element={
                    <ProtectedRoute>
                        <MisTurnosPage showAlert={showAlert} />
                    </ProtectedRoute>
                } />
                <Route path="/estado-turnos" element={
                    <ProtectedRoute requireAdmin>
                        <EstadoTurnosMasivo />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRouterContent />
            </AuthProvider>
        </BrowserRouter>
    );
}
