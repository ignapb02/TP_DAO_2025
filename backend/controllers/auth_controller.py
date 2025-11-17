from flask import Blueprint, request, jsonify
from backend.services.auth_service import AuthService

auth_bp = Blueprint('auth_bp', __name__, url_prefix="/auth")

@auth_bp.post("/login")
def login():
    """Endpoint para iniciar sesión"""
    data = request.json
    try:
        resultado = AuthService.login(
            data.get("email"),
            data.get("password")
        )
        return jsonify(resultado), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        return jsonify({"error": f"Error en el servidor: {str(e)}"}), 500

@auth_bp.post("/verify")
def verify():
    """Endpoint para verificar token"""
    data = request.json
    try:
        token = data.get("token")
        payload = AuthService.verificar_token(token)
        return jsonify({"valid": True, "payload": payload}), 200
    except ValueError as e:
        return jsonify({"valid": False, "error": str(e)}), 401
    except Exception as e:
        return jsonify({"valid": False, "error": str(e)}), 500
