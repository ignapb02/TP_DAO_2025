import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import PacientesPage from "../pages/PacientesPage";
import PacienteDetallePage from "../pages/PacienteDetallePage";
import MedicosPage from "../pages/MedicosPage";
import TurnosPage from "../pages/TurnosPage";
import NotFound from "../pages/NotFound";
import Navbar from "../components/Navbar";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/pacientes" element={<PacientesPage />} />
                <Route path="/pacientes/:id" element={<PacienteDetallePage />} />

                <Route path="/medicos" element={<MedicosPage />} />

                <Route path="/turnos" element={<TurnosPage />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
