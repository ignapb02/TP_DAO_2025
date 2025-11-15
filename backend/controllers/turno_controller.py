from flask import Blueprint, request, jsonify
from backend.services.turno_service import TurnoService

turno_bp = Blueprint('turno_bp', __name__, url_prefix="/turnos")

@turno_bp.get("/")
def obtener_todos_turnos():
    try:
        turnos = TurnoService.obtener_todos_turnos()
        return jsonify([t.to_dict() for t in turnos])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@turno_bp.post("/")
def crear_turno():
    data = request.json
    try:
        turno = TurnoService.crear_turno(
            data.get("paciente_id"),
            data.get("medico_id"),
            data.get("especialidad_id"),
            data.get("fecha"),
            data.get("hora"),
            data.get("duracion_minutos", 30)
        )
        return jsonify({"msg": "Turno creado correctamente", "turno": turno.to_dict()}), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Error al crear turno: {str(e)}"}), 500


@turno_bp.put("/<int:id_turno>/estado")
def cambiar_estado(id_turno):
    data = request.json
    try:
        turno = TurnoService.cambiar_estado(id_turno, data.get("estado"))
        return jsonify({"msg": "Estado actualizado", "turno": turno.to_dict()})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500


@turno_bp.get("/medico/<int:id_medico>")
def turnos_medico(id_medico):
    try:
        turnos = TurnoService.obtener_turnos_medico(id_medico)
        return jsonify([t.to_dict() for t in turnos])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@turno_bp.get("/paciente/<int:id_paciente>")
def turnos_paciente(id_paciente):
    try:
        turnos = TurnoService.obtener_turnos_paciente(id_paciente)
        return jsonify([t.to_dict() for t in turnos])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
