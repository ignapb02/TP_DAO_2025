import { useEffect, useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import axiosClient from '../api/axiosClient';

export default function ReportesPage({ showAlert }) {
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [filters, setFilters] = useState({ medico_id: '', periodo: 'hoy', desde: '', hasta: '' });
    const [modoManual, setModoManual] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generandoPDF, setGenerandoPDF] = useState(false);

    const [turnosMedico, setTurnosMedico] = useState([]);
    const [turnosPorEsp, setTurnosPorEsp] = useState([]);
    const [pacientesAtendidos, setPacientesAtendidos] = useState({ total: 0, pacientes: [] });
    const [asistencia, setAsistencia] = useState({ asistencias: 0, inasistencias: 0, pendientes: 0, total: 0 });

    useEffect(() => {
        const loadBase = async () => {
            try {
                const [m, e] = await Promise.all([
                    axiosClient.get('/medicos/'),
                    axiosClient.get('/especialidades/')
                ]);
                setMedicos(m.data || []);
                setEspecialidades(e.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        loadBase();
    }, []);

    const calcularFechas = (periodo) => {
        const hoy = new Date();
        const hasta = hoy.toISOString().split('T')[0];
        let desde = '';

        switch (periodo) {
            case 'hoy':
                desde = hasta;
                break;
            case 'semana':
                const semanaAtras = new Date(hoy);
                semanaAtras.setDate(hoy.getDate() - 7);
                desde = semanaAtras.toISOString().split('T')[0];
                break;
            case 'mes':
                const mesAtras = new Date(hoy);
                mesAtras.setMonth(hoy.getMonth() - 1);
                desde = mesAtras.toISOString().split('T')[0];
                break;
            case '3meses':
                const tresMeses = new Date(hoy);
                tresMeses.setMonth(hoy.getMonth() - 3);
                desde = tresMeses.toISOString().split('T')[0];
                break;
            case '6meses':
                const seisMeses = new Date(hoy);
                seisMeses.setMonth(hoy.getMonth() - 6);
                desde = seisMeses.toISOString().split('T')[0];
                break;
            case 'año':
                const añoAtras = new Date(hoy);
                añoAtras.setFullYear(hoy.getFullYear() - 1);
                desde = añoAtras.toISOString().split('T')[0];
                break;
            default:
                desde = hasta;
        }

        return { desde, hasta };
    };

    const applyFilters = async () => {
        setLoading(true);
        try {
            // Usar fechas manuales si está en modo manual, sino calcular del período
            const { desde, hasta } = modoManual 
                ? { desde: filters.desde, hasta: filters.hasta }
                : calcularFechas(filters.periodo);
            
            const params = new URLSearchParams();
            if (desde) params.set('desde', desde);
            if (hasta) params.set('hasta', hasta);

            // Turnos por médico (si se selecciona)
            if (filters.medico_id) {
                const p = new URLSearchParams(params);
                p.set('medico_id', filters.medico_id);
                const tm = await axiosClient.get(`/reportes/turnos-por-medico?${p.toString()}`);
                setTurnosMedico(tm.data || []);
            } else {
                setTurnosMedico([]);
            }

            // Cantidad por especialidad
            const ce = await axiosClient.get(`/reportes/cantidad-turnos-por-especialidad?${params.toString()}`);
            setTurnosPorEsp(ce.data || []);

            // Pacientes atendidos
            const pa = await axiosClient.get(`/reportes/pacientes-atendidos?${params.toString()}`);
            setPacientesAtendidos(pa.data || { total: 0, pacientes: [] });

            // Asistencia vs inasistencia
            const as = await axiosClient.get(`/reportes/asistencia?${params.toString()}`);
            setAsistencia(as.data || { asistencias: 0, inasistencias: 0, pendientes: 0, total: 0 });

            showAlert && showAlert('Reportes actualizados', 'success', 2500);
        } catch (err) {
            console.error(err);
            showAlert && showAlert('Error obteniendo reportes', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const maxVal = Math.max(1, asistencia.asistencias, asistencia.inasistencias, asistencia.pendientes);

    const generarPDF = async () => {
        setGenerandoPDF(true);
        
        try {
            // Usar fechas manuales si está en modo manual, sino calcular del período
            const { desde, hasta } = modoManual 
                ? { desde: filters.desde, hasta: filters.hasta }
                : calcularFechas(filters.periodo);
            
            // Construir query params
            const params = new URLSearchParams();
            if (filters.medico_id) params.append('medico_id', filters.medico_id);
            if (desde) params.append('desde', desde);
            if (hasta) params.append('hasta', hasta);
            
            // Descargar PDF desde el backend
            const response = await axiosClient.get(`/reportes/pdf?${params.toString()}`, {
                responseType: 'blob'
            });
            
            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_turnos_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            showAlert && showAlert('PDF descargado exitosamente', 'success', 3000);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            showAlert && showAlert('Error al generar el PDF', 'error', 3000);
        } finally {
            setGenerandoPDF(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Reportes</h3>
                        <Button
                            onClick={generarPDF}
                            variant="primary"
                            disabled={generandoPDF || (!turnosMedico.length && !turnosPorEsp.length && !pacientesAtendidos.total)}
                        >
                            {generandoPDF ? '⏳ Generando...' : '📄 Descargar PDF'}
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <div style={{ marginBottom: 16 }}>
                        <Button 
                            variant={modoManual ? 'secondary' : 'primary'}
                            onClick={() => setModoManual(!modoManual)}
                            style={{ fontSize: '0.9rem', padding: '6px 12px' }}
                        >
                            {modoManual ? '📅 Usar períodos predefinidos' : '📆 Seleccionar fechas manualmente'}
                        </Button>
                    </div>

                    {!modoManual ? (
                        <div className="filters" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'end' }}>
                            <div className="form-group">
                                <label>Médico (opcional)</label>
                                <select
                                    value={filters.medico_id}
                                    onChange={(e) => setFilters(f => ({ ...f, medico_id: e.target.value }))}
                                >
                                    <option value="">-- Todos --</option>
                                    {medicos.map(m => (
                                        <option key={m.id_medico} value={m.id_medico}>{m.nombre} {m.apellido}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Período</label>
                                <select
                                    value={filters.periodo}
                                    onChange={(e) => setFilters(f => ({ ...f, periodo: e.target.value }))}
                                >
                                    <option value="hoy">Hoy</option>
                                    <option value="semana">Última semana</option>
                                    <option value="mes">Último mes</option>
                                    <option value="3meses">Últimos 3 meses</option>
                                    <option value="6meses">Últimos 6 meses</option>
                                    <option value="año">Último año</option>
                                </select>
                            </div>
                            <div>
                                <Button onClick={applyFilters}>Aplicar</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="filters" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, alignItems: 'end' }}>
                            <div className="form-group">
                                <label>Médico (opcional)</label>
                                <select
                                    value={filters.medico_id}
                                    onChange={(e) => setFilters(f => ({ ...f, medico_id: e.target.value }))}
                                >
                                    <option value="">-- Todos --</option>
                                    {medicos.map(m => (
                                        <option key={m.id_medico} value={m.id_medico}>{m.nombre} {m.apellido}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Desde</label>
                                <input 
                                    type="date" 
                                    value={filters.desde} 
                                    onChange={(e) => setFilters(f => ({ ...f, desde: e.target.value }))} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Hasta</label>
                                <input 
                                    type="date" 
                                    value={filters.hasta} 
                                    onChange={(e) => setFilters(f => ({ ...f, hasta: e.target.value }))} 
                                />
                            </div>
                            <div>
                                <Button onClick={applyFilters}>Aplicar</Button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div style={{ padding: 16 }}><Loader /></div>
                    )}

                    {/* Turnos por médico */}
                    <section style={{ marginTop: 20 }}>
                        <h4>Listado de turnos por médico{filters.medico_id ? '' : ' (selecciona un médico)'}</h4>
                        {filters.medico_id ? (
                            turnosMedico.length === 0 ? (
                                <p style={{ color: '#666' }}>Sin resultados para el período.</p>
                            ) : (
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Hora</th>
                                                <th>Paciente</th>
                                                <th>Especialidad</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {turnosMedico.map(t => (
                                                <tr key={t.id_turno}>
                                                    <td>{t.fecha}</td>
                                                    <td>{t.hora}</td>
                                                    <td>{t.paciente_nombre} {t.paciente_apellido}</td>
                                                    <td>{t.especialidad_nombre}</td>
                                                    <td>{t.estado}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        ) : (
                            <p style={{ color: '#666' }}>Selecciona un médico para ver el listado.</p>
                        )}
                    </section>

                    {/* Cantidad de turnos por especialidad */}
                    <section style={{ marginTop: 20 }}>
                        <h4>Cantidad de turnos por especialidad</h4>
                        {turnosPorEsp.length === 0 ? (
                            <p style={{ color: '#666' }}>Sin datos.</p>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Especialidad</th>
                                            <th>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {turnosPorEsp.map(r => (
                                            <tr key={r.especialidad_id}>
                                                <td>{r.especialidad_nombre}</td>
                                                <td>{r.cantidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Pacientes atendidos */}
                    <section style={{ marginTop: 20 }}>
                        <h4>Pacientes atendidos en el período</h4>
                        <p>Total: <strong>{pacientesAtendidos.total}</strong></p>
                        {pacientesAtendidos.pacientes.length > 0 && (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>DNI</th>
                                            <th>Email</th>
                                            <th>Teléfono</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pacientesAtendidos.pacientes.map(p => (
                                            <tr key={p.id_paciente}>
                                                <td>{p.nombre}</td>
                                                <td>{p.apellido}</td>
                                                <td>{p.dni}</td>
                                                <td>{p.email || '—'}</td>
                                                <td>{p.telefono || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Gráfico asistencia vs inasistencias */}
                    <section style={{ marginTop: 48 }}>
                        <h4 style={{ marginBottom: 32 }}>Asistencia vs. Inasistencias</h4>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 120, padding: '32px 12px 12px 12px', border: '1px solid #eee', borderRadius: 8, marginTop: 0 }}>
                            {[{label:'Asistencias', value: asistencia.asistencias, color:'#28a745'}, {label:'Inasistencias', value: asistencia.inasistencias, color:'#dc3545'}, {label:'Pendientes', value: asistencia.pendientes, color:'#6c757d'}].map((b) => (
                                <div key={b.label} style={{ textAlign: 'center', flex: 1 }}>
                                    <div style={{ background: b.color, width: '60%', margin: '0 auto', height: `${(b.value / maxVal) * 120}px`, transition: 'height .2s', borderRadius: 4 }} />
                                    <div style={{ marginTop: 8, fontWeight: 600 }}>{b.value}</div>
                                    <div style={{ color: '#555', fontSize: '0.9rem' }}>{b.label}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </CardBody>
            </Card>
        </>
    );
}
