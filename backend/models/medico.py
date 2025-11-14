from backend.database.db import db

class Medico(db.Model):
    __tablename__ = "medicos"

    id_medico = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    matricula = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    dni = db.Column(db.String(20), nullable=False, unique=True)

    especialidades = db.relationship("MedicoEspecialidad", back_populates="medico", cascade="all, delete")
    turnos = db.relationship("Turno", back_populates="medico", lazy=True)

    def __init__(self, nombre, apellido, matricula, email, telefono, dni):
        self.nombre = nombre
        self.apellido = apellido
        self.matricula = matricula
        self.email = email
        self.telefono = telefono
        self.dni = dni
