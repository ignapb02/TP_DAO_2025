import { useTurnos } from "../hooks/useTurnos";
import Button from "../components/Button";

export default function EstadoTurnosMasivo() {
    const { turnos, cambiarEstadoTurno, cargarTurnos } = useTurnos();

    const handleActualizarTodos = async () => {
        for (const t of turnos) {
            if (t.estado === "pendiente") {
                await cambiarEstadoTurno(t.id_turno, "programado");
            }
        }
        await cargarTurnos();
        alert("Estados actualizados a 'programado'.");
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Actualizar estado de todos los turnos 'pendiente' a 'programado'</h3>
            <Button variant="success" onClick={handleActualizarTodos}>
                Actualizar estados
            </Button>
        </div>
    );
}
