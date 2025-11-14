from flask import Blueprint, request, jsonify
from backend.services.receta_service import RecetaService

receta_bp = Blueprint("receta_bp", __name__, url_prefix="/recetas")

@receta_bp.post("/")
def crear_receta():
    data = request.json
    receta = RecetaService.crear_receta(data["id_historial"])
    return jsonify({"msg": "Receta creada", "receta": receta.to_dict()}), 201
