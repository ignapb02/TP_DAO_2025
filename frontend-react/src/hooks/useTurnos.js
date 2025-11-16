import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export function useTurnos() {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarTurnos = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/turnos/");
            setTurnos(res.data);
            setError(null);
        } catch (err) {
            setError("Error al cargar turnos");
        } finally {
            setLoading(false);
        }
    };

    const crearTurno = async (datos) => {
        try {
            const res = await axiosClient.post("/turnos/", datos);
            setTurnos([...turnos, res.data.turno]);
            return res.data.turno;
        } catch (err) {
            // El error se lanza tal como viene del servidor o del cliente
            throw err;
        }
    };

    const cambiarEstadoTurno = async (id, estado) => {
        try {
            await axiosClient.put(`/turnos/${id}/estado`, { estado });
            setTurnos(turnos.map(t => t.id_turno === id ? { ...t, estado } : t));
        } catch (err) {
            throw new Error("Error al cambiar estado del turno");
        }
    };

    const obtenerPorMedico = async (medicoId) => {
        try {
            const res = await axiosClient.get(`/turnos/medico/${medicoId}`);
            return res.data;
        } catch (err) {
            throw new Error("Error al cargar turnos del médico");
        }
    };

    const obtenerPorPaciente = async (pacienteId) => {
        try {
            const res = await axiosClient.get(`/turnos/paciente/${pacienteId}`);
            return res.data;
        } catch (err) {
            throw new Error("Error al cargar turnos del paciente");
        }
    };

    useEffect(() => {
        cargarTurnos();
    }, []);

    return { 
        turnos, 
        loading, 
        error, 
        cargarTurnos, 
        crearTurno, 
        cambiarEstadoTurno,
        obtenerPorMedico,
        obtenerPorPaciente 
    };
}
