import { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un usuario guardado en localStorage
        const usuarioGuardado = localStorage.getItem('usuario');
        const tokenGuardado = localStorage.getItem('token');
        
        if (usuarioGuardado && tokenGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axiosClient.post('/auth/login', { email, password });
            const { token, medico } = res.data;
            
            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(medico));
            
            setUsuario(medico);
            return { success: true, usuario: medico };
        } catch (err) {
            const msg = err?.response?.data?.error || 'Error al iniciar sesión';
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    const value = {
        usuario,
        login,
        logout,
        isAuthenticated: !!usuario,
        isAdmin: usuario?.rol === 'admin',
        isMedico: usuario?.rol === 'medico',
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}
