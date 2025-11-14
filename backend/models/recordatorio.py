from backend.database.db import db

class Recordatorio(db.Model):
    __tablename__ = "recordatorios"

    id_recordatorio = db.Column(db.Integer, primary_key=True)
    turno_id = db.Column(db.Integer, db.ForeignKey("turnos.id_turno"), nullable=False)

    turno = db.relationship("Turno", back_populates="recordatorio")

    def __init__(self, turno_id):
        self.turno_id = turno_id
