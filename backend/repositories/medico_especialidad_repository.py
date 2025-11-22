from backend.database.db import db
from backend.models.medico_especialidad import MedicoEspecialidad

class MedicoEspecialidadRepository:

    @staticmethod
    def asignar(medico_id, especialidad_id, principal=False, fecha_obtencion=None):
        relacion = MedicoEspecialidad(medico_id, especialidad_id, principal, fecha_obtencion)
        db.session.add(relacion)
        db.session.commit()
        return relacion

    @staticmethod
    def obtener(medico_id, especialidad_id):
        return MedicoEspecialidad.query.filter_by(
            medico_id=medico_id,
            especialidad_id=especialidad_id
        ).first()

    @staticmethod
    def obtener_por_medico(medico_id):
        return MedicoEspecialidad.query.filter_by(medico_id=medico_id).all()

    @staticmethod
    def obtener_por_especialidad(especialidad_id):
        return MedicoEspecialidad.query.filter_by(especialidad_id=especialidad_id).all()

    @staticmethod
    def eliminar(medico_id, especialidad_id):
        relacion = MedicoEspecialidadRepository.obtener(medico_id, especialidad_id)
        if not relacion:
            return False
        db.session.delete(relacion)
        db.session.commit()
        return True
