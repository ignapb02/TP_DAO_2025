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
            setError("Error al cargar pacientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPacientes();
    }, []);

    return { pacientes, loading, error, cargarPacientes };
}
