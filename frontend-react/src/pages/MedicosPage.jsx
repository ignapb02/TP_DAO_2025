import { useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Form, { FormGroup, FormRow, FormActions } from '../components/Form';
import Loader from '../components/Loader';
import { useMedicos } from '../hooks/useMedicos';
import { useEspecialidades } from '../hooks/useEspecialidades';
import axiosClient from '../api/axiosClient';

export default function MedicosPage({ showAlert }) {
    const { medicos, loading, error, cargarMedicos, crearMedico, actualizarMedico, eliminarMedico } = useMedicos();
    const { especialidades } = useEspecialidades();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        matricula: '',
        dni: '',
        email: '',
        telefono: '',
        password: '',
        especialidades_ids: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEspecialidadesChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({
            ...prev,
            especialidades_ids: selectedOptions
        }));
    };

    const handleOpenModal = async (medico = null) => {
        if (medico) {
            setEditingId(medico.id_medico);
            // Cargar especialidades actuales del médico
            let especialidadesActuales = [];
            try {
                const res = await axiosClient.get(`/medicos-especialidades/medico/${medico.id_medico}`);
                especialidadesActuales = res.data.map(e => e.especialidad_id);
            } catch (err) {
                console.error('Error al cargar especialidades del médico:', err);
            }
            setFormData({
                nombre: medico.nombre,
                apellido: medico.apellido,
                matricula: medico.matricula,
                dni: medico.dni,
                email: medico.email,
                telefono: medico.telefono || '',
                password: '',  // No pre-llenar password al editar
                especialidades_ids: especialidadesActuales
            });
        } else {
            setEditingId(null);
            setFormData({
                nombre: '',
                apellido: '',
                matricula: '',
                dni: '',
                email: '',
                telefono: '',
                password: '',
                especialidades_ids: []
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { especialidades_ids, ...medicoData } = formData;
            // Agregar rol 'medico' por defecto
            medicoData.rol = 'medico';
            let medicoId = editingId;

            if (editingId) {
                await actualizarMedico(editingId, medicoData);
            } else {
                const nuevoMedico = await crearMedico(medicoData);
                medicoId = nuevoMedico.id_medico;
            }

            // Gestionar especialidades
            if (medicoId && especialidades_ids) {
                // Obtener especialidades actuales
                let especialidadesActuales = [];
                try {
                    const res = await axiosClient.get(`/medicos-especialidades/medico/${medicoId}`);
                    especialidadesActuales = res.data.map(e => e.especialidad_id);
                } catch (err) {
                    // Si no hay especialidades, continuar
                }

                // Determinar cuáles agregar y cuáles eliminar
                const agregar = especialidades_ids.filter(id => !especialidadesActuales.includes(id));
                const eliminar = especialidadesActuales.filter(id => !especialidades_ids.includes(id));

                // Agregar nuevas especialidades
                for (const espId of agregar) {
                    await axiosClient.post('/medicos-especialidades/', {
                        medico_id: medicoId,
                        especialidad_id: espId,
                        principal: false
                    });
                }

                // Eliminar especialidades no seleccionadas
                for (const espId of eliminar) {
                    await axiosClient.delete(`/medicos-especialidades/${medicoId}/${espId}`);
                }
            }

            showAlert(`Médico ${editingId ? 'actualizado' : 'creado'} correctamente`, 'success');
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
        { key: 'telefono', label: 'Teléfono' },
        { 
            key: 'especialidades', 
            label: 'Especialidades',
            render: (row) => {
                if (!row.especialidades || row.especialidades.length === 0) {
                    return <span style={{ color: '#999' }}>—</span>;
                }
                return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {row.especialidades.map((esp, idx) => (
                            <span
                                key={idx}
                                style={{
                                    backgroundColor: '#e7f3ff',
                                    color: '#0066cc',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {esp}
                            </span>
                        ))}
                    </div>
                );
            }
        }
    ];

    const medicosSoloMedicos = medicos.filter(medico => medico.rol !== 'admin');

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
                        data={medicosSoloMedicos}
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
                    <FormRow>
                        <FormGroup label="Especialidades">
                            <select
                                multiple
                                value={formData.especialidades_ids.map(String)}
                                onChange={handleEspecialidadesChange}
                                style={{ minHeight: '120px' }}
                            >
                                {especialidades.map(esp => (
                                    <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                        {esp.nombre}
                                    </option>
                                ))}
                            </select>
                            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                                Mantén Ctrl (Cmd en Mac) para seleccionar múltiples
                            </small>
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                        <FormGroup label={`Contraseña ${editingId ? '(dejar vacío para no cambiar)' : '*'}`}>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required={!editingId}
                                placeholder="Contraseña de acceso"
                            />
                        </FormGroup>
                    </FormRow>
                    <FormActions>
                        <Button 
                            variant="secondary" 
                            type="button"
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
