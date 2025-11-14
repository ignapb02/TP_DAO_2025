from backend.database.db import db

class MedicoEspecialidad(db.Model):
    __tablename__ = "medicos_especialidades"

    medico_id = db.Column(db.Integer, db.ForeignKey("medicos.id_medico"), primary_key=True)
    especialidad_id = db.Column(db.Integer, db.ForeignKey("especialidades.id_especialidad"), primary_key=True)

    principal = db.Column(db.Boolean, default=False)
    fecha_obtencion = db.Column(db.Date)

    medico = db.relationship("Medico", back_populates="especialidades")
    especialidad = db.relationship("Especialidad", back_populates="medicos")

    def __init__(self, medico_id, especialidad_id, principal=False, fecha_obtencion=None):
        self.medico_id = medico_id
        self.especialidad_id = especialidad_id
        self.principal = principal
        self.fecha_obtencion = fecha_obtencion
