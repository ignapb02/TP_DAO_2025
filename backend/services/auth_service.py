from backend.repositories.medico_repository import MedicoRepository
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "tu-clave-secreta-aqui-cambiar-en-produccion"  # TODO: mover a variables de entorno

class AuthService:
    
    @staticmethod
    def login(email, password):
        """Autenticar médico y retornar token JWT"""
        if not email or not password:
            raise ValueError("Email y contraseña son requeridos")
        
        # Buscar médico por email
        medicos = MedicoRepository.obtener_todos()
        medico = next((m for m in medicos if m.email == email), None)
        
        if not medico:
            raise ValueError("Credenciales inválidas")
        
        # Verificar contraseña
        if not medico.check_password(password):
            raise ValueError("Credenciales inválidas")
        
        # Generar token JWT
        payload = {
            'id_medico': medico.id_medico,
            'email': medico.email,
            'rol': medico.rol,
            'exp': datetime.utcnow() + timedelta(hours=8)  # Token válido por 8 horas
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        
        return {
            'token': token,
            'medico': medico.to_dict()
        }
    
    @staticmethod
    def verificar_token(token):
        """Verificar y decodificar token JWT"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token expirado")
        except jwt.InvalidTokenError:
            raise ValueError("Token inválido")
