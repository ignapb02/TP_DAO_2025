from backend.database.db import db

class Receta(db.Model):
    __tablename__ = "recetas"

    id_receta = db.Column(db.Integer, primary_key=True)
    historial_id = db.Column(db.Integer, db.ForeignKey("historiales_clinicos.id_historial"), nullable=False)

    historial = db.relationship("HistorialClinico", back_populates="receta")

    def __init__(self, historial_id):
        self.historial_id = historial_id

    def to_dict(self):
        return {
            "id_receta": self.id_receta,
            "historial_id": self.historial_id
        }
