# 📖 EJEMPLOS DE USO - Turnero Médico

## 🚀 Iniciar la Aplicación

```bash
# Terminal 1
cd d:\Proyectos\TP_DAO_2025
python -m backend.app

# Terminal 2 (otra ventana)
cd d:\Proyectos\TP_DAO_2025
python serve_frontend.py

# Luego abre en el navegador
http://localhost:8000
```

---

## 👥 EJEMPLO 1: Crear un Paciente

### Paso 1: Ir a la sección Pacientes
- Click en el menú lateral: **"👥 Pacientes"**

### Paso 2: Abrir formulario de nuevo paciente
- Click en el botón azul: **"➕ Nuevo Paciente"**

### Paso 3: Completar el formulario
```
Nombre:     Juan
Apellido:   Pérez
DNI:        12345678
Email:      juan@example.com
Teléfono:   555-1234
```

### Paso 4: Guardar
- Click en el botón: **"Guardar"**

**Resultado**: Deberías ver una alerta verde: "Paciente creado correctamente"

---

## 👨‍⚕️ EJEMPLO 2: Crear un Médico

### Paso 1: Ir a la sección Médicos
- Click en el menú lateral: **"👨‍⚕️ Médicos"**

### Paso 2: Abrir formulario de nuevo médico
- Click en el botón azul: **"➕ Nuevo Médico"**

### Paso 3: Completar el formulario
```
Nombre:     María
Apellido:   González
DNI:        98765432
Matrícula:  MP-12345
Email:      maria@example.com
Teléfono:   555-5678
```

### Paso 4: Guardar
- Click en el botón: **"Guardar"**

**Resultado**: Deberías ver una alerta verde: "Médico creado correctamente"

---

## 🔬 EJEMPLO 3: Crear una Especialidad

### Paso 1: Ir a la sección Especialidades
- Click en el menú lateral: **"🔬 Especialidades"**

### Paso 2: Abrir formulario de nueva especialidad
- Click en el botón azul: **"➕ Nueva Especialidad"**

### Paso 3: Completar el formulario
```
Nombre:     Cardiología
```

### Paso 4: Guardar
- Click en el botón: **"Guardar"**

**Resultado**: Deberías ver una alerta verde: "Especialidad creada correctamente"

---

## 📅 EJEMPLO 4: Asignar un Turno

### Paso 1: Ir a la sección Turnos
- Click en el menú lateral: **"📅 Turnos"**

### Paso 2: Completar el formulario de turno
```
Paciente:      Juan Pérez        (del desplegable)
Médico:        María González    (del desplegable)
Especialidad:  Cardiología       (del desplegable)
Fecha:         2025-11-20        (elige fecha futura)
Hora:          14:30
```

### Paso 3: Asignar turno
- Click en el botón azul: **"Asignar Turno"**

**Resultado**: Deberías ver una alerta verde: "Turno asignado correctamente"

---

## ✏️ EJEMPLO 5: Editar un Paciente

### Paso 1: Ir a Pacientes
- Click en el menú: **"👥 Pacientes"**

### Paso 2: Encontrar el paciente en la tabla
- Busca "Juan Pérez" en la tabla

### Paso 3: Click en botón "Editar"
- Click en el botón verde: **"✏️ Editar"**

### Paso 4: Se abre el modal con los datos
- Modifica el teléfono: `555-9999`
- Click en: **"Guardar"**

**Resultado**: Los datos se actualizan en la tabla

---

## 🗑️ EJEMPLO 6: Eliminar un Médico

### Paso 1: Ir a Médicos
- Click en el menú: **"👨‍⚕️ Médicos"**

### Paso 2: Encontrar el médico en la tabla
- Busca "María González" en la tabla

### Paso 3: Click en botón "Eliminar"
- Click en el botón rojo: **"🗑️ Eliminar"**

### Paso 4: Confirmar eliminación
- Se muestra un cuadro de confirmación
- Click en: **"Aceptar"**

**Resultado**: El médico se elimina de la tabla y aparece alerta: "Médico eliminado correctamente"

---

## 📊 EJEMPLO 7: Ver el Dashboard

### Paso 1: Click en Dashboard
- Click en el menú: **"📊 Dashboard"**

### Paso 2: Ver estadísticas
Se muestran:
- **4 Cards** con números (pacientes, médicos, especialidades, historiales)
- **Tabla** con últimos 5 pacientes creados

**Resultado**: Vista general de la aplicación con datos en tiempo real

---

## 🔍 BÚSQUEDA POR TABLA

### Para encontrar datos
1. Todos los datos se listan en tablas
2. Puedes usar Ctrl+F para buscar en la página

**Nota**: En futuras versiones habrá búsqueda integrada en la aplicación

---

## 🎨 NAVEGACIÓN POR MENÚ

El menú lateral tiene 5 opciones:

```
📊 Dashboard         → Ver estadísticas generales
👥 Pacientes        → Gestionar pacientes (CRUD)
👨‍⚕️ Médicos          → Gestionar médicos (CRUD)
🔬 Especialidades   → Crear y ver especialidades
📅 Turnos           → Asignar nuevos turnos
```

**Nota**: El elemento activo se resalta en el menú

---

## 💬 MENSAJES Y ALERTAS

### Alertas de Éxito (Verde)
```
"Paciente creado correctamente"
"Paciente actualizado correctamente"
"Paciente eliminado correctamente"
```

### Alertas de Error (Rojo)
```
"Error: El DNI ya está registrado."
"Error: La matrícula ya está registrada."
"Error al conectar con el servidor"
```

### Alertas de Información (Azul)
```
"No hay datos disponibles"
```

---

## 🛑 CONFIRMACIONES

Antes de eliminar, la aplicación pregunta:

```
¿Está seguro que desea eliminar este paciente?
    [Cancelar]  [Aceptar]
```

**Importante**: Solo si haces click en "Aceptar" se elimina

---

## ⏱️ FECHA Y HORA

En la esquina superior derecha se muestra:

```
Viernes, 14 de noviembre de 2025, 20:50
```

Se actualiza automáticamente cada minuto

---

## 🔗 VALIDACIONES

### Validaciones en Formularios

**Paciente:**
- ✅ Nombre y Apellido requeridos
- ✅ DNI requerido y debe ser único
- ✅ Email debe ser válido y requerido
- ✅ Teléfono opcional

**Médico:**
- ✅ Nombre y Apellido requeridos
- ✅ Matrícula requerida y debe ser única
- ✅ DNI requerido y debe ser única
- ✅ Email debe ser válido y requerido
- ✅ Teléfono requerido

**Especialidad:**
- ✅ Nombre requerido y debe ser único

**Turno:**
- ✅ Paciente requerido
- ✅ Médico requerido
- ✅ Especialidad requerida
- ✅ Fecha requerida
- ✅ Hora requerida

---

## 🐛 SI ALGO NO FUNCIONA

### Verificar:
1. ¿Están corriendo ambos servidores? (backend + frontend)
2. ¿Tiene el puerto 8000 abierto?
3. ¿Tiene el puerto 5000 abierto?
4. Presiona F12 y revisa la consola por errores
5. Intenta actualizar la página (F5)

### Reiniciar:
```bash
# Cierra ambos servidores (Ctrl+C)
# Reabre:
python -m backend.app
python serve_frontend.py
```

---

## 📱 EN DISPOSITIVOS MÓVILES

La aplicación es completamente responsiva:

✅ Se adapta a pantallas pequeñas
✅ El menú se acomoda
✅ Las tablas son scrolleables
✅ Los botones son grandes para tocar
✅ Los formularios son fáciles de llenar

---

## 💾 DATOS PERSISTENTES

Los datos se guardan en:
```
backend/turnero.db
```

Pueden acceder directamente a la base de datos con:
```bash
sqlite3 backend/turnero.db
```

---

## 🔄 RECARGAR DATOS

Para ver cambios realizados en otra sesión:
1. Click en el menú nuevamente
2. O presiona F5 para recargar la página

Los datos siempre se traen del backend

---

## ✨ CONSEJOS

1. **Crear primero**: Especialidades → Médicos → Pacientes → Turnos
2. **Validar**: Si sale error, revisa que los datos sean únicos
3. **Confirmar**: Siempre confirma antes de eliminar
4. **Refreshear**: Si hay duda, F5 para refrescar
5. **Consola**: F12 > Console para ver si hay errores

---

## 📞 CONTACTO

Si tienes problemas o preguntas, revisa:
- GUIA_EJECUCION.md - Guía completa
- CHECKLIST.md - Lo que funciona
- Las documentaciones en carpeta frontend/ y backend/

---

**¡Feliz uso de Turnero Médico!** 🏥
