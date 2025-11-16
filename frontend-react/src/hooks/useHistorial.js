import axiosClient from "../api/axiosClient";
import { useState } from "react";

export function useHistorial() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearHistorial = async (datos) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosClient.post("/historial/", datos);
            return res.data;
        } catch (err) {
            setError(err?.response?.data?.error || "Error al registrar historia clínica");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { crearHistorial, loading, error };
}
