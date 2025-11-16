from backend.database.db import db
from backend.models.receta import Receta

class RecetaRepository:

    @staticmethod
    def crear(historial_id, medicamentos=None, indicaciones=None, fecha_emision=None):
        receta = Receta(historial_id, medicamentos, indicaciones, fecha_emision)
        db.session.add(receta)
        db.session.commit()
        return receta

    @staticmethod
    def obtener_por_id(id_receta):
        return Receta.query.get(id_receta)

    @staticmethod
    def obtener_todos():
        return Receta.query.all()

    @staticmethod
    def obtener_por_historial(id_historial):
        return Receta.query.filter_by(historial_id=id_historial).first()

    @staticmethod
    def eliminar(id_receta):
        receta = Receta.query.get(id_receta)
        if not receta:
            return False
        db.session.delete(receta)
        db.session.commit()
        return True
