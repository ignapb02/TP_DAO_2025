// ===========================
// API BASE URL
// ===========================
const API_BASE_URL = 'http://localhost:5000';

// ===========================
// FUNCIONES AUXILIARES DE API
// ===========================

/**
 * Realiza una petición HTTP genérica
 * @param {string} method - GET, POST, PUT, DELETE
 * @param {string} endpoint - Ruta del endpoint
 * @param {object} data - Datos a enviar (solo para POST y PUT)
 */
async function apiCall(method, endpoint, data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            let errorMessage = `Error ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.error || errorMessage;
            } catch (e) {
                // Si no es JSON, usar el mensaje por defecto
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en ${method} ${endpoint}:`, error);
        throw error;
    }
}

// ===========================
// PACIENTES
// ===========================
const Pacientes = {
    obtenerTodos: () => apiCall('GET', '/pacientes/'),
    obtenerPorId: (id) => apiCall('GET', `/pacientes/${id}`),
    crear: (datos) => apiCall('POST', '/pacientes/', datos),
    actualizar: (id, datos) => apiCall('PUT', `/pacientes/${id}`, datos),
    eliminar: (id) => apiCall('DELETE', `/pacientes/${id}`)
};

// ===========================
// MÉDICOS
// ===========================
const Medicos = {
    obtenerTodos: () => apiCall('GET', '/medicos/'),
    obtenerPorId: (id) => apiCall('GET', `/medicos/${id}`),
    crear: (datos) => apiCall('POST', '/medicos/', datos),
    actualizar: (id, datos) => apiCall('PUT', `/medicos/${id}`, datos),
    eliminar: (id) => apiCall('DELETE', `/medicos/${id}`)
};
// Obtener médicos por especialidad
Medicos.obtenerPorEspecialidad = (especialidadId) => apiCall('GET', `/medicos-especialidades/especialidad/${especialidadId}/medicos`);

// ===========================
// ESPECIALIDADES
// ===========================
const Especialidades = {
    obtenerTodos: () => apiCall('GET', '/especialidades/'),
    obtenerPorId: (id) => apiCall('GET', `/especialidades/${id}`),
    crear: (datos) => apiCall('POST', '/especialidades/', datos)
};

// ===========================
// MÉDICOS-ESPECIALIDADES
// ===========================
const MedicosEspecialidades = {
    asignar: (datos) => apiCall('POST', '/medicos-especialidades/', datos),
    obtenerPorMedico: (medicoId) => apiCall('GET', `/medicos-especialidades/medico/${medicoId}`),
    eliminar: (medicoId, especialidadId) => apiCall('DELETE', `/medicos-especialidades/${medicoId}/${especialidadId}`)
};

// ===========================
// TURNOS
// ===========================
const Turnos = {
    obtenerTodos: () => apiCall('GET', '/turnos/'),
    crear: (datos) => apiCall('POST', '/turnos/', datos),
    cambiarEstado: (id, nuevoEstado) => apiCall('PUT', `/turnos/${id}/estado`, { estado: nuevoEstado }),
    obtenerPorMedico: (idMedico) => apiCall('GET', `/turnos/medico/${idMedico}`),
    obtenerPorPaciente: (idPaciente) => apiCall('GET', `/turnos/paciente/${idPaciente}`)
};

// ===========================
// HISTORIALES
// ===========================
const Historiales = {
    obtenerTodos: () => apiCall('GET', '/historial/'),
    obtenerPorPaciente: (idPaciente) => apiCall('GET', `/historial/paciente/${idPaciente}`)
};

// ===========================
// RECETAS
// ===========================
const Recetas = {
    obtenerTodas: () => apiCall('GET', '/recetas/'),
    obtenerPorId: (id) => apiCall('GET', `/recetas/${id}`),
    crear: (datos) => apiCall('POST', '/recetas/', datos)
};

// ===========================
// RECORDATORIOS
// ===========================
const Recordatorios = {
    obtenerTodos: () => apiCall('GET', '/recordatorios/'),
    obtenerPorId: (id) => apiCall('GET', `/recordatorios/${id}`),
    crear: (datos) => apiCall('POST', '/recordatorios/', datos)
};
