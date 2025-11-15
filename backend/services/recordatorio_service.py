from backend.repositories.recordatorio_repository import RecordatorioRepository

class RecordatorioService:

    @staticmethod
    def crear_recordatorio(turno_id):
        return RecordatorioRepository.crear(turno_id)

    @staticmethod
    def obtener_todos():
        return RecordatorioRepository.obtener_todos()

    @staticmethod
    def obtener_recordatorio(id_recordatorio):
        recordatorio = RecordatorioRepository.obtener_por_id(id_recordatorio)
        if not recordatorio:
            raise ValueError("Recordatorio no encontrado.")
        return recordatorio
