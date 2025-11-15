from flask import Blueprint, request, jsonify
from backend.services.especialidad_service import EspecialidadService

especialidad_bp = Blueprint('especialidad_bp', __name__, url_prefix="/especialidades")

@especialidad_bp.post("/")
def crear_especialidad():
    data = request.json
    try:
        esp = EspecialidadService.crear_especialidad(data["nombre"])
        return jsonify({"msg": "Especialidad creada", "especialidad": esp.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@especialidad_bp.get("/")
def obtener_especialidades():
    especialidades = EspecialidadService.obtener_todas()
    return jsonify([e.to_dict() for e in especialidades])


@especialidad_bp.get("/<int:id_especialidad>")
def obtener_especialidad(id_especialidad):
    try:
        especialidad = EspecialidadService.obtener_especialidad(id_especialidad)
        return jsonify(especialidad.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@especialidad_bp.put("/<int:id_especialidad>")
def actualizar_especialidad(id_especialidad):
    data = request.json
    try:
        esp = EspecialidadService.actualizar_especialidad(id_especialidad, data["nombre"])
        return jsonify({"msg": "Especialidad actualizada", "especialidad": esp.to_dict()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@especialidad_bp.delete("/<int:id_especialidad>")
def eliminar_especialidad(id_especialidad):
    try:
        ok = EspecialidadService.eliminar_especialidad(id_especialidad)
        if ok:
            return jsonify({"msg": "Especialidad eliminada"}), 200
        else:
            return jsonify({"error": "Especialidad no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400