import Table from '../components/Table';
import Loader from '../components/Loader';
import { useTurnos } from '../hooks/useTurnos';
import { useMedicos } from '../hooks/useMedicos';
import { usePacientes } from '../hooks/usePacientes';
import { useEspecialidades } from '../hooks/useEspecialidades';

export default function TurnosPage() {
    const { turnos, loading } = useTurnos();
    const { medicos } = useMedicos();
    const { pacientes } = usePacientes();
    const { especialidades } = useEspecialidades();

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Loader /></div>;

    const turnosConDetalles = turnos.map(t => ({
        ...t,
        medico: medicos.find(m => m.id_medico === t.medico_id) || {},
        paciente: pacientes.find(p => p.id_paciente === t.paciente_id) || {},
        especialidad: especialidades.find(e => e.id_especialidad === t.especialidad_id) || {}
    }));

    const columns = [
        { key: 'id_turno', label: 'ID' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'hora', label: 'Hora' },
        { key: 'medico', label: 'Médico', render: (row) => row.medico?.nombre + ' ' + (row.medico?.apellido || '') },
        { key: 'paciente', label: 'Paciente', render: (row) => row.paciente?.nombre + ' ' + (row.paciente?.apellido || '') },
        { key: 'especialidad', label: 'Especialidad', render: (row) => row.especialidad?.nombre || '-' },
        { key: 'duracion_minutos', label: 'Duración (min)' },
        { key: 'estado', label: 'Estado' }
    ];

    return (
        <div>
            <h2>Gestión de Turnos</h2>
            <Table data={turnosConDetalles} columns={columns} />
        </div>
    );
}
