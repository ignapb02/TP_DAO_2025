from backend.database.db import db
from backend.models.validators import validate_required_int, parse_optional_datetime

class MedicoEspecialidad(db.Model):
    __tablename__ = "medicos_especialidades"

    medico_id = db.Column(db.Integer, db.ForeignKey("medicos.id_medico"), primary_key=True)
    especialidad_id = db.Column(db.Integer, db.ForeignKey("especialidades.id_especialidad"), primary_key=True)

    principal = db.Column(db.Boolean, default=False)
    fecha_obtencion = db.Column(db.Date)

    medico = db.relationship("Medico", back_populates="especialidades")
    especialidad = db.relationship("Especialidad", back_populates="medicos")

    def __init__(self, medico_id, especialidad_id, principal=False, fecha_obtencion=None):
        self.medico_id = validate_required_int(medico_id, name='medico_id', min_value=1)
        self.especialidad_id = validate_required_int(especialidad_id, name='especialidad_id', min_value=1)
        self.principal = bool(principal)
        self.fecha_obtencion = parse_optional_datetime(fecha_obtencion, name='fecha_obtencion')

    def to_dict(self):
        return {
            "medico_id": self.medico_id,
            "especialidad_id": self.especialidad_id,
            "principal": self.principal,
            "fecha_obtencion": str(self.fecha_obtencion) if self.fecha_obtencion else None
        }
