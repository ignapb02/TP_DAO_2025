# 🏥 Turnero Médico - Guía de Instalación y Ejecución

## ✅ Instalación Completada

Se ha desarrollado una **aplicación web completa** para la gestión de un Turnero Médico con:
- ✨ Dashboard con estadísticas
- 👥 ABM de Pacientes
- 👨‍⚕️ ABM de Médicos
- 🔬 ABM de Especialidades  
- 📅 Asignación de Turnos

## 🚀 Cómo Ejecutar la Aplicación

### Paso 1: Iniciar el Backend (Flask)

```bash
cd d:\Proyectos\TP_DAO_2025
python -m backend.app
```

El backend se ejecutará en `http://localhost:5000`

Deberías ver algo como:
```
✔ Base de datos inicializada correctamente.
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Paso 2: Iniciar el Frontend (en otra terminal)

```bash
cd d:\Proyectos\TP_DAO_2025
python serve_frontend.py
```

El frontend se abrirá automáticamente en `http://localhost:8000`

Si no se abre automáticamente, ingresa manualmente en tu navegador:
- 🌐 **http://localhost:8000**

## 📊 Funcionalidades Disponibles

### 1️⃣ Dashboard
- Vista general con estadísticas
- Cantidad de pacientes, médicos, especialidades
- Últimos pacientes registrados

### 2️⃣ Gestión de Pacientes
- ➕ Crear nuevo paciente
- 📋 Listar todos los pacientes
- ✏️ Editar información del paciente
- 🗑️ Eliminar paciente

**Campos requeridos:**
- Nombre
- Apellido
- DNI
- Email
- Teléfono (opcional)

### 3️⃣ Gestión de Médicos
- ➕ Crear nuevo médico
- 📋 Listar todos los médicos
- ✏️ Editar información del médico
- 🗑️ Eliminar médico

**Campos requeridos:**
- Nombre
- Apellido
- Matrícula (debe ser única)
- DNI
- Email
- Teléfono

### 4️⃣ Gestión de Especialidades
- ➕ Crear nueva especialidad
- 📋 Listar especialidades

**Campos requeridos:**
- Nombre (debe ser única)

### 5️⃣ Asignación de Turnos
- Seleccionar paciente
- Seleccionar médico
- Seleccionar especialidad
- Indicar fecha del turno
- Indicar hora del turno

## 🎨 Interfaz

- **Barra lateral de navegación** con acceso rápido a todas las secciones
- **Diseño responsivo** que se adapta a diferentes pantallas
- **Tablas interactivas** con acciones rápidas
- **Modales** para crear/editar registros
- **Alertas** de confirmación para operaciones destructivas
- **Notificaciones** de éxito/error en la esquina superior derecha

## 🔌 Endpoints de la API

Todos los endpoints están completamente implementados:

```
GET    /pacientes/              - Listar todos
GET    /pacientes/<id>          - Obtener uno
POST   /pacientes/              - Crear
PUT    /pacientes/<id>          - Actualizar
DELETE /pacientes/<id>          - Eliminar

GET    /medicos/                - Listar todos
GET    /medicos/<id>            - Obtener uno
POST   /medicos/                - Crear
PUT    /medicos/<id>            - Actualizar
DELETE /medicos/<id>            - Eliminar

GET    /especialidades/         - Listar todas
GET    /especialidades/<id>     - Obtener una
POST   /especialidades/         - Crear

GET    /turnos/medico/<id>      - Turnos de un médico
GET    /turnos/paciente/<id>    - Turnos de un paciente
POST   /turnos/                 - Crear turno
PUT    /turnos/<id>/estado      - Cambiar estado
```

## 📁 Estructura del Proyecto

```
TP_DAO_2025/
├── backend/                    # API Flask
│   ├── app.py                 # Aplicación principal
│   ├── config.py              # Configuración
│   ├── controllers/           # Rutas y endpoints
│   ├── services/              # Lógica de negocio
│   ├── models/                # Modelos de datos
│   ├── repositories/          # Acceso a base de datos
│   └── database/              # Configuración de BD
├── frontend/                   # Aplicación web
│   ├── index.html             # Página principal
│   ├── css/styles.css         # Estilos
│   ├── js/
│   │   ├── app.js            # Lógica principal
│   │   ├── api.js            # Llamadas a la API
│   │   └── ui.js             # Funciones de UI
│   └── README.md             # Documentación frontend
├── serve_frontend.py           # Servidor del frontend
└── requirements.txt            # Dependencias Python
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Flask, Flask-SQLAlchemy, Flask-CORS
- **Frontend**: HTML5, CSS3, JavaScript vanilla (ES6+)
- **Base de datos**: SQLite
- **Comunicación**: REST API con JSON

## ⚙️ Configuración

### Puertos
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:8000`

### Base de datos
- Archivo: `backend/turnero.db`
- Tipo: SQLite
- Se crea automáticamente en el primer inicio

## 🐛 Solución de Problemas

### "Error: El puerto 5000 ya está en uso"
```bash
# Windows: Encuentra el proceso
netstat -ano | findstr :5000

# Mata el proceso o usa otro puerto en config.py
```

### "Error: CORS bloqueado"
- El backend tiene CORS habilitado por defecto
- Verifica que `flask-cors` esté instalado

### "Error al conectar con el servidor"
- Verifica que el backend esté ejecutándose
- Comprueba que el frontend sea accesible en http://localhost:8000

### "Los estilos no se ven"
- Limpia la caché del navegador (Ctrl+Shift+Delete)
- Intenta en modo incógnito

## 📝 Ejemplos de Uso

### Crear un Paciente
1. Click en "Pacientes" en el menú
2. Click en "➕ Nuevo Paciente"
3. Completa los campos
4. Click en "Guardar"

### Asignar un Turno
1. Click en "Turnos" en el menú
2. Selecciona un paciente
3. Selecciona un médico
4. Selecciona la especialidad
5. Ingresa fecha y hora
6. Click en "Asignar Turno"

## 🔒 Seguridad

- Validaciones en frontend y backend
- Confirmación para eliminaciones
- Manejo de errores y excepciones
- CORS habilitado

## 📞 Soporte

Para reportar problemas o sugerencias, verifica:
1. Que ambos servidores estén ejecutándose
2. Que los puertos 5000 y 8000 sean accesibles
3. Que el navegador sea moderno (Chrome 90+, Firefox 88+, etc.)

## ✨ Próximas Mejoras Sugeridas

- [ ] Autenticación y autorización
- [ ] Búsqueda y filtrado avanzado
- [ ] Exportar datos a PDF/Excel
- [ ] Notificaciones por email
- [ ] Historial de cambios
- [ ] Calendario interactivo

---

**¡La aplicación está lista para usar!** 🚀
