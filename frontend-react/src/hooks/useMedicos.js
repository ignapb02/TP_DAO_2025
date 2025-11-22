import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function useMedicos() {
    const [medicos, setMedicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarMedicos = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/medicos/");
            setMedicos(res.data);
            setError(null);
        } catch (err) {
            console.error('useMedicos - cargarMedicos error:', err);
            const msg = err?.response?.data?.error || err.message || 'Error al cargar médicos';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const crearMedico = async (datos) => {
        try {
            const res = await axiosClient.post("/medicos/", datos);
            setMedicos([...medicos, res.data]);
            return res.data;
        } catch (err) {
            throw new Error("Error al crear médico");
        }
    };

    const actualizarMedico = async (id, datos) => {
        try {
            const res = await axiosClient.put(`/medicos/${id}`, datos);
            setMedicos(medicos.map(m => m.id_medico === id ? { ...m, ...datos } : m));
            return res.data || null;
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || "Error al actualizar médico";
            throw new Error(msg);
        }
    };

    const eliminarMedico = async (id) => {
        try {
            await axiosClient.delete(`/medicos/${id}`);
            setMedicos(medicos.filter(m => m.id_medico !== id));
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || "Error al eliminar médico";
            throw new Error(msg);
        }
    };

    useEffect(() => {
        cargarMedicos();
    }, []);

    return { medicos, loading, error, cargarMedicos, crearMedico, actualizarMedico, eliminarMedico };
}
