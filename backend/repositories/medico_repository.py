from backend.database.db import db
from backend.models.medico import Medico
from backend.models.medico_especialidad import MedicoEspecialidad
from sqlalchemy.orm import joinedload

class MedicoRepository:

    @staticmethod
    def crear(nombre, apellido, matricula, email, dni, telefono=None, password=None, rol='medico'):
        medico = Medico(nombre, apellido, matricula, email, dni, telefono, password, rol)
        db.session.add(medico)
        db.session.commit()
        return medico

    @staticmethod
    def obtener_por_id(id_medico):
        return Medico.query.get(id_medico)

    @staticmethod
    def obtener_todos():
        return Medico.query.options(
            joinedload(Medico.especialidades).joinedload(MedicoEspecialidad.especialidad)
        ).all()

    @staticmethod
    def actualizar(id_medico, **kwargs):
        medico = Medico.query.get(id_medico)
        if not medico:
            return None
        
        # Manejar password de forma especial
        password = kwargs.pop('password', None)
        if password:  # Solo actualizar si se proporciona
            medico.set_password(password)
        
        # Actualizar resto de campos
        for key, value in kwargs.items():
            if hasattr(medico, key):
                setattr(medico, key, value)
        
        db.session.commit()
        return medico

    @staticmethod
    def eliminar(id_medico):
        from sqlalchemy.exc import IntegrityError
        medico = Medico.query.get(id_medico)
        if not medico:
            return False
        try:
            db.session.delete(medico)
            db.session.commit()
            return True
        except IntegrityError as e:
            db.session.rollback()
            raise ValueError(f"No se puede eliminar el médico porque tiene registros asociados (turnos, historiales, etc.). Primero elimine o reasigne estos registros.")
