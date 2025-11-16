from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from backend.config import Config
from backend.database.db import db
import subprocess
import sys
import os
import atexit
from pathlib import Path
import socket

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar DB en la app
    db.init_app(app)

    # Habilitar CORS - Permitir peticiones desde el frontend
    # Aceptar requests desde los orígenes habituales del frontend (incluye Vite en 5173)
    CORS(app,
         origins=[
             "http://localhost:8080",
             "http://127.0.0.1:8080",
             "http://localhost:8000",
             "http://127.0.0.1:8000",
             "http://localhost:5173",
             "http://127.0.0.1:5173"
         ],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Accept"],
         supports_credentials=True)

    # Registrar modelos y crear tablas
    with app.app_context():
        from backend.models import init_models
        init_models()
        db.create_all()
        print("✔ Base de datos inicializada correctamente.")

    # IMPORTAR BLUEPRINTS **DESPUÉS** DE init_app()
    from backend.controllers.paciente_controller import paciente_bp
    from backend.controllers.medico_controller import medico_bp
    from backend.controllers.especialidad_controller import especialidad_bp
    from backend.controllers.medico_especialidad_controller import medico_especialidad_bp
    from backend.controllers.turno_controller import turno_bp
    from backend.controllers.historial_controller import historial_bp
    from backend.controllers.receta_controller import receta_bp
    from backend.controllers.recordatorio_controller import recordatorio_bp
    from backend.controllers.auth_controller import auth_bp

    # REGISTRAR BLUEPRINTS
    app.register_blueprint(paciente_bp, url_prefix="/pacientes")
    app.register_blueprint(medico_bp, url_prefix="/medicos")
    app.register_blueprint(especialidad_bp, url_prefix="/especialidades")
    app.register_blueprint(medico_especialidad_bp, url_prefix="/medicos-especialidades")
    app.register_blueprint(turno_bp, url_prefix="/turnos")
    app.register_blueprint(historial_bp, url_prefix="/historial")
    app.register_blueprint(receta_bp, url_prefix="/recetas")
    app.register_blueprint(recordatorio_bp, url_prefix="/recordatorios")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    def home():
        return {"message": "API Turnero Médico funcionando correctamente"}

    return app


# Funciones para lanzar/terminar el servidor frontend cuando se ejecuta este archivo
def _start_frontend_subprocess():
    project_root = Path(__file__).resolve().parent.parent
    launcher = project_root / "serve_frontend.py"
    if not launcher.exists():
        print(f"[frontend] Lanzador no encontrado en {launcher}, omitiendo inicio de frontend.")
        return None

    # Puerto por defecto del servidor frontend (coincide con `serve_frontend.py`)
    FRONTEND_PORT = 8000

    # Verificar si el puerto está libre antes de iniciar
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(("", FRONTEND_PORT))
        sock.close()
    except OSError:
        print(f"[frontend] Puerto {FRONTEND_PORT} en uso, omitiendo inicio del servidor frontend.")
        return None

    cmd = [sys.executable, str(launcher)]
    print(f"[frontend] Iniciando servidor frontend: {cmd} (cwd={project_root})")
    try:
        proc = subprocess.Popen(cmd, cwd=str(project_root))
        return proc
    except Exception as e:
        print(f"[frontend] Error al iniciar frontend: {e}")
        return None


def _stop_frontend_subprocess(proc):
    if not proc:
        return
    try:
        if proc.poll() is None:
            print("[frontend] Terminando servidor frontend...")
            proc.terminate()
            proc.wait(timeout=5)
    except Exception as e:
        print(f"[frontend] Error al terminar frontend: {e}. Intentando kill.")
        try:
            proc.kill()
        except Exception:
            pass


# Ejecución directa
if __name__ == "__main__":
    app = create_app()
    frontend_proc = None
    # Iniciar el frontend solo si se solicita explícitamente mediante variable de entorno START_FRONTEND=1
    # Y además, arrancarlo en el proceso hijo del reloader (WERKZEUG_RUN_MAIN=="true") o cuando no estemos en modo debug.
    # Esto evita iniciar el frontend automáticamente en el proceso padre del reloader.
    should_start_frontend = (os.environ.get("START_FRONTEND") == "1") and (os.environ.get("WERKZEUG_RUN_MAIN") == "true" or not app.debug)
    try:
        if should_start_frontend:
            frontend_proc = _start_frontend_subprocess()
            if frontend_proc:
                atexit.register(lambda: _stop_frontend_subprocess(frontend_proc))

        app.run(debug=True)
    finally:
        _stop_frontend_subprocess(frontend_proc)
