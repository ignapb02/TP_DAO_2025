import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Button from '../components/Button';
import Modal from '../components/Modal';

export default function PacienteDetallePage({ showAlert }) {
    const { id } = useParams();
    const [paciente, setPaciente] = useState(null);
    const [historiales, setHistoriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isRecetaModalOpen, setRecetaModalOpen] = useState(false);
    const [isVerRecetaOpen, setVerRecetaOpen] = useState(false);
    const [recetaForm, setRecetaForm] = useState({ medicamentos: '', indicaciones: '' });
    const [selectedHistorial, setSelectedHistorial] = useState(null);
    const [viewReceta, setViewReceta] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [pRes, hRes] = await Promise.all([
                    axiosClient.get(`/pacientes/${id}`),
                    axiosClient.get(`/historial/paciente/${id}`)
                ]);
                setPaciente(pRes.data);
                setHistoriales(hRes.data || []);
            } catch (e) {
                console.error(e);
                setError('No se pudo cargar la información del paciente.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const openRecetaModal = (historial) => {
        setSelectedHistorial(historial);
        setRecetaForm({ medicamentos: '', indicaciones: '' });
        setRecetaModalOpen(true);
    };

    const closeRecetaModal = () => {
        setRecetaModalOpen(false);
        setSelectedHistorial(null);
    };

    const submitReceta = async (e) => {
        e.preventDefault();
        if (!selectedHistorial) return;
        try {
            const payload = {
                id_historial: selectedHistorial.id_historial,
                medicamentos: recetaForm.medicamentos,
                indicaciones: recetaForm.indicaciones
            };
            const res = await axiosClient.post('/recetas/', payload);
            showAlert && showAlert('Receta emitida correctamente', 'success');
            // Refrescar historiales para reflejar receta_id
            const hRes = await axiosClient.get(`/historial/paciente/${id}`);
            setHistoriales(hRes.data || []);
            closeRecetaModal();
        } catch (e) {
            console.error(e);
            showAlert && showAlert('No se pudo emitir la receta', 'error');
        }
    };

    const openVerReceta = async (historial) => {
        try {
            if (!historial.receta_id) return;
            const res = await axiosClient.get(`/recetas/${historial.receta_id}`);
            setViewReceta(res.data);
            setVerRecetaOpen(true);
        } catch (e) {
            console.error(e);
            showAlert && showAlert('No se pudo obtener la receta', 'error');
        }
    };

    const closeVerReceta = () => {
        setVerRecetaOpen(false);
        setViewReceta(null);
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
    }

    if (error) {
        return <div className="container mt-4"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div className="container mt-4">
            <h2 style={{ marginBottom: 8 }}>Detalle del Paciente</h2>
            {paciente && (
                <div className="card" style={{ marginBottom: 16 }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>{paciente.nombre} {paciente.apellido}</h3>
                                <p style={{ margin: '6px 0', color: '#666' }}>DNI: {paciente.dni} • Email: {paciente.email || '—'} • Tel: {paciente.telefono || '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section>
                <h3 style={{ margin: '12px 0' }}>Historial Clínico</h3>
                {(!historiales || historiales.length === 0) ? (
                    <p style={{ color: '#666' }}>No hay registros de historia clínica.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Médico</th>
                                    <th>Diagnóstico</th>
                                    <th>Tratamiento</th>
                                    <th>Observaciones</th>
                                    <th>Receta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historiales.map(h => (
                                    <tr key={h.id_historial}>
                                        <td>{h.fecha_atencion ? new Date(h.fecha_atencion).toLocaleString() : '—'}</td>
                                        <td>{h.medico_nombre ? `${h.medico_nombre} ${h.medico_apellido || ''}` : '—'}</td>
                                        <td>{h.diagnostico || '—'}</td>
                                        <td>{h.tratamiento || '—'}</td>
                                        <td>{h.observaciones || '—'}</td>
                                        <td>
                                            {h.receta_id ? (
                                                <Button size="small" variant="secondary" onClick={() => openVerReceta(h)}>Ver receta</Button>
                                            ) : (
                                                <Button size="small" onClick={() => openRecetaModal(h)}>Emitir receta</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <Modal id="emitir-receta" isOpen={isRecetaModalOpen} onClose={closeRecetaModal} title="Emitir receta" maxWidth="600px">
                <form onSubmit={submitReceta}>
                    <div className="form-group">
                        <label>Medicamentos</label>
                        <textarea
                            value={recetaForm.medicamentos}
                            onChange={(e) => setRecetaForm({ ...recetaForm, medicamentos: e.target.value })}
                            rows={5}
                            placeholder="Nombre del medicamento, dosis, frecuencia..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Indicaciones</label>
                        <textarea
                            value={recetaForm.indicaciones}
                            onChange={(e) => setRecetaForm({ ...recetaForm, indicaciones: e.target.value })}
                            rows={4}
                            placeholder="Recomendaciones adicionales, duración del tratamiento..."
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button type="button" variant="secondary" onClick={closeRecetaModal}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Modal>

            <Modal id="ver-receta" isOpen={isVerRecetaOpen} onClose={closeVerReceta} title="Receta" maxWidth="600px">
                {viewReceta ? (
                    <div>
                        <p><strong>Fecha de emisión:</strong> {viewReceta.fecha_emision ? new Date(viewReceta.fecha_emision).toLocaleString() : '—'}</p>
                        <div className="form-group">
                            <label>Medicamentos</label>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>{viewReceta.medicamentos || '—'}</pre>
                        </div>
                        <div className="form-group">
                            <label>Indicaciones</label>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>{viewReceta.indicaciones || '—'}</pre>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={closeVerReceta}>Cerrar</Button>
                        </div>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </Modal>
        </div>
    );
}
