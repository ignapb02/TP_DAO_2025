from backend.database.db import db
from backend.models.turno import Turno

class TurnoRepository:

    @staticmethod
    def crear(paciente_id, medico_id, especialidad_id, fecha, hora, duracion_minutos=30, estado="pendiente"):
        turno = Turno(paciente_id, medico_id, especialidad_id, fecha, hora, duracion_minutos, estado)
        db.session.add(turno)
        db.session.commit()
        return turno

    @staticmethod
    def obtener_por_id(id_turno):
        return Turno.query.get(id_turno)

    @staticmethod
    def obtener_todos():
        return Turno.query.all()

    @staticmethod
    def obtener_por_medico(id_medico):
        return Turno.query.filter_by(medico_id=id_medico).all()

    @staticmethod
    def obtener_por_paciente(id_paciente):
        return Turno.query.filter_by(paciente_id=id_paciente).all()

    @staticmethod
    def actualizar(id_turno, **kwargs):
        turno = Turno.query.get(id_turno)
        if not turno:
            return None

        for key, value in kwargs.items():
            if hasattr(turno, key):
                setattr(turno, key, value)

        db.session.commit()
        return turno

    @staticmethod
    def eliminar(id_turno):
        turno = Turno.query.get(id_turno)
        if not turno:
            return False
        db.session.delete(turno)
        db.session.commit()
        return True
