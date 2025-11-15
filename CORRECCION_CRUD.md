# Corrección de Errores CRUD - Turnero Médico

## Problemas Identificados y Resueltos

### 1. Stack Overflow en Confirmación de Eliminación
**Problema:** La función `confirm()` en `ui.js` estaba redefinida, sombreando (`shadowing`) la función global `window.confirm()`. Esto causaba una recursión infinita cuando se intentaba eliminar un registro.

**Error:** `RangeError: Maximum call stack size exceeded`

**Solución:** 
- ✅ Eliminada la función `confirm()` redefinida de `ui.js`
- ✅ Actualizado `eliminarPaciente()` para usar `window.confirm()` directamente
- ✅ Actualizado `eliminarMedico()` para usar `window.confirm()` directamente

**Archivos modificados:** `frontend/js/ui.js`, `frontend/js/app.js`

---

### 2. Violación de Restricción UNIQUE en Email
**Problema:** La restricción `UNIQUE` en la columna `email` de la tabla `pacientes` causaba error `400 Bad Request` cuando se intentaba actualizar un paciente, porque la lógica enviaba todos los campos incluyendo el email (que ya existía).

**Error:** `(sqlite3.IntegrityError) UNIQUE constraint failed: pacientes.email`

**Solución:**
- ✅ Refactorizado `guardarPaciente()` para detectar si está en modo edición o creación
- ✅ Backend ya usa correctamente PUT para actualizaciones (no mezcla POST/PUT)
- ✅ Frontend ahora envía correctamente a la ruta PUT en lugar de POST para ediciones

**Lógica:**
- Si `form.dataset.editingId` existe → usa `Pacientes.actualizar()` (PUT)
- Si no existe → usa `Pacientes.crear()` (POST)

---

### 3. Gestión Incorrecta del Estado del Formulario
**Problema:** Múltiples reassignments del event listener `form.onsubmit` causaban confusión entre modo crear vs editar. Los handlers se apilaban y el formulario podía quedar en estado inconsistente.

**Solución:**
- ✅ Eliminados los `form.onsubmit =` dinámicos
- ✅ Implementado un sistema de data-attributes para rastrear el estado
- ✅ El mismo event listener `guardarPaciente()` maneja ambos casos
- ✅ Al cerrar el modal, el estado se reinicia correctamente

**Código:**
```javascript
async function editarPaciente(id) {
    // ... cargar datos ...
    const form = document.getElementById('form-paciente');
    form.dataset.editingId = id;  // ← Marcar como edición
    openModal('modal-paciente');
}

async function guardarPaciente(e) {
    e.preventDefault();
    const form = document.getElementById('form-paciente');
    const editingId = form.dataset.editingId;
    
    if (editingId) {
        // ← Actualizar
        await Pacientes.actualizar(editingId, data);
        delete form.dataset.editingId;  // ← Limpiar estado
    } else {
        // ← Crear
        await Pacientes.crear(data);
    }
}
```

---

## Cambios en Detalle

### `frontend/js/ui.js`
```diff
- /**
-  * Mostrar confirmación
-  */
- function confirm(message) {
-     return window.confirm(message);
- }
```

### `frontend/js/app.js`

#### Función `guardarPaciente()`
- ✅ Ahora verifica `form.dataset.editingId` para decidir entre crear/actualizar
- ✅ Limpia el estado después de completar la operación
- ✅ Resetea el título del modal a "Nuevo Paciente"

#### Función `editarPaciente()`
- ✅ Solo carga datos y establece `form.dataset.editingId`
- ✅ No reassigna el event listener
- ✅ No genera ciclos de reassignment

#### Función `eliminarPaciente()`
- ✅ Usa `window.confirm()` en lugar de `confirm()`

#### Función `guardarMedico()` 
- ✅ Mismos cambios que `guardarPaciente()`

#### Función `editarMedico()`
- ✅ Mismos cambios que `editarPaciente()`

#### Función `eliminarMedico()`
- ✅ Usa `window.confirm()` directamente

---

## Pruebas Realizadas

✅ **Crear Paciente:** Funciona correctamente con POST
✅ **Editar Paciente:** Funciona correctamente con PUT sin violar restricción UNIQUE
✅ **Eliminar Paciente:** Diálogo de confirmación aparece sin stack overflow
✅ **Crear Médico:** Funciona correctamente
✅ **Editar Médico:** Funciona correctamente
✅ **Eliminar Médico:** Funciona sin errores

---

## Flujo Correcto Ahora

1. **Crear:** Click "Nuevo Paciente" → Form vacío → Submit → POST a /pacientes/ → Success
2. **Editar:** Click "Editar" → Form lleno + `editingId` set → Submit → PUT a /pacientes/{id} → Success
3. **Eliminar:** Click "Eliminar" → `window.confirm()` → Si OK → DELETE a /pacientes/{id} → Success

---

## Status Final

| Operación | Estado |
|-----------|--------|
| GET Todos | ✅ Funcional |
| GET Por ID | ✅ Funcional |
| CREATE (POST) | ✅ CORREGIDO |
| UPDATE (PUT) | ✅ CORREGIDO |
| DELETE | ✅ CORREGIDO |
| Confirmación | ✅ CORREGIDO |

**Fecha:** 14 de Noviembre de 2025
**Versión:** 1.0.1 - Bugs CRUD Fixes
