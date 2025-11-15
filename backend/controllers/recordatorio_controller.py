from flask import Blueprint, request, jsonify
from backend.services.recordatorio_service import RecordatorioService

recordatorio_bp = Blueprint("recordatorio_bp", __name__, url_prefix="/recordatorios")

@recordatorio_bp.post("/")
def crear_recordatorio():
    data = request.json
    recordatorio = RecordatorioService.crear_recordatorio(data["id_turno"])
    return jsonify({"msg": "Recordatorio creado", "recordatorio": recordatorio.to_dict()}), 201


@recordatorio_bp.get("/")
def obtener_recordatorios():
    recordatorios = RecordatorioService.obtener_todos()
    return jsonify([r.to_dict() for r in recordatorios]), 200


@recordatorio_bp.get("/<int:id_recordatorio>")
def obtener_recordatorio(id_recordatorio):
    try:
        recordatorio = RecordatorioService.obtener_recordatorio(id_recordatorio)
        return jsonify(recordatorio.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 404
