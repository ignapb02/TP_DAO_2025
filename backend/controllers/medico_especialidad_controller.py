from flask import Blueprint, request, jsonify
from backend.services.medico_especialidad_service import MedicoEspecialidadService

medico_especialidad_bp = Blueprint('medico_especialidad_bp', __name__, url_prefix="/medicos-especialidades")

@medico_especialidad_bp.post("/")
def asignar_especialidad():
    data = request.json
    try:
        relacion = MedicoEspecialidadService.asignar_especialidad(
            data.get("medico_id"),
            data.get("especialidad_id"),
            data.get("principal", False),
            data.get("fecha_obtencion")
        )
        return jsonify({"msg": "Especialidad asignada correctamente", "relacion": relacion.to_dict()}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Error al asignar especialidad: {str(e)}"}), 500

@medico_especialidad_bp.get("/medico/<int:medico_id>")
def obtener_especialidades(medico_id):
    try:
        especialidades = MedicoEspecialidadService.obtener_especialidades_medico(medico_id)
        return jsonify([e.to_dict() for e in especialidades]), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Error al obtener especialidades: {str(e)}"}), 500


@medico_especialidad_bp.get("/especialidad/<int:especialidad_id>/medicos")
def obtener_medicos_por_especialidad(especialidad_id):
    try:
        medicos = MedicoEspecialidadService.obtener_medicos_por_especialidad(especialidad_id)
        return jsonify([m.to_dict() for m in medicos]), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Error al obtener médicos por especialidad: {str(e)}"}), 500

@medico_especialidad_bp.delete("/<int:medico_id>/<int:especialidad_id>")
def eliminar_especialidad(medico_id, especialidad_id):
    try:
        MedicoEspecialidadService.eliminar_especialidad(medico_id, especialidad_id)
        return jsonify({"msg": "Especialidad eliminada correctamente"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Error al eliminar especialidad: {str(e)}"}), 500
