# 🏥 Turnero Médico - Aplicación Web

Sistema completo de gestión de turnos médicos con Dashboard interactivo, ABM de pacientes, médicos, especialidades y asignación de turnos.

## 🚀 Inicio Rápido

### Opción 1: Ejecución Inmediata
```bash
# Terminal 1 - Backend
cd d:\Proyectos\TP_DAO_2025
python -m backend.app

# Terminal 2 - Frontend (otra ventana)
cd d:\Proyectos\TP_DAO_2025
python serve_frontend.py

# Abre en navegador: http://localhost:8000
```

### Opción 2: Con Entorno Virtual (Recomendado)
```bash
# Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar como Opción 1
python -m backend.app
python serve_frontend.py
```

## 📋 Requisitos

- Python 3.8+
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Puertos 5000 y 8000 disponibles

## 📁 Estructura del Proyecto

```
TP_DAO_2025/
├── backend/              # API REST Flask
├── frontend/             # Aplicación web
├── serve_frontend.py     # Servidor frontend
├── requirements.txt      # Dependencias Python
└── documentación/
    ├── INICIO_RAPIDO.md
    ├── GUIA_EJECUCION.md
    ├── EJEMPLOS_USO.md
    ├── CHECKLIST.md
    └── PROYECTO_FINALIZADO.txt
```

## ✨ Características

- **Dashboard**: Estadísticas en tiempo real
- **ABM Pacientes**: Crear, editar, eliminar pacientes
- **ABM Médicos**: Gestión completa de médicos
- **ABM Especialidades**: Crear especialidades médicas
- **Asignación de Turnos**: Formulario para reservar turnos
- **Interfaz Responsiva**: Compatible con desktop, tablet y mobile
- **Validaciones**: En frontend y backend
- **Diseño Moderno**: CSS3, animaciones, gradientes

## 🔌 API Endpoints

### Pacientes
- `GET /pacientes/` - Listar todos
- `GET /pacientes/<id>` - Obtener uno
- `POST /pacientes/` - Crear
- `PUT /pacientes/<id>` - Actualizar
- `DELETE /pacientes/<id>` - Eliminar

### Médicos
- `GET /medicos/` - Listar todos
- `GET /medicos/<id>` - Obtener uno
- `POST /medicos/` - Crear
- `PUT /medicos/<id>` - Actualizar
- `DELETE /medicos/<id>` - Eliminar

### Especialidades
- `GET /especialidades/` - Listar todas
- `GET /especialidades/<id>` - Obtener una
- `POST /especialidades/` - Crear

### Turnos
- `GET /turnos/medico/<id>` - Turnos de un médico
- `GET /turnos/paciente/<id>` - Turnos de un paciente
- `POST /turnos/` - Crear turno
- `PUT /turnos/<id>/estado` - Cambiar estado

## 🛠️ Tecnologías

- **Backend**: Flask, Flask-SQLAlchemy, Flask-CORS
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Base de Datos**: SQLite
- **API**: REST con JSON

## 📚 Documentación

- **INICIO_RAPIDO.md** - Comienza aquí (2 pasos)
- **GUIA_EJECUCION.md** - Guía completa y detallada
- **EJEMPLOS_USO.md** - Ejemplos prácticos de uso
- **CHECKLIST.md** - Lista de verificación completa
- **PROYECTO_FINALIZADO.txt** - Resumen ASCII

## ⚙️ Configuración

| Parámetro | Valor |
|-----------|-------|
| Backend URL | http://localhost:5000 |
| Frontend URL | http://localhost:8000 |
| Base de Datos | backend/turnero.db |
| Debug Mode | Habilitado |

## 🐛 Solución de Problemas

### "Error: El puerto 5000 está en uso"
```bash
# Windows - Encontrar proceso
netstat -ano | findstr :5000

# Cambiar puerto en backend/app.py
app.run(debug=True, port=5001)
```

### "Error CORS"
Verifica que `flask-cors` esté instalado:
```bash
pip install flask-cors
```

### "No se conecta a la API"
1. Verifica que el backend esté ejecutándose en http://localhost:5000
2. Abre F12 en navegador y revisa Network tab
3. Comprueba la consola (F12 > Console) para errores

## 📊 Estadísticas

| Componente | Cantidad |
|-----------|----------|
| Modelos de BD | 8 |
| Endpoints API | 30+ |
| Controladores | 8 |
| Servicios | 8 |
| Líneas Frontend | 1500+ |
| Líneas CSS | 1000+ |

## 🚀 Deploy

Para deploy a producción:

1. Configura una base de datos PostgreSQL o MySQL
2. Usa un servidor WSGI como Gunicorn
3. Configura CORS con dominio específico
4. Usa un servidor web como Nginx
5. Configura SSL/HTTPS

## 📝 Notas

- La aplicación usa SQLite por defecto (ideal para desarrollo)
- Los cambios se guardan inmediatamente
- Las confirmaciones protegen contra eliminaciones accidentales
- No se requieren dependencias NPM

## 📞 Contacto & Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados © 2025

---

**¡La aplicación está lista para usar!** 🎉

Para comenzar, consulta **INICIO_RAPIDO.md**
