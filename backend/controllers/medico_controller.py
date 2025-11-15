from flask import Blueprint, request, jsonify
from backend.services.medico_service import MedicoService

medico_bp = Blueprint('medico_bp', __name__, url_prefix="/medicos")

@medico_bp.post("/")
def crear_medico():
    data = request.json
    try:
        medico = MedicoService.registrar_medico(
            data.get("nombre"),
            data.get("apellido"),
            data.get("matricula"),
            data.get("email"),
            data.get("dni"),
            data.get("telefono")
        )
        return jsonify({"msg": "Médico creado", "medico": medico.to_dict()}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Error al crear médico: {str(e)}"}), 500


@medico_bp.get("/")
def obtener_medicos():
    medicos = MedicoService.obtener_todos()
    return jsonify([m.to_dict() for m in medicos]), 200


@medico_bp.get("/<int:id_medico>")
def obtener_medico(id_medico):
    try:
        medico = MedicoService.obtener_medico(id_medico)
        return jsonify(medico.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 404


@medico_bp.put("/<int:id_medico>")
def actualizar_medico(id_medico):
    data = request.json
    try:
        medico = MedicoService.actualizar_medico(id_medico, **data)
        return jsonify({"msg": "Médico actualizado", "medico": medico.to_dict()})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Error al actualizar médico: {str(e)}"}), 500


@medico_bp.delete("/<int:id_medico>")
def eliminar_medico(id_medico):
    try:
        MedicoService.eliminar_medico(id_medico)
        return jsonify({"msg": "Médico eliminado"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
