from backend.database.db import db
from backend.models.medico import Medico

class MedicoRepository:

    @staticmethod
    def crear(nombre, apellido, matricula, email, dni, telefono=None):
        medico = Medico(nombre, apellido, matricula, email, dni, telefono)
        db.session.add(medico)
        db.session.commit()
        return medico

    @staticmethod
    def obtener_por_id(id_medico):
        return Medico.query.get(id_medico)

    @staticmethod
    def obtener_todos():
        return Medico.query.all()

    @staticmethod
    def actualizar(id_medico, **kwargs):
        medico = Medico.query.get(id_medico)
        if not medico:
            return None
        for key, value in kwargs.items():
            if hasattr(medico, key):
                setattr(medico, key, value)
        db.session.commit()
        return medico

    @staticmethod
    def eliminar(id_medico):
        medico = Medico.query.get(id_medico)
        if not medico:
            return False
        db.session.delete(medico)
        db.session.commit()
        return True
