from backend.database.db import db

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
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.email = email
        self.telefono = telefono

    def nombre_completo(self):
        return f"{self.apellido}, {self.nombre}"
