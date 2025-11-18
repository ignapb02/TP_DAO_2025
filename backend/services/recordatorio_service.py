from backend.repositories.recordatorio_repository import RecordatorioRepository
from backend.services.email_service import EmailService
from datetime import datetime

class RecordatorioService:

    @staticmethod
    def crear_recordatorio(turno_id, horas_anticipacion=24, activo=True):
        """Crear recordatorio para un turno"""
        # Verificar si ya existe un recordatorio para este turno
        existente = RecordatorioRepository.obtener_por_turno(turno_id)
        if existente:
            raise ValueError("Ya existe un recordatorio para este turno")
        
        return RecordatorioRepository.crear(turno_id, horas_anticipacion, activo)

    @staticmethod
    def obtener_todos():
        return RecordatorioRepository.obtener_todos()

    @staticmethod
    def obtener_recordatorio(id_recordatorio):
        recordatorio = RecordatorioRepository.obtener_por_id(id_recordatorio)
        if not recordatorio:
            raise ValueError("Recordatorio no encontrado.")
        return recordatorio

    @staticmethod
    def procesar_recordatorios_pendientes():
        """Procesar y enviar todos los recordatorios que estén listos"""
        pendientes = RecordatorioRepository.obtener_pendientes_envio()
        
        enviados = 0
        errores = 0
        
        for item in pendientes:
            recordatorio = item['recordatorio']
            turno = item['turno']
            paciente = item['paciente']
            medico = item['medico']
            especialidad = item['especialidad']
            
            try:
                # Intentar enviar email
                EmailService.enviar_recordatorio_turno(turno, paciente, medico, especialidad)
                
                # Marcar como enviado
                RecordatorioRepository.marcar_como_enviado(recordatorio.id_recordatorio)
                enviados += 1
                
                print(f"✅ Recordatorio enviado: Turno {turno.id_turno} - {paciente.email}")
                
            except Exception as e:
                errores += 1
                print(f"❌ Error enviando recordatorio turno {turno.id_turno}: {str(e)}")
        
        return {
            "procesados": len(pendientes),
            "enviados": enviados,
            "errores": errores,
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    def crear_recordatorio_automatico_para_turno(turno_id, horas_anticipacion=24):
        """Crear recordatorio automático al crear un turno"""
        try:
            return RecordatorioService.crear_recordatorio(turno_id, horas_anticipacion, True)
        except ValueError:
            # Si ya existe, no hacer nada
            return None
