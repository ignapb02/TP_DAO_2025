from backend.repositories.receta_repository import RecetaRepository

class RecetaService:

    @staticmethod
    def crear_receta(historial_id, medicamentos=None, indicaciones=None, fecha_emision=None):
        return RecetaRepository.crear(historial_id, medicamentos, indicaciones, fecha_emision)

    @staticmethod
    def obtener_todas():
        return RecetaRepository.obtener_todos()

    @staticmethod
    def obtener_receta(id_receta):
        receta = RecetaRepository.obtener_por_id(id_receta)
        if not receta:
            raise ValueError("Receta no encontrada.")
        return receta
