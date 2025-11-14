import PacienteCard from "../components/pacientes/PacienteCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { usePacientes } from "../hooks/usePacientes";

export default function PacientesPage() {

    const { pacientes, loading, error, cargarPacientes } = usePacientes();

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Pacientes</h2>

            <button className="btn btn-success mb-4" onClick={cargarPacientes}>
                🔄 Actualizar lista
            </button>

            {loading && <Loader />}
            {error && <ErrorMessage msg={error} />}

            <div className="row">
                {pacientes.map((p) => (
                    <div className="col-md-4" key={p.id_paciente}>
                        <PacienteCard paciente={p} />
                    </div>
                ))}
            </div>

            {pacientes.length === 0 && !loading && (
                <p className="text-muted">No hay pacientes registrados.</p>
            )}
        </div>
    );
}
