from backend.database.db import db
from backend.models.especialidad import Especialidad

class EspecialidadRepository:

    @staticmethod
    def crear(nombre):
        especialidad = Especialidad(nombre)
        db.session.add(especialidad)
        db.session.commit()
        return especialidad

    @staticmethod
    def obtener_por_id(id_especialidad):
        return Especialidad.query.get(id_especialidad)

    @staticmethod
    def obtener_todos():
        return Especialidad.query.all()

    @staticmethod
    def actualizar(id_especialidad, nombre=None):
        esp = Especialidad.query.get(id_especialidad)
        if not esp:
            return None
        if nombre:
            esp.nombre = nombre
        db.session.commit()
        return esp

    @staticmethod
    def eliminar(id_especialidad):
        esp = Especialidad.query.get(id_especialidad)
        if not esp:
            return False
        db.session.delete(esp)
        db.session.commit()
        return True
