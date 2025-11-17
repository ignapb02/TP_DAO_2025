from backend.database.db import db
from datetime import datetime

class Receta(db.Model):
    __tablename__ = "recetas"

    id_receta = db.Column(db.Integer, primary_key=True)
    historial_id = db.Column(db.Integer, db.ForeignKey("historiales_clinicos.id_historial"), nullable=False)
    medicamentos = db.Column(db.Text, nullable=True)
    indicaciones = db.Column(db.Text, nullable=True)
    fecha_emision = db.Column(db.DateTime, nullable=True)

    historial = db.relationship("HistorialClinico", back_populates="receta")

    def __init__(self, historial_id, medicamentos=None, indicaciones=None, fecha_emision=None):
        self.historial_id = historial_id
        self.medicamentos = medicamentos
        self.indicaciones = indicaciones
        self.fecha_emision = fecha_emision or datetime.now()

    def to_dict(self):
        return {
            "id_receta": self.id_receta,
            "historial_id": self.historial_id,
            "medicamentos": self.medicamentos,
            "indicaciones": self.indicaciones,
            "fecha_emision": self.fecha_emision.isoformat() if self.fecha_emision else None
        }
