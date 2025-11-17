import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import Form, { FormGroup } from '../components/Form';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const resultado = await login(email, password);
        
        setLoading(false);

        if (resultado.success) {
            // Redirigir según el rol
            if (resultado.usuario.rol === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/mis-turnos');
            }
        } else {
            setError(resultado.error);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <Card style={{ maxWidth: '400px', width: '100%' }}>
                <CardHeader>
                    <h2 style={{ textAlign: 'center', margin: 0 }}>Sistema Médico</h2>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ 
                                padding: '12px', 
                                backgroundColor: '#fee', 
                                color: '#c00',
                                borderRadius: '4px',
                                marginBottom: '16px',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}
                        
                        <FormGroup label="Email">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                autoFocus
                            />
                        </FormGroup>

                        <FormGroup label="Contraseña">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </FormGroup>

                        <Button 
                            type="submit" 
                            variant="primary" 
                            style={{ width: '100%', marginTop: '16px' }}
                            disabled={loading}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}
