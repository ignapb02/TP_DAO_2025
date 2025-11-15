import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import Card, { CardHeader, CardBody } from '../components/Card';
import Table from '../components/Table';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { usePacientes } from '../hooks/usePacientes';
import { useMedicos } from '../hooks/useMedicos';
import { useEspecialidades } from '../hooks/useEspecialidades';
import { useHistoriales } from '../hooks/useHistoriales';

export default function Dashboard() {
    const { pacientes, loading: loadingPac } = usePacientes();
    const { medicos, loading: loadingMed } = useMedicos();
    const { especialidades, loading: loadingEsp } = useEspecialidades();
    const { historiales, loading: loadingHist } = useHistoriales();

    const loading = loadingPac || loadingMed || loadingEsp || loadingHist;

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

            {/* Últimos Pacientes */}
            <Card>
                <CardHeader>
                    <h3>Últimos Pacientes</h3>
                </CardHeader>
                <CardBody>
                    <Table
                        data={pacientes.slice(0, 5)}
                        columns={[
                            { key: 'nombre', label: 'Nombre' },
                            { key: 'apellido', label: 'Apellido' },
                            { key: 'dni', label: 'DNI' },
                            { key: 'email', label: 'Email' }
                        ]}
                    />
                </CardBody>
            </Card>
        </>
    );
}
