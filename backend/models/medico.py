from backend.database.db import db
import bcrypt
from backend.models.validators import validate_name, validate_digits, validate_email, validate_required_str

class Medico(db.Model):
    __tablename__ = "medicos"

    id_medico = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    matricula = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    telefono = db.Column(db.String(20), nullable=True)
    dni = db.Column(db.String(20), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=True)  # Permitir null para médicos existentes
    rol = db.Column(db.String(20), nullable=False, default='medico')  # 'admin' o 'medico'

    especialidades = db.relationship("MedicoEspecialidad", back_populates="medico", cascade="all, delete")
    turnos = db.relationship("Turno", back_populates="medico", lazy=True)

    def __init__(self, nombre, apellido, matricula, email, dni, telefono=None, password=None, rol='medico'):
        self.nombre = validate_name(nombre, 'nombre', max_len=100)
        self.apellido = validate_name(apellido, 'apellido', max_len=100)
        self.matricula = validate_required_str(matricula, 'matricula', max_len=50)
        self.email = validate_email(email, name='email', max_len=100)
        self.telefono = validate_digits(telefono, 'telefono', max_len=20) if telefono is not None else None
        self.dni = validate_digits(dni, 'dni', min_len=6, max_len=10)
        self.rol = validate_required_str(rol, 'rol', max_len=20)
        if password:
            self.set_password(password)
    
    def set_password(self, password):
        """Hash y almacenar password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Verificar password"""
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            "id_medico": self.id_medico,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "matricula": self.matricula,
            "email": self.email,
            "telefono": self.telefono,
            "dni": self.dni,
            "rol": self.rol,
            "especialidades": [me.especialidad.nombre for me in self.especialidades if me.especialidad]
        }
