from flask import Blueprint, request, jsonify
from backend.services.receta_service import RecetaService

receta_bp = Blueprint("receta_bp", __name__, url_prefix="/recetas")

@receta_bp.post("/")
def crear_receta():
    data = request.json
    receta = RecetaService.crear_receta(
        data["id_historial"],
        data.get("medicamentos"),
        data.get("indicaciones"),
        data.get("fecha_emision")
    )
    return jsonify({"msg": "Receta creada", "receta": receta.to_dict()}), 201


@receta_bp.get("/")
def obtener_recetas():
    recetas = RecetaService.obtener_todas()
    return jsonify([r.to_dict() for r in recetas]), 200


@receta_bp.get("/<int:id_receta>")
def obtener_receta(id_receta):
    try:
        receta = RecetaService.obtener_receta(id_receta)
        return jsonify(receta.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 404
