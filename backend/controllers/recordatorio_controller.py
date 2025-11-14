from flask import Blueprint, request, jsonify
from backend.services.recordatorio_service import RecordatorioService

recordatorio_bp = Blueprint("recordatorio_bp", __name__, url_prefix="/recordatorios")

@recordatorio_bp.post("/")
def crear_recordatorio():
    data = request.json
    recordatorio = RecordatorioService.crear_recordatorio(data["id_turno"])
    return jsonify({"msg": "Recordatorio creado", "recordatorio": recordatorio.to_dict()}), 201
