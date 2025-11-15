export default function PacienteCard({ paciente }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5 className="card-title">
                    {paciente.apellido}, {paciente.nombre}
                </h5>
                <p className="card-text mb-1"><strong>DNI:</strong> {paciente.dni}</p>
                <p className="card-text mb-1"><strong>Email:</strong> {paciente.email}</p>
                <p className="card-text"><strong>Teléfono:</strong> {paciente.telefono || "No registrado"}</p>

                <a href={`/pacientes/${paciente.id_paciente}`} className="btn btn-primary btn-sm">
                    Ver Detalles
                </a>
            </div>
        </div>
    );
}
