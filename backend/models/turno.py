from backend.database.db import db

class Turno(db.Model):
    __tablename__ = "turnos"

    id_turno = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey("pacientes.id_paciente"), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey("medicos.id_medico"), nullable=False)
    especialidad_id = db.Column(db.Integer, db.ForeignKey("especialidades.id_especialidad"), nullable=False)

    fecha = db.Column(db.String(20), nullable=False)
    hora = db.Column(db.String(10), nullable=False)
    estado = db.Column(db.String(20), default="pendiente")

    paciente = db.relationship("Paciente", back_populates="turnos")
    medico = db.relationship("Medico", back_populates="turnos")
    especialidad = db.relationship("Especialidad")

    historial = db.relationship("HistorialClinico", uselist=False, back_populates="turno")
    recordatorio = db.relationship("Recordatorio", uselist=False, back_populates="turno")

    def __init__(self, paciente_id, medico_id, especialidad_id, fecha, hora, estado="pendiente"):
        self.paciente_id = paciente_id
        self.medico_id = medico_id
        self.especialidad_id = especialidad_id
        self.fecha = fecha
        self.hora = hora
        self.estado = estado
