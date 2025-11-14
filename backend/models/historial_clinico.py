from backend.database.db import db

class HistorialClinico(db.Model):
    __tablename__ = "historiales_clinicos"

    id_historial = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey("pacientes.id_paciente"), nullable=False)
    turno_id = db.Column(db.Integer, db.ForeignKey("turnos.id_turno"), nullable=False)

    paciente = db.relationship("Paciente", back_populates="historiales")
    turno = db.relationship("Turno", back_populates="historial")
    receta = db.relationship("Receta", uselist=False, back_populates="historial")

    def __init__(self, paciente_id, turno_id):
        self.paciente_id = paciente_id
        self.turno_id = turno_id
