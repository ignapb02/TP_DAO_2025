import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function useHistoriales() {
    const [historiales, setHistoriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarHistoriales = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/historial/");
            setHistoriales(res.data);
            setError(null);
        } catch (err) {
            setError("Error al cargar historiales");
        } finally {
            setLoading(false);
        }
    };

    const obtenerPorPaciente = async (pacienteId) => {
        try {
            const res = await axiosClient.get(`/historial/paciente/${pacienteId}`);
            return res.data;
        } catch (err) {
            throw new Error("Error al cargar historial del paciente");
        }
    };

    useEffect(() => {
        cargarHistoriales();
    }, []);

    return { historiales, loading, error, cargarHistoriales, obtenerPorPaciente };
}
