from backend.database.db import db
from backend.models.recordatorio import Recordatorio

class RecordatorioRepository:

    @staticmethod
    def crear(turno_id):
        recordatorio = Recordatorio(turno_id)
        db.session.add(recordatorio)
        db.session.commit()
        return recordatorio

    @staticmethod
    def obtener_por_turno(turno_id):
        return Recordatorio.query.filter_by(turno_id=turno_id).first()

    @staticmethod
    def obtener_por_id(id_recordatorio):
        return Recordatorio.query.get(id_recordatorio)

    @staticmethod
    def obtener_todos():
        return Recordatorio.query.all()

    @staticmethod
    def eliminar(id_recordatorio):
        recordatorio = Recordatorio.query.get(id_recordatorio)
        if not recordatorio:
            return False
        db.session.delete(recordatorio)
        db.session.commit()
        return True
