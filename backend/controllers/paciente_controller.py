from flask import Blueprint, request, jsonify
from backend.services.paciente_service import PacienteService

paciente_bp = Blueprint('paciente_bp', __name__, url_prefix="/pacientes")

@paciente_bp.post("/")
def crear_paciente():
    data = request.json
    try:
        paciente = PacienteService.registrar_paciente(
            data["nombre"],
            data["apellido"],
            data["dni"],
            data["email"],
            data.get("telefono")
        )
        return jsonify({"msg": "Paciente creado", "paciente": paciente.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@paciente_bp.get("/")
def obtener_pacientes():
    pacientes = PacienteService.obtener_todos()
    return jsonify([p.to_dict() for p in pacientes]), 200


@paciente_bp.get("/<int:id_paciente>")
def obtener_paciente(id_paciente):
    try:
        paciente = PacienteService.obtener_paciente(id_paciente)
        return jsonify(paciente.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 404


@paciente_bp.put("/<int:id_paciente>")
def actualizar_paciente(id_paciente):
    data = request.json
    try:
        paciente = PacienteService.actualizar_paciente(id_paciente, **data)
        return jsonify({"msg": "Paciente actualizado", "paciente": paciente.to_dict()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@paciente_bp.delete("/<int:id_paciente>")
def eliminar_paciente(id_paciente):
    try:
        PacienteService.eliminar_paciente(id_paciente)
        return jsonify({"msg": "Paciente eliminado"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
