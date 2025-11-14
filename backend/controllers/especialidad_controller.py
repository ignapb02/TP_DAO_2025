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
