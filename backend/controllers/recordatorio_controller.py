from flask import Blueprint, request, jsonify
from backend.services.recordatorio_service import RecordatorioService
from backend.services.email_service import EmailService

recordatorio_bp = Blueprint("recordatorio_bp", __name__, url_prefix="/recordatorios")

@recordatorio_bp.post("/")
def crear_recordatorio():
    """Crear un recordatorio manual para un turno"""
    data = request.json
    try:
        recordatorio = RecordatorioService.crear_recordatorio(
            data["id_turno"],
            data.get("horas_anticipacion", 24),
            data.get("activo", True)
        )
        return jsonify({"msg": "Recordatorio creado", "recordatorio": recordatorio.to_dict()}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Error al crear recordatorio: {str(e)}"}), 500

@recordatorio_bp.get("/")
def obtener_recordatorios():
    """Listar todos los recordatorios"""
    try:
        recordatorios = RecordatorioService.obtener_todos()
        return jsonify([r.to_dict() for r in recordatorios]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@recordatorio_bp.get("/<int:id_recordatorio>")
def obtener_recordatorio(id_recordatorio):
    """Obtener un recordatorio específico"""
    try:
        recordatorio = RecordatorioService.obtener_recordatorio(id_recordatorio)
        return jsonify(recordatorio.to_dict())
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@recordatorio_bp.post("/procesar")
def procesar_recordatorios():
    """Procesar recordatorios pendientes y enviar emails"""
    try:
        resultado = RecordatorioService.procesar_recordatorios_pendientes()
        return jsonify({
            "msg": "Recordatorios procesados",
            "resultado": resultado
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error procesando recordatorios: {str(e)}"}), 500

@recordatorio_bp.get("/test-email")
def test_email_config():
    """Endpoint para verificar configuración de email"""
    try:
        config = EmailService.test_email_config()
        return jsonify(config), 200
    except Exception as e:
        return jsonify({"error": f"Error verificando email: {str(e)}"}), 500
