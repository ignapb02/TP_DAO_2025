from backend.repositories.historial_clinico_repository import HistorialClinicoRepository

class HistorialService:

    @staticmethod
    def crear_historial(paciente_id, turno_id):
        return HistorialClinicoRepository.crear(paciente_id, turno_id)

    @staticmethod
    def obtener_historial_paciente(id_paciente):
        return HistorialClinicoRepository.obtener_por_paciente(id_paciente)
