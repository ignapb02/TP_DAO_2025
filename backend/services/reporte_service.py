from sqlalchemy import func
from backend.database.db import db
from backend.models.turno import Turno
from backend.models.paciente import Paciente
from backend.models.especialidad import Especialidad


class ReporteService:

    @staticmethod
    def _apply_fecha_filters(query, desde=None, hasta=None):
        if desde:
            query = query.filter(Turno.fecha >= desde)
        if hasta:
            query = query.filter(Turno.fecha <= hasta)
        return query

    @staticmethod
    def turnos_por_medico(medico_id, desde=None, hasta=None):
        q = db.session.query(Turno).filter(Turno.medico_id == medico_id)
        q = ReporteService._apply_fecha_filters(q, desde, hasta)
        return [t.to_dict() for t in q.order_by(Turno.fecha.asc(), Turno.hora.asc()).all()]

    @staticmethod
    def cantidad_turnos_por_especialidad(desde=None, hasta=None):
        q = db.session.query(Turno.especialidad_id, func.count(Turno.id_turno))
        q = ReporteService._apply_fecha_filters(q, desde, hasta)
        q = q.group_by(Turno.especialidad_id)
        rows = q.all()

        # Obtener nombres de especialidad
        ids = [eid for (eid, _) in rows if eid is not None]
        nombres = {}
        if ids:
            for esp in db.session.query(Especialidad).filter(Especialidad.id_especialidad.in_(ids)).all():
                nombres[esp.id_especialidad] = esp.nombre

        return [
            {
                "especialidad_id": eid,
                "especialidad_nombre": nombres.get(eid, "Desconocida"),
                "cantidad": cnt,
            }
            for (eid, cnt) in rows
        ]

    @staticmethod
    def pacientes_atendidos(desde=None, hasta=None):
        # Turnos completados en rango -> pacientes únicos
        q = db.session.query(Turno.paciente_id).filter(Turno.estado == "completado")
        q = ReporteService._apply_fecha_filters(q, desde, hasta)
        paciente_ids = {pid for (pid,) in q.all() if pid is not None}

        if not paciente_ids:
            return {"total": 0, "pacientes": []}

        pacientes = db.session.query(Paciente).filter(Paciente.id_paciente.in_(list(paciente_ids))).all()
        return {
            "total": len(pacientes),
            "pacientes": [
                {
                    "id_paciente": p.id_paciente,
                    "nombre": p.nombre,
                    "apellido": p.apellido,
                    "dni": p.dni,
                    "email": p.email,
                    "telefono": p.telefono,
                }
                for p in pacientes
            ],
        }

    @staticmethod
    def asistencia_vs_inasistencias(desde=None, hasta=None):
        q = db.session.query(Turno.estado, func.count(Turno.id_turno))
        q = ReporteService._apply_fecha_filters(q, desde, hasta)
        q = q.group_by(Turno.estado)
        data = {estado: cnt for (estado, cnt) in q.all()}

        # Convenciones: asistencia = completado, inasistencia = cancelado
        asistencias = data.get("completado", 0)
        inasistencias = data.get("cancelado", 0)
        pendientes = data.get("pendiente", 0)
        return {
            "asistencias": asistencias,
            "inasistencias": inasistencias,
            "pendientes": pendientes,
            "total": asistencias + inasistencias + pendientes,
        }
