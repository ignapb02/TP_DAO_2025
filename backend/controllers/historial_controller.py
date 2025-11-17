from flask import Blueprint, jsonify, request
from backend.services.historial_service import HistorialService

historial_bp = Blueprint("historial_bp", __name__, url_prefix="/historial")

@historial_bp.get("/")
def obtener_historiales():
    historiales = HistorialService.obtener_todos()
    return jsonify([h.to_dict() for h in historiales]), 200


@historial_bp.get("/paciente/<int:id_paciente>")
def historial_paciente(id_paciente):
    historial = HistorialService.obtener_historial_paciente(id_paciente)
    return jsonify([h.to_dict() for h in historial])

# Nuevo endpoint para registrar historia clínica
@historial_bp.post("/")
def crear_historial():
    data = request.json
    try:
        historial = HistorialService.crear_historial(
            data["paciente_id"],
            data["turno_id"],
            data.get("diagnostico"),
            data.get("tratamiento"),
            data.get("observaciones"),
            data.get("fecha_atencion")
        )
        return jsonify({"msg": "Historial creado", "historial": historial.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400