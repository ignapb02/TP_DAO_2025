from backend.database.db import db

class Especialidad(db.Model):
    __tablename__ = "especialidades"

    id_especialidad = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)

    medicos = db.relationship("MedicoEspecialidad", back_populates="especialidad", cascade="all, delete")

    def __init__(self, nombre):
        self.nombre = nombre

    def to_dict(self):
        return {
            "id_especialidad": self.id_especialidad,
            "nombre": self.nombre
        }
