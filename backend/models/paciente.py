from backend.database.db import db
from backend.models.validators import validate_name, validate_digits, validate_email, validate_required_str

class Paciente(db.Model):
    __tablename__ = "pacientes"

    id_paciente = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    dni = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    telefono = db.Column(db.String(20), nullable=True)

    historiales = db.relationship("HistorialClinico", back_populates="paciente", lazy=True)
    turnos = db.relationship("Turno", back_populates="paciente", lazy=True)

    def __init__(self, nombre, apellido, dni, email, telefono=None):
        self.nombre = validate_name(nombre, 'nombre', max_len=50)
        self.apellido = validate_name(apellido, 'apellido', max_len=50)
        self.dni = validate_digits(dni, 'dni', min_len=6, max_len=10)
        self.email = validate_email(email, name='email', max_len=100)
        self.telefono = validate_digits(telefono, 'telefono', max_len=20) if telefono is not None else None

    def nombre_completo(self):
        return f"{self.apellido}, {self.nombre}"

    def to_dict(self):
        return {
            "id_paciente": self.id_paciente,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "dni": self.dni,
            "email": self.email,
            "telefono": self.telefono
        }
