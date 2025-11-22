import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import axiosClient from '../api/axiosClient';
import { usePacientes } from '../hooks/usePacientes';
import { useMedicos } from '../hooks/useMedicos';
import { useEspecialidades } from '../hooks/useEspecialidades';
import { useHistoriales } from '../hooks/useHistoriales';

export default function Dashboard({ showAlert }) {
    const { pacientes, loading: loadingPac } = usePacientes();
    const { medicos, loading: loadingMed } = useMedicos();
    const { especialidades, loading: loadingEsp } = useEspecialidades();
    const { historiales, loading: loadingHist } = useHistoriales();
    
    const [procesandoRecordatorios, setProcesandoRecordatorios] = useState(false);
    const [turnosHoy, setTurnosHoy] = useState([]);
    const [loadingTurnos, setLoadingTurnos] = useState(true);

    const loading = loadingPac || loadingMed || loadingEsp || loadingHist;

    useEffect(() => {
        const fetchTurnosHoy = async () => {
            try {
                setLoadingTurnos(true);
                const response = await axiosClient.get('/turnos/hoy/pendientes');
                setTurnosHoy(response.data);
            } catch (error) {
                console.error('Error al cargar turnos de hoy:', error);
            } finally {
                setLoadingTurnos(false);
            }
        };

        fetchTurnosHoy();
    }, []);

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
            
            console.log('Resultado procesamiento recordatorios:', resultado);
            
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

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader />
            </div>
        );
    }

    return (
        <>
            {/* Stat Cards */}
            <div className="dashboard-grid">
                <StatCard 
                    icon="👥" 
                    number={pacientes.length} 
                    label="Pacientes"
                />
                <StatCard 
                    icon="🩺" 
                    number={medicos.length} 
                    label="Médicos"
                />
                <StatCard 
                    icon="📚" 
                    number={especialidades.length} 
                    label="Especialidades"
                />
                <StatCard 
                    icon="📁" 
                    number={historiales.length} 
                    label="Historiales"
                />
            </div>

            {/* Herramientas Administrativas */}
            <Card>
                <CardHeader>
                    <h3>Herramientas Administrativas</h3>
                </CardHeader>
                <CardBody>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button 
                            variant="primary" 
                            onClick={procesarRecordatorios}
                            disabled={procesandoRecordatorios}
                        >
                            {procesandoRecordatorios ? (
                                <>
                                    <span style={{ marginRight: 8 }}>⏳</span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <span style={{ marginRight: 8 }}>📧</span>
                                    Enviar Recordatorios
                                </>
                            )}
                        </Button>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                            Procesa y envía recordatorios de turnos pendientes
                        </span>
                    </div>
                </CardBody>
            </Card>

            {/* Turnos Pendientes Hoy */}
            <Card>
                <CardHeader>
                    <h3>📅 Turnos Pendientes Hoy</h3>
                </CardHeader>
                <CardBody>
                    {loadingTurnos ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Loader />
                        </div>
                    ) : turnosHoy.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            No hay turnos pendientes para hoy
                        </div>
                    ) : (
                        <Table
                            data={turnosHoy}
                            columns={[
                                { 
                                    key: 'hora', 
                                    label: 'Hora',
                                    render: (turno) => (
                                        <span style={{ fontWeight: 'bold' }}>
                                            {turno.hora}
                                        </span>
                                    )
                                },
                                { 
                                    key: 'paciente', 
                                    label: 'Paciente',
                                    render: (turno) => (
                                        `${turno.paciente_nombre || ''} ${turno.paciente_apellido || ''}`
                                    )
                                },
                                { 
                                    key: 'medico', 
                                    label: 'Médico',
                                    render: (turno) => (
                                        `Dr./Dra. ${turno.medico_nombre || ''} ${turno.medico_apellido || ''}`
                                    )
                                },
                                { 
                                    key: 'especialidad', 
                                    label: 'Especialidad',
                                    render: (turno) => turno.especialidad_nombre || 'N/A'
                                },
                                { 
                                    key: 'duracion_minutos', 
                                    label: 'Duración',
                                    render: (turno) => `${turno.duracion_minutos} min`
                                }
                            ]}
                        />
                    )}
                </CardBody>
            </Card>
        </>
    );
}
