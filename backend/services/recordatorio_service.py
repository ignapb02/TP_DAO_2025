from backend.repositories.recordatorio_repository import RecordatorioRepository

class RecordatorioService:

    @staticmethod
    def crear_recordatorio(turno_id):
        return RecordatorioRepository.crear(turno_id)
