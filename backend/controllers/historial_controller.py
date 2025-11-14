from flask import Blueprint, jsonify
from backend.services.historial_service import HistorialService

historial_bp = Blueprint("historial_bp", __name__, url_prefix="/historial")

@historial_bp.get("/paciente/<int:id_paciente>")
def historial_paciente(id_paciente):
    historial = HistorialService.obtener_historial_paciente(id_paciente)
    return jsonify([h.to_dict() for h in historial])
