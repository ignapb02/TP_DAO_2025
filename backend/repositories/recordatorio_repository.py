from backend.database.db import db
from backend.models.recordatorio import Recordatorio
from datetime import datetime, timedelta
from sqlalchemy import and_

class RecordatorioRepository:

    @staticmethod
    def crear(turno_id, horas_anticipacion=24, activo=True):
        recordatorio = Recordatorio(turno_id, horas_anticipacion, activo)
        db.session.add(recordatorio)
        db.session.commit()
        return recordatorio

    @staticmethod
    def obtener_por_turno(turno_id):
        return Recordatorio.query.filter_by(turno_id=turno_id).first()

    @staticmethod
    def obtener_por_id(id_recordatorio):
        return Recordatorio.query.get(id_recordatorio)

    @staticmethod
    def obtener_todos():
        return Recordatorio.query.all()

    @staticmethod
    def obtener_pendientes_envio():
        """Obtener recordatorios que deben enviarse ahora"""
        from backend.models.turno import Turno
        from backend.models.paciente import Paciente
        from backend.models.medico import Medico
        from backend.models.especialidad import Especialidad
        
        ahora = datetime.now()
        
        # Buscar recordatorios activos no enviados con turnos próximos
        query = db.session.query(Recordatorio, Turno, Paciente, Medico, Especialidad).join(
            Turno, Recordatorio.turno_id == Turno.id_turno
        ).join(
            Paciente, Turno.paciente_id == Paciente.id_paciente
        ).join(
            Medico, Turno.medico_id == Medico.id_medico
        ).join(
            Especialidad, Turno.especialidad_id == Especialidad.id_especialidad
        ).filter(
            and_(
                Recordatorio.activo == True,
                Recordatorio.email_enviado == False,
                Turno.estado == 'pendiente'  # Solo turnos pendientes
            )
        )
        
        resultados = []
        for recordatorio, turno, paciente, medico, especialidad in query.all():
            # Calcular momento de envío basado en fecha/hora del turno
            try:
                # Parsear fecha y hora del turno
                fecha_turno = datetime.strptime(f"{turno.fecha} {turno.hora}", "%Y-%m-%d %H:%M")
                momento_envio = fecha_turno - timedelta(hours=recordatorio.horas_anticipacion)
                
                # Si ya es momento de enviar
                if ahora >= momento_envio:
                    resultados.append({
                        'recordatorio': recordatorio,
                        'turno': turno,
                        'paciente': paciente,
                        'medico': medico,
                        'especialidad': especialidad
                    })
            except ValueError as e:
                print(f"Error parseando fecha/hora del turno {turno.id_turno}: {e}")
                continue
        
        return resultados

    @staticmethod
    def marcar_como_enviado(id_recordatorio):
        """Marcar recordatorio como enviado"""
        recordatorio = RecordatorioRepository.obtener_por_id(id_recordatorio)
        if recordatorio:
            recordatorio.email_enviado = True
            recordatorio.fecha_envio = datetime.now()
            db.session.commit()
            return recordatorio
        return None

    @staticmethod
    def eliminar(id_recordatorio):
        recordatorio = Recordatorio.query.get(id_recordatorio)
        if not recordatorio:
            return False
        db.session.delete(recordatorio)
        db.session.commit()
        return True
