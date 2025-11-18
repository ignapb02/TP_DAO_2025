from backend.database.db import db
from backend.models.validators import validate_required_int
from datetime import datetime, timedelta

class Recordatorio(db.Model):
    __tablename__ = "recordatorios"

    id_recordatorio = db.Column(db.Integer, primary_key=True)
    turno_id = db.Column(db.Integer, db.ForeignKey("turnos.id_turno"), nullable=False)
    horas_anticipacion = db.Column(db.Integer, default=24)  # Horas antes del turno
    email_enviado = db.Column(db.Boolean, default=False)
    fecha_envio = db.Column(db.DateTime, nullable=True)
    activo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    turno = db.relationship("Turno", back_populates="recordatorio")

    def __init__(self, turno_id, horas_anticipacion=24, activo=True):
        self.turno_id = validate_required_int(turno_id, name='turno_id', min_value=1)
        self.horas_anticipacion = horas_anticipacion
        self.activo = activo
        self.email_enviado = False
        self.created_at = datetime.now()

    def to_dict(self):
        return {
            "id_recordatorio": self.id_recordatorio,
            "turno_id": self.turno_id,
            "horas_anticipacion": self.horas_anticipacion,
            "email_enviado": self.email_enviado,
            "fecha_envio": self.fecha_envio.isoformat() if self.fecha_envio else None,
            "activo": self.activo,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
