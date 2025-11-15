// ===========================
// FUNCIONES DE INTERFAZ DE USUARIO
// ===========================

/**
 * Mostrar alerta
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.querySelector('.alert-container') || (() => {
        const container = document.createElement('div');
        container.className = 'alert-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '3000';
        document.body.appendChild(container);
        return container;
    })();

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">×</button>
    `;

    alertContainer.appendChild(alert);

    if (duration) {
        setTimeout(() => alert.remove(), duration);
    }
}

/**
 * Abrir modal
 */
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

/**
 * Cerrar modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

/**
 * Cerrar todos los modales al hacer clic fuera
 */
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

/**
 * Actualizar la fecha y hora actual
 */
function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    if (dateElement) {
        dateElement.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
}

// Actualizar cada minuto
setInterval(updateDateTime, 60000);
updateDateTime();

/**
 * Cargar datos en un select
 */
async function loadSelectOptions(selectId, dataPromise, valueKey, labelKey) {
    try {
        const select = document.getElementById(selectId);
        if (!select) return;

        const data = await dataPromise;
        select.innerHTML = '<option value="">-- Seleccionar --</option>';

        (Array.isArray(data) ? data : [data]).forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = item[labelKey];
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando opciones:', error);
        showAlert('Error al cargar opciones', 'danger');
    }
}

/**
 * Crear tabla HTML desde datos
 */
function createTable(data, columns, actionsCallback) {
    if (!data || data.length === 0) {
        return '<p style="text-align: center; color: #999; padding: 40px;">No hay datos disponibles</p>';
    }

    let html = '<table><thead><tr>';

    // Encabezados
    columns.forEach(col => {
        html += `<th>${col.label}</th>`;
    });

    if (actionsCallback) {
        html += '<th style="width: 150px;">Acciones</th>';
    }

    html += '</tr></thead><tbody>';

    // Filas
    data.forEach((row, index) => {
        html += '<tr>';
        columns.forEach(col => {
            const value = col.format ? col.format(row) : row[col.key];
            html += `<td>${value}</td>`;
        });

        if (actionsCallback) {
            html += `<td><div class="table-actions">${actionsCallback(row, index)}</div></td>`;
        }

        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

/**
 * Limpiar formulario
 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Obtener datos del formulario
 */
function getFormData(formId) {
    const form = document.getElementById(formId);
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
