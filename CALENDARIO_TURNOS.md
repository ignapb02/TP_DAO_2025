# Implementación: Calendario de Turnos Semanal

## Cambios Realizados

### 1. Agregado Campo de Duración a Turnos
**Problema:** Los turnos no tenían duración, hacía imposible validar superposiciones.

**Solución:**
- ✅ Agregado campo `duracion_minutos` al modelo `Turno` (default 30 minutos)
- ✅ Actualizado constructor del modelo
- ✅ Actualizado método `to_dict()` para incluir duración
- ✅ Actualizado repositorio para manejar duración en creación
- ✅ Actualizado controlador para recibir duración en request

**Archivos modificados:**
- `backend/models/turno.py`
- `backend/repositories/turno_repository.py`
- `backend/controllers/turno_controller.py`

---

### 2. Validación Mejorada de Superposiciones de Turnos
**Problema:** La validación solo checaba fecha y hora exacta, permitía turnos superpuestos.

**Solución:**
- ✅ Implementada función `convertir_hora_a_minutos()` para cálculos precisos
- ✅ Implementada función `validar_superposicion()` que:
  - Convierte horas a minutos para precisión
  - Calcula hora de fin = hora inicio + duración
  - Detecta cualquier solapamiento entre turnos
  - Proporciona mensajes claros con horarios de conflicto
- ✅ Validaciones de duración (mínimo 1 minuto, máximo 480 minutos/8 horas)
- ✅ Mensajes de error detallados indicando el conflicto

**Archivos modificados:**
- `backend/services/turno_service.py`

**Ejemplo de validación:**
```
Entrada: 15:00 a 15:30 (30 minutos)
Turno existente: 15:15 a 15:45 (30 minutos)
Resultado: ❌ Error - "Tu turno: 15:00-15:30. Turno existente: 15:15-15:45"
```

---

### 3. Calendario Semanal Visual
**Problema:** No había forma de ver todos los turnos de un médico en una vista clara.

**Solución:**
- ✅ Nueva página "Calendario de Turnos"
- ✅ Vista por semana (Lunes a Domingo)
- ✅ Selector de médico
- ✅ Grid de 7 días con turnos organizados
- ✅ Colores por estado del turno:
  - Naranja: Pendiente
  - Verde: Completado
  - Gris: Cancelado
- ✅ Información visible:
  - Hora de inicio y fin
  - Duración en minutos
  - Estado del turno

**Funcionalidades:**
- Cada día muestra:
  - Nombre del día
  - Fecha
  - Lista de turnos ordenados por hora
  - Mensaje "Sin turnos" si aplica
- Turnos clickeables para ver detalles completos

**Archivos modificados:**
- `frontend/js/app.js` - Nueva página y funciones de calendario
- `frontend/index.html` - Nuevo menú "Calendario"

---

### 4. Modal de Detalles del Turno
**Problema:** No había forma de ver detalles completos del turno.

**Solución:**
- ✅ Modal que muestra:
  - **Información del Turno:**
    - ID del turno
    - Estado (con color)
    - Fecha
    - Hora (inicio - fin)
    - Duración
  - **Información del Paciente:**
    - Nombre completo
    - DNI
    - Email
    - Teléfono
  - **Información del Médico:**
    - Nombre completo
    - Matrícula
    - Especialidad

---

### 5. Formulario de Turnos Mejorado
**Cambios:**
- ✅ Agregado campo "Duración" con opciones predefinidas:
  - 15 minutos
  - 30 minutos (default)
  - 45 minutos
  - 1 hora
  - 1.5 horas
  - 2 horas
- ✅ Renombrados nombres de campos (snake_case) para consistencia con API:
  - `id_paciente` → `paciente_id`
  - `id_medico` → `medico_id`
  - `id_especialidad` → `especialidad_id`
- ✅ Botón "Ver Calendario" para acceso rápido

**Archivos modificados:**
- `frontend/js/app.js`

---

### 6. Estilos CSS para Calendario
Agregados nuevos estilos:

```css
.calendario-semana {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.dia-semana {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.dia-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    font-weight: 600;
}

.turno-card {
    background: white;
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.turno-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

**Archivos modificados:**
- `frontend/css/styles.css`

---

## Nuevas Funciones Frontend

### `obtenerSemanaPrincipal()`
Retorna el lunes de la semana actual para calcular rango de calendario.

### `formatearFecha(date)`
Convierte Date a formato `YYYY-MM-DD`.

### `obtenerNombreDia(date)`
Retorna nombre del día de la semana (Lunes, Martes, etc).

### `cargarCalendarioMedico(medicoId)`
Carga y renderiza el calendario semanal de un médico.

### `calcularHoraFin(horaInicio, minutosAdicionados)`
Calcula hora de fin a partir de inicio + duración.

### `mostrarDetalleTurno(turnoId, pacienteId, medicoId, especialidadId)`
Abre modal con detalles completos del turno.

---

## Nuevas Funciones Backend

### `validar_superposicion(medico_id, fecha, hora_inicio, duracion_minutos, turno_id_excluir=None)`
Valida que no haya turnos superpuestos para un médico en una fecha y hora.

### `convertir_hora_a_minutos(hora_str)`
Convierte hora HH:MM a minutos desde las 00:00.

---

## Flujo de Uso

### Ver Calendario:
1. Click en "📆 Calendario" en el sidebar
2. Seleccionar un médico del dropdown
3. Se carga la vista semanal con sus turnos
4. Click en un turno para ver detalles completos

### Crear Turno:
1. Click en "📅 Turnos"
2. Llenar formulario:
   - Seleccionar paciente
   - Seleccionar médico
   - Seleccionar especialidad
   - Seleccionar fecha
   - Seleccionar hora
   - Seleccionar duración (default 30 min)
3. Click en "Asignar Turno"
4. Sistema valida:
   - Paciente existe
   - Médico existe
   - Médico tiene esa especialidad
   - **No hay superposiciones** (validación de duración)
5. Si todo es válido: ✅ Turno creado

### Validación de Superposiciones:
```
Ejemplo 1:
- Turno existente: 15:00-15:30 (30 min)
- Intenta crear: 15:00-15:30
- Resultado: ❌ CONFLICTO

Ejemplo 2:
- Turno existente: 15:00-15:30 (30 min)
- Intenta crear: 15:20-15:50 (30 min)
- Resultado: ❌ CONFLICTO (se superponen 10 min)

Ejemplo 3:
- Turno existente: 15:00-15:30 (30 min)
- Intenta crear: 15:30-16:00 (30 min)
- Resultado: ✅ OK (sin conflicto, son consecutivos)
```

---

## Cambios en Nombres de Campos

Para mantener consistencia con la API:

| Anterior | Nuevo |
|----------|-------|
| `id_paciente` | `paciente_id` |
| `id_medico` | `medico_id` |
| `id_especialidad` | `especialidad_id` |
| N/A | `duracion_minutos` |

---

## Estados de Turno

Los turnos tienen tres estados posibles:
- **pendiente** (naranja) - Turno agendado, no realizado
- **completado** (verde) - Turno realizado
- **cancelado** (gris) - Turno cancelado

Cada estado se visualiza con color diferente en el calendario.

---

## Validaciones

### Al Crear Turno:
- ✅ Paciente debe existir
- ✅ Médico debe existir
- ✅ Médico debe tener esa especialidad
- ✅ Duración debe ser entre 1 y 480 minutos
- ✅ No debe haber turnos superpuestos
- ✅ Si hay conflicto, muestra qué turnos se solapan

### Mensajes de Error:
- "El paciente no existe"
- "El médico no existe"
- "El médico no posee esa especialidad"
- "La duración debe ser un número positivo"
- "La duración no puede exceder 480 minutos (8 horas)"
- "El médico ya tiene un turno en este horario. Tu turno: 15:00-15:30. Turno existente: 15:15-15:45"

---

## Responsividad

El calendario es responsive:
- **Desktop:** Grid de 7 columnas (7 días)
- **Tablet:** Grid de 3-4 columnas
- **Mobile:** Grid de 1 columna (días stacked)

---

## Status Final

| Funcionalidad | Estado |
|---------------|--------|
| Duración de Turnos | ✅ Implementada |
| Validación de Superposiciones | ✅ Mejorada |
| Calendario Semanal | ✅ Funcional |
| Detalles de Turno | ✅ Modal completo |
| Selector de Médico | ✅ Funcional |
| Colores por Estado | ✅ Implementados |
| Responsividad | ✅ CSS Grid |
| Mensajes Amigables | ✅ Detallados |

---

**Fecha:** 14 de Noviembre de 2025
**Versión:** 1.2.0 - Calendario de Turnos Semanal
