import { useEffect, useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useEspecialidades } from '../hooks/useEspecialidades';
import { useMedicos } from '../hooks/useMedicos';
import { useTurnos } from '../hooks/useTurnos';
import { formatDateForInput, calcularHoraFin } from '../utils/helpers';

export default function CalendarioPage({ showAlert }) {
    const { especialidades } = useEspecialidades();
    const { medicos } = useMedicos();
    const { obtenerPorMedico } = useTurnos();

    const [espId, setEspId] = useState('');
    const [medId, setMedId] = useState('');
    const [turnosDia, setTurnosDia] = useState([]);
    const [modalDiaOpen, setModalDiaOpen] = useState(false);
    const [selectedFecha, setSelectedFecha] = useState('');
    const [month, setMonth] = useState(new Date());

    useEffect(() => {
        // placeholder: cargar datos si es necesario
    }, []);

    const handleSelectEspecialidad = async (e) => {
        setEspId(e.target.value);
        setMedId('');
    };

    const handleSelectMedico = async (e) => {
        setMedId(e.target.value);
    };

    const openDia = async (fecha) => {
        if (!medId) return showAlert('Selecciona un médico para ver turnos', 'info');
        try {
            const t = await obtenerPorMedico(parseInt(medId));
            const turnos = t.filter(x => x.fecha === fecha).sort((a,b)=>a.hora.localeCompare(b.hora));
            setTurnosDia(turnos);
            setSelectedFecha(fecha);
            setModalDiaOpen(true);
        } catch (err) {
            showAlert(err.message || 'Error al cargar turnos del día', 'danger');
        }
    };

    // Render simplificado: lista de fechas del mes actual
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();

    const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
    const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

    const dayList = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        dayList.push(dateStr);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <h3>Calendario</h3>
                </CardHeader>
                <CardBody>
                    <div className="calendar-controls">
                        <div className="form-group">
                            <label>Especialidad</label>
                            <select value={espId} onChange={handleSelectEspecialidad}>
                                <option value="">-- Seleccionar especialidad --</option>
                                {especialidades.map(e => <option key={e.id_especialidad} value={e.id_especialidad}>{e.nombre}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Médico</label>
                            <select value={medId} onChange={handleSelectMedico}>
                                <option value="">-- Seleccionar médico --</option>
                                {medicos.map(m => <option key={m.id_medico} value={m.id_medico}>{m.nombre} {m.apellido}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Button variant="secondary" onClick={prevMonth}>‹</Button>
                            <div style={{ minWidth: 180, textAlign: 'center', fontWeight: 600 }}>{month.toLocaleDateString('es-ES',{year:'numeric', month:'long'})}</div>
                            <Button variant="secondary" onClick={nextMonth}>›</Button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {dayList.map(fecha => (
                            <div key={fecha} className={`calendar-day`} onClick={() => openDia(fecha)}>
                                <div className="day-number">{Number(fecha.split('-')[2])}</div>
                                <div className="day-count">Ver turnos</div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            <Modal id="modal-dia-turnos" isOpen={modalDiaOpen} onClose={() => setModalDiaOpen(false)} title={`Turnos - ${selectedFecha}`}>
                <div>
                    {turnosDia.length === 0 ? <p style={{ color: '#999' }}>No hay turnos para este día.</p> : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {turnosDia.map(t => (
                                <li key={t.id_turno} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{t.hora} - {calcularHoraFin(t.hora, t.duracion_minutos)}</strong>
                                            <div style={{ fontSize: '0.9em', color: '#666' }}>{t.estado}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.9em' }}>{t.paciente_id ? `Paciente #${t.paciente_id}` : ''}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Modal>
        </>
    );
}
