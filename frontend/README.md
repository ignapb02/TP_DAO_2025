# Turnero Médico - Frontend

Aplicación web para la gestión de turnos médicos, incluyendo ABM (Alta, Baja, Modificación) de pacientes, médicos, especialidades y asignación de turnos.

## 🚀 Características

- **Dashboard**: Vista general con estadísticas
- **Gestión de Pacientes**: CRUD completo
- **Gestión de Médicos**: CRUD completo
- **Gestión de Especialidades**: Crear y listar especialidades
- **Asignación de Turnos**: Sistema para asignar turnos a pacientes

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor backend Flask ejecutándose en `http://localhost:5000`
- CORS habilitado en el backend

## 🔧 Instalación y Uso

### 1. Asegúrate que el backend esté corriendo

```bash
cd backend
python -m backend.app
```

El backend debe estar ejecutándose en `http://localhost:5000`

### 2. Abre la aplicación frontend

Simplemente abre el archivo `index.html` en tu navegador:

```bash
# Opción 1: Doble clic en index.html
# Opción 2: Usar un servidor local (recomendado)
python -m http.server 8000
# Luego abre http://localhost:8000/frontend
```

## 📁 Estructura del Proyecto

```
frontend/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos CSS
├── js/
│   ├── app.js          # Lógica principal de la aplicación
│   ├── api.js          # Funciones para comunicarse con el backend
│   └── ui.js           # Funciones de interfaz de usuario
└── README.md           # Este archivo
```

## 🔌 API Endpoints

La aplicación se comunica con el backend a través de los siguientes endpoints:

### Pacientes
- `GET /pacientes/` - Obtener todos
- `GET /pacientes/<id>` - Obtener uno
- `POST /pacientes/` - Crear
- `PUT /pacientes/<id>` - Actualizar
- `DELETE /pacientes/<id>` - Eliminar

### Médicos
- `GET /medicos/` - Obtener todos
- `GET /medicos/<id>` - Obtener uno
- `POST /medicos/` - Crear
- `PUT /medicos/<id>` - Actualizar
- `DELETE /medicos/<id>` - Eliminar

### Especialidades
- `GET /especialidades/` - Obtener todas
- `POST /especialidades/` - Crear

### Turnos
- `POST /turnos/` - Crear turno
- `PUT /turnos/<id>/estado` - Cambiar estado

## 🎨 Tecnologías Utilizadas

- HTML5
- CSS3 (sin frameworks)
- JavaScript vanilla (ES6+)
- Fetch API para comunicación HTTP
- CORS para solicitudes cross-origin

## 📝 Notas

- La aplicación almacena datos en la base de datos SQLite del backend
- Los cambios se guardan inmediatamente al hacer clic en "Guardar"
- Se muestran alertas de confirmación para operaciones destructivas

## 🐛 Solución de Problemas

### "Error al conectar con el servidor"
- Verifica que el backend esté ejecutándose en `http://localhost:5000`
- Comprueba que CORS esté habilitado en Flask

### "Error CORS"
- Asegúrate de que `flask-cors` esté instalado
- Verifica que CORS esté inicializado correctamente en `backend/app.py`

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.
