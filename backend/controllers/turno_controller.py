from flask import Blueprint, request, jsonify
from backend.services.turno_service import TurnoService

turno_bp = Blueprint('turno_bp', __name__, url_prefix="/turnos")

@turno_bp.post("/")
def crear_turno():
    data = request.json
    try:
        turno = TurnoService.crear_turno(
            data["id_paciente"],
            data["id_medico"],
            data["id_especialidad"],
            data["fecha"],
            data["hora"],
        )
        return jsonify({"msg": "Turno creado", "turno": turno.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@turno_bp.put("/<int:id_turno>/estado")
def cambiar_estado(id_turno):
    data = request.json
    try:
        turno = TurnoService.cambiar_estado(id_turno, data["estado"])
        return jsonify(turno.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@turno_bp.get("/medico/<int:id_medico>")
def turnos_medico(id_medico):
    turnos = TurnoService.obtener_turnos_medico(id_medico)
    return jsonify([t.to_dict() for t in turnos])


@turno_bp.get("/paciente/<int:id_paciente>")
def turnos_paciente(id_paciente):
    turnos = TurnoService.obtener_turnos_paciente(id_paciente)
    return jsonify([t.to_dict() for t in turnos])
