import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function usePacientes() {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarPacientes = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/pacientes/");
            setPacientes(res.data);
            setError(null);
        } catch (err) {
            console.error('usePacientes - cargarPacientes error:', err);
            const msg = err?.response?.data?.error || err.message || 'Error al cargar pacientes';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const crearPaciente = async (datos) => {
        try {
            const res = await axiosClient.post("/pacientes/", datos);
            // Si el backend devuelve el recurso creado
            if (res && res.data) setPacientes(prev => [...prev, res.data]);
            return res.data || null;
        } catch (err) {
            throw new Error(err?.response?.data?.error || 'Error al crear paciente');
        }
    };

    const actualizarPaciente = async (id, datos) => {
        try {
            const res = await axiosClient.put(`/pacientes/${id}`, datos);
            setPacientes(prev => prev.map(p => p.id_paciente === id ? { ...p, ...datos } : p));
            return res.data || null;
        } catch (err) {
            throw new Error(err?.response?.data?.error || 'Error al actualizar paciente');
        }
    };

    const eliminarPaciente = async (id) => {
        try {
            await axiosClient.delete(`/pacientes/${id}`);
            setPacientes(prev => prev.filter(p => p.id_paciente !== id));
            return true;
        } catch (err) {
            throw new Error(err?.response?.data?.error || 'Error al eliminar paciente');
        }
    };

    useEffect(() => {
        cargarPacientes();
    }, []);

    return { 
        pacientes, 
        loading, 
        error, 
        cargarPacientes,
        crearPaciente,
        actualizarPaciente,
        eliminarPaciente
    };
}
