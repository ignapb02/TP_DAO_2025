from backend.repositories.historial_clinico_repository import HistorialClinicoRepository

class HistorialService:

    @staticmethod
    def crear_historial(paciente_id, turno_id, diagnostico=None, tratamiento=None, observaciones=None, fecha_atencion=None):
        return HistorialClinicoRepository.crear(paciente_id, turno_id, diagnostico, tratamiento, observaciones, fecha_atencion)

    @staticmethod
    def obtener_todos():
        return HistorialClinicoRepository.obtener_todos()

    @staticmethod
    def obtener_historial_paciente(id_paciente):
        return HistorialClinicoRepository.obtener_por_paciente(id_paciente)
