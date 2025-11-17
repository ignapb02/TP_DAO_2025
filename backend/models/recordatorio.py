from backend.database.db import db
from backend.models.validators import validate_required_int

class Recordatorio(db.Model):
    __tablename__ = "recordatorios"

    id_recordatorio = db.Column(db.Integer, primary_key=True)
    turno_id = db.Column(db.Integer, db.ForeignKey("turnos.id_turno"), nullable=False)

    turno = db.relationship("Turno", back_populates="recordatorio")

    def __init__(self, turno_id):
        self.turno_id = validate_required_int(turno_id, name='turno_id', min_value=1)

    def to_dict(self):
        return {
            "id_recordatorio": self.id_recordatorio,
            "turno_id": self.turno_id
        }
