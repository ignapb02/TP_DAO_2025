from backend.database.db import db

class HistorialClinico(db.Model):
    __tablename__ = "historiales_clinicos"

    id_historial = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey("pacientes.id_paciente"), nullable=False)
    turno_id = db.Column(db.Integer, db.ForeignKey("turnos.id_turno"), nullable=False)
    diagnostico = db.Column(db.Text, nullable=True)
    tratamiento = db.Column(db.Text, nullable=True)
    observaciones = db.Column(db.Text, nullable=True)
    fecha_atencion = db.Column(db.DateTime, nullable=True)

    paciente = db.relationship("Paciente", back_populates="historiales")
    turno = db.relationship("Turno", back_populates="historial")
    receta = db.relationship("Receta", uselist=False, back_populates="historial")

    def __init__(self, paciente_id, turno_id, diagnostico=None, tratamiento=None, observaciones=None, fecha_atencion=None):
        self.paciente_id = paciente_id
        self.turno_id = turno_id
        self.diagnostico = diagnostico
        self.tratamiento = tratamiento
        self.observaciones = observaciones
        self.fecha_atencion = fecha_atencion

    def to_dict(self):
        paciente_nombre = None
        paciente_apellido = None
        if self.paciente:
            paciente_nombre = getattr(self.paciente, "nombre", None)
            paciente_apellido = getattr(self.paciente, "apellido", None)

        medico_nombre = None
        medico_apellido = None
        if self.turno and getattr(self.turno, "medico", None):
            medico_nombre = getattr(self.turno.medico, "nombre", None)
            medico_apellido = getattr(self.turno.medico, "apellido", None)

        receta_id = self.receta.id_receta if getattr(self, "receta", None) else None

        return {
            "id_historial": self.id_historial,
            "paciente_id": self.paciente_id,
            "paciente_nombre": paciente_nombre,
            "paciente_apellido": paciente_apellido,
            "turno_id": self.turno_id,
            "medico_nombre": medico_nombre,
            "medico_apellido": medico_apellido,
            "diagnostico": self.diagnostico,
            "tratamiento": self.tratamiento,
            "observaciones": self.observaciones,
            "fecha_atencion": str(self.fecha_atencion) if self.fecha_atencion else None,
            "receta_id": receta_id
        }
