from backend.database.db import db
from backend.models.historial_clinico import HistorialClinico

class HistorialClinicoRepository:

    @staticmethod
    def crear(paciente_id, turno_id):
        historial = HistorialClinico(paciente_id, turno_id)
        db.session.add(historial)
        db.session.commit()
        return historial

    @staticmethod
    def obtener_por_id(id_historial):
        return HistorialClinico.query.get(id_historial)

    @staticmethod
    def obtener_por_paciente(id_paciente):
        return HistorialClinico.query.filter_by(paciente_id=id_paciente).all()

    @staticmethod
    def obtener_por_turno(id_turno):
        return HistorialClinico.query.filter_by(turno_id=id_turno).first()

    @staticmethod
    def eliminar(id_historial):
        historial = HistorialClinico.query.get(id_historial)
        if not historial:
            return False
        db.session.delete(historial)
        db.session.commit()
        return True
