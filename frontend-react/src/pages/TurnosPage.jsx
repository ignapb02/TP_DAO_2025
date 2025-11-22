import { useState, useMemo } from 'react';
import Table from '../components/Table';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Form, { FormGroup, FormRow, FormActions } from '../components/Form';
import Alert from '../components/Alert';
import axiosClient from '../api/axiosClient';
import { useTurnos } from '../hooks/useTurnos';
import { useMedicos } from '../hooks/useMedicos';
import { usePacientes } from '../hooks/usePacientes';
import { useEspecialidades } from '../hooks/useEspecialidades';

export default function TurnosPage({ showAlert }) {
    // Todos los hooks primero
    const { turnos, loading, crearTurno, cargarTurnos, cambiarEstadoTurno } = useTurnos();
    const { medicos } = useMedicos();
    const { pacientes } = usePacientes();
    const { especialidades } = useEspecialidades();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTurno, setEditingTurno] = useState(null);
    const [formData, setFormData] = useState({
        paciente_id: '',
        medico_id: '',
        especialidad_id: '',
        fecha: '',
        hora: '',
        duracion_minutos: 30
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [medicosDisponibles, setMedicosDisponibles] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [procesandoRecordatorios, setProcesandoRecordatorios] = useState(false);
    const [estadoChanging, setEstadoChanging] = useState(null);
    const [filtros, setFiltros] = useState({
        medico_id: '',
        especialidad_id: '',
        estado: 'pendiente',
        fecha: new Date().toISOString().split('T')[0]
    });
    const [ordenamiento, setOrdenamiento] = useState({
        campos: [
            { campo: 'fecha', direccion: 'asc' },
            { campo: 'hora', direccion: 'asc' }
        ]
    });

    // useMemo para columnas
    const columns = useMemo(() => [
        { 
            key: 'fecha', 
            label: 'Fecha',
            sortable: true,
            render: (row) => row.fecha
        },
        { 
            key: 'hora', 
            label: 'Hora',
            sortable: true,
            render: (row) => row.hora
        },
        { key: 'medico', label: 'Médico', render: (row) => `${row.medico?.apellido || '-'} ${row.medico?.nombre || ''}`.trim() },
        { key: 'paciente', label: 'Paciente', render: (row) => `${row.paciente?.nombre || '-'} ${row.paciente?.apellido || ''}`.trim() },
        { key: 'especialidad', label: 'Especialidad', render: (row) => row.especialidad?.nombre || '-' },
        { key: 'duracion_minutos', label: 'Duración', render: (row) => `${row.duracion_minutos} min` },
        { key: 'estado', label: 'Estado', render: (row) => {
            const colors = row.estado === 'pendiente' 
                ? { bg: '#ffc107', color: '#000' }
                : row.estado === 'completado'
                ? { bg: '#28a745', color: '#fff' }
                : row.estado === 'cancelado'
                ? { bg: '#dc3545', color: '#fff' }
                : { bg: '#6c757d', color: '#fff' };
            
            return (
                <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: colors.bg,
                    color: colors.color,
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    textTransform: 'capitalize'
                }}>
                    {row.estado}
                </span>
            );
        } }
    ], []);

    // Funciones de manejo
    const handleOpenModal = () => {
        setFormData({
            paciente_id: '',
            medico_id: '',
            especialidad_id: '',
            fecha: '',
            hora: '',
            duracion_minutos: 30
        });
        setError('');
        setSuccess('');
        setMedicosDisponibles([]);
        setHorariosDisponibles([]);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (turno) => {
        setEditingTurno(turno);
        setFormData({
            paciente_id: turno.paciente_id,
            medico_id: turno.medico_id,
            especialidad_id: turno.especialidad_id,
            fecha: turno.fecha,
            hora: turno.hora,
            duracion_minutos: turno.duracion_minutos
        });
        setError('');
        setSuccess('');
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setError('');
        setSuccess('');
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTurno(null);
        setError('');
        setSuccess('');
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        
        // Actualizar formData primero
        const updatedFormData = {
            ...formData,
            [name]: name === 'duracion_minutos' ? parseInt(value) : value
        };
        
        setFormData(updatedFormData);

        // Si cambia la especialidad, cargar médicos con esa especialidad
        if (name === 'especialidad_id' && value) {
            try {
                const response = await axiosClient.get(`/medicos-especialidades/especialidad/${value}/medicos`);
                // La respuesta ya viene con los objetos médico completos
                setMedicosDisponibles(response.data);
                // Limpiar médico, fecha y hora seleccionados
                setFormData(prev => ({
                    ...prev,
                    medico_id: '',
                    fecha: '',
                    hora: ''
                }));
                setHorariosDisponibles([]);
            } catch (err) {
                console.error('Error al cargar médicos:', err);
                setMedicosDisponibles([]);
            }
            return;
        }

        // Si cambia el médico, la fecha o la duración, cargar horarios disponibles
        const medicoId = name === 'medico_id' ? value : updatedFormData.medico_id;
        const fecha = name === 'fecha' ? value : updatedFormData.fecha;
        const duracion = name === 'duracion_minutos' ? parseInt(value) : updatedFormData.duracion_minutos;
        
        if ((name === 'medico_id' || name === 'fecha' || name === 'duracion_minutos') && medicoId && fecha) {
            await cargarHorariosDisponibles(medicoId, fecha, duracion);
        }
    };

    const cargarHorariosDisponibles = async (medicoId, fecha, duracionMinutos = 30) => {
        setLoadingHorarios(true);
        console.log(`🔍 Cargando horarios para médico ${medicoId}, fecha ${fecha}, duración ${duracionMinutos} min`);
        try {
            const response = await axiosClient.get('/turnos/horarios-disponibles', {
                params: { 
                    medico_id: medicoId, 
                    fecha: fecha,
                    duracion_minutos: duracionMinutos
                }
            });
            console.log('📋 Horarios recibidos:', response.data);
            const disponibles = response.data.filter(h => h.disponible).length;
            const ocupados = response.data.filter(h => !h.disponible).length;
            console.log(`✅ ${disponibles} disponibles, ❌ ${ocupados} ocupados`);
            
            setHorariosDisponibles(response.data);
            
            // Si el horario seleccionado ya no está disponible, limpiarlo
            const horaActual = formData.hora;
            if (horaActual) {
                const horarioSeleccionado = response.data.find(h => h.hora === horaActual);
                if (horarioSeleccionado && !horarioSeleccionado.disponible) {
                    console.log(`⚠️ Horario ${horaActual} ya no disponible, limpiando selección`);
                    setFormData(prev => ({ ...prev, hora: '' }));
                }
            }
        } catch (err) {
            console.error('Error al cargar horarios:', err);
            setHorariosDisponibles([]);
        } finally {
            setLoadingHorarios(false);
        }
    };

    const getDetailedErrorMessage = (err) => {
        if (err.response?.data?.error) {
            const serverError = err.response.data.error;
            
            if (serverError.includes('ya tiene un turno')) {
                return `⚠️ Conflicto de horario: ${serverError}`;
            }
            if (serverError.includes('inexistente')) {
                return `❌ Dato no encontrado: ${serverError}`;
            }
            if (serverError.includes('no posee esa especialidad')) {
                return `❌ El médico seleccionado no tiene la especialidad "${especialidades.find(e => e.id_especialidad === parseInt(formData.especialidad_id))?.nombre || 'desconocida'}"`;
            }
            if (serverError.includes('duración')) {
                return `❌ Error en duración: La duración debe estar entre 15 y 480 minutos`;
            }
            
            return `❌ Error del servidor: ${serverError}`;
        }
        
        return `❌ ${err.message || 'Error desconocido al crear turno'}`;
    };

    const validateFormData = () => {
        if (!formData.paciente_id) {
            throw new Error('Debe seleccionar un paciente de la lista');
        }
        if (!formData.medico_id) {
            throw new Error('Debe seleccionar un médico de la lista');
        }
        if (!formData.especialidad_id) {
            throw new Error('Debe seleccionar una especialidad');
        }
        if (!formData.fecha) {
            throw new Error('La fecha es obligatoria. Selecciona una fecha válida');
        }
        if (!formData.hora) {
            throw new Error('La hora es obligatoria. Selecciona una hora válida (ej: 14:30)');
        }
        
        // Parsear la fecha usando componentes (evita problemas de zona horaria al usar new Date('YYYY-MM-DD'))
        const [year, month, day] = formData.fecha.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            throw new Error('No se pueden crear turnos en fechas pasadas. Selecciona una fecha futura');
        }

        // Si la fecha es hoy, validar que la hora seleccionada sea posterior al momento actual
        const now = new Date();
        const isToday = selectedDate.getFullYear() === now.getFullYear() &&
                        selectedDate.getMonth() === now.getMonth() &&
                        selectedDate.getDate() === now.getDate();

        if (isToday) {
            const [h, m] = formData.hora.split(':').map(Number);
            const selectedDateTime = new Date(year, month - 1, day, h, m);
            if (selectedDateTime <= now) {
                throw new Error('No se pueden crear turnos en horarios pasados. Selecciona una hora futura para hoy');
            }
        }
        // Validar rango horario permitido: entre 08:00 y 20:00 (el turno debe finalizar a las 20:00 o antes)
        const [horaNum, minNum] = formData.hora.split(':').map(Number);
        const inicioMinutos = horaNum * 60 + minNum;
        const finMinutos = inicioMinutos + (formData.duracion_minutos || 0);
        const MIN_PERMITIDO = 8 * 60; // 08:00
        const MAX_FIN_PERMITIDO = 20 * 60; // 20:00

        if (inicioMinutos < MIN_PERMITIDO || finMinutos > MAX_FIN_PERMITIDO) {
            throw new Error('Los turnos solo se pueden crear entre las 08:00 y las 20:00 (el turno debe finalizar antes o a las 20:00)');
        }

        if (formData.duracion_minutos < 15 || formData.duracion_minutos > 480) {
            throw new Error('La duración debe estar entre 15 minutos y 8 horas (480 minutos)');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            validateFormData();

            await crearTurno({
                paciente_id: parseInt(formData.paciente_id),
                medico_id: parseInt(formData.medico_id),
                especialidad_id: parseInt(formData.especialidad_id),
                fecha: formData.fecha,
                hora: formData.hora,
                duracion_minutos: formData.duracion_minutos,
                estado: 'pendiente'
            });

            setSuccess('✅ Turno creado correctamente');
            setTimeout(() => {
                handleCloseModal();
                cargarTurnos();
            }, 1500);
        } catch (err) {
            const detailedError = getDetailedErrorMessage(err);
            setError(detailedError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            validateFormData();

            await axiosClient.put(`/turnos/${editingTurno.id_turno}`, {
                paciente_id: parseInt(formData.paciente_id),
                medico_id: parseInt(formData.medico_id),
                especialidad_id: parseInt(formData.especialidad_id),
                fecha: formData.fecha,
                hora: formData.hora,
                duracion_minutos: formData.duracion_minutos
            });

            setSuccess('✅ Turno actualizado correctamente');
            setTimeout(() => {
                handleCloseEditModal();
                cargarTurnos();
            }, 1500);
        } catch (err) {
            const detailedError = getDetailedErrorMessage(err);
            setError(detailedError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            medico_id: '',
            especialidad_id: '',
            estado: '',
            fecha: ''
        });
    };

    const handleCambiarOrdenamiento = (campo) => {
        setOrdenamiento(prev => {
            const campoExistente = prev.campos.find(c => c.campo === campo);

            if (campoExistente) {
                return {
                    campos: prev.campos.map(c =>
                        c.campo === campo
                            ? { ...c, direccion: c.direccion === 'asc' ? 'desc' : 'asc' }
                            : c
                    )
                };
            } else {
                return {
                    campos: [...prev.campos, { campo, direccion: 'asc' }]
                };
            }
        });
    };

    const handleQuitarOrdenamiento = (campo) => {
        setOrdenamiento(prev => ({
            campos: prev.campos.filter(c => c.campo !== campo)
        }));
    };

    const handleCambiarEstado = async (turnoId, nuevoEstado) => {
        setEstadoChanging(turnoId);
        try {
            await cambiarEstadoTurno(turnoId, nuevoEstado);
            setSuccess('✅ Estado del turno actualizado correctamente');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            // Preferir mensaje específico del servidor (la hook lanza Error(serverMsg))
            const serverMsg = err?.message || err?.response?.data?.error || 'Error al cambiar el estado del turno';
            if (typeof showAlert === 'function') {
                showAlert(serverMsg, 'danger');
            } else {
                setError(`❌ ${serverMsg}`);
                setTimeout(() => setError(''), 3000);
            }
        } finally {
            setEstadoChanging(null);
        }
    };

    const procesarRecordatorios = async () => {
        setProcesandoRecordatorios(true);
        try {
            const response = await axiosClient.post('/recordatorios/procesar');
            const resultado = response.data.resultado;
            
            if (resultado.enviados > 0) {
                showAlert && showAlert(
                    `✅ ${resultado.enviados} recordatorios enviados exitosamente`,
                    'success'
                );
            } else if (resultado.procesados === 0) {
                showAlert && showAlert(
                    'ℹ️ No hay recordatorios pendientes para enviar',
                    'info'
                );
            } else {
                showAlert && showAlert(
                    `⚠️ ${resultado.procesados} recordatorios procesados, ${resultado.errores} errores`,
                    'warning'
                );
            }
            
        } catch (error) {
            console.error('Error procesando recordatorios:', error);
            showAlert && showAlert(
                'Error al procesar recordatorios: ' + (error.response?.data?.error || error.message),
                'danger'
            );
        } finally {
            setProcesandoRecordatorios(false);
        }
    };

    // Datos y cálculos
    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Loader /></div>;

    const turnosConDetalles = turnos.map(t => ({
        ...t,
        medico: medicos.find(m => m.id_medico === t.medico_id) || {},
        paciente: pacientes.find(p => p.id_paciente === t.paciente_id) || {},
        especialidad: especialidades.find(e => e.id_especialidad === t.especialidad_id) || {}
    }));

    const turnosFiltrados = turnosConDetalles.filter(t => {
        if (filtros.medico_id && t.medico_id !== parseInt(filtros.medico_id)) {
            return false;
        }
        if (filtros.especialidad_id && t.especialidad_id !== parseInt(filtros.especialidad_id)) {
            return false;
        }
        if (filtros.estado && t.estado !== filtros.estado) {
            return false;
        }
        if (filtros.fecha && t.fecha !== filtros.fecha) {
            return false;
        }
        return true;
    });

    const turnosOrdenados = [...turnosFiltrados].sort((a, b) => {
        for (let ord of ordenamiento.campos) {
            let valorA, valorB;

            if (ord.campo === 'fecha') {
                valorA = new Date(a.fecha);
                valorB = new Date(b.fecha);
            } else if (ord.campo === 'hora') {
                const [horaA, minA] = a.hora.split(':').map(Number);
                const [horaB, minB] = b.hora.split(':').map(Number);
                valorA = horaA * 60 + minA;
                valorB = horaB * 60 + minB;
            }

            let comparacion = 0;
            if (ord.direccion === 'asc') {
                comparacion = valorA - valorB;
            } else {
                comparacion = valorB - valorA;
            }

            if (comparacion !== 0) {
                return comparacion;
            }
        }
        return 0;
    });

    const actions = (row) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {row.estado !== 'cancelado' && row.estado !== 'completado' && (
                <>
                    <Button
                        onClick={() => handleCambiarEstado(row.id_turno, 'completado')}
                        disabled={estadoChanging === row.id_turno}
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: estadoChanging === row.id_turno ? 'not-allowed' : 'pointer',
                            opacity: estadoChanging === row.id_turno ? 0.6 : 1
                        }}
                    >
                        {estadoChanging === row.id_turno ? '...' : '✓'}
                    </Button>
                    <Button
                        onClick={() => handleCambiarEstado(row.id_turno, 'cancelado')}
                        disabled={estadoChanging === row.id_turno}
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: estadoChanging === row.id_turno ? 'not-allowed' : 'pointer',
                            opacity: estadoChanging === row.id_turno ? 0.6 : 1
                        }}
                    >
                        ✕
                    </Button>
                    <Button
                        onClick={() => handleOpenEditModal(row)}
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ✏️
                    </Button>
                </>
            )}
            {(row.estado === 'cancelado' || row.estado === 'completado') && (
                <span style={{ fontSize: '0.85rem', color: '#999' }}>No editable</span>
            )}
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Turnos</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Button 
                        variant="secondary"
                        onClick={procesarRecordatorios}
                        disabled={procesandoRecordatorios}
                        size="small"
                    >
                        {procesandoRecordatorios ? (
                            <>⏳ Enviando...</>
                        ) : (
                            <>📧 Enviar Recordatorios</>
                        )}
                    </Button>
                    <Button onClick={handleOpenModal} className="btn-primary">
                        + Nuevo Turno
                    </Button>
                </div>
            </div>

            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '20px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ marginBottom: '12px' }}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>Filtros</h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem', color: '#555' }}>
                            Fecha
                        </label>
                        <input
                            type="date"
                            name="fecha"
                            value={filtros.fecha}
                            onChange={handleFiltroChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem', color: '#555' }}>
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={filtros.estado}
                            onChange={handleFiltroChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                        >
                            <option value="">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="completado">Completado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem', color: '#555' }}>
                            Médico
                        </label>
                        <select
                            name="medico_id"
                            value={filtros.medico_id}
                            onChange={handleFiltroChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                        >
                            <option value="">Todos los médicos</option>
                            {medicos.map(m => (
                                <option key={m.id_medico} value={m.id_medico}>
                                    {m.nombre} {m.apellido}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '0.9rem', color: '#555' }}>
                            Especialidad
                        </label>
                        <select
                            name="especialidad_id"
                            value={filtros.especialidad_id}
                            onChange={handleFiltroChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.95rem' }}
                        >
                            <option value="">Todas las especialidades</option>
                            {especialidades.map(e => (
                                <option key={e.id_especialidad} value={e.id_especialidad}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            onClick={() => setFiltros(prev => ({ ...prev, fecha: new Date().toISOString().split('T')[0] }))}
                            style={{ 
                                fontSize: '0.85rem', 
                                padding: '6px 12px',
                                backgroundColor: filtros.fecha === new Date().toISOString().split('T')[0] ? '#007bff' : '#6c757d',
                                color: 'white'
                            }}
                        >
                            📅 Hoy
                        </Button>
                        <Button
                            onClick={() => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                setFiltros(prev => ({ ...prev, fecha: tomorrow.toISOString().split('T')[0] }));
                            }}
                            style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            className="btn-secondary"
                        >
                            Mañana
                        </Button>
                        <Button
                            onClick={() => {
                                const nextWeek = new Date();
                                nextWeek.setDate(nextWeek.getDate() + 7);
                                setFiltros(prev => ({ ...prev, fecha: nextWeek.toISOString().split('T')[0] }));
                            }}
                            style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                            className="btn-secondary"
                        >
                            Próxima Semana
                        </Button>
                    </div>
                    <Button
                        onClick={limpiarFiltros}
                        className="btn-secondary"
                        style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                    >
                        Limpiar Filtros
                    </Button>
                    <span style={{ color: '#666', fontSize: '0.9rem', alignSelf: 'center' }}>
                        {turnosFiltrados.length} turno{turnosFiltrados.length !== 1 ? 's' : ''} encontrado{turnosFiltrados.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <Table 
                data={turnosOrdenados} 
                columns={columns} 
                actions={actions}
                onSort={handleCambiarOrdenamiento}
                onRemoveSort={handleQuitarOrdenamiento}
                sortConfig={ordenamiento.campos}
            />

            <Modal id="modal-turno" isOpen={isModalOpen} onClose={handleCloseModal} title="Registrar Nuevo Turno" maxWidth="600px">
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <Form onSubmit={handleSubmit}>
                    <FormGroup label="Paciente">
                        <select
                            name="paciente_id"
                            value={formData.paciente_id}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">Selecciona un paciente</option>
                            {pacientes.map(p => (
                                <option key={p.id_paciente} value={p.id_paciente}>
                                    {p.nombre} {p.apellido}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup label="Especialidad">
                        <select
                            name="especialidad_id"
                            value={formData.especialidad_id}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">1. Primero selecciona una especialidad</option>
                            {especialidades.map(e => (
                                <option key={e.id_especialidad} value={e.id_especialidad}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup label="Médico">
                        <select
                            name="medico_id"
                            value={formData.medico_id}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.especialidad_id}
                            style={{ 
                                width: '100%', 
                                padding: '8px', 
                                borderRadius: '4px', 
                                border: '1px solid #ddd',
                                backgroundColor: !formData.especialidad_id ? '#f5f5f5' : 'white',
                                cursor: !formData.especialidad_id ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <option value="">
                                {!formData.especialidad_id 
                                    ? '2. Selecciona primero una especialidad' 
                                    : medicosDisponibles.length === 0 
                                    ? 'No hay médicos con esta especialidad' 
                                    : 'Selecciona un médico'}
                            </option>
                            {medicosDisponibles.map(m => (
                                <option key={m.id_medico} value={m.id_medico}>
                                    Dr./Dra. {m.nombre} {m.apellido}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormRow>
                        <FormGroup label="Fecha" style={{ flex: 1 }}>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                                required
                                disabled={!formData.medico_id}
                                min={new Date().toISOString().split('T')[0]}
                                style={{ 
                                    width: '100%', 
                                    padding: '8px', 
                                    borderRadius: '4px', 
                                    border: '1px solid #ddd',
                                    backgroundColor: !formData.medico_id ? '#f5f5f5' : 'white',
                                    cursor: !formData.medico_id ? 'not-allowed' : 'pointer'
                                }}
                            />
                        </FormGroup>

                        <FormGroup label="Duración" style={{ flex: 1 }}>
                            <select
                                name="duracion_minutos"
                                value={formData.duracion_minutos}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="30">30 minutos</option>
                                <option value="45">45 minutos</option>
                                <option value="60">1 hora</option>
                                <option value="90">1.5 horas</option>
                                <option value="120">2 horas</option>
                            </select>
                        </FormGroup>
                    </FormRow>

                    <FormGroup label="Horario">
                        {!formData.medico_id || !formData.fecha ? (
                            <div style={{ 
                                padding: '12px', 
                                backgroundColor: '#f8f9fa', 
                                border: '1px solid #dee2e6', 
                                borderRadius: '4px',
                                color: '#6c757d',
                                textAlign: 'center'
                            }}>
                                3. Selecciona médico y fecha para ver horarios disponibles
                            </div>
                        ) : loadingHorarios ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Loader />
                            </div>
                        ) : horariosDisponibles.length === 0 ? (
                            <div style={{ 
                                padding: '12px', 
                                backgroundColor: '#fff3cd', 
                                border: '1px solid #ffc107', 
                                borderRadius: '4px',
                                color: '#856404'
                            }}>
                                No hay horarios disponibles
                            </div>
                        ) : (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                                gap: '8px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}>
                                {horariosDisponibles.map(horario => (
                                    <button
                                        key={horario.hora}
                                        type="button"
                                        onClick={() => {
                                            if (horario.disponible) {
                                                setFormData(prev => ({ ...prev, hora: horario.hora }));
                                            }
                                        }}
                                        disabled={!horario.disponible}
                                        style={{
                                            padding: '10px',
                                            border: formData.hora === horario.hora ? '2px solid #007bff' : '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: !horario.disponible 
                                                ? '#dc3545' 
                                                : formData.hora === horario.hora 
                                                ? '#007bff' 
                                                : 'white',
                                            color: !horario.disponible || formData.hora === horario.hora ? 'white' : '#333',
                                            cursor: horario.disponible ? 'pointer' : 'not-allowed',
                                            fontSize: '0.9rem',
                                            fontWeight: formData.hora === horario.hora ? 'bold' : 'normal',
                                            transition: 'all 0.2s'
                                        }}
                                        title={!horario.disponible ? 'Horario ocupado' : 'Horario disponible'}
                                    >
                                        {horario.hora}
                                        {!horario.disponible && ' 🚫'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </FormGroup>

                    <FormActions style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <Button
                            type="button"
                            onClick={handleCloseModal}
                            className="btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Turno'}
                        </Button>
                    </FormActions>
                </Form>
            </Modal>

            <Modal id="modal-editar-turno" isOpen={isEditModalOpen} onClose={handleCloseEditModal} title="Editar Turno" maxWidth="600px">
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <Form onSubmit={handleEditSubmit}>
                    <FormRow>
                        <FormGroup label="Paciente" style={{ flex: 1 }}>
                            <select
                                name="paciente_id"
                                value={formData.paciente_id}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="">Selecciona un paciente</option>
                                {pacientes.map(p => (
                                    <option key={p.id_paciente} value={p.id_paciente}>
                                        {p.nombre} {p.apellido}
                                    </option>
                                ))}
                            </select>
                        </FormGroup>

                        <FormGroup label="Médico" style={{ flex: 1 }}>
                            <select
                                name="medico_id"
                                value={formData.medico_id}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="">Selecciona un médico</option>
                                {medicos.map(m => (
                                    <option key={m.id_medico} value={m.id_medico}>
                                        {m.nombre} {m.apellido}
                                    </option>
                                ))}
                            </select>
                        </FormGroup>
                    </FormRow>

                    <FormGroup label="Especialidad">
                        <select
                            name="especialidad_id"
                            value={formData.especialidad_id}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="">Selecciona una especialidad</option>
                            {especialidades.map(e => (
                                <option key={e.id_especialidad} value={e.id_especialidad}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormRow>
                        <FormGroup label="Fecha" style={{ flex: 1 }}>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </FormGroup>

                        <FormGroup label="Hora" style={{ flex: 1 }}>
                            <input
                                type="time"
                                name="hora"
                                value={formData.hora}
                                onChange={handleInputChange}
                                required
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup label="Duración (minutos)">
                        <input
                            type="number"
                            name="duracion_minutos"
                            value={formData.duracion_minutos}
                            onChange={handleInputChange}
                            required
                            min="15"
                            max="480"
                            step="15"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                            Mínimo 15 minutos, máximo 8 horas (480 minutos)
                        </small>
                    </FormGroup>

                    <FormActions>
                        <Button
                            type="button"
                            onClick={handleCloseEditModal}
                            className="btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Actualizando...' : 'Actualizar Turno'}
                        </Button>
                    </FormActions>
                </Form>
            </Modal>
        </div>
    );
}
