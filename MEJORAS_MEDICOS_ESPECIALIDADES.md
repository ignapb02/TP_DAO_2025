# Mejoras: Gestión de Especialidades y Mensajes de Error

## Cambios Realizados

### 1. Teléfono Opcional para Médicos
**Problema:** El teléfono era requerido y no había validación amigable al dejarlo vacío.

**Solución:**
- ✅ Hecho el campo `telefono` nullable en el modelo `Medico`
- ✅ Actualizado el constructor para aceptar teléfono como parámetro opcional
- ✅ Actualizado el formulario mostrando "(opcional)" junto a Teléfono
- ✅ Reordenados parámetros en `registrar_medico()` para mejor legibilidad

**Archivos modificados:**
- `backend/models/medico.py`
- `backend/repositories/medico_repository.py`
- `backend/controllers/medico_controller.py`
- `frontend/index.html` y `frontend/js/app.js`

---

### 2. Validaciones Mejoradas con Mensajes Amigables
**Problema:** Los mensajes de error técnicos no eran claros para el usuario.

**Solución:**
- ✅ Agregadas validaciones en `MedicoService` con mensajes en español
- ✅ Validaciones incluyen:
  - Nombre y apellido requeridos
  - Matrícula requerida
  - Email requerido y con formato válido
  - DNI requerido y solo números
  - Verificación de duplicados (matrícula, email, DNI)
- ✅ Separación entre errores de validación (ValueError) y errores del servidor (Exception)
- ✅ Diferentes códigos HTTP: 400 para errores de validación, 500 para errores del servidor

**Archivos modificados:**
- `backend/services/medico_service.py` - Completo reescrito con validaciones
- `backend/controllers/medico_controller.py` - Diferenciación de excepciones
- `frontend/js/api.js` - Mejor manejo de errores en JSON

---

### 3. Asignación de Especialidades a Médicos
**Problema:** No había forma de asignar especialidades a los médicos desde la interfaz.

**Solución:**
- ✅ Nuevo botón "🏥 Especialidades" en la tabla de médicos
- ✅ Modal específico para gestionar especialidades de un médico
- ✅ Opción para agregar y eliminar especialidades
- ✅ Vista clara de especialidades asignadas al médico

**Funcionalidades:**
- Listar especialidades disponibles en un select
- Seleccionar y asignar especialidades
- Ver lista de especialidades actuales del médico
- Eliminar especialidades con confirmación

**Archivos modificados:**
- `backend/controllers/medico_especialidad_controller.py` - Nuevos endpoints
- `backend/services/medico_especialidad_service.py` - Nuevos métodos
- `frontend/js/api.js` - Nuevos métodos de API
- `frontend/js/app.js` - Nuevas funciones para gestionar especialidades
- `frontend/css/styles.css` - Nuevo estilo para botón `.btn-info`

---

### 4. Nuevos Endpoints Backend

#### GET `/medicos-especialidades/medico/<int:medico_id>`
Obtiene todas las especialidades asignadas a un médico.

**Response:**
```json
[
  {
    "medico_id": 1,
    "especialidad_id": 2,
    "principal": false,
    "fecha_obtencion": null
  }
]
```

#### DELETE `/medicos-especialidades/<int:medico_id>/<int:especialidad_id>`
Elimina la asignación de una especialidad a un médico.

**Response:**
```json
{
  "msg": "Especialidad eliminada correctamente"
}
```

---

### 5. Funciones Frontend Nuevas

#### `abrirModalNuevoMedico()`
Abre el modal para crear un nuevo médico con el formulario limpio.

#### `abrirAsignarEspecialidad(medicoId, nombreMedico)`
Abre el modal de gestión de especialidades cargando:
- Lista de especialidades disponibles
- Especialidades actualmente asignadas al médico

#### `asignarEspecialidadAMedico()`
Asigna una especialidad seleccionada al médico actual.

#### `cargarEspecialidadesMedico(medicoId)`
Carga y muestra las especialidades del médico en una lista.

#### `eliminarEspecialidadMedico(medicoId, especialidadId)`
Elimina una especialidad de un médico con confirmación.

---

## Validaciones en MedicoService

### `validar_email(email)`
Valida que el email tenga un formato correcto usando regex.
- Patrón: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

### `validar_dni(dni)`
Valida que el DNI sea requerido y contenga solo números.

### `registrar_medico()`
Validaciones completas:
- Nombre no vacío
- Apellido no vacío
- Matrícula no vacía
- Email válido
- DNI válido
- Matrícula única
- Email único
- DNI único

### `actualizar_medico()`
Validaciones para edición:
- Médico existe
- Email único (excepto el mismo médico)
- DNI único (excepto el mismo médico)
- Matrícula única (excepto el mismo médico)

---

## Mensajes de Error Amigables

### Ejemplos de Mensajes:
- ❌ "El nombre del médico es requerido."
- ❌ "El formato del email no es válido."
- ❌ "El DNI debe contener solo números."
- ❌ "La matrícula ya está registrada."
- ❌ "El email ya está registrado por otro médico."
- ✅ "Médico creado"
- ✅ "Especialidad asignada correctamente"
- ✅ "Especialidad eliminada correctamente"

---

## Cambios en la Interfaz

### Tabla de Médicos
Antes:
- ✏️ Editar
- 🗑️ Eliminar

Ahora:
- 🏥 Especialidades (NUEVO)
- ✏️ Editar
- 🗑️ Eliminar

### Formulario de Médico
- Campo "Teléfono" ahora muestra "(opcional)"
- Mejor orden de campos (nombre, apellido, matrícula, DNI, email, teléfono)

### Modal de Especialidades
- Select con opciones de especialidades disponibles
- Botón para agregar especialidad
- Lista de especialidades actuales con botones para eliminar
- Confirmación al eliminar

---

## Estilos Nuevos

### `.btn-info`
```css
.btn-info {
    background-color: #17a2b8;
    color: white;
}

.btn-info:hover {
    background-color: #138496;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
}
```

---

## Status Final

| Característica | Estado |
|----------------|--------|
| Crear Médico sin teléfono | ✅ Funcional |
| Validación de Email | ✅ Implementada |
| Validación de DNI | ✅ Implementada |
| Mensajes de Error Amigables | ✅ Implementados |
| Asignar Especialidades | ✅ Funcional |
| Listar Especialidades del Médico | ✅ Funcional |
| Eliminar Especialidades | ✅ Funcional |
| Modal Especialidades | ✅ Creado |
| Estilos Botón Info | ✅ Aplicados |

---

## Cómo Usar

### Crear Médico sin Teléfono
1. Click en "➕ Nuevo Médico"
2. Llenar: Nombre, Apellido, Matrícula, DNI, Email
3. Dejar Teléfono vacío (es opcional)
4. Click en "Guardar"

### Asignar Especialidades a Médico
1. En la tabla de Médicos, click en "🏥 Especialidades"
2. Se abre modal con especialidades disponibles
3. Seleccionar especialidad del select
4. Click en "➕ Agregar"
5. La especialidad aparece en la lista

### Eliminar Especialidad del Médico
1. En la lista de especialidades asignadas
2. Click en "🗑️" del lado de la especialidad
3. Confirmar eliminación

---

**Fecha:** 14 de Noviembre de 2025
**Versión:** 1.1.0 - Mejoras en Médicos y Especialidades
