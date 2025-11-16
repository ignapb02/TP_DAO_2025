/**
 * Formatea una fecha al formato español
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Formatea una fecha con hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha y hora formateadas
 */
export function formatDateTime(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Calcula la hora de fin sumando minutos a una hora inicial
 * @param {string} horaInicio - Hora en formato HH:MM
 * @param {number} minutos - Minutos a sumar
 * @returns {string} Hora de fin en formato HH:MM
 */
export function calcularHoraFin(horaInicio, minutos) {
    const [h, m] = horaInicio.split(':').map(Number);
    const total = h * 60 + m + minutos;
    const hf = Math.floor(total / 60);
    const mf = total % 60;
    return `${String(hf).padStart(2, '0')}:${String(mf).padStart(2, '0')}`;
}

/**
 * Obtiene datos de un formulario
 * @param {HTMLFormElement} form - Elemento del formulario
 * @returns {object} Datos del formulario
 */
export function getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        if (value === '') return;
        
        // Convertir a número si es posible
        if (!isNaN(value) && value !== '') {
            data[key] = parseInt(value);
        } else {
            data[key] = value;
        }
    });

    return data;
}

/**
 * Formatea un nombre completo
 * @param {string} nombre - Nombre
 * @param {string} apellido - Apellido
 * @returns {string} Nombre completo formateado
 */
export function formatNombreCompleto(nombre, apellido) {
    return `${apellido}, ${nombre}`;
}

/**
 * Obtiene nombre del día en español
 * @param {Date} date - Fecha
 * @returns {string} Nombre del día
 */
export function getNombreDia(date) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[date.getDay()];
}

/**
 * Obtiene nombre del mes en español
 * @param {number} mes - Número de mes (0-11)
 * @returns {string} Nombre del mes
 */
export function getNombreMes(mes) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mes];
}

/**
 * Formatea una fecha para usar en input type="date"
 * @param {Date|string} date - Fecha
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export function formatDateForInput(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Obtiene el lunes de la semana actual
 * @returns {Date} Lunes de la semana
 */
export function obtenerLunesActual() {
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const diferencia = hoy.getDate() - diaActual + 1;
    const lunes = new Date(hoy);
    lunes.setDate(diferencia);
    return lunes;
}

/**
 * Convierte un número a color de estado
 * @param {string} estado - Estado (pendiente, completado, cancelado, etc)
 * @returns {string} Color hex
 */
export function getColorEstado(estado) {
    const colores = {
        'pendiente': '#ff9500',
        'completado': '#28a745',
        'cancelado': '#6c757d',
        'en-espera': '#17a2b8'
    };
    return colores[estado] || '#6c757d';
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} Es válido
 */
export function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida un DNI
 * @param {string} dni - DNI a validar
 * @returns {boolean} Es válido
 */
export function validarDNI(dni) {
    return dni && dni.length >= 7 && dni.length <= 10;
}
