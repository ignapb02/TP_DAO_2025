import { useEffect, useState, useMemo } from 'react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { useEspecialidades } from '../hooks/useEspecialidades';
import { useMedicos } from '../hooks/useMedicos';
import { useTurnos } from '../hooks/useTurnos';
import { usePacientes } from '../hooks/usePacientes';
import { formatDateForInput, calcularHoraFin } from '../utils/helpers';
import axiosClient from '../api/axiosClient';

export default function CalendarioPage({ showAlert }) {
    const { especialidades, loading: loadingEsp } = useEspecialidades();
    const { medicos } = useMedicos();
    const { pacientes } = usePacientes();

    const [espId, setEspId] = useState('');
    const [medId, setMedId] = useState('');
    const [turnosDia, setTurnosDia] = useState([]);
    const [modalDiaOpen, setModalDiaOpen] = useState(false);
    const [selectedFecha, setSelectedFecha] = useState('');
    const [month, setMonth] = useState(new Date());
    const [allTurnos, setAllTurnos] = useState([]);
    const [loadingTurnos, setLoadingTurnos] = useState(false);

    // Helper para obtener nombre de paciente
    const getNombrePaciente = (pacienteId) => {
        const paciente = pacientes.find(p => p.id_paciente === pacienteId);
        return paciente ? `${paciente.nombre} ${paciente.apellido}` : `Paciente #${pacienteId}`;
    };

    // Filtrar médicos según especialidad seleccionada
    const medicosFiltrados = useMemo(() => {
        if (!espId) return medicos;
        return medicos;
    }, [espId, medicos]);

    // Cargar todos los turnos del médico seleccionado
    useEffect(() => {
        if (!medId) {
            setAllTurnos([]);
            return;
        }

        const loadTurnosMedico = async () => {
            setLoadingTurnos(true);
            try {
                const res = await axiosClient.get(`/turnos/medico/${medId}`);
                console.log(`✓ Turnos cargados para médico ${medId}:`, res.data);
                setAllTurnos(res.data || []);
            } catch (err) {
                console.error('Error cargando turnos:', err);
                showAlert('Error al cargar turnos del médico', 'danger');
                setAllTurnos([]);
            } finally {
                setLoadingTurnos(false);
            }
        };

        loadTurnosMedico();
    }, [medId, showAlert]);

    // Reset de médico cuando cambia especialidad
    const handleSelectEspecialidad = (e) => {
        setEspId(e.target.value);
        setMedId('');
        setAllTurnos([]);
    };

    const handleSelectMedico = (e) => {
        setMedId(e.target.value);
    };

    // Contar turnos por fecha
    const contarTurnosPorFecha = (fecha) => {
        return allTurnos.filter(t => t.fecha === fecha).length;
    };

    const openDia = (fecha) => {
        if (!medId) return showAlert('Selecciona un médico para ver turnos', 'info');
        const turnos = allTurnos.filter(x => x.fecha === fecha).sort((a,b)=>a.hora.localeCompare(b.hora));
        setTurnosDia(turnos);
        setSelectedFecha(fecha);
        setModalDiaOpen(true);
    };

    // Generar calendario
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
    const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

    // Generar array de días (incluyendo días vacíos antes y después)
    const dayList = [];
    // Agregar días del mes anterior
    const prevMonthDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
    for (let d = prevMonthDays - startingDayOfWeek + 1; d <= prevMonthDays; d++) {
        const prevDate = new Date(month.getFullYear(), month.getMonth() - 1, d);
        const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        dayList.push({ dateStr, day: d, isCurrentMonth: false });
    }
    // Agregar días del mes actual
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        dayList.push({ dateStr, day: d, isCurrentMonth: true });
    }
    // Agregar días del próximo mes
    const remainingDays = 42 - dayList.length; // 6 semanas * 7 días
    for (let d = 1; d <= remainingDays; d++) {
        const nextDate = new Date(month.getFullYear(), month.getMonth() + 1, d);
        const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        dayList.push({ dateStr, day: d, isCurrentMonth: false });
    }

    const isToday = (dateStr) => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        return dateStr === todayStr;
    };

    const getDayOfWeek = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <h3>Calendario de Turnos</h3>
                </CardHeader>
                <CardBody>
                    <div className="calendar-controls">
                        <div className="form-group">
                            <label>Especialidad</label>
                            <select value={espId} onChange={handleSelectEspecialidad} disabled={loadingEsp}>
                                <option value="">-- Todas las especialidades --</option>
                                {especialidades.map(e => <option key={e.id_especialidad} value={e.id_especialidad}>{e.nombre}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Médico</label>
                            <select value={medId} onChange={handleSelectMedico} disabled={medicos.length === 0}>
                                <option value="">-- Seleccionar médico --</option>
                                {medicosFiltrados.map(m => <option key={m.id_medico} value={m.id_medico}>{m.nombre} {m.apellido}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Button variant="secondary" onClick={prevMonth}>‹</Button>
                            <div style={{ minWidth: 200, textAlign: 'center', fontWeight: 600 }}>{month.toLocaleDateString('es-ES',{year:'numeric', month:'long'})}</div>
                            <Button variant="secondary" onClick={nextMonth}>›</Button>
                        </div>
                    </div>

                    {loadingTurnos && <Loader />}

                    {/* Encabezado con días de la semana */}
                    <div className="calendar-weekdays">
                        {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(day => (
                            <div key={day} style={{ fontWeight: 600, textAlign: 'center', color: '#555', padding: '8px 0' }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="calendar-grid">
                        {dayList.map(({ dateStr, day, isCurrentMonth }) => {
                            const turnoCount = contarTurnosPorFecha(dateStr);
                            const todayFlag = isToday(dateStr);
                            return (
                                <div 
                                    key={dateStr} 
                                    className={`calendar-day ${!isCurrentMonth ? 'empty' : ''} ${todayFlag ? 'today' : ''} ${turnoCount > 0 ? 'has-turnos' : ''}`}
                                    onClick={() => isCurrentMonth && medId && openDia(dateStr)}
                                    style={{ cursor: isCurrentMonth && medId ? 'pointer' : 'default', opacity: isCurrentMonth ? 1 : 0.4 }}
                                >
                                    <div className="day-number">{day}</div>
                                    {isCurrentMonth && (
                                        <div className="day-info">
                                            <div className="day-count">
                                                {turnoCount > 0 ? (
                                                    <span className="turno-badge">{turnoCount}</span>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: '#aaa' }}>-</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardBody>
            </Card>

            <Modal id="modal-dia-turnos" isOpen={modalDiaOpen} onClose={() => setModalDiaOpen(false)} title={`Turnos - ${selectedFecha}`}>
                <div>
                    {turnosDia.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No hay turnos programados para este día.</p>
                    ) : (
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {turnosDia.map(t => (
                                <div key={t.id_turno} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                                            {t.hora} - {calcularHoraFin(t.hora, t.duracion_minutos)}
                                        </div>
                                        {t.paciente_id && (
                                            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '2px' }}>
                                                Paciente: <strong>{getNombrePaciente(t.paciente_id)}</strong>
                                            </div>
                                        )}
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '2px' }}>
                                            Duración: <strong>{t.duracion_minutos} min</strong>
                                        </div>
                                        <div style={{ fontSize: '0.85rem' }}>
                                            Estado: <span style={{ 
                                                padding: '2px 6px', 
                                                borderRadius: '4px',
                                                backgroundColor: t.estado === 'disponible' ? '#d4edda' : '#f8d7da',
                                                color: t.estado === 'disponible' ? '#155724' : '#721c24',
                                                fontWeight: 500
                                            }}>{t.estado}</span>
                                        </div>
                                    </div>
                                    {t.estado === 'disponible' && (
                                        <Button variant="primary" size="small" onClick={() => {
                                            showAlert('Función de agendar próximamente', 'info');
                                            setModalDiaOpen(false);
                                        }} style={{ marginLeft: '10px' }}>
                                            Agendar
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
