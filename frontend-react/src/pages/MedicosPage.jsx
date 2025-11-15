import { useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form, { FormGroup, FormRow, FormActions } from '../components/Form';
import Loader from '../components/Loader';
import { useMedicos } from '../hooks/useMedicos';

export default function MedicosPage({ showAlert }) {
    const { medicos, loading, error, cargarMedicos, crearMedico, actualizarMedico, eliminarMedico } = useMedicos();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        matricula: '',
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

    const handleOpenModal = (medico = null) => {
        if (medico) {
            setEditingId(medico.id_medico);
            setFormData({
                nombre: medico.nombre,
                apellido: medico.apellido,
                matricula: medico.matricula,
                dni: medico.dni,
                email: medico.email,
                telefono: medico.telefono || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                nombre: '',
                apellido: '',
                matricula: '',
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
                await actualizarMedico(editingId, formData);
                showAlert('Médico actualizado correctamente', 'success');
            } else {
                await crearMedico(formData);
                showAlert('Médico creado correctamente', 'success');
            }
            setModalOpen(false);
            cargarMedicos();
        } catch (err) {
            showAlert(err.message || 'Error al guardar médico', 'danger');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro que desea eliminar este médico?')) return;
        try {
            await eliminarMedico(id);
            showAlert('Médico eliminado correctamente', 'success');
            cargarMedicos();
        } catch (err) {
            showAlert(err.message || 'Error al eliminar médico', 'danger');
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
        { key: 'matricula', label: 'Matrícula' },
        { key: 'dni', label: 'DNI' },
        { key: 'email', label: 'Email' },
        { key: 'telefono', label: 'Teléfono' }
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <h3>Médicos</h3>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        ➕ Nuevo Médico
                    </Button>
                </CardHeader>
                <CardBody>
                    <Table
                        data={medicos}
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
                                    onClick={() => handleDelete(row.id_medico)}
                                >
                                    🗑️ Eliminar
                                </Button>
                            </>
                        )}
                    />
                </CardBody>
            </Card>

            <Modal
                id="modal-medico"
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingId ? 'Editar Médico' : 'Nuevo Médico'}
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
                        <FormGroup label="Matrícula">
                            <input
                                type="text"
                                name="matricula"
                                value={formData.matricula}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup label="DNI">
                            <input
                                type="text"
                                name="dni"
                                value={formData.dni}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                        <FormGroup label="Email">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup label="Teléfono">
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </FormRow>
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
