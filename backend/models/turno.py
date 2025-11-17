from backend.database.db import db
from backend.models.validators import validate_required_int, validate_required_str, validate_optional_str

class Turno(db.Model):
    __tablename__ = "turnos"

    id_turno = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey("pacientes.id_paciente"), nullable=False)
    medico_id = db.Column(db.Integer, db.ForeignKey("medicos.id_medico"), nullable=False)
    especialidad_id = db.Column(db.Integer, db.ForeignKey("especialidades.id_especialidad"), nullable=False)

    fecha = db.Column(db.String(20), nullable=False)
    hora = db.Column(db.String(10), nullable=False)
    duracion_minutos = db.Column(db.Integer, default=30)  # Duración en minutos
    estado = db.Column(db.String(20), default="pendiente")

    paciente = db.relationship("Paciente", back_populates="turnos")
    medico = db.relationship("Medico", back_populates="turnos")
    especialidad = db.relationship("Especialidad")

    historial = db.relationship("HistorialClinico", uselist=False, back_populates="turno")
    recordatorio = db.relationship("Recordatorio", uselist=False, back_populates="turno")

    def __init__(self, paciente_id, medico_id, especialidad_id, fecha, hora, duracion_minutos=30, estado="pendiente"):
        self.paciente_id = validate_required_int(paciente_id, name='paciente_id', min_value=1)
        self.medico_id = validate_required_int(medico_id, name='medico_id', min_value=1)
        self.especialidad_id = validate_required_int(especialidad_id, name='especialidad_id', min_value=1)
        self.fecha = validate_required_str(fecha, 'fecha', max_len=20)
        self.hora = validate_required_str(hora, 'hora', max_len=10)
        self.duracion_minutos = validate_required_int(duracion_minutos, name='duracion_minutos', min_value=1)
        self.estado = validate_optional_str(estado, 'estado', max_len=20) or "pendiente"

    def to_dict(self):
        return {
            "id_turno": self.id_turno,
            "paciente_id": self.paciente_id,
            "medico_id": self.medico_id,
            "especialidad_id": self.especialidad_id,
            "fecha": self.fecha,
            "hora": self.hora,
            "duracion_minutos": self.duracion_minutos,
            "estado": self.estado,
            # Datos del paciente
            "paciente_nombre": self.paciente.nombre if self.paciente else None,
            "paciente_apellido": self.paciente.apellido if self.paciente else None,
            # Datos de la especialidad
            "especialidad_nombre": self.especialidad.nombre if self.especialidad else None,
            # Datos del médico (opcional, por si se necesita)
            "medico_nombre": self.medico.nombre if self.medico else None,
            "medico_apellido": self.medico.apellido if self.medico else None
        }
