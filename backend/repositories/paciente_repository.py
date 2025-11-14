from backend.database.db import db
from backend.models.paciente import Paciente

class PacienteRepository:

    @staticmethod
    def crear(nombre, apellido, dni, email, telefono=None):
        paciente = Paciente(nombre, apellido, dni, email, telefono)
        db.session.add(paciente)
        db.session.commit()
        return paciente

    @staticmethod
    def obtener_por_id(id_paciente):
        return Paciente.query.get(id_paciente)

    @staticmethod
    def obtener_todos():
        return Paciente.query.all()

    @staticmethod
    def actualizar(id_paciente, **kwargs):
        paciente = Paciente.query.get(id_paciente)
        if not paciente:
            return None
        for key, value in kwargs.items():
            if hasattr(paciente, key):
                setattr(paciente, key, value)
        db.session.commit()
        return paciente

    @staticmethod
    def eliminar(id_paciente):
        paciente = Paciente.query.get(id_paciente)
        if not paciente:
            return False
        db.session.delete(paciente)
        db.session.commit()
        return True
