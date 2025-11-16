import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function useEspecialidades() {
    const [especialidades, setEspecialidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarEspecialidades = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/especialidades/");
            setEspecialidades(res.data);
            setError(null);
        } catch (err) {
            console.error('useEspecialidades - cargarEspecialidades error:', err);
            const msg = err?.response?.data?.error || err.message || 'Error al cargar especialidades';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const crearEspecialidad = async (datos) => {
        try {
            const res = await axiosClient.post("/especialidades/", datos);
            setEspecialidades([...especialidades, res.data]);
            return res.data;
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || "Error al crear especialidad";
            throw new Error(msg);
        }
    };

    const actualizarEspecialidad = async (id, datos) => {
        try {
            const res = await axiosClient.put(`/especialidades/${id}`, datos);
            setEspecialidades(especialidades.map(e => e.id_especialidad === id ? { ...e, ...datos } : e));
            return res.data || null;
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || "Error al actualizar especialidad";
            throw new Error(msg);
        }
    };

    const eliminarEspecialidad = async (id) => {
        try {
            await axiosClient.delete(`/especialidades/${id}`);
            setEspecialidades(especialidades.filter(e => e.id_especialidad !== id));
            return true;
        } catch (err) {
            const msg = err?.response?.data?.error || err.message || "Error al eliminar especialidad";
            throw new Error(msg);
        }
    };

    useEffect(() => {
        cargarEspecialidades();
    }, []);

    return { especialidades, loading, error, cargarEspecialidades, crearEspecialidad, actualizarEspecialidad, eliminarEspecialidad };
}
