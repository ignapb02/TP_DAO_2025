import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/Layout";
import { useAlert, AlertContainer } from "../components/Alert";
import Dashboard from "../pages/Dashboard";
import PacientesPage from "../pages/PacientesPage";
import PacienteDetallePage from "../pages/PacienteDetallePage";
import MedicosPage from "../pages/MedicosPage";
import TurnosPage from "../pages/TurnosPage";
import EspecialidadesPage from "../pages/EspecialidadesPage";
import CalendarioPage from "../pages/CalendarioPage";
import NotFound from "../pages/NotFound";
import EstadoTurnosMasivo from "../pages/EstadoTurnosMasivo";

function AppRouterContent() {
    const location = useLocation();
    const { alerts, showAlert, removeAlert } = useAlert();
    
    // Determinar página activa desde la ruta
    const getActiveMenu = () => {
        if (location.pathname === '/') return 'dashboard';
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
    };

    const title = pageTitles[getActiveMenu()] || 'Página no encontrada';

    // Pasar showAlert a través de window para acceso global
    window.showAlert = showAlert;

    return (
        <Layout 
            activeMenu={getActiveMenu()} 
            title={title}
            alerts={alerts}
            onRemoveAlert={removeAlert}
        >
            <Routes>
                <Route path="/" element={<Dashboard showAlert={showAlert} />} />
                <Route path="/pacientes" element={<PacientesPage showAlert={showAlert} />} />
                <Route path="/pacientes/:id" element={<PacienteDetallePage showAlert={showAlert} />} />
                <Route path="/medicos" element={<MedicosPage showAlert={showAlert} />} />
                <Route path="/turnos" element={<TurnosPage showAlert={showAlert} />} />
                <Route path="/especialidades" element={<EspecialidadesPage showAlert={showAlert} />} />
                <Route path="/calendario" element={<CalendarioPage showAlert={showAlert} />} />
                <Route path="/estado-turnos" element={<EstadoTurnosMasivo />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AppRouterContent />
        </BrowserRouter>
    );
}
