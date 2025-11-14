from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from backend.config import Config
from backend.database.db import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar DB en la app
    db.init_app(app)

    # Habilitar CORS
    CORS(app)

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

    # REGISTRAR BLUEPRINTS
    app.register_blueprint(paciente_bp, url_prefix="/pacientes")
    app.register_blueprint(medico_bp, url_prefix="/medicos")
    app.register_blueprint(especialidad_bp, url_prefix="/especialidades")
    app.register_blueprint(medico_especialidad_bp, url_prefix="/medicos-especialidades")
    app.register_blueprint(turno_bp, url_prefix="/turnos")
    app.register_blueprint(historial_bp, url_prefix="/historial")
    app.register_blueprint(receta_bp, url_prefix="/recetas")
    app.register_blueprint(recordatorio_bp, url_prefix="/recordatorios")

    @app.route("/")
    def home():
        return {"message": "API Turnero Médico funcionando correctamente"}

    return app


# Ejecución directa
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
