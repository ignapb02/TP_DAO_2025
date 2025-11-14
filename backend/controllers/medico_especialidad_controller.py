from flask import Blueprint, request, jsonify
from backend.services.medico_especialidad_service import MedicoEspecialidadService

medico_especialidad_bp = Blueprint('medico_especialidad_bp', __name__, url_prefix="/medicos-especialidades")

@medico_especialidad_bp.post("/")
def asignar_especialidad():
    data = request.json
    try:
        relacion = MedicoEspecialidadService.asignar_especialidad(
            data["id_medico"],
            data["id_especialidad"],
            data.get("principal", False),
            data.get("fecha_obtencion")
        )
        return jsonify({"msg": "Especialidad asignada", "relacion": relacion.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
