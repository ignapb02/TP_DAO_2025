import { useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form, { FormGroup, FormActions } from '../components/Form';
import Loader from '../components/Loader';
import { useEspecialidades } from '../hooks/useEspecialidades';

export default function EspecialidadesPage({ showAlert }) {
    const { especialidades, loading, error, cargarEspecialidades, crearEspecialidad, actualizarEspecialidad, eliminarEspecialidad } = useEspecialidades();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [nombre, setNombre] = useState('');

    const handleOpenModal = (esp = null) => {
        if (esp) {
            setEditingId(esp.id_especialidad);
            setNombre(esp.nombre);
        } else {
            setEditingId(null);
            setNombre('');
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await actualizarEspecialidad(editingId, { nombre });
                showAlert('Especialidad actualizada correctamente', 'success');
            } else {
                await crearEspecialidad({ nombre });
                showAlert('Especialidad creada correctamente', 'success');
            }
            setModalOpen(false);
            cargarEspecialidades();
        } catch (err) {
            showAlert(err.message || 'Error al guardar especialidad', 'danger');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro que desea eliminar esta especialidad?')) return;
        try {
            await eliminarEspecialidad(id);
            showAlert('Especialidad eliminada correctamente', 'success');
            cargarEspecialidades();
        } catch (err) {
            showAlert(err.message || 'Error al eliminar especialidad', 'danger');
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Loader /></div>;
    if (error) return <div style={{ padding: 20 }}><p style={{ color: '#dc3545' }}>{error}</p></div>;

    const columns = [ { key: 'nombre', label: 'Nombre' } ];

    return (
        <>
            <Card>
                <CardHeader>
                    <h3>Especialidades</h3>
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        ➕ Nueva Especialidad
                    </Button>
                </CardHeader>
                <CardBody>
                    <Table
                        data={especialidades}
                        columns={columns}
                        actions={(row) => (
                            <>
                                <Button variant="secondary" size="small" onClick={() => handleOpenModal(row)}>✏️ Editar</Button>
                                <Button variant="danger" size="small" onClick={() => handleDelete(row.id_especialidad)}>🗑️ Eliminar</Button>
                            </>
                        )}
                    />
                </CardBody>
            </Card>

            <Modal id="modal-especialidad" isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Especialidad' : 'Nueva Especialidad'}>
                <Form onSubmit={handleSubmit}>
                    <FormGroup label="Nombre">
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </FormGroup>
                    <FormActions>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </FormActions>
                </Form>
            </Modal>
        </>
    );
}
