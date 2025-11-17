import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form, { FormGroup, FormActions } from '../components/Form';
import Loader from '../components/Loader';
import axiosClient from '../api/axiosClient';

export default function MisTurnosPage({ showAlert }) {
    const { usuario } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
    });

    const cargarTurnos = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`/turnos/medico/${usuario.id_medico}`);
            // Filtrar solo pendientes
            const pendientes = res.data.filter(t => t.estado === 'pendiente');
            setTurnos(pendientes);
        } catch (err) {
            showAlert('Error al cargar turnos', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (usuario) {
            cargarTurnos();
        }
    }, [usuario]);

    const handleOpenModal = (turno) => {
        setTurnoSeleccionado(turno);
        setFormData({
            diagnostico: '',
            tratamiento: '',
            observaciones: ''
        });
        setModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.diagnostico || !formData.tratamiento) {
            showAlert('Diagnóstico y tratamiento son requeridos', 'danger');
            return;
        }

        try {
            await axiosClient.post(`/turnos/${turnoSeleccionado.id_turno}/atender`, formData);
            showAlert('Turno atendido correctamente', 'success');
            setModalOpen(false);
            cargarTurnos();
        } catch (err) {
            const msg = err?.response?.data?.error || 'Error al atender turno';
            showAlert(msg, 'danger');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader />
            </div>
        );
    }

    const columns = [
        { 
            key: 'fecha', 
            label: 'Fecha',
            render: (row) => new Date(row.fecha).toLocaleDateString('es-AR')
        },
        { key: 'hora', label: 'Hora' },
        { 
            key: 'paciente', 
            label: 'Paciente',
            render: (row) => `${row.paciente_nombre} ${row.paciente_apellido}`
        },
        { key: 'especialidad_nombre', label: 'Especialidad' },
        { 
            key: 'duracion_minutos', 
            label: 'Duración',
            render: (row) => `${row.duracion_minutos} min`
        }
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <h3>Mis Turnos Pendientes</h3>
                </CardHeader>
                <CardBody>
                    {turnos.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                            No tienes turnos pendientes
                        </p>
                    ) : (
                        <Table
                            data={turnos}
                            columns={columns}
                            actions={(row) => (
                                <Button 
                                    variant="primary" 
                                    size="small"
                                    onClick={() => handleOpenModal(row)}
                                >
                                    📋 Atender
                                </Button>
                            )}
                        />
                    )}
                </CardBody>
            </Card>

            <Modal
                id="modal-atender"
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Atender Turno"
            >
                {turnoSeleccionado && (
                    <>
                        <div style={{ 
                            padding: '12px', 
                            backgroundColor: '#f0f8ff', 
                            borderRadius: '4px',
                            marginBottom: '16px'
                        }}>
                            <p style={{ margin: '4px 0' }}>
                                <strong>Paciente:</strong> {turnoSeleccionado.paciente_nombre} {turnoSeleccionado.paciente_apellido}
                            </p>
                            <p style={{ margin: '4px 0' }}>
                                <strong>Fecha:</strong> {new Date(turnoSeleccionado.fecha).toLocaleDateString('es-AR')} - {turnoSeleccionado.hora}
                            </p>
                            <p style={{ margin: '4px 0' }}>
                                <strong>Especialidad:</strong> {turnoSeleccionado.especialidad_nombre}
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <FormGroup label="Diagnóstico *">
                                <textarea
                                    name="diagnostico"
                                    value={formData.diagnostico}
                                    onChange={handleInputChange}
                                    rows={3}
                                    required
                                    placeholder="Descripción del diagnóstico"
                                />
                            </FormGroup>

                            <FormGroup label="Tratamiento *">
                                <textarea
                                    name="tratamiento"
                                    value={formData.tratamiento}
                                    onChange={handleInputChange}
                                    rows={3}
                                    required
                                    placeholder="Tratamiento indicado"
                                />
                            </FormGroup>

                            <FormGroup label="Observaciones">
                                <textarea
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="Observaciones adicionales (opcional)"
                                />
                            </FormGroup>

                            <FormActions>
                                <Button 
                                    variant="secondary" 
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit">
                                    Guardar y Completar
                                </Button>
                            </FormActions>
                        </Form>
                    </>
                )}
            </Modal>
        </>
    );
}
