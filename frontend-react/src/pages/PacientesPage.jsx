import { useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form, { FormGroup, FormRow, FormActions } from '../components/Form';
import Loader from '../components/Loader';
import { usePacientes } from '../hooks/usePacientes';

export default function PacientesPage({ showAlert }) {
    const { pacientes, loading, error, cargarPacientes, crearPaciente, actualizarPaciente, eliminarPaciente } = usePacientes();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        telefono: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenModal = (paciente = null) => {
        if (paciente) {
            setEditingId(paciente.id_paciente);
            setFormData({
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                dni: paciente.dni,
                email: paciente.email,
                telefono: paciente.telefono || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                nombre: '',
                apellido: '',
                dni: '',
                email: '',
                telefono: ''
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await actualizarPaciente(editingId, formData);
                showAlert('Paciente actualizado correctamente', 'success');
            } else {
                await crearPaciente(formData);
                showAlert('Paciente creado correctamente', 'success');
            }
            setModalOpen(false);
            cargarPacientes();
        } catch (err) {
            showAlert(err.message || 'Error al guardar paciente', 'danger');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro que desea eliminar este paciente?')) return;
        try {
            await eliminarPaciente(id);
            showAlert('Paciente eliminado correctamente', 'success');
            cargarPacientes();
        } catch (err) {
            showAlert(err.message || 'Error al eliminar paciente', 'danger');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return <div style={{ padding: '20px' }}><p style={{ color: '#dc3545' }}>{error}</p></div>;
    }

    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellido', label: 'Apellido' },
        { key: 'dni', label: 'DNI' },
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' }
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <h3>Pacientes</h3>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        ➕ Nuevo Paciente
                    </Button>
                </CardHeader>
                <CardBody>
                    <Table
                        data={pacientes}
                        columns={columns}
                        actions={(row) => (
                            <>
                                <Button 
                                    variant="secondary" 
                                    size="small"
                                    onClick={() => handleOpenModal(row)}
                                >
                                    ✏️ Editar
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="small"
                                    onClick={() => handleDelete(row.id_paciente)}
                                >
                                    🗑️ Eliminar
                                </Button>
                            </>
                        )}
                    />
                </CardBody>
            </Card>

            <Modal
                id="modal-paciente"
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingId ? 'Editar Paciente' : 'Nuevo Paciente'}
            >
                <Form onSubmit={handleSubmit}>
                    <FormRow>
                        <FormGroup label="Nombre">
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup label="Apellido">
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                        <FormGroup label="DNI">
                            <input
                                type="text"
                                name="dni"
                                value={formData.dni}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup label="Email">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                    </FormRow>
                    <FormGroup label="Teléfono">
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                    <FormActions>
                        <Button 
                            variant="secondary" 
                            onClick={() => setModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </FormActions>
                </Form>
            </Modal>
        </>
    );
}
